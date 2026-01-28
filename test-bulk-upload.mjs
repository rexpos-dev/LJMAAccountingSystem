// Test script to verify bulk upload utilities
import { parseCSV, validatePurchaseOrderCSV } from './src/lib/bulk-upload-utils';
import * as fs from 'fs';

async function testBulkUpload() {
    try {
        console.log('Reading CSV file...');
        const csvContent = fs.readFileSync('sample-purchase-orders.csv', 'utf-8');

        // Create a File-like object for testing
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const file = new File([blob], 'sample-purchase-orders.csv', { type: 'text/csv' });

        console.log('Parsing CSV...');
        const data = await parseCSV(file);
        console.log(`Parsed ${data.length} rows`);
        console.log('First row:', JSON.stringify(data[0], null, 2));

        console.log('\nValidating CSV...');
        const validation = validatePurchaseOrderCSV(data);

        if (validation.isValid) {
            console.log('✅ CSV is valid!');
            console.log(`Total rows: ${validation.data.length}`);
        } else {
            console.log('❌ CSV validation failed:');
            validation.errors.forEach(error => {
                console.log(`  Row ${error.row}, ${error.field}: ${error.message}`);
            });
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

testBulkUpload();
