import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Stage, Layer, Rect, Circle, Text, Line, Arrow, Group, Transformer } from 'react-konva';
import { motion, AnimatePresence } from 'framer-motion';
import { useCanvas } from '../../hooks/useCanvas';
import { CanvasObject, Point, Tool } from '../../types/canvas';
import { CanvasToolbar } from './CanvasToolbar';
import { CanvasContextMenu } from './CanvasContextMenu';
import { CanvasGrid } from './CanvasGrid';
import { StickyNoteComponent } from './objects/StickyNoteComponent';
import { TextBoxComponent } from './objects/TextBoxComponent';
import { ShapeComponent } from './objects/ShapeComponent';
import { LineComponent } from './objects/LineComponent';
import { FrameComponent } from './objects/FrameComponent';
import { SelectionBox } from './SelectionBox';
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
  const [showProperties, setShowProperties] = useState(true);
  const [showComments, setShowComments] = useState(false);

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
  useHotkeys('escape', clearSelection);
  useHotkeys('space', () => setIsSpacePressed(true), { keyup: true });
  useHotkeys('space', () => setIsSpacePressed(false), { keydown: false });
  useHotkeys('v', () => setActiveTool({ id: 'select', name: 'Select', icon: null, cursor: 'default', category: 'select' }));
  useHotkeys('h', () => setActiveTool({ id: 'hand', name: 'Hand', icon: null, cursor: 'grab', category: 'select' }));
  useHotkeys('t', () => setActiveTool({ id: 'text', name: 'Text', icon: null, cursor: 'text', category: 'text' }));
  useHotkeys('r', () => setActiveTool({ id: 'rectangle', name: 'Rectangle', icon: null, cursor: 'crosshair', category: 'shape' }));
  useHotkeys('o', () => setActiveTool({ id: 'circle', name: 'Circle', icon: null, cursor: 'crosshair', category: 'shape' }));
  useHotkeys('l', () => setActiveTool({ id: 'line', name: 'Line', icon: null, cursor: 'crosshair', category: 'draw' }));
  useHotkeys('s', () => setActiveTool({ id: 'sticky', name: 'Sticky Note', icon: null, cursor: 'crosshair', category: 'text' }));
  useHotkeys('ctrl+0, cmd+0', resetViewport);
  useHotkeys('ctrl+1, cmd+1', fitToScreen);

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
    
    setZoom(newScale);
    
    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
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

    // Close context menu
    setContextMenu(null);

    // If clicking on empty space, clear selection
    if (e.target === stage) {
      clearSelection();
      return;
    }

    // Handle tool-specific actions
    if (activeTool) {
      switch (activeTool.id) {
        case 'sticky':
          addStickyNote(pos);
          break;
        case 'text':
          addTextBox(pos);
          break;
        case 'rectangle':
          addRectangle(pos);
          break;
        case 'circle':
          addCircle(pos);
          break;
        case 'line':
          startDrawingLine(pos);
          break;
      }
    }
  }, [activeTool, addObject, clearSelection]);

  // Handle stage mouse down
  const handleStageMouseDown = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = stageRef.current;
    if (!stage) return;

    const pos = stage.getPointerPosition();
    if (!pos) return;

    if (isSpacePressed || activeTool?.id === 'hand') {
      setIsDragging(true);
      setDragStart(pos);
      stage.container().style.cursor = 'grabbing';
      return;
    }

    if (activeTool?.id === 'select' && e.target === stage) {
      setSelectionBox({ start: pos, end: pos });
    }
  }, [isSpacePressed, activeTool]);

  // Handle stage mouse move
  const handleStageMouseMove = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = stageRef.current;
    if (!stage) return;

    const pos = stage.getPointerPosition();
    if (!pos) return;

    if (isDragging && dragStart) {
      const dx = pos.x - dragStart.x;
      const dy = pos.y - dragStart.y;
      pan(dx, dy);
      setDragStart(pos);
      return;
    }

    if (selectionBox) {
      setSelectionBox(prev => prev ? { ...prev, end: pos } : null);
    }
  }, [isDragging, dragStart, selectionBox, pan]);

  // Handle stage mouse up
  const handleStageMouseUp = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;

    setIsDragging(false);
    setDragStart(null);
    stage.container().style.cursor = activeTool?.cursor || 'default';

    if (selectionBox) {
      // Select objects within selection box
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
          objBounds.x >= selectionBounds.x &&
          objBounds.y >= selectionBounds.y &&
          objBounds.x + objBounds.width <= selectionBounds.x + selectionBounds.width &&
          objBounds.y + objBounds.height <= selectionBounds.y + selectionBounds.height
        );
      });

      selectObjects(selectedObjects.map(obj => obj.id));
      setSelectionBox(null);
    }
  }, [activeTool, selectionBox, canvasState.objects, selectObjects]);

  // Handle context menu
  const handleContextMenu = useCallback((e: Konva.KonvaEventObject<PointerEvent>) => {
    e.evt.preventDefault();
    
    const stage = stageRef.current;
    if (!stage) return;

    const pos = stage.getPointerPosition();
    if (!pos) return;

    setContextMenu({ x: pos.x, y: pos.y });
  }, []);

  // Add object functions
  const addStickyNote = useCallback((position: Point) => {
    addObject({
      type: 'sticky',
      position,
      size: { width: 200, height: 200 },
      transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 },
      style: {
        fill: '#FFE066',
        stroke: '#E6CC00',
        strokeWidth: 1,
        fontSize: 14,
        fontFamily: 'Arial'
      },
      content: 'New sticky note',
      layer: 0,
      author: currentUser?.id || 'anonymous'
    });
  }, [addObject, currentUser]);

  const addTextBox = useCallback((position: Point) => {
    addObject({
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
  }, [addObject, currentUser]);

  const addRectangle = useCallback((position: Point) => {
    addObject({
      type: 'shape',
      position,
      size: { width: 150, height: 100 },
      transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 },
      style: {
        fill: '#3B82F6',
        stroke: '#1E40AF',
        strokeWidth: 2
      },
      layer: 0,
      author: currentUser?.id || 'anonymous',
      metadata: { shapeType: 'rectangle' }
    });
  }, [addObject, currentUser]);

  const addCircle = useCallback((position: Point) => {
    addObject({
      type: 'shape',
      position,
      size: { width: 120, height: 120 },
      transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 },
      style: {
        fill: '#10B981',
        stroke: '#047857',
        strokeWidth: 2
      },
      layer: 0,
      author: currentUser?.id || 'anonymous',
      metadata: { shapeType: 'circle' }
    });
  }, [addObject, currentUser]);

  const startDrawingLine = useCallback((position: Point) => {
    // For now, create a simple line
    addObject({
      type: 'line',
      position,
      size: { width: 100, height: 0 },
      transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 },
      style: {
        stroke: '#000000',
        strokeWidth: 2
      },
      layer: 0,
      author: currentUser?.id || 'anonymous',
      metadata: { 
        startPoint: position,
        endPoint: { x: position.x + 100, y: position.y }
      }
    });
  }, [addObject, currentUser]);

  // Update transformer when selection changes
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

  // Render canvas objects
  const renderObjects = () => {
    return canvasState.objects.map(obj => {
      const key = obj.id;
      const isSelected = canvasState.selectedIds.includes(obj.id);

      switch (obj.type) {
        case 'sticky':
          return (
            <StickyNoteComponent
              key={key}
              object={obj}
              isSelected={isSelected}
              onUpdate={updateObject}
              onSelect={() => selectObjects([obj.id])}
            />
          );
        case 'text':
          return (
            <TextBoxComponent
              key={key}
              object={obj}
              isSelected={isSelected}
              onUpdate={updateObject}
              onSelect={() => selectObjects([obj.id])}
            />
          );
        case 'shape':
          return (
            <ShapeComponent
              key={key}
              object={obj}
              isSelected={isSelected}
              onUpdate={updateObject}
              onSelect={() => selectObjects([obj.id])}
            />
          );
        case 'line':
        case 'arrow':
        case 'connector':
          return (
            <LineComponent
              key={key}
              object={obj}
              isSelected={isSelected}
              onUpdate={updateObject}
              onSelect={() => selectObjects([obj.id])}
            />
          );
        case 'frame':
          return (
            <FrameComponent
              key={key}
              object={obj}
              isSelected={isSelected}
              onUpdate={updateObject}
              onSelect={() => selectObjects([obj.id])}
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
        onToolChange={setActiveTool}
        zoom={canvasState.viewport.zoom}
        onZoomChange={setZoom}
        onResetView={resetViewport}
        onFitToScreen={fitToScreen}
        onToggleMiniMap={() => setShowMiniMap(!showMiniMap)}
        onToggleLayers={() => setShowLayers(!showLayers)}
        onToggleProperties={() => setShowProperties(!showProperties)}
        onToggleComments={() => setShowComments(!showComments)}
      />

      {/* Main Canvas */}
      <div 
        ref={canvasRef}
        className="w-full h-full"
        style={{ cursor: activeTool?.cursor || 'default' }}
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

            {/* Selection Box */}
            {selectionBox && (
              <SelectionBox
                start={selectionBox.start}
                end={selectionBox.end}
              />
            )}

            {/* Transformer for selected objects */}
            <Transformer
              ref={transformerRef}
              boundBoxFunc={(oldBox, newBox) => {
                // Limit resize
                if (newBox.width < 5 || newBox.height < 5) {
                  return oldBox;
                }
                return newBox;
              }}
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
    </div>
  );
};