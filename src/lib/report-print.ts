export interface BusinessInfo {
  businessName?: string;
  address?: string;
  email?: string;
  contactTel?: string;
  contactPhone?: string;
}

export interface ReportPrintOptions {
  title: string;
  subtitle?: string;
  contentHtml: string;
  business?: BusinessInfo;
}

export function buildPrintDocument({
  title,
  subtitle,
  contentHtml,
  business,
}: ReportPrintOptions): string {
  const companyName = business?.businessName?.trim() || 'LJMA Accounting';

  // Build contact line from whatever fields are set
  const contactParts: string[] = [];
  if (business?.email) contactParts.push(business.email);
  if (business?.contactTel) contactParts.push(`Tel: ${business.contactTel}`);
  if (business?.contactPhone) contactParts.push(`Mobile: ${business.contactPhone}`);
  const contactLine = contactParts.join('&ensp;|&ensp;');

  const printedAt = new Date().toLocaleString('en-PH', {
    dateStyle: 'long',
    timeStyle: 'short',
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${title} – ${companyName}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    @page {
      size: A4;
      margin: 18mm 22mm 20mm 22mm;
    }

    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 11px;
      color: #111;
      background: #fff;
      line-height: 1.5;
    }

    /* ─── CONFIDENTIAL WATERMARK ─── */
    .wm {
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      z-index: 9999;
      overflow: hidden;
    }
    .wm-text {
      font-size: 88px;
      font-weight: 900;
      letter-spacing: 14px;
      color: rgba(180, 0, 0, 0.065);
      transform: rotate(-42deg);
      white-space: nowrap;
      text-transform: uppercase;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* ─── DOCUMENT HEADER ─── */
    .doc-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding-bottom: 10px;
      margin-bottom: 18px;
      border-bottom: 2px solid #111;
    }
    .company-name {
      font-size: 17px;
      font-weight: 900;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .company-address {
      font-size: 9.5px;
      color: #374151;
      margin-top: 2px;
    }
    .company-contact {
      font-size: 9px;
      color: #6b7280;
      margin-top: 1px;
    }
    .report-title {
      font-size: 13px;
      font-weight: 700;
      color: #374151;
      margin-top: 6px;
      padding-top: 5px;
      border-top: 1px solid #e5e7eb;
    }
    .report-subtitle {
      font-size: 10px;
      color: #6b7280;
      margin-top: 2px;
    }
    .doc-meta {
      text-align: right;
    }
    .conf-badge {
      display: inline-block;
      border: 1.5px solid #b91c1c;
      color: #b91c1c;
      font-size: 7.5px;
      font-weight: 900;
      letter-spacing: 2px;
      padding: 2px 7px;
      text-transform: uppercase;
      margin-bottom: 5px;
    }
    .print-date {
      font-size: 9px;
      color: #9ca3af;
    }

    /* ─── TABLE STYLES ─── */
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10px;
      margin-bottom: 12px;
    }
    thead tr {
      background-color: #f3f4f6 !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    thead th {
      padding: 6px 10px;
      font-weight: 700;
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #374151;
      border-bottom: 1.5px solid #d1d5db;
      text-align: left;
    }
    thead th.text-right { text-align: right; }
    thead th.text-center { text-align: center; }
    tbody tr { border-bottom: 1px solid #f3f4f6; }
    tbody tr:nth-child(even) {
      background-color: #fafafa !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    tbody td {
      padding: 5px 10px;
      color: #111;
      vertical-align: middle;
    }
    /* Tailwind class mappings */
    .text-right { text-align: right !important; }
    .text-center { text-align: center !important; }
    .text-left { text-align: left !important; }
    .font-bold { font-weight: 700 !important; }
    .font-semibold { font-weight: 600 !important; }
    .italic { font-style: italic; }
    .pl-8 { padding-left: 32px !important; }
    .pl-6 { padding-left: 24px !important; }
    .pl-4 { padding-left: 16px !important; }
    .pr-4 { padding-right: 16px !important; }
    .border-t-2 { border-top: 2px solid #374151 !important; }
    .border-double { border-top-style: double !important; }
    .text-muted-foreground { color: #6b7280; }
    .bg-muted\/30 { background-color: #f3f4f6 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .bg-secondary\/20 { background-color: #f1f5f9 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    tr.bg-muted\/30 td, tr.bg-secondary\/20 td { font-weight: 700; }
    .uppercase { text-transform: uppercase; }
    .tracking-widest { letter-spacing: 0.1em; }
    .text-xs { font-size: 9px; }
    .text-sm { font-size: 10px; }
    .text-base { font-size: 11px; }
    .text-lg { font-size: 13px; }
    .text-xl { font-size: 15px; }
    .text-2xl { font-size: 18px; }
    /* hide scrollbars and UI-only elements */
    [data-radix-scroll-area-viewport], [data-radix-scroll-area-scrollbar] { overflow: visible !important; }
    button, [role="button"], .no-print { display: none !important; }

    /* ─── DOCUMENT FOOTER ─── */
    .doc-footer {
      position: fixed;
      bottom: 0; left: 0; right: 0;
      padding-top: 6px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      font-size: 8px;
      color: #9ca3af;
    }
    .footer-conf {
      color: #b91c1c;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      font-size: 7px;
    }

    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>

  <!-- Watermark -->
  <div class="wm" aria-hidden="true">
    <span class="wm-text">CONFIDENTIAL</span>
  </div>

  <!-- Header -->
  <div class="doc-header">
    <div>
      <div class="company-name">${companyName}</div>
      ${business?.address ? `<div class="company-address">${business.address}</div>` : ''}
      ${contactLine ? `<div class="company-contact">${contactLine}</div>` : ''}
      <div class="report-title">${title}</div>
      ${subtitle ? `<div class="report-subtitle">${subtitle}</div>` : ''}
    </div>
    <div class="doc-meta">
      <div class="conf-badge">&#9632; Confidential</div>
      <div class="print-date">Printed: ${printedAt}</div>
    </div>
  </div>

  <!-- Content -->
  <div class="report-body">
    ${contentHtml}
  </div>

  <!-- Footer -->
  <div class="doc-footer">
    <span class="footer-conf">Confidential &mdash; ${companyName}</span>
    <span>This document contains proprietary and confidential information. Unauthorized disclosure is prohibited.</span>
  </div>

</body>
</html>`;
}
