import React from 'react';

interface CanvasGridProps {
  zoom: number;
}

export const CanvasGrid: React.FC<CanvasGridProps> = ({ zoom }) => {
  const gridSize = 20 * zoom;
  const opacity = Math.min(0.3, zoom * 0.3);

  return (
    <div 
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(156, 163, 175, ${opacity}) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(156, 163, 175, ${opacity}) 1px, transparent 1px)
        `,
        backgroundSize: `${gridSize}px ${gridSize}px`,
      }}
    />
  );
};