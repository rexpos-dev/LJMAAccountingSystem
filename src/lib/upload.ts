import path from 'path';
import fs from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/csv',
];

export function ensureUploadDir() {
    if (!existsSync(UPLOAD_DIR)) {
        mkdirSync(UPLOAD_DIR, { recursive: true });
    }
}

export async function saveUploadedFile(formData: FormData, entityType: string): Promise<{
    fileName: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
}> {
    ensureUploadDir();

    const file = formData.get('file') as File;
    if (!file) throw new Error('No file provided');
    if (file.size > MAX_FILE_SIZE) throw new Error('File exceeds 10 MB limit');
    if (!ALLOWED_TYPES.includes(file.type)) throw new Error(`File type not allowed: ${file.type}`);

    const ext = path.extname(file.name) || '';
    const uniqueName = `${entityType}_${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`;
    const filePath = path.join(UPLOAD_DIR, uniqueName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    return {
        fileName: uniqueName,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        url: `/uploads/${uniqueName}`,
    };
}

export async function deleteUploadedFile(fileName: string) {
    const filePath = path.join(UPLOAD_DIR, fileName);
    try {
        await fs.unlink(filePath);
    } catch {
        // File may already be deleted — ignore
    }
}
