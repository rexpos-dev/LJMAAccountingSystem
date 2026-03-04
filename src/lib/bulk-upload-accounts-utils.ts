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

export interface AccountCSVRow {
    'Account No.': string;
    'Account Name': string;
    'Account Description'?: string;
    'Account Status'?: string;
    'Account Type'?: string;
    'Account Category': string;
    'FS Category'?: string;
    'Header'?: string;
    'Bank'?: string;
    'Balance'?: string;
    'Date Created'?: string;
}

const HEADER_MAPPING: Record<string, string> = {
    'accountno': 'Account No.',
    'accountnumber': 'Account No.',
    'accountname': 'Account Name',
    'name': 'Account Name',
    'accountdescription': 'Account Description',
    'description': 'Account Description',
    'accountstatus': 'Account Status',
    'status': 'Account Status',
    'accounttype': 'Account Type',
    'type': 'Account Type',
    'accountcategory': 'Account Category',
    'category': 'Account Category',
    'fscategory': 'FS Category',
    'header': 'Header',
    'bank': 'Bank',
    'balance': 'Balance',
    'datecreated': 'Date Created',
    'createdat': 'Date Created'
};

const REQUIRED_COLUMNS = [
    'Account No.',
    'Account Name',
    'Account Category'
];

const VALID_CATEGORIES = [
    'Asset',
    'Liability',
    'Equity',
    'Income',
    'Cost of Sales',
    'Expense'
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
                transformHeader: (header: string) => {
                    // Strip all non-alphanumeric characters and lowercase
                    const normalized = header.toLowerCase().replace(/[^a-z0-9]/g, '');
                    return HEADER_MAPPING[normalized] || header.trim();
                },
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
 * Validate CSV structure and data for accounts
 */
export function validateAccountsCSV(data: any[]): ValidationResult {
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
    const actualColumns = Object.keys(firstRow).map(col => col.trim());
    const missingColumns = REQUIRED_COLUMNS.filter(col => !actualColumns.includes(col));

    if (missingColumns.length > 0) {
        errors.push({
            row: 0,
            field: 'headers',
            message: `Missing required columns: ${missingColumns.join(', ')}`
        });
        return { isValid: false, errors, data: [] };
    }

    // Track account numbers to check for duplicates
    const accountNumbers = new Set<string>();

    const validatedData: any[] = [];

    // Validate each row
    data.forEach((row: AccountCSVRow, index) => {
        const rowNum = index + 2; // +2 because index is 0-based and we skip header row

        // Defensive check for empty/null row
        if (!row) return;

        // Skip if row is essentially empty (all values are empty strings or whitespace)
        const isRowEmpty = Object.values(row).every(value => !value || String(value).trim() === '');
        if (isRowEmpty) return;

        validatedData.push(row);

        // Required fields validation
        const accountNoRaw = row['Account No.'];
        if (!accountNoRaw || String(accountNoRaw).trim() === '') {
            errors.push({ row: rowNum, field: 'Account No.', message: 'Account No. is required' });
        } else {
            const accountNo = String(accountNoRaw).trim();

            // Check if account number is numeric
            if (!isValidNumber(accountNo)) {
                errors.push({ row: rowNum, field: 'Account No.', message: 'Account No. must be numeric' });
            }

            // Check for duplicate account numbers in CSV
            if (accountNumbers.has(accountNo)) {
                errors.push({ row: rowNum, field: 'Account No.', message: `Duplicate Account No.: ${accountNo}` });
            } else {
                accountNumbers.add(accountNo);
            }
        }

        const nameRaw = row['Account Name'];
        if (!nameRaw || String(nameRaw).trim() === '') {
            errors.push({ row: rowNum, field: 'Account Name', message: 'Account Name is required' });
        }

        const categoryRaw = row['Account Category'];
        if (!categoryRaw || String(categoryRaw).trim() === '') {
            errors.push({ row: rowNum, field: 'Account Category', message: 'Account Category is required' });
        } else {
            const category = String(categoryRaw).trim();
            if (!VALID_CATEGORIES.includes(category)) {
                errors.push({
                    row: rowNum,
                    field: 'Account Category',
                    message: `Account Category must be one of: ${VALID_CATEGORIES.join(', ')}`
                });
            }
        }

        // Optional fields validation
        const headerRaw = row.Header;
        if (headerRaw && !['Yes', 'No', ''].includes(String(headerRaw).trim())) {
            errors.push({ row: rowNum, field: 'Header', message: 'Header must be "Yes" or "No"' });
        }

        const balanceRaw = row.Balance;
        if (balanceRaw && !isValidNumber(String(balanceRaw))) {
            errors.push({ row: rowNum, field: 'Balance', message: 'Balance must be a valid number' });
        }
    });

    return {
        isValid: errors.length === 0,
        errors,
        data: validatedData
    };
}

/**
 * Map CSV row to Account data
 */
export function mapCSVRowToAccount(row: AccountCSVRow) {
    const parseNumber = (value: any): number => {
        if (value === null || value === undefined || String(value).trim() === '') return 0;
        const cleaned = cleanNumericString(String(value).trim());
        const num = Number(cleaned);
        return isNaN(num) ? 0 : num;
    };

    const trimOrNull = (value: any): string | null => {
        if (value === null || value === undefined) return null;
        const trimmed = String(value).trim();
        return trimmed === '' ? null : trimmed;
    };

    const dateCreatedRaw = trimOrNull(row['Date Created']);
    let dateCreated: Date | undefined = undefined;
    if (dateCreatedRaw) {
        const parsedDate = new Date(dateCreatedRaw);
        if (!isNaN(parsedDate.getTime())) {
            dateCreated = parsedDate;
        }
    }

    return {
        account_no: Math.floor(parseNumber(row['Account No.'])),
        account_name: trimOrNull(row['Account Name']) || 'Unnamed Account',
        account_description: trimOrNull(row['Account Description']),
        account_status: trimOrNull(row['Account Status']) || 'Active',
        account_category: trimOrNull(row['Account Category']) || 'Expense',
        account_type: trimOrNull(row['Account Type']),
        fs_category: trimOrNull(row['FS Category']),
        header: trimOrNull(row.Header) || 'No',
        bank: trimOrNull(row.Bank) || 'No',
        balance: parseNumber(row.Balance),
        date_created: dateCreated
    };
}
