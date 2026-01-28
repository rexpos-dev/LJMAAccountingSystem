import dotenv from 'dotenv';
dotenv.config();

console.log('DATABASE_URL present:', !!process.env.DATABASE_URL);

async function verify() {
    const productCode = `TEST-${Date.now()}`;
    const payload = {
        code: productCode,
        name: "Test Product History",
        initialStock: "10",
        stockQuantity: "0", // Should add to initial stock
        unitPrice: "100",
        costPrice: "50",
        isActive: true
    };

    console.log('Sending POST request to /api/products...');
    try {
        const res = await fetch('http://localhost:3000/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            console.error('API call failed status:', res.status);
            const err = await res.text();
            console.error('Error:', err);
            process.exit(1);
        }

        const product = await res.json();
        console.log('Product created:', product.id);
        console.log('✅ API returned success. Transaction should have committed history and inventory.');

    } catch (error) {
        console.error('Verification failed:', error);
    }
}

verify();
