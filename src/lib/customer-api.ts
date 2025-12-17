import { prisma } from '@/lib/prisma';

export interface Customer {
  id: string;
  code: string;
  customerName: string;
  contactFirstName: string | null;
  address: string | null;
  phonePrimary: string | null;
  phoneAlternative: string | null;
  email: string | null;
  isActive: boolean;
  creditLimit: number;
  isTaxExempt: boolean;
  paymentTerms: string;
  paymentTermsValue: string;
  salesperson: string | null;
  customerGroup: string;
  isEntitledToLoyaltyPoints: boolean;
  pointSetting: string | null;
  loyaltyCalculationMethod: string;
  loyaltyCardNumber: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerFilters {
  isActive?: boolean;
  customerGroup?: string;
  search?: string;
}

export interface PaginationOptions {
  limit?: number;
  offset?: number;
}

/**
 * Get all customers with optional filtering and pagination
 * This is an API-ready function that returns customer data as JSON
 */
export async function getCustomers(
  filters?: CustomerFilters,
  pagination?: PaginationOptions
): Promise<{ customers: Customer[]; total: number; success: boolean }> {
  try {
    // Build where conditions for Prisma
    const where: any = {};

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters?.customerGroup) {
      where.customerGroup = filters.customerGroup;
    }

    if (filters?.search) {
      where.OR = [
        { code: { contains: filters.search, mode: 'insensitive' } },
        { customerName: { contains: filters.search, mode: 'insensitive' } },
        { contactFirstName: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // Get total count
    const total = await prisma.customer.count({ where });

    // Get customers with pagination
    const customers = await prisma.customer.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: pagination?.offset || 0,
      take: pagination?.limit,
    });

    return {
      customers: customers as Customer[],
      total,
      success: true
    };
  } catch (error) {
    console.error('Error fetching customers:', error);
    return {
      customers: [],
      total: 0,
      success: false
    };
  }
}

/**
 * Get a single customer by ID
 */
export async function getCustomerById(id: string): Promise<Customer | null> {
  try {
    const customers = await prisma.$queryRaw`
      SELECT
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
        DATE_FORMAT(createdAt, '%Y-%m-%d %H:%i:%s') as createdAt,
        DATE_FORMAT(updatedAt, '%Y-%m-%d %H:%i:%s') as updatedAt
      FROM customer
      WHERE id = ${id}
    `;

    const customer = (customers as Customer[])[0];
    return customer || null;
  } catch (error) {
    console.error('Error fetching customer by ID:', error);
    throw new Error('Failed to fetch customer');
  }
}

/**
 * Create a new customer
 */
export async function createCustomer(customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
  try {
    // Validate required fields
    if (!customerData.code || !customerData.customerName) {
      throw new Error('Customer code and name are required');
    }

    const id = crypto.randomUUID();

    await prisma.$queryRaw`
      INSERT INTO customer (
        id, code, customerName, contactFirstName, address, phonePrimary, phoneAlternative,
        email, isActive, creditLimit, isTaxExempt, paymentTerms, paymentTermsValue,
        salesperson, customerGroup, isEntitledToLoyaltyPoints, pointSetting,
        loyaltyCalculationMethod, loyaltyCardNumber, createdAt, updatedAt
      ) VALUES (
        ${id},
        ${customerData.code.trim()},
        ${customerData.customerName.trim()},
        ${customerData.contactFirstName?.trim() || null},
        ${customerData.address?.trim() || null},
        ${customerData.phonePrimary?.trim() || null},
        ${customerData.phoneAlternative?.trim() || null},
        ${customerData.email?.trim() || null},
        ${customerData.isActive ?? true},
        ${customerData.creditLimit ? parseFloat(customerData.creditLimit.toString()) : 0},
        ${customerData.isTaxExempt ?? false},
        ${customerData.paymentTerms || 'days'},
        ${customerData.paymentTermsValue || '30'},
        ${customerData.salesperson?.trim() || null},
        ${customerData.customerGroup || 'default'},
        ${customerData.isEntitledToLoyaltyPoints ?? false},
        ${customerData.pointSetting ? String(customerData.pointSetting).trim() : null},
        ${customerData.loyaltyCalculationMethod || 'automatic'},
        ${customerData.loyaltyCardNumber?.trim() || null},
        NOW(),
        NOW()
      )
    `;

    // Fetch the created customer
    const customer = await getCustomerById(id);
    if (!customer) {
      throw new Error('Failed to retrieve created customer');
    }

    return customer;
  } catch (error: any) {
    console.error('Error creating customer:', error);

    // Handle unique constraint violation
    if (error.code === 'ER_DUP_ENTRY' || error.message?.includes('Duplicate entry')) {
      throw new Error('A customer with this code already exists');
    }

    throw new Error(error.message || 'Failed to create customer');
  }
}

/**
 * Update an existing customer
 */
export async function updateCustomer(
  id: string,
  customerData: Partial<Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Customer> {
  try {
    // Check if customer exists
    const existingCustomer = await getCustomerById(id);
    if (!existingCustomer) {
      throw new Error('Customer not found');
    }

    // Build update query dynamically
    const updateFields = Object.entries(customerData)
      .filter(([key, value]) => value !== undefined)
      .map(([key, value]) => {
        if (typeof value === 'boolean') {
          return `${key} = ${value ? 1 : 0}`;
        }
        if (typeof value === 'number') {
          return `${key} = ${value}`;
        }
        return `${key} = '${String(value).trim()}'`;
      });

    if (updateFields.length === 0) {
      return existingCustomer;
    }

    updateFields.push("updatedAt = NOW()");

    await prisma.$queryRaw`
      UPDATE customer
      SET ${updateFields.join(', ')}
      WHERE id = ${id}
    `;

    // Fetch the updated customer
    const updatedCustomer = await getCustomerById(id);
    if (!updatedCustomer) {
      throw new Error('Failed to retrieve updated customer');
    }

    return updatedCustomer;
  } catch (error: any) {
    console.error('Error updating customer:', error);

    // Handle unique constraint violation
    if (error.code === 'ER_DUP_ENTRY' || error.message?.includes('Duplicate entry')) {
      throw new Error('A customer with this code already exists');
    }

    throw new Error(error.message || 'Failed to update customer');
  }
}

/**
 * Delete a customer
 */
export async function deleteCustomer(id: string): Promise<{ success: boolean; message: string }> {
  try {
    // Check if customer exists
    const existingCustomer = await getCustomerById(id);
    if (!existingCustomer) {
      throw new Error('Customer not found');
    }

    // Delete the customer
    await prisma.$queryRaw`
      DELETE FROM customer WHERE id = ${id}
    `;

    return {
      success: true,
      message: 'Customer deleted successfully'
    };
  } catch (error: any) {
    console.error('Error deleting customer:', error);
    throw new Error(error.message || 'Failed to delete customer');
  }
}

/**
 * Get customer statistics
 */
export async function getCustomerStats(): Promise<{
  total: number;
  active: number;
  inactive: number;
  groups: { group: string; count: number }[];
}> {
  try {
    const total = await prisma.customer.count();
    const active = await prisma.customer.count({ where: { isActive: true } });
    const inactive = await prisma.customer.count({ where: { isActive: false } });

    const groups = await prisma.$queryRaw`
      SELECT customerGroup as \`group\`, COUNT(*) as count
      FROM customer
      GROUP BY customerGroup
      ORDER BY count DESC
    `;

    return {
      total,
      active,
      inactive,
      groups: groups as { group: string; count: number }[]
    };
  } catch (error) {
    console.error('Error fetching customer stats:', error);
    throw new Error('Failed to fetch customer statistics');
  }
}
