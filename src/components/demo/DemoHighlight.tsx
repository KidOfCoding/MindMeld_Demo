import React from 'react';
import { motion } from 'framer-motion';

interface DemoHighlightProps {
  target: string;
  children: React.ReactNode;
  isActive?: boolean;
  pulse?: boolean;
}

export const DemoHighlight: React.FC<DemoHighlightProps> = ({ 
  target, 
  children, 
  isActive = false, 
  pulse = true 
}) => {
  if (!isActive) return <>{children}</>;

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
    >
      {children}
      
      {/* Highlight Overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-blue-500/20 rounded-lg" />
        
        {/* Border */}
        <motion.div
          className="absolute inset-0 border-4 border-blue-500 rounded-lg"
          animate={pulse ? {
            borderColor: ['#3B82F6', '#60A5FA', '#3B82F6'],
            scale: [1, 1.02, 1]
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Corner Indicators */}
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full animate-ping" />
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
        <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 rounded-full animate-ping" style={{ animationDelay: '1.5s' }} />
      </motion.div>
    </motion.div>
  );
};