import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';
import { getRolePermissions, ALL_MODULES } from '@/lib/rbac';

// GET /api/rbac?role=Treasurer
export async function GET(request: NextRequest) {
    const session = await getSession() as any;
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const role = request.nextUrl.searchParams.get('role') ?? session.accountType;
    const permissions = await getRolePermissions(role);

    return NextResponse.json({ role, permissions, modules: ALL_MODULES });
}

// POST /api/rbac — upsert permission for a role+module
export async function POST(request: NextRequest) {
    const session = await getSession() as any;
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Only Super Admin can change permissions
    const adminRoles = ['Super Admin', 'Administrator', 'Admin'];
    if (!adminRoles.includes(session.accountType ?? '')) {
        return NextResponse.json({ error: 'Only Super Admin can manage permissions' }, { status: 403 });
    }

    const body = await request.json();
    // body: { role, module, canView, canCreate, canEdit, canDelete, canPost, canApprove }
    // or body: [{ role, module, ...flags }] for bulk upsert

    const items = Array.isArray(body) ? body : [body];
    const results = [];

    for (const item of items) {
        const perm = await prisma.modulePermission.upsert({
            where: { role_module: { role: item.role, module: item.module } },
            update: {
                canView: item.canView ?? false,
                canCreate: item.canCreate ?? false,
                canEdit: item.canEdit ?? false,
                canDelete: item.canDelete ?? false,
                canPost: item.canPost ?? false,
                canApprove: item.canApprove ?? false,
            },
            create: {
                role: item.role,
                module: item.module,
                canView: item.canView ?? false,
                canCreate: item.canCreate ?? false,
                canEdit: item.canEdit ?? false,
                canDelete: item.canDelete ?? false,
                canPost: item.canPost ?? false,
                canApprove: item.canApprove ?? false,
            },
        });
        results.push(perm);
    }

    return NextResponse.json({ success: true, count: results.length });
}
