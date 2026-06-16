import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-server';
import { suggestExpenseAccount } from '@/lib/ai-engine';

// POST /api/ai/categorize
// Body: { description } or { descriptions: string[] }
// Returns suggested account number + name for expense categorization
export async function POST(request: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();

    if (body.descriptions && Array.isArray(body.descriptions)) {
        const results = body.descriptions.map((desc: string) => ({
            description: desc,
            suggestion: suggestExpenseAccount(desc),
        }));
        return NextResponse.json(results);
    }

    const suggestion = suggestExpenseAccount(body.description ?? '');
    return NextResponse.json({ description: body.description, suggestion });
}
