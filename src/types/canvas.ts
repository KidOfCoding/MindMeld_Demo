export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Transform {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
}

export interface CanvasObject {
  id: string;
  type: 'sticky' | 'text' | 'shape' | 'image' | 'line' | 'arrow' | 'connector' | 'frame' | 'mindmap' | 'flowchart';
  position: Point;
  size: Size;
  transform: Transform;
  style: {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    opacity?: number;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string;
    textAlign?: 'left' | 'center' | 'right';
    borderRadius?: number;
    shadow?: boolean;
  };
  content?: string;
  locked?: boolean;
  visible?: boolean;
  layer: number;
  groupId?: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

export interface StickyNote extends CanvasObject {
  type: 'sticky';
  color: string;
}

export interface TextBox extends CanvasObject {
  type: 'text';
  richText?: boolean;
  formatting?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
  };
}

export interface Shape extends CanvasObject {
  type: 'shape';
  shapeType: 'rectangle' | 'circle' | 'triangle' | 'diamond' | 'star' | 'polygon';
  points?: Point[];
}

export interface Line extends CanvasObject {
  type: 'line' | 'arrow' | 'connector';
  startPoint: Point;
  endPoint: Point;
  startConnector?: string;
  endConnector?: string;
  curved?: boolean;
  arrowStart?: boolean;
  arrowEnd?: boolean;
}

export interface Frame extends CanvasObject {
  type: 'frame';
  children: string[];
  title: string;
}

export interface CanvasState {
  objects: CanvasObject[];
  selectedIds: string[];
  clipboard: CanvasObject[];
  history: CanvasObject[][];
  historyIndex: number;
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
  grid: {
    enabled: boolean;
    size: number;
    snap: boolean;
  };
  layers: {
    id: string;
    name: string;
    visible: boolean;
    locked: boolean;
    objects: string[];
  }[];
}

export interface Tool {
  id: string;
  name: string;
  icon: any;
  cursor: string;
  category: 'select' | 'draw' | 'shape' | 'text' | 'media' | 'connector';
}

export interface Cursor {
  userId: string;
  position: Point;
  color: string;
  name: string;
}

export interface Comment {
  id: string;
  position: Point;
  content: string;
  author: string;
  createdAt: Date;
  resolved: boolean;
  replies: {
    id: string;
    content: string;
    author: string;
    createdAt: Date;
  }[];
}