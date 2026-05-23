'use client';

import { RefObject } from 'react';
import { Button } from '@/components/ui/button';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { ListVideo, Printer, Save, Loader2 } from 'lucide-react';
import { useReportActions } from '@/hooks/use-report-actions';
import { ReportPreviewModal } from './report-preview-modal';
import { useDialog } from '@/components/layout/dialog-context';

interface ReportToolbarProps {
  contentRef: RefObject<HTMLElement | null>;
  title: string;
  subtitle?: string;
  /** The dialog key used by closeDialog() */
  closeKey: string;
  /** Extra toolbar buttons after the core three */
  extra?: React.ReactNode;
}

export function ReportToolbar({
  contentRef,
  title,
  subtitle,
  closeKey,
  extra,
}: ReportToolbarProps) {
  const { closeDialog } = useDialog();
  const {
    isPreviewOpen,
    setIsPreviewOpen,
    previewHtml,
    handlePreview,
    handlePrint,
    handleSave,
    isSaving,
  } = useReportActions({ contentRef, title, subtitle });

  return (
    <>
      {/* ── Menubar ── */}
      <Menubar className="rounded-none border-x-0 border-b border-t-0">
        <MenubarMenu>
          <MenubarTrigger>Report</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={handlePreview}>Print Preview</MenubarItem>
            <MenubarItem onClick={handlePrint}>Print</MenubarItem>
            <MenubarItem onClick={handleSave}>Save as PDF</MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={() => closeDialog(closeKey)}>Close</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Help</MenubarTrigger>
        </MenubarMenu>
      </Menubar>

      {/* ── Button Toolbar ── */}
      <div className="flex items-center gap-1 p-2 border-b">
        <Button variant="ghost" size="sm" className="flex-col h-auto gap-0.5 px-3 hover:bg-primary/10" onClick={handlePreview} title="Print Preview" >
          <ListVideo className="h-5 w-5" />
          <span className="text-[10px]">Preview</span>
        </Button>

        <Button variant="ghost" size="sm" className="flex-col h-auto gap-0.5 px-3 hover:bg-primary/10" onClick={handlePrint} title="Print document with CONFIDENTIAL watermark" >
          <Printer className="h-5 w-5" />
          <span className="text-[10px]">Print</span>
        </Button>

        <Button variant="ghost" size="sm" className="flex-col h-auto gap-0.5 px-3 hover:bg-primary/10" onClick={handleSave} disabled={isSaving} title="Save as PDF" >
          {isSaving
            ? <Loader2 className="h-5 w-5 animate-spin" />
            : <Save className="h-5 w-5" />
          }
          <span className="text-[10px]">{isSaving ? 'Saving…' : 'Save'}</span>
        </Button>

        {extra}
      </div>

      {/* ── Preview Modal ── */}
      <ReportPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        htmlContent={previewHtml}
        title={title}
        onPrint={handlePrint}
      />
    </>
  );
}
