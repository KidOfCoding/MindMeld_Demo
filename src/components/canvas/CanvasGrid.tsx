import React from 'react';
import { Line } from 'react-konva';

interface CanvasGridProps {
  width: number;
  height: number;
  gridSize: number;
  zoom: number;
}

export const CanvasGrid: React.FC<CanvasGridProps> = ({
  width,
  height,
  gridSize,
  zoom
}) => {
  const lines = [];
  const adjustedGridSize = gridSize * zoom;
  const opacity = Math.min(0.3, zoom * 0.5);

  // Vertical lines
  for (let i = 0; i <= width / adjustedGridSize; i++) {
    lines.push(
      <Line
        key={`v-${i}`}
        points={[i * adjustedGridSize, 0, i * adjustedGridSize, height]}
        stroke="#E5E7EB"
        strokeWidth={1}
        opacity={opacity}
      />
    );
  }

  // Horizontal lines
  for (let i = 0; i <= height / adjustedGridSize; i++) {
    lines.push(
      <Line
        key={`h-${i}`}
        points={[0, i * adjustedGridSize, width, i * adjustedGridSize]}
        stroke="#E5E7EB"
        strokeWidth={1}
        opacity={opacity}
      />
    );
  }

  return <>{lines}</>;
};