import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Canvas } from './components/canvas/Canvas';
import { AIInsightPanel } from './components/ai/AIInsightPanel';
import { CollaboratorPanel } from './components/collaboration/CollaboratorPanel';
import { ToolPanel } from './components/tools/ToolPanel';
import { StatusBar } from './components/layout/StatusBar';
import { WelcomeModal } from './components/modals/WelcomeModal';
import { Idea, User, CanvasElement } from './types';
import { ChevronRight, ArrowLeftRight } from 'lucide-react';

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
  const [selectedTool, setSelectedTool] = useState<string>('select');
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [isCollaboratorPanelOpen, setIsCollaboratorPanelOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [isResizingCanvas, setIsResizingCanvas] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  
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
          },
          {
            id: 'demo-3',
            text: 'Build real-time collaboration features with conflict resolution',
            votes: 12,
            timestamp: new Date(Date.now() - 180000),
            position: { x: 300, y: 350 },
            author: currentUser,
            tags: ['Collaboration', 'Real-time'],
            connections: []
          },
          {
            id: 'demo-4',
            text: 'Integrate advanced analytics dashboard for user insights',
            votes: 4,
            timestamp: new Date(Date.now() - 120000),
            position: { x: 650, y: 300 },
            author: collaborators[0],
            tags: ['Analytics', 'Data'],
            connections: []
          }
        ],
        canvasElements: [],
        createdAt: new Date(Date.now() - 86400000),
        lastModified: new Date(),
        participants: 8,
        status: 'active'
      },
      {
        id: 'session-2',
        name: 'Q4 Planning Workshop',
        ideas: [
          {
            id: 'q4-1',
            text: 'Launch new feature set for enterprise customers',
            votes: 15,
            timestamp: new Date(Date.now() - 3600000),
            position: { x: 150, y: 100 },
            author: collaborators[1],
            tags: ['Enterprise', 'Features'],
            connections: []
          },
          {
            id: 'q4-2',
            text: 'Improve mobile app performance by 40%',
            votes: 11,
            timestamp: new Date(Date.now() - 7200000),
            position: { x: 400, y: 250 },
            author: currentUser,
            tags: ['Performance', 'Mobile'],
            connections: []
          }
        ],
        canvasElements: [],
        createdAt: new Date(Date.now() - 172800000),
        lastModified: new Date(Date.now() - 3600000),
        participants: 12,
        status: 'completed'
      },
      {
        id: 'session-3',
        name: 'Feature Brainstorm',
        ideas: [
          {
            id: 'feature-1',
            text: 'Add voice commands for accessibility',
            votes: 7,
            timestamp: new Date(Date.now() - 259200000),
            position: { x: 250, y: 180 },
            author: collaborators[0],
            tags: ['Accessibility', 'Voice'],
            connections: []
          }
        ],
        canvasElements: [],
        createdAt: new Date(Date.now() - 259200000),
        lastModified: new Date(Date.now() - 259200000),
        participants: 5,
        status: 'completed'
      }
    ];

    setSessions(initialSessions);
    
    // Load current session
    const currentSession = initialSessions.find(s => s.id === currentSessionId);
    if (currentSession) {
      setIdeas(currentSession.ideas);
      setCanvasElements(currentSession.canvasElements);
    }

    // Simulate live collaboration for active sessions only
    const collaborationInterval = setInterval(() => {
      const currentSession = sessions.find(s => s.id === currentSessionId);
      if (currentSession?.status === 'active') {
        const actions = [
          () => addRandomIdea(),
          () => addRandomVote(),
          () => simulateUserActivity()
        ];
        
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        randomAction();
      }
    }, 8000);

    return () => clearInterval(collaborationInterval);
  }, [currentSessionId]);

  // Keyboard shortcuts for UI controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in an input field
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      switch (e.key) {
        case '<':
        case ',':
          e.preventDefault();
          setIsSidebarExpanded(false);
          break;
        case '>':
        case '.':
          e.preventDefault();
          setIsSidebarExpanded(true);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Calculate canvas width based on panels
  useEffect(() => {
    const currentSidebarWidth = isSidebarExpanded ? sidebarWidth : 0;
    const toolPanelWidth = 64;
    const aiPanelWidth = isAIPanelOpen ? 384 : 0;
    const collaboratorPanelWidth = isCollaboratorPanelOpen ? 320 : 0;
    
    const totalWidth = window.innerWidth - currentSidebarWidth - toolPanelWidth - aiPanelWidth - collaboratorPanelWidth;
    setCanvasWidth(Math.max(totalWidth, 400)); // Minimum 400px width
  }, [isSidebarExpanded, sidebarWidth, isAIPanelOpen, isCollaboratorPanelOpen]);

  // Save current session when ideas or elements change
  useEffect(() => {
    setSessions(prev => prev.map(session => 
      session.id === currentSessionId 
        ? { 
            ...session, 
            ideas, 
            canvasElements, 
            lastModified: new Date() 
          }
        : session
    ));
  }, [ideas, canvasElements, currentSessionId]);

  const addRandomIdea = () => {
    const sampleIdeas = [
      'Implement voice-to-text functionality for accessibility',
      'Add gamification elements to increase user engagement',
      'Create API integrations with popular productivity tools',
      'Build advanced search with natural language processing',
      'Develop offline-first architecture for reliability',
      'Add custom branding options for enterprise clients',
      'Implement smart notifications with ML-based prioritization',
      'Create collaborative whiteboard with infinite canvas',
      'Add version control for design iterations',
      'Build automated testing suite with visual regression'
    ];

    const randomIdea = sampleIdeas[Math.floor(Math.random() * sampleIdeas.length)];
    const randomCollaborator = collaborators[Math.floor(Math.random() * collaborators.length)];
    
    if (randomCollaborator.isOnline) {
      const newIdea: Idea = {
        id: `auto-${Date.now()}`,
        text: randomIdea,
        votes: Math.floor(Math.random() * 3),
        timestamp: new Date(),
        position: { 
          x: Math.random() * 600 + 100, 
          y: Math.random() * 400 + 100 
        },
        author: randomCollaborator,
        tags: [],
        connections: []
      };
      
      setIdeas(prev => [...prev, newIdea]);
    }
  };

  const addRandomVote = () => {
    setIdeas(prev => {
      if (prev.length === 0) return prev;
      const randomIndex = Math.floor(Math.random() * prev.length);
      return prev.map((idea, index) => 
        index === randomIndex 
          ? { ...idea, votes: idea.votes + 1 }
          : idea
      );
    });
  };

  const simulateUserActivity = () => {
    // Simulate users going online/offline
    setCollaborators(prev => 
      prev.map(user => ({
        ...user,
        isOnline: Math.random() > 0.3 // 70% chance to be online
      }))
    );
  };

  const addIdea = (text: string, position: { x: number; y: number }) => {
    const newIdea: Idea = {
      id: Date.now().toString(),
      text: text.trim(),
      votes: 0,
      timestamp: new Date(),
      position,
      author: currentUser,
      tags: [],
      connections: []
    };
    setIdeas(prev => [...prev, newIdea]);
  };

  const voteForIdea = (id: string) => {
    setIdeas(prev => 
      prev.map(idea => 
        idea.id === id ? { ...idea, votes: idea.votes + 1 } : idea
      )
    );
  };

  const removeIdea = (id: string) => {
    setIdeas(prev => prev.filter(idea => idea.id !== id));
  };

  const updateIdeaPosition = (id: string, position: { x: number; y: number }) => {
    setIdeas(prev => 
      prev.map(idea => 
        idea.id === id ? { ...idea, position } : idea
      )
    );
  };

  const addCanvasElement = (element: Omit<CanvasElement, 'id' | 'timestamp' | 'author'>) => {
    const newElement: CanvasElement = {
      ...element,
      id: Date.now().toString(),
      timestamp: new Date(),
      author: currentUser
    };
    setCanvasElements(prev => [...prev, newElement]);
  };

  const updateCanvasElement = (id: string, updates: Partial<CanvasElement>) => {
    setCanvasElements(prev => 
      prev.map(element => 
        element.id === id ? { ...element, ...updates } : element
      )
    );
  };

  const removeCanvasElement = (id: string) => {
    setCanvasElements(prev => prev.filter(element => element.id !== id));
  };

  const handleExportCanvas = (format: 'png' | 'pdf') => {
    // Create a temporary canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = 1920;
    canvas.height = 1080;
    
    // Fill with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add header
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 32px Arial';
    ctx.fillText('MindMeld Canvas Export', 50, 60);
    
    ctx.font = '18px Arial';
    ctx.fillStyle = '#6b7280';
    ctx.fillText(`Exported on ${new Date().toLocaleString()}`, 50, 90);
    ctx.fillText(`${ideas.length} ideas • ${canvasElements.length} elements`, 50, 115);
    
    // Add ideas as cards
    ideas.forEach((idea, index) => {
      const cardX = idea.position.x + 50;
      const cardY = idea.position.y + 150;
      const cardWidth = 250;
      const cardHeight = 120;
      
      // Card background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(cardX, cardY, cardWidth, cardHeight);
      
      // Card border
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 2;
      ctx.strokeRect(cardX, cardY, cardWidth, cardHeight);
      
      // Idea text
      ctx.fillStyle = '#1f2937';
      ctx.font = '14px Arial';
      
      // Word wrap
      const words = idea.text.split(' ');
      let line = '';
      let y = cardY + 25;
      const maxWidth = cardWidth - 20;
      
      words.forEach(word => {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && line !== '') {
          ctx.fillText(line, cardX + 10, y);
          line = word + ' ';
          y += 18;
        } else {
          line = testLine;
        }
      });
      ctx.fillText(line, cardX + 10, y);
      
      // Vote count
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(`${idea.votes} votes`, cardX + 10, cardY + cardHeight - 15);
      
      // Author
      ctx.fillStyle = '#6b7280';
      ctx.font = '12px Arial';
      ctx.fillText(`by ${idea.author.name}`, cardX + 100, cardY + cardHeight - 15);
    });
    
    // Add canvas elements
    canvasElements.forEach((element) => {
      const elemX = element.position.x + 50;
      const elemY = element.position.y + 150;
      
      if (element.type === 'shape') {
        ctx.fillStyle = element.style.backgroundColor || '#3b82f6';
        ctx.fillRect(elemX, elemY, element.size.width, element.size.height);
        
        if (element.content) {
          ctx.fillStyle = element.style.textColor || '#ffffff';
          ctx.font = '14px Arial';
          ctx.fillText(element.content, elemX + 10, elemY + 25);
        }
      } else if (element.type === 'text') {
        ctx.fillStyle = element.style.textColor || '#1f2937';
        ctx.font = `${element.style.fontSize || 16}px Arial`;
        ctx.fillText(element.content || '', elemX, elemY + 20);
      }
    });
    
    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (!blob) return;
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mindmeld-canvas-${Date.now()}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
      
      // Show success message
      alert(`Canvas exported as ${format.toUpperCase()} successfully!`);
    }, format === 'png' ? 'image/png' : 'image/png'); // PDF export would need additional library
  };

  const handleCanvasResize = (e: React.MouseEvent) => {
    setIsResizingCanvas(true);
    const startX = e.clientX;
    const startWidth = canvasWidth;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const newWidth = Math.max(400, startWidth + deltaX);
      setCanvasWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizingCanvas(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleSidebarResize = (e: React.MouseEvent) => {
    setIsResizingSidebar(true);
    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const newWidth = Math.max(250, Math.min(500, startWidth + deltaX));
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizingSidebar(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
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

    // Add template-specific content if template is selected
    if (templateId === 'strategy') {
      newSession.ideas = [
        {
          id: 'template-1',
          text: 'Define our core value proposition',
          votes: 0,
          timestamp: new Date(),
          position: { x: 200, y: 150 },
          author: currentUser,
          tags: ['Strategy'],
          connections: []
        },
        {
          id: 'template-2',
          text: 'Analyze competitive landscape',
          votes: 0,
          timestamp: new Date(),
          position: { x: 500, y: 150 },
          author: currentUser,
          tags: ['Analysis'],
          connections: []
        }
      ];
    } else if (templateId === 'brainstorm') {
      newSession.ideas = [
        {
          id: 'template-1',
          text: 'What problems are we solving?',
          votes: 0,
          timestamp: new Date(),
          position: { x: 300, y: 200 },
          author: currentUser,
          tags: ['Problem'],
          connections: []
        }
      ];
    }

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
        {/* Sidebar with resize handle */}
        <div className="flex">
          <Sidebar 
            isExpanded={isSidebarExpanded}
            onToggle={() => setIsSidebarExpanded(!isSidebarExpanded)}
            width={sidebarWidth}
            sessions={sessions}
            currentSessionId={currentSessionId}
            onSessionSwitch={handleSessionSwitch}
            onNewSession={handleNewSession}
          />
          
          {/* Sidebar Resize Handle */}
          {isSidebarExpanded && (
            <div
              className={`w-1 bg-gray-300 hover:bg-blue-500 cursor-col-resize transition-colors relative group ${
                isResizingSidebar ? 'bg-blue-500' : ''
              }`}
              onMouseDown={handleSidebarResize}
              title="Drag to resize sidebar"
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowLeftRight className="w-4 h-4 text-white rotate-90" />
              </div>
            </div>
          )}
        </div>
        
        <ToolPanel 
          selectedTool={selectedTool}
          onToolSelect={setSelectedTool}
        />
        
        {/* Canvas Container with Resize Handle */}
        <div className="relative flex-1 flex">
          <div 
            className="relative bg-white border-r border-gray-200"
            style={{ width: canvasWidth }}
          >
            <Canvas 
              ideas={ideas}
              canvasElements={canvasElements}
              selectedTool={selectedTool}
              onAddIdea={addIdea}
              onVoteIdea={voteForIdea}
              onRemoveIdea={removeIdea}
              onUpdateIdeaPosition={updateIdeaPosition}
              onAddCanvasElement={addCanvasElement}
              onUpdateCanvasElement={updateCanvasElement}
              onRemoveCanvasElement={removeCanvasElement}
              currentUser={currentUser}
              collaborators={collaborators}
              onExportCanvas={handleExportCanvas}
              isSidebarExpanded={isSidebarExpanded}
              onToggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)}
            />
          </div>
          
          {/* Canvas Resize Handle */}
          <div
            className={`w-1 bg-gray-300 hover:bg-blue-500 cursor-col-resize transition-colors relative group ${
              isResizingCanvas ? 'bg-blue-500' : ''
            }`}
            onMouseDown={handleCanvasResize}
            title="Drag to resize canvas (<-> cursor)"
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowLeftRight className="w-4 h-4 text-white" />
            </div>
          </div>
          
          {/* Right Panel Space */}
          <div className="flex-1 bg-gray-50"></div>
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
        selectedTool={selectedTool}
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