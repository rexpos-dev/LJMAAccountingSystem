import fetch from 'node-fetch';

async function testSalesUserAPI() {
  try {
    console.log('Testing sales user API...');

    // Test POST request
    const response = await fetch('http://localhost:3000/api/sales-users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sp_id: 'SP001',
        username: 'testuser',
        complete_name: 'Test User',
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Sales user created successfully:', data);
    } else {
      const error = await response.json();
      console.log('❌ Failed to create sales user:', error);
    }

    // Test GET request
    const getResponse = await fetch('http://localhost:3000/api/sales-users');
    if (getResponse.ok) {
      const users = await getResponse.json();
      console.log('✅ Found sales users:', users.length);
    } else {
      console.log('❌ Failed to fetch sales users');
    }

  } catch (error) {
    console.error('Error testing API:', error.message);
  }
}

testSalesUserAPI();
