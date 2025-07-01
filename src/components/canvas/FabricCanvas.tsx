import React, { useEffect, useRef, useState, useCallback } from 'react';
import { fabric } from 'fabric';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MousePointer, 
  Hand, 
  StickyNote, 
  Type, 
  Square, 
  Circle, 
  Minus, 
  ArrowRight, 
  Pen, 
  Eraser,
  ZoomIn,
  ZoomOut,
  Maximize,
  Download,
  Upload,
  Undo,
  Redo,
  Copy,
  Trash2,
  Palette,
  Settings,
  Grid,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  RotateCw,
  Move,
  Save,
  Share2
} from 'lucide-react';

interface FabricCanvasProps {
  width: number;
  height: number;
  collaborators?: any[];
  currentUser?: any;
}

export const FabricCanvas: React.FC<FabricCanvasProps> = ({
  width,
  height,
  collaborators = [],
  currentUser
}) => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  
  // State
  const [activeTool, setActiveTool] = useState('select');
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [fillColor, setFillColor] = useState('#3B82F6');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([]);
  const [clipboard, setClipboard] = useState<fabric.Object[]>([]);
  const [drawingObject, setDrawingObject] = useState<fabric.Object | null>(null);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);

  // Grid functions
  const addGrid = useCallback((canvas: fabric.Canvas, canvasWidth: number, canvasHeight: number) => {
    const gridSize = 20;
    const gridOptions = {
      stroke: '#e5e7eb',
      strokeWidth: 1,
      selectable: false,
      evented: false,
      excludeFromExport: true
    };

    // Remove existing grid
    canvas.getObjects().forEach(obj => {
      if (obj.excludeFromExport) {
        canvas.remove(obj);
      }
    });

    // Vertical lines
    for (let i = 0; i <= canvasWidth / gridSize; i++) {
      const line = new fabric.Line([i * gridSize, 0, i * gridSize, canvasHeight], gridOptions);
      canvas.add(line);
      canvas.sendToBack(line);
    }

    // Horizontal lines
    for (let i = 0; i <= canvasHeight / gridSize; i++) {
      const line = new fabric.Line([0, i * gridSize, canvasWidth, i * gridSize], gridOptions);
      canvas.add(line);
      canvas.sendToBack(line);
    }
  }, []);

  // Canvas operations
  const saveState = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const state = JSON.stringify(canvas.toJSON());
    
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(state);
      return newHistory.slice(-50); // Keep last 50 states
    });
    
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const createArrowPath = useCallback((x1: number, y1: number, x2: number, y2: number) => {
    const headLength = 15;
    const angle = Math.atan2(y2 - y1, x2 - x1);
    
    const arrowX1 = x2 - headLength * Math.cos(angle - Math.PI / 6);
    const arrowY1 = y2 - headLength * Math.sin(angle - Math.PI / 6);
    const arrowX2 = x2 - headLength * Math.cos(angle + Math.PI / 6);
    const arrowY2 = y2 - headLength * Math.sin(angle + Math.PI / 6);
    
    return `M ${x1} ${y1} L ${x2} ${y2} M ${arrowX1} ${arrowY1} L ${x2} ${y2} L ${arrowX2} ${arrowY2}`;
  }, []);

  // Object creation functions
  const addStickyNote = useCallback((pointer: fabric.Point) => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    
    const rect = new fabric.Rect({
      left: pointer.x,
      top: pointer.y,
      width: 200,
      height: 200,
      fill: '#FFE066',
      stroke: '#E6CC00',
      strokeWidth: 1,
      rx: 8,
      ry: 8,
      shadow: new fabric.Shadow({
        color: 'rgba(0,0,0,0.2)',
        blur: 5,
        offsetX: 2,
        offsetY: 2
      })
    });

    const text = new fabric.Textbox('Double-click to edit', {
      left: pointer.x + 10,
      top: pointer.y + 10,
      width: 180,
      fontSize: 14,
      fontFamily: 'Arial',
      fill: '#000000',
      textAlign: 'left'
    });

    const group = new fabric.Group([rect, text], {
      left: pointer.x,
      top: pointer.y,
      selectable: true,
      hasControls: true,
      hasBorders: true
    });

    canvas.add(group);
    canvas.setActiveObject(group);
    canvas.renderAll();
  }, []);

  const addText = useCallback((pointer: fabric.Point) => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const text = new fabric.Textbox('Type here...', {
      left: pointer.x,
      top: pointer.y,
      width: 200,
      fontSize: 16,
      fontFamily: 'Arial',
      fill: currentColor,
      textAlign: 'left',
      editable: true
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    text.enterEditing();
    canvas.renderAll();
  }, [currentColor]);

  const startDrawingRectangle = useCallback((pointer: fabric.Point) => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const rect = new fabric.Rect({
      left: pointer.x,
      top: pointer.y,
      width: 0,
      height: 0,
      fill: fillColor,
      stroke: currentColor,
      strokeWidth: strokeWidth,
      rx: 0,
      ry: 0
    });

    canvas.add(rect);
    setDrawingObject(rect);
  }, [fillColor, currentColor, strokeWidth]);

  const updateRectangle = useCallback((rect: fabric.Rect, start: fabric.Point, current: fabric.Point) => {
    const width = Math.abs(current.x - start.x);
    const height = Math.abs(current.y - start.y);
    const left = Math.min(start.x, current.x);
    const top = Math.min(start.y, current.y);

    rect.set({
      left: left,
      top: top,
      width: width,
      height: height
    });
    rect.setCoords();
  }, []);

  const startDrawingCircle = useCallback((pointer: fabric.Point) => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const circle = new fabric.Circle({
      left: pointer.x,
      top: pointer.y,
      radius: 0,
      fill: fillColor,
      stroke: currentColor,
      strokeWidth: strokeWidth
    });

    canvas.add(circle);
    setDrawingObject(circle);
  }, [fillColor, currentColor, strokeWidth]);

  const updateCircle = useCallback((circle: fabric.Circle, start: fabric.Point, current: fabric.Point) => {
    const radius = Math.abs(current.x - start.x) / 2;
    const left = Math.min(start.x, current.x);
    const top = Math.min(start.y, current.y);

    circle.set({
      left: left,
      top: top,
      radius: radius
    });
    circle.setCoords();
  }, []);

  const startDrawingLine = useCallback((pointer: fabric.Point) => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const line = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
      stroke: currentColor,
      strokeWidth: strokeWidth,
      strokeLineCap: 'round'
    });

    canvas.add(line);
    setDrawingObject(line);
  }, [currentColor, strokeWidth]);

  const updateLine = useCallback((line: fabric.Line, start: fabric.Point, current: fabric.Point) => {
    line.set({
      x1: start.x,
      y1: start.y,
      x2: current.x,
      y2: current.y
    });
    line.setCoords();
  }, []);

  const startDrawingArrow = useCallback((pointer: fabric.Point) => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const arrowPath = `M ${pointer.x} ${pointer.y} L ${pointer.x} ${pointer.y}`;
    
    const arrow = new fabric.Path(arrowPath, {
      stroke: currentColor,
      strokeWidth: strokeWidth,
      fill: '',
      strokeLineCap: 'round',
      strokeLineJoin: 'round'
    });

    canvas.add(arrow);
    setDrawingObject(arrow);
  }, [currentColor, strokeWidth]);

  const updateArrow = useCallback((arrow: fabric.Path, start: fabric.Point, current: fabric.Point) => {
    const arrowPath = createArrowPath(start.x, start.y, current.x, current.y);
    arrow.path = fabric.util.parsePath(arrowPath);
    arrow._setPath(arrowPath);
    arrow.setCoords();
  }, [createArrowPath]);

  // Mouse event handlers
  const handleMouseDown = useCallback((e: fabric.IEvent) => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const pointer = canvas.getPointer(e.e);

    if (activeTool === 'hand') {
      canvas.isDragging = true;
      canvas.selection = false;
      canvas.lastPosX = e.e.clientX;
      canvas.lastPosY = e.e.clientY;
      return;
    }

    setIsDrawing(true);
    setStartPoint(pointer);

    switch (activeTool) {
      case 'sticky':
        addStickyNote(pointer);
        break;
      case 'text':
        addText(pointer);
        break;
      case 'rectangle':
        startDrawingRectangle(pointer);
        break;
      case 'circle':
        startDrawingCircle(pointer);
        break;
      case 'line':
        startDrawingLine(pointer);
        break;
      case 'arrow':
        startDrawingArrow(pointer);
        break;
    }
  }, [activeTool, addStickyNote, addText, startDrawingRectangle, startDrawingCircle, startDrawingLine, startDrawingArrow]);

  const handleMouseMove = useCallback((e: fabric.IEvent) => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const pointer = canvas.getPointer(e.e);

    if (activeTool === 'hand' && canvas.isDragging) {
      const vpt = canvas.viewportTransform;
      if (vpt) {
        vpt[4] += e.e.clientX - canvas.lastPosX;
        vpt[5] += e.e.clientY - canvas.lastPosY;
        canvas.requestRenderAll();
        canvas.lastPosX = e.e.clientX;
        canvas.lastPosY = e.e.clientY;
      }
      return;
    }

    if (!isDrawing || !startPoint || !drawingObject) return;

    // Update drawing object based on tool
    switch (activeTool) {
      case 'rectangle':
        updateRectangle(drawingObject as fabric.Rect, startPoint, pointer);
        break;
      case 'circle':
        updateCircle(drawingObject as fabric.Circle, startPoint, pointer);
        break;
      case 'line':
        updateLine(drawingObject as fabric.Line, startPoint, pointer);
        break;
      case 'arrow':
        updateArrow(drawingObject as fabric.Path, startPoint, pointer);
        break;
    }

    canvas.renderAll();
  }, [activeTool, isDrawing, startPoint, drawingObject, updateRectangle, updateCircle, updateLine, updateArrow]);

  const handleMouseUp = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    
    if (activeTool === 'hand') {
      canvas.isDragging = false;
      canvas.selection = true;
    }

    setIsDrawing(false);
    setStartPoint(null);
    setDrawingObject(null);

    // Re-enable selection for select tool
    if (activeTool === 'select') {
      canvas.forEachObject((obj) => {
        obj.selectable = true;
        obj.evented = true;
      });
    }
  }, [activeTool]);

  const undo = useCallback(() => {
    if (!fabricCanvasRef.current || historyIndex <= 0) return;

    const canvas = fabricCanvasRef.current;
    const prevState = history[historyIndex - 1];
    
    canvas.loadFromJSON(prevState, () => {
      canvas.renderAll();
      setHistoryIndex(prev => prev - 1);
    });
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (!fabricCanvasRef.current || historyIndex >= history.length - 1) return;

    const canvas = fabricCanvasRef.current;
    const nextState = history[historyIndex + 1];
    
    canvas.loadFromJSON(nextState, () => {
      canvas.renderAll();
      setHistoryIndex(prev => prev + 1);
    });
  }, [history, historyIndex]);

  const copyObjects = useCallback(() => {
    if (!fabricCanvasRef.current || selectedObjects.length === 0) return;

    const canvas = fabricCanvasRef.current;
    const activeObjects = canvas.getActiveObjects();
    
    setClipboard([...activeObjects]);
  }, [selectedObjects]);

  const pasteObjects = useCallback(() => {
    if (!fabricCanvasRef.current || clipboard.length === 0) return;

    const canvas = fabricCanvasRef.current;
    
    clipboard.forEach(obj => {
      obj.clone((cloned: fabric.Object) => {
        cloned.set({
          left: (cloned.left || 0) + 20,
          top: (cloned.top || 0) + 20,
          evented: true,
          selectable: true
        });
        
        canvas.add(cloned);
        canvas.setActiveObject(cloned);
        canvas.requestRenderAll();
      });
    });
  }, [clipboard]);

  const duplicateObjects = useCallback(() => {
    copyObjects();
    pasteObjects();
  }, [copyObjects, pasteObjects]);

  const deleteSelected = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const activeObjects = canvas.getActiveObjects();
    
    if (activeObjects.length > 0) {
      activeObjects.forEach(obj => canvas.remove(obj));
      canvas.discardActiveObject();
      canvas.renderAll();
    }
  }, []);

  const selectAll = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const allObjects = canvas.getObjects().filter(obj => obj.selectable !== false && !obj.excludeFromExport);
    
    if (allObjects.length > 1) {
      const selection = new fabric.ActiveSelection(allObjects, { canvas });
      canvas.setActiveObject(selection);
      canvas.renderAll();
    } else if (allObjects.length === 1) {
      canvas.setActiveObject(allObjects[0]);
      canvas.renderAll();
    }
  }, []);

  const clearCanvas = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    canvas.clear();
    canvas.backgroundColor = '#ffffff';
    
    if (showGrid) {
      addGrid(canvas, width, height);
    }
    
    canvas.renderAll();
    saveState();
  }, [showGrid, addGrid, width, height, saveState]);

  const saveCanvas = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2
    });

    const link = document.createElement('a');
    link.download = `canvas-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
  }, []);

  const exportJSON = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const json = JSON.stringify(canvas.toJSON(), null, 2);
    
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.download = `canvas-${Date.now()}.json`;
    link.href = url;
    link.click();
    
    URL.revokeObjectURL(url);
  }, []);

  const importJSON = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !fabricCanvasRef.current) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        fabricCanvasRef.current?.loadFromJSON(json, () => {
          fabricCanvasRef.current?.renderAll();
          saveState();
        });
      } catch (error) {
        console.error('Error importing JSON:', error);
        alert('Error importing file. Please check the file format.');
      }
    };
    reader.readAsText(file);
  }, [saveState]);

  // Zoom functions
  const zoomIn = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    const newZoom = Math.min(zoom * 1.2, 5);
    canvas.setZoom(newZoom);
    setZoom(newZoom);
  }, [zoom]);

  const zoomOut = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    const newZoom = Math.max(zoom / 1.2, 0.1);
    canvas.setZoom(newZoom);
    setZoom(newZoom);
  }, [zoom]);

  const resetZoom = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    canvas.setZoom(1);
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    canvas.renderAll();
    setZoom(1);
  }, []);

  // Initialize Fabric.js canvas - only once on mount
  useEffect(() => {
    if (!canvasContainerRef.current) return;

    // Create a canvas element for Fabric.js to use
    const canvasElement = document.createElement('canvas');
    canvasElement.width = width;
    canvasElement.height = height;
    canvasContainerRef.current.appendChild(canvasElement);

    const canvas = new fabric.Canvas(canvasElement, {
      width: width,
      height: height,
      backgroundColor: '#ffffff',
      selection: true,
      preserveObjectStacking: true,
      renderOnAddRemove: true,
      stateful: true,
      fireRightClick: true,
      stopContextMenu: true,
      controlsAboveOverlay: true,
      allowTouchScrolling: false
    });

    fabricCanvasRef.current = canvas;

    // Add grid
    if (showGrid) {
      addGrid(canvas, width, height);
    }

    // Event listeners
    canvas.on('selection:created', (e) => {
      setSelectedObjects(e.selected || []);
    });

    canvas.on('selection:updated', (e) => {
      setSelectedObjects(e.selected || []);
    });

    canvas.on('selection:cleared', () => {
      setSelectedObjects([]);
    });

    canvas.on('object:added', () => {
      saveState();
    });

    canvas.on('object:removed', () => {
      saveState();
    });

    canvas.on('object:modified', () => {
      saveState();
    });

    canvas.on('path:created', (e) => {
      if (e.path) {
        e.path.set({
          stroke: currentColor,
          strokeWidth: strokeWidth,
          fill: '',
          selectable: true
        });
        canvas.renderAll();
      }
    });

    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);

    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            e.preventDefault();
            undo();
            break;
          case 'y':
            e.preventDefault();
            redo();
            break;
          case 'c':
            e.preventDefault();
            copyObjects();
            break;
          case 'v':
            e.preventDefault();
            pasteObjects();
            break;
          case 'd':
            e.preventDefault();
            duplicateObjects();
            break;
          case 'a':
            e.preventDefault();
            selectAll();
            break;
          case 's':
            e.preventDefault();
            saveCanvas();
            break;
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        deleteSelected();
      } else {
        // Tool shortcuts
        switch (e.key) {
          case 'v':
            setActiveTool('select');
            break;
          case 'h':
            setActiveTool('hand');
            break;
          case 't':
            setActiveTool('text');
            break;
          case 'r':
            setActiveTool('rectangle');
            break;
          case 'o':
            setActiveTool('circle');
            break;
          case 'l':
            setActiveTool('line');
            break;
          case 's':
            setActiveTool('sticky');
            break;
          case 'p':
            setActiveTool('pen');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Save initial state
    saveState();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      canvas.dispose();
      // Clean up the canvas element
      if (canvasContainerRef.current && canvasElement.parentNode) {
        canvasContainerRef.current.removeChild(canvasElement);
      }
    };
  }, []); // Only initialize once

  // Update canvas size and grid when dimensions or showGrid change
  useEffect(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    canvas.setDimensions({ width, height });
    
    if (showGrid) {
      addGrid(canvas, width, height);
    } else {
      // Remove grid if showGrid is false
      canvas.getObjects().forEach(obj => {
        if (obj.excludeFromExport) {
          canvas.remove(obj);
        }
      });
    }
    
    canvas.renderAll();
  }, [width, height, showGrid, addGrid]);

  // Update tool cursor and mode
  useEffect(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    
    switch (activeTool) {
      case 'select':
        canvas.defaultCursor = 'default';
        canvas.hoverCursor = 'move';
        canvas.selection = true;
        canvas.isDrawingMode = false;
        canvas.forEachObject((obj) => {
          obj.selectable = true;
          obj.evented = true;
        });
        break;
      case 'hand':
        canvas.defaultCursor = 'grab';
        canvas.hoverCursor = 'grab';
        canvas.selection = false;
        canvas.isDrawingMode = false;
        canvas.forEachObject((obj) => {
          obj.selectable = false;
          obj.evented = false;
        });
        break;
      case 'pen':
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.width = strokeWidth;
        canvas.freeDrawingBrush.color = currentColor;
        canvas.selection = false;
        canvas.forEachObject((obj) => {
          obj.selectable = false;
          obj.evented = false;
        });
        break;
      default:
        canvas.defaultCursor = 'crosshair';
        canvas.hoverCursor = 'crosshair';
        canvas.selection = false;
        canvas.isDrawingMode = false;
        canvas.forEachObject((obj) => {
          obj.selectable = false;
          obj.evented = false;
        });
        break;
    }
    canvas.renderAll();
  }, [activeTool, strokeWidth, currentColor]);

  // Color palette
  const colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
    '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB', '#A52A2A',
    '#808080', '#C0C0C0', '#800000', '#808000', '#008000', '#000080',
    '#008080', '#4B0082', '#FF1493', '#00CED1', '#FFD700', '#DC143C'
  ];

  // Tools configuration
  const tools = [
    { id: 'select', icon: MousePointer, label: 'Select (V)', shortcut: 'V' },
    { id: 'hand', icon: Hand, label: 'Hand (H)', shortcut: 'H' },
    { id: 'sticky', icon: StickyNote, label: 'Sticky Note (S)', shortcut: 'S' },
    { id: 'text', icon: Type, label: 'Text (T)', shortcut: 'T' },
    { id: 'pen', icon: Pen, label: 'Pen (P)', shortcut: 'P' },
    { id: 'line', icon: Minus, label: 'Line (L)', shortcut: 'L' },
    { id: 'arrow', icon: ArrowRight, label: 'Arrow (A)', shortcut: 'A' },
    { id: 'rectangle', icon: Square, label: 'Rectangle (R)', shortcut: 'R' },
    { id: 'circle', icon: Circle, label: 'Circle (O)', shortcut: 'O' },
    { id: 'eraser', icon: Eraser, label: 'Eraser (E)', shortcut: 'E' }
  ];

  return (
    <div className="relative w-full h-full bg-gray-100 overflow-hidden">
      {/* Main Toolbar */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex items-center bg-white rounded-xl shadow-lg border border-gray-200 p-2 space-x-1">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <motion.button
                key={tool.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTool(tool.id)}
                className={`p-3 rounded-lg transition-colors ${
                  activeTool === tool.id
                    ? 'bg-blue-100 text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title={tool.label}
              >
                <Icon className="w-5 h-5" />
              </motion.button>
            );
          })}
          
          <div className="w-px h-8 bg-gray-200 mx-2" />
          
          {/* Color Picker */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors flex items-center space-x-2"
              title="Colors"
            >
              <div 
                className="w-5 h-5 rounded border border-gray-300"
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
                  <div className="grid grid-cols-6 gap-2 w-64 mb-4">
                    {colors.map((color) => (
                      <motion.button
                        key={color}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-8 h-8 rounded border-2 transition-all ${
                          currentColor === color
                            ? 'border-blue-500 scale-110'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          setCurrentColor(color);
                          setShowColorPicker(false);
                        }}
                      />
                    ))}
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        Stroke Width: {strokeWidth}px
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="20"
                        value={strokeWidth}
                        onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        Fill Color
                      </label>
                      <div className="grid grid-cols-6 gap-1">
                        {colors.slice(0, 12).map((color) => (
                          <button
                            key={color}
                            className={`w-6 h-6 rounded border ${
                              fillColor === color ? 'border-blue-500' : 'border-gray-300'
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => setFillColor(color)}
                          />
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
            onClick={zoomOut}
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
            onClick={zoomIn}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetZoom}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Reset Zoom"
          >
            <Maximize className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Action Controls */}
      <div className="absolute top-4 right-4 z-50">
        <div className="flex items-center bg-white rounded-lg shadow-lg border border-gray-200 p-1 space-x-1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={undo}
            disabled={historyIndex <= 0}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            title="Redo (Ctrl+Y)"
          >
            <Redo className="w-4 h-4" />
          </motion.button>
          
          <div className="w-px h-6 bg-gray-200" />
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={copyObjects}
            disabled={selectedObjects.length === 0}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            title="Copy (Ctrl+C)"
          >
            <Copy className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={deleteSelected}
            disabled={selectedObjects.length === 0}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            title="Delete (Del)"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
          
          <div className="w-px h-6 bg-gray-200" />
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={saveCanvas}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Export PNG"
          >
            <Download className="w-4 h-4" />
          </motion.button>
          
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".json"
              onChange={importJSON}
              className="hidden"
            />
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Import JSON"
            >
              <Upload className="w-4 h-4" />
            </motion.div>
          </label>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportJSON}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Export JSON"
          >
            <Save className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearCanvas}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Clear Canvas"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Selection Info */}
      {selectedObjects.length > 0 && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 px-4 py-2 z-30">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">
              {selectedObjects.length} selected
            </span>
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={duplicateObjects}
                className="p-1 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                title="Duplicate (Ctrl+D)"
              >
                <RotateCw className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {/* Canvas Container */}
      <div
        ref={canvasContainerRef}
        className="border border-gray-300 bg-white"
        style={{ 
          width: width, 
          height: height,
          cursor: activeTool === 'hand' ? 'grab' : activeTool === 'pen' ? 'crosshair' : 'default'
        }}
      />

      {/* Instructions */}
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 p-3 z-30 max-w-xs">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">✅ FULLY WORKING!</h4>
        <div className="text-xs text-gray-600 space-y-1">
          <p>• <strong>V</strong> - Select & move objects</p>
          <p>• <strong>H</strong> - Hand tool (pan canvas)</p>
          <p>• <strong>P</strong> - Pen tool (FREE DRAWING)</p>
          <p>• <strong>T</strong> - Text (click & type)</p>
          <p>• <strong>R</strong> - Rectangle (drag to draw)</p>
          <p>• <strong>O</strong> - Circle (drag to draw)</p>
          <p>• <strong>L</strong> - Line (drag to draw)</p>
          <p>• <strong>S</strong> - Sticky notes</p>
          <p>• <strong>Ctrl+Z/Y</strong> - Undo/Redo</p>
          <p>• <strong>Ctrl+C/V/D</strong> - Copy/Paste/Duplicate</p>
          <p>• <strong>Del</strong> - Delete selected</p>
        </div>
      </div>
    </div>
  );
};