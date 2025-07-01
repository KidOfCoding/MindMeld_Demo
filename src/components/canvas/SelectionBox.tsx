import React from 'react';
import { Rect } from 'react-konva';
import { Point } from '../../types/canvas';

interface SelectionBoxProps {
  start: Point;
  end: Point;
}

export const SelectionBox: React.FC<SelectionBoxProps> = ({ start, end }) => {
  const x = Math.min(start.x, end.x);
  const y = Math.min(start.y, end.y);
  const width = Math.abs(end.x - start.x);
  const height = Math.abs(end.y - start.y);

  return (
    <Rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill="rgba(59, 130, 246, 0.1)"
      stroke="#3B82F6"
      strokeWidth={1}
      dash={[5, 5]}
    />
  );
};