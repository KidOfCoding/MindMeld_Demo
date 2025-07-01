import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Lightbulb } from 'lucide-react';

interface DemoTooltipProps {
  isVisible: boolean;
  position: { x: number; y: number };
  title: string;
  description: string;
  step?: number;
  totalSteps?: number;
}

export const DemoTooltip: React.FC<DemoTooltipProps> = ({
  isVisible,
  position,
  title,
  description,
  step,
  totalSteps
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          className="fixed pointer-events-none z-50"
          style={{
            left: position.x,
            top: position.y,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-4 max-w-xs">
            {/* Header */}
            <div className="flex items-center space-x-2 mb-2">
              <div className="p-1 bg-blue-100 rounded">
                <Lightbulb className="w-4 h-4 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>
              {step && totalSteps && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {step}/{totalSteps}
                </span>
              )}
            </div>
            
            {/* Description */}
            <p className="text-sm text-gray-600 mb-3">{description}</p>
            
            {/* Arrow */}
            <div className="flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-blue-500 animate-bounce" style={{ transform: 'rotate(90deg)' }} />
            </div>
          </div>
          
          {/* Pointer */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2">
            <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white"></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};