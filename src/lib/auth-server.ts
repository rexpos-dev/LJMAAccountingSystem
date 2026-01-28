import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'default-secret-key-change-this-in-env';
const key = new TextEncoder().encode(SECRET_KEY);

const ALG = 'HS256';

export async function signToken(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: ALG })
        .setIssuedAt()
        .setExpirationTime('8h')
        .sign(key);
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, key, {
            algorithms: [ALG],
        });
        return payload;
    } catch (error) {
        return null;
    }
}

export async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) return null;
    return await verifyToken(token);
}

export async function setSession(user: any) {
    const token = await signToken(user);
    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 8 * 60 * 60, // 8 hours
        path: '/',
    });
}

export async function clearSession() {
    const cookieStore = await cookies();
    cookieStore.delete('auth_token');
}

export async function verifyAdmin() {
    const session = await getSession();
    if (!session) {
        console.log('verifyAdmin: No session found');
        return false;
    }
    const type = (session as any).accountType;
    if (type !== 'Administrator' && type !== 'Super Admin' && type !== 'Admin') {
        console.log(`verifyAdmin: Access denied for accountType: ${type}`);
        return false;
    }
    return true;
}

// Middleware Helper
export async function requireAdmin(request: NextRequest) {
    const session = await getSession();
    if (!session) {
        console.log('requireAdmin: No active session found. Cookies:', request.cookies.getAll().map(c => c.name));
        return NextResponse.json({ error: 'Unauthorized: No active session' }, { status: 401 });
    }

    const type = (session as any).accountType;
    if (type !== 'Administrator' && type !== 'Super Admin' && type !== 'Admin') {
        console.log(`requireAdmin: Access denied for accountType: ${type}`);
        return NextResponse.json({ error: `Unauthorized: Admin access required (User is ${type})` }, { status: 401 });
    }
    return null; // Passes check
}
