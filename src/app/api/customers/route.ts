import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Generate a unique EAN-13 loyalty card code
 * Format: 13 random digits (EAN-13 compliant)
 */
async function generateEN13Code(): Promise<string> {
  let code: string;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 10;

  do {
    // Generate 13 random digits
    const randomDigits = Array.from({ length: 13 }, () => Math.floor(Math.random() * 10)).join('');
    code = randomDigits;

    // Check if this code already exists
    try {
      const existing = await prisma.$queryRaw`
        SELECT id FROM customer WHERE loyaltyCardNumber = ${code} LIMIT 1
      `;

      if ((existing as any).length === 0) {
        isUnique = true;
      }
    } catch (error) {
      // If there's an error checking uniqueness, we'll try again
      console.warn('Error checking loyalty card code uniqueness:', error);
    }

    attempts++;
  } while (!isUnique && attempts < maxAttempts);

  if (!isUnique) {
    throw new Error('Unable to generate unique EAN-13 code after maximum attempts');
  }

  return code!;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit') || '10';
    const offsetParam = searchParams.get('offset') || '0';

    console.log('Starting to fetch customers from external API...');

    const limit = parseInt(limitParam);
    const offset = parseInt(offsetParam);
    const page = Math.floor(offset / limit) + 1;

    // Fetch from external API
    const externalUrl = new URL('http://192.168.1.163:3000/api/customers');
    externalUrl.searchParams.append('limit', limitParam);
    externalUrl.searchParams.append('page', page.toString());
    const search = searchParams.get('search');
    if (search) {
      externalUrl.searchParams.append('search', search);
    }

    const response = await fetch(externalUrl.toString(), {
      next: { revalidate: 0 } // Disable caching to get fresh data
    }).catch(() => null);

    if (!response || !response.ok) {
      console.warn(`External API returned ${response?.status}. Gracefully returning empty array.`);
      return NextResponse.json([]);
    }

    const externalData = await response.json();

    let rawData = [];
    if (Array.isArray(externalData)) {
      rawData = externalData;
    } else if (externalData && Array.isArray(externalData.data)) {
      rawData = externalData.data;
    }

    console.log(`Found ${rawData.length} customers from external API`);

    // Fetch local invoices mapping to these external customers
    const customerIds = rawData.map((c: any) => c.id);

    // We only need to fetch invoices if there are customers
    let localInvoices: any[] = [];
    if (customerIds.length > 0) {
      localInvoices = await prisma.invoice.findMany({
        where: {
          customerId: { in: customerIds }
        },
        select: {
          id: true,
          customerId: true,
          total: true,
          status: true,
        }
      });
    }

    // Map external data to our UI's expected format and calculate balances
    const mappedCustomers = rawData.map((item: any) => {
      // Find all invoices for this specific customer
      const customerInvoices = localInvoices.filter(inv => inv.customerId === item.id);

      const customerBalance = customerInvoices
        .filter(inv => inv.status !== 'Paid')
        .reduce((sum, inv) => sum + inv.total, 0);

      const customerPayment = customerInvoices
        .filter(inv => inv.status === 'Paid')
        .reduce((sum, inv) => sum + inv.total, 0);

      return {
        id: item.id,
        code: item.id, // Using id as fallback for code, since the UI expects code
        customerName: item.name || 'N/A',
        contactFirstName: null,
        address: item.address || item.billingAddress || null,
        phonePrimary: item.contactNumber || null,
        email: null,
        isActive: item.active === 1 || item.active === true,
        creditLimit: item.creditLimit ? parseFloat(item.creditLimit) : 0,
        loyaltyPointsBalance: item.loyaltyPoints ? parseFloat(item.loyaltyPoints) : 0,
        customerBalance,
        customerPayment,
        isTaxExempt: false,
        paymentTerms: item.paymentTerms || 'days',
        paymentTermsValue: '30',
        salesperson: item.salesPerson || null,
        customerGroup: item.salesGroup || 'default',
        isEntitledToLoyaltyPoints: true,
        pointSetting: null,
        loyaltyCalculationMethod: 'automatic',
        loyaltyCardNumber: null,
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: item.updatedAt || new Date().toISOString(),
      };
    });

    console.log('Successfully processed external customers with calculated balances');
    return NextResponse.json(mappedCustomers);
  } catch (error: any) {
    console.warn('❌ [API/Customers] Silent Fallback: Error fetching external customers:', error.message);

    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      code,
      customerName,
      contactFirstName,
      address,
      phonePrimary,
      phoneAlternative,
      email,
      isActive,
      creditLimit,
      isTaxExempt,
      paymentTerms,
      paymentTermsValue,
      salesperson,
      customerGroup,
      isEntitledToLoyaltyPoints,
      pointSetting,
      loyaltyCalculationMethod,
      loyaltyCardNumber,
    } = body;

    // Validate required fields
    if (!code || !customerName) {
      return NextResponse.json(
        { error: 'Customer code and name are required' },
        { status: 400 }
      );
    }

    // Generate EN13 code if customer is entitled to loyalty points and no card number provided
    let finalLoyaltyCardNumber = loyaltyCardNumber?.trim() || null;
    if (isEntitledToLoyaltyPoints && !finalLoyaltyCardNumber) {
      try {
        finalLoyaltyCardNumber = await generateEN13Code();
      } catch (error: any) {
        return NextResponse.json(
          { error: 'Failed to generate loyalty card code: ' + error.message },
          { status: 500 }
        );
      }
    }

    // Create customer record using raw SQL
    await prisma.$queryRaw`
      INSERT INTO customer (
        id, code, customerName, contactFirstName, address, phonePrimary, phoneAlternative,
        email, isActive, creditLimit, isTaxExempt, paymentTerms, paymentTermsValue,
        salesperson, customerGroup, isEntitledToLoyaltyPoints, pointSetting,
        loyaltyCalculationMethod, loyaltyCardNumber, createdAt, updatedAt
      ) VALUES (
        ${crypto.randomUUID()},
        ${code.trim()},
        ${customerName.trim()},
        ${contactFirstName?.trim() || null},
        ${address?.trim() || null},
        ${phonePrimary?.trim() || null},
        ${phoneAlternative?.trim() || null},
        ${email?.trim() || null},
        ${isActive ?? true},
        ${creditLimit ? parseFloat(creditLimit) : 0},
        ${isTaxExempt ?? false},
        ${paymentTerms || 'days'},
        ${paymentTermsValue || '30'},
        ${salesperson?.trim() || null},
        ${customerGroup || 'default'},
        ${isEntitledToLoyaltyPoints ?? false},
        ${pointSetting ? String(pointSetting).trim() : null},
        ${loyaltyCalculationMethod || 'automatic'},
        ${finalLoyaltyCardNumber},
        NOW(),
        NOW()
      )
    `;

    // Fetch the created customer
    const customer = await prisma.$queryRaw`
      SELECT * FROM customer WHERE code = ${code.trim()}
    `;

    return NextResponse.json((customer as any)[0], { status: 201 });
  } catch (error: any) {
    console.error('Error creating customer:', error);

    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A customer with this code already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to create customer',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      code,
      customerName,
      contactFirstName,
      address,
      phonePrimary,
      phoneAlternative,
      email,
      isActive,
      creditLimit,
      isTaxExempt,
      paymentTerms,
      paymentTermsValue,
      salesperson,
      customerGroup,
      isEntitledToLoyaltyPoints,
      pointSetting,
      loyaltyCalculationMethod,
      loyaltyCardNumber,
    } = body;

    // Validate required fields
    if (!id || !code || !customerName) {
      return NextResponse.json(
        { error: 'Customer ID, code and name are required' },
        { status: 400 }
      );
    }

    // Generate EN13 code if customer is entitled to loyalty points and no card number provided
    let finalLoyaltyCardNumber = loyaltyCardNumber?.trim() || null;
    if (isEntitledToLoyaltyPoints && !finalLoyaltyCardNumber) {
      try {
        finalLoyaltyCardNumber = await generateEN13Code();
      } catch (error: any) {
        return NextResponse.json(
          { error: 'Failed to generate loyalty card code: ' + error.message },
          { status: 500 }
        );
      }
    }

    // Update customer record using raw SQL
    await prisma.$queryRaw`
      UPDATE customer SET
        code = ${code.trim()},
        customerName = ${customerName.trim()},
        contactFirstName = ${contactFirstName?.trim() || null},
        address = ${address?.trim() || null},
        phonePrimary = ${phonePrimary?.trim() || null},
        phoneAlternative = ${phoneAlternative?.trim() || null},
        email = ${email?.trim() || null},
        isActive = ${isActive ?? true},
        creditLimit = ${creditLimit ? parseFloat(creditLimit) : 0},
        isTaxExempt = ${isTaxExempt ?? false},
        paymentTerms = ${paymentTerms || 'days'},
        paymentTermsValue = ${paymentTermsValue || '30'},
        salesperson = ${salesperson?.trim() || null},
        customerGroup = ${customerGroup || 'default'},
        isEntitledToLoyaltyPoints = ${isEntitledToLoyaltyPoints ?? false},
        pointSetting = ${pointSetting ? String(pointSetting).trim() : null},
        loyaltyCalculationMethod = ${loyaltyCalculationMethod || 'automatic'},
        loyaltyCardNumber = ${finalLoyaltyCardNumber},
        updatedAt = NOW()
      WHERE id = ${id}
    `;

    // Fetch the updated customer
    const customer = await prisma.$queryRaw`
      SELECT * FROM customer WHERE id = ${id}
    `;

    if ((customer as any).length === 0) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json((customer as any)[0]);
  } catch (error: any) {
    console.error('Error updating customer:', error);

    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A customer with this code already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to update customer',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    // Check if customer exists
    const existingCustomer = await prisma.$queryRaw`
      SELECT id FROM customer WHERE id = ${id}
    `;

    if ((existingCustomer as any).length === 0) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Delete customer record using raw SQL
    await prisma.$queryRaw`
      DELETE FROM customer WHERE id = ${id}
    `;

    return NextResponse.json({ message: 'Customer deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete customer',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
