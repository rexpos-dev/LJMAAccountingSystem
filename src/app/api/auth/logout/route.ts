import { NextResponse } from 'next/server';
import { clearSession } from '@/lib/auth-server';

export async function POST() {
    try {
        await clearSession();
        return NextResponse.json({ message: 'Logged out successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
