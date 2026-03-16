import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch all employees
export async function GET(request: Request) {
    try {
        const employees = await prisma.employee.findMany({
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
    }
}

// POST - Create a new employee
export async function POST(request: Request) {
    try {
        const body = await request.json();

        const { employeeId, firstName, lastName, designation, branchesAssigned, status } = body;

        if (!employeeId || !firstName || !lastName) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newEmployee = await prisma.employee.create({
            data: {
                employeeId,
                firstName,
                lastName,
                designation: designation || null,
                branchesAssigned: branchesAssigned || null,
                status: status || 'Active',
            },
        });

        return NextResponse.json(newEmployee, { status: 201 });
    } catch (error) {
        console.error('Error creating employee:', error);

        // Check if it's a unique constraint error
        if (error instanceof Error && error.message.includes('employeeId')) {
            return NextResponse.json({ error: 'Employee ID already exists' }, { status: 400 });
        }

        return NextResponse.json({ error: 'Failed to create employee' }, { status: 500 });
    }
}

// PUT - Update an employee
export async function PUT(request: Request) {
    try {
        const body = await request.json();

        const { id, employeeId, firstName, lastName, designation, branchesAssigned, status } = body;

        if (!id || !employeeId || !firstName || !lastName) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const updatedEmployee = await prisma.employee.update({
            where: { id },
            data: {
                employeeId,
                firstName,
                lastName,
                designation: designation || null,
                branchesAssigned: branchesAssigned || null,
                status: status || 'Active',
            },
        });

        return NextResponse.json(updatedEmployee);
    } catch (error) {
        console.error('Error updating employee:', error);
        return NextResponse.json({ error: 'Failed to update employee' }, { status: 500 });
    }
}

// DELETE - Delete an employee
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        await prisma.employee.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        console.error('Error deleting employee:', error);
        return NextResponse.json({ error: 'Failed to delete employee' }, { status: 500 });
    }
}
