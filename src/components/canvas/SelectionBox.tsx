import React from 'react';
import { motion } from 'framer-motion';

interface SelectionBoxProps {
  start: { x: number; y: number };
  end: { x: number; y: number };
}

export const SelectionBox: React.FC<SelectionBoxProps> = ({ start, end }) => {
  const left = Math.min(start.x, end.x);
  const top = Math.min(start.y, end.y);
  const width = Math.abs(end.x - start.x);
  const height = Math.abs(end.y - start.y);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute border-2 border-blue-500 bg-blue-100/20 pointer-events-none z-40"
      style={{
        left,
        top,
        width,
        height,
      }}
    />
  );
};