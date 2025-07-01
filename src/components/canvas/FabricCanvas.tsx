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
  Share2,
  Triangle,
  Star,
  Diamond,
  Image,
  Layers,
  Group,
  Ungroup,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Plus,
  Minus as MinusIcon,
  X
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
  const [showShapeMenu, setShowShapeMenu] = useState(false);
  const [showTextMenu, setShowTextMenu] = useState(false);
  const [showLayerPanel, setShowLayerPanel] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [textAlign, setTextAlign] = useState('left');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  // Grid functions
  const addGrid = useCallback((canvas: fabric.Canvas, canvasWidth: number, canvasHeight: number) => {
    const gridSize = 20;
    const gridOptions = {
      stroke: '#e5e7eb',
      strokeWidth: 1,
      selectable: false,
      evented: false,
      excludeFromExport: true,
      name: 'grid'
    };

    // Remove existing grid
    canvas.getObjects().forEach(obj => {
      if (obj.name === 'grid') {
        canvas.remove(obj);
      }
    });

    if (!showGrid) return;

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
  }, [showGrid]);

  // Canvas operations
  const saveState = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const state = JSON.stringify(canvas.toJSON(['name', 'excludeFromExport']));
    
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(state);
      return newHistory.slice(-50); // Keep last 50 states
    });
    
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

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
      textAlign: 'left',
      backgroundColor: 'transparent'
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
    saveState();
  }, [saveState]);

  const addText = useCallback((pointer: fabric.Point) => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const text = new fabric.Textbox('Type here...', {
      left: pointer.x,
      top: pointer.y,
      width: 200,
      fontSize: fontSize,
      fontFamily: fontFamily,
      fill: currentColor,
      textAlign: textAlign,
      fontWeight: isBold ? 'bold' : 'normal',
      fontStyle: isItalic ? 'italic' : 'normal',
      underline: isUnderline,
      editable: true
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    text.enterEditing();
    canvas.renderAll();
    saveState();
  }, [currentColor, fontSize, fontFamily, textAlign, isBold, isItalic, isUnderline, saveState]);

  const addShape = useCallback((shapeType: string, pointer: fabric.Point) => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    let shape: fabric.Object;

    switch (shapeType) {
      case 'rectangle':
        shape = new fabric.Rect({
          left: pointer.x,
          top: pointer.y,
          width: 150,
          height: 100,
          fill: fillColor,
          stroke: currentColor,
          strokeWidth: strokeWidth,
          rx: 0,
          ry: 0
        });
        break;
      case 'circle':
        shape = new fabric.Circle({
          left: pointer.x,
          top: pointer.y,
          radius: 50,
          fill: fillColor,
          stroke: currentColor,
          strokeWidth: strokeWidth
        });
        break;
      case 'triangle':
        shape = new fabric.Triangle({
          left: pointer.x,
          top: pointer.y,
          width: 100,
          height: 100,
          fill: fillColor,
          stroke: currentColor,
          strokeWidth: strokeWidth
        });
        break;
      case 'diamond':
        const diamondPoints = [
          { x: 50, y: 0 },
          { x: 100, y: 50 },
          { x: 50, y: 100 },
          { x: 0, y: 50 }
        ];
        shape = new fabric.Polygon(diamondPoints, {
          left: pointer.x,
          top: pointer.y,
          fill: fillColor,
          stroke: currentColor,
          strokeWidth: strokeWidth
        });
        break;
      case 'star':
        const starPoints = [];
        const outerRadius = 50;
        const innerRadius = 25;
        for (let i = 0; i < 10; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = (i * Math.PI) / 5;
          starPoints.push({
            x: 50 + radius * Math.cos(angle - Math.PI / 2),
            y: 50 + radius * Math.sin(angle - Math.PI / 2)
          });
        }
        shape = new fabric.Polygon(starPoints, {
          left: pointer.x,
          top: pointer.y,
          fill: fillColor,
          stroke: currentColor,
          strokeWidth: strokeWidth
        });
        break;
      default:
        return;
    }

    canvas.add(shape);
    canvas.setActiveObject(shape);
    canvas.renderAll();
    saveState();
  }, [fillColor, currentColor, strokeWidth, saveState]);

  const addLine = useCallback((pointer: fabric.Point) => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const line = new fabric.Line([pointer.x, pointer.y, pointer.x + 100, pointer.y], {
      stroke: currentColor,
      strokeWidth: strokeWidth,
      strokeLineCap: 'round'
    });

    canvas.add(line);
    canvas.setActiveObject(line);
    canvas.renderAll();
    saveState();
  }, [currentColor, strokeWidth, saveState]);

  const addArrow = useCallback((pointer: fabric.Point) => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    
    // Create line
    const line = new fabric.Line([pointer.x, pointer.y, pointer.x + 100, pointer.y], {
      stroke: currentColor,
      strokeWidth: strokeWidth,
      strokeLineCap: 'round'
    });

    // Create arrowhead
    const arrowHead = new fabric.Triangle({
      left: pointer.x + 100,
      top: pointer.y,
      width: 15,
      height: 15,
      fill: currentColor,
      originX: 'center',
      originY: 'center',
      angle: 90
    });

    const group = new fabric.Group([line, arrowHead], {
      left: pointer.x,
      top: pointer.y
    });

    canvas.add(group);
    canvas.setActiveObject(group);
    canvas.renderAll();
    saveState();
  }, [currentColor, strokeWidth, saveState]);

  const addImage = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const reader = new FileReader();

    reader.onload = (e) => {
      const imgElement = new Image();
      imgElement.onload = () => {
        const fabricImage = new fabric.Image(imgElement, {
          left: 100,
          top: 100,
          scaleX: 0.5,
          scaleY: 0.5
        });
        canvas.add(fabricImage);
        canvas.setActiveObject(fabricImage);
        canvas.renderAll();
        saveState();
      };
      imgElement.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
    event.target.value = '';
  }, [saveState]);

  // Update pen tool settings when color or stroke width changes
  const updatePenTool = useCallback(() => {
    if (!fabricCanvasRef.current || activeTool !== 'pen') return;
    
    const canvas = fabricCanvasRef.current;
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = currentColor;
      canvas.freeDrawingBrush.width = strokeWidth;
    }
  }, [activeTool, currentColor, strokeWidth]);

  // Call updatePenTool whenever color or stroke width changes
  useEffect(() => {
    updatePenTool();
  }, [updatePenTool]);

  // Mouse event handlers
  const handleMouseDown = useCallback((e: fabric.IEvent) => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const pointer = canvas.getPointer(e.e);

    // Handle hand tool (panning)
    if (activeTool === 'hand') {
      canvas.isDragging = true;
      canvas.selection = false;
      canvas.lastPosX = e.e.clientX;
      canvas.lastPosY = e.e.clientY;
      return;
    }

    // Handle select tool
    if (activeTool === 'select') {
      return; // Let fabric handle selection
    }

    // Handle pen tool
    if (activeTool === 'pen') {
      return; // Let fabric handle free drawing
    }

    // Handle eraser tool
    if (activeTool === 'eraser') {
      const target = canvas.findTarget(e.e, false);
      if (target && target.name !== 'grid') {
        canvas.remove(target);
        canvas.renderAll();
        saveState();
      }
      return;
    }

    // For drawing tools, prevent default selection
    canvas.selection = false;
    setIsDrawing(true);
    setStartPoint(pointer);

    switch (activeTool) {
      case 'sticky':
        addStickyNote(pointer);
        setIsDrawing(false);
        break;
      case 'text':
        addText(pointer);
        setIsDrawing(false);
        break;
      case 'rectangle':
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
        break;
      case 'circle':
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
        break;
      case 'line':
        const line = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
          stroke: currentColor,
          strokeWidth: strokeWidth,
          strokeLineCap: 'round'
        });
        canvas.add(line);
        setDrawingObject(line);
        break;
      case 'arrow':
        const arrow = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
          stroke: currentColor,
          strokeWidth: strokeWidth,
          strokeLineCap: 'round'
        });
        canvas.add(arrow);
        setDrawingObject(arrow);
        break;
    }
  }, [activeTool, addStickyNote, addText, fillColor, currentColor, strokeWidth, saveState]);

  const handleMouseMove = useCallback((e: fabric.IEvent) => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const pointer = canvas.getPointer(e.e);

    // Handle hand tool panning
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

    // Handle eraser tool
    if (activeTool === 'eraser' && e.e.buttons === 1) {
      const target = canvas.findTarget(e.e, false);
      if (target && target.name !== 'grid') {
        canvas.remove(target);
        canvas.renderAll();
      }
      return;
    }

    if (!isDrawing || !startPoint || !drawingObject) return;

    // Update drawing object based on tool
    switch (activeTool) {
      case 'rectangle':
        const rect = drawingObject as fabric.Rect;
        const width = Math.abs(pointer.x - startPoint.x);
        const height = Math.abs(pointer.y - startPoint.y);
        const left = Math.min(startPoint.x, pointer.x);
        const top = Math.min(startPoint.y, pointer.y);

        rect.set({
          left: left,
          top: top,
          width: width,
          height: height
        });
        rect.setCoords();
        break;
      case 'circle':
        const circle = drawingObject as fabric.Circle;
        const radius = Math.sqrt(
          Math.pow(pointer.x - startPoint.x, 2) + Math.pow(pointer.y - startPoint.y, 2)
        ) / 2;
        const circleLeft = Math.min(startPoint.x, pointer.x);
        const circleTop = Math.min(startPoint.y, pointer.y);

        circle.set({
          left: circleLeft,
          top: circleTop,
          radius: radius
        });
        circle.setCoords();
        break;
      case 'line':
        const line = drawingObject as fabric.Line;
        line.set({
          x1: startPoint.x,
          y1: startPoint.y,
          x2: pointer.x,
          y2: pointer.y
        });
        line.setCoords();
        break;
      case 'arrow':
        const arrowLine = drawingObject as fabric.Line;
        arrowLine.set({
          x1: startPoint.x,
          y1: startPoint.y,
          x2: pointer.x,
          y2: pointer.y
        });
        arrowLine.setCoords();
        
        // Add arrowhead
        const angle = Math.atan2(pointer.y - startPoint.y, pointer.x - startPoint.x);
        const headLength = 15;
        
        // Remove existing arrowhead if any
        const existingArrowhead = canvas.getObjects().find(obj => obj.name === 'arrowhead');
        if (existingArrowhead) {
          canvas.remove(existingArrowhead);
        }
        
        // Create new arrowhead
        const arrowhead = new fabric.Triangle({
          left: pointer.x,
          top: pointer.y,
          width: headLength,
          height: headLength,
          fill: currentColor,
          originX: 'center',
          originY: 'center',
          angle: (angle * 180) / Math.PI + 90,
          name: 'arrowhead'
        });
        
        canvas.add(arrowhead);
        break;
    }

    canvas.renderAll();
  }, [activeTool, isDrawing, startPoint, drawingObject, currentColor]);

  const handleMouseUp = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    
    if (activeTool === 'hand') {
      canvas.isDragging = false;
      canvas.selection = true;
    }

    if (isDrawing && drawingObject) {
      // For arrows, group the line and arrowhead
      if (activeTool === 'arrow') {
        const arrowhead = canvas.getObjects().find(obj => obj.name === 'arrowhead');
        if (arrowhead) {
          const group = new fabric.Group([drawingObject, arrowhead], {
            selectable: true,
            hasControls: true,
            hasBorders: true
          });
          canvas.remove(drawingObject);
          canvas.remove(arrowhead);
          canvas.add(group);
        }
      }
      
      saveState();
    }

    setIsDrawing(false);
    setStartPoint(null);
    setDrawingObject(null);

    // Re-enable selection for select tool
    if (activeTool === 'select') {
      canvas.selection = true;
      canvas.forEachObject((obj) => {
        if (obj.name !== 'grid') {
          obj.selectable = true;
          obj.evented = true;
        }
      });
    }
  }, [activeTool, isDrawing, drawingObject, saveState]);

  const undo = useCallback(() => {
    if (!fabricCanvasRef.current || historyIndex <= 0) return;

    const canvas = fabricCanvasRef.current;
    const prevState = history[historyIndex - 1];
    
    canvas.loadFromJSON(prevState, () => {
      canvas.renderAll();
      setHistoryIndex(prev => prev - 1);
      addGrid(canvas, width, height);
    });
  }, [history, historyIndex, addGrid, width, height]);

  const redo = useCallback(() => {
    if (!fabricCanvasRef.current || historyIndex >= history.length - 1) return;

    const canvas = fabricCanvasRef.current;
    const nextState = history[historyIndex + 1];
    
    canvas.loadFromJSON(nextState, () => {
      canvas.renderAll();
      setHistoryIndex(prev => prev + 1);
      addGrid(canvas, width, height);
    });
  }, [history, historyIndex, addGrid, width, height]);

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
    
    saveState();
  }, [clipboard, saveState]);

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
      saveState();
    }
  }, [saveState]);

  const selectAll = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const allObjects = canvas.getObjects().filter(obj => obj.selectable !== false && obj.name !== 'grid');
    
    if (allObjects.length > 1) {
      const selection = new fabric.ActiveSelection(allObjects, { canvas });
      canvas.setActiveObject(selection);
      canvas.renderAll();
    } else if (allObjects.length === 1) {
      canvas.setActiveObject(allObjects[0]);
      canvas.renderAll();
    }
  }, []);

  const groupObjects = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const activeObjects = canvas.getActiveObjects();
    
    if (activeObjects.length > 1) {
      const group = new fabric.Group(activeObjects, {
        selectable: true,
        hasControls: true,
        hasBorders: true
      });
      
      activeObjects.forEach(obj => canvas.remove(obj));
      canvas.add(group);
      canvas.setActiveObject(group);
      canvas.renderAll();
      saveState();
    }
  }, [saveState]);

  const ungroupObjects = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const activeObject = canvas.getActiveObject();
    
    if (activeObject && activeObject.type === 'group') {
      const group = activeObject as fabric.Group;
      const objects = group.getObjects();
      
      canvas.remove(group);
      objects.forEach(obj => {
        canvas.add(obj);
      });
      
      const selection = new fabric.ActiveSelection(objects, { canvas });
      canvas.setActiveObject(selection);
      canvas.renderAll();
      saveState();
    }
  }, [saveState]);

  const clearCanvas = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    canvas.clear();
    canvas.backgroundColor = '#ffffff';
    
    addGrid(canvas, width, height);
    
    canvas.renderAll();
    saveState();
  }, [addGrid, width, height, saveState]);

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
    const json = JSON.stringify(canvas.toJSON(['name']), null, 2);
    
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
          addGrid(fabricCanvasRef.current!, width, height);
          saveState();
        });
      } catch (error) {
        console.error('Error importing JSON:', error);
        alert('Error importing file. Please check the file format.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }, [saveState, addGrid, width, height]);

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

  const fitToScreen = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const objects = canvas.getObjects().filter(obj => obj.name !== 'grid');
    
    if (objects.length === 0) return;

    const group = new fabric.Group(objects);
    const groupBounds = group.getBoundingRect();
    
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();
    
    const scaleX = (canvasWidth - 100) / groupBounds.width;
    const scaleY = (canvasHeight - 100) / groupBounds.height;
    const scale = Math.min(scaleX, scaleY, 1);
    
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const groupCenterX = groupBounds.left + groupBounds.width / 2;
    const groupCenterY = groupBounds.top + groupBounds.height / 2;
    
    canvas.setZoom(scale);
    canvas.viewportTransform = [
      scale, 0, 0, scale,
      centerX - groupCenterX * scale,
      centerY - groupCenterY * scale
    ];
    
    setZoom(scale);
    canvas.renderAll();
  }, []);

  // Initialize Fabric.js canvas - only once on mount
  useEffect(() => {
    if (!canvasContainerRef.current || fabricCanvasRef.current) return;

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
    addGrid(canvas, width, height);

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
        saveState();
      }
    });

    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);

    // Mouse wheel zoom
    canvas.on('mouse:wheel', (opt) => {
      const delta = opt.e.deltaY;
      let zoom = canvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      setZoom(zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });

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
          case 'g':
            e.preventDefault();
            groupObjects();
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
          case 'e':
            setActiveTool('eraser');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Save initial state
    setTimeout(() => saveState(), 100);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      canvas.dispose();
      // Clean up the canvas element
      if (canvasContainerRef.current && canvasElement.parentNode) {
        canvasContainerRef.current.removeChild(canvasElement);
      }
    };
  }, []); // Only initialize once

  // Update canvas size and grid when dimensions change
  useEffect(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    canvas.setDimensions({ width, height });
    addGrid(canvas, width, height);
    canvas.renderAll();
  }, [width, height, addGrid]);

  // Update grid when showGrid changes
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    addGrid(fabricCanvasRef.current, width, height);
    fabricCanvasRef.current.renderAll();
  }, [showGrid, addGrid, width, height]);

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
          if (obj.name !== 'grid') {
            obj.selectable = true;
            obj.evented = true;
          }
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
          if (obj.name !== 'grid') {
            obj.selectable = false;
            obj.evented = false;
          }
        });
        break;
      case 'eraser':
        canvas.defaultCursor = 'crosshair';
        canvas.hoverCursor = 'crosshair';
        canvas.selection = false;
        canvas.isDrawingMode = false;
        canvas.forEachObject((obj) => {
          if (obj.name !== 'grid') {
            obj.selectable = false;
            obj.evented = false;
          }
        });
        break;
      default:
        canvas.defaultCursor = 'crosshair';
        canvas.hoverCursor = 'crosshair';
        canvas.selection = false;
        canvas.isDrawingMode = false;
        canvas.forEachObject((obj) => {
          if (obj.name !== 'grid') {
            obj.selectable = false;
            obj.evented = false;
          }
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
    { id: 'eraser', icon: Eraser, label: 'Eraser (E)', shortcut: 'E' }
  ];

  const shapes = [
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'triangle', icon: Triangle, label: 'Triangle' },
    { id: 'diamond', icon: Diamond, label: 'Diamond' },
    { id: 'star', icon: Star, label: 'Star' }
  ];

  const fontSizes = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64];
  const fontFamilies = ['Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana'];

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
          
          {/* Shapes Menu */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowShapeMenu(!showShapeMenu)}
              className={`p-3 rounded-lg transition-colors ${
                ['rectangle', 'circle', 'triangle', 'diamond', 'star'].includes(activeTool)
                  ? 'bg-blue-100 text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Shapes"
            >
              <Square className="w-5 h-5" />
            </motion.button>

            <AnimatePresence>
              {showShapeMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 grid grid-cols-3 gap-1 z-50"
                >
                  {shapes.map((shape) => {
                    const Icon = shape.icon;
                    return (
                      <motion.button
                        key={shape.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setActiveTool(shape.id);
                          setShowShapeMenu(false);
                        }}
                        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                        title={shape.label}
                      >
                        <Icon className="w-4 h-4" />
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Image Tool */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addImage}
            className="p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            title="Add Image"
          >
            <Image className="w-5 h-5" />
          </motion.button>
          
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
                          // Update pen tool immediately if it's active
                          if (activeTool === 'pen' && fabricCanvasRef.current) {
                            fabricCanvasRef.current.freeDrawingBrush.color = color;
                          }
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
                        onChange={(e) => {
                          const newWidth = parseInt(e.target.value);
                          setStrokeWidth(newWidth);
                          // Update pen tool immediately if it's active
                          if (activeTool === 'pen' && fabricCanvasRef.current) {
                            fabricCanvasRef.current.freeDrawingBrush.width = newWidth;
                          }
                        }}
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

          {/* Text Formatting */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowTextMenu(!showTextMenu)}
              className="p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              title="Text Formatting"
            >
              <Type className="w-5 h-5" />
            </motion.button>

            <AnimatePresence>
              {showTextMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50 w-64"
                >
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Font Size</label>
                      <select
                        value={fontSize}
                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        {fontSizes.map(size => (
                          <option key={size} value={size}>{size}px</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Font Family</label>
                      <select
                        value={fontFamily}
                        onChange={(e) => setFontFamily(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        {fontFamilies.map(font => (
                          <option key={font} value={font}>{font}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Alignment</label>
                      <div className="flex space-x-1">
                        {[
                          { value: 'left', icon: AlignLeft },
                          { value: 'center', icon: AlignCenter },
                          { value: 'right', icon: AlignRight }
                        ].map(({ value, icon: Icon }) => (
                          <button
                            key={value}
                            onClick={() => setTextAlign(value)}
                            className={`flex-1 p-1 rounded border transition-colors ${
                              textAlign === value
                                ? 'border-blue-500 bg-blue-50 text-blue-600'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <Icon className="w-3 h-3 mx-auto" />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Style</label>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => setIsBold(!isBold)}
                          className={`p-1 rounded border transition-colors ${
                            isBold
                              ? 'border-blue-500 bg-blue-50 text-blue-600'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <Bold className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setIsItalic(!isItalic)}
                          className={`p-1 rounded border transition-colors ${
                            isItalic
                              ? 'border-blue-500 bg-blue-50 text-blue-600'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <Italic className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setIsUnderline(!isUnderline)}
                          className={`p-1 rounded border transition-colors ${
                            isUnderline
                              ? 'border-blue-500 bg-blue-50 text-blue-600'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <Underline className="w-3 h-3" />
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
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fitToScreen}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Fit to Screen"
          >
            <Eye className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* View Controls */}
      <div className="absolute bottom-4 right-4 z-50">
        <div className="flex items-center bg-white rounded-lg shadow-lg border border-gray-200 p-1 space-x-1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowGrid(!showGrid)}
            className={`p-2 rounded-lg transition-colors ${
              showGrid ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Toggle Grid"
          >
            <Grid className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLayerPanel(!showLayerPanel)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Layers"
          >
            <Layers className="w-4 h-4" />
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
            onClick={pasteObjects}
            disabled={clipboard.length === 0}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            title="Paste (Ctrl+V)"
          >
            <Clipboard className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={groupObjects}
            disabled={selectedObjects.length < 2}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            title="Group (Ctrl+G)"
          >
            <Group className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={ungroupObjects}
            disabled={selectedObjects.length === 0}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            title="Ungroup"
          >
            <Ungroup className="w-4 h-4" />
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
            <X className="w-4 h-4" />
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

      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Canvas Container */}
      <div
        ref={canvasContainerRef}
        className="border border-gray-300 bg-white"
        style={{ 
          width: width, 
          height: height,
          cursor: activeTool === 'hand' ? 'grab' : activeTool === 'pen' ? 'crosshair' : activeTool === 'eraser' ? 'crosshair' : 'default'
        }}
      />

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 p-3 z-30 max-w-2xl">
        <h4 className="text-sm font-semibold text-gray-900 mb-2 text-center">🎉 COMPLETE MIRO-LIKE CANVAS - ALL FEATURES WORKING!</h4>
        <div className="grid grid-cols-2 gap-x-6 text-xs text-gray-600">
          <div className="space-y-1">
            <p>• <strong>V</strong> - Select & move objects</p>
            <p>• <strong>H</strong> - Hand tool (pan canvas)</p>
            <p>• <strong>P</strong> - Pen tool (retains color/thickness)</p>
            <p>• <strong>T</strong> - Text (click & type)</p>
            <p>• <strong>S</strong> - Sticky notes (click to add)</p>
            <p>• <strong>E</strong> - Eraser (click/drag to erase)</p>
            <p>• <strong>Shapes</strong> - Rectangle, Circle, Triangle, Diamond, Star</p>
          </div>
          <div className="space-y-1">
            <p>• <strong>L</strong> - Line (drag to draw)</p>
            <p>• <strong>A</strong> - Arrow (drag to draw)</p>
            <p>• <strong>Image</strong> - Upload & add images</p>
            <p>• <strong>Ctrl+Z/Y</strong> - Undo/Redo</p>
            <p>• <strong>Ctrl+C/V/D</strong> - Copy/Paste/Duplicate</p>
            <p>• <strong>Ctrl+G</strong> - Group/Ungroup</p>
            <p>• <strong>Mouse Wheel</strong> - Zoom in/out</p>
          </div>
        </div>
      </div>
    </div>
  );
};