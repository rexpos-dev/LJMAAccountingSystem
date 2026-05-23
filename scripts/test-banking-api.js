async function testBankingApi() {
    console.log('Testing /api/dashboard/banking-stats...');
    try {
        const fetchFn = typeof fetch === 'function' ? fetch : require('node-fetch');
        const response = await fetchFn('http://localhost:3001/api/dashboard/banking-stats');
        if (!response.ok) {
            console.error('API responded with error:', response.status, response.statusText);
            process.exit(1);
        }
        const data = await response.json();
        console.log('Successfully fetched data:');
        console.log(`Total Bank Balance: ${data.totalBankBalance}`);
        console.log(`Pending Audits: ${data.pendingAudits}`);
        console.log(`Inflow Today: ${data.inflowToday}`);
        console.log(`Outflow Today: ${data.outflowToday}`);
        console.log(`Bank-wise Balances Count: ${data.bankWiseBalances?.length || 0}`);
        console.log(`Latest Transactions Count: ${data.latestTransactions?.length || 0}`);

        if (typeof data.totalBankBalance !== 'number') throw new Error('totalBankBalance is not a number');
        if (typeof data.pendingAudits !== 'number') throw new Error('pendingAudits is not a number');
        if (!Array.isArray(data.bankWiseBalances)) throw new Error('bankWiseBalances is not an array');
        if (!Array.isArray(data.latestTransactions)) throw new Error('latestTransactions is not an array');

        console.log('Verification passed!');
    } catch (error) {
        console.error('Verification failed:', error);
        process.exit(1);
    }
}

testBankingApi();
