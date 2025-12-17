
"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface FlowchartNodeProps {
  id: string;
  content: string;
  position: { top: number; left: number };
  color: string;
  size: { width: number; height: number };
  disabled?: boolean;
  onClick?: () => void;
}

export function FlowchartNode({ id, content, position, color, size, disabled, onClick }: FlowchartNodeProps) {
  const isClickable = !!onClick && !disabled;
  return (
    <div
      id={id}
      onClick={onClick}
      className={cn(
        "absolute flex items-center justify-center p-2 rounded-md shadow-lg text-white text-center font-medium",
        color,
        {
          "opacity-50 cursor-not-allowed": disabled,
          "cursor-pointer hover:ring-2 hover:ring-primary": isClickable,
        }
      )}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
      }}
    >
      {content}
    </div>
  );
}
