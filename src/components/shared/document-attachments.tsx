'use client';

import { useEffect, useRef, useState } from 'react';
import { Paperclip, Upload, Trash2, FileText, FileImage, File, Loader2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DocumentRecord {
    id: string;
    originalName: string;
    fileName: string;
    mimeType: string;
    size: number;
    uploadedBy: string;
    createdAt: string;
}

interface DocumentAttachmentsProps {
    entityType: string;
    entityId: string;
    className?: string;
}

function formatBytes(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileIcon({ mimeType }: { mimeType: string }) {
    if (mimeType.startsWith('image/')) return <FileImage className="h-4 w-4 text-blue-500" />;
    if (mimeType === 'application/pdf') return <FileText className="h-4 w-4 text-red-500" />;
    return <File className="h-4 w-4 text-muted-foreground" />;
}

export function DocumentAttachments({ entityType, entityId, className }: DocumentAttachmentsProps) {
    const [docs, setDocs] = useState<DocumentRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchDocs = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/documents?entityType=${entityType}&entityId=${encodeURIComponent(entityId)}`);
            if (res.ok) setDocs(await res.json());
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (entityId) fetchDocs();
    }, [entityType, entityId]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const form = new FormData();
            form.append('file', file);
            form.append('entityType', entityType);
            form.append('entityId', entityId);

            const res = await fetch('/api/documents', { method: 'POST', body: form });
            if (res.ok) {
                await fetchDocs();
            } else {
                const data = await res.json();
                alert(data.error || 'Upload failed');
            }
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Remove this attachment?')) return;
        setDeletingId(id);
        try {
            await fetch(`/api/documents/${id}`, { method: 'DELETE' });
            setDocs((prev) => prev.filter((d) => d.id !== id));
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className={cn('space-y-3', className)}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    <Paperclip className="h-4 w-4" />
                    Attachments {docs.length > 0 && <span className="text-foreground">({docs.length})</span>}
                </div>
                <div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png,.webp,.xls,.xlsx,.doc,.docx,.csv"
                        onChange={handleUpload}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={uploading}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {uploading ? (
                            <><Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />Uploading...</>
                        ) : (
                            <><Upload className="mr-1.5 h-3.5 w-3.5" />Attach File</>
                        )}
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading attachments...
                </div>
            ) : docs.length === 0 ? (
                <p className="text-xs text-muted-foreground py-1">No attachments yet. Accepted: PDF, Images, Excel, Word, CSV (max 10 MB)</p>
            ) : (
                <div className="space-y-1.5">
                    {docs.map((doc) => (
                        <div
                            key={doc.id}
                            className="flex items-center gap-2 rounded-md border border-border/60 bg-muted/30 px-3 py-2"
                        >
                            <FileIcon mimeType={doc.mimeType} />
                            <div className="flex-1 min-w-0">
                                <a
                                    href={`/uploads/${doc.fileName}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs font-medium hover:underline truncate block"
                                    title={doc.originalName}
                                >
                                    {doc.originalName}
                                </a>
                                <p className="text-[10px] text-muted-foreground">
                                    {formatBytes(doc.size)} &middot; {doc.uploadedBy} &middot;{' '}
                                    {new Date(doc.createdAt).toLocaleDateString('en-PH')}
                                </p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                <a href={`/uploads/${doc.fileName}`} download={doc.originalName}>
                                    <Button type="button" variant="ghost" size="icon" className="h-7 w-7">
                                        <Download className="h-3.5 w-3.5" />
                                    </Button>
                                </a>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-destructive hover:text-destructive"
                                    disabled={deletingId === doc.id}
                                    onClick={() => handleDelete(doc.id)}
                                >
                                    {deletingId === doc.id
                                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        : <Trash2 className="h-3.5 w-3.5" />
                                    }
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
