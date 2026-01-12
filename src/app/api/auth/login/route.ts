import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
        }

        // Find user in the user_permission table
        console.log(`Attempting login for: ${username}`);
        const user = await prisma.userPermission.findUnique({
            where: { username },
        });

        if (!user) {
            console.log('User not found in database.');
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        console.log('User found, verifying password...');
        // Check password (plain text for now as requested/implied by existing schema, 
        // but ideally should be hashed)
        if (user.password !== password) {
            console.log('Password mismatch.');
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        if (!user.isActive) {
            console.log('User account is inactive.');
            return NextResponse.json({ error: 'Account is inactive' }, { status: 403 });
        }

        console.log('Login successful.');

        // Return user data (excluding password)
        const { password: _, ...userWithoutPassword } = user;

        // In a real app, you'd set a session cookie here. 
        // For this migration, we'll return the user object to be stored in context.

        return NextResponse.json({
            user: userWithoutPassword,
            message: 'Login successful'
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
