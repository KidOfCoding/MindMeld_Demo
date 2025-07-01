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
  Maximize2 as Fullscreen,
  Map,
  Diamond,
  Star,
  GitBranch,
  ChevronDown,
  Trash2,
  ArrowUpRight,
  ArrowDownLeft,
  CornerUpRight,
  Zap
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
  onClearAll?: () => void;
  isToolActive?: boolean;
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
  onConnectorModeChange,
  onClearAll,
  isToolActive = false
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showShapeMenu, setShowShapeMenu] = useState(false);
  const [showConnectorMenu, setShowConnectorMenu] = useState(false);
  const [showArrowMenu, setShowArrowMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const tools: Tool[] = [
    { id: 'select', name: 'Select', icon: MousePointer, cursor: 'default', category: 'select' },
    { id: 'hand', name: 'Hand', icon: Hand, cursor: 'grab', category: 'select' },
    { id: 'sticky', name: 'Sticky Note', icon: StickyNote, cursor: 'crosshair', category: 'text' },
    { id: 'text', name: 'Text', icon: Type, cursor: 'text', category: 'text' },
    { id: 'pen', name: 'Pen', icon: Pen, cursor: 'crosshair', category: 'draw' },
    { id: 'line', name: 'Line', icon: Minus, cursor: 'crosshair', category: 'draw' },
    { id: 'eraser', name: 'Eraser', icon: Eraser, cursor: 'crosshair', category: 'draw' }
  ];

  const shapes = [
    { id: 'rectangle', name: 'Rectangle', icon: Square },
    { id: 'circle', name: 'Circle', icon: Circle },
    { id: 'triangle', name: 'Triangle', icon: Triangle },
    { id: 'diamond', name: 'Diamond', icon: Diamond },
    { id: 'star', name: 'Star', icon: Star }
  ];

  const arrowTypes = [
    { id: 'single', name: 'Single Arrow', icon: ArrowRight, description: 'Standard single-headed arrow' },
    { id: 'double', name: 'Double Arrow', icon: ArrowUpRight, description: 'Double-headed arrow' },
    { id: 'curved', name: 'Curved Arrow', icon: CornerUpRight, description: 'Curved connection arrow' },
    { id: 'dotted', name: 'Dotted Arrow', icon: ArrowDownLeft, description: 'Dotted line arrow' }
  ];

  const connectors = [
    { id: 'smart', name: 'Smart Connector', icon: GitBranch, description: 'Intelligent object connection' },
    { id: 'straight', name: 'Straight Line', icon: Minus, description: 'Direct line connection' },
    { id: 'curved', name: 'Curved Line', icon: CornerUpRight, description: 'Curved connection line' },
    { id: 'elbow', name: 'Elbow Connector', icon: Zap, description: 'Right-angle connection' }
  ];

  const colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
    '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB', '#A52A2A',
    '#808080', '#C0C0C0', '#800000', '#808000', '#008000', '#000080',
    '#008080', '#4B0082', '#FF1493', '#00CED1', '#FFD700', '#DC143C',
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'
  ];

  const strokeWidths = [1, 2, 3, 4, 5, 8, 10, 12, 16, 20];

  const handleToolSelect = (tool: Tool) => {
    onToolChange(tool);
    setShowShapeMenu(false);
    setShowConnectorMenu(false);
    setShowArrowMenu(false);
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

  const handleArrowSelect = (arrowType: string) => {
    handleToolSelect({
      id: 'arrow',
      name: `${arrowTypes.find(a => a.id === arrowType)?.name || 'Arrow'}`,
      icon: arrowTypes.find(a => a.id === arrowType)?.icon || ArrowRight,
      cursor: 'crosshair',
      category: 'connector'
    });
    setShowArrowMenu(false);
  };

  const handleConnectorSelect = (connectorType: string) => {
    handleToolSelect({
      id: 'connector',
      name: connectors.find(c => c.id === connectorType)?.name || 'Smart Connector',
      icon: connectors.find(c => c.id === connectorType)?.icon || GitBranch,
      cursor: 'crosshair',
      category: 'connector'
    });
    setShowConnectorMenu(false);
  };

  const getCurrentShapeIcon = () => {
    const currentShape = shapes.find(s => s.id === selectedShapeType);
    return currentShape ? currentShape.icon : Square;
  };

  const getToolButtonClass = (tool: Tool) => {
    const isActive = activeTool?.id === tool.id;
    const isActiveAndWorking = isActive && (tool.id !== 'select' && tool.id !== 'hand');
    
    if (isActiveAndWorking) {
      return 'bg-green-100 text-green-600 ring-2 ring-green-300 shadow-md';
    } else if (isActive) {
      return 'bg-blue-100 text-blue-600 shadow-sm';
    } else {
      return 'text-gray-600 hover:bg-gray-100 hover:text-gray-800';
    }
  };

  const getShapeButtonClass = () => {
    const isShapeActive = shapes.some(s => s.id === activeTool?.id);
    const isActiveAndWorking = isShapeActive && isToolActive;
    
    if (isActiveAndWorking) {
      return 'bg-green-100 text-green-600 ring-2 ring-green-300 shadow-md';
    } else if (isShapeActive) {
      return 'bg-blue-100 text-blue-600 shadow-sm';
    } else {
      return 'text-gray-600 hover:bg-gray-100 hover:text-gray-800';
    }
  };

  const getConnectorButtonClass = () => {
    const isConnectorActive = activeTool?.id === 'connector';
    const isActiveAndWorking = isConnectorActive && isToolActive;
    
    if (isActiveAndWorking) {
      return 'bg-green-100 text-green-600 ring-2 ring-green-300 shadow-md';
    } else if (isConnectorActive) {
      return 'bg-purple-100 text-purple-600 shadow-sm';
    } else {
      return 'text-gray-600 hover:bg-gray-100 hover:text-gray-800';
    }
  };

  const getArrowButtonClass = () => {
    const isArrowActive = activeTool?.id === 'arrow';
    const isActiveAndWorking = isArrowActive && isToolActive;
    
    if (isActiveAndWorking) {
      return 'bg-green-100 text-green-600 ring-2 ring-green-300 shadow-md';
    } else if (isArrowActive) {
      return 'bg-orange-100 text-orange-600 shadow-sm';
    } else {
      return 'text-gray-600 hover:bg-gray-100 hover:text-gray-800';
    }
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
                  className={`p-2 rounded-lg transition-all duration-200 ${getToolButtonClass(tool)}`}
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
                  className={`p-2 rounded-lg transition-all duration-200 ${getToolButtonClass(tool)}`}
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
              className={`flex items-center space-x-1 p-2 rounded-lg transition-all duration-200 ${getShapeButtonClass()}`}
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
                  className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-3 grid grid-cols-3 gap-2 z-50 min-w-[240px]"
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
                        <Icon className="w-6 h-6 mb-1" />
                        <span className="text-xs">{shape.name}</span>
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Line Tool */}
          <div className="flex items-center space-x-1 pr-2 border-r border-gray-200">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleToolSelect(tools[5])}
              className={`p-2 rounded-lg transition-all duration-200 ${getToolButtonClass(tools[5])}`}
              title="Line (L)"
            >
              <Minus className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Arrow Tools */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowArrowMenu(!showArrowMenu)}
              className={`flex items-center space-x-1 p-2 rounded-lg transition-all duration-200 ${getArrowButtonClass()}`}
              title="Arrow Types"
            >
              <ArrowRight className="w-5 h-5" />
              <ChevronDown className="w-3 h-3" />
            </motion.button>

            <AnimatePresence>
              {showArrowMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-50 min-w-[280px]"
                >
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Arrow Types</h4>
                  <div className="space-y-2">
                    {arrowTypes.map((arrow) => {
                      const Icon = arrow.icon;
                      return (
                        <motion.button
                          key={arrow.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleArrowSelect(arrow.id)}
                          className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          <Icon className="w-5 h-5" />
                          <div className="text-left">
                            <div className="text-sm font-medium">{arrow.name}</div>
                            <div className="text-xs text-gray-500">{arrow.description}</div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Smart Connector Tools */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowConnectorMenu(!showConnectorMenu)}
              className={`flex items-center space-x-1 p-2 rounded-lg transition-all duration-200 ${getConnectorButtonClass()}`}
              title="Smart Connectors"
            >
              <GitBranch className="w-5 h-5" />
              <ChevronDown className="w-3 h-3" />
            </motion.button>

            <AnimatePresence>
              {showConnectorMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-50 min-w-[300px]"
                >
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Smart Connectors</h4>
                  <div className="space-y-2">
                    {connectors.map((connector) => {
                      const Icon = connector.icon;
                      return (
                        <motion.button
                          key={connector.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleConnectorSelect(connector.id)}
                          className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          <Icon className="w-5 h-5" />
                          <div className="text-left">
                            <div className="text-sm font-medium">{connector.name}</div>
                            <div className="text-xs text-gray-500">{connector.description}</div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      💡 Click object A, then object B to create smart connections with node points
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Eraser Tool */}
          <div className="flex items-center space-x-1 pr-2 border-r border-gray-200">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleToolSelect(tools[6])}
              className={`p-2 rounded-lg transition-all duration-200 ${getToolButtonClass(tools[6])}`}
              title="Eraser - Click any object to delete (E)"
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
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors flex items-center space-x-1"
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
                  <div className="w-72">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Colors & Properties</h4>
                    <div className="grid grid-cols-10 gap-2 mb-4">
                      {colors.map((color) => (
                        <motion.button
                          key={color}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className={`w-6 h-6 rounded border-2 transition-all ${
                            currentColor === color 
                              ? 'border-blue-500 scale-110 shadow-md' 
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

                    {/* Line Styles */}
                    <div className="border-t pt-3 mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Line Styles
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button className="p-2 border border-gray-300 rounded hover:border-gray-400">
                          <div className="w-full h-1 bg-gray-800"></div>
                          <span className="text-xs mt-1">Solid</span>
                        </button>
                        <button className="p-2 border border-gray-300 rounded hover:border-gray-400">
                          <div className="w-full h-1 bg-gray-800" style={{ backgroundImage: 'repeating-linear-gradient(to right, transparent, transparent 2px, #1f2937 2px, #1f2937 4px)' }}></div>
                          <span className="text-xs mt-1">Dashed</span>
                        </button>
                        <button className="p-2 border border-gray-300 rounded hover:border-gray-400">
                          <div className="w-full h-1 bg-gray-800" style={{ backgroundImage: 'repeating-linear-gradient(to right, transparent, transparent 1px, #1f2937 1px, #1f2937 2px)' }}></div>
                          <span className="text-xs mt-1">Dotted</span>
                        </button>
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
            className="p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800 rounded-lg transition-colors"
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
            className="p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800 rounded-lg transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onResetView}
            className="p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800 rounded-lg transition-colors"
            title="Reset View"
          >
            <Maximize className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onFitToScreen}
            className="p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800 rounded-lg transition-colors"
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
            className="p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800 rounded-lg transition-colors"
            title="Toggle Mini Map"
          >
            <Map className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleLayers}
            className="p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800 rounded-lg transition-colors"
            title="Toggle Layers"
          >
            <Layers className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleProperties}
            className="p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800 rounded-lg transition-colors"
            title="Toggle Properties"
          >
            <Settings className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleComments}
            className="p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800 rounded-lg transition-colors"
            title="Toggle Comments"
          >
            <MessageSquare className="w-4 h-4" />
          </motion.button>

          {/* Clear All Button */}
          {onClearAll && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClearAll}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Clear All Canvas"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Action Controls */}
      <div className="absolute top-4 right-4 z-50">
        <div className="flex items-center bg-white rounded-lg shadow-lg border border-gray-200 p-1 space-x-1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800 rounded-lg transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800 rounded-lg transition-colors"
            title="Redo (Ctrl+Y)"
          >
            <Redo className="w-4 h-4" />
          </motion.button>
          
          <div className="w-px h-6 bg-gray-200" />
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800 rounded-lg transition-colors"
            title="Export"
          >
            <Download className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800 rounded-lg transition-colors"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </>
  );
};