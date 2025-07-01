import React, { useState, useRef } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { X, Edit3, Type, Palette, Bold, Italic } from 'lucide-react';
import { CanvasElement } from '../../types';

interface TextElementProps {
  element: CanvasElement;
  onUpdate: (updates: Partial<CanvasElement>) => void;
  onRemove: () => void;
  onSelect: () => void;
  isSelected: boolean;
  zoom: number;
  snapToGrid: boolean;
}

export const TextElement: React.FC<TextElementProps> = ({
  element,
  onUpdate,
  onRemove,
  onSelect,
  isSelected,
  zoom,
  snapToGrid
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(element.content || '');
  const [isHovered, setIsHovered] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragControls = useDragControls();
  const textRef = useRef<HTMLDivElement>(null);

  const snapToGridPosition = (position: { x: number; y: number }) => {
    if (!snapToGrid) return position;
    const gridSize = 20;
    return {
      x: Math.round(position.x / gridSize) * gridSize,
      y: Math.round(position.y / gridSize) * gridSize
    };
  };

  const handleDragEnd = (event: any, info: any) => {
    let newPosition = {
      x: element.position.x + info.offset.x / zoom,
      y: element.position.y + info.offset.y / zoom
    };
    
    newPosition = snapToGridPosition(newPosition);
    onUpdate({ position: newPosition });
  };

  const handleTextSave = () => {
    onUpdate({ content: editText });
    setIsEditing(false);
  };

  const fontSizes = [12, 14, 16, 18, 20, 24, 28, 32, 36, 48];
  const colors = [
    '#1F2937', '#EF4444', '#3B82F6', '#10B981', '#F59E0B', 
    '#8B5CF6', '#EC4899', '#6B7280', '#000000', '#FFFFFF'
  ];

  return (
    <motion.div
      ref={textRef}
      drag
      dragControls={dragControls}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: isSelected ? 1 : 1.02 }}
      className={`absolute cursor-move select-none z-20 ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
      }`}
      style={{
        left: element.position.x,
        top: element.position.y,
        minWidth: element.size.width,
        minHeight: element.size.height,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="p-3 bg-white/95 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm min-h-[40px] flex items-center"
        style={{
          color: element.style.textColor,
          fontSize: element.style.fontSize || 16,
        }}
      >
        {isEditing ? (
          <textarea
            autoFocus
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleTextSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleTextSave();
              } else if (e.key === 'Escape') {
                setEditText(element.content || '');
                setIsEditing(false);
              }
            }}
            className="bg-transparent outline-none resize-none w-full min-h-[20px] leading-relaxed"
            style={{ 
              color: element.style.textColor,
              fontSize: element.style.fontSize || 16
            }}
          />
        ) : (
          <div 
            onDoubleClick={() => setIsEditing(true)}
            className="whitespace-pre-wrap min-h-[20px] leading-relaxed cursor-text"
          >
            {element.content || 'Click to edit text'}
          </div>
        )}
      </div>

      {/* Advanced Controls */}
      {(isHovered || isSelected) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-12 left-0 flex items-center space-x-1 bg-white rounded-lg shadow-lg border border-gray-200 p-1"
        >
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Edit text"
          >
            <Edit3 className="w-3 h-3" />
          </button>
          
          {/* Font Size */}
          <div className="relative group">
            <button className="p-1 text-gray-600 hover:bg-gray-50 rounded transition-colors">
              <Type className="w-3 h-3" />
            </button>
            <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-2 opacity-0 group-hover:opacity-100 transition-opacity z-50">
              <div className="grid grid-cols-5 gap-1">
                {fontSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => onUpdate({ 
                      style: { 
                        ...element.style, 
                        fontSize: size
                      } 
                    })}
                    className={`px-2 py-1 text-xs rounded hover:bg-gray-100 transition-colors ${
                      element.style.fontSize === size ? 'bg-blue-100 text-blue-600' : ''
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Text Color */}
          <div className="relative group">
            <button className="p-1 text-purple-600 hover:bg-purple-50 rounded transition-colors">
              <Palette className="w-3 h-3" />
            </button>
            <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-2 opacity-0 group-hover:opacity-100 transition-opacity z-50">
              <div className="grid grid-cols-5 gap-1">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => onUpdate({ 
                      style: { 
                        ...element.style, 
                        textColor: color
                      } 
                    })}
                    className="w-4 h-4 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <button
            onClick={onRemove}
            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete"
          >
            <X className="w-3 h-3" />
          </button>
        </motion.div>
      )}

      {/* Resize Handle */}
      {isSelected && (
        <div
          className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-se-resize"
          onMouseDown={(e) => {
            e.stopPropagation();
            setIsResizing(true);
          }}
        />
      )}
    </motion.div>
  );
};