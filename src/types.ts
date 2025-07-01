export interface User {
  id: string;
  name: string;
  avatar: string;
  color: string;
  isOnline: boolean;
}

export interface Idea {
  id: string;
  text: string;
  votes: number;
  timestamp: Date;
  position: { x: number; y: number };
  author: User;
  tags: string[];
  connections: string[];
}

export interface CanvasElement {
  id: string;
  type: 'sticky' | 'shape' | 'text' | 'image' | 'connector';
  position: { x: number; y: number };
  size: { width: number; height: number };
  content?: string;
  style: {
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    fontSize?: number;
  };
  author: User;
  timestamp: Date;
}

export interface AIInsight {
  themes: string[];
  contradictions: string[];
  breakthrough: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  confidence: number;
}

export interface Contradiction {
  ideaA: string;
  ideaB: string;
  explanation: string;
  suggestion: string;
}

export interface RoadmapStep {
  title: string;
  description: string;
  timeframe: string;
  priority?: 'high' | 'medium' | 'low';
  assignee?: User;
}

export interface WorkspaceSettings {
  theme: 'light' | 'dark';
  gridEnabled: boolean;
  snapToGrid: boolean;
  collaborationMode: 'open' | 'moderated' | 'private';
}