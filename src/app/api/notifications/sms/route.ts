import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-server';
import { sendSMS, SmsTemplate } from '@/lib/sms';
import { prisma } from '@/lib/prisma';

// POST /api/notifications/sms
// Body: { to, template, data }
export async function POST(request: NextRequest) {
    const session = await getSession() as any;
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { to, template, data } = await request.json();
    if (!to || !template) {
        return NextResponse.json({ error: 'to and template are required' }, { status: 400 });
    }

    let companyName = 'LJMA';
    try {
        const profile = await prisma.businessProfile.findFirst();
        if (profile?.businessName) companyName = profile.businessName;
    } catch { /* non-fatal */ }

    const success = await sendSMS({ to, template: template as SmsTemplate, data: data ?? {}, companyName });
    return NextResponse.json({ success, to, template });
}
