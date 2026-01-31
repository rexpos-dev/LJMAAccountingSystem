import Papa from 'papaparse';

export interface CSVValidationError {
    row: number;
    field: string;
    message: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: CSVValidationError[];
    data: any[];
}

export interface PurchaseOrderCSVRow {
    Supplier: string;
    Categories: string;
    SKU: string;
    Barcode: string;
    'Product Description': string;
    'Buying UOM': string;
    'QTY/Case': string;
    Offtake: string;
    'Order QTY': string;
    Pieces: string;
    'Cost Price per Case': string;
    'Cost Price per Piece': string;
    'Discount 1': string;
    'Discount 2': string;
    'Discount 3': string;
    'Net Cost Amount': string;
}

const REQUIRED_COLUMNS = [
    'Supplier',
    'Categories',
    'SKU',
    'Barcode',
    'Product Description',
    'Buying UOM',
    'QTY/Case',
    'Offtake',
    'Order QTY',
    'Pieces',
    'Cost Price per Case',
    'Cost Price per Piece',
    'Discount 1',
    'Discount 2',
    'Discount 3',
    'Net Cost Amount'
];

/**
 * Clean numeric string by removing thousand separators (commas)
 * Supports formats like: 1,234.56 or 1234.56
 */
function cleanNumericString(value: string): string {
    if (!value) return '';
    // Remove all commas (thousand separators)
    return value.replace(/,/g, '');
}

/**
 * Check if a string is a valid number after cleaning
 */
function isValidNumber(value: string): boolean {
    if (!value || value.trim() === '') return true; // Empty is valid (optional field)
    const cleaned = cleanNumericString(value.trim());
    return !isNaN(Number(cleaned));
}

/**
 * Parse CSV file to JSON array
 */
export function parseCSV(file: File): Promise<any[]> {
    return new Promise(async (resolve, reject) => {
        try {
            // Convert File to text (works in both browser and Node.js)
            const text = await file.text();

            Papa.parse(text, {
                header: true,
                skipEmptyLines: true,
                complete: (results: Papa.ParseResult<any>) => {
                    resolve(results.data);
                },
                error: (error: Error) => {
                    reject(error);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Validate CSV structure and data for purchase orders
 */
export function validatePurchaseOrderCSV(data: any[]): ValidationResult {
    const errors: CSVValidationError[] = [];

    if (!data || data.length === 0) {
        return {
            isValid: false,
            errors: [{ row: 0, field: 'file', message: 'CSV file is empty' }],
            data: []
        };
    }

    // Check if all required columns are present
    const firstRow = data[0];
    const actualColumns = Object.keys(firstRow);
    const missingColumns = REQUIRED_COLUMNS.filter(col => !actualColumns.includes(col));

    if (missingColumns.length > 0) {
        errors.push({
            row: 0,
            field: 'headers',
            message: `Missing required columns: ${missingColumns.join(', ')}`
        });
        return { isValid: false, errors, data: [] };
    }

    // Validate each row
    data.forEach((row: PurchaseOrderCSVRow, index) => {
        const rowNum = index + 2; // +2 because index is 0-based and we skip header row

        // Required fields validation
        if (!row.Supplier || row.Supplier.trim() === '') {
            errors.push({ row: rowNum, field: 'Supplier', message: 'Supplier is required' });
        }

        if (!row['Product Description'] || row['Product Description'].trim() === '') {
            errors.push({ row: rowNum, field: 'Product Description', message: 'Product Description is required' });
        }

        // Numeric fields validation
        const numericFields = [
            { field: 'QTY/Case', value: row['QTY/Case'] },
            { field: 'Offtake', value: row.Offtake },
            { field: 'Order QTY', value: row['Order QTY'] },
            { field: 'Pieces', value: row.Pieces },
            { field: 'Cost Price per Case', value: row['Cost Price per Case'] },
            { field: 'Cost Price per Piece', value: row['Cost Price per Piece'] },
            { field: 'Discount 1', value: row['Discount 1'] },
            { field: 'Discount 2', value: row['Discount 2'] },
            { field: 'Discount 3', value: row['Discount 3'] },
            { field: 'Net Cost Amount', value: row['Net Cost Amount'] }
        ];

        numericFields.forEach(({ field, value }) => {
            if (value && value.trim() !== '' && !isValidNumber(value)) {
                errors.push({ row: rowNum, field, message: `${field} must be a valid number` });
            }
        });
    });

    return {
        isValid: errors.length === 0,
        errors,
        data
    };
}

/**
 * Map CSV row to PurchaseOrderItem data
 */
export function mapCSVRowToPurchaseOrderItem(row: PurchaseOrderCSVRow) {
    const parseNumber = (value: string): number | null => {
        if (!value || value.trim() === '') return null;
        const cleaned = cleanNumericString(value.trim());
        const num = Number(cleaned);
        return isNaN(num) ? null : num;
    };

    const parseInt = (value: string): number | null => {
        if (!value || value.trim() === '') return null;
        const cleaned = cleanNumericString(value.trim());
        const num = Number(cleaned);
        return isNaN(num) ? null : Math.floor(num);
    };

    return {
        category: row.Categories?.trim() || null,
        sku: row.SKU?.trim() || null,
        barcode: row.Barcode?.trim() || null,
        itemDescription: row['Product Description']?.trim() || '',
        buyingUom: row['Buying UOM']?.trim() || null,
        qtyPerCase: parseInt(row['QTY/Case']),
        offtake: parseInt(row.Offtake),
        orderQty: parseInt(row['Order QTY']),
        pieces: parseInt(row.Pieces),
        quantity: parseInt(row['Order QTY']) || 0,
        costPricePerCase: parseNumber(row['Cost Price per Case']),
        costPricePerPiece: parseNumber(row['Cost Price per Piece']),
        unitPrice: parseNumber(row['Cost Price per Piece']) || 0,
        discount1: parseNumber(row['Discount 1']),
        discount2: parseNumber(row['Discount 2']),
        discount3: parseNumber(row['Discount 3']),
        netCostAmount: parseNumber(row['Net Cost Amount']),
        total: parseNumber(row['Net Cost Amount']) || 0,
        tax: 0
    };
}

/**
 * Group CSV rows by supplier
 */
export function groupRowsBySupplier(data: PurchaseOrderCSVRow[]): Map<string, PurchaseOrderCSVRow[]> {
    const grouped = new Map<string, PurchaseOrderCSVRow[]>();

    data.forEach(row => {
        const supplier = row.Supplier?.trim();
        if (supplier) {
            if (!grouped.has(supplier)) {
                grouped.set(supplier, []);
            }
            grouped.get(supplier)!.push(row);
        }
    });

    return grouped;
}
