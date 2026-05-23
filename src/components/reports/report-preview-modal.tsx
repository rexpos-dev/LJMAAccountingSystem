'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer, X } from 'lucide-react';

interface ReportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  htmlContent: string;
  title: string;
  onPrint?: () => void;
}

export function ReportPreviewModal({
  isOpen,
  onClose,
  htmlContent,
  title,
  onPrint,
}: ReportPreviewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[92vh] flex flex-col p-0 gap-0 bg-background">
        <DialogHeader className="px-5 py-3 border-b border-foreground/10 flex-row items-center justify-between shrink-0">
          <DialogTitle className="text-sm font-semibold text-foreground">
            Print Preview — {title}
          </DialogTitle>
          <div className="flex items-center gap-2">
            {onPrint && (
              <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={onPrint} >
                <Printer className="h-3.5 w-3.5" />
                Print
              </Button>
            )}
            <Button size="icon" variant="ghost" className="w-8" onClick={onClose} >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Preview iframe */}
        <div className="flex-1 overflow-hidden bg-zinc-200 dark:bg-zinc-800 p-4">
          <div className="h-full flex justify-center">
            <iframe
              srcDoc={htmlContent}
              className="w-full max-w-[794px] h-full bg-white shadow-xl rounded-sm border border-foreground/10"
              title={`Preview – ${title}`}
              sandbox="allow-same-origin"
            />
          </div>
        </div>

        <div className="px-5 py-2.5 border-t border-foreground/10 flex items-center justify-between shrink-0 bg-background">
          <p className="text-[10px] text-muted-foreground">
            This preview matches the printed output. A <span className="font-semibold text-red-500">CONFIDENTIAL</span> watermark will appear on all pages.
          </p>
          <Button size="sm" variant="ghost" className="text-xs" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
