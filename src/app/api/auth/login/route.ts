import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { setSession } from '@/lib/auth-server';

// In-memory rate limiter: max 5 attempts per IP per 15 minutes
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function getClientIp(request: Request): string {
    const forwarded = (request as any).headers?.get?.('x-forwarded-for');
    return forwarded ? forwarded.split(',')[0].trim() : 'unknown';
}

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const record = loginAttempts.get(ip);

    if (!record || now > record.resetAt) {
        loginAttempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
        return false;
    }

    record.count += 1;

    if (record.count > 5) return true;

    return false;
}

function clearAttempts(ip: string) {
    loginAttempts.delete(ip);
}

export async function POST(request: Request) {
    const ip = getClientIp(request);

    if (isRateLimited(ip)) {
        return NextResponse.json(
            { error: 'Too many login attempts. Try again in 15 minutes.' },
            { status: 429 }
        );
    }

    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { error: 'Username and password are required' },
                { status: 400 }
            );
        }

        const user = await prisma.userPermission.findUnique({ where: { username } });

        if (!user || !user.isActive || !user.password) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Support both bcrypt hashes and legacy plaintext passwords.
        // On a successful plaintext match, the password is re-hashed and saved
        // so the account migrates automatically on first login.
        let passwordValid = false;

        if (user.password.startsWith('$2')) {
            // Already a bcrypt hash
            passwordValid = await bcrypt.compare(password, user.password);
        } else {
            // Legacy plaintext — compare then upgrade
            if (user.password === password) {
                passwordValid = true;
                const hashed = await bcrypt.hash(password, 12);
                await prisma.userPermission.update({
                    where: { username },
                    data: { password: hashed },
                });
            }
        }

        if (!passwordValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        clearAttempts(ip);

        const { password: _, ...userWithoutPassword } = user;
        await setSession(userWithoutPassword);

        return NextResponse.json({ user: userWithoutPassword, message: 'Login successful' });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
