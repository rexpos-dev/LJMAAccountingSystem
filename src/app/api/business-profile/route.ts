import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const profile = await prisma.businessProfile.findFirst();
        return NextResponse.json(profile || {});
    } catch (error) {
        console.error('Error fetching business profile:', error);
        return NextResponse.json(
            { error: 'Failed to fetch business profile' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, ...updateData } = body;

        console.log('📝 [API] POST /api/business-profile received data:', JSON.stringify(updateData, null, 2));

        // Use upsert to ensure only one profile exists or update the existing one
        // Since we want a single profile, we can try to find the first one and update it,
        // or create if none exists.

        const existingProfile = await prisma.businessProfile.findFirst();
        console.log('🔎 [API] Existing profile:', existingProfile);

        let result;
        if (existingProfile) {
            console.log('🔄 [API] Updating existing profile with ID:', existingProfile.id);
            result = await prisma.businessProfile.update({
                where: { id: existingProfile.id },
                data: updateData,
            });
        } else {
            console.log('🆕 [API] Creating new profile');
            result = await prisma.businessProfile.create({
                data: updateData,
            });
        }

        console.log('✅ [API] Save successful:', result);
        return NextResponse.json(result);
    } catch (error: any) {
        console.error('❌ [API] Error saving business profile:', error);
        console.error(JSON.stringify(error, null, 2));
        return NextResponse.json(
            { error: 'Failed to save business profile', details: error.message },
            { status: 500 }
        );
    }
}
