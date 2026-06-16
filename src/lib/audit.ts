import { prisma } from '@/lib/prisma';

type Action = 'CREATE' | 'UPDATE' | 'DELETE';

const SKIP_FIELDS = new Set(['updatedAt', 'createdAt']);

function stringify(val: unknown): string {
    if (val === null || val === undefined) return '';
    if (val instanceof Date) return val.toISOString();
    if (typeof val === 'object') return JSON.stringify(val);
    return String(val);
}

/**
 * Log a CREATE action (no field diffs — just records the creation).
 */
export async function auditCreate(opts: {
    entityType: string;
    entityId: string;
    changedBy: string;
    data?: Record<string, unknown>;
}) {
    const fields = opts.data
        ? Object.entries(opts.data)
              .filter(([k]) => !SKIP_FIELDS.has(k))
              .map(([fieldName, newValue]) => ({
                  entityType: opts.entityType,
                  entityId: opts.entityId,
                  action: 'CREATE' as Action,
                  fieldName,
                  oldValue: null,
                  newValue: stringify(newValue),
                  changedBy: opts.changedBy,
              }))
        : [{
              entityType: opts.entityType,
              entityId: opts.entityId,
              action: 'CREATE' as Action,
              fieldName: null,
              oldValue: null,
              newValue: null,
              changedBy: opts.changedBy,
          }];

    await prisma.auditFieldLog.createMany({ data: fields });
}

/**
 * Log an UPDATE action with per-field old vs new values.
 */
export async function auditUpdate(opts: {
    entityType: string;
    entityId: string;
    changedBy: string;
    oldData: Record<string, unknown>;
    newData: Record<string, unknown>;
}) {
    const diffs = Object.keys(opts.newData)
        .filter((k) => !SKIP_FIELDS.has(k))
        .filter((k) => stringify(opts.oldData[k]) !== stringify(opts.newData[k]))
        .map((fieldName) => ({
            entityType: opts.entityType,
            entityId: opts.entityId,
            action: 'UPDATE' as Action,
            fieldName,
            oldValue: stringify(opts.oldData[fieldName]),
            newValue: stringify(opts.newData[fieldName]),
            changedBy: opts.changedBy,
        }));

    if (diffs.length === 0) return;
    await prisma.auditFieldLog.createMany({ data: diffs });
}

/**
 * Log a DELETE action.
 */
export async function auditDelete(opts: {
    entityType: string;
    entityId: string;
    changedBy: string;
}) {
    await prisma.auditFieldLog.create({
        data: {
            entityType: opts.entityType,
            entityId: opts.entityId,
            action: 'DELETE',
            changedBy: opts.changedBy,
        },
    });
}
