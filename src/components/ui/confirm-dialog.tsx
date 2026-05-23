'use client';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Trash2, ShieldAlert } from 'lucide-react';
import type { ConfirmOptions } from '@/hooks/use-confirm';

interface ConfirmDialogProps extends ConfirmOptions {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title = 'Confirm Action',
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'destructive',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const isDestructive = variant === 'destructive';
  const isWarning = variant === 'warning';

  const iconClass = isDestructive
    ? 'bg-red-500/10 text-red-500 ring-red-500/20'
    : isWarning
    ? 'bg-amber-500/10 text-amber-500 ring-amber-500/20'
    : 'bg-primary/10 text-primary ring-primary/20';

  const Icon = isDestructive ? Trash2 : isWarning ? AlertTriangle : ShieldAlert;

  const actionClass = isDestructive
    ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20'
    : isWarning
    ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20'
    : '';

  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <AlertDialogContent className="max-w-sm border border-foreground/10 bg-background/95 backdrop-blur-xl shadow-2xl rounded-2xl p-0 overflow-hidden gap-0">
        {/* Top accent bar */}
        <div
          className={`h-1 w-full ${
            isDestructive
              ? 'bg-gradient-to-r from-red-500 to-rose-600'
              : isWarning
              ? 'bg-gradient-to-r from-amber-400 to-amber-600'
              : 'bg-gradient-to-r from-primary to-violet-500'
          }`}
        />

        <div className="px-6 pt-6 pb-5 space-y-4">
          {/* Icon */}
          <div className="flex justify-center">
            <div className={`p-3 rounded-2xl ring-4 ${iconClass}`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>

          {/* Text */}
          <AlertDialogHeader className="space-y-1.5 text-center">
            <AlertDialogTitle className="text-base font-bold text-foreground text-center">
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground text-center leading-relaxed">
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* Buttons */}
          <AlertDialogFooter className="flex-row justify-center gap-3 sm:space-x-0 mt-2">
            <Button variant="outline" onClick={onCancel} className="flex-1 border-foreground/10 hover:bg-foreground/5 font-semibold" >
              {cancelText}
            </Button>
            <Button onClick={onConfirm} className={`flex-1 font-semibold ${actionClass}`} variant={isDestructive || isWarning ? 'default' : 'default'} >
              {confirmText}
            </Button>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
