const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\AGREX\\.gemini\\antigravity\\brain\\d5496a71-5759-4e27-a8ec-8df0394a3ed0';
const target = path.join(dir, 'user_manual.html');
const images = {
    dashboard: 'dashboard_1774591229919.png',
    requests: 'requests_1774591254302.png',
    add_request: 'add_request_dialog_1774591261193.png',
    reports: 'reports_list_1774591305634.png',
    journal: 'journal_entry_1774591327710.png',
    coa: 'chart_of_accounts_1774591364600.png'
};

const b64 = {};
for (const [key, val] of Object.entries(images)) {
    const p = path.join(dir, val);
    if (fs.existsSync(p)) {
        b64[key] = 'data:image/png;base64,' + fs.readFileSync(p).toString('base64');
    } else {
        console.warn('Missing:', p);
        b64[key] = '';
    }
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>LJMA Accounting – User Manual</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Inter',sans-serif;background:#f3f4f6;color:#111827;font-size:14px;line-height:1.6;}
  .container{max-width:900px;margin:20px auto;background:#fff;padding:40px;box-shadow:0 10px 40px rgba(0,0,0,0.05);border-radius:12px;}
  @media print{.container{margin:0;box-shadow:none;width:100%;padding:20px;}}
  .cover{text-align:center;padding:40px 0;border-bottom:2px solid #e5e7eb;margin-bottom:40px;}
  .cover h1{font-size:32px;font-weight:800;color:#1e40af;margin-bottom:10px;}
  .cover p{font-size:16px;color:#6b7280;}
  .section{margin-bottom:60px;page-break-inside:avoid;}
  h2{font-size:22px;font-weight:700;color:#111827;margin-bottom:20px;display:flex;align-items:center;gap:10px;border-left:5px solid #1e40af;padding-left:15px;}
  .img-box{background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:15px;margin:20px 0;text-align:center;}
  .img-box img{max-width:100%;border-radius:6px;box-shadow:0 8px 16px rgba(0,0,0,0.12);border:1px solid #d1d5db;display:block;margin:0 auto;}
  .img-cap{font-size:12px;color:#6b7280;margin-top:12px;font-weight:600;font-style:italic;}
  .steps{padding-left:20px;margin:15px 0;}
  .steps li{margin-bottom:12px;}
  .steps li strong{color:#1e40af;}
</style>
</head>
<body>
<div class="container">
  <div class="cover">
    <h1>LJMA FinancePro User Manual</h1>
    <p>Complete Operational Guide with Embedded Proof-of-Work</p>
    <p style="font-size:11px;margin-top:15px;color:#9ca3af;">Internal Technical Document • ${new Date().toLocaleDateString()}</p>
  </div>

  <div class="section">
    <h2>1. The Dashboard</h2>
    <div class="img-box">
      <img src="${b64.dashboard}" alt="Dashboard"/>
      <div class="img-cap">Figure 1: Financial Overview Dashboard.</div>
    </div>
    <ul class="steps">
      <li>Track real-time <strong>Net Profit</strong> and <strong>Outstanding Payables</strong>.</li>
      <li>Monitor POS synchronization metrics and product sales volume.</li>
    </ul>
  </div>

  <div class="section">
    <h2>2. Request Management</h2>
    <div class="img-box">
      <img src="${b64.requests}" alt="Requests"/>
      <div class="img-cap">Figure 2: The Request Lifecycle Dashboard.</div>
    </div>
    <div class="img-box">
      <img src="${b64.add_request}" alt="Add Request"/>
      <div class="img-cap">Figure 3: Form Selection Interface.</div>
    </div>
    <ul class="steps">
      <li>Access different form types across multiple departments (Job Orders, Materials, etc.).</li>
      <li>Track digital signatures for <strong>Verification</strong> and <strong>Approval</strong>.</li>
    </ul>
  </div>

  <div class="section">
    <h2>3. Reporting &amp; Auditing</h2>
    <div class="img-box">
      <img src="${b64.reports}" alt="Reports"/>
      <div class="img-cap">Figure 4: Automated Reporting Hub.</div>
    </div>
    <ul class="steps">
      <li>Generate Balance Sheets, Income Statements, and Aging Reports instantly.</li>
      <li>Export data for external audits or internal reviews.</li>
    </ul>
  </div>

  <div class="section">
    <h2>4. Manual Transactions</h2>
    <div class="img-box">
      <img src="${b64.journal}" alt="Journal"/>
      <div class="img-cap">Figure 5: Manual Journal Entry Interface.</div>
    </div>
    <div class="img-box">
      <img src="${b64.coa}" alt="COA"/>
      <div class="img-cap">Figure 6: Global Chart of Accounts.</div>
    </div>
    <ul class="steps">
      <li>Perform double-entry adjustments for non-automated events.</li>
      <li>Manage the General Ledger structure and account hierarchies.</li>
    </ul>
  </div>
</div>
</body>
</html>`;

fs.writeFileSync(target, html);
console.log('Success: User manual updated at', target);
