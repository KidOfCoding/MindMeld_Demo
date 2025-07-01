import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw, 
  Volume2,
  VolumeX,
  MousePointer,
  MessageSquare,
  Users,
  Brain,
  Zap,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Target,
  TrendingUp,
  Heart,
  ThumbsUp,
  Star,
  Rocket,
  Trophy,
  X,
  Send,
  Plus,
  Settings,
  Search,
  Clock,
  Award,
  Crown,
  Lightbulb,
  GitBranch,
  BarChart3,
  FileText,
  Archive,
  Folder,
  Home,
  Eye,
  EyeOff,
  Mic,
  Video,
  Share2,
  TrendingDown,
  AlertTriangle,
  Layers
} from 'lucide-react';

interface DemoStep {
  id: string;
  title: string;
  description: string;
  duration: number;
  actions: DemoAction[];
  narration: string;
}

interface DemoAction {
  type: 'cursor' | 'click' | 'type' | 'highlight' | 'panel' | 'wait' | 'idea' | 'vote' | 'comment' | 'session' | 'close-panel' | 'emoji' | 'ai-prompt' | 'mermaid-chart' | 'sidebar-click' | 'search' | 'new-session' | 'canvas-action' | 'ai-insights' | 'ai-team-comment' | 'close-popup' | 'clear-canvas' | 'create-initial-diagram';
  target?: string;
  position?: { x: number; y: number };
  text?: string;
  delay?: number;
  user?: string;
  color?: string;
  emoji?: string;
  content?: string;
  duration?: number;
}

interface FloatingCursor {
  id: string;
  name: string;
  color: string;
  position: { x: number; y: number };
  isActive: boolean;
}

interface AutomatedDemoProps {
  onDemoComplete?: () => void;
}

export const AutomatedDemo: React.FC<AutomatedDemoProps> = ({ onDemoComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [cursors, setCursors] = useState<FloatingCursor[]>([]);
  const [showNarration, setShowNarration] = useState(true);
  const [currentNarration, setCurrentNarration] = useState('');
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [autoIdeas, setAutoIdeas] = useState<any[]>([]);
  const [demoComments, setDemoComments] = useState<any[]>([]);
  const [emojiReactions, setEmojiReactions] = useState<any[]>([]);
  const [showAIPrompt, setShowAIPrompt] = useState(false);
  const [aiPromptText, setAiPromptText] = useState('');
  const [showMermaidChart, setShowMermaidChart] = useState(false);
  const [mermaidContent, setMermaidContent] = useState('');
  const [sidebarContent, setSidebarContent] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [newSessionModal, setNewSessionModal] = useState(false);
  const [canvasShapes, setCanvasShapes] = useState<any[]>([]);
  const [openPanels, setOpenPanels] = useState<string[]>([]);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [aiInsightsData, setAiInsightsData] = useState<any>(null);
  
  const demoRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Get canvas center position accounting for sidebar
  const getCanvasCenter = () => {
    const sidebarWidth = 320; // Sidebar width
    const navbarHeight = 64; // Navbar height
    const statusBarHeight = 32; // Status bar height
    
    const availableWidth = window.innerWidth - sidebarWidth;
    const availableHeight = window.innerHeight - navbarHeight - statusBarHeight;
    
    return {
      x: sidebarWidth + (availableWidth / 2),
      y: navbarHeight + (availableHeight / 2)
    };
  };

  const demoSteps: DemoStep[] = [
    {
      id: 'startup-intro',
      title: '🚀 MindMeld Enterprise - AI Collaboration Platform',
      description: 'Professional startup introduction with initial Product Strategy diagram',
      duration: 8000,
      narration: 'Welcome to MindMeld Enterprise - the revolutionary AI-powered collaboration platform. Notice how we start with a professional Product Strategy diagram.',
      actions: [
        { type: 'create-initial-diagram', target: 'product-strategy', delay: 500 },
        { type: 'highlight', target: 'navbar', delay: 2000, duration: 1500 },
        { type: 'ai-prompt', text: 'Analyze current product strategy framework', delay: 3500 },
        { type: 'close-popup', target: 'ai-prompt', delay: 5000 },
        { type: 'cursor', position: { x: 400, y: 300 }, user: 'Sarah Chen', color: '#10B981', delay: 6000 },
        { type: 'cursor', position: { x: 600, y: 400 }, user: 'Marcus Rodriguez', color: '#F59E0B', delay: 6500 }
      ]
    },
    {
      id: 'sidebar-exploration',
      title: '📂 Complete Sidebar Navigation',
      description: 'Exploring every sidebar section with actual content',
      duration: 10000,
      narration: 'Let me show you our comprehensive sidebar navigation. Each section contains powerful features for different aspects of collaboration.',
      actions: [
        { type: 'sidebar-click', target: 'current-session', delay: 500, duration: 1000 },
        { type: 'close-popup', target: 'sidebar-content', delay: 1500 },
        { type: 'sidebar-click', target: 'recent-sessions', delay: 2000, duration: 1000 },
        { type: 'close-popup', target: 'sidebar-content', delay: 3000 },
        { type: 'search', text: 'Product Strategy', delay: 3500 },
        { type: 'close-popup', target: 'search-results', delay: 5000 },
        { type: 'sidebar-click', target: 'starred', delay: 5500, duration: 1000 },
        { type: 'close-popup', target: 'sidebar-content', delay: 6500 },
        { type: 'sidebar-click', target: 'templates', delay: 7000, duration: 1000 },
        { type: 'close-popup', target: 'sidebar-content', delay: 8000 },
        { type: 'sidebar-click', target: 'team-spaces', delay: 8500, duration: 1000 },
        { type: 'close-popup', target: 'sidebar-content', delay: 9500 }
      ]
    },
    {
      id: 'new-session-creation',
      title: '🎯 New Session Creation & Canvas Update',
      description: 'Creating a new session and updating canvas with new diagram',
      duration: 8000,
      narration: 'Now I will create a new collaboration session. Watch as we replace the strategy diagram with a fresh AI Innovation workflow.',
      actions: [
        { type: 'highlight', target: 'new-session-btn', delay: 500, duration: 1500 },
        { type: 'new-session', delay: 1000 },
        { type: 'type', text: 'AI Innovation Workshop 2024', delay: 2500 },
        { type: 'click', target: 'create-session-btn', delay: 4000 },
        { type: 'close-popup', target: 'new-session-modal', delay: 4500 },
        { type: 'clear-canvas', delay: 5000 },
        { type: 'create-initial-diagram', target: 'ai-innovation', delay: 5500 }
      ]
    },
    {
      id: 'canvas-collaboration',
      title: '🎨 Advanced Canvas Collaboration with Elbow Curves',
      description: 'Professional canvas tools with team interaction and elbow connectors',
      duration: 12000,
      narration: 'Our professional canvas supports real-time collaboration with advanced drawing tools, shapes, and smart elbow curve connections.',
      actions: [
        { type: 'canvas-action', target: 'create-rectangle', position: { x: 200, y: 150 }, delay: 500 },
        { type: 'canvas-action', target: 'add-text', text: 'User Research', position: { x: 200, y: 150 }, delay: 1500 },
        { type: 'cursor', position: { x: 400, y: 200 }, user: 'Sarah Chen', color: '#10B981', delay: 2500 },
        { type: 'canvas-action', target: 'create-circle', position: { x: 400, y: 200 }, delay: 3000 },
        { type: 'canvas-action', target: 'add-text', text: 'AI Analysis', position: { x: 400, y: 200 }, delay: 3500 },
        { type: 'canvas-action', target: 'connect-elbow', delay: 4500 },
        { type: 'cursor', position: { x: 600, y: 150 }, user: 'Marcus Rodriguez', color: '#F59E0B', delay: 6000 },
        { type: 'canvas-action', target: 'create-diamond', position: { x: 600, y: 150 }, delay: 6500 },
        { type: 'canvas-action', target: 'add-text', text: 'Decision', position: { x: 600, y: 150 }, delay: 7000 },
        { type: 'canvas-action', target: 'connect-all-elbow', delay: 8500 }
      ]
    },
    {
      id: 'collaboration-panel',
      title: '👥 Team Collaboration with Voting & Reactions',
      description: 'Collaboration panel with voting, comments, and emoji reactions',
      duration: 10000,
      narration: 'Our collaboration panel enables rich team interaction with voting, emoji reactions, real-time chat, and comprehensive team management.',
      actions: [
        { type: 'panel', target: 'collaboration-panel', delay: 500 },
        { type: 'idea', position: { x: 200, y: 350 }, text: 'Implement AI-powered user onboarding', user: 'Sarah Chen', delay: 1500 },
        { type: 'vote', target: 'idea-1', user: 'Marcus Rodriguez', delay: 2500 },
        { type: 'emoji', emoji: '👍', position: { x: 250, y: 350 }, user: 'Emily Watson', delay: 3000 },
        { type: 'emoji', emoji: '❤️', position: { x: 270, y: 350 }, user: 'You', delay: 3500 },
        { type: 'comment', position: { x: 200, y: 380 }, text: 'This aligns perfectly with our Q4 goals!', user: 'Marcus Rodriguez', delay: 4500 },
        { type: 'idea', position: { x: 450, y: 350 }, text: 'Mobile-first design system', user: 'Emily Watson', delay: 6000 },
        { type: 'vote', target: 'idea-2', user: 'Sarah Chen', delay: 6500 },
        { type: 'emoji', emoji: '🚀', position: { x: 500, y: 350 }, user: 'Marcus Rodriguez', delay: 7000 },
        { type: 'emoji', emoji: '⭐', position: { x: 520, y: 350 }, user: 'AI Assistant', delay: 7500 }
      ]
    },
    {
      id: 'ai-insights-complete',
      title: '🧠 Complete AI Analysis & Team AI Insights',
      description: 'AI prompting, analysis, team member AI interactions, and comprehensive reports',
      duration: 14000,
      narration: 'Watch our advanced AI system analyze all ideas, generate comprehensive insights, and even participate as a team member with intelligent suggestions and detailed reports.',
      actions: [
        { type: 'close-panel', target: 'collaboration-panel', delay: 500 },
        { type: 'panel', target: 'ai-panel', delay: 1000 },
        { type: 'click', target: 'generate-insights', delay: 2000 },
        { type: 'wait', delay: 3000 },
        { type: 'ai-insights', delay: 5000 },
        { type: 'highlight', target: 'ai-themes', delay: 6000, duration: 1500 },
        { type: 'highlight', target: 'ai-breakthrough', delay: 7500, duration: 1500 },
        { type: 'cursor', position: { x: 350, y: 450 }, user: 'AI Assistant', color: '#8B5CF6', delay: 9000 },
        { type: 'ai-team-comment', position: { x: 350, y: 450 }, text: 'Based on the analysis, I recommend focusing on user-centric AI features first. The data shows 89% confidence in this direction.', user: 'AI Assistant', delay: 9500 },
        { type: 'emoji', emoji: '🏆', position: { x: 400, y: 450 }, user: 'AI Assistant', delay: 11000 },
        { type: 'highlight', target: 'ai-recommendations', delay: 12000, duration: 1500 }
      ]
    },
    {
      id: 'decision-finalization',
      title: '✅ Decision Finalization & Export',
      description: 'Complete workflow to final decision with export options',
      duration: 8000,
      narration: 'Finally, we finalize our decisions based on team consensus and AI insights, then export our collaborative session for stakeholders.',
      actions: [
        { type: 'highlight', target: 'top-idea', delay: 500, duration: 1500 },
        { type: 'emoji', emoji: '✅', position: { x: 200, y: 350 }, user: 'Team Decision', delay: 2000 },
        { type: 'close-panel', target: 'ai-panel', delay: 3500 },
        { type: 'highlight', target: 'export-button', delay: 4500, duration: 1500 },
        { type: 'click', target: 'export-menu', delay: 5500 },
        { type: 'highlight', target: 'share-button', delay: 6500, duration: 1500 },
        { type: 'close-popup', target: 'all', delay: 7500 }
      ]
    }
  ];

  // Auto-start demo
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPlaying(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Demo progression logic with faster pacing
  useEffect(() => {
    if (!isPlaying) return;

    const currentStepData = demoSteps[currentStep];
    if (!currentStepData) {
      setIsPlaying(false);
      onDemoComplete?.();
      return;
    }

    setCurrentNarration(currentStepData.narration);
    
    // Voice narration with better modulation
    if (voiceEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentStepData.narration);
      utterance.rate = 1.1; // Faster speech
      utterance.pitch = 1.2; // Higher pitch for professional sound
      utterance.volume = 0.9;
      speechRef.current = utterance;
      speechSynthesis.speak(utterance);
    }

    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (currentStepData.duration / 80)); // Faster progress
        
        if (newProgress >= 100) {
          if (currentStep < demoSteps.length - 1) {
            setCurrentStep(prev => prev + 1);
            return 0;
          } else {
            setIsPlaying(false);
            onDemoComplete?.();
            return 100;
          }
        }
        
        return newProgress;
      });
    }, 80); // Faster updates

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (speechRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, [isPlaying, currentStep, onDemoComplete, voiceEnabled]);

  // Execute demo actions with faster timing
  useEffect(() => {
    if (!isPlaying) return;

    const currentStepData = demoSteps[currentStep];
    if (!currentStepData) return;

    currentStepData.actions.forEach((action, index) => {
      setTimeout(() => {
        executeAction(action);
      }, action.delay || index * 800); // Faster action timing
    });
  }, [currentStep, isPlaying]);

  const executeAction = (action: DemoAction) => {
    switch (action.type) {
      case 'create-initial-diagram':
        createInitialDiagram(action.target || 'product-strategy');
        break;

      case 'clear-canvas':
        setCanvasShapes([]);
        break;

      case 'close-popup':
        if (action.target === 'ai-prompt') {
          setShowAIPrompt(false);
        } else if (action.target === 'mermaid-chart') {
          setShowMermaidChart(false);
        } else if (action.target === 'sidebar-content') {
          setSidebarContent(null);
        } else if (action.target === 'search-results') {
          setSearchResults([]);
        } else if (action.target === 'new-session-modal') {
          setNewSessionModal(false);
        } else if (action.target === 'all') {
          // Close all popups
          setShowAIPrompt(false);
          setShowMermaidChart(false);
          setSidebarContent(null);
          setSearchResults([]);
          setNewSessionModal(false);
          setAiInsightsData(null);
          setHighlightedElement(null);
        }
        break;

      case 'cursor':
        if (action.position && action.user && action.color) {
          setCursors(prev => [
            ...prev.filter(c => c.name !== action.user),
            {
              id: `cursor-${action.user}`,
              name: action.user,
              color: action.color,
              position: action.position!,
              isActive: true
            }
          ]);
        }
        break;

      case 'idea':
        if (action.position && action.text && action.user) {
          setAutoIdeas(prev => [...prev, {
            id: `auto-idea-${Date.now()}`,
            text: action.text,
            position: action.position,
            author: action.user,
            votes: 0,
            timestamp: new Date(),
            reactions: []
          }]);
        }
        break;

      case 'vote':
        setAutoIdeas(prev => prev.map(idea => 
          idea.id === action.target 
            ? { ...idea, votes: idea.votes + 1 }
            : idea
        ));
        break;

      case 'emoji':
        if (action.emoji && action.position && action.user) {
          setEmojiReactions(prev => [...prev, {
            id: `emoji-${Date.now()}`,
            emoji: action.emoji,
            position: action.position,
            user: action.user,
            timestamp: new Date()
          }]);
          
          // Remove emoji after 2 seconds (faster)
          setTimeout(() => {
            setEmojiReactions(prev => prev.filter(e => e.id !== `emoji-${Date.now()}`));
          }, 2000);
        }
        break;

      case 'comment':
        if (action.position && action.text && action.user) {
          setDemoComments(prev => [...prev, {
            id: `comment-${Date.now()}`,
            text: action.text,
            position: action.position,
            author: action.user,
            timestamp: new Date()
          }]);
        }
        break;

      case 'ai-team-comment':
        if (action.position && action.text && action.user) {
          setDemoComments(prev => [...prev, {
            id: `ai-comment-${Date.now()}`,
            text: action.text,
            position: action.position,
            author: action.user,
            timestamp: new Date(),
            isAI: true
          }]);
        }
        break;

      case 'ai-prompt':
        if (action.text) {
          setAiPromptText(action.text);
          setShowAIPrompt(true);
        }
        break;

      case 'mermaid-chart':
        setMermaidContent(`
graph TD
    A[Team Collaboration] --> B[Idea Generation]
    B --> C[AI Analysis]
    C --> D[Decision Making]
    D --> E[Export & Share]
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#e8f5e8
    style D fill:#fff3e0
    style E fill:#fce4ec
        `);
        setShowMermaidChart(true);
        break;

      case 'ai-insights':
        setAiInsightsData({
          themes: [
            'User Experience & Interface Design (45% of ideas)',
            'AI & Machine Learning Integration (32% of ideas)',
            'Performance & Scalability (28% of ideas)'
          ],
          contradictions: [
            'Simplicity vs. Advanced Features: Some ideas favor minimal UI while others suggest comprehensive toolsets',
            'Speed vs. Accuracy: Real-time features conflict with thorough data processing requirements'
          ],
          breakthrough: 'Create a modular AI-powered platform with adaptive complexity - simple by default but expandable based on user expertise and needs.',
          confidence: 0.89,
          recommendations: [
            'Prioritize AI-powered user onboarding as the foundation feature',
            'Implement progressive disclosure for advanced features',
            'Focus on real-time collaboration with conflict resolution'
          ],
          priorityMatrix: [
            { idea: 'AI-powered user onboarding', impact: 9, effort: 6 },
            { idea: 'Real-time collaboration features', impact: 8, effort: 8 },
            { idea: 'Mobile-first design system', impact: 7, effort: 4 }
          ]
        });
        break;

      case 'sidebar-click':
        setSidebarContent(action.target || null);
        setHighlightedElement(`sidebar-${action.target}`);
        setTimeout(() => {
          setHighlightedElement(null);
        }, action.duration || 1000);
        break;

      case 'search':
        if (action.text) {
          setSearchResults([
            { name: 'Product Strategy Session', type: 'session', participants: 8 },
            { name: 'Design Sprint Workshop', type: 'session', participants: 12 },
            { name: 'User Journey Mapping', type: 'session', participants: 6 }
          ]);
        }
        break;

      case 'new-session':
        setNewSessionModal(true);
        break;

      case 'canvas-action':
        if (action.target === 'create-rectangle' && action.position) {
          setCanvasShapes(prev => [...prev, {
            id: `shape-${Date.now()}`,
            type: 'rectangle',
            position: action.position,
            text: '',
            color: '#3B82F6'
          }]);
        } else if (action.target === 'create-circle' && action.position) {
          setCanvasShapes(prev => [...prev, {
            id: `shape-${Date.now()}`,
            type: 'circle',
            position: action.position,
            text: '',
            color: '#10B981'
          }]);
        } else if (action.target === 'create-diamond' && action.position) {
          setCanvasShapes(prev => [...prev, {
            id: `shape-${Date.now()}`,
            type: 'diamond',
            position: action.position,
            text: '',
            color: '#F59E0B'
          }]);
        } else if (action.target === 'add-text' && action.text && action.position) {
          setCanvasShapes(prev => prev.map(shape => 
            shape.position.x === action.position?.x && shape.position.y === action.position?.y
              ? { ...shape, text: action.text }
              : shape
          ));
        } else if (action.target === 'connect-elbow' || action.target === 'connect-all-elbow') {
          // Add elbow curve connectors
          setCanvasShapes(prev => [...prev, {
            id: `connector-${Date.now()}`,
            type: 'elbow-connector',
            startPos: { x: 300, y: 200 },
            endPos: { x: 400, y: 250 },
            color: '#8B5CF6'
          }]);
        }
        break;

      case 'panel':
        setOpenPanels(prev => [...prev, action.target || '']);
        if (action.target === 'ai-panel') {
          document.dispatchEvent(new CustomEvent('demo-open-ai-panel'));
        } else if (action.target === 'collaboration-panel') {
          document.dispatchEvent(new CustomEvent('demo-open-comments-panel'));
        }
        break;

      case 'close-panel':
        setOpenPanels(prev => prev.filter(panel => panel !== action.target));
        setTimeout(() => {
          if (action.target === 'ai-panel') {
            document.dispatchEvent(new CustomEvent('demo-close-ai-panel'));
          } else if (action.target === 'collaboration-panel') {
            document.dispatchEvent(new CustomEvent('demo-close-comments-panel'));
          }
        }, 100);
        break;

      case 'highlight':
        setHighlightedElement(action.target || null);
        setTimeout(() => setHighlightedElement(null), action.duration || 1500);
        break;

      case 'wait':
        // Just wait
        break;
    }
  };

  const createInitialDiagram = (diagramType: string) => {
    const center = getCanvasCenter();
    
    // Clear existing shapes first
    setCanvasShapes([]);
    
    setTimeout(() => {
      if (diagramType === 'product-strategy') {
        // Product Strategy Diagram - Center aligned
        const shapes = [
          // Central Vision
          {
            id: 'vision-center',
            type: 'star',
            position: { x: center.x - 60, y: center.y - 60 },
            text: 'Product Vision',
            color: '#8B5CF6',
            size: { width: 120, height: 120 }
          },
          // Market Research
          {
            id: 'market-research',
            type: 'rectangle',
            position: { x: center.x - 200, y: center.y - 150 },
            text: 'Market Research',
            color: '#3B82F6',
            size: { width: 120, height: 80 }
          },
          // User Needs
          {
            id: 'user-needs',
            type: 'circle',
            position: { x: center.x + 80, y: center.y - 150 },
            text: 'User Needs',
            color: '#10B981',
            size: { width: 100, height: 100 }
          },
          // Competitive Analysis
          {
            id: 'competitive',
            type: 'rectangle',
            position: { x: center.x - 200, y: center.y + 70 },
            text: 'Competitive Analysis',
            color: '#F59E0B',
            size: { width: 120, height: 80 }
          },
          // Implementation
          {
            id: 'implementation',
            type: 'diamond',
            position: { x: center.x + 80, y: center.y + 70 },
            text: 'Implementation',
            color: '#EF4444',
            size: { width: 100, height: 100 }
          },
          // Connectors
          {
            id: 'connector-1',
            type: 'elbow-connector',
            startPos: { x: center.x - 80, y: center.y - 110 },
            endPos: { x: center.x - 40, y: center.y - 60 },
            color: '#8B5CF6'
          },
          {
            id: 'connector-2',
            type: 'elbow-connector',
            startPos: { x: center.x + 80, y: center.y - 100 },
            endPos: { x: center.x + 40, y: center.y - 60 },
            color: '#8B5CF6'
          },
          {
            id: 'connector-3',
            type: 'elbow-connector',
            startPos: { x: center.x - 80, y: center.y + 110 },
            endPos: { x: center.x - 40, y: center.y + 60 },
            color: '#8B5CF6'
          },
          {
            id: 'connector-4',
            type: 'elbow-connector',
            startPos: { x: center.x + 80, y: center.y + 120 },
            endPos: { x: center.x + 40, y: center.y + 60 },
            color: '#8B5CF6'
          }
        ];
        setCanvasShapes(shapes);
      } else if (diagramType === 'ai-innovation') {
        // AI Innovation Workshop Diagram - Center aligned
        const shapes = [
          // Central AI Hub
          {
            id: 'ai-hub',
            type: 'star',
            position: { x: center.x - 60, y: center.y - 60 },
            text: 'AI Innovation Hub',
            color: '#8B5CF6',
            size: { width: 120, height: 120 }
          },
          // Research Phase
          {
            id: 'research',
            type: 'circle',
            position: { x: center.x - 180, y: center.y - 60 },
            text: 'Research',
            color: '#3B82F6',
            size: { width: 100, height: 100 }
          },
          // Development
          {
            id: 'development',
            type: 'rectangle',
            position: { x: center.x - 60, y: center.y - 180 },
            text: 'Development',
            color: '#10B981',
            size: { width: 120, height: 80 }
          },
          // Testing
          {
            id: 'testing',
            type: 'diamond',
            position: { x: center.x + 80, y: center.y - 60 },
            text: 'Testing',
            color: '#F59E0B',
            size: { width: 100, height: 100 }
          },
          // Deployment
          {
            id: 'deployment',
            type: 'rectangle',
            position: { x: center.x - 60, y: center.y + 80 },
            text: 'Deployment',
            color: '#EF4444',
            size: { width: 120, height: 80 }
          },
          // Connectors with elbow curves
          {
            id: 'ai-connector-1',
            type: 'elbow-connector',
            startPos: { x: center.x - 80, y: center.y - 60 },
            endPos: { x: center.x - 60, y: center.y - 60 },
            color: '#8B5CF6'
          },
          {
            id: 'ai-connector-2',
            type: 'elbow-connector',
            startPos: { x: center.x, y: center.y - 60 },
            endPos: { x: center.x, y: center.y - 100 },
            color: '#8B5CF6'
          },
          {
            id: 'ai-connector-3',
            type: 'elbow-connector',
            startPos: { x: center.x + 60, y: center.y - 60 },
            endPos: { x: center.x + 80, y: center.y - 60 },
            color: '#8B5CF6'
          },
          {
            id: 'ai-connector-4',
            type: 'elbow-connector',
            startPos: { x: center.x, y: center.y + 60 },
            endPos: { x: center.x, y: center.y + 80 },
            color: '#8B5CF6'
          }
        ];
        setCanvasShapes(shapes);
      }
    }, 100);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (isPlaying && speechRef.current) {
      speechSynthesis.pause();
    } else if (!isPlaying && speechRef.current) {
      speechSynthesis.resume();
    }
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (voiceEnabled && speechRef.current) {
      speechSynthesis.cancel();
    }
  };

  const nextStep = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setProgress(0);
      if (speechRef.current) {
        speechSynthesis.cancel();
      }
    }
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setProgress(0);
    setIsPlaying(false);
    setCursors([]);
    setAutoIdeas([]);
    setDemoComments([]);
    setEmojiReactions([]);
    setCanvasShapes([]);
    setOpenPanels([]);
    setHighlightedElement(null);
    setSidebarContent(null);
    setSearchResults([]);
    setNewSessionModal(false);
    setShowAIPrompt(false);
    setShowMermaidChart(false);
    setAiInsightsData(null);
    if (speechRef.current) {
      speechSynthesis.cancel();
    }
  };

  const currentStepData = demoSteps[currentStep];

  return (
    <div ref={demoRef} className="fixed inset-0 z-50 pointer-events-none">
      {/* Demo Controls - Smaller and cleaner */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 pointer-events-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-black/95 backdrop-blur-sm text-white rounded-xl p-3 shadow-2xl border border-white/20 max-w-xl"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium">LIVE PROFESSIONAL DEMO</span>
              <Crown className="w-3 h-3 text-yellow-400" />
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={toggleVoice}
                className="p-1 bg-white/20 hover:bg-white/30 rounded transition-colors"
                title={voiceEnabled ? "Mute Voice" : "Enable Voice"}
              >
                {voiceEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
              </button>
              <button
                onClick={togglePlayPause}
                className="p-1 bg-white/20 hover:bg-white/30 rounded transition-colors"
              >
                {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>
              <button
                onClick={nextStep}
                className="p-1 bg-white/20 hover:bg-white/30 rounded transition-colors"
              >
                <SkipForward className="w-3 h-3" />
              </button>
              <button
                onClick={resetDemo}
                className="p-1 bg-white/20 hover:bg-white/30 rounded transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">{currentStepData?.title}</h3>
              <span className="text-xs text-white/70">
                {currentStep + 1} / {demoSteps.length}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-2 rounded-full transition-all duration-100 relative overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Narration Box - Smaller */}
      {showNarration && currentNarration && (
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="absolute bottom-4 left-4 max-w-sm bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-xl border border-gray-200 pointer-events-auto"
        >
          <div className="flex items-start space-x-2">
            <div className="p-1 bg-blue-100 rounded">
              <Volume2 className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1 text-sm">Professional Narration</h4>
              <p className="text-xs text-gray-700 leading-relaxed">{currentNarration}</p>
            </div>
            <button
              onClick={() => setShowNarration(false)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </motion.div>
      )}

      {/* AI Prompt Modal */}
      <AnimatePresence>
        {showAIPrompt && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-60 max-w-sm"
          >
            <div className="flex items-center space-x-2 mb-3">
              <Brain className="w-5 h-5 text-purple-600" />
              <h3 className="text-sm font-semibold text-gray-900">AI Prompt</h3>
            </div>
            <div className="space-y-3">
              <div className="p-2 bg-gray-50 rounded text-xs text-gray-700">
                {aiPromptText}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowAIPrompt(false)}
                  className="flex-1 px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowAIPrompt(false);
                    setTimeout(() => setShowMermaidChart(true), 300);
                  }}
                  className="flex-1 px-3 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700 transition-colors"
                >
                  Generate Chart
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mermaid Chart Modal */}
      <AnimatePresence>
        {showMermaidChart && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-60 max-w-md"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <GitBranch className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-semibold text-gray-900">AI Generated Workflow</h3>
              </div>
              <button
                onClick={() => setShowMermaidChart(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <div className="text-center space-y-3">
                <div className="flex justify-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded">
                    <Users className="w-4 h-4 text-blue-600" />
                    <div className="text-xs mt-1 text-blue-800">Team</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 mt-2" />
                  <div className="p-2 bg-purple-100 rounded">
                    <Lightbulb className="w-4 h-4 text-purple-600" />
                    <div className="text-xs mt-1 text-purple-800">Ideas</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 mt-2" />
                  <div className="p-2 bg-green-100 rounded">
                    <Brain className="w-4 h-4 text-green-600" />
                    <div className="text-xs mt-1 text-green-800">AI</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 mt-2" />
                  <div className="p-2 bg-orange-100 rounded">
                    <Target className="w-4 h-4 text-orange-600" />
                    <div className="text-xs mt-1 text-orange-800">Decision</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <button
                onClick={() => setShowMermaidChart(false)}
                className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
              >
                Add to Canvas
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Insights Report Modal */}
      <AnimatePresence>
        {aiInsightsData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-60 max-w-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                <h3 className="text-sm font-semibold text-gray-900">AI Insights Report</h3>
              </div>
              <button
                onClick={() => setAiInsightsData(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            
            <div className="space-y-3 text-xs">
              <div>
                <h4 className="font-semibold text-blue-800 mb-1">🧩 Key Themes:</h4>
                <ul className="space-y-1">
                  {aiInsightsData.themes.map((theme: string, index: number) => (
                    <li key={index} className="text-blue-700 ml-2">• {theme}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-orange-800 mb-1">⚠️ Contradictions:</h4>
                <ul className="space-y-1">
                  {aiInsightsData.contradictions.map((contradiction: string, index: number) => (
                    <li key={index} className="text-orange-700 ml-2">• {contradiction}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-green-800 mb-1">🚀 Breakthrough:</h4>
                <p className="text-green-700 italic">"{aiInsightsData.breakthrough}"</p>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                <span className="text-purple-800 font-medium">Confidence</span>
                <span className="text-purple-600 font-bold">{Math.round(aiInsightsData.confidence * 100)}%</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Cursors */}
      <AnimatePresence>
        {cursors.map((cursor) => (
          <motion.div
            key={cursor.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              x: cursor.position.x,
              y: cursor.position.y
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="absolute pointer-events-none z-40"
          >
            <div className="relative">
              <MousePointer 
                className="w-5 h-5 drop-shadow-lg transform -rotate-12"
                style={{ color: cursor.color }}
              />
              <div 
                className="absolute top-5 left-2 px-2 py-1 rounded text-white text-xs font-medium whitespace-nowrap shadow-lg"
                style={{ backgroundColor: cursor.color }}
              >
                {cursor.name}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Auto-generated Ideas with Voting and Reactions */}
      <AnimatePresence>
        {autoIdeas.map((idea) => (
          <motion.div
            key={idea.id}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="absolute pointer-events-none z-30"
            style={{
              left: idea.position.x,
              top: idea.position.y,
            }}
          >
            <div className="w-56 bg-yellow-100 border-2 border-yellow-300 rounded-xl p-3 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-yellow-800">{idea.author}</span>
                <div className="flex items-center space-x-1 bg-yellow-200 px-2 py-1 rounded-full">
                  <TrendingUp className="w-3 h-3 text-yellow-700" />
                  <span className="text-xs font-bold text-yellow-700">{idea.votes}</span>
                </div>
              </div>
              <p className="text-xs text-yellow-900 mb-2">{idea.text}</p>
              <div className="flex items-center space-x-1">
                {['👍', '❤️', '⭐', '🚀'].map((emoji, index) => (
                  <span key={index} className="text-xs opacity-60">{emoji}</span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Emoji Reactions */}
      <AnimatePresence>
        {emojiReactions.map((reaction) => (
          <motion.div
            key={reaction.id}
            initial={{ opacity: 0, scale: 0.5, y: 0 }}
            animate={{ opacity: 1, scale: 1.2, y: -30 }}
            exit={{ opacity: 0, scale: 0.5, y: -60 }}
            transition={{ duration: 0.5 }}
            className="absolute pointer-events-none z-50 text-xl"
            style={{
              left: reaction.position.x,
              top: reaction.position.y,
            }}
          >
            {reaction.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Canvas Shapes with Proper Positioning and Elbow Connectors */}
      <AnimatePresence>
        {canvasShapes.map((shape) => (
          <motion.div
            key={shape.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute pointer-events-none z-25"
            style={{
              left: shape.position?.x || shape.startPos?.x,
              top: shape.position?.y || shape.startPos?.y,
            }}
          >
            {shape.type === 'elbow-connector' ? (
              <svg width="200" height="150" className="absolute">
                <path
                  d={`M 0 0 L 50 0 L 50 100 L 100 100`}
                  stroke={shape.color}
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="8,4"
                  className="drop-shadow-sm"
                />
                <polygon
                  points="95,95 105,100 95,105"
                  fill={shape.color}
                />
              </svg>
            ) : (
              <div 
                className={`flex items-center justify-center text-white text-xs font-medium shadow-lg ${
                  shape.type === 'rectangle' ? 'rounded-lg' :
                  shape.type === 'circle' ? 'rounded-full' :
                  shape.type === 'star' ? 'rounded-lg' :
                  'transform rotate-45 rounded-lg'
                }`}
                style={{ 
                  backgroundColor: shape.color,
                  width: shape.size?.width || (shape.type === 'circle' ? '80px' : '100px'),
                  height: shape.size?.height || (shape.type === 'circle' ? '80px' : '60px')
                }}
              >
                <span className={shape.type === 'diamond' ? 'transform -rotate-45' : ''}>
                  {shape.text}
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Comments with AI Team Member */}
      <AnimatePresence>
        {demoComments.map((comment) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute pointer-events-none z-30"
            style={{
              left: comment.position.x + 20,
              top: comment.position.y - 10,
            }}
          >
            <div className={`max-w-xs border rounded-lg p-2 shadow-lg ${
              comment.isAI 
                ? 'bg-purple-50 border-purple-200' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center space-x-2 mb-1">
                {comment.isAI ? (
                  <Brain className="w-3 h-3 text-purple-600" />
                ) : (
                  <MessageSquare className="w-3 h-3 text-blue-600" />
                )}
                <span className={`text-xs font-medium ${
                  comment.isAI ? 'text-purple-700' : 'text-gray-700'
                }`}>
                  {comment.author}
                </span>
                {comment.isAI && (
                  <span className="text-xs bg-purple-100 text-purple-600 px-1 rounded">AI</span>
                )}
              </div>
              <p className={`text-xs ${
                comment.isAI ? 'text-purple-600' : 'text-gray-600'
              }`}>
                {comment.text}
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Sidebar Content Display */}
      <AnimatePresence>
        {sidebarContent && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute left-80 top-32 bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-45 max-w-xs"
          >
            <h4 className="font-semibold text-gray-900 mb-2 capitalize text-sm">
              {sidebarContent.replace('-', ' ')} Content
            </h4>
            {sidebarContent === 'recent-sessions' && (
              <div className="space-y-2">
                <div className="p-2 bg-blue-50 rounded border-l-2 border-blue-500">
                  <div className="font-medium text-xs">Product Strategy Session</div>
                  <div className="text-xs text-gray-500">8 participants • Active</div>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <div className="font-medium text-xs">Design Sprint Workshop</div>
                  <div className="text-xs text-gray-500">12 participants • Completed</div>
                </div>
              </div>
            )}
            {sidebarContent === 'starred' && (
              <div className="space-y-2">
                <div className="p-2 bg-yellow-50 rounded border-l-2 border-yellow-500">
                  <div className="font-medium text-xs">⭐ Innovation Workshop</div>
                  <div className="text-xs text-gray-500">Starred session</div>
                </div>
              </div>
            )}
            {sidebarContent === 'templates' && (
              <div className="space-y-2">
                <div className="p-2 bg-green-50 rounded border-l-2 border-green-500">
                  <div className="font-medium text-xs">📋 Brainstorming Template</div>
                  <div className="text-xs text-gray-500">67 uses</div>
                </div>
                <div className="p-2 bg-green-50 rounded">
                  <div className="font-medium text-xs">🎯 Strategy Planning</div>
                  <div className="text-xs text-gray-500">45 uses</div>
                </div>
              </div>
            )}
            {sidebarContent === 'team-spaces' && (
              <div className="space-y-2">
                <div className="p-2 bg-purple-50 rounded border-l-2 border-purple-500">
                  <div className="font-medium text-xs">👥 Product Team</div>
                  <div className="text-xs text-gray-500">15 members • 8 active sessions</div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Results */}
      <AnimatePresence>
        {searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-45 w-72"
          >
            <h4 className="font-semibold text-gray-900 mb-2 text-sm">Search Results</h4>
            <div className="space-y-2">
              {searchResults.map((result, index) => (
                <div key={index} className="p-2 hover:bg-gray-50 rounded">
                  <div className="font-medium text-xs">{result.name}</div>
                  <div className="text-xs text-gray-500">{result.participants} participants</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Session Modal */}
      <AnimatePresence>
        {newSessionModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-60 max-w-sm"
          >
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Create New Session</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Session Name</label>
                <input
                  type="text"
                  value="AI Innovation Workshop 2024"
                  readOnly
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs bg-gray-50"
                />
              </div>
              <div className="flex space-x-2">
                <button className="flex-1 px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                  Cancel
                </button>
                <button className="flex-1 px-3 py-1 bg-blue-600 text-white rounded text-xs">
                  Create Session
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Highlight Overlays */}
      {highlightedElement && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 pointer-events-none z-20"
        >
          <div className="absolute inset-0 bg-blue-500/10 animate-pulse rounded-lg" />
          <div className="absolute inset-0 border-4 border-blue-500 rounded-lg animate-pulse" />
        </motion.div>
      )}

      {/* Demo Completion */}
      {currentStep === demoSteps.length - 1 && progress >= 95 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 bg-black/60 flex items-center justify-center z-60"
        >
          <div className="bg-white rounded-2xl p-6 max-w-md text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Demo Complete! 🎉</h2>
            <p className="text-gray-600 mb-4 text-sm">
              You've experienced the full power of MindMeld Enterprise. Ready to revolutionize your team's collaboration?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={resetDemo}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Watch Again
              </button>
              <button
                onClick={onDemoComplete}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all text-sm"
              >
                Get Started
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};