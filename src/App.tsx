import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { FabricCanvas } from './components/canvas/FabricCanvas';
import { AIInsightPanel } from './components/ai/AIInsightPanel';
import { CollaboratorPanel } from './components/collaboration/CollaboratorPanel';
import { StatusBar } from './components/layout/StatusBar';
import { WelcomeModal } from './components/modals/WelcomeModal';
import { Idea, User, CanvasElement } from './types';

interface Session {
  id: string;
  name: string;
  ideas: Idea[];
  canvasElements: CanvasElement[];
  createdAt: Date;
  lastModified: Date;
  participants: number;
  status: 'active' | 'completed' | 'archived';
}

function App() {
  const [currentSessionId, setCurrentSessionId] = useState<string>('session-1');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [isCollaboratorPanelOpen, setIsCollaboratorPanelOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);
  
  const [currentUser] = useState<User>({
    id: '1',
    name: 'You',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    color: '#3B82F6',
    isOnline: true
  });

  const [collaborators, setCollaborators] = useState<User[]>([
    {
      id: '2',
      name: 'Sarah Chen',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      color: '#10B981',
      isOnline: true
    },
    {
      id: '3',
      name: 'Marcus Rodriguez',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      color: '#F59E0B',
      isOnline: true
    },
    {
      id: '4',
      name: 'Emily Watson',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      color: '#EF4444',
      isOnline: false
    }
  ]);

  // Initialize sessions and demo data
  useEffect(() => {
    const initialSessions: Session[] = [
      {
        id: 'session-1',
        name: 'Product Strategy Session',
        ideas: [
          {
            id: 'demo-1',
            text: 'Implement AI-powered user onboarding that adapts to user behavior patterns',
            votes: 8,
            timestamp: new Date(Date.now() - 300000),
            position: { x: 200, y: 150 },
            author: collaborators[0],
            tags: ['AI', 'UX'],
            connections: []
          },
          {
            id: 'demo-2',
            text: 'Create a mobile-first design system with dark mode support',
            votes: 6,
            timestamp: new Date(Date.now() - 240000),
            position: { x: 500, y: 200 },
            author: collaborators[1],
            tags: ['Design', 'Mobile'],
            connections: []
          }
        ],
        canvasElements: [],
        createdAt: new Date(Date.now() - 86400000),
        lastModified: new Date(),
        participants: 8,
        status: 'active'
      }
    ];

    setSessions(initialSessions);
    
    // Load current session
    const currentSession = initialSessions.find(s => s.id === currentSessionId);
    if (currentSession) {
      setIdeas(currentSession.ideas);
      setCanvasElements(currentSession.canvasElements);
    }
  }, [currentSessionId]);

  // Calculate canvas dimensions
  useEffect(() => {
    const updateCanvasSize = () => {
      const currentSidebarWidth = isSidebarExpanded ? sidebarWidth : 0;
      const aiPanelWidth = isAIPanelOpen ? 384 : 0;
      const collaboratorPanelWidth = isCollaboratorPanelOpen ? 320 : 0;
      
      const width = window.innerWidth - currentSidebarWidth - aiPanelWidth - collaboratorPanelWidth;
      const height = window.innerHeight - 64 - 32; // navbar + status bar
      
      setCanvasWidth(Math.max(width, 400));
      setCanvasHeight(Math.max(height, 300));
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [isSidebarExpanded, sidebarWidth, isAIPanelOpen, isCollaboratorPanelOpen]);

  const handleExportCanvas = (format: 'png' | 'pdf') => {
    // Export functionality will be implemented in the canvas component
    console.log('Exporting canvas as', format);
  };

  const handleSessionSwitch = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSessionId(sessionId);
      setIdeas(session.ideas);
      setCanvasElements(session.canvasElements);
    }
  };

  const handleNewSession = (name: string, templateId?: string) => {
    const newSession: Session = {
      id: `session-${Date.now()}`,
      name: name,
      ideas: [],
      canvasElements: [],
      createdAt: new Date(),
      lastModified: new Date(),
      participants: 1,
      status: 'active'
    };

    setSessions(prev => [...prev, newSession]);
    setCurrentSessionId(newSession.id);
    setIdeas(newSession.ideas);
    setCanvasElements(newSession.canvasElements);
  };

  const getCurrentSession = () => {
    return sessions.find(s => s.id === currentSessionId);
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <Navbar 
        onToggleAI={() => setIsAIPanelOpen(!isAIPanelOpen)}
        onToggleCollaborators={() => setIsCollaboratorPanelOpen(!isCollaboratorPanelOpen)}
        isAIPanelOpen={isAIPanelOpen}
        isCollaboratorPanelOpen={isCollaboratorPanelOpen}
        currentUser={currentUser}
        onExportCanvas={handleExportCanvas}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSessionSwitch={handleSessionSwitch}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar 
          isExpanded={isSidebarExpanded}
          onToggle={() => setIsSidebarExpanded(!isSidebarExpanded)}
          width={sidebarWidth}
          sessions={sessions}
          currentSessionId={currentSessionId}
          onSessionSwitch={handleSessionSwitch}
          onNewSession={handleNewSession}
        />
        
        {/* Main Canvas Area */}
        <div className="flex-1 relative">
          <FabricCanvas
            width={canvasWidth}
            height={canvasHeight}
            collaborators={collaborators}
            currentUser={currentUser}
          />
        </div>
        
        <AnimatePresence>
          {isAIPanelOpen && (
            <AIInsightPanel 
              ideas={ideas}
              onClose={() => setIsAIPanelOpen(false)}
            />
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {isCollaboratorPanelOpen && (
            <CollaboratorPanel 
              collaborators={collaborators}
              currentUser={currentUser}
              onClose={() => setIsCollaboratorPanelOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
      
      <StatusBar 
        ideas={ideas}
        collaborators={collaborators}
        selectedTool="select"
        currentSession={getCurrentSession()}
      />
      
      <AnimatePresence>
        {showWelcome && (
          <WelcomeModal onClose={() => setShowWelcome(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;