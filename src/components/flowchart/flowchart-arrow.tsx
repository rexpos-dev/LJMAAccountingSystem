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

  const pathD = `M ${start.x} ${start.y} L ${start.x} ${midY} L ${end.x} ${midY} L ${end.x} ${end.y}`;

  return (
    <svg
      className="absolute top-0 left-0 w-full h-full"
      style={{ pointerEvents: 'none' }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="0"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#fff" />
        </marker>
      </defs>
      <path
        d={pathD}
        stroke="#fff"
        strokeWidth="2"
        fill="none"
        markerEnd="url(#arrowhead)"
      />
    </svg>
  );
}
