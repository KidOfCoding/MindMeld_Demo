import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { CanvasElement } from '../../types';

interface DrawingElementProps {
  element: CanvasElement;
  onRemove: () => void;
}

export const DrawingElement: React.FC<DrawingElementProps> = ({
  element,
  onRemove
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  let path: { x: number; y: number }[] = [];
  try {
    path = JSON.parse(element.content || '[]');
  } catch (e) {
    path = [];
  }

  if (path.length < 2) return null;

  const minX = Math.min(...path.map(p => p.x));
  const minY = Math.min(...path.map(p => p.y));
  const maxX = Math.max(...path.map(p => p.x));
  const maxY = Math.max(...path.map(p => p.y));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute pointer-events-none z-10"
      style={{
        left: minX - 10,
        top: minY - 10,
        width: maxX - minX + 20,
        height: maxY - minY + 20,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg 
        className="w-full h-full pointer-events-auto"
        viewBox={`0 0 ${maxX - minX + 20} ${maxY - minY + 20}`}
      >
        <path
          d={`M ${path.map(p => `${p.x - minX + 10},${p.y - minY + 10}`).join(' L ')}`}
          stroke={element.style.borderColor || '#3B82F6'}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="drop-shadow-sm"
        />
      </svg>

      {/* Remove Button */}
      {isHovered && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={onRemove}
          className="absolute top-0 right-0 p-1 bg-white text-red-600 rounded-full shadow-md hover:bg-red-50 transition-colors pointer-events-auto"
        >
          <X className="w-3 h-3" />
        </motion.button>
      )}
    </motion.div>
  );
};