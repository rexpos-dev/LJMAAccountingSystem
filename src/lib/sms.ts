/**
 * SMS Notifications via Semaphore PH
 * API docs: https://semaphore.co/docs
 * Set in .env:
 *   SEMAPHORE_API_KEY=your_api_key
 *   SEMAPHORE_SENDER_NAME=YourBrand   (max 11 chars, alphanumeric)
 *   NOTIFY_ADMIN_PHONE=09XXXXXXXXX    (for admin alerts)
 */

const SEMAPHORE_URL = 'https://api.semaphore.co/api/v4/messages';

export type SmsTemplate =
    | 'overdue_payment'
    | 'request_approved'
    | 'request_for_approval'
    | 'low_stock'
    | 'backup_complete'
    | 'custom';

interface SmsData {
    [key: string]: string | number | undefined;
}

function renderSmsTemplate(template: SmsTemplate, data: SmsData, companyName: string): string {
    switch (template) {
        case 'overdue_payment':
            return `[${companyName}] Dear ${data.customerName}, Invoice ${data.invoiceNumber} worth P${data.amount} is ${data.daysOverdue} days overdue. Please settle immediately.`;

        case 'request_approved':
            return `[${companyName}] Your request ${data.requestNumber} has been ${data.status}. Log in for details.`;

        case 'request_for_approval':
            return `[${companyName}] Action needed: Request ${data.requestNumber} (${data.formName}) is awaiting your ${data.role}. Please log in.`;

        case 'low_stock':
            return `[${companyName}] Low stock alert: ${data.productName} — ${data.currentStock} units remaining (reorder at ${data.reorderPoint}).`;

        case 'backup_complete':
            return `[${companyName}] Daily backup completed successfully on ${data.date}. File: ${data.fileName} (${data.size}).`;

        case 'custom':
            return String(data.message ?? '');
    }
}

export async function sendSMS(options: {
    to: string | string[];
    template: SmsTemplate;
    data: SmsData;
    companyName?: string;
}): Promise<boolean> {
    const apiKey = process.env.SEMAPHORE_API_KEY;
    if (!apiKey) {
        console.warn('[SMS] SEMAPHORE_API_KEY not set — skipping SMS');
        return false;
    }

    const senderName = (process.env.SEMAPHORE_SENDER_NAME ?? 'LJMA').slice(0, 11);
    const numbers = Array.isArray(options.to) ? options.to : [options.to];
    const message = renderSmsTemplate(
        options.template,
        options.data,
        options.companyName ?? 'LJMA'
    );

    // Semaphore allows up to 1000 numbers per request
    const body = new URLSearchParams({
        apikey: apiKey,
        number: numbers.join(','),
        message,
        sendername: senderName,
    });

    try {
        const res = await fetch(SEMAPHORE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body.toString(),
        });

        if (!res.ok) {
            const err = await res.text();
            console.error('[SMS] Semaphore error:', err);
            return false;
        }

        return true;
    } catch (err: any) {
        console.error('[SMS] Network error:', err.message);
        return false;
    }
}

/**
 * Convenience — send to admin phone only
 */
export async function sendAdminSMS(template: SmsTemplate, data: SmsData, companyName?: string) {
    const adminPhone = process.env.NOTIFY_ADMIN_PHONE;
    if (!adminPhone) return false;
    return sendSMS({ to: adminPhone, template, data, companyName });
}
