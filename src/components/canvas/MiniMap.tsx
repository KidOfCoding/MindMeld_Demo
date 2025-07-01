import React from 'react';
import { motion } from 'framer-motion';
import { X, Maximize2 } from 'lucide-react';
import { CanvasObject, Point } from '../../types/canvas';

interface MiniMapProps {
  objects: CanvasObject[];
  viewport: { x: number; y: number; zoom: number };
  canvasSize: { width: number; height: number };
  onViewportChange: (viewport: { x: number; y: number; zoom: number }) => void;
}

export const MiniMap: React.FC<MiniMapProps> = ({
  objects,
  viewport,
  canvasSize,
  onViewportChange
}) => {
  const miniMapSize = { width: 200, height: 150 };
  const scale = 0.1; // Scale factor for mini map

  // Calculate bounds of all objects
  const bounds = objects.reduce((acc, obj) => {
    const left = obj.position.x;
    const top = obj.position.y;
    const right = obj.position.x + obj.size.width;
    const bottom = obj.position.y + obj.size.height;

    return {
      left: Math.min(acc.left, left),
      top: Math.min(acc.top, top),
      right: Math.max(acc.right, right),
      bottom: Math.max(acc.bottom, bottom)
    };
  }, { left: 0, top: 0, right: canvasSize.width, bottom: canvasSize.height });

  const contentWidth = bounds.right - bounds.left;
  const contentHeight = bounds.bottom - bounds.top;

  // Calculate viewport rectangle in mini map coordinates
  const viewportRect = {
    x: (-viewport.x / viewport.zoom) * scale,
    y: (-viewport.y / viewport.zoom) * scale,
    width: (canvasSize.width / viewport.zoom) * scale,
    height: (canvasSize.height / viewport.zoom) * scale
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="absolute bottom-20 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-50"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-gray-700">Mini Map</h3>
        <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
          <X className="w-3 h-3" />
        </button>
      </div>

      <div 
        className="relative bg-gray-50 border border-gray-200 rounded overflow-hidden cursor-pointer"
        style={{ width: miniMapSize.width, height: miniMapSize.height }}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          // Convert mini map coordinates to canvas coordinates
          const canvasX = (x / scale) * viewport.zoom - canvasSize.width / 2;
          const canvasY = (y / scale) * viewport.zoom - canvasSize.height / 2;
          
          onViewportChange({
            x: -canvasX,
            y: -canvasY,
            zoom: viewport.zoom
          });
        }}
      >
        {/* Render objects as small rectangles */}
        {objects.map((obj) => (
          <div
            key={obj.id}
            className="absolute border border-gray-400"
            style={{
              left: (obj.position.x - bounds.left) * scale,
              top: (obj.position.y - bounds.top) * scale,
              width: Math.max(2, obj.size.width * scale),
              height: Math.max(2, obj.size.height * scale),
              backgroundColor: obj.style.fill || '#3B82F6',
              opacity: 0.7
            }}
          />
        ))}

        {/* Viewport indicator */}
        <div
          className="absolute border-2 border-blue-500 bg-blue-100 bg-opacity-30"
          style={{
            left: Math.max(0, viewportRect.x),
            top: Math.max(0, viewportRect.y),
            width: Math.min(miniMapSize.width, viewportRect.width),
            height: Math.min(miniMapSize.height, viewportRect.height)
          }}
        />
      </div>

      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
        <span>{objects.length} objects</span>
        <button className="p-1 hover:text-gray-700">
          <Maximize2 className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
};