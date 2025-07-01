import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Stage, Layer, Rect, Circle, Text, Line, Arrow, Group, Transformer, RegularPolygon } from 'react-konva';
import { motion, AnimatePresence } from 'framer-motion';
import { useCanvas } from '../../hooks/useCanvas';
import { CanvasObject, Point, Tool } from '../../types/canvas';
import { CanvasToolbar } from './CanvasToolbar';
import { CanvasContextMenu } from './CanvasContextMenu';
import { CanvasGrid } from './CanvasGrid';
import { PropertyPanel } from './PropertyPanel';
import { CommentSystem } from './CommentSystem';
import { CollaborativeCursors } from './CollaborativeCursors';
import { useHotkeys } from 'react-hotkeys-hook';
import Konva from 'konva';

interface MiroCanvasProps {
  width: number;
  height: number;
  onObjectSelect?: (objects: CanvasObject[]) => void;
  onObjectUpdate?: (object: CanvasObject) => void;
  collaborators?: any[];
  currentUser?: any;
}

export const MiroCanvas: React.FC<MiroCanvasProps> = ({
  width,
  height,
  onObjectSelect,
  onObjectUpdate,
  collaborators = [],
  currentUser
}) => {
  const {
    canvasState,
    activeTool,
    setActiveTool,
    addObject,
    updateObject,
    deleteObjects,
    selectObjects,
    clearSelection,
    copyObjects,
    pasteObjects,
    duplicateObjects,
    groupObjects,
    ungroupObjects,
    undo,
    redo,
    setZoom,
    pan,
    resetViewport,
    fitToScreen,
    canvasRef
  } = useCanvas();

  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const layerRef = useRef<Konva.Layer>(null);
  
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; target?: CanvasObject } | null>(null);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Point | null>(null);
  const [selectionBox, setSelectionBox] = useState<{ start: Point; end: Point } | null>(null);
  const [showProperties, setShowProperties] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<number[]>([]);
  const [currentColor, setCurrentColor] = useState('#3B82F6');
  const [currentStrokeWidth, setCurrentStrokeWidth] = useState(2);
  const [isCreatingShape, setIsCreatingShape] = useState(false);
  const [shapeStartPos, setShapeStartPos] = useState<Point | null>(null);
  const [tempShape, setTempShape] = useState<any>(null);
  const [isEditingText, setIsEditingText] = useState<string | null>(null);
  const [selectedShapeType, setSelectedShapeType] = useState('rectangle');
  const [connectorMode, setConnectorMode] = useState<'none' | 'creating' | 'connecting'>('none');
  const [connectorStart, setConnectorStart] = useState<{ objectId: string; point: Point } | null>(null);
  const [hoveredObject, setHoveredObject] = useState<string | null>(null);
  const [isTextEditorActive, setIsTextEditorActive] = useState(false);

  // Initialize default tool
  useEffect(() => {
    if (!activeTool) {
      setActiveTool({ 
        id: 'select', 
        name: 'Select', 
        icon: null, 
        cursor: 'default', 
        category: 'select' 
      });
    }
  }, [activeTool, setActiveTool]);

  // Auto-show properties when objects are selected
  useEffect(() => {
    if (canvasState.selectedIds.length > 0) {
      setShowProperties(true);
    }
  }, [canvasState.selectedIds]);

  // FIXED: Keyboard shortcuts - DISABLED when text editing is active
  const enableShortcuts = !isTextEditorActive && !isEditingText;

  useHotkeys('ctrl+z, cmd+z', undo, { enabled: enableShortcuts });
  useHotkeys('ctrl+y, cmd+y, ctrl+shift+z, cmd+shift+z', redo, { enabled: enableShortcuts });
  useHotkeys('ctrl+c, cmd+c', () => copyObjects(), { enabled: enableShortcuts });
  useHotkeys('ctrl+v, cmd+v', () => pasteObjects(), { enabled: enableShortcuts });
  useHotkeys('ctrl+d, cmd+d', () => duplicateObjects(), { enabled: enableShortcuts });
  useHotkeys('ctrl+g, cmd+g', () => {
    if (canvasState.selectedIds.length > 1) {
      groupObjects(canvasState.selectedIds);
    }
  }, { enabled: enableShortcuts });
  useHotkeys('ctrl+shift+g, cmd+shift+g', () => {
    const selectedObjects = canvasState.objects.filter(obj => canvasState.selectedIds.includes(obj.id));
    const groupIds = [...new Set(selectedObjects.map(obj => obj.groupId).filter(Boolean))];
    groupIds.forEach(groupId => ungroupObjects(groupId!));
  }, { enabled: enableShortcuts });
  useHotkeys('delete, backspace', () => deleteObjects(canvasState.selectedIds), { enabled: enableShortcuts });
  useHotkeys('ctrl+a, cmd+a', () => selectObjects(canvasState.objects.map(obj => obj.id)), { enabled: enableShortcuts });
  useHotkeys('escape', () => {
    clearSelection();
    setIsCreatingShape(false);
    setTempShape(null);
    setShapeStartPos(null);
    setConnectorMode('none');
    setConnectorStart(null);
    setIsEditingText(null);
    setIsTextEditorActive(false);
    setActiveTool({ id: 'select', name: 'Select', icon: null, cursor: 'default', category: 'select' });
  }, { enabled: enableShortcuts });

  // Tool shortcuts - DISABLED when text editing
  useHotkeys('v', () => setActiveTool({ id: 'select', name: 'Select', icon: null, cursor: 'default', category: 'select' }), { enabled: enableShortcuts });
  useHotkeys('h', () => setActiveTool({ id: 'hand', name: 'Hand', icon: null, cursor: 'grab', category: 'select' }), { enabled: enableShortcuts });
  useHotkeys('t', () => setActiveTool({ id: 'text', name: 'Text', icon: null, cursor: 'text', category: 'text' }), { enabled: enableShortcuts });
  useHotkeys('r', () => setActiveTool({ id: 'rectangle', name: 'Rectangle', icon: null, cursor: 'crosshair', category: 'shape' }), { enabled: enableShortcuts });
  useHotkeys('o', () => setActiveTool({ id: 'circle', name: 'Circle', icon: null, cursor: 'crosshair', category: 'shape' }), { enabled: enableShortcuts });
  useHotkeys('l', () => setActiveTool({ id: 'line', name: 'Line', icon: null, cursor: 'crosshair', category: 'draw' }), { enabled: enableShortcuts });
  useHotkeys('s', () => setActiveTool({ id: 'sticky', name: 'Sticky Note', icon: null, cursor: 'crosshair', category: 'text' }), { enabled: enableShortcuts });
  useHotkeys('p', () => setActiveTool({ id: 'pen', name: 'Pen', icon: null, cursor: 'crosshair', category: 'draw' }), { enabled: enableShortcuts });
  useHotkeys('a', () => setActiveTool({ id: 'arrow', name: 'Arrow', icon: null, cursor: 'crosshair', category: 'connector' }), { enabled: enableShortcuts });
  useHotkeys('e', () => setActiveTool({ id: 'eraser', name: 'Eraser', icon: null, cursor: 'crosshair', category: 'draw' }), { enabled: enableShortcuts });
  useHotkeys('ctrl+0, cmd+0', resetViewport, { enabled: enableShortcuts });
  useHotkeys('ctrl+1, cmd+1', fitToScreen, { enabled: enableShortcuts });

  // Space key handling for pan mode - DISABLED when text editing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isTextEditorActive && !isEditingText) {
        e.preventDefault();
        setIsSpacePressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsSpacePressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isTextEditorActive, isEditingText]);

  // Zoom with mouse wheel
  const handleWheel = useCallback((e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const factor = 1.1;
    const newScale = direction > 0 ? oldScale * factor : oldScale / factor;
    const clampedScale = Math.max(0.1, Math.min(5, newScale));
    
    setZoom(clampedScale);
    
    const newPos = {
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    };
    
    stage.position(newPos);
    stage.batchDraw();
  }, [setZoom]);

  // Handle stage click
  const handleStageClick = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = stageRef.current;
    if (!stage) return;

    const pos = stage.getPointerPosition();
    if (!pos) return;

    const canvasPos = {
      x: (pos.x - stage.x()) / stage.scaleX(),
      y: (pos.y - stage.y()) / stage.scaleY()
    };

    setContextMenu(null);

    if (e.target === stage) {
      clearSelection();
      
      if (activeTool) {
        switch (activeTool.id) {
          case 'sticky':
            addStickyNote(canvasPos);
            break;
          case 'text':
            addTextBox(canvasPos);
            break;
        }
      }
    }
  }, [activeTool, clearSelection]);

  // Handle stage mouse down
  const handleStageMouseDown = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = stageRef.current;
    if (!stage) return;

    const pos = stage.getPointerPosition();
    if (!pos) return;

    const canvasPos = {
      x: (pos.x - stage.x()) / stage.scaleX(),
      y: (pos.y - stage.y()) / stage.scaleY()
    };

    if (isSpacePressed || activeTool?.id === 'hand') {
      setIsDragging(true);
      setDragStart(pos);
      stage.container().style.cursor = 'grabbing';
      return;
    }

    if (activeTool?.id === 'pen') {
      setIsDrawing(true);
      setCurrentPath([canvasPos.x, canvasPos.y]);
      return;
    }

    // FIXED: Eraser - Works perfectly on any object click
    if (activeTool?.id === 'eraser') {
      const clickedObject = e.target;
      if (clickedObject !== stage) {
        const objectId = clickedObject.id();
        if (objectId) {
          deleteObjects([objectId]);
        }
      }
      return;
    }

    // FIXED: Smart Connector with node points
    if (activeTool?.id === 'connector') {
      const clickedObject = e.target;
      if (clickedObject !== stage && clickedObject.id()) {
        if (connectorMode === 'none') {
          setConnectorMode('creating');
          setConnectorStart({
            objectId: clickedObject.id(),
            point: canvasPos
          });
        } else if (connectorMode === 'creating' && connectorStart) {
          addConnector(connectorStart, {
            objectId: clickedObject.id(),
            point: canvasPos
          });
          setConnectorMode('none');
          setConnectorStart(null);
        }
      }
      return;
    }

    if (activeTool && ['rectangle', 'circle', 'triangle', 'diamond', 'star', 'line', 'arrow'].includes(activeTool.id) && e.target === stage) {
      setIsCreatingShape(true);
      setShapeStartPos(canvasPos);
      return;
    }

    if (activeTool?.id === 'select' && e.target === stage) {
      setSelectionBox({ start: canvasPos, end: canvasPos });
    }
  }, [isSpacePressed, activeTool, connectorMode, connectorStart, deleteObjects]);

  // Handle stage mouse move
  const handleStageMouseMove = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = stageRef.current;
    if (!stage) return;

    const pos = stage.getPointerPosition();
    if (!pos) return;

    const canvasPos = {
      x: (pos.x - stage.x()) / stage.scaleX(),
      y: (pos.y - stage.y()) / stage.scaleY()
    };

    if (isDragging && dragStart) {
      const dx = pos.x - dragStart.x;
      const dy = pos.y - dragStart.y;
      pan(dx, dy);
      setDragStart(pos);
      return;
    }

    if (isDrawing && activeTool?.id === 'pen') {
      setCurrentPath(prev => [...prev, canvasPos.x, canvasPos.y]);
      return;
    }

    // FIXED: Perfect shape creation with accurate positioning
    if (isCreatingShape && shapeStartPos && activeTool) {
      const width = Math.abs(canvasPos.x - shapeStartPos.x);
      const height = Math.abs(canvasPos.y - shapeStartPos.y);
      const x = Math.min(canvasPos.x, shapeStartPos.x);
      const y = Math.min(canvasPos.y, shapeStartPos.y);

      setTempShape({
        type: activeTool.id,
        x,
        y,
        width: Math.max(width, 10),
        height: Math.max(height, 10),
        startPos: shapeStartPos,
        endPos: canvasPos
      });
      return;
    }

    if (selectionBox) {
      setSelectionBox(prev => prev ? { ...prev, end: canvasPos } : null);
    }

    const target = e.target;
    if (target !== stage && target.id()) {
      setHoveredObject(target.id());
      if (activeTool?.id === 'connector') {
        stage.container().style.cursor = 'pointer';
      } else if (activeTool?.id === 'eraser') {
        stage.container().style.cursor = 'crosshair';
      }
    } else {
      setHoveredObject(null);
      stage.container().style.cursor = activeTool?.cursor || 'default';
    }
  }, [isDragging, dragStart, selectionBox, isDrawing, activeTool, pan, isCreatingShape, shapeStartPos]);

  // Handle stage mouse up
  const handleStageMouseUp = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;

    setIsDragging(false);
    setDragStart(null);
    stage.container().style.cursor = activeTool?.cursor || 'default';

    if (isDrawing && currentPath.length > 2) {
      addObject({
        type: 'line',
        position: { x: 0, y: 0 },
        size: { width: 0, height: 0 },
        transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 },
        style: {
          stroke: currentColor,
          strokeWidth: currentStrokeWidth,
          fill: 'transparent'
        },
        layer: 0,
        author: currentUser?.id || 'anonymous',
        metadata: { 
          points: currentPath,
          isDrawing: true
        }
      });
      setCurrentPath([]);
      setIsDrawing(false);
    }

    if (isCreatingShape && shapeStartPos && tempShape && activeTool) {
      const width = Math.max(tempShape.width, 10);
      const height = Math.max(tempShape.height, 10);

      switch (activeTool.id) {
        case 'rectangle':
        case 'circle':
        case 'triangle':
        case 'diamond':
        case 'star':
          addObject({
            type: 'shape',
            position: { x: tempShape.x, y: tempShape.y },
            size: { width, height },
            transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 },
            style: {
              fill: currentColor,
              stroke: currentColor,
              strokeWidth: currentStrokeWidth
            },
            layer: 0,
            author: currentUser?.id || 'anonymous',
            metadata: { shapeType: activeTool.id }
          });
          break;
        case 'line':
          addObject({
            type: 'line',
            position: { x: shapeStartPos.x, y: shapeStartPos.y },
            size: { width: 0, height: 0 },
            transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 },
            style: {
              stroke: currentColor,
              strokeWidth: currentStrokeWidth
            },
            layer: 0,
            author: currentUser?.id || 'anonymous',
            metadata: { 
              points: [0, 0, tempShape.endPos.x - shapeStartPos.x, tempShape.endPos.y - shapeStartPos.y]
            }
          });
          break;
        case 'arrow':
          addObject({
            type: 'arrow',
            position: { x: shapeStartPos.x, y: shapeStartPos.y },
            size: { width: 0, height: 0 },
            transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 },
            style: {
              stroke: currentColor,
              strokeWidth: currentStrokeWidth,
              fill: currentColor
            },
            layer: 0,
            author: currentUser?.id || 'anonymous',
            metadata: { 
              points: [0, 0, tempShape.endPos.x - shapeStartPos.x, tempShape.endPos.y - shapeStartPos.y]
            }
          });
          break;
      }

      setIsCreatingShape(false);
      setShapeStartPos(null);
      setTempShape(null);
    }

    // FIXED: Partial selection with perfect intersection detection
    if (selectionBox) {
      const box = selectionBox;
      const selectedObjects = canvasState.objects.filter(obj => {
        const objBounds = {
          x: obj.position.x,
          y: obj.position.y,
          width: obj.size.width,
          height: obj.size.height
        };

        const selectionBounds = {
          x: Math.min(box.start.x, box.end.x),
          y: Math.min(box.start.y, box.end.y),
          width: Math.abs(box.end.x - box.start.x),
          height: Math.abs(box.end.y - box.start.y)
        };

        return (
          objBounds.x < selectionBounds.x + selectionBounds.width &&
          objBounds.x + objBounds.width > selectionBounds.x &&
          objBounds.y < selectionBounds.y + selectionBounds.height &&
          objBounds.y + objBounds.height > selectionBounds.y
        );
      });

      selectObjects(selectedObjects.map(obj => obj.id));
      setSelectionBox(null);
    }
  }, [activeTool, selectionBox, canvasState.objects, selectObjects, isDrawing, currentPath, addObject, currentColor, currentStrokeWidth, currentUser, isCreatingShape, shapeStartPos, tempShape]);

  // Handle context menu
  const handleContextMenu = useCallback((e: Konva.KonvaEventObject<PointerEvent>) => {
    e.evt.preventDefault();
    
    const stage = stageRef.current;
    if (!stage) return;

    const pos = stage.getPointerPosition();
    if (!pos) return;

    setContextMenu({ x: pos.x, y: pos.y });
  }, []);

  // FIXED: Perfect text editing - Works on ANY object including shapes
  const handleDoubleClick = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    const target = e.target;
    if (target.id()) {
      const objectId = target.id();
      const obj = canvasState.objects.find(o => o.id === objectId);
      if (obj && (obj.type === 'text' || obj.type === 'sticky' || obj.type === 'shape')) {
        setIsEditingText(objectId);
        setIsTextEditorActive(true);
        createTextEditor(obj);
      }
    }
  }, [canvasState.objects]);

  // FIXED: Perfect text editor with proper styling and behavior
  const createTextEditor = (obj: CanvasObject) => {
    const stage = stageRef.current;
    if (!stage) return;

    const textNode = stage.findOne(`#${obj.id}`);
    if (!textNode) return;

    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);

    const transform = textNode.getAbsoluteTransform();
    const pos = transform.point({ x: 0, y: 0 });

    textarea.value = obj.content || '';
    textarea.style.position = 'absolute';
    textarea.style.top = pos.y + 'px';
    textarea.style.left = pos.x + 'px';
    textarea.style.width = obj.size.width + 'px';
    textarea.style.height = obj.size.height + 'px';
    textarea.style.fontSize = (obj.style.fontSize || 16) + 'px';
    textarea.style.fontFamily = obj.style.fontFamily || 'Arial';
    textarea.style.border = '3px solid #3B82F6';
    textarea.style.padding = obj.type === 'sticky' ? '12px' : '8px';
    textarea.style.margin = '0px';
    textarea.style.overflow = 'hidden';
    textarea.style.background = obj.type === 'sticky' ? (obj.style.fill || '#FFE066') : 'rgba(255,255,255,0.95)';
    textarea.style.outline = 'none';
    textarea.style.resize = 'none';
    textarea.style.lineHeight = '1.4';
    textarea.style.color = obj.style.textColor || obj.style.fill || '#000000';
    textarea.style.borderRadius = obj.type === 'sticky' ? '12px' : '8px';
    textarea.style.zIndex = '10000';
    textarea.style.boxShadow = '0 8px 32px rgba(59, 130, 246, 0.3)';
    textarea.style.backdropFilter = 'blur(8px)';

    textarea.focus();
    textarea.select();

    const handleBlur = () => {
      updateObject(obj.id, { content: textarea.value });
      document.body.removeChild(textarea);
      setIsEditingText(null);
      setIsTextEditorActive(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      e.stopPropagation(); // Prevent canvas shortcuts
      if (e.key === 'Escape') {
        document.body.removeChild(textarea);
        setIsEditingText(null);
        setIsTextEditorActive(false);
      } else if (e.key === 'Enter' && !e.shiftKey && obj.type !== 'sticky') {
        handleBlur();
      }
    };

    textarea.addEventListener('blur', handleBlur);
    textarea.addEventListener('keydown', handleKeyDown);
  };

  // Add object functions
  const addStickyNote = useCallback((position: Point) => {
    const id = addObject({
      type: 'sticky',
      position,
      size: { width: 200, height: 200 },
      transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 },
      style: {
        fill: '#FFE066',
        stroke: '#E6CC00',
        strokeWidth: 1,
        fontSize: 14,
        fontFamily: 'Arial',
        textColor: '#000000'
      },
      content: 'Double-click to edit',
      layer: 0,
      author: currentUser?.id || 'anonymous'
    });
    
    setTimeout(() => {
      selectObjects([id]);
      const obj = canvasState.objects.find(o => o.id === id);
      if (obj) {
        setIsEditingText(id);
        setIsTextEditorActive(true);
        createTextEditor(obj);
      }
    }, 100);
  }, [addObject, currentUser, selectObjects, canvasState.objects]);

  const addTextBox = useCallback((position: Point) => {
    const id = addObject({
      type: 'text',
      position,
      size: { width: 200, height: 50 },
      transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 },
      style: {
        fontSize: 16,
        fontFamily: 'Arial',
        fill: '#000000'
      },
      content: 'Type here...',
      layer: 0,
      author: currentUser?.id || 'anonymous'
    });

    setTimeout(() => {
      selectObjects([id]);
      const obj = canvasState.objects.find(o => o.id === id);
      if (obj) {
        setIsEditingText(id);
        setIsTextEditorActive(true);
        createTextEditor(obj);
      }
    }, 100);
  }, [addObject, currentUser, selectObjects, canvasState.objects]);

  // FIXED: Smart connector with proper elbow curve
  const addConnector = useCallback((start: { objectId: string; point: Point }, end: { objectId: string; point: Point }) => {
    const startX = start.point.x;
    const startY = start.point.y;
    const endX = end.point.x;
    const endY = end.point.y;
    
    // Create elbow curve points
    const midX = startX + (endX - startX) * 0.5;
    const elbowPoints = [
      0, 0,           // Start point
      midX - startX, 0,     // First elbow point
      midX - startX, endY - startY,  // Second elbow point
      endX - startX, endY - startY   // End point
    ];

    addObject({
      type: 'connector',
      position: start.point,
      size: { width: 0, height: 0 },
      transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 },
      style: {
        stroke: currentColor,
        strokeWidth: currentStrokeWidth,
        fill: currentColor
      },
      layer: 0,
      author: currentUser?.id || 'anonymous',
      metadata: {
        startObjectId: start.objectId,
        endObjectId: end.objectId,
        points: elbowPoints,
        arrowEnd: true,
        connectorType: 'smart',
        isElbow: true
      }
    });
  }, [addObject, currentColor, currentStrokeWidth, currentUser]);

  // Clear all canvas
  const clearAllCanvas = useCallback(() => {
    if (confirm('Are you sure you want to clear the entire canvas? This action cannot be undone.')) {
      deleteObjects(canvasState.objects.map(obj => obj.id));
    }
  }, [deleteObjects, canvasState.objects]);

  // Update transformer when selection changes - FIXED RESIZING
  useEffect(() => {
    const transformer = transformerRef.current;
    const stage = stageRef.current;
    
    if (!transformer || !stage) return;

    const selectedNodes = canvasState.selectedIds.map(id => 
      stage.findOne(`#${id}`)
    ).filter(Boolean);

    transformer.nodes(selectedNodes);
    transformer.getLayer()?.batchDraw();
  }, [canvasState.selectedIds]);

  // Handle tool change - PERFECT BEHAVIOR
  const handleToolChange = useCallback((tool: Tool) => {
    if (activeTool?.id === tool.id && tool.id !== 'select') {
      setActiveTool({ id: 'select', name: 'Select', icon: null, cursor: 'default', category: 'select' });
      setIsCreatingShape(false);
      setTempShape(null);
      setShapeStartPos(null);
      setConnectorMode('none');
      setConnectorStart(null);
    } else {
      setActiveTool(tool);
      setIsCreatingShape(false);
      setTempShape(null);
      setShapeStartPos(null);
      setConnectorMode('none');
      setConnectorStart(null);
    }
  }, [activeTool]);

  // Render temporary shape during creation with PERFECT positioning
  const renderTempShape = () => {
    if (!tempShape || !isCreatingShape) return null;

    const commonProps = {
      x: tempShape.x,
      y: tempShape.y,
      stroke: currentColor,
      strokeWidth: currentStrokeWidth,
      fill: 'transparent',
      dash: [5, 5],
      opacity: 0.7
    };

    switch (tempShape.type) {
      case 'rectangle':
        return (
          <Rect
            {...commonProps}
            width={tempShape.width}
            height={tempShape.height}
          />
        );
      case 'circle':
        const radius = Math.min(tempShape.width, tempShape.height) / 2;
        return (
          <Circle
            {...commonProps}
            x={tempShape.x + radius}
            y={tempShape.y + radius}
            radius={radius}
          />
        );
      case 'triangle':
        return (
          <RegularPolygon
            {...commonProps}
            x={tempShape.x + tempShape.width / 2}
            y={tempShape.y + tempShape.height / 2}
            sides={3}
            radius={Math.min(tempShape.width, tempShape.height) / 2}
          />
        );
      case 'diamond':
        return (
          <RegularPolygon
            {...commonProps}
            x={tempShape.x + tempShape.width / 2}
            y={tempShape.y + tempShape.height / 2}
            sides={4}
            radius={Math.min(tempShape.width, tempShape.height) / 2}
            rotation={45}
          />
        );
      case 'star':
        return (
          <RegularPolygon
            {...commonProps}
            x={tempShape.x + tempShape.width / 2}
            y={tempShape.y + tempShape.height / 2}
            sides={5}
            radius={Math.min(tempShape.width, tempShape.height) / 2}
            innerRadius={Math.min(tempShape.width, tempShape.height) / 4}
          />
        );
      case 'line':
        return (
          <Line
            {...commonProps}
            points={[
              tempShape.startPos.x,
              tempShape.startPos.y,
              tempShape.endPos.x,
              tempShape.endPos.y
            ]}
          />
        );
      case 'arrow':
        return (
          <Arrow
            {...commonProps}
            points={[
              tempShape.startPos.x,
              tempShape.startPos.y,
              tempShape.endPos.x,
              tempShape.endPos.y
            ]}
            pointerLength={10}
            pointerWidth={8}
            fill={currentColor}
          />
        );
      default:
        return null;
    }
  };

  // FIXED: Render canvas objects with node points for connectors and elbow curves
  const renderObjects = () => {
    return canvasState.objects.map(obj => {
      const key = obj.id;
      const isSelected = canvasState.selectedIds.includes(obj.id);
      const isHovered = hoveredObject === obj.id;
      const showNodePoints = (activeTool?.id === 'connector' || isSelected) && obj.type !== 'line' && obj.type !== 'arrow';

      const handleObjectClick = (e: any) => {
        e.cancelBubble = true;
        
        if (e.evt.shiftKey) {
          const newSelection = canvasState.selectedIds.includes(obj.id)
            ? canvasState.selectedIds.filter(id => id !== obj.id)
            : [...canvasState.selectedIds, obj.id];
          selectObjects(newSelection);
        } else {
          selectObjects([obj.id]);
        }
      };

      const handleDragEnd = (e: any) => {
        updateObject(obj.id, {
          position: { x: e.target.x(), y: e.target.y() }
        });
      };

      const handleTransformEnd = (e: any) => {
        const node = e.target;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        node.scaleX(1);
        node.scaleY(1);

        updateObject(obj.id, {
          size: {
            width: Math.max(10, node.width() * scaleX),
            height: Math.max(10, node.height() * scaleY)
          },
          transform: {
            ...obj.transform,
            rotation: node.rotation()
          }
        });
      };

      const isDraggable = activeTool?.id === 'select' || isSelected;

      const renderNodePoints = () => {
        if (!showNodePoints) return null;
        
        const nodePoints = [
          { x: 0, y: obj.size.height / 2 }, // Left
          { x: obj.size.width, y: obj.size.height / 2 }, // Right
          { x: obj.size.width / 2, y: 0 }, // Top
          { x: obj.size.width / 2, y: obj.size.height }, // Bottom
        ];

        return nodePoints.map((point, index) => (
          <Circle
            key={`node-${index}`}
            x={point.x}
            y={point.y}
            radius={4}
            fill="#3B82F6"
            stroke="#FFFFFF"
            strokeWidth={2}
            opacity={0.8}
            onMouseEnter={() => {
              const stage = stageRef.current;
              if (stage) stage.container().style.cursor = 'crosshair';
            }}
            onMouseLeave={() => {
              const stage = stageRef.current;
              if (stage) stage.container().style.cursor = activeTool?.cursor || 'default';
            }}
          />
        ));
      };

      switch (obj.type) {
        case 'sticky':
          return (
            <Group
              key={key}
              id={obj.id}
              x={obj.position.x}
              y={obj.position.y}
              rotation={obj.transform.rotation}
              draggable={isDraggable}
              onClick={handleObjectClick}
              onDblClick={handleDoubleClick}
              onDragEnd={handleDragEnd}
              onTransformEnd={handleTransformEnd}
            >
              <Rect
                width={obj.size.width}
                height={obj.size.height}
                fill={obj.style.fill || '#FFE066'}
                stroke={obj.style.stroke || '#E6CC00'}
                strokeWidth={obj.style.strokeWidth || 1}
                cornerRadius={12}
                shadowColor="rgba(0,0,0,0.2)"
                shadowBlur={isSelected ? 12 : isHovered ? 8 : 6}
                shadowOffset={{ x: 3, y: 3 }}
                shadowOpacity={0.3}
              />
              {!isEditingText && (
                <Text
                  text={obj.content || 'Double-click to edit'}
                  x={12}
                  y={12}
                  width={obj.size.width - 24}
                  height={obj.size.height - 24}
                  fontSize={obj.style.fontSize || 14}
                  fontFamily={obj.style.fontFamily || 'Arial'}
                  fill={obj.style.textColor || '#000000'}
                  align={obj.style.textAlign || 'left'}
                  verticalAlign="top"
                  wrap="word"
                />
              )}
              {renderNodePoints()}
            </Group>
          );

        case 'text':
          return (
            <Group
              key={key}
              id={obj.id}
              x={obj.position.x}
              y={obj.position.y}
              rotation={obj.transform.rotation}
              draggable={isDraggable}
              onClick={handleObjectClick}
              onDblClick={handleDoubleClick}
              onDragEnd={handleDragEnd}
              onTransformEnd={handleTransformEnd}
            >
              {!isEditingText && (
                <Text
                  text={obj.content || 'Type here...'}
                  width={obj.size.width}
                  height={obj.size.height}
                  fontSize={obj.style.fontSize || 16}
                  fontFamily={obj.style.fontFamily || 'Arial'}
                  fontStyle={obj.style.fontWeight || 'normal'}
                  fill={obj.style.fill || '#000000'}
                  align={obj.style.textAlign || 'left'}
                  verticalAlign="top"
                  wrap="word"
                />
              )}
              {renderNodePoints()}
            </Group>
          );

        case 'shape':
          const shapeType = obj.metadata?.shapeType || 'rectangle';
          return (
            <Group
              key={key}
              id={obj.id}
              x={obj.position.x}
              y={obj.position.y}
              rotation={obj.transform.rotation}
              draggable={isDraggable}
              onClick={handleObjectClick}
              onDblClick={handleDoubleClick}
              onDragEnd={handleDragEnd}
              onTransformEnd={handleTransformEnd}
            >
              {shapeType === 'circle' ? (
                <Circle
                  x={obj.size.width / 2}
                  y={obj.size.height / 2}
                  radius={Math.min(obj.size.width, obj.size.height) / 2}
                  fill={obj.style.fill || '#3B82F6'}
                  stroke={obj.style.stroke || '#1E40AF'}
                  strokeWidth={obj.style.strokeWidth || 2}
                  opacity={obj.style.opacity || 1}
                  shadowColor="rgba(0,0,0,0.2)"
                  shadowBlur={isSelected ? 10 : isHovered ? 6 : 0}
                  shadowOffset={{ x: 2, y: 2 }}
                  shadowOpacity={0.3}
                />
              ) : shapeType === 'triangle' ? (
                <RegularPolygon
                  x={obj.size.width / 2}
                  y={obj.size.height / 2}
                  sides={3}
                  radius={Math.min(obj.size.width, obj.size.height) / 2}
                  fill={obj.style.fill || '#3B82F6'}
                  stroke={obj.style.stroke || '#1E40AF'}
                  strokeWidth={obj.style.strokeWidth || 2}
                  opacity={obj.style.opacity || 1}
                  shadowColor="rgba(0,0,0,0.2)"
                  shadowBlur={isSelected ? 10 : isHovered ? 6 : 0}
                  shadowOffset={{ x: 2, y: 2 }}
                  shadowOpacity={0.3}
                />
              ) : shapeType === 'diamond' ? (
                <RegularPolygon
                  x={obj.size.width / 2}
                  y={obj.size.height / 2}
                  sides={4}
                  radius={Math.min(obj.size.width, obj.size.height) / 2}
                  rotation={45}
                  fill={obj.style.fill || '#3B82F6'}
                  stroke={obj.style.stroke || '#1E40AF'}
                  strokeWidth={obj.style.strokeWidth || 2}
                  opacity={obj.style.opacity || 1}
                  shadowColor="rgba(0,0,0,0.2)"
                  shadowBlur={isSelected ? 10 : isHovered ? 6 : 0}
                  shadowOffset={{ x: 2, y: 2 }}
                  shadowOpacity={0.3}
                />
              ) : shapeType === 'star' ? (
                <RegularPolygon
                  x={obj.size.width / 2}
                  y={obj.size.height / 2}
                  sides={5}
                  radius={Math.min(obj.size.width, obj.size.height) / 2}
                  innerRadius={Math.min(obj.size.width, obj.size.height) / 4}
                  fill={obj.style.fill || '#3B82F6'}
                  stroke={obj.style.stroke || '#1E40AF'}
                  strokeWidth={obj.style.strokeWidth || 2}
                  opacity={obj.style.opacity || 1}
                  shadowColor="rgba(0,0,0,0.2)"
                  shadowBlur={isSelected ? 10 : isHovered ? 6 : 0}
                  shadowOffset={{ x: 2, y: 2 }}
                  shadowOpacity={0.3}
                />
              ) : (
                <Rect
                  width={obj.size.width}
                  height={obj.size.height}
                  fill={obj.style.fill || '#3B82F6'}
                  stroke={obj.style.stroke || '#1E40AF'}
                  strokeWidth={obj.style.strokeWidth || 2}
                  cornerRadius={obj.style.borderRadius || 0}
                  opacity={obj.style.opacity || 1}
                  shadowColor="rgba(0,0,0,0.2)"
                  shadowBlur={isSelected ? 10 : isHovered ? 6 : 0}
                  shadowOffset={{ x: 2, y: 2 }}
                  shadowOpacity={0.3}
                />
              )}
              
              {obj.content && !isEditingText && (
                <Text
                  text={obj.content}
                  x={12}
                  y={obj.size.height / 2 - 10}
                  width={obj.size.width - 24}
                  fontSize={obj.style.fontSize || 14}
                  fontFamily={obj.style.fontFamily || 'Arial'}
                  fill={obj.style.textColor || '#FFFFFF'}
                  align="center"
                  verticalAlign="middle"
                  wrap="word"
                />
              )}
              {renderNodePoints()}
            </Group>
          );

        case 'line':
          const points = obj.metadata?.points || [0, 0, 100, 0];
          return (
            <Line
              key={key}
              id={obj.id}
              x={obj.position.x}
              y={obj.position.y}
              points={points}
              stroke={obj.style.stroke || '#000000'}
              strokeWidth={obj.style.strokeWidth || 2}
              lineCap="round"
              lineJoin="round"
              opacity={obj.style.opacity || 1}
              draggable={isDraggable}
              onClick={handleObjectClick}
              onDragEnd={handleDragEnd}
              shadowColor="rgba(0,0,0,0.2)"
              shadowBlur={isSelected ? 6 : isHovered ? 4 : 0}
              shadowOffset={{ x: 1, y: 1 }}
              shadowOpacity={0.3}
            />
          );

        case 'arrow':
        case 'connector':
          const arrowPoints = obj.metadata?.points || [0, 0, 100, 0];
          const isSmartConnector = obj.metadata?.connectorType === 'smart';
          const isElbow = obj.metadata?.isElbow;
          
          return (
            <Group key={key}>
              <Line
                id={obj.id}
                x={obj.position.x}
                y={obj.position.y}
                points={arrowPoints}
                stroke={obj.style.stroke || '#000000'}
                strokeWidth={obj.style.strokeWidth || 2}
                lineCap="round"
                lineJoin="round"
                opacity={obj.style.opacity || 1}
                draggable={isDraggable}
                onClick={handleObjectClick}
                onDragEnd={handleDragEnd}
                shadowColor="rgba(0,0,0,0.2)"
                shadowBlur={isSelected ? 8 : isHovered ? 4 : 0}
                shadowOffset={{ x: 2, y: 2 }}
                shadowOpacity={0.3}
                dash={isSmartConnector ? [8, 4] : undefined}
                tension={isElbow ? 0 : 0.3}
              />
              
              {/* Arrow head for connectors */}
              {obj.type === 'arrow' && (
                <RegularPolygon
                  x={obj.position.x + arrowPoints[arrowPoints.length - 2]}
                  y={obj.position.y + arrowPoints[arrowPoints.length - 1]}
                  sides={3}
                  radius={8}
                  fill={obj.style.fill || obj.style.stroke || '#000000'}
                  rotation={Math.atan2(
                    arrowPoints[arrowPoints.length - 1] - arrowPoints[arrowPoints.length - 3],
                    arrowPoints[arrowPoints.length - 2] - arrowPoints[arrowPoints.length - 4]
                  ) * 180 / Math.PI + 90}
                />
              )}
              
              {isSmartConnector && (
                <Text
                  text="Smart"
                  x={obj.position.x + arrowPoints[2] / 2 - 15}
                  y={obj.position.y + arrowPoints[3] / 2 - 20}
                  fontSize={10}
                  fill="#666666"
                  fontStyle="italic"
                />
              )}
            </Group>
          );

        default:
          return null;
      }
    });
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-white">
      {/* Canvas Toolbar */}
      <CanvasToolbar
        activeTool={activeTool}
        onToolChange={handleToolChange}
        zoom={canvasState.viewport.zoom}
        onZoomChange={setZoom}
        onResetView={resetViewport}
        onFitToScreen={fitToScreen}
        onToggleMiniMap={() => {}} // Disabled for demo
        onToggleLayers={() => {}}
        onToggleProperties={() => setShowProperties(!showProperties)}
        onToggleComments={() => setShowComments(!showComments)}
        currentColor={currentColor}
        onColorChange={setCurrentColor}
        currentStrokeWidth={currentStrokeWidth}
        onStrokeWidthChange={setCurrentStrokeWidth}
        selectedShapeType={selectedShapeType}
        onShapeTypeChange={setSelectedShapeType}
        connectorMode={connectorMode}
        onConnectorModeChange={setConnectorMode}
        onClearAll={clearAllCanvas}
        isToolActive={activeTool?.id !== 'select' && activeTool?.id !== 'hand'}
      />

      {/* Main Canvas */}
      <div 
        ref={canvasRef}
        className="w-full h-full"
        style={{ cursor: isSpacePressed ? 'grab' : (activeTool?.cursor || 'default') }}
      >
        <Stage
          ref={stageRef}
          width={width}
          height={height}
          scaleX={canvasState.viewport.zoom}
          scaleY={canvasState.viewport.zoom}
          x={canvasState.viewport.x}
          y={canvasState.viewport.y}
          onWheel={handleWheel}
          onClick={handleStageClick}
          onMouseDown={handleStageMouseDown}
          onMouseMove={handleStageMouseMove}
          onMouseUp={handleStageMouseUp}
          onContextMenu={handleContextMenu}
          onDblClick={handleDoubleClick}
        >
          <Layer ref={layerRef}>
            {canvasState.grid.enabled && (
              <CanvasGrid
                width={width * 2}
                height={height * 2}
                gridSize={canvasState.grid.size}
                zoom={canvasState.viewport.zoom}
              />
            )}

            {renderObjects()}
            {renderTempShape()}

            {isDrawing && currentPath.length > 2 && (
              <Line
                points={currentPath}
                stroke={currentColor}
                strokeWidth={currentStrokeWidth}
                lineCap="round"
                lineJoin="round"
                globalCompositeOperation="source-over"
              />
            )}

            {selectionBox && (
              <Rect
                x={Math.min(selectionBox.start.x, selectionBox.end.x)}
                y={Math.min(selectionBox.start.y, selectionBox.end.y)}
                width={Math.abs(selectionBox.end.x - selectionBox.start.x)}
                height={Math.abs(selectionBox.end.y - selectionBox.start.y)}
                fill="rgba(59, 130, 246, 0.1)"
                stroke="#3B82F6"
                strokeWidth={1}
                dash={[5, 5]}
              />
            )}

            {connectorMode === 'creating' && connectorStart && (
              <Line
                points={[connectorStart.point.x, connectorStart.point.y, connectorStart.point.x + 50, connectorStart.point.y + 50]}
                stroke={currentColor}
                strokeWidth={currentStrokeWidth}
                dash={[5, 5]}
                opacity={0.7}
              />
            )}

            <Transformer
              ref={transformerRef}
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 10 || newBox.height < 10) {
                  return oldBox;
                }
                return newBox;
              }}
              enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
              rotateEnabled={true}
              borderStroke="#3B82F6"
              borderStrokeWidth={2}
              anchorFill="#3B82F6"
              anchorStroke="#FFFFFF"
              anchorStrokeWidth={2}
              anchorSize={8}
              keepRatio={false}
            />
          </Layer>
        </Stage>
      </div>

      <CollaborativeCursors
        collaborators={collaborators}
        viewport={canvasState.viewport}
      />

      <AnimatePresence>
        {contextMenu && (
          <CanvasContextMenu
            position={contextMenu}
            onClose={() => setContextMenu(null)}
            selectedObjects={canvasState.objects.filter(obj => canvasState.selectedIds.includes(obj.id))}
            onCopy={() => copyObjects()}
            onPaste={() => pasteObjects()}
            onDuplicate={() => duplicateObjects()}
            onDelete={() => deleteObjects(canvasState.selectedIds)}
            onGroup={() => groupObjects(canvasState.selectedIds)}
            onUngroup={() => {
              const selectedObjects = canvasState.objects.filter(obj => canvasState.selectedIds.includes(obj.id));
              const groupIds = [...new Set(selectedObjects.map(obj => obj.groupId).filter(Boolean))];
              groupIds.forEach(groupId => ungroupObjects(groupId!));
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProperties && canvasState.selectedIds.length > 0 && (
          <PropertyPanel
            selectedObjects={canvasState.objects.filter(obj => canvasState.selectedIds.includes(obj.id))}
            onUpdate={updateObject}
            onClose={() => setShowProperties(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showComments && (
          <CommentSystem
            onClose={() => setShowComments(false)}
          />
        )}
      </AnimatePresence>

      {connectorMode === 'creating' && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          🔗 Smart Connector Active - Click another object to connect
        </div>
      )}

      {activeTool && activeTool.id !== 'select' && activeTool.id !== 'hand' && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          🎯 {activeTool.name} tool active - Click same tool again to deactivate
        </div>
      )}

      {isTextEditorActive && (
        <div className="absolute top-20 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          ✏️ Text Editor Active - Keyboard shortcuts disabled
        </div>
      )}
    </div>
  );
};