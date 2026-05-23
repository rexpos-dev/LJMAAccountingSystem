'use client';

import { RefObject, useState, useCallback } from 'react';
import { buildPrintDocument } from '@/lib/report-print';

interface UseReportActionsOptions {
  contentRef: RefObject<HTMLElement | null>;
  title: string;
  subtitle?: string;
}

export function useReportActions({ contentRef, title, subtitle }: UseReportActionsOptions) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const getContentHtml = useCallback(() => {
    return contentRef.current?.innerHTML ?? '';
  }, [contentRef]);

  const openPrintWindow = useCallback((autoprint: boolean, saveMode = false) => {
    const contentHtml = getContentHtml();
    if (!contentHtml) return;

    const doc = buildPrintDocument({ title, subtitle, contentHtml });
    const win = window.open('', '_blank', 'width=900,height=750');
    if (!win) {
      alert('Please allow popups for this site to use Preview/Print/Save.');
      return;
    }
    win.document.write(doc);
    win.document.close();
    win.focus();

    if (saveMode) {
      // Show save-as-PDF hint in the print dialog
      const hint = win.document.createElement('div');
      hint.style.cssText =
        'position:fixed;top:12px;right:12px;background:#1e293b;color:#f8fafc;font-family:Arial,sans-serif;' +
        'font-size:11px;padding:10px 14px;border-radius:8px;z-index:99999;max-width:220px;line-height:1.5;';
      hint.innerHTML =
        '<strong style="color:#34d399;">Save as PDF</strong><br/>In the print dialog, change the <em>Destination</em> to <strong>"Save as PDF"</strong> and click Save.';
      win.document.body.appendChild(hint);
    }

    if (autoprint) {
      setTimeout(() => {
        win.print();
      }, 600);
    }
  }, [getContentHtml, title, subtitle]);

  const handlePreview = useCallback(() => {
    const contentHtml = getContentHtml();
    if (!contentHtml) return;
    const html = buildPrintDocument({ title, subtitle, contentHtml });
    setPreviewHtml(html);
    setIsPreviewOpen(true);
  }, [getContentHtml, title, subtitle]);

  const handlePrint = useCallback(() => {
    openPrintWindow(true, false);
  }, [openPrintWindow]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      openPrintWindow(true, true);
    } finally {
      // Small delay so the button spinner shows briefly
      setTimeout(() => setIsSaving(false), 800);
    }
  }, [openPrintWindow]);

  return {
    isPreviewOpen,
    setIsPreviewOpen,
    previewHtml,
    handlePreview,
    handlePrint,
    handleSave,
    isSaving,
  };
}
