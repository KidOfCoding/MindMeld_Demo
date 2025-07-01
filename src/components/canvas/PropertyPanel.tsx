import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Palette, 
  Type, 
  Move, 
  RotateCw, 
  Lock, 
  Eye,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline
} from 'lucide-react';
import { CanvasObject } from '../../types/canvas';

interface PropertyPanelProps {
  selectedObjects: CanvasObject[];
  onUpdate: (id: string, updates: Partial<CanvasObject>) => void;
  onClose: () => void;
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedObjects,
  onUpdate,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('style');
  
  if (selectedObjects.length === 0) return null;

  const firstObject = selectedObjects[0];
  const isMultipleSelection = selectedObjects.length > 1;

  const handleStyleUpdate = (property: string, value: any) => {
    selectedObjects.forEach(obj => {
      onUpdate(obj.id, {
        style: {
          ...obj.style,
          [property]: value
        }
      });
    });
  };

  const handlePositionUpdate = (property: string, value: number) => {
    selectedObjects.forEach(obj => {
      onUpdate(obj.id, {
        [property]: value
      });
    });
  };

  const colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
    '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB', '#A52A2A',
    '#808080', '#C0C0C0', '#800000', '#808000', '#008000', '#000080'
  ];

  const fontSizes = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64];
  const fontFamilies = ['Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana'];

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute right-4 top-20 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[80vh] overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Properties {isMultipleSelection && `(${selectedObjects.length})`}
        </h3>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { id: 'style', label: 'Style', icon: Palette },
          { id: 'position', label: 'Position', icon: Move },
          { id: 'text', label: 'Text', icon: Type }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="p-4 overflow-y-auto max-h-96">
        {activeTab === 'style' && (
          <div className="space-y-6">
            {/* Fill Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fill Color
              </label>
              <div className="grid grid-cols-6 gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleStyleUpdate('fill', color)}
                    className={`w-8 h-8 rounded border-2 transition-all ${
                      firstObject.style.fill === color
                        ? 'border-blue-500 scale-110'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Stroke Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stroke Color
              </label>
              <div className="grid grid-cols-6 gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleStyleUpdate('stroke', color)}
                    className={`w-8 h-8 rounded border-2 transition-all ${
                      firstObject.style.stroke === color
                        ? 'border-blue-500 scale-110'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Stroke Width */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stroke Width
              </label>
              <input
                type="range"
                min="0"
                max="20"
                value={firstObject.style.strokeWidth || 1}
                onChange={(e) => handleStyleUpdate('strokeWidth', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-500 mt-1">
                {firstObject.style.strokeWidth || 1}px
              </div>
            </div>

            {/* Opacity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Opacity
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={firstObject.style.opacity || 1}
                onChange={(e) => handleStyleUpdate('opacity', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-500 mt-1">
                {Math.round((firstObject.style.opacity || 1) * 100)}%
              </div>
            </div>

            {/* Border Radius (for rectangles) */}
            {firstObject.type === 'shape' && firstObject.metadata?.shapeType === 'rectangle' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Border Radius
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={firstObject.style.borderRadius || 0}
                  onChange={(e) => handleStyleUpdate('borderRadius', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-xs text-gray-500 mt-1">
                  {firstObject.style.borderRadius || 0}px
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'position' && (
          <div className="space-y-4">
            {/* Position */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  X Position
                </label>
                <input
                  type="number"
                  value={Math.round(firstObject.position.x)}
                  onChange={(e) => handlePositionUpdate('position', { 
                    ...firstObject.position, 
                    x: parseInt(e.target.value) || 0 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Y Position
                </label>
                <input
                  type="number"
                  value={Math.round(firstObject.position.y)}
                  onChange={(e) => handlePositionUpdate('position', { 
                    ...firstObject.position, 
                    y: parseInt(e.target.value) || 0 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Size */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Width
                </label>
                <input
                  type="number"
                  value={Math.round(firstObject.size.width)}
                  onChange={(e) => handlePositionUpdate('size', { 
                    ...firstObject.size, 
                    width: parseInt(e.target.value) || 1 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height
                </label>
                <input
                  type="number"
                  value={Math.round(firstObject.size.height)}
                  onChange={(e) => handlePositionUpdate('size', { 
                    ...firstObject.size, 
                    height: parseInt(e.target.value) || 1 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Rotation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rotation
              </label>
              <input
                type="range"
                min="0"
                max="360"
                value={firstObject.transform.rotation || 0}
                onChange={(e) => handlePositionUpdate('transform', {
                  ...firstObject.transform,
                  rotation: parseInt(e.target.value)
                })}
                className="w-full"
              />
              <div className="text-xs text-gray-500 mt-1">
                {firstObject.transform.rotation || 0}°
              </div>
            </div>
          </div>
        )}

        {activeTab === 'text' && (firstObject.type === 'text' || firstObject.type === 'sticky') && (
          <div className="space-y-4">
            {/* Font Family */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Font Family
              </label>
              <select
                value={firstObject.style.fontFamily || 'Arial'}
                onChange={(e) => handleStyleUpdate('fontFamily', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {fontFamilies.map((font) => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
            </div>

            {/* Font Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Font Size
              </label>
              <select
                value={firstObject.style.fontSize || 16}
                onChange={(e) => handleStyleUpdate('fontSize', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {fontSizes.map((size) => (
                  <option key={size} value={size}>{size}px</option>
                ))}
              </select>
            </div>

            {/* Text Alignment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Alignment
              </label>
              <div className="flex space-x-1">
                {[
                  { value: 'left', icon: AlignLeft },
                  { value: 'center', icon: AlignCenter },
                  { value: 'right', icon: AlignRight }
                ].map(({ value, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => handleStyleUpdate('textAlign', value)}
                    className={`flex-1 p-2 rounded border transition-colors ${
                      firstObject.style.textAlign === value
                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Icon className="w-4 h-4 mx-auto" />
                  </button>
                ))}
              </div>
            </div>

            {/* Text Formatting */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Formatting
              </label>
              <div className="flex space-x-1">
                {[
                  { property: 'fontWeight', value: 'bold', icon: Bold, activeValue: 'bold' },
                  { property: 'fontStyle', value: 'italic', icon: Italic, activeValue: 'italic' },
                  { property: 'textDecoration', value: 'underline', icon: Underline, activeValue: 'underline' }
                ].map(({ property, value, icon: Icon, activeValue }) => (
                  <button
                    key={property}
                    onClick={() => {
                      const currentValue = firstObject.style[property as keyof typeof firstObject.style];
                      handleStyleUpdate(property, currentValue === activeValue ? 'normal' : value);
                    }}
                    className={`p-2 rounded border transition-colors ${
                      firstObject.style[property as keyof typeof firstObject.style] === activeValue
                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};