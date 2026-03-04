import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch all user permissions
export async function GET(request: Request) {
  try {
    const userPermissions = await prisma.userPermission.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(userPermissions);
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    return NextResponse.json({ error: 'Failed to fetch user permissions' }, { status: 500 });
  }
}

// POST - Create a new user permission
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { username, firstName, lastName, designation, contactNo, accountType, formPermissions, password, permissions } = body;

    if (!username || !firstName || !lastName || !accountType || permissions === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newUserPermission = await prisma.userPermission.create({
      data: {
        username,
        firstName,
        lastName,
        designation: designation || null,
        contactNo: contactNo || null,
        accountType,
        formPermissions: formPermissions || null,
        password: password || null,
        permissions: JSON.stringify(permissions),
      },
    });

    return NextResponse.json(newUserPermission, { status: 201 });
  } catch (error) {
    console.error('Error creating user permission:', error);

    // Check if it's a unique constraint error
    if (error instanceof Error && error.message.includes('username')) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
    }

    return NextResponse.json({ error: 'Failed to create user permission' }, { status: 500 });
  }
}

// PUT - Update a user permission
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const { id, username, firstName, lastName, designation, contactNo, accountType, formPermissions, password, permissions, isActive } = body;

    if (!id || !username || !firstName || !lastName || !accountType || permissions === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updatedUserPermission = await prisma.userPermission.update({
      where: { id },
      data: {
        username,
        firstName,
        lastName,
        designation: designation || null,
        contactNo: contactNo || null,
        accountType,
        formPermissions: formPermissions || null,
        password: password !== undefined ? password : undefined,
        permissions: JSON.stringify(permissions),
        isActive,
      },
    });

    return NextResponse.json(updatedUserPermission);
  } catch (error) {
    console.error('Error updating user permission:', error);
    return NextResponse.json({ error: 'Failed to update user permission' }, { status: 500 });
  }
}

// DELETE - Delete a user permission
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await prisma.userPermission.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'User permission deleted successfully' });
  } catch (error) {
    console.error('Error deleting user permission:', error);
    return NextResponse.json({ error: 'Failed to delete user permission' }, { status: 500 });
  }
}