import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';

const SUPER_ADMIN_ROLES = ['Super Admin', 'Administrator', 'Admin'];

export async function POST(request: Request) {
    // Caller must already have a valid session
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { username, password } = await request.json();

    if (!username || !password) {
        return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const user = await prisma.userPermission.findUnique({ where: { username } });

    if (!user || !user.isActive || !user.password) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (!SUPER_ADMIN_ROLES.includes(user.accountType ?? '')) {
        return NextResponse.json({ error: 'This account does not have Super Admin privileges' }, { status: 403 });
    }

    let valid = false;
    if (user.password.startsWith('$2')) {
        valid = await bcrypt.compare(password, user.password);
    } else {
        valid = user.password === password;
        if (valid) {
            // Opportunistically upgrade plaintext to hash
            const hashed = await bcrypt.hash(password, 12);
            await prisma.userPermission.update({ where: { username }, data: { password: hashed } });
        }
    }

    if (!valid) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    return NextResponse.json({ success: true, verifiedBy: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.username });
}
