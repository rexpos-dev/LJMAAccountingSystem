import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Routes that do NOT require a valid session
const PUBLIC_ROUTES = [
    '/login',
    '/api/auth/login',
    '/api/auth/session',
    '/api/auth/logout',
    '/api/auth/contact-request',
    // POS machine integrations — authenticated by the machine itself, not a user session
    '/api/webhooks/',
    '/api/sync/pos/',
    '/api/web-access/machines/',
];

function isPublic(pathname: string): boolean {
    return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isApiRoute = pathname.startsWith('/api/');

    if (isPublic(pathname)) return NextResponse.next();

    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
        if (isApiRoute) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        const secret = process.env.JWT_SECRET_KEY;
        if (!secret) throw new Error('JWT_SECRET_KEY not configured');
        const key = new TextEncoder().encode(secret);
        await jwtVerify(token, key);
        return NextResponse.next();
    } catch {
        if (isApiRoute) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('auth_token');
        return response;
    }
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.ico).*)',
    ],
};
