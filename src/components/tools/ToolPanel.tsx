import React from 'react';
import { motion } from 'framer-motion';
import { 
  MousePointer, 
  Square, 
  Circle, 
  Type, 
  StickyNote, 
  ArrowRight, 
  Image, 
  Pen,
  Eraser,
  Hand
} from 'lucide-react';

interface ToolPanelProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
}

export const ToolPanel: React.FC<ToolPanelProps> = ({ selectedTool, onToolSelect }) => {
  const tools = [
    { id: 'select', icon: MousePointer, label: 'Select', shortcut: 'V' },
    { id: 'hand', icon: Hand, label: 'Hand', shortcut: 'H' },
    { id: 'sticky', icon: StickyNote, label: 'Sticky Note', shortcut: 'S' },
    { id: 'text', icon: Type, label: 'Text', shortcut: 'T' },
    { id: 'rectangle', icon: Square, label: 'Rectangle', shortcut: 'R' },
    { id: 'circle', icon: Circle, label: 'Circle', shortcut: 'O' },
    { id: 'arrow', icon: ArrowRight, label: 'Arrow', shortcut: 'A' },
    { id: 'pen', icon: Pen, label: 'Pen', shortcut: 'P' },
    { id: 'image', icon: Image, label: 'Image', shortcut: 'I' },
    { id: 'eraser', icon: Eraser, label: 'Eraser', shortcut: 'E' },
  ];

  // Color palette aligned properly below shapes
  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', 
    '#EF4444', '#8B5CF6', '#06B6D4',
    '#84CC16', '#F97316', '#EC4899',
    '#6B7280', '#1F2937', '#FFFFFF'
  ];

  return (
    <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-2">
      {tools.map((tool) => {
        const Icon = tool.icon;
        const isSelected = selectedTool === tool.id;
        
        return (
          <motion.button
            key={tool.id}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onToolSelect(tool.id)}
            className={`relative w-12 h-12 flex items-center justify-center rounded-xl transition-all group ${
              isSelected 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
            title={`${tool.label} (${tool.shortcut})`}
          >
            <Icon className="w-5 h-5" />
            
            {/* Tooltip */}
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              {tool.label} ({tool.shortcut})
            </div>
          </motion.button>
        );
      })}
      
      {/* Divider */}
      <div className="w-8 h-px bg-gray-200 my-2" />
      
      {/* Color Palette - Properly Aligned */}
      <div className="flex flex-col items-center space-y-1">
        <div className="text-xs text-gray-500 mb-1">Colors</div>
        <div className="grid grid-cols-2 gap-1">
          {colors.map((color) => (
            <motion.button
              key={color}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-6 h-6 rounded-md border-2 border-white shadow-sm hover:shadow-md transition-all"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};