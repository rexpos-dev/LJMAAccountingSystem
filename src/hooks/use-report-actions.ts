'use client';

import { RefObject, useState, useCallback, useEffect } from 'react';
import { buildPrintDocument, BusinessInfo } from '@/lib/report-print';
import { exportTableToCSV } from '@/lib/excel-export';

interface UseReportActionsOptions {
  contentRef: RefObject<HTMLElement | null>;
  title: string;
  subtitle?: string;
}

export function useReportActions({ contentRef, title, subtitle }: UseReportActionsOptions) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [business, setBusiness] = useState<BusinessInfo | undefined>(undefined);

  useEffect(() => {
    fetch('/api/business-profile')
      .then((res) => res.ok ? res.json() : null)
      .then((data) => { if (data) setBusiness(data); })
      .catch(() => {});
  }, []);

  const getContentHtml = useCallback(() => {
    return contentRef.current?.innerHTML ?? '';
  }, [contentRef]);

  const openPrintWindow = useCallback((autoprint: boolean, saveMode = false) => {
    const contentHtml = getContentHtml();
    if (!contentHtml) return;

    const doc = buildPrintDocument({ title, subtitle, contentHtml, business });
    const win = window.open('', '_blank', 'width=900,height=750');
    if (!win) {
      alert('Please allow popups for this site to use Preview/Print/Save.');
      return;
    }
    win.document.write(doc);
    win.document.close();
    win.focus();

    if (saveMode) {
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
  }, [getContentHtml, title, subtitle, business]);

  const handlePreview = useCallback(() => {
    const contentHtml = getContentHtml();
    if (!contentHtml) return;
    const html = buildPrintDocument({ title, subtitle, contentHtml, business });
    setPreviewHtml(html);
    setIsPreviewOpen(true);
  }, [getContentHtml, title, subtitle, business]);

  const handlePrint = useCallback(() => {
    openPrintWindow(true, false);
  }, [openPrintWindow]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      openPrintWindow(true, true);
    } finally {
      setTimeout(() => setIsSaving(false), 800);
    }
  }, [openPrintWindow]);

  const handleExportCSV = useCallback(() => {
    if (!contentRef.current) return;
    exportTableToCSV(contentRef.current, title);
  }, [contentRef, title]);

  return {
    isPreviewOpen,
    setIsPreviewOpen,
    previewHtml,
    handlePreview,
    handlePrint,
    handleSave,
    handleExportCSV,
    isSaving,
  };
}
