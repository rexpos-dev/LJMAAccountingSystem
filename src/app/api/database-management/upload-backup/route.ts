import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, getSession } from '@/lib/auth-server';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
// @ts-ignore - adm-zip doesn't have type declarations
import AdmZip from 'adm-zip';

const execAsync = promisify(exec);

const UPLOAD_DIR = path.join(process.cwd(), 'storage', 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export async function POST(request: NextRequest) {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    try {
        const session = await getSession();
        const username = (session as any)?.username || 'system';

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = ['.sql', '.zip'];
        const ext = path.extname(file.name).toLowerCase();
        if (!allowedTypes.includes(ext)) {
            return NextResponse.json(
                { error: 'Invalid file type. Only .sql and .zip files are accepted.' },
                { status: 400 }
            );
        }

        // Validate file size (max 500MB)
        const maxSize = 500 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'File too large. Maximum allowed size is 500MB.' },
                { status: 400 }
            );
        }

        // Save uploaded file
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const savedFileName = `upload_${timestamp}_${safeFileName}`;
        const savedFilePath = path.join(UPLOAD_DIR, savedFileName);

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        fs.writeFileSync(savedFilePath, buffer);

        // If zip file, extract the SQL file
        let sqlFilePath = savedFilePath;
        if (ext === '.zip') {
            try {
                const zip = new AdmZip(savedFilePath);
                const zipEntries = zip.getEntries();
                const sqlEntry = zipEntries.find((entry: any) => entry.entryName.endsWith('.sql'));

                if (!sqlEntry) {
                    fs.unlinkSync(savedFilePath);
                    return NextResponse.json(
                        { error: 'No .sql file found inside the zip archive.' },
                        { status: 400 }
                    );
                }

                sqlFilePath = path.join(UPLOAD_DIR, `extracted_${timestamp}.sql`);
                fs.writeFileSync(sqlFilePath, sqlEntry.getData());
            } catch (zipError) {
                fs.unlinkSync(savedFilePath);
                return NextResponse.json(
                    { error: 'Failed to extract zip file. Please ensure it is a valid zip archive.' },
                    { status: 400 }
                );
            }
        }

        // Execute the SQL file against the database
        const connectionUrl = process.env.DATABASE_URL;
        if (!connectionUrl) {
            // Cleanup
            if (fs.existsSync(sqlFilePath)) fs.unlinkSync(sqlFilePath);
            if (ext === '.zip' && fs.existsSync(savedFilePath)) fs.unlinkSync(savedFilePath);
            return NextResponse.json({ error: 'DATABASE_URL not configured' }, { status: 500 });
        }

        const url = new URL(connectionUrl);
        const dbHost = url.hostname;
        const dbPort = url.port || '3306';
        const dbUser = url.username;
        const dbPass = url.password;
        const dbName = url.pathname.substring(1);

        try {
            const command = `mysql -h ${dbHost} -P ${dbPort} -u ${dbUser} ${dbPass ? `-p${dbPass}` : ''} ${dbName} < "${sqlFilePath}"`;
            await execAsync(command);
        } catch (execError: any) {
            // Cleanup files
            if (fs.existsSync(sqlFilePath)) fs.unlinkSync(sqlFilePath);
            if (ext === '.zip' && fs.existsSync(savedFilePath)) fs.unlinkSync(savedFilePath);

            console.error('SQL execution error:', execError);
            return NextResponse.json(
                { error: 'Failed to restore database from backup.', details: execError.stderr || execError.message },
                { status: 500 }
            );
        }

        // Cleanup temporary files
        try {
            if (fs.existsSync(sqlFilePath) && sqlFilePath !== savedFilePath) {
                fs.unlinkSync(sqlFilePath);
            }
            // Keep the original upload for reference
        } catch {
            // Ignore cleanup errors
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
            { error: 'Failed to process backup upload', details: error.message },
            { status: 500 }
        );
    }
}
