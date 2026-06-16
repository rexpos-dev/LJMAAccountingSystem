import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';

// ─── Transporter (Gmail SMTP) ─────────────────────────────────────────────────
function createTransporter() {
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!user || !pass) {
        throw new Error('SMTP_USER and SMTP_PASS must be set in .env');
    }

    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: { user, pass },
    });
}

// ─── Base HTML wrapper ────────────────────────────────────────────────────────
function htmlWrapper(companyName: string, content: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>${companyName}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:32px 16px;">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">
        <!-- Header -->
        <tr>
          <td style="background:#b91c1c;padding:24px 32px;">
            <h1 style="margin:0;color:#fff;font-size:20px;font-weight:900;letter-spacing:0.5px;text-transform:uppercase;">${companyName}</h1>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            ${content}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:16px 32px;border-top:1px solid #e5e7eb;background:#f9fafb;">
            <p style="margin:0;font-size:11px;color:#9ca3af;text-align:center;">
              This is an automated message from ${companyName}. Please do not reply to this email.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── Email Templates ──────────────────────────────────────────────────────────
export type EmailTemplate =
    | 'invoice_created'
    | 'payment_overdue'
    | 'request_approved'
    | 'request_rejected'
    | 'request_for_approval'
    | 'low_stock'
    | 'backup_complete'
    | 'generic';

interface TemplateData {
    [key: string]: string | number | undefined;
}

function renderTemplate(template: EmailTemplate, data: TemplateData, companyName: string): { subject: string; html: string } {
    const btn = (url: string, label: string) =>
        `<a href="${url}" style="display:inline-block;margin-top:20px;padding:12px 24px;background:#b91c1c;color:#fff;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;">${label}</a>`;

    const row = (label: string, value: string | number) =>
        `<tr><td style="padding:8px 0;font-size:13px;color:#6b7280;width:40%;">${label}</td><td style="padding:8px 0;font-size:13px;font-weight:600;color:#111;">${value}</td></tr>`;

    switch (template) {
        case 'invoice_created':
            return {
                subject: `Invoice ${data.invoiceNumber} — ${companyName}`,
                html: htmlWrapper(companyName, `
                  <h2 style="margin:0 0 8px;font-size:18px;color:#111;">New Invoice</h2>
                  <p style="color:#6b7280;font-size:13px;margin:0 0 20px;">Dear ${data.customerName},</p>
                  <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e5e7eb;border-bottom:1px solid #e5e7eb;">
                    ${row('Invoice No.', data.invoiceNumber ?? '')}
                    ${row('Date', data.date ?? '')}
                    ${row('Amount Due', `₱${Number(data.amount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`)}
                    ${row('Due Date', data.dueDate ?? '')}
                  </table>
                  <p style="color:#6b7280;font-size:13px;margin-top:16px;">Please settle your balance on or before the due date. Thank you!</p>
                `),
            };

        case 'payment_overdue':
            return {
                subject: `⚠️ Overdue Invoice ${data.invoiceNumber} — Action Required`,
                html: htmlWrapper(companyName, `
                  <h2 style="margin:0 0 8px;font-size:18px;color:#b91c1c;">Overdue Payment Notice</h2>
                  <p style="color:#6b7280;font-size:13px;margin:0 0 20px;">Dear ${data.customerName}, your invoice is now overdue.</p>
                  <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e5e7eb;border-bottom:1px solid #e5e7eb;">
                    ${row('Invoice No.', data.invoiceNumber ?? '')}
                    ${row('Original Due Date', data.dueDate ?? '')}
                    ${row('Days Overdue', `${data.daysOverdue} days`)}
                    ${row('Outstanding Amount', `₱${Number(data.amount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`)}
                  </table>
                  <p style="color:#6b7280;font-size:13px;margin-top:16px;">Please settle your account immediately to avoid penalties. Contact us if you need assistance.</p>
                `),
            };

        case 'request_for_approval':
            return {
                subject: `Action Required: Request ${data.requestNumber} awaiting your ${data.role}`,
                html: htmlWrapper(companyName, `
                  <h2 style="margin:0 0 8px;font-size:18px;color:#111;">Request Pending Your ${data.role}</h2>
                  <p style="color:#6b7280;font-size:13px;margin:0 0 20px;">A request has been assigned to you for ${String(data.role).toLowerCase()}.</p>
                  <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e5e7eb;border-bottom:1px solid #e5e7eb;">
                    ${row('Request No.', data.requestNumber ?? '')}
                    ${row('Form Type', data.formName ?? '')}
                    ${row('Requested By', data.requesterName ?? '')}
                    ${row('Amount', `₱${Number(data.amount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`)}
                  </table>
                  <p style="color:#6b7280;font-size:13px;margin-top:16px;">Please log in to review and take action on this request.</p>
                `),
            };

        case 'request_approved':
            return {
                subject: `✅ Your Request ${data.requestNumber} has been ${data.status}`,
                html: htmlWrapper(companyName, `
                  <h2 style="margin:0 0 8px;font-size:18px;color:#111;">Request Status Update</h2>
                  <p style="color:#6b7280;font-size:13px;margin:0 0 20px;">Dear ${data.requesterName}, your request has been updated.</p>
                  <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e5e7eb;border-bottom:1px solid #e5e7eb;">
                    ${row('Request No.', data.requestNumber ?? '')}
                    ${row('Status', data.status ?? '')}
                    ${row('Updated By', data.actionBy ?? '')}
                  </table>
                `),
            };

        case 'low_stock':
            return {
                subject: `⚠️ Low Stock Alert — ${data.productName}`,
                html: htmlWrapper(companyName, `
                  <h2 style="margin:0 0 8px;font-size:18px;color:#b91c1c;">Low Stock Warning</h2>
                  <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e5e7eb;border-bottom:1px solid #e5e7eb;">
                    ${row('Product', data.productName ?? '')}
                    ${row('Current Stock', String(data.currentStock))}
                    ${row('Reorder Point', String(data.reorderPoint))}
                  </table>
                  <p style="color:#6b7280;font-size:13px;margin-top:16px;">Please create a purchase order to replenish this item.</p>
                `),
            };

        case 'backup_complete':
            return {
                subject: `✅ Daily Backup Completed — ${data.date}`,
                html: htmlWrapper(companyName, `
                  <h2 style="margin:0 0 8px;font-size:18px;color:#111;">Automated Backup Complete</h2>
                  <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e5e7eb;border-bottom:1px solid #e5e7eb;">
                    ${row('Date', data.date ?? '')}
                    ${row('File', data.fileName ?? '')}
                    ${row('Size', data.size ?? '')}
                    ${row('Status', '✅ Success')}
                  </table>
                `),
            };

        default:
            return {
                subject: String(data.subject ?? 'Notification'),
                html: htmlWrapper(companyName, `<p style="color:#111;font-size:14px;">${data.message ?? ''}</p>`),
            };
    }
}

// ─── Main send function ───────────────────────────────────────────────────────
export async function sendEmail(options: {
    to: string | string[];
    template: EmailTemplate;
    data: TemplateData;
    entityType?: string;
    entityId?: string;
}) {
    // Fetch company name from business profile
    let companyName = 'LJMA Accounting';
    try {
        const profile = await prisma.businessProfile.findFirst();
        if (profile?.businessName) companyName = profile.businessName;
    } catch { /* non-fatal */ }

    const toArray = Array.isArray(options.to) ? options.to : [options.to];
    const { subject, html } = renderTemplate(options.template, options.data, companyName);
    const fromUser = process.env.SMTP_USER ?? '';

    let status: 'sent' | 'failed' = 'sent';
    let errorMsg: string | undefined;

    try {
        const transporter = createTransporter();
        await transporter.sendMail({
            from: `"${companyName}" <${fromUser}>`,
            to: toArray.join(', '),
            subject,
            html,
        });
    } catch (err: any) {
        status = 'failed';
        errorMsg = err.message;
        console.error('[Email] Send failed:', err.message);
    }

    // Always log the attempt
    try {
        await prisma.emailLog.create({
            data: {
                to: toArray.join(', '),
                subject,
                template: options.template,
                entityType: options.entityType,
                entityId: options.entityId,
                status,
                error: errorMsg,
            },
        });
    } catch { /* log failure is non-fatal */ }

    return status === 'sent';
}
