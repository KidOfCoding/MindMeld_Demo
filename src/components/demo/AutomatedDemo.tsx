import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw, 
  Volume2,
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
  Square,
  Type,
  Lightbulb,
  ThumbsUp,
  Star,
  Settings,
  Download,
  Share2,
  Bell,
  Search,
  Plus,
  Edit3,
  Save,
  Palette,
  Layers,
  Map,
  Eye,
  Clock,
  Award,
  BarChart3,
  FileText,
  Crown,
  Maximize,
  Grid,
  Hand
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
  type: 'cursor' | 'click' | 'type' | 'highlight' | 'panel' | 'wait' | 'idea' | 'vote' | 'comment' | 'session' | 'tool' | 'shape' | 'ai-generate' | 'close-panel' | 'navbar-action' | 'sidebar-action';
  target?: string;
  position?: { x: number; y: number };
  text?: string;
  delay?: number;
  user?: string;
  color?: string;
  duration?: number;
  panelType?: 'ai' | 'collaborators' | 'sidebar' | 'minimap' | 'layers' | 'properties' | 'comments';
  toolType?: 'select' | 'rectangle' | 'text' | 'sticky' | 'pen' | 'hand';
  shapeData?: { width: number; height: number; };
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
  const [currentAction, setCurrentAction] = useState(0);
  const [progress, setProgress] = useState(0);
  const [cursors, setCursors] = useState<FloatingCursor[]>([]);
  const [demoIdeas, setDemoIdeas] = useState<any[]>([]);
  const [demoComments, setDemoComments] = useState<any[]>([]);
  const [demoShapes, setDemoShapes] = useState<any[]>([]);
  const [showNarration, setShowNarration] = useState(true);
  const [currentNarration, setCurrentNarration] = useState('');
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [openPanels, setOpenPanels] = useState<Set<string>>(new Set());
  const [activeTool, setActiveTool] = useState('select');
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [sessionSwitched, setSessionSwitched] = useState(false);
  const [currentSession, setCurrentSession] = useState('Product Strategy Session');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [searchActive, setSearchActive] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  
  const demoRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const demoSteps: DemoStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to MindMeld Enterprise',
      description: 'AI-Powered Collaborative Canvas for Modern Teams',
      duration: 8000,
      narration: 'Welcome to MindMeld Enterprise - the most advanced collaborative ideation platform. Watch as teams work together in real-time with AI-powered insights.',
      actions: [
        { type: 'highlight', target: 'navbar', delay: 1000, duration: 2000 },
        { type: 'highlight', target: 'logo', delay: 2000, duration: 1500 },
        { type: 'cursor', position: { x: 400, y: 300 }, user: 'Sarah Chen', color: '#10B981', delay: 3000 },
        { type: 'cursor', position: { x: 600, y: 400 }, user: 'Marcus Rodriguez', color: '#F59E0B', delay: 4000 },
        { type: 'wait', delay: 2000 }
      ]
    },
    {
      id: 'navbar-exploration',
      title: 'Professional Interface Navigation',
      description: 'Exploring the comprehensive navigation and controls',
      duration: 12000,
      narration: 'Our professional interface provides comprehensive project management, search capabilities, notifications, and user controls - everything teams need for effective collaboration.',
      actions: [
        { type: 'highlight', target: 'project-selector', delay: 500, duration: 2000 },
        { type: 'navbar-action', target: 'search', delay: 2500 },
        { type: 'type', text: 'AI features', delay: 3000 },
        { type: 'navbar-action', target: 'notifications', delay: 4500 },
        { type: 'highlight', target: 'notification-panel', delay: 5000, duration: 2000 },
        { type: 'navbar-action', target: 'user-menu', delay: 7500 },
        { type: 'highlight', target: 'user-dropdown', delay: 8000, duration: 2000 },
        { type: 'navbar-action', target: 'close-menus', delay: 10000 }
      ]
    },
    {
      id: 'sidebar-navigation',
      title: 'Advanced Project Management',
      description: 'Comprehensive sidebar navigation and session management',
      duration: 15000,
      narration: 'The sidebar provides powerful project management with recent sessions, templates, team workspaces, and starred projects. Watch how easy it is to organize and switch between different collaboration sessions.',
      actions: [
        { type: 'highlight', target: 'sidebar', delay: 500, duration: 2000 },
        { type: 'sidebar-action', target: 'recent-sessions', delay: 2500 },
        { type: 'highlight', target: 'session-list', delay: 3000, duration: 2000 },
        { type: 'sidebar-action', target: 'templates', delay: 5500 },
        { type: 'highlight', target: 'template-grid', delay: 6000, duration: 2000 },
        { type: 'sidebar-action', target: 'starred', delay: 8500 },
        { type: 'sidebar-action', target: 'team-spaces', delay: 10000 },
        { type: 'highlight', target: 'team-workspaces', delay: 10500, duration: 2000 },
        { type: 'sidebar-action', target: 'new-session', delay: 13000 }
      ]
    },
    {
      id: 'canvas-tools',
      title: 'Professional Canvas Tools',
      description: 'Miro-style canvas with advanced drawing and shape tools',
      duration: 18000,
      narration: 'Our professional canvas offers industry-leading tools for creating diagrams, flowcharts, and visual representations. Watch as we demonstrate the complete toolkit.',
      actions: [
        { type: 'highlight', target: 'canvas-toolbar', delay: 500, duration: 2000 },
        { type: 'tool', toolType: 'sticky', delay: 2500 },
        { type: 'cursor', position: { x: 300, y: 250 }, user: 'Sarah Chen', color: '#10B981', delay: 3000 },
        { type: 'idea', position: { x: 300, y: 250 }, text: 'AI-powered user onboarding system', user: 'Sarah Chen', delay: 3500 },
        { type: 'tool', toolType: 'rectangle', delay: 5000 },
        { type: 'cursor', position: { x: 500, y: 200 }, user: 'Marcus Rodriguez', color: '#F59E0B', delay: 5500 },
        { type: 'shape', position: { x: 500, y: 200 }, shapeData: { width: 150, height: 100 }, delay: 6000 },
        { type: 'tool', toolType: 'text', delay: 7500 },
        { type: 'cursor', position: { x: 520, y: 230 }, user: 'Marcus Rodriguez', color: '#F59E0B', delay: 8000 },
        { type: 'type', text: 'User Journey Flow', delay: 8500 },
        { type: 'tool', toolType: 'pen', delay: 10000 },
        { type: 'cursor', position: { x: 400, y: 350 }, user: 'Emily Watson', color: '#EF4444', delay: 10500 },
        { type: 'highlight', target: 'color-palette', delay: 12000, duration: 2000 },
        { type: 'highlight', target: 'zoom-controls', delay: 14000, duration: 2000 },
        { type: 'tool', toolType: 'select', delay: 16000 }
      ]
    },
    {
      id: 'real-time-collaboration',
      title: 'Real-Time Team Collaboration',
      description: 'Multiple team members working together seamlessly',
      duration: 20000,
      narration: 'Experience true real-time collaboration as team members add ideas, vote, and provide feedback simultaneously. Notice how each person has their own cursor color and can contribute without conflicts.',
      actions: [
        { type: 'cursor', position: { x: 200, y: 400 }, user: 'Sarah Chen', color: '#10B981', delay: 500 },
        { type: 'idea', position: { x: 200, y: 400 }, text: 'Mobile-first design with dark mode support', user: 'Sarah Chen', delay: 1000 },
        { type: 'cursor', position: { x: 600, y: 300 }, user: 'Marcus Rodriguez', color: '#F59E0B', delay: 2000 },
        { type: 'idea', position: { x: 600, y: 300 }, text: 'Voice-to-text functionality for accessibility', user: 'Marcus Rodriguez', delay: 2500 },
        { type: 'cursor', position: { x: 400, y: 500 }, user: 'Emily Watson', color: '#EF4444', delay: 4000 },
        { type: 'idea', position: { x: 400, y: 500 }, text: 'Advanced analytics dashboard', user: 'Emily Watson', delay: 4500 },
        { type: 'vote', target: 'idea-1', user: 'Marcus Rodriguez', delay: 6000 },
        { type: 'vote', target: 'idea-1', user: 'Emily Watson', delay: 6500 },
        { type: 'vote', target: 'idea-2', user: 'Sarah Chen', delay: 7000 },
        { type: 'vote', target: 'idea-3', user: 'Sarah Chen', delay: 7500 },
        { type: 'vote', target: 'idea-2', user: 'Emily Watson', delay: 8000 },
        { type: 'comment', position: { x: 220, y: 420 }, text: 'This aligns perfectly with our Q4 goals!', user: 'Marcus Rodriguez', delay: 9000 },
        { type: 'comment', position: { x: 620, y: 320 }, text: 'Great accessibility focus!', user: 'Sarah Chen', delay: 10000 },
        { type: 'panel', panelType: 'collaborators', delay: 12000 },
        { type: 'highlight', target: 'collaborator-panel', delay: 12500, duration: 3000 },
        { type: 'highlight', target: 'online-users', delay: 15500, duration: 2000 },
        { type: 'close-panel', panelType: 'collaborators', delay: 18000 }
      ]
    },
    {
      id: 'ai-insights-generation',
      title: 'AI-Powered Insights & Analysis',
      description: 'Advanced AI analysis of ideas and collaboration patterns',
      duration: 25000,
      narration: 'Watch our advanced AI analyze all ideas and generate powerful insights, identifying themes, contradictions, breakthrough opportunities, and providing strategic recommendations for your team.',
      actions: [
        { type: 'panel', panelType: 'ai', delay: 1000 },
        { type: 'highlight', target: 'ai-panel', delay: 1500, duration: 2000 },
        { type: 'cursor', position: { x: 1200, y: 300 }, user: 'AI Assistant', color: '#8B5CF6', delay: 3500 },
        { type: 'ai-generate', target: 'generate-insights', delay: 4000 },
        { type: 'highlight', target: 'ai-processing', delay: 4500, duration: 3000 },
        { type: 'highlight', target: 'ai-themes', delay: 8000, duration: 2000 },
        { type: 'highlight', target: 'ai-contradictions', delay: 10500, duration: 2000 },
        { type: 'highlight', target: 'ai-breakthrough', delay: 13000, duration: 2500 },
        { type: 'click', target: 'analytics-tab', delay: 16000 },
        { type: 'highlight', target: 'priority-matrix', delay: 16500, duration: 2000 },
        { type: 'click', target: 'recommendations-tab', delay: 19000 },
        { type: 'highlight', target: 'strategic-recommendations', delay: 19500, duration: 2000 },
        { type: 'click', target: 'collaboration-tab', delay: 22000 },
        { type: 'highlight', target: 'team-metrics', delay: 22500, duration: 2000 }
      ]
    },
    {
      id: 'idea-finalization',
      title: 'Idea Validation & Finalization Process',
      description: 'Complete workflow from ideation to final decision',
      duration: 20000,
      narration: 'See the complete workflow as ideas are validated, refined, and finalized through team collaboration and AI recommendations. This is how breakthrough decisions are made.',
      actions: [
        { type: 'highlight', target: 'top-voted-idea', delay: 500, duration: 2000 },
        { type: 'cursor', position: { x: 320, y: 270 }, user: 'Sarah Chen', color: '#10B981', delay: 2500 },
        { type: 'comment', position: { x: 340, y: 290 }, text: 'Based on AI analysis, this should be our priority!', user: 'Sarah Chen', delay: 3000 },
        { type: 'vote', target: 'idea-1', user: 'Team Lead', delay: 4000 },
        { type: 'vote', target: 'idea-1', user: 'Product Manager', delay: 4500 },
        { type: 'highlight', target: 'idea-finalized', delay: 5000, duration: 3000 },
        { type: 'cursor', position: { x: 700, y: 200 }, user: 'Marcus Rodriguez', color: '#F59E0B', delay: 8500 },
        { type: 'shape', position: { x: 700, y: 200 }, shapeData: { width: 200, height: 80 }, delay: 9000 },
        { type: 'type', text: 'FINAL DECISION: AI-Powered Onboarding', delay: 9500 },
        { type: 'highlight', target: 'decision-box', delay: 10000, duration: 2000 },
        { type: 'navbar-action', target: 'save', delay: 12500 },
        { type: 'highlight', target: 'auto-save', delay: 13000, duration: 2000 },
        { type: 'navbar-action', target: 'export', delay: 15500 },
        { type: 'highlight', target: 'export-options', delay: 16000, duration: 2000 },
        { type: 'navbar-action', target: 'share', delay: 18500 }
      ]
    },
    {
      id: 'session-management',
      title: 'Advanced Session & Project Management',
      description: 'Switching between projects and managing multiple sessions',
      duration: 15000,
      narration: 'Manage multiple projects effortlessly with our advanced session management. Switch between different brainstorming sessions, access templates, and organize your team\'s work.',
      actions: [
        { type: 'highlight', target: 'session-selector', delay: 1000, duration: 2000 },
        { type: 'cursor', position: { x: 300, y: 60 }, user: 'Sarah Chen', color: '#10B981', delay: 3000 },
        { type: 'click', target: 'session-dropdown', delay: 3500 },
        { type: 'highlight', target: 'session-list', delay: 4000, duration: 2000 },
        { type: 'session', target: 'design-sprint-session', delay: 6500 },
        { type: 'highlight', target: 'session-switched', delay: 7000, duration: 2000 },
        { type: 'sidebar-action', target: 'new-session', delay: 9500 },
        { type: 'highlight', target: 'new-session-modal', delay: 10000, duration: 2000 },
        { type: 'type', text: 'Customer Journey Workshop', delay: 12000 },
        { type: 'click', target: 'template-select', delay: 13000 }
      ]
    },
    {
      id: 'advanced-features',
      title: 'Advanced Features & Integrations',
      description: 'Exploring advanced canvas features and integrations',
      duration: 18000,
      narration: 'Discover advanced features including mini-map navigation, layer management, property panels, comment systems, and professional export options.',
      actions: [
        { type: 'panel', panelType: 'minimap', delay: 1000 },
        { type: 'highlight', target: 'minimap', delay: 1500, duration: 2000 },
        { type: 'panel', panelType: 'layers', delay: 4000 },
        { type: 'highlight', target: 'layer-panel', delay: 4500, duration: 2000 },
        { type: 'close-panel', panelType: 'layers', delay: 7000 },
        { type: 'panel', panelType: 'properties', delay: 8000 },
        { type: 'highlight', target: 'property-panel', delay: 8500, duration: 2000 },
        { type: 'close-panel', panelType: 'properties', delay: 11000 },
        { type: 'panel', panelType: 'comments', delay: 12000 },
        { type: 'highlight', target: 'comment-system', delay: 12500, duration: 2000 },
        { type: 'close-panel', panelType: 'comments', delay: 15000 },
        { type: 'highlight', target: 'canvas-settings', delay: 16000, duration: 2000 }
      ]
    },
    {
      id: 'demo-complete',
      title: 'Demo Complete - Ready for Production',
      description: 'MindMeld Enterprise: Where teams think together and decide smarter',
      duration: 8000,
      narration: 'Thank you for experiencing MindMeld Enterprise - the complete solution for collaborative ideation, AI-powered insights, and team decision-making. Ready to transform your collaboration?',
      actions: [
        { type: 'close-panel', panelType: 'ai', delay: 500 },
        { type: 'highlight', target: 'entire-app', delay: 1000, duration: 3000 },
        { type: 'cursor', position: { x: 400, y: 300 }, user: 'Demo Complete', color: '#8B5CF6', delay: 4500 },
        { type: 'wait', delay: 3000 }
      ]
    }
  ];

  // Auto-start demo
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPlaying(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Demo progression logic
  useEffect(() => {
    if (!isPlaying) return;

    const currentStepData = demoSteps[currentStep];
    if (!currentStepData) {
      setIsPlaying(false);
      onDemoComplete?.();
      return;
    }

    setCurrentNarration(currentStepData.narration);

    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (currentStepData.duration / 100));
        
        if (newProgress >= 100) {
          // Move to next step
          if (currentStep < demoSteps.length - 1) {
            setCurrentStep(prev => prev + 1);
            setCurrentAction(0);
            return 0;
          } else {
            setIsPlaying(false);
            onDemoComplete?.();
            return 100;
          }
        }
        
        return newProgress;
      });
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentStep, onDemoComplete]);

  // Execute demo actions
  useEffect(() => {
    if (!isPlaying) return;

    const currentStepData = demoSteps[currentStep];
    if (!currentStepData) return;

    currentStepData.actions.forEach((action, index) => {
      setTimeout(() => {
        executeAction(action);
      }, action.delay || index * 1000);
    });
  }, [currentStep, isPlaying]);

  const executeAction = (action: DemoAction) => {
    switch (action.type) {
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
          setDemoIdeas(prev => [...prev, {
            id: `auto-idea-${Date.now()}`,
            text: action.text,
            position: action.position,
            author: action.user,
            votes: 0,
            timestamp: new Date(),
            isFinalized: false
          }]);
        }
        break;

      case 'shape':
        if (action.position && action.shapeData) {
          setDemoShapes(prev => [...prev, {
            id: `shape-${Date.now()}`,
            position: action.position,
            size: action.shapeData,
            type: 'rectangle',
            timestamp: new Date()
          }]);
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

      case 'vote':
        setDemoIdeas(prev => prev.map(idea => 
          idea.id === action.target || idea.text.includes('AI-powered')
            ? { ...idea, votes: idea.votes + 1 }
            : idea
        ));
        break;

      case 'tool':
        if (action.toolType) {
          setActiveTool(action.toolType);
        }
        break;

      case 'panel':
        if (action.panelType) {
          setOpenPanels(prev => new Set([...prev, action.panelType!]));
          
          // Trigger panel opening events
          if (action.panelType === 'ai') {
            document.dispatchEvent(new CustomEvent('demo-open-ai-panel'));
          } else if (action.panelType === 'collaborators') {
            document.dispatchEvent(new CustomEvent('demo-open-comments-panel'));
          }
        }
        break;

      case 'close-panel':
        if (action.panelType) {
          setOpenPanels(prev => {
            const newSet = new Set(prev);
            newSet.delete(action.panelType!);
            return newSet;
          });
        }
        break;

      case 'ai-generate':
        setTimeout(() => {
          setAiInsights({
            themes: [
              'User Experience & Interface Design (67% of ideas)',
              'AI & Machine Learning Integration (45% of ideas)',
              'Accessibility & Inclusive Design (34% of ideas)'
            ],
            contradictions: [
              'Complexity vs. Simplicity: Advanced AI features vs. simple user interface',
              'Speed vs. Accuracy: Real-time features vs. thorough analysis'
            ],
            breakthrough: 'Create an adaptive AI-powered onboarding system that learns from user behavior and progressively reveals advanced features based on user expertise and needs.',
            confidence: 0.92,
            recommendations: [
              'Prioritize AI-powered user onboarding as the foundation feature',
              'Implement progressive disclosure for advanced features',
              'Focus on accessibility from the ground up',
              'Build comprehensive analytics for user behavior insights'
            ]
          });
        }, 3000);
        break;

      case 'highlight':
        setHighlightedElement(action.target || null);
        setTimeout(() => setHighlightedElement(null), action.duration || 2000);
        break;

      case 'session':
        setSessionSwitched(true);
        setCurrentSession('Design Sprint Workshop');
        setTimeout(() => setSessionSwitched(false), 3000);
        break;

      case 'navbar-action':
        if (action.target === 'search') {
          setSearchActive(true);
          setTimeout(() => setSearchActive(false), 3000);
        } else if (action.target === 'notifications') {
          setNotifications([
            { id: 1, text: 'Sarah added 3 new ideas', time: '2 min ago', unread: true },
            { id: 2, text: 'AI insights ready for review', time: '5 min ago', unread: true }
          ]);
        }
        break;

      case 'sidebar-action':
        if (action.target === 'toggle') {
          setSidebarExpanded(prev => !prev);
        }
        break;

      case 'type':
        // Simulate typing animation
        break;
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const nextStep = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setProgress(0);
    }
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setProgress(0);
    setIsPlaying(false);
    setCursors([]);
    setDemoIdeas([]);
    setDemoComments([]);
    setDemoShapes([]);
    setHighlightedElement(null);
    setOpenPanels(new Set());
    setAiInsights(null);
    setActiveTool('select');
    setNotifications([]);
    setSearchActive(false);
  };

  const currentStepData = demoSteps[currentStep];

  return (
    <div ref={demoRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 9999 }}>
      {/* Demo Controls - Highest Z-Index */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 pointer-events-auto" style={{ zIndex: 10000 }}>
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-black/95 backdrop-blur-sm text-white rounded-xl p-4 shadow-2xl border border-white/20"
        >
          <div className="flex items-center space-x-4 mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">LIVE DEMO</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={togglePlayPause}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={nextStep}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                <SkipForward className="w-4 h-4" />
              </button>
              <button
                onClick={resetDemo}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{currentStepData?.title}</h3>
              <span className="text-sm text-white/70">
                {currentStep + 1} / {demoSteps.length}
              </span>
            </div>
            <p className="text-sm text-white/80">{currentStepData?.description}</p>
            
            {/* Progress Bar */}
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Narration Box */}
      {showNarration && currentNarration && (
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="absolute bottom-4 left-4 max-w-md bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-200 pointer-events-auto"
          style={{ zIndex: 9998 }}
        >
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Volume2 className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">Demo Narration</h4>
              <p className="text-sm text-gray-700 leading-relaxed">{currentNarration}</p>
            </div>
            <button
              onClick={() => setShowNarration(false)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}

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
            className="absolute pointer-events-none"
            style={{ zIndex: 9997 }}
          >
            <div className="relative">
              <MousePointer 
                className="w-6 h-6 drop-shadow-lg transform -rotate-12"
                style={{ color: cursor.color }}
              />
              <div 
                className="absolute top-6 left-2 px-2 py-1 rounded text-white text-xs font-medium whitespace-nowrap shadow-lg"
                style={{ backgroundColor: cursor.color }}
              >
                {cursor.name}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Auto-generated Ideas */}
      <AnimatePresence>
        {demoIdeas.map((idea) => (
          <motion.div
            key={idea.id}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="absolute pointer-events-none"
            style={{
              left: idea.position.x,
              top: idea.position.y,
              zIndex: 9995
            }}
          >
            <div className={`w-64 rounded-xl p-4 shadow-lg border-2 ${
              idea.isFinalized 
                ? 'bg-gradient-to-br from-green-100 to-green-200 border-green-400' 
                : 'bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-300'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-yellow-800">{idea.author}</span>
                <div className="flex items-center space-x-1 bg-yellow-200 px-2 py-1 rounded-full">
                  <TrendingUp className="w-3 h-3 text-yellow-700" />
                  <span className="text-xs font-bold text-yellow-700">{idea.votes}</span>
                </div>
              </div>
              <p className="text-sm text-yellow-900">{idea.text}</p>
              {idea.isFinalized && (
                <div className="mt-2 flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-medium text-green-600">FINALIZED</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Auto-generated Shapes */}
      <AnimatePresence>
        {demoShapes.map((shape) => (
          <motion.div
            key={shape.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute pointer-events-none border-2 border-blue-500 bg-blue-100 rounded-lg flex items-center justify-center"
            style={{
              left: shape.position.x,
              top: shape.position.y,
              width: shape.size.width,
              height: shape.size.height,
              zIndex: 9994
            }}
          >
            <span className="text-sm font-medium text-blue-800">User Journey Flow</span>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Auto-generated Comments */}
      <AnimatePresence>
        {demoComments.map((comment) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute pointer-events-none"
            style={{
              left: comment.position.x + 20,
              top: comment.position.y - 10,
              zIndex: 9996
            }}
          >
            <div className="max-w-xs bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
              <div className="flex items-center space-x-2 mb-1">
                <MessageSquare className="w-3 h-3 text-blue-600" />
                <span className="text-xs font-medium text-gray-700">{comment.author}</span>
              </div>
              <p className="text-xs text-gray-600">{comment.text}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Highlight Overlays */}
      {highlightedElement && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 9993 }}
        >
          <div className="absolute inset-0 bg-blue-500/20 animate-pulse rounded-lg" />
          <div className="absolute inset-0 border-4 border-blue-500 rounded-lg animate-pulse" />
        </motion.div>
      )}

      {/* AI Insights Display */}
      {aiInsights && openPanels.has('ai') && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          className="absolute right-4 top-20 w-96 bg-white rounded-lg shadow-xl border border-gray-200 p-6"
          style={{ zIndex: 9992 }}
        >
          <div className="flex items-center space-x-2 mb-4">
            <Brain className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">AI Insights Generated</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-purple-800 mb-2">🧩 Key Themes:</h4>
              <ul className="space-y-1">
                {aiInsights.themes.map((theme: string, index: number) => (
                  <li key={index} className="text-sm text-purple-700 ml-4">• {theme}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-purple-800 mb-2">🚀 Breakthrough Insight:</h4>
              <p className="text-sm text-purple-700 italic">"{aiInsights.breakthrough}"</p>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Confidence</span>
              <span className="text-lg font-bold text-green-600">
                {Math.round(aiInsights.confidence * 100)}%
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Session Switch Notification */}
      {sessionSwitched && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg"
          style={{ zIndex: 9991 }}
        >
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Switched to {currentSession}</span>
          </div>
        </motion.div>
      )}

      {/* Tool Selection Indicator */}
      {activeTool !== 'select' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-20 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg"
          style={{ zIndex: 9990 }}
        >
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span className="font-medium capitalize">{activeTool} tool active</span>
          </div>
        </motion.div>
      )}

      {/* Search Active Indicator */}
      {searchActive && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-lg p-3"
          style={{ zIndex: 9989 }}
        >
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-gray-700">Searching for "AI features"...</span>
          </div>
        </motion.div>
      )}

      {/* Feature Callouts */}
      <AnimatePresence>
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 rounded-xl shadow-xl max-w-xs pointer-events-none"
            style={{ zIndex: 9988 }}
          >
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-5 h-5" />
              <span className="font-semibold">Real-Time Collaboration</span>
            </div>
            <p className="text-sm opacity-90">
              Multiple team members working simultaneously with live cursors and instant updates.
            </p>
          </motion.div>
        )}

        {currentStep === 5 && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl shadow-xl max-w-xs pointer-events-none"
            style={{ zIndex: 9988 }}
          >
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="w-5 h-5" />
              <span className="font-semibold">AI-Powered Insights</span>
            </div>
            <p className="text-sm opacity-90">
              Advanced AI analyzes all ideas to identify themes, contradictions, and breakthrough opportunities.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Demo Completion */}
      {currentStep === demoSteps.length - 1 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 bg-black/50 flex items-center justify-center"
          style={{ zIndex: 10001 }}
        >
          <div className="bg-white rounded-2xl p-8 max-w-md text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Demo Complete!</h2>
            <p className="text-gray-600 mb-6">
              You've experienced the full power of MindMeld Enterprise. Ready to transform your team's collaboration?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={resetDemo}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Watch Again
              </button>
              <button
                onClick={onDemoComplete}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
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