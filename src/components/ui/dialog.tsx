"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-background/40 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { variant?: 'default' | 'top-drawer' }
>(({ className, children, variant = 'top-drawer', ...props }, ref) => {
  if (variant === 'top-drawer') {
    return (
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            "fixed inset-x-0 top-0 z-50 flex flex-col w-full mx-auto border-b border-foreground/10 bg-card/60 backdrop-blur-xl text-foreground p-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)] duration-500",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:slide-out-to-top-full data-[state=open]:slide-in-from-top-full",
            "rounded-b-[2.5rem]",
            className
          )}
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          {...props}
        >
          {/* Internal Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent z-0" />
          
          <div 
            className={cn(
              "relative z-10 max-h-[85vh] overflow-y-auto overflow-x-auto custom-scrollbar w-full [&>*:first-child]:pr-[80px]",
              !className?.match(/\bp-\d+\b|\bp-0\b/) && "p-6",
              className?.match(/\bflex\b/) && "flex",
              className?.match(/\bflex-col\b/) && "flex-col",
              className?.match(/\bflex-row\b/) && "flex-row",
              className?.match(/\bmd:flex-row\b/) && "md:flex-row",
              className?.match(/\bgrid\b/) && "grid",
              className?.match(/\bgap-\d+\b|\bgap-0\b/) ? className.match(/\bgap-\d+\b|\bgap-0\b/)?.[0] : (className?.match(/\bgrid\b/) ? "gap-4" : ""),
              className?.match(/\bh-\[.*?\]|\bh-full|\bh-screen|\bh-\d+\b/) && "h-full"
            )}
          >
            {children}
          </div>

          <div className="mx-auto mt-6 h-1 w-[60px] rounded-full bg-foreground/10" />
          
          <DialogPrimitive.Close className="absolute right-6 top-6 z-50 p-2 rounded-full bg-foreground/5 opacity-70 ring-offset-background transition-all hover:opacity-100 hover:bg-foreground/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPortal>
    );
  }

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4",
          "bg-card/80 backdrop-blur-2xl text-foreground p-0 shadow-[0_0_50px_rgba(0,0,0,0.5)] duration-300",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
          "rounded-[2rem] border border-foreground/10 overflow-hidden",
          className
        )}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        {...props}
      >
        {/* Subtle inner glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 blur-[80px] rounded-full pointer-events-none z-0" />
        
        <div 
          className={cn(
            "relative z-10 max-h-[85vh] overflow-y-auto overflow-x-auto custom-scrollbar w-full [&>*:first-child]:pr-[80px]",
            !className?.match(/\bp-\d+\b|\bp-0\b/) && "p-6",
            className?.match(/\bflex\b/) && "flex",
            className?.match(/\bflex-col\b/) && "flex-col",
            className?.match(/\bflex-row\b/) && "flex-row",
            className?.match(/\bmd:flex-row\b/) && "md:flex-row",
            className?.match(/\bgrid\b/) && "grid",
            className?.match(/\bgap-\d+\b|\bgap-0\b/) ? className.match(/\bgap-\d+\b|\bgap-0\b/)?.[0] : (className?.match(/\bgrid\b/) ? "gap-4" : ""),
            className?.match(/\bh-\[.*?\]|\bh-full|\bh-screen|\bh-\d+\b/) && "h-full"
          )}
        >
          {children}
        </div>

        <DialogPrimitive.Close className="absolute right-6 top-6 z-50 p-2 rounded-full bg-foreground/5 opacity-70 ring-offset-background transition-all hover:opacity-100 hover:bg-foreground/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
})
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left mb-4",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 mt-6 pt-4 border-t border-foreground/5",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-2xl font-black tracking-tight text-foreground uppercase italic font-headline",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-foreground/50 font-medium tracking-wide", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
