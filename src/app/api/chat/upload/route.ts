import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Ensure upload directory exists
        const uploadDir = join(process.cwd(), 'public', 'uploads', 'chat');
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) { }

        const fileExtension = file.name.split('.').pop();
        const fileName = `${randomUUID()}.${fileExtension}`;
        const filePath = join(uploadDir, fileName);

        await writeFile(filePath, buffer);

        const fileUrl = `/uploads/chat/${fileName}`;

        return NextResponse.json({
            fileUrl,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
