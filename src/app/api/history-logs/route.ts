import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
        const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '10', 10)));
        const search = searchParams.get('search') || '';
        const actionType = searchParams.get('actionType') || '';
        const user = searchParams.get('user') || '';
        const startDate = searchParams.get('startDate') || '';
        const endDate = searchParams.get('endDate') || '';
        const status = searchParams.get('status') || '';

        const where: any = {};

        if (search) {
            where.OR = [
                { details: { contains: search } },
                { actionType: { contains: search } },
                { initiatedBy: { contains: search } },
                { transactionId: { contains: search } },
            ];
        }

        if (actionType && actionType !== 'ALL') {
            where.actionType = { contains: actionType };
        }

        if (user && user !== 'ALL') {
            where.initiatedBy = { contains: user };
        }

        if (status && status !== 'ALL') {
            where.status = status;
        }

        if (startDate || endDate) {
            where.date = {};
            if (startDate) {
                where.date.gte = new Date(startDate);
            }
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                where.date.lte = end;
            }
        }

        const [total, data] = await Promise.all([
            prisma.auditLog.count({ where }),
            prisma.auditLog.findMany({
                where,
                orderBy: { date: 'desc' },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
        ]);

        // Get distinct users for filter dropdown
        const distinctUsers = await prisma.auditLog.findMany({
            where: { initiatedBy: { not: null } },
            select: { initiatedBy: true },
            distinct: ['initiatedBy'],
            orderBy: { initiatedBy: 'asc' },
        });

        // Get distinct action types for filter dropdown
        const distinctActionTypes = await prisma.auditLog.findMany({
            select: { actionType: true },
            distinct: ['actionType'],
            orderBy: { actionType: 'asc' },
        });

        return NextResponse.json({
            data,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
            distinctUsers: distinctUsers.map(u => u.initiatedBy).filter(Boolean),
            distinctActionTypes: distinctActionTypes.map(a => a.actionType),
        });
    } catch (error) {
        console.error('[API] history-logs GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch history logs' }, { status: 500 });
    }
}
