
const http = require('http');

const data = JSON.stringify({
    requesterName: 'Test Requestor',
    position: 'Test Position',
    businessUnit: 'Test Unit',
    purpose: 'Test Purpose',
    chargeTo: 'Test Charge',
    accountNo: '123-456',
    verifiedBy: 'Signer 1',
    approvedBy: 'Signer 2',
    processedBy: 'Signer 3',
    items: [
        { description: 'Item 1', quantity: 2, unitPrice: 100 },
        { description: 'Item 2', quantity: 1, unitPrice: 50 },
    ]
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/requests',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        console.log('Status:', res.statusCode);
        console.log('Body:', body);
    });
});

req.on('error', (error) => {
    console.error('Error:', error);
});

req.write(data);
req.end();
