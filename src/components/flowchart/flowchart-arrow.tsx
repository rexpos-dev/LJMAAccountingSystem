"use client";

import React from 'react';

type Node = {
  id: string;
  position: { top: number; left: number };
  size: { width: number; height: number };
};

type Direction = 'top' | 'bottom' | 'left' | 'right';

interface FlowchartArrowProps {
  fromNode: Node;
  toNode: Node;
  fromDirection: Direction;
  toDirection: Direction;
}

const getConnectorPoint = (node: Node, direction: Direction) => {
  switch (direction) {
    case 'top':
      return { x: node.position.left + node.size.width / 2, y: node.position.top };
    case 'bottom':
      return { x: node.position.left + node.size.width / 2, y: node.position.top + node.size.height };
    case 'left':
      return { x: node.position.left, y: node.position.top + node.size.height / 2 };
    case 'right':
      return { x: node.position.left + node.size.width, y: node.position.top + node.size.height / 2 };
  }
};

export function FlowchartArrow({ fromNode, toNode, fromDirection, toDirection }: FlowchartArrowProps) {
  const start = getConnectorPoint(fromNode, fromDirection);
  const end = getConnectorPoint(toNode, toDirection);

  const midY = (start.y + end.y) / 2;

  // Use a cubic bezier curve for a smoother look
  const pathD = `M ${start.x} ${start.y} 
                 C ${start.x} ${midY}, 
                   ${end.x} ${midY}, 
                   ${end.x} ${end.y}`;

  const gradientId = `grad-${fromNode.id}-${toNode.id}`;

  return (
    <svg
      className="absolute top-0 left-0 w-full h-full"
      style={{ pointerEvents: 'none' }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
        </linearGradient>
      </defs>
      
      {/* Background/Glow Path */}
      <path
        d={pathD}
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="4"
        fill="none"
        className="blur-[4px]"
      />

      {/* Main Path */}
      <path
        d={pathD}
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        fill="none"
        strokeDasharray="6 6"
        className="animate-[flow_30s_linear_infinite]"
      />

      <style jsx global>{`
        @keyframes flow {
          from { stroke-dashoffset: 200; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </svg>
  );
}
