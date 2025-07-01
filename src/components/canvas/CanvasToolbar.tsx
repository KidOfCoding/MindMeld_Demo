import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MousePointer,
  Hand,
  StickyNote,
  Type,
  Square,
  Circle,
  Triangle,
  Minus,
  ArrowRight,
  Image,
  Pen,
  Eraser,
  ZoomIn,
  ZoomOut,
  Maximize,
  Grid,
  Layers,
  MessageSquare,
  Settings,
  Palette,
  Download,
  Upload,
  Share2,
  Undo,
  Redo,
  Copy,
  Scissors,
  RotateCw,
  Lock,
  Eye,
  EyeOff,
  Move,
  MoreHorizontal,
  Fullscreen,
  Map,
  Diamond,
  Star,
  GitBranch,
  ChevronDown
} from 'lucide-react';
import { Tool } from '../../types/canvas';

interface CanvasToolbarProps {
  activeTool: Tool | null;
  onToolChange: (tool: Tool) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onResetView: () => void;
  onFitToScreen: () => void;
  onToggleMiniMap: () => void;
  onToggleLayers: () => void;
  onToggleProperties: () => void;
  onToggleComments: () => void;
  currentColor: string;
  onColorChange: (color: string) => void;
  currentStrokeWidth: number;
  onStrokeWidthChange: (width: number) => void;
  selectedShapeType?: string;
  onShapeTypeChange?: (type: string) => void;
  connectorMode?: string;
  onConnectorModeChange?: (mode: string) => void;
}

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  activeTool,
  onToolChange,
  zoom,
  onZoomChange,
  onResetView,
  onFitToScreen,
  onToggleMiniMap,
  onToggleLayers,
  onToggleProperties,
  onToggleComments,
  currentColor,
  onColorChange,
  currentStrokeWidth,
  onStrokeWidthChange,
  selectedShapeType = 'rectangle',
  onShapeTypeChange,
  connectorMode = 'none',
  onConnectorModeChange
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showShapeMenu, setShowShapeMenu] = useState(false);
  const [showConnectorMenu, setShowConnectorMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const tools: Tool[] = [
    { id: 'select', name: 'Select', icon: MousePointer, cursor: 'default', category: 'select' },
    { id: 'hand', name: 'Hand', icon: Hand, cursor: 'grab', category: 'select' },
    { id: 'sticky', name: 'Sticky Note', icon: StickyNote, cursor: 'crosshair', category: 'text' },
    { id: 'text', name: 'Text', icon: Type, cursor: 'text', category: 'text' },
    { id: 'pen', name: 'Pen', icon: Pen, cursor: 'crosshair', category: 'draw' },
    { id: 'line', name: 'Line', icon: Minus, cursor: 'crosshair', category: 'draw' },
    { id: 'arrow', name: 'Arrow', icon: ArrowRight, cursor: 'crosshair', category: 'connector' },
    { id: 'eraser', name: 'Eraser', icon: Eraser, cursor: 'crosshair', category: 'draw' }
  ];

  const shapes = [
    { id: 'rectangle', name: 'Rectangle', icon: Square },
    { id: 'circle', name: 'Circle', icon: Circle },
    { id: 'triangle', name: 'Triangle', icon: Triangle },
    { id: 'diamond', name: 'Diamond', icon: Diamond },
    { id: 'star', name: 'Star', icon: Star }
  ];

  const connectors = [
    { id: 'straight', name: 'Straight Line', icon: Minus },
    { id: 'curved', name: 'Curved Line', icon: GitBranch },
    { id: 'arrow', name: 'Arrow', icon: ArrowRight }
  ];

  const colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
    '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB', '#A52A2A',
    '#808080', '#C0C0C0', '#800000', '#808000', '#008000', '#000080',
    '#008080', '#4B0082', '#FF1493', '#00CED1', '#FFD700', '#DC143C'
  ];

  const strokeWidths = [1, 2, 3, 4, 5, 8, 10, 12, 16, 20];

  const handleToolSelect = (tool: Tool) => {
    onToolChange(tool);
    setShowShapeMenu(false);
    setShowConnectorMenu(false);
    setShowMoreMenu(false);
  };

  const handleShapeSelect = (shapeType: string) => {
    if (onShapeTypeChange) {
      onShapeTypeChange(shapeType);
    }
    handleToolSelect({
      id: shapeType,
      name: shapes.find(s => s.id === shapeType)?.name || 'Shape',
      icon: shapes.find(s => s.id === shapeType)?.icon || Square,
      cursor: 'crosshair',
      category: 'shape'
    });
    setShowShapeMenu(false);
  };

  const getCurrentShapeIcon = () => {
    const currentShape = shapes.find(s => s.id === selectedShapeType);
    return currentShape ? currentShape.icon : Square;
  };

  return (
    <>
      {/* Main Toolbar */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex items-center bg-white rounded-xl shadow-lg border border-gray-200 p-2 space-x-1">
          {/* Selection Tools */}
          <div className="flex items-center space-x-1 pr-2 border-r border-gray-200">
            {tools.slice(0, 2).map((tool) => {
              const Icon = tool.icon;
              return (
                <motion.button
                  key={tool.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleToolSelect(tool)}
                  className={`p-2 rounded-lg transition-colors ${
                    activeTool?.id === tool.id
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title={`${tool.name} (${tool.id.charAt(0).toUpperCase()})`}
                >
                  <Icon className="w-5 h-5" />
                </motion.button>
              );
            })}
          </div>

          {/* Drawing Tools */}
          <div className="flex items-center space-x-1 pr-2 border-r border-gray-200">
            {tools.slice(2, 6).map((tool) => {
              const Icon = tool.icon;
              return (
                <motion.button
                  key={tool.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleToolSelect(tool)}
                  className={`p-2 rounded-lg transition-colors ${
                    activeTool?.id === tool.id
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title={`${tool.name} (${tool.id.charAt(0).toUpperCase()})`}
                >
                  <Icon className="w-5 h-5" />
                </motion.button>
              );
            })}
          </div>

          {/* Shape Tools */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowShapeMenu(!showShapeMenu)}
              className={`flex items-center space-x-1 p-2 rounded-lg transition-colors ${
                shapes.some(s => s.id === activeTool?.id)
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Shapes"
            >
              {React.createElement(getCurrentShapeIcon(), { className: "w-5 h-5" })}
              <ChevronDown className="w-3 h-3" />
            </motion.button>

            <AnimatePresence>
              {showShapeMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 grid grid-cols-3 gap-1 z-50 min-w-[180px]"
                >
                  {shapes.map((shape) => {
                    const Icon = shape.icon;
                    return (
                      <motion.button
                        key={shape.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleShapeSelect(shape.id)}
                        className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
                          selectedShapeType === shape.id
                            ? 'bg-blue-100 text-blue-600'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        title={shape.name}
                      >
                        <Icon className="w-5 h-5 mb-1" />
                        <span className="text-xs">{shape.name}</span>
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Line and Arrow Tools */}
          <div className="flex items-center space-x-1 pr-2 border-r border-gray-200">
            {tools.slice(6, 8).map((tool) => {
              const Icon = tool.icon;
              return (
                <motion.button
                  key={tool.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleToolSelect(tool)}
                  className={`p-2 rounded-lg transition-colors ${
                    activeTool?.id === tool.id
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title={`${tool.name} (${tool.id.charAt(0).toUpperCase()})`}
                >
                  <Icon className="w-5 h-5" />
                </motion.button>
              );
            })}
          </div>

          {/* Connector Tool */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleToolSelect({
                id: 'connector',
                name: 'Connector',
                icon: GitBranch,
                cursor: 'crosshair',
                category: 'connector'
              })}
              className={`p-2 rounded-lg transition-colors ${
                activeTool?.id === 'connector'
                  ? 'bg-purple-100 text-purple-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Smart Connector"
            >
              <GitBranch className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Eraser Tool */}
          <div className="flex items-center space-x-1 pr-2 border-r border-gray-200">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleToolSelect(tools[7])}
              className={`p-2 rounded-lg transition-colors ${
                activeTool?.id === 'eraser'
                  ? 'bg-red-100 text-red-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Eraser (E)"
            >
              <Eraser className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Color Picker */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors flex items-center space-x-1"
              title="Colors & Stroke"
            >
              <div 
                className="w-4 h-4 rounded border border-gray-300"
                style={{ backgroundColor: currentColor }}
              />
              <Palette className="w-4 h-4" />
            </motion.button>

            <AnimatePresence>
              {showColorPicker && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50"
                >
                  <div className="w-64">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Colors</h4>
                    <div className="grid grid-cols-8 gap-2 mb-4">
                      {colors.map((color) => (
                        <motion.button
                          key={color}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className={`w-6 h-6 rounded border-2 transition-all ${
                            currentColor === color 
                              ? 'border-blue-500 scale-110' 
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => {
                            onColorChange(color);
                          }}
                        />
                      ))}
                    </div>
                    
                    {/* Stroke Width */}
                    <div className="border-t pt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stroke Width: {currentStrokeWidth}px
                      </label>
                      <div className="grid grid-cols-5 gap-2">
                        {strokeWidths.map((width) => (
                          <button
                            key={width}
                            onClick={() => onStrokeWidthChange(width)}
                            className={`p-2 rounded border transition-colors ${
                              currentStrokeWidth === width
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <div 
                              className="w-full bg-gray-800 rounded"
                              style={{ height: `${Math.min(width, 8)}px` }}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-4 left-4 z-50">
        <div className="flex items-center bg-white rounded-lg shadow-lg border border-gray-200 p-1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onZoomChange(zoom / 1.2)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </motion.button>
          
          <span className="px-3 py-1 text-sm font-medium text-gray-700 min-w-[60px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onZoomChange(zoom * 1.2)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onResetView}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Reset View"
          >
            <Maximize className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onFitToScreen}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Fit to Screen"
          >
            <Fullscreen className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* View Controls */}
      <div className="absolute bottom-4 right-4 z-50">
        <div className="flex items-center bg-white rounded-lg shadow-lg border border-gray-200 p-1 space-x-1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleMiniMap}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Toggle Mini Map"
          >
            <Map className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleLayers}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Toggle Layers"
          >
            <Layers className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleProperties}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Toggle Properties"
          >
            <Settings className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleComments}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Toggle Comments"
          >
            <MessageSquare className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Action Controls */}
      <div className="absolute top-4 right-4 z-50">
        <div className="flex items-center bg-white rounded-lg shadow-lg border border-gray-200 p-1 space-x-1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Redo (Ctrl+Y)"
          >
            <Redo className="w-4 h-4" />
          </motion.button>
          
          <div className="w-px h-6 bg-gray-200" />
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Export"
          >
            <Download className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </>
  );
};