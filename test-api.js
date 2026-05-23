
async function testApi() {
    try {
        const response = await fetch('http://localhost:3000/api/suppliers');
        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Data:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Fetch error:', error.message);
    }
}

testApi();
