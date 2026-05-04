import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";

interface FlowchartNodeProps {
  id: string;
  content: string;
  position: { top: number; left: number };
  color: string;
  size: { width: number; height: number };
  disabled?: boolean;
  onClick?: () => void;
  icon?: keyof typeof LucideIcons;
  description?: string;
  accentColor?: string;
}

export function FlowchartNode({ id, content, position, color, size, disabled, onClick, icon, description, accentColor }: FlowchartNodeProps) {
  const isClickable = !!onClick && !disabled;
  const Icon = icon ? (LucideIcons[icon] as React.ElementType) : null;

  return (
    <div
      id={id}
      onClick={onClick}
      className={cn(
        "absolute flex flex-col items-center justify-center p-3 rounded-xl shadow-2xl transition-all duration-300 group",
        "backdrop-blur-md border border-white/10 overflow-hidden",
        isClickable 
          ? "cursor-pointer hover:scale-105 active:scale-95 hover:border-white/30 hover:shadow-[0_0_20px_rgba(var(--primary),0.3)]" 
          : "opacity-40 cursor-not-allowed grayscale-[0.5]",
        color
      )}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        background: isClickable 
          ? `linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)`
          : undefined,
      }}
    >
      {/* Background Glow Effect */}
      {isClickable && (
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-2xl -z-10"
          style={{ background: accentColor || 'currentColor' }}
        />
      )}

      {/* Shine Effect */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="flex flex-col items-center gap-1.5 text-center">
        {Icon && (
          <div className={cn(
            "p-2 rounded-lg transition-colors",
            isClickable ? "bg-white/5 group-hover:bg-white/10" : "bg-transparent"
          )}>
            <Icon className="w-5 h-5 text-white/90" />
          </div>
        )}
        <div className="flex flex-col gap-0.5">
          <span className="text-[13px] font-bold text-white tracking-tight leading-tight">
            {content}
          </span>
          {description && (
            <span className="text-[10px] text-white/50 font-normal leading-tight px-2">
              {description}
            </span>
          )}
        </div>
      </div>

      {/* Bottom accent bar */}
      {accentColor && (
        <div 
          className="absolute bottom-0 left-0 h-[3px] w-full opacity-50"
          style={{ backgroundColor: accentColor }}
        />
      )}
    </div>
  );
}
