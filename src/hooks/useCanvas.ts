import { useState, useCallback, useRef, useEffect } from 'react';
import { CanvasState, CanvasObject, Point, Tool } from '../types/canvas';
import { v4 as uuidv4 } from 'uuid';

export const useCanvas = () => {
  const [canvasState, setCanvasState] = useState<CanvasState>({
    objects: [],
    selectedIds: [],
    clipboard: [],
    history: [[]],
    historyIndex: 0,
    viewport: { x: 0, y: 0, zoom: 1 },
    grid: { enabled: true, size: 20, snap: false },
    layers: [
      { id: 'default', name: 'Layer 1', visible: true, locked: false, objects: [] }
    ]
  });

  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [dragStart, setDragStart] = useState<Point | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Add object to canvas
  const addObject = useCallback((object: Omit<CanvasObject, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newObject: CanvasObject = {
      ...object,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setCanvasState(prev => {
      const newState = {
        ...prev,
        objects: [...prev.objects, newObject],
        history: [...prev.history.slice(0, prev.historyIndex + 1), [...prev.objects, newObject]],
        historyIndex: prev.historyIndex + 1
      };
      return newState;
    });

    return newObject.id;
  }, []);

  // Update object
  const updateObject = useCallback((id: string, updates: Partial<CanvasObject>) => {
    setCanvasState(prev => ({
      ...prev,
      objects: prev.objects.map(obj => 
        obj.id === id 
          ? { ...obj, ...updates, updatedAt: new Date() }
          : obj
      )
    }));
  }, []);

  // Delete objects
  const deleteObjects = useCallback((ids: string[]) => {
    setCanvasState(prev => {
      const newObjects = prev.objects.filter(obj => !ids.includes(obj.id));
      return {
        ...prev,
        objects: newObjects,
        selectedIds: prev.selectedIds.filter(id => !ids.includes(id)),
        history: [...prev.history.slice(0, prev.historyIndex + 1), newObjects],
        historyIndex: prev.historyIndex + 1
      };
    });
  }, []);

  // Select objects
  const selectObjects = useCallback((ids: string[], addToSelection = false) => {
    setCanvasState(prev => ({
      ...prev,
      selectedIds: addToSelection 
        ? [...new Set([...prev.selectedIds, ...ids])]
        : ids
    }));
  }, []);

  // Clear selection
  const clearSelection = useCallback(() => {
    setCanvasState(prev => ({ ...prev, selectedIds: [] }));
  }, []);

  // Copy objects
  const copyObjects = useCallback((ids?: string[]) => {
    const objectsToCopy = ids || canvasState.selectedIds;
    const objects = canvasState.objects.filter(obj => objectsToCopy.includes(obj.id));
    setCanvasState(prev => ({ ...prev, clipboard: objects }));
  }, [canvasState.objects, canvasState.selectedIds]);

  // Paste objects
  const pasteObjects = useCallback((position?: Point) => {
    if (canvasState.clipboard.length === 0) return;

    const offset = position || { x: 20, y: 20 };
    const newObjects = canvasState.clipboard.map(obj => ({
      ...obj,
      id: uuidv4(),
      position: {
        x: obj.position.x + offset.x,
        y: obj.position.y + offset.y
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    setCanvasState(prev => ({
      ...prev,
      objects: [...prev.objects, ...newObjects],
      selectedIds: newObjects.map(obj => obj.id),
      history: [...prev.history.slice(0, prev.historyIndex + 1), [...prev.objects, ...newObjects]],
      historyIndex: prev.historyIndex + 1
    }));
  }, [canvasState.clipboard]);

  // Duplicate objects
  const duplicateObjects = useCallback((ids?: string[]) => {
    const objectsToDuplicate = ids || canvasState.selectedIds;
    copyObjects(objectsToDuplicate);
    pasteObjects();
  }, [copyObjects, pasteObjects, canvasState.selectedIds]);

  // Group objects
  const groupObjects = useCallback((ids: string[]) => {
    const groupId = uuidv4();
    setCanvasState(prev => ({
      ...prev,
      objects: prev.objects.map(obj => 
        ids.includes(obj.id) 
          ? { ...obj, groupId, updatedAt: new Date() }
          : obj
      )
    }));
  }, []);

  // Ungroup objects
  const ungroupObjects = useCallback((groupId: string) => {
    setCanvasState(prev => ({
      ...prev,
      objects: prev.objects.map(obj => 
        obj.groupId === groupId 
          ? { ...obj, groupId: undefined, updatedAt: new Date() }
          : obj
      )
    }));
  }, []);

  // Undo
  const undo = useCallback(() => {
    setCanvasState(prev => {
      if (prev.historyIndex > 0) {
        return {
          ...prev,
          objects: prev.history[prev.historyIndex - 1],
          historyIndex: prev.historyIndex - 1,
          selectedIds: []
        };
      }
      return prev;
    });
  }, []);

  // Redo
  const redo = useCallback(() => {
    setCanvasState(prev => {
      if (prev.historyIndex < prev.history.length - 1) {
        return {
          ...prev,
          objects: prev.history[prev.historyIndex + 1],
          historyIndex: prev.historyIndex + 1,
          selectedIds: []
        };
      }
      return prev;
    });
  }, []);

  // Zoom
  const setZoom = useCallback((zoom: number, center?: Point) => {
    setCanvasState(prev => ({
      ...prev,
      viewport: {
        ...prev.viewport,
        zoom: Math.max(0.1, Math.min(5, zoom))
      }
    }));
  }, []);

  // Pan
  const pan = useCallback((deltaX: number, deltaY: number) => {
    setCanvasState(prev => ({
      ...prev,
      viewport: {
        ...prev.viewport,
        x: prev.viewport.x + deltaX,
        y: prev.viewport.y + deltaY
      }
    }));
  }, []);

  // Reset viewport
  const resetViewport = useCallback(() => {
    setCanvasState(prev => ({
      ...prev,
      viewport: { x: 0, y: 0, zoom: 1 }
    }));
  }, []);

  // Fit to screen
  const fitToScreen = useCallback(() => {
    if (canvasState.objects.length === 0) return;

    const bounds = canvasState.objects.reduce((acc, obj) => {
      const left = obj.position.x;
      const top = obj.position.y;
      const right = obj.position.x + obj.size.width;
      const bottom = obj.position.y + obj.size.height;

      return {
        left: Math.min(acc.left, left),
        top: Math.min(acc.top, top),
        right: Math.max(acc.right, right),
        bottom: Math.max(acc.bottom, bottom)
      };
    }, { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity });

    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;

    const padding = 50;
    const contentWidth = bounds.right - bounds.left;
    const contentHeight = bounds.bottom - bounds.top;
    const availableWidth = canvasRect.width - padding * 2;
    const availableHeight = canvasRect.height - padding * 2;

    const scaleX = availableWidth / contentWidth;
    const scaleY = availableHeight / contentHeight;
    const scale = Math.min(scaleX, scaleY, 1);

    const centerX = (bounds.left + bounds.right) / 2;
    const centerY = (bounds.top + bounds.bottom) / 2;
    const canvasCenterX = canvasRect.width / 2;
    const canvasCenterY = canvasRect.height / 2;

    setCanvasState(prev => ({
      ...prev,
      viewport: {
        x: canvasCenterX - centerX * scale,
        y: canvasCenterY - centerY * scale,
        zoom: scale
      }
    }));
  }, [canvasState.objects]);

  // Layer management
  const addLayer = useCallback((name: string) => {
    const newLayer = {
      id: uuidv4(),
      name,
      visible: true,
      locked: false,
      objects: []
    };

    setCanvasState(prev => ({
      ...prev,
      layers: [...prev.layers, newLayer]
    }));
  }, []);

  const deleteLayer = useCallback((layerId: string) => {
    setCanvasState(prev => ({
      ...prev,
      layers: prev.layers.filter(layer => layer.id !== layerId)
    }));
  }, []);

  const toggleLayerVisibility = useCallback((layerId: string) => {
    setCanvasState(prev => ({
      ...prev,
      layers: prev.layers.map(layer => 
        layer.id === layerId 
          ? { ...layer, visible: !layer.visible }
          : layer
      )
    }));
  }, []);

  const toggleLayerLock = useCallback((layerId: string) => {
    setCanvasState(prev => ({
      ...prev,
      layers: prev.layers.map(layer => 
        layer.id === layerId 
          ? { ...layer, locked: !layer.locked }
          : layer
      )
    }));
  }, []);

  return {
    canvasState,
    activeTool,
    setActiveTool,
    isDrawing,
    setIsDrawing,
    dragStart,
    setDragStart,
    canvasRef,
    
    // Object operations
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
    
    // History
    undo,
    redo,
    
    // Viewport
    setZoom,
    pan,
    resetViewport,
    fitToScreen,
    
    // Layers
    addLayer,
    deleteLayer,
    toggleLayerVisibility,
    toggleLayerLock
  };
};