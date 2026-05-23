import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, getSession } from '@/lib/auth-server';
import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
// @ts-ignore
import AdmZip from 'adm-zip';

const UPLOAD_DIR = path.join(process.cwd(), 'storage', 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

/** Execute a full SQL dump string using a mysql2 connection. */
async function executeSqlDump(sqlContent: string, connOptions: mysql.ConnectionOptions): Promise<void> {
    const conn = await mysql.createConnection({
        ...connOptions,
        // Allow multiple statements in a single query call (required for dump files)
        multipleStatements: true,
        // Give large restores enough time
        connectTimeout: 60_000,
    });

    try {
        // Prepend FK-check disable so inserts work regardless of table order
        const wrapped = `SET FOREIGN_KEY_CHECKS=0;\n${sqlContent}\nSET FOREIGN_KEY_CHECKS=1;`;
        await conn.query(wrapped);
    } finally {
        await conn.end();
    }
}

export async function POST(request: NextRequest) {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    let savedFilePath: string | null = null;
    let sqlFilePath: string | null = null;

    try {
        const session = await getSession();
        const username = (session as any)?.username || 'system';

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file type
        const ext = path.extname(file.name).toLowerCase();
        if (!['.sql', '.zip'].includes(ext)) {
            return NextResponse.json(
                { error: 'Invalid file type. Only .sql and .zip files are accepted.' },
                { status: 400 }
            );
        }

        // Validate file size (max 500 MB)
        if (file.size > 500 * 1024 * 1024) {
            return NextResponse.json(
                { error: 'File too large. Maximum allowed size is 500MB.' },
                { status: 400 }
            );
        }

        // Save uploaded file to disk
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        savedFilePath = path.join(UPLOAD_DIR, `upload_${timestamp}_${safeFileName}`);

        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(savedFilePath, buffer);

        // If zip, extract the first .sql file inside
        sqlFilePath = savedFilePath;
        if (ext === '.zip') {
            try {
                const zip = new AdmZip(savedFilePath);
                const sqlEntry = zip.getEntries().find((e: any) => e.entryName.endsWith('.sql'));
                if (!sqlEntry) {
                    return NextResponse.json(
                        { error: 'No .sql file found inside the zip archive.' },
                        { status: 400 }
                    );
                }
                sqlFilePath = path.join(UPLOAD_DIR, `extracted_${timestamp}.sql`);
                fs.writeFileSync(sqlFilePath, sqlEntry.getData());
            } catch {
                return NextResponse.json(
                    { error: 'Failed to extract zip file. Please ensure it is a valid zip archive.' },
                    { status: 400 }
                );
            }
        }

        // Parse connection details
        const connectionUrl = process.env.DATABASE_URL;
        if (!connectionUrl) {
            return NextResponse.json({ error: 'DATABASE_URL is not configured on the server.' }, { status: 500 });
        }

        let connOptions: mysql.ConnectionOptions;
        try {
            const url = new URL(connectionUrl);
            connOptions = {
                host: url.hostname,
                port: url.port ? parseInt(url.port) : 3306,
                user: decodeURIComponent(url.username),
                password: decodeURIComponent(url.password),
                database: url.pathname.replace(/^\//, ''),
            };
        } catch {
            return NextResponse.json(
                { error: 'DATABASE_URL is malformed. Cannot parse connection details.' },
                { status: 500 }
            );
        }

        // Read and execute the SQL dump
        const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
        if (!sqlContent.trim()) {
            return NextResponse.json({ error: 'The SQL file is empty.' }, { status: 400 });
        }

        try {
            await executeSqlDump(sqlContent, connOptions);
        } catch (dbError: any) {
            console.error('SQL restore error:', dbError);
            return NextResponse.json(
                {
                    error: 'Failed to restore database from backup.',
                    details: dbError.message ?? String(dbError),
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            message: 'Database restored successfully from backup.',
            fileName: file.name,
            fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
            restoredBy: username,
        });

    } catch (error: any) {
        console.error('Upload backup error:', error);
        return NextResponse.json(
            { error: 'Failed to process backup upload.', details: error.message },
            { status: 500 }
        );
    } finally {
        // Clean up temp files
        try {
            if (sqlFilePath && sqlFilePath !== savedFilePath && fs.existsSync(sqlFilePath)) {
                fs.unlinkSync(sqlFilePath);
            }
        } catch { /* ignore */ }
    }
}
