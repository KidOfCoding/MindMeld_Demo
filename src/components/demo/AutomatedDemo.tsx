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
  Hand,
  Heart,
  Smile,
  Coffee,
  Rocket,
  Trophy,
  Mic,
  MicOff
} from 'lucide-react';

interface DemoStep {
  id: string;
  title: string;
  description: string;
  duration: number;
  actions: DemoAction[];
  narration: string;
  voiceText?: string;
}

interface DemoAction {
  type: 'cursor' | 'click' | 'type' | 'highlight' | 'panel' | 'wait' | 'idea' | 'vote' | 'comment' | 'session' | 'tool' | 'shape' | 'ai-generate' | 'close-panel' | 'navbar-action' | 'sidebar-action' | 'emoji' | 'star' | 'love' | 'finalize' | 'speech';
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
  emojiType?: 'like' | 'love' | 'star' | 'rocket' | 'trophy';
  speechText?: string;
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
  const [finalizedIdea, setFinalizedIdea] = useState<string | null>(null);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [currentVoiceText, setCurrentVoiceText] = useState('');
  
  const demoRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const speechSynthesis = useRef<SpeechSynthesis | null>(null);

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesis.current = window.speechSynthesis;
    }
  }, []);

  const speak = (text: string) => {
    if (speechSynthesis.current) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsVoiceActive(true);
      utterance.onend = () => setIsVoiceActive(false);
      
      speechSynthesis.current.speak(utterance);
      setCurrentVoiceText(text);
    }
  };

  const demoSteps: DemoStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to MindMeld Enterprise',
      description: 'AI-Powered Collaborative Canvas for Modern Teams',
      duration: 10000,
      narration: 'Welcome to MindMeld Enterprise - the most advanced collaborative ideation platform. Watch as teams work together in real-time with AI-powered insights.',
      voiceText: 'Welcome to MindMeld Enterprise, the most advanced collaborative ideation platform for modern teams.',
      actions: [
        { type: 'speech', speechText: 'Welcome to MindMeld Enterprise, the most advanced collaborative ideation platform for modern teams.', delay: 1000 },
        { type: 'highlight', target: 'navbar', delay: 2000, duration: 2000 },
        { type: 'highlight', target: 'logo', delay: 3000, duration: 1500 },
        { type: 'cursor', position: { x: 400, y: 300 }, user: 'Sarah Chen', color: '#10B981', delay: 4000 },
        { type: 'cursor', position: { x: 600, y: 400 }, user: 'Marcus Rodriguez', color: '#F59E0B', delay: 5000 },
        { type: 'wait', delay: 3000 }
      ]
    },
    {
      id: 'navbar-exploration',
      title: 'Professional Interface Navigation',
      description: 'Exploring the comprehensive navigation and controls',
      duration: 15000,
      narration: 'Our professional interface provides comprehensive project management, search capabilities, notifications, and user controls - everything teams need for effective collaboration.',
      voiceText: 'Our professional interface provides comprehensive project management and collaboration tools.',
      actions: [
        { type: 'speech', speechText: 'Let me show you our comprehensive navigation and project management features.', delay: 500 },
        { type: 'highlight', target: 'project-selector', delay: 2000, duration: 2000 },
        { type: 'navbar-action', target: 'search', delay: 4000 },
        { type: 'type', text: 'AI features', delay: 4500 },
        { type: 'navbar-action', target: 'notifications', delay: 6500 },
        { type: 'highlight', target: 'notification-panel', delay: 7000, duration: 2000 },
        { type: 'navbar-action', target: 'user-menu', delay: 9500 },
        { type: 'highlight', target: 'user-dropdown', delay: 10000, duration: 2000 },
        { type: 'navbar-action', target: 'close-menus', delay: 12500 }
      ]
    },
    {
      id: 'sidebar-navigation',
      title: 'Advanced Project Management',
      description: 'Comprehensive sidebar navigation and session management',
      duration: 18000,
      narration: 'The sidebar provides powerful project management with recent sessions, templates, team workspaces, and starred projects. Watch how easy it is to organize and switch between different collaboration sessions.',
      voiceText: 'The sidebar provides powerful project management capabilities.',
      actions: [
        { type: 'speech', speechText: 'Now let me demonstrate our advanced project management and session organization features.', delay: 500 },
        { type: 'highlight', target: 'sidebar', delay: 2000, duration: 2000 },
        { type: 'sidebar-action', target: 'recent-sessions', delay: 4000 },
        { type: 'highlight', target: 'session-list', delay: 4500, duration: 2000 },
        { type: 'sidebar-action', target: 'templates', delay: 7000 },
        { type: 'highlight', target: 'template-grid', delay: 7500, duration: 2000 },
        { type: 'sidebar-action', target: 'starred', delay: 10000 },
        { type: 'sidebar-action', target: 'team-spaces', delay: 12000 },
        { type: 'highlight', target: 'team-workspaces', delay: 12500, duration: 2000 },
        { type: 'sidebar-action', target: 'new-session', delay: 15000 },
        { type: 'type', text: 'Innovation Workshop 2024', delay: 15500 }
      ]
    },
    {
      id: 'canvas-tools',
      title: 'Professional Canvas Tools',
      description: 'Miro-style canvas with advanced drawing and shape tools',
      duration: 22000,
      narration: 'Our professional canvas offers industry-leading tools for creating diagrams, flowcharts, and visual representations. Watch as we demonstrate the complete toolkit with real collaboration.',
      voiceText: 'Our professional canvas offers industry-leading tools for visual collaboration.',
      actions: [
        { type: 'speech', speechText: 'Watch as our team demonstrates the complete professional canvas toolkit.', delay: 500 },
        { type: 'highlight', target: 'canvas-toolbar', delay: 2000, duration: 2000 },
        { type: 'tool', toolType: 'sticky', delay: 4000 },
        { type: 'cursor', position: { x: 300, y: 250 }, user: 'Sarah Chen', color: '#10B981', delay: 4500 },
        { type: 'idea', position: { x: 300, y: 250 }, text: 'AI-powered user onboarding system', user: 'Sarah Chen', delay: 5000 },
        { type: 'tool', toolType: 'rectangle', delay: 7000 },
        { type: 'cursor', position: { x: 500, y: 200 }, user: 'Marcus Rodriguez', color: '#F59E0B', delay: 7500 },
        { type: 'shape', position: { x: 500, y: 200 }, shapeData: { width: 150, height: 100 }, delay: 8000 },
        { type: 'tool', toolType: 'text', delay: 9500 },
        { type: 'cursor', position: { x: 520, y: 230 }, user: 'Marcus Rodriguez', color: '#F59E0B', delay: 10000 },
        { type: 'type', text: 'User Journey Flow', delay: 10500 },
        { type: 'tool', toolType: 'pen', delay: 12000 },
        { type: 'cursor', position: { x: 400, y: 350 }, user: 'Emily Watson', color: '#EF4444', delay: 12500 },
        { type: 'highlight', target: 'color-palette', delay: 14000, duration: 2000 },
        { type: 'highlight', target: 'zoom-controls', delay: 16000, duration: 2000 },
        { type: 'tool', toolType: 'select', delay: 18000 }
      ]
    },
    {
      id: 'real-time-collaboration',
      title: 'Real-Time Team Collaboration',
      description: 'Multiple team members working together with emotions and reactions',
      duration: 25000,
      narration: 'Experience true real-time collaboration as team members add ideas, vote, provide feedback, and express emotions. Notice how each person has their own cursor color and can contribute without conflicts.',
      voiceText: 'Experience true real-time collaboration with live reactions and feedback.',
      actions: [
        { type: 'speech', speechText: 'Now watch real-time collaboration with live reactions and emotional feedback.', delay: 500 },
        { type: 'cursor', position: { x: 200, y: 400 }, user: 'Sarah Chen', color: '#10B981', delay: 2000 },
        { type: 'idea', position: { x: 200, y: 400 }, text: 'Mobile-first design with dark mode support', user: 'Sarah Chen', delay: 2500 },
        { type: 'cursor', position: { x: 600, y: 300 }, user: 'Marcus Rodriguez', color: '#F59E0B', delay: 4000 },
        { type: 'idea', position: { x: 600, y: 300 }, text: 'Voice-to-text functionality for accessibility', user: 'Marcus Rodriguez', delay: 4500 },
        { type: 'cursor', position: { x: 400, y: 500 }, user: 'Emily Watson', color: '#EF4444', delay: 6000 },
        { type: 'idea', position: { x: 400, y: 500 }, text: 'Advanced analytics dashboard', user: 'Emily Watson', delay: 6500 },
        { type: 'vote', target: 'idea-1', user: 'Marcus Rodriguez', delay: 8000 },
        { type: 'emoji', emojiType: 'like', position: { x: 320, y: 270 }, user: 'Marcus Rodriguez', delay: 8500 },
        { type: 'vote', target: 'idea-1', user: 'Emily Watson', delay: 9000 },
        { type: 'emoji', emojiType: 'love', position: { x: 340, y: 270 }, user: 'Emily Watson', delay: 9500 },
        { type: 'vote', target: 'idea-2', user: 'Sarah Chen', delay: 10000 },
        { type: 'star', target: 'idea-2', user: 'Sarah Chen', delay: 10500 },
        { type: 'vote', target: 'idea-3', user: 'Sarah Chen', delay: 11000 },
        { type: 'vote', target: 'idea-2', user: 'Emily Watson', delay: 11500 },
        { type: 'comment', position: { x: 220, y: 420 }, text: 'This aligns perfectly with our Q4 goals! 🎯', user: 'Marcus Rodriguez', delay: 12500 },
        { type: 'comment', position: { x: 620, y: 320 }, text: 'Great accessibility focus! ♿', user: 'Sarah Chen', delay: 13500 },
        { type: 'emoji', emojiType: 'rocket', position: { x: 420, y: 520 }, user: 'Team Lead', delay: 14500 },
        { type: 'panel', panelType: 'collaborators', delay: 16000 },
        { type: 'highlight', target: 'collaborator-panel', delay: 16500, duration: 3000 },
        { type: 'highlight', target: 'online-users', delay: 19500, duration: 2000 },
        { type: 'close-panel', panelType: 'collaborators', delay: 22000 }
      ]
    },
    {
      id: 'ai-insights-generation',
      title: 'AI-Powered Insights & Analysis',
      description: 'Advanced AI analysis with comprehensive insights and recommendations',
      duration: 30000,
      narration: 'Watch our advanced AI analyze all ideas and generate powerful insights, identifying themes, contradictions, breakthrough opportunities, and providing strategic recommendations with confidence metrics.',
      voiceText: 'Our advanced AI will now analyze all ideas and generate powerful strategic insights.',
      actions: [
        { type: 'speech', speechText: 'Now watch our advanced AI analyze all ideas and generate powerful strategic insights.', delay: 1000 },
        { type: 'panel', panelType: 'ai', delay: 2000 },
        { type: 'highlight', target: 'ai-panel', delay: 2500, duration: 2000 },
        { type: 'cursor', position: { x: 1200, y: 300 }, user: 'AI Assistant', color: '#8B5CF6', delay: 4500 },
        { type: 'ai-generate', target: 'generate-insights', delay: 5000 },
        { type: 'highlight', target: 'ai-processing', delay: 5500, duration: 4000 },
        { type: 'speech', speechText: 'The AI is processing themes, contradictions, and breakthrough opportunities.', delay: 6000 },
        { type: 'highlight', target: 'ai-confidence', delay: 10000, duration: 2000 },
        { type: 'highlight', target: 'ai-themes', delay: 12500, duration: 2000 },
        { type: 'highlight', target: 'ai-contradictions', delay: 15000, duration: 2000 },
        { type: 'highlight', target: 'ai-breakthrough', delay: 17500, duration: 3000 },
        { type: 'click', target: 'analytics-tab', delay: 21000 },
        { type: 'highlight', target: 'priority-matrix', delay: 21500, duration: 2000 },
        { type: 'click', target: 'recommendations-tab', delay: 24000 },
        { type: 'highlight', target: 'strategic-recommendations', delay: 24500, duration: 2000 },
        { type: 'click', target: 'collaboration-tab', delay: 27000 },
        { type: 'highlight', target: 'team-metrics', delay: 27500, duration: 2000 }
      ]
    },
    {
      id: 'idea-validation-finalization',
      title: 'Idea Validation & Decision Finalization',
      description: 'Complete workflow from ideation to final decision with team consensus',
      duration: 25000,
      narration: 'See the complete workflow as ideas are validated, refined, and finalized through team collaboration, AI recommendations, and consensus building. This is how breakthrough decisions are made.',
      voiceText: 'Watch the complete workflow from ideation to final decision making.',
      actions: [
        { type: 'speech', speechText: 'Now watch the complete workflow from ideation to final decision making with team consensus.', delay: 500 },
        { type: 'highlight', target: 'top-voted-idea', delay: 2000, duration: 3000 },
        { type: 'cursor', position: { x: 320, y: 270 }, user: 'Sarah Chen', color: '#10B981', delay: 5000 },
        { type: 'comment', position: { x: 340, y: 290 }, text: 'Based on AI analysis, this should be our priority! 🚀', user: 'Sarah Chen', delay: 5500 },
        { type: 'vote', target: 'idea-1', user: 'Team Lead', delay: 6500 },
        { type: 'vote', target: 'idea-1', user: 'Product Manager', delay: 7000 },
        { type: 'vote', target: 'idea-1', user: 'CTO', delay: 7500 },
        { type: 'emoji', emojiType: 'trophy', position: { x: 360, y: 270 }, user: 'Team Lead', delay: 8000 },
        { type: 'finalize', target: 'idea-1', delay: 8500 },
        { type: 'highlight', target: 'idea-finalized', delay: 9000, duration: 3000 },
        { type: 'speech', speechText: 'The team has reached consensus. The idea is now finalized.', delay: 9500 },
        { type: 'cursor', position: { x: 700, y: 200 }, user: 'Marcus Rodriguez', color: '#F59E0B', delay: 12500 },
        { type: 'shape', position: { x: 700, y: 200 }, shapeData: { width: 250, height: 80 }, delay: 13000 },
        { type: 'type', text: '✅ FINAL DECISION: AI-Powered Onboarding', delay: 13500 },
        { type: 'highlight', target: 'decision-box', delay: 14000, duration: 3000 },
        { type: 'navbar-action', target: 'save', delay: 17500 },
        { type: 'highlight', target: 'auto-save', delay: 18000, duration: 2000 },
        { type: 'navbar-action', target: 'export', delay: 20500 },
        { type: 'highlight', target: 'export-options', delay: 21000, duration: 2000 },
        { type: 'navbar-action', target: 'share', delay: 23500 }
      ]
    },
    {
      id: 'session-management-advanced',
      title: 'Advanced Session & Project Management',
      description: 'Creating new sessions, switching projects, and template usage',
      duration: 20000,
      narration: 'Manage multiple projects effortlessly with our advanced session management. Create new sessions, switch between projects, access templates, and organize your team\'s work across different initiatives.',
      voiceText: 'Manage multiple projects effortlessly with advanced session management.',
      actions: [
        { type: 'speech', speechText: 'Let me demonstrate our advanced session and project management capabilities.', delay: 1000 },
        { type: 'highlight', target: 'session-selector', delay: 2500, duration: 2000 },
        { type: 'cursor', position: { x: 300, y: 60 }, user: 'Sarah Chen', color: '#10B981', delay: 4500 },
        { type: 'click', target: 'session-dropdown', delay: 5000 },
        { type: 'highlight', target: 'session-list', delay: 5500, duration: 2000 },
        { type: 'session', target: 'design-sprint-session', delay: 8000 },
        { type: 'highlight', target: 'session-switched', delay: 8500, duration: 2000 },
        { type: 'speech', speechText: 'Seamlessly switching between different project sessions.', delay: 9000 },
        { type: 'sidebar-action', target: 'new-session', delay: 11500 },
        { type: 'highlight', target: 'new-session-modal', delay: 12000, duration: 2000 },
        { type: 'type', text: 'Customer Journey Workshop', delay: 14500 },
        { type: 'click', target: 'template-select', delay: 15500 },
        { type: 'highlight', target: 'template-options', delay: 16000, duration: 2000 },
        { type: 'click', target: 'create-session', delay: 18500 }
      ]
    },
    {
      id: 'advanced-features-showcase',
      title: 'Advanced Features & Professional Tools',
      description: 'Exploring mini-map, layers, properties, comments, and export options',
      duration: 22000,
      narration: 'Discover advanced professional features including mini-map navigation, layer management, property panels, comprehensive comment systems, and professional export options for presentations and documentation.',
      voiceText: 'Discover our advanced professional features and export capabilities.',
      actions: [
        { type: 'speech', speechText: 'Now let me showcase our advanced professional features and capabilities.', delay: 1000 },
        { type: 'panel', panelType: 'minimap', delay: 2500 },
        { type: 'highlight', target: 'minimap', delay: 3000, duration: 2000 },
        { type: 'panel', panelType: 'layers', delay: 5500 },
        { type: 'highlight', target: 'layer-panel', delay: 6000, duration: 2000 },
        { type: 'close-panel', panelType: 'layers', delay: 8500 },
        { type: 'panel', panelType: 'properties', delay: 9500 },
        { type: 'highlight', target: 'property-panel', delay: 10000, duration: 2000 },
        { type: 'close-panel', panelType: 'properties', delay: 12500 },
        { type: 'panel', panelType: 'comments', delay: 13500 },
        { type: 'highlight', target: 'comment-system', delay: 14000, duration: 2000 },
        { type: 'close-panel', panelType: 'comments', delay: 16500 },
        { type: 'highlight', target: 'canvas-settings', delay: 17500, duration: 2000 },
        { type: 'speech', speechText: 'All features work seamlessly together for professional collaboration.', delay: 18000 },
        { type: 'highlight', target: 'export-share-options', delay: 20000, duration: 2000 }
      ]
    },
    {
      id: 'demo-complete',
      title: 'Demo Complete - Ready for Production',
      description: 'MindMeld Enterprise: Where teams think together and decide smarter',
      duration: 12000,
      narration: 'Thank you for experiencing MindMeld Enterprise - the complete solution for collaborative ideation, AI-powered insights, and team decision-making. Ready to transform your collaboration and win with your team?',
      voiceText: 'Thank you for experiencing MindMeld Enterprise. Ready to transform your collaboration?',
      actions: [
        { type: 'speech', speechText: 'Thank you for experiencing MindMeld Enterprise. Ready to transform your team collaboration?', delay: 1000 },
        { type: 'close-panel', panelType: 'ai', delay: 2000 },
        { type: 'highlight', target: 'entire-app', delay: 3000, duration: 4000 },
        { type: 'cursor', position: { x: 400, y: 300 }, user: 'Demo Complete', color: '#8B5CF6', delay: 7000 },
        { type: 'emoji', emojiType: 'trophy', position: { x: 400, y: 320 }, user: 'Demo Complete', delay: 7500 },
        { type: 'speech', speechText: 'MindMeld Enterprise - where teams think together and decide smarter.', delay: 8000 },
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
      case 'speech':
        if (action.speechText) {
          speak(action.speechText);
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
          setDemoIdeas(prev => [...prev, {
            id: `auto-idea-${Date.now()}`,
            text: action.text,
            position: action.position,
            author: action.user,
            votes: 0,
            timestamp: new Date(),
            isFinalized: false,
            reactions: []
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
            timestamp: new Date(),
            content: ''
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

      case 'emoji':
        if (action.emojiType && action.position && action.user) {
          setDemoIdeas(prev => prev.map(idea => {
            if (idea.position.x <= action.position!.x + 50 && idea.position.x >= action.position!.x - 50) {
              return {
                ...idea,
                reactions: [...(idea.reactions || []), {
                  type: action.emojiType,
                  user: action.user,
                  timestamp: new Date()
                }]
              };
            }
            return idea;
          }));
        }
        break;

      case 'star':
        setDemoIdeas(prev => prev.map(idea => 
          idea.id === action.target || idea.text.includes('Voice-to-text')
            ? { ...idea, isStarred: true }
            : idea
        ));
        break;

      case 'finalize':
        setDemoIdeas(prev => prev.map(idea => 
          idea.id === action.target || idea.text.includes('AI-powered')
            ? { ...idea, isFinalized: true }
            : idea
        ));
        setFinalizedIdea(action.target || 'AI-powered');
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
              'Accessibility & Inclusive Design (34% of ideas)',
              'Performance & Scalability (28% of ideas)',
              'Data Analytics & Insights (22% of ideas)'
            ],
            contradictions: [
              'Complexity vs. Simplicity: Advanced AI features vs. simple user interface',
              'Speed vs. Accuracy: Real-time features vs. thorough analysis',
              'Privacy vs. Collaboration: Enhanced sharing vs. data security'
            ],
            breakthrough: 'Create an adaptive AI-powered onboarding system that learns from user behavior and progressively reveals advanced features based on user expertise and needs. This addresses both novice and power user requirements while maintaining performance.',
            confidence: 0.94,
            sentiment: 'positive',
            patterns: [
              'Ideas cluster around user empowerment and automation',
              'Strong focus on reducing cognitive load',
              'Emphasis on visual and intuitive interfaces',
              'Recurring theme of intelligent assistance'
            ],
            recommendations: [
              'Prioritize AI-powered user onboarding as the foundation feature',
              'Implement progressive disclosure for advanced features',
              'Focus on accessibility from the ground up',
              'Build comprehensive analytics for user behavior insights',
              'Create modular architecture for scalable feature addition'
            ],
            priorityMatrix: [
              { idea: 'AI-powered user onboarding', impact: 9, effort: 6 },
              { idea: 'Real-time collaboration features', impact: 8, effort: 8 },
              { idea: 'Mobile-first design system', impact: 7, effort: 4 },
              { idea: 'Advanced analytics dashboard', impact: 6, effort: 7 },
              { idea: 'Voice-to-text functionality', impact: 5, effort: 5 }
            ],
            collaborationMetrics: {
              participationRate: 0.89,
              ideaDiversity: 0.76,
              consensusLevel: 0.72
            },
            nextSteps: [
              'Conduct user interviews to validate AI onboarding concept',
              'Create wireframes for adaptive interface design',
              'Prototype real-time collaboration features',
              'Develop technical architecture for modular system',
              'Plan MVP roadmap with phased feature rollout'
            ]
          });
        }, 4000);
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
            { id: 2, text: 'AI insights ready for review', time: '5 min ago', unread: true },
            { id: 3, text: 'Marcus voted on your idea', time: '10 min ago', unread: false }
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
    if (speechSynthesis.current) {
      if (isPlaying) {
        speechSynthesis.current.pause();
      } else {
        speechSynthesis.current.resume();
      }
    }
  };

  const nextStep = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setProgress(0);
      if (speechSynthesis.current) {
        speechSynthesis.current.cancel();
      }
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
    setFinalizedIdea(null);
    if (speechSynthesis.current) {
      speechSynthesis.current.cancel();
    }
    setIsVoiceActive(false);
    setCurrentVoiceText('');
  };

  const currentStepData = demoSteps[currentStep];

  return (
    <div ref={demoRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 9999 }}>
      {/* Demo Controls - Highest Z-Index */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 pointer-events-auto" style={{ zIndex: 10000 }}>
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-black/95 backdrop-blur-sm text-white rounded-xl p-4 shadow-2xl border border-white/20 max-w-2xl"
        >
          <div className="flex items-center space-x-4 mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">LIVE DEMO</span>
              {isVoiceActive && (
                <div className="flex items-center space-x-1">
                  <Mic className="w-3 h-3 text-green-400 animate-pulse" />
                  <span className="text-xs text-green-400">Speaking</span>
                </div>
              )}
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
              <button
                onClick={() => {
                  if (speechSynthesis.current) {
                    if (isVoiceActive) {
                      speechSynthesis.current.cancel();
                    }
                  }
                }}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                {isVoiceActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
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

      {/* Voice Narration Box */}
      {showNarration && currentNarration && (
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="absolute bottom-4 left-4 max-w-md bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-200 pointer-events-auto"
          style={{ zIndex: 9998 }}
        >
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              {isVoiceActive ? (
                <Mic className="w-5 h-5 text-blue-600 animate-pulse" />
              ) : (
                <Volume2 className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1 flex items-center">
                Demo Narration
                {isVoiceActive && (
                  <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                    🎤 Speaking
                  </span>
                )}
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">{currentNarration}</p>
              {currentVoiceText && (
                <p className="text-xs text-blue-600 mt-2 italic">"{currentVoiceText}"</p>
              )}
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

      {/* Auto-generated Ideas with Reactions */}
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
            <div className={`w-64 rounded-xl p-4 shadow-lg border-2 transition-all ${
              idea.isFinalized 
                ? 'bg-gradient-to-br from-green-100 to-green-200 border-green-400 ring-2 ring-green-300' 
                : idea.isStarred
                ? 'bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-400'
                : 'bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-800">{idea.author}</span>
                <div className="flex items-center space-x-1">
                  {idea.isStarred && <Star className="w-3 h-3 text-yellow-600 fill-current" />}
                  <div className="flex items-center space-x-1 bg-white/70 px-2 py-1 rounded-full">
                    <TrendingUp className="w-3 h-3 text-blue-700" />
                    <span className="text-xs font-bold text-blue-700">{idea.votes}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-900 mb-2">{idea.text}</p>
              
              {/* Reactions */}
              {idea.reactions && idea.reactions.length > 0 && (
                <div className="flex items-center space-x-1 mb-2">
                  {idea.reactions.map((reaction: any, index: number) => (
                    <span key={index} className="text-sm">
                      {reaction.type === 'like' && '👍'}
                      {reaction.type === 'love' && '❤️'}
                      {reaction.type === 'star' && '⭐'}
                      {reaction.type === 'rocket' && '🚀'}
                      {reaction.type === 'trophy' && '🏆'}
                    </span>
                  ))}
                </div>
              )}
              
              {idea.isFinalized && (
                <div className="mt-2 flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-medium text-green-600">✅ FINALIZED DECISION</span>
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
            className="absolute pointer-events-none border-2 border-blue-500 bg-blue-100 rounded-lg flex items-center justify-center shadow-lg"
            style={{
              left: shape.position.x,
              top: shape.position.y,
              width: shape.size.width,
              height: shape.size.height,
              zIndex: 9994
            }}
          >
            <span className="text-sm font-medium text-blue-800">
              {shape.content || 'User Journey Flow'}
            </span>
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
          <div className="absolute inset-0 border-4 border-blue-500 rounded-lg animate-pulse shadow-lg" />
          <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full animate-ping" />
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
          <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 rounded-full animate-ping" style={{ animationDelay: '1.5s' }} />
        </motion.div>
      )}

      {/* AI Insights Display */}
      {aiInsights && openPanels.has('ai') && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          className="absolute right-4 top-20 w-96 bg-white rounded-lg shadow-xl border border-gray-200 p-6 max-h-[80vh] overflow-y-auto"
          style={{ zIndex: 9992 }}
        >
          <div className="flex items-center space-x-2 mb-4">
            <Brain className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">AI Insights Generated</h3>
            <div className="ml-auto px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
              {Math.round(aiInsights.confidence * 100)}% Confidence
            </div>
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
              <h4 className="font-semibold text-orange-800 mb-2">⚠️ Contradictions:</h4>
              <ul className="space-y-1">
                {aiInsights.contradictions.map((contradiction: string, index: number) => (
                  <li key={index} className="text-sm text-orange-700 ml-4">• {contradiction}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-green-800 mb-2">🚀 Breakthrough Insight:</h4>
              <p className="text-sm text-green-700 italic bg-green-50 p-3 rounded-lg">"{aiInsights.breakthrough}"</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">📊 Priority Matrix:</h4>
              <div className="space-y-2">
                {aiInsights.priorityMatrix.slice(0, 3).map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                    <span className="text-sm font-medium">{item.idea}</span>
                    <div className="flex space-x-2">
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">Impact: {item.impact}</span>
                      <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">Effort: {item.effort}</span>
                    </div>
                  </div>
                ))}
              </div>
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
        {currentStep === 4 && (
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
              Multiple team members working simultaneously with live reactions and emotional feedback.
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
              Advanced AI analyzes all ideas with 94% confidence to identify themes, contradictions, and breakthrough opportunities.
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
          <div className="bg-white rounded-2xl p-8 max-w-lg text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">🎉 Demo Complete!</h2>
            <p className="text-gray-600 mb-6">
              You've experienced the full power of MindMeld Enterprise with AI insights, real-time collaboration, and professional decision-making tools. Ready to transform your team's collaboration?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={resetDemo}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                🔄 Watch Again
              </button>
              <button
                onClick={onDemoComplete}
                className="flex-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
              >
                🚀 Get Started Now
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              🏆 Perfect for winning judge presentations and investor demos
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};