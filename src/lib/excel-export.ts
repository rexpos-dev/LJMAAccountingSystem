'use client';

// Extracts table data from rendered HTML and downloads as CSV or Excel (via ExcelJS in browser)
// Using CSV for broadest compatibility — opens natively in Excel

export function exportTableToCSV(contentEl: HTMLElement, fileName: string) {
    const tables = contentEl.querySelectorAll('table');
    if (!tables.length) {
        alert('No table data found to export.');
        return;
    }

    const csvParts: string[] = [];

    tables.forEach((table) => {
        const rows = table.querySelectorAll('tr');
        rows.forEach((row) => {
            const cells = row.querySelectorAll('th, td');
            const csvRow = Array.from(cells)
                .map((cell) => {
                    const text = (cell as HTMLElement).innerText.replace(/\n/g, ' ').trim();
                    // Wrap in quotes if it contains comma, quote, or newline
                    if (text.includes(',') || text.includes('"') || text.includes('\n')) {
                        return `"${text.replace(/"/g, '""')}"`;
                    }
                    return text;
                })
                .join(',');
            csvParts.push(csvRow);
        });
        csvParts.push(''); // blank line between tables
    });

    const csv = '﻿' + csvParts.join('\n'); // BOM for Excel UTF-8 compatibility
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}
