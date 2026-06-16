import { prisma } from '@/lib/prisma';

export type RbacAction = 'canView' | 'canCreate' | 'canEdit' | 'canDelete' | 'canPost' | 'canApprove';

// Built-in super-admin bypass
const SUPER_ADMIN_ROLES = ['Super Admin', 'Administrator', 'Admin'];

/**
 * Check if a role has a specific permission on a module.
 * Super Admin always returns true.
 * Falls back to DB record if not super-admin.
 */
export async function hasPermission(role: string, module: string, action: RbacAction): Promise<boolean> {
    if (SUPER_ADMIN_ROLES.includes(role)) return true;

    const perm = await prisma.modulePermission.findUnique({
        where: { role_module: { role, module } },
    });

    if (!perm) return false;
    return perm[action] === true;
}

/**
 * Get all permissions for a role (for client-side menu building).
 */
export async function getRolePermissions(role: string): Promise<Record<string, Record<RbacAction, boolean>>> {
    if (SUPER_ADMIN_ROLES.includes(role)) {
        // Super admin gets all modules with all permissions
        return {};  // client should treat empty as "all allowed" when role is super-admin
    }

    const perms = await prisma.modulePermission.findMany({ where: { role } });
    const result: Record<string, Record<RbacAction, boolean>> = {};

    for (const p of perms) {
        result[p.module] = {
            canView: p.canView,
            canCreate: p.canCreate,
            canEdit: p.canEdit,
            canDelete: p.canDelete,
            canPost: p.canPost,
            canApprove: p.canApprove,
        };
    }

    return result;
}

// Default module list for seeding permissions
export const ALL_MODULES = [
    'dashboard', 'invoices', 'purchase_orders', 'customers', 'suppliers',
    'products', 'inventory', 'banking', 'transactions', 'reports',
    'payroll', 'fixed_assets', 'budgets', 'bir_compliance', 'ar_aging',
    'stock_transfers', 'grn', 'recurring_transactions', 'approvals',
    'user_management', 'configuration', 'audit_trail', 'backup',
];
