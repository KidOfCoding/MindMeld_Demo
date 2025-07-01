import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Stage, Layer, Rect, Circle, Text, Line, Arrow, Group, Transformer, RegularPolygon } from 'react-konva';
import { motion, AnimatePresence } from 'framer-motion';
import { useCanvas } from '../../hooks/useCanvas';
import { CanvasObject, Point, Tool } from '../../types/canvas';
import { CanvasToolbar } from './CanvasToolbar';
import { CanvasContextMenu } from './CanvasContextMenu';
import { CanvasGrid } from './CanvasGrid';
import { MiniMap } from './MiniMap';
import { LayerPanel } from './LayerPanel';
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
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [showLayers, setShowLayers] = useState(false);
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

  // Keyboard shortcuts
  useHotkeys('ctrl+z, cmd+z', undo);
  useHotkeys('ctrl+y, cmd+y, ctrl+shift+z, cmd+shift+z', redo);
  useHotkeys('ctrl+c, cmd+c', () => copyObjects());
  useHotkeys('ctrl+v, cmd+v', () => pasteObjects());
  useHotkeys('ctrl+d, cmd+d', () => duplicateObjects());
  useHotkeys('ctrl+g, cmd+g', () => {
    if (canvasState.selectedIds.length > 1) {
      groupObjects(canvasState.selectedIds);
    }
  });
  useHotkeys('ctrl+shift+g, cmd+shift+g', () => {
    const selectedObjects = canvasState.objects.filter(obj => canvasState.selectedIds.includes(obj.id));
    const groupIds = [...new Set(selectedObjects.map(obj => obj.groupId).filter(Boolean))];
    groupIds.forEach(groupId => ungroupObjects(groupId!));
  });
  useHotkeys('delete, backspace', () => deleteObjects(canvasState.selectedIds));
  useHotkeys('ctrl+a, cmd+a', () => selectObjects(canvasState.objects.map(obj => obj.id)));
  useHotkeys('escape', () => {
    clearSelection();
    setIsCreatingShape(false);
    setTempShape(null);
    setShapeStartPos(null);
    setConnectorMode('none');
    setConnectorStart(null);
    setIsEditingText(null);
    // Always return to select tool on escape
    setActiveTool({ id: 'select', name: 'Select', icon: null, cursor: 'default', category: 'select' });
  });

  // Tool shortcuts - NO auto-switching behavior
  useHotkeys('v', () => setActiveTool({ id: 'select', name: 'Select', icon: null, cursor: 'default', category: 'select' }));
  useHotkeys('h', () => setActiveTool({ id: 'hand', name: 'Hand', icon: null, cursor: 'grab', category: 'select' }));
  useHotkeys('t', () => setActiveTool({ id: 'text', name: 'Text', icon: null, cursor: 'text', category: 'text' }));
  useHotkeys('r', () => setActiveTool({ id: 'rectangle', name: 'Rectangle', icon: null, cursor: 'crosshair', category: 'shape' }));
  useHotkeys('o', () => setActiveTool({ id: 'circle', name: 'Circle', icon: null, cursor: 'crosshair', category: 'shape' }));
  useHotkeys('l', () => setActiveTool({ id: 'line', name: 'Line', icon: null, cursor: 'crosshair', category: 'draw' }));
  useHotkeys('s', () => setActiveTool({ id: 'sticky', name: 'Sticky Note', icon: null, cursor: 'crosshair', category: 'text' }));
  useHotkeys('p', () => setActiveTool({ id: 'pen', name: 'Pen', icon: null, cursor: 'crosshair', category: 'draw' }));
  useHotkeys('a', () => setActiveTool({ id: 'arrow', name: 'Arrow', icon: null, cursor: 'crosshair', category: 'connector' }));
  useHotkeys('e', () => setActiveTool({ id: 'eraser', name: 'Eraser', icon: null, cursor: 'crosshair', category: 'draw' }));
  useHotkeys('ctrl+0, cmd+0', resetViewport);
  useHotkeys('ctrl+1, cmd+1', fitToScreen);

  // Space key handling for pan mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isEditingText) {
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
  }, [isEditingText]);

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

    // Convert screen coordinates to canvas coordinates
    const canvasPos = {
      x: (pos.x - stage.x()) / stage.scaleX(),
      y: (pos.y - stage.y()) / stage.scaleY()
    };

    // Close context menu
    setContextMenu(null);

    // If clicking on empty space, clear selection
    if (e.target === stage) {
      clearSelection();
      
      // Handle tool-specific actions only on empty space
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

    // Handle space key or hand tool for panning
    if (isSpacePressed || activeTool?.id === 'hand') {
      setIsDragging(true);
      setDragStart(pos);
      stage.container().style.cursor = 'grabbing';
      return;
    }

    // Handle pen tool
    if (activeTool?.id === 'pen') {
      setIsDrawing(true);
      setCurrentPath([canvasPos.x, canvasPos.y]);
      return;
    }

    // Handle eraser tool - IMPROVED: Works on any object click
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

    // Handle connector tool - SMART CONNECTOR
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
          // Create connector between objects
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

    // Handle shape creation tools
    if (activeTool && ['rectangle', 'circle', 'triangle', 'diamond', 'star', 'line', 'arrow'].includes(activeTool.id) && e.target === stage) {
      setIsCreatingShape(true);
      setShapeStartPos(canvasPos);
      return;
    }

    // Handle selection box - PARTIAL SELECTION
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

    // Handle panning
    if (isDragging && dragStart) {
      const dx = pos.x - dragStart.x;
      const dy = pos.y - dragStart.y;
      pan(dx, dy);
      setDragStart(pos);
      return;
    }

    // Handle pen drawing
    if (isDrawing && activeTool?.id === 'pen') {
      setCurrentPath(prev => [...prev, canvasPos.x, canvasPos.y]);
      return;
    }

    // Handle shape creation with PERFECT preview positioning
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

    // Handle selection box - PARTIAL SELECTION
    if (selectionBox) {
      setSelectionBox(prev => prev ? { ...prev, end: canvasPos } : null);
    }

    // Update cursor for hovering over objects
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

    // Handle pen drawing completion
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

    // Handle shape creation completion - NO auto-switching
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
      // NO auto-switching - keep current tool active
    }

    // Handle selection box - PARTIAL SELECTION
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

        // Partial selection - object just needs to intersect with selection box
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

  // Handle double click for text editing - WORKS ON ANY OBJECT
  const handleDoubleClick = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    const target = e.target;
    if (target.id()) {
      const objectId = target.id();
      const obj = canvasState.objects.find(o => o.id === objectId);
      if (obj && (obj.type === 'text' || obj.type === 'sticky' || obj.type === 'shape')) {
        setIsEditingText(objectId);
        createTextEditor(obj);
      }
    }
  }, [canvasState.objects]);

  // Create text editor - IMPROVED
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
    textarea.style.border = '2px solid #3B82F6';
    textarea.style.padding = obj.type === 'sticky' ? '10px' : '5px';
    textarea.style.margin = '0px';
    textarea.style.overflow = 'hidden';
    textarea.style.background = obj.type === 'sticky' ? (obj.style.fill || '#FFE066') : 'rgba(255,255,255,0.95)';
    textarea.style.outline = 'none';
    textarea.style.resize = 'none';
    textarea.style.lineHeight = '1.2';
    textarea.style.color = obj.style.textColor || obj.style.fill || '#000000';
    textarea.style.borderRadius = obj.type === 'sticky' ? '8px' : '4px';
    textarea.style.zIndex = '1000';
    textarea.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';

    textarea.focus();
    textarea.select();

    const handleBlur = () => {
      updateObject(obj.id, { content: textarea.value });
      document.body.removeChild(textarea);
      setIsEditingText(null);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        document.body.removeChild(textarea);
        setIsEditingText(null);
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
    
    // Auto-select and start editing
    setTimeout(() => {
      selectObjects([id]);
      const obj = canvasState.objects.find(o => o.id === id);
      if (obj) {
        setIsEditingText(id);
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

    // Auto-select and start editing
    setTimeout(() => {
      selectObjects([id]);
      const obj = canvasState.objects.find(o => o.id === id);
      if (obj) {
        setIsEditingText(id);
        createTextEditor(obj);
      }
    }, 100);
  }, [addObject, currentUser, selectObjects, canvasState.objects]);

  const addConnector = useCallback((start: { objectId: string; point: Point }, end: { objectId: string; point: Point }) => {
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
        points: [0, 0, end.point.x - start.point.x, end.point.y - start.point.y],
        arrowEnd: true
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
    // If clicking the same tool that's already active, deactivate it and switch to select
    if (activeTool?.id === tool.id && tool.id !== 'select') {
      setActiveTool({ id: 'select', name: 'Select', icon: null, cursor: 'default', category: 'select' });
      setIsCreatingShape(false);
      setTempShape(null);
      setShapeStartPos(null);
      setConnectorMode('none');
      setConnectorStart(null);
    } else {
      setActiveTool(tool);
      
      // Reset any ongoing operations
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

  // Render canvas objects - FIXED RESIZING ISSUE
  const renderObjects = () => {
    return canvasState.objects.map(obj => {
      const key = obj.id;
      const isSelected = canvasState.selectedIds.includes(obj.id);
      const isHovered = hoveredObject === obj.id;

      const handleObjectClick = (e: any) => {
        e.cancelBubble = true;
        
        // Always allow selection on any tool for smooth interaction
        if (e.evt.shiftKey) {
          // Add to selection
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

        // FIXED: Proper scaling without making objects tiny
        node.scaleX(1);
        node.scaleY(1);

        updateObject(obj.id, {
          size: {
            width: Math.max(10, node.width() * scaleX), // Minimum size
            height: Math.max(10, node.height() * scaleY)
          },
          transform: {
            ...obj.transform,
            rotation: node.rotation()
          }
        });
      };

      // Make objects draggable when select tool is active OR when object is selected
      const isDraggable = activeTool?.id === 'select' || isSelected;

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
                cornerRadius={8}
                shadowColor="rgba(0,0,0,0.2)"
                shadowBlur={isSelected ? 10 : isHovered ? 8 : 5}
                shadowOffset={{ x: 2, y: 2 }}
                shadowOpacity={0.3}
              />
              {!isEditingText && (
                <Text
                  text={obj.content || 'Double-click to edit'}
                  x={10}
                  y={10}
                  width={obj.size.width - 20}
                  height={obj.size.height - 20}
                  fontSize={obj.style.fontSize || 14}
                  fontFamily={obj.style.fontFamily || 'Arial'}
                  fill={obj.style.textColor || '#000000'}
                  align={obj.style.textAlign || 'left'}
                  verticalAlign="top"
                  wrap="word"
                />
              )}
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
                  shadowBlur={isSelected ? 8 : isHovered ? 6 : 0}
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
                  shadowBlur={isSelected ? 8 : isHovered ? 6 : 0}
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
                  shadowBlur={isSelected ? 8 : isHovered ? 6 : 0}
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
                  shadowBlur={isSelected ? 8 : isHovered ? 6 : 0}
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
                  shadowBlur={isSelected ? 8 : isHovered ? 6 : 0}
                  shadowOffset={{ x: 2, y: 2 }}
                  shadowOpacity={0.3}
                />
              )}
              
              {/* Text inside shapes */}
              {obj.content && !isEditingText && (
                <Text
                  text={obj.content}
                  x={10}
                  y={obj.size.height / 2 - 10}
                  width={obj.size.width - 20}
                  fontSize={obj.style.fontSize || 14}
                  fontFamily={obj.style.fontFamily || 'Arial'}
                  fill={obj.style.textColor || '#FFFFFF'}
                  align="center"
                  verticalAlign="middle"
                  wrap="word"
                />
              )}
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
          return (
            <Arrow
              key={key}
              id={obj.id}
              x={obj.position.x}
              y={obj.position.y}
              points={arrowPoints}
              stroke={obj.style.stroke || '#000000'}
              strokeWidth={obj.style.strokeWidth || 2}
              fill={obj.style.fill || obj.style.stroke || '#000000'}
              pointerLength={10}
              pointerWidth={8}
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

        default:
          return null;
      }
    });
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-50">
      {/* Canvas Toolbar */}
      <CanvasToolbar
        activeTool={activeTool}
        onToolChange={handleToolChange}
        zoom={canvasState.viewport.zoom}
        onZoomChange={setZoom}
        onResetView={resetViewport}
        onFitToScreen={fitToScreen}
        onToggleMiniMap={() => setShowMiniMap(!showMiniMap)}
        onToggleLayers={() => setShowLayers(!showLayers)}
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
            {/* Grid */}
            {canvasState.grid.enabled && (
              <CanvasGrid
                width={width * 2}
                height={height * 2}
                gridSize={canvasState.grid.size}
                zoom={canvasState.viewport.zoom}
              />
            )}

            {/* Canvas Objects */}
            {renderObjects()}

            {/* Temporary Shape During Creation */}
            {renderTempShape()}

            {/* Current Drawing Path */}
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

            {/* Selection Box */}
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

            {/* Connector Preview */}
            {connectorMode === 'creating' && connectorStart && (
              <Line
                points={[connectorStart.point.x, connectorStart.point.y, connectorStart.point.x + 50, connectorStart.point.y + 50]}
                stroke={currentColor}
                strokeWidth={currentStrokeWidth}
                dash={[5, 5]}
                opacity={0.7}
              />
            )}

            {/* Transformer for selected objects - FIXED */}
            <Transformer
              ref={transformerRef}
              boundBoxFunc={(oldBox, newBox) => {
                // Prevent objects from becoming too small
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

      {/* Collaborative Cursors */}
      <CollaborativeCursors
        collaborators={collaborators}
        viewport={canvasState.viewport}
      />

      {/* Context Menu */}
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

      {/* Mini Map */}
      <AnimatePresence>
        {showMiniMap && (
          <MiniMap
            objects={canvasState.objects}
            viewport={canvasState.viewport}
            canvasSize={{ width, height }}
            onViewportChange={(viewport) => {
              const stage = stageRef.current;
              if (stage) {
                stage.position({ x: viewport.x, y: viewport.y });
                stage.scale({ x: viewport.zoom, y: viewport.zoom });
                stage.batchDraw();
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* Layer Panel */}
      <AnimatePresence>
        {showLayers && (
          <LayerPanel
            layers={canvasState.layers}
            onClose={() => setShowLayers(false)}
          />
        )}
      </AnimatePresence>

      {/* Property Panel */}
      <AnimatePresence>
        {showProperties && canvasState.selectedIds.length > 0 && (
          <PropertyPanel
            selectedObjects={canvasState.objects.filter(obj => canvasState.selectedIds.includes(obj.id))}
            onUpdate={updateObject}
            onClose={() => setShowProperties(false)}
          />
        )}
      </AnimatePresence>

      {/* Comment System */}
      <AnimatePresence>
        {showComments && (
          <CommentSystem
            onClose={() => setShowComments(false)}
          />
        )}
      </AnimatePresence>

      {/* Instructions */}
      {canvasState.objects.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center space-y-4 bg-white/90 p-8 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-700">
              Professional Miro-like Canvas
            </h3>
            <div className="text-gray-600 space-y-2">
              <p>• <strong>Double-click any object</strong> to edit text (including shapes!)</p>
              <p>• <strong>Drag to create shapes</strong> with perfect preview</p>
              <p>• <strong>Pen tool</strong> for free drawing</p>
              <p>• <strong>Eraser</strong> removes objects on click</p>
              <p>• <strong>Smart connector</strong> links objects (click object A, then B)</p>
              <p>• <strong>Partial selection</strong> with selection box</p>
              <p>• <strong>Properties panel</strong> auto-opens when selecting</p>
              <p>• <strong>Click same tool again</strong> to deactivate</p>
              <p>• <strong>Hold Space</strong> or use Hand tool to pan</p>
              <p>• <strong>All shapes resize properly</strong> without becoming tiny</p>
            </div>
          </div>
        </div>
      )}

      {/* Status Messages */}
      {connectorMode === 'creating' && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          Click on another object to create a smart connection
        </div>
      )}

      {activeTool && activeTool.id !== 'select' && activeTool.id !== 'hand' && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {activeTool.name} tool active - Click same tool again to deactivate
        </div>
      )}
    </div>
  );
};