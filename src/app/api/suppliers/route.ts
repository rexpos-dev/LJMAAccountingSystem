import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const suppliers = await prisma.supplier.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(suppliers);
  } catch (error: any) {
    console.error('Error fetching suppliers:', error);
    return NextResponse.json({ error: 'Failed to fetch suppliers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name, contactPerson, contactFirstName, email, phone,
      phoneAlternative, fax, address, paymentTerms,
      paymentTermsValue, vatInfo, isTaxExempt, additionalInfo
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Supplier name is required' }, { status: 400 });
    }

    const supplier = await prisma.supplier.create({
      data: {
        name: name.trim(),
        contactPerson: contactPerson?.trim() || null,
        contactFirstName: contactFirstName?.trim() || null,
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        phoneAlternative: phoneAlternative?.trim() || null,
        fax: fax?.trim() || null,
        address: address?.trim() || null,
        paymentTerms: paymentTerms?.trim() || null,
        paymentTermsValue: paymentTermsValue?.trim() || null,
        vatInfo: vatInfo?.trim() || null,
        isTaxExempt: Boolean(isTaxExempt),
        additionalInfo: additionalInfo?.trim() || null,
      },
    });

    return NextResponse.json(supplier, { status: 201 });
  } catch (error: any) {
    console.error('Error creating supplier:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Supplier already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create supplier' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id, name, contactPerson, contactFirstName, email, phone,
      phoneAlternative, fax, address, paymentTerms,
      paymentTermsValue, vatInfo, isTaxExempt, additionalInfo, isActive
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Supplier ID is required' }, { status: 400 });
    }

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Supplier name is required' }, { status: 400 });
    }

    const updateData: any = {
      name: name.trim(),
      isTaxExempt: isTaxExempt !== undefined ? Boolean(isTaxExempt) : undefined,
    };

    const optionalFields = [
      'contactPerson', 'contactFirstName', 'email', 'phone',
      'phoneAlternative', 'fax', 'address', 'paymentTerms',
      'paymentTermsValue', 'vatInfo', 'additionalInfo'
    ];

    optionalFields.forEach(field => {
      if (body[field] !== undefined) {
        updateData[field] = body[field]?.trim() || null;
      }
    });

    if (isActive !== undefined) {
      updateData.isActive = Boolean(isActive);
    }

    const supplier = await prisma.supplier.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(supplier);
  } catch (error: any) {
    console.error('Error updating supplier:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Supplier not found' }, { status: 404 });
    }
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Supplier name already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update supplier' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Supplier ID is required' }, { status: 400 });
    }

    await prisma.supplier.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Supplier deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting supplier:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Supplier not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete supplier' }, { status: 500 });
  }
}
