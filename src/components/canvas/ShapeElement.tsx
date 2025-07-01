import React, { useState, useRef } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { X, Edit3, RotateCw, Palette, Lock } from 'lucide-react';
import { CanvasElement } from '../../types';

interface ShapeElementProps {
  element: CanvasElement;
  onUpdate: (updates: Partial<CanvasElement>) => void;
  onRemove: () => void;
  onSelect: () => void;
  isSelected: boolean;
  zoom: number;
  snapToGrid: boolean;
}

export const ShapeElement: React.FC<ShapeElementProps> = ({
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
  const [resizeHandle, setResizeHandle] = useState<string>('');
  const dragControls = useDragControls();
  const elementRef = useRef<HTMLDivElement>(null);

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

  const handleResizeStart = (handle: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeHandle(handle);
  };

  const handleResize = (e: React.MouseEvent) => {
    if (!isResizing || !elementRef.current) return;
    
    const rect = elementRef.current.getBoundingClientRect();
    const deltaX = e.clientX - rect.left;
    const deltaY = e.clientY - rect.top;
    
    let newSize = { ...element.size };
    
    switch (resizeHandle) {
      case 'se':
        newSize.width = Math.max(50, deltaX / zoom);
        newSize.height = Math.max(30, deltaY / zoom);
        break;
      case 'sw':
        newSize.width = Math.max(50, element.size.width - deltaX / zoom);
        newSize.height = Math.max(30, deltaY / zoom);
        break;
      case 'ne':
        newSize.width = Math.max(50, deltaX / zoom);
        newSize.height = Math.max(30, element.size.height - deltaY / zoom);
        break;
      case 'nw':
        newSize.width = Math.max(50, element.size.width - deltaX / zoom);
        newSize.height = Math.max(30, element.size.height - deltaY / zoom);
        break;
    }
    
    onUpdate({ size: newSize });
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    setResizeHandle('');
  };

  const isCircle = element.content?.toLowerCase().includes('circle');

  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6B7280'
  ];

  return (
    <motion.div
      ref={elementRef}
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
        width: element.size.width,
        height: element.size.height,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleResize}
      onMouseUp={handleResizeEnd}
    >
      <div
        className={`w-full h-full flex items-center justify-center text-sm font-medium border-2 shadow-lg transition-all duration-200 ${
          isCircle ? 'rounded-full' : 'rounded-lg'
        }`}
        style={{
          backgroundColor: element.style.backgroundColor,
          borderColor: element.style.borderColor,
          color: element.style.textColor,
        }}
      >
        {isEditing ? (
          <input
            autoFocus
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleTextSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleTextSave();
              } else if (e.key === 'Escape') {
                setEditText(element.content || '');
                setIsEditing(false);
              }
            }}
            className="bg-transparent text-center outline-none w-full px-2"
            style={{ color: element.style.textColor }}
          />
        ) : (
          <span onDoubleClick={() => setIsEditing(true)}>
            {element.content}
          </span>
        )}
      </div>

      {/* Resize Handles */}
      {isSelected && (
        <>
          <div
            className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-nw-resize"
            onMouseDown={handleResizeStart('nw')}
          />
          <div
            className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-ne-resize"
            onMouseDown={handleResizeStart('ne')}
          />
          <div
            className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-sw-resize"
            onMouseDown={handleResizeStart('sw')}
          />
          <div
            className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-se-resize"
            onMouseDown={handleResizeStart('se')}
          />
        </>
      )}

      {/* Controls */}
      {(isHovered || isSelected) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-10 left-0 flex space-x-1 bg-white rounded-lg shadow-lg border border-gray-200 p-1"
        >
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Edit text"
          >
            <Edit3 className="w-3 h-3" />
          </button>
          
          <div className="relative group">
            <button className="p-1 text-purple-600 hover:bg-purple-50 rounded transition-colors">
              <Palette className="w-3 h-3" />
            </button>
            <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="grid grid-cols-5 gap-1">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => onUpdate({ 
                      style: { 
                        ...element.style, 
                        backgroundColor: color,
                        borderColor: color
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
            onClick={() => {
              const newElement = {
                ...element,
                position: {
                  x: element.position.x + 20,
                  y: element.position.y + 20
                }
              };
              // This would trigger duplication in parent
            }}
            className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
            title="Duplicate"
          >
            <RotateCw className="w-3 h-3" />
          </button>
          
          <button
            onClick={onRemove}
            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete"
          >
            <X className="w-3 h-3" />
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};