import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IdeaCard } from './IdeaCard';
import { CanvasGrid } from './CanvasGrid';
import { ShapeElement } from './ShapeElement';
import { TextElement } from './TextElement';
import { DrawingElement } from './DrawingElement';
import { SelectionBox } from './SelectionBox';
import { ContextMenu } from './ContextMenu';
import { Idea, User, CanvasElement } from '../../types';
import { Plus, ZoomIn, ZoomOut, Maximize, Download, Share2, Copy, Trash2, RotateCw, Layers, Grid, Lock, Move, ArrowLeftRight, ArrowUpDown, PanelLeftOpen, PanelLeftClose, Minimize, Palette, MoreHorizontal, Settings, Fullscreen, Fullscreen as FullscreenExit } from 'lucide-react';

interface CanvasProps {
  ideas: Idea[];
  canvasElements: CanvasElement[];
  selectedTool: string;
  onAddIdea: (text: string, position: { x: number; y: number }) => void;
  onVoteIdea: (id: string) => void;
  onRemoveIdea: (id: string) => void;
  onUpdateIdeaPosition: (id: string, position: { x: number; y: number }) => void;
  onAddCanvasElement: (element: Omit<CanvasElement, 'id' | 'timestamp' | 'author'>) => void;
  onUpdateCanvasElement: (id: string, updates: Partial<CanvasElement>) => void;
  onRemoveCanvasElement: (id: string) => void;
  currentUser: User;
  collaborators: User[];
  onExportCanvas: (format: 'png' | 'pdf') => void;
  isSidebarExpanded?: boolean;
  onToggleSidebar?: () => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  ideas,
  canvasElements,
  selectedTool,
  onAddIdea,
  onVoteIdea,
  onRemoveIdea,
  onUpdateIdeaPosition,
  onAddCanvasElement,
  onUpdateCanvasElement,
  onRemoveCanvasElement,
  currentUser,
  collaborators,
  onExportCanvas,
  isSidebarExpanded = true,
  onToggleSidebar
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickAddPosition, setQuickAddPosition] = useState({ x: 0, y: 0 });
  const [quickAddText, setQuickAddText] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingPath, setDrawingPath] = useState<{ x: number; y: number }[]>([]);
  const [collaboratorCursors, setCollaboratorCursors] = useState<Record<string, { x: number; y: number }>>({});
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [selectionBox, setSelectionBox] = useState<{ start: { x: number; y: number }; end: { x: number; y: number } } | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; elementId?: string } | null>(null);
  const [clipboard, setClipboard] = useState<CanvasElement[]>([]);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showColorWheel, setShowColorWheel] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [showCanvasSettings, setShowCanvasSettings] = useState(false);

  // Color palette for the color wheel
  const colorPalette = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4',
    '#84CC16', '#F97316', '#EC4899', '#6B7280', '#1F2937', '#FFFFFF',
    '#FEF3C7', '#DBEAFE', '#D1FAE5', '#FEE2E2', '#EDE9FE', '#CFFAFE',
    '#ECFDF5', '#FED7AA', '#FCE7F3', '#F3F4F6', '#374151', '#111827'
  ];

  // Simulate real-time cursor movement
  useEffect(() => {
    const interval = setInterval(() => {
      const newCursors: Record<string, { x: number; y: number }> = {};
      collaborators.filter(c => c.isOnline).forEach(collaborator => {
        newCursors[collaborator.id] = {
          x: Math.random() * 800 + 100,
          y: Math.random() * 600 + 100
        };
      });
      setCollaboratorCursors(newCursors);
    }, 3000);

    return () => clearInterval(interval);
  }, [collaborators]);

  // Fullscreen handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'c':
            e.preventDefault();
            copySelectedElements();
            break;
          case 'v':
            e.preventDefault();
            pasteElements();
            break;
          case 'd':
            e.preventDefault();
            duplicateSelectedElements();
            break;
          case 'a':
            e.preventDefault();
            selectAllElements();
            break;
          case 'z':
            e.preventDefault();
            // Undo functionality would go here
            break;
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        deleteSelectedElements();
      } else if (e.key === 'Escape') {
        setSelectedElements([]);
        setContextMenu(null);
        setShowColorWheel(false);
        setShowCanvasSettings(false);
      } else if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElements, clipboard]);

  const snapToGridPosition = (position: { x: number; y: number }) => {
    if (!snapToGrid) return position;
    const gridSize = 20;
    return {
      x: Math.round(position.x / gridSize) * gridSize,
      y: Math.round(position.y / gridSize) * gridSize
    };
  };

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    let x = (e.clientX - rect.left - pan.x) / zoom;
    let y = (e.clientY - rect.top - pan.y) / zoom;

    const position = snapToGridPosition({ x, y });
    x = position.x;
    y = position.y;

    setContextMenu(null);
    setShowColorWheel(false);
    setShowCanvasSettings(false);

    switch (selectedTool) {
      case 'sticky':
        setQuickAddPosition({ x, y });
        setShowQuickAdd(true);
        break;
      case 'rectangle':
        onAddCanvasElement({
          type: 'shape',
          position: { x, y },
          size: { width: 150, height: 100 },
          content: 'Rectangle',
          style: {
            backgroundColor: selectedColor,
            borderColor: selectedColor,
            textColor: '#FFFFFF'
          }
        });
        break;
      case 'circle':
        onAddCanvasElement({
          type: 'shape',
          position: { x, y },
          size: { width: 120, height: 120 },
          content: 'Circle',
          style: {
            backgroundColor: selectedColor,
            borderColor: selectedColor,
            textColor: '#FFFFFF'
          }
        });
        break;
      case 'text':
        onAddCanvasElement({
          type: 'text',
          position: { x, y },
          size: { width: 200, height: 50 },
          content: 'Click to edit text',
          style: {
            textColor: selectedColor,
            fontSize: 16
          }
        });
        break;
      case 'select':
        if (!e.shiftKey) {
          setSelectedElements([]);
        }
        break;
    }
  }, [selectedTool, pan, zoom, onAddCanvasElement, snapToGrid, selectedColor]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (selectedTool === 'hand' || e.button === 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    } else if (selectedTool === 'pen') {
      setIsDrawing(true);
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = (e.clientX - rect.left - pan.x) / zoom;
        const y = (e.clientY - rect.top - pan.y) / zoom;
        setDrawingPath([{ x, y }]);
      }
    } else if (selectedTool === 'select') {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = (e.clientX - rect.left - pan.x) / zoom;
        const y = (e.clientY - rect.top - pan.y) / zoom;
        setSelectionBox({ start: { x, y }, end: { x, y } });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    } else if (isDrawing && selectedTool === 'pen') {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = (e.clientX - rect.left - pan.x) / zoom;
        const y = (e.clientY - rect.top - pan.y) / zoom;
        setDrawingPath(prev => [...prev, { x, y }]);
      }
    } else if (selectionBox && selectedTool === 'select') {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = (e.clientX - rect.left - pan.x) / zoom;
        const y = (e.clientY - rect.top - pan.y) / zoom;
        setSelectionBox(prev => prev ? { ...prev, end: { x, y } } : null);
      }
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && drawingPath.length > 1) {
      onAddCanvasElement({
        type: 'connector',
        position: drawingPath[0],
        size: { width: 0, height: 0 },
        content: JSON.stringify(drawingPath),
        style: {
          borderColor: selectedColor
        }
      });
      setDrawingPath([]);
    }

    if (selectionBox) {
      // Select elements within selection box
      const selectedIds: string[] = [];
      const { start, end } = selectionBox;
      const minX = Math.min(start.x, end.x);
      const maxX = Math.max(start.x, end.x);
      const minY = Math.min(start.y, end.y);
      const maxY = Math.max(start.y, end.y);

      canvasElements.forEach(element => {
        const { x, y } = element.position;
        const { width, height } = element.size;
        if (x >= minX && x + width <= maxX && y >= minY && y + height <= maxY) {
          selectedIds.push(element.id);
        }
      });

      setSelectedElements(selectedIds);
      setSelectionBox(null);
    }

    setIsDragging(false);
    setIsDrawing(false);
  };

  const handleContextMenu = (e: React.MouseEvent, elementId?: string) => {
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setContextMenu({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        elementId
      });
    }
  };

  const copySelectedElements = () => {
    const elementsToCopy = canvasElements.filter(el => selectedElements.includes(el.id));
    setClipboard(elementsToCopy);
  };

  const pasteElements = () => {
    clipboard.forEach(element => {
      onAddCanvasElement({
        ...element,
        position: {
          x: element.position.x + 20,
          y: element.position.y + 20
        }
      });
    });
  };

  const duplicateSelectedElements = () => {
    const elementsToDuplicate = canvasElements.filter(el => selectedElements.includes(el.id));
    elementsToDuplicate.forEach(element => {
      onAddCanvasElement({
        ...element,
        position: {
          x: element.position.x + 20,
          y: element.position.y + 20
        }
      });
    });
  };

  const deleteSelectedElements = () => {
    selectedElements.forEach(id => {
      onRemoveCanvasElement(id);
    });
    setSelectedElements([]);
  };

  const selectAllElements = () => {
    setSelectedElements(canvasElements.map(el => el.id));
  };

  const handleQuickAdd = () => {
    if (quickAddText.trim()) {
      onAddIdea(quickAddText, quickAddPosition);
      setQuickAddText('');
      setShowQuickAdd(false);
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.1));
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  const exportCanvas = () => {
    onExportCanvas('png');
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-white">
      {/* Sidebar Toggle Button - Inside Canvas */}
      {onToggleSidebar && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleSidebar}
          className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg flex items-center justify-center hover:bg-white hover:border-gray-300 transition-all z-40 shadow-sm group"
          title={`${isSidebarExpanded ? 'Hide' : 'Show'} Sidebar`}
        >
          {isSidebarExpanded ? (
            <PanelLeftClose className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors" />
          ) : (
            <PanelLeftOpen className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors" />
          )}
        </motion.button>
      )}

      {/* Advanced Canvas Controls */}
      <div className="absolute top-4 right-4 flex items-center space-x-2 z-30">
        {/* Zoom Controls */}
        <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleZoomOut}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-l-lg transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </motion.button>
          
          <span className="px-3 py-2 text-sm font-medium text-gray-700 border-x border-gray-200 min-w-[60px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleZoomIn}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleResetView}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-r-lg transition-colors"
          >
            <Maximize className="w-4 h-4" />
          </motion.button>
        </div>

        {/* View Controls */}
        <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowGrid(!showGrid)}
            className={`p-2 rounded-l-lg transition-colors ${
              showGrid ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
            title="Toggle Grid"
          >
            <Grid className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSnapToGrid(!snapToGrid)}
            className={`p-2 border-x border-gray-200 transition-colors ${
              snapToGrid ? 'text-purple-600 bg-purple-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
            title="Snap to Grid"
          >
            <Lock className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCanvasSettings(!showCanvasSettings)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-r-lg transition-colors"
            title="Canvas Settings"
          >
            <Layers className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Color Wheel */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowColorWheel(!showColorWheel)}
            className="p-2 bg-white/90 backdrop-blur-sm text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg shadow-sm border border-gray-200 transition-colors"
            title="Color Palette"
          >
            <Palette className="w-4 h-4" />
          </motion.button>

          {showColorWheel && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute top-full right-0 mt-2 p-4 bg-white rounded-xl shadow-lg border border-gray-200 z-50"
            >
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Color Palette</h3>
              <div className="grid grid-cols-6 gap-2 w-48">
                {colorPalette.map((color) => (
                  <motion.button
                    key={color}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedColor(color);
                      setShowColorWheel(false);
                    }}
                    className={`w-8 h-8 rounded-lg border-2 transition-all ${
                      selectedColor === color 
                        ? 'border-gray-900 shadow-md' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-600">Selected:</span>
                  <div 
                    className="w-6 h-6 rounded border border-gray-300"
                    style={{ backgroundColor: selectedColor }}
                  />
                  <span className="text-xs font-mono text-gray-700">{selectedColor}</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportCanvas}
            className="p-2 bg-white/90 backdrop-blur-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg shadow-sm border border-gray-200 transition-colors"
            title="Export Canvas"
          >
            <Download className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-white/90 backdrop-blur-sm text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg shadow-sm border border-gray-200 transition-colors"
            title="Share Canvas"
          >
            <Share2 className="w-4 h-4" />
          </motion.button>

          {/* Fullscreen Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleFullscreen}
            className="p-2 bg-white/90 backdrop-blur-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg shadow-sm border border-gray-200 transition-colors"
            title={isFullscreen ? "Exit Fullscreen (F11)" : "Enter Fullscreen (F11)"}
          >
            {isFullscreen ? (
              <Minimize className="w-4 h-4" />
            ) : (
              <Fullscreen className="w-4 h-4" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Canvas Settings Panel */}
      {showCanvasSettings && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="absolute top-16 right-4 p-4 bg-white rounded-xl shadow-lg border border-gray-200 z-40 w-64"
        >
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Canvas Settings</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Show Grid</span>
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`w-10 h-6 rounded-full transition-colors ${
                  showGrid ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  showGrid ? 'translate-x-5' : 'translate-x-1'
                } mt-1`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Snap to Grid</span>
              <button
                onClick={() => setSnapToGrid(!snapToGrid)}
                className={`w-10 h-6 rounded-full transition-colors ${
                  snapToGrid ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  snapToGrid ? 'translate-x-5' : 'translate-x-1'
                } mt-1`} />
              </button>
            </div>
            
            <div className="pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Zoom Level</span>
                <span className="text-sm font-medium text-gray-900">{Math.round(zoom * 100)}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                value={zoom * 100}
                onChange={(e) => setZoom(parseInt(e.target.value) / 100)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Selection Info */}
      {selectedElements.length > 0 && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 px-4 py-2 z-30">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">
              {selectedElements.length} selected
            </span>
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={copySelectedElements}
                className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Copy (Ctrl+C)"
              >
                <Copy className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={duplicateSelectedElements}
                className="p-1 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                title="Duplicate (Ctrl+D)"
              >
                <RotateCw className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={deleteSelectedElements}
                className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {/* Collaborator Cursors */}
      {Object.entries(collaboratorCursors).map(([userId, position]) => {
        const collaborator = collaborators.find(c => c.id === userId);
        if (!collaborator || !collaborator.isOnline) return null;
        
        return (
          <motion.div
            key={userId}
            className="absolute pointer-events-none z-40"
            style={{
              left: position.x * zoom + pan.x,
              top: position.y * zoom + pan.y,
            }}
            animate={{
              x: [0, 10, -5, 0],
              y: [0, -8, 12, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="flex items-center space-x-2">
              <div 
                className="w-4 h-4 rounded-full border-2 border-white shadow-lg"
                style={{ backgroundColor: collaborator.color }}
              />
              <div className="px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg">
                {collaborator.name}
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Main Canvas */}
      <div
        ref={canvasRef}
        className={`w-full h-full relative ${
          selectedTool === 'hand' ? 'cursor-grab' : 
          selectedTool === 'pen' ? 'cursor-crosshair' : 
          selectedTool === 'select' ? 'cursor-default' : 
          'cursor-crosshair'
        }`}
        style={{
          transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
          transformOrigin: '0 0'
        }}
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onContextMenu={handleContextMenu}
      >
        {showGrid && <CanvasGrid zoom={zoom} />}
        
        {/* Selection Box */}
        {selectionBox && (
          <SelectionBox start={selectionBox.start} end={selectionBox.end} />
        )}
        
        {/* Canvas Elements */}
        {canvasElements.map((element) => {
          const isSelected = selectedElements.includes(element.id);
          
          switch (element.type) {
            case 'shape':
              return (
                <ShapeElement
                  key={element.id}
                  element={element}
                  onUpdate={(updates) => onUpdateCanvasElement(element.id, updates)}
                  onRemove={() => onRemoveCanvasElement(element.id)}
                  onSelect={() => setSelectedElements([element.id])}
                  isSelected={isSelected}
                  zoom={zoom}
                  snapToGrid={snapToGrid}
                />
              );
            case 'text':
              return (
                <TextElement
                  key={element.id}
                  element={element}
                  onUpdate={(updates) => onUpdateCanvasElement(element.id, updates)}
                  onRemove={() => onRemoveCanvasElement(element.id)}
                  onSelect={() => setSelectedElements([element.id])}
                  isSelected={isSelected}
                  zoom={zoom}
                  snapToGrid={snapToGrid}
                />
              );
            case 'connector':
              return (
                <DrawingElement
                  key={element.id}
                  element={element}
                  onRemove={() => onRemoveCanvasElement(element.id)}
                  isSelected={isSelected}
                />
              );
            default:
              return null;
          }
        })}
        
        {/* Ideas */}
        {ideas.map((idea) => (
          <IdeaCard
            key={idea.id}
            idea={idea}
            onVote={onVoteIdea}
            onRemove={onRemoveIdea}
            onUpdatePosition={onUpdateIdeaPosition}
            isSelected={false}
            zoom={zoom}
          />
        ))}

        {/* Current Drawing Path */}
        {isDrawing && drawingPath.length > 1 && (
          <svg className="absolute inset-0 pointer-events-none">
            <path
              d={`M ${drawingPath.map(p => `${p.x},${p.y}`).join(' L ')}`}
              stroke={selectedColor}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-sm"
            />
          </svg>
        )}

        {/* Quick Add Modal */}
        {showQuickAdd && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-50"
            style={{
              left: quickAddPosition.x,
              top: quickAddPosition.y,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="w-64">
              <textarea
                autoFocus
                value={quickAddText}
                onChange={(e) => setQuickAddText(e.target.value)}
                placeholder="Enter your idea..."
                className="w-full h-20 p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleQuickAdd();
                  } else if (e.key === 'Escape') {
                    setShowQuickAdd(false);
                    setQuickAddText('');
                  }
                }}
              />
              <div className="flex justify-end space-x-2 mt-3">
                <button
                  onClick={() => {
                    setShowQuickAdd(false);
                    setQuickAddText('');
                  }}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleQuickAdd}
                  disabled={!quickAddText.trim()}
                  className="px-4 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          position={{ x: contextMenu.x, y: contextMenu.y }}
          onClose={() => setContextMenu(null)}
          onCopy={copySelectedElements}
          onPaste={pasteElements}
          onDuplicate={duplicateSelectedElements}
          onDelete={deleteSelectedElements}
          hasSelection={selectedElements.length > 0}
          hasClipboard={clipboard.length > 0}
        />
      )}

      {/* Empty State */}
      {ideas.length === 0 && canvasElements.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center space-y-4">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <Plus className="w-12 h-12 text-gray-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Start Your Collaboration
              </h3>
              <p className="text-gray-500 max-w-md">
                Click anywhere to add ideas, use tools to create shapes and text, or press Ctrl+V to paste.
              </p>
              <div className="mt-4 text-sm text-gray-400">
                <p>Shortcuts: Ctrl+C (copy), Ctrl+V (paste), Ctrl+D (duplicate), Delete (remove), F11 (fullscreen)</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};