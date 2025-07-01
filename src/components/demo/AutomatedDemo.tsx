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
  type: 'cursor' | 'click' | 'type' | 'highlight' | 'panel' | 'wait' | 'idea' | 'vote' | 'comment' | 'session' | 'close-panel' | 'emoji' | 'ai-prompt' | 'mermaid-chart' | 'sidebar-click' | 'search' | 'new-session' | 'canvas-action' | 'ai-insights' | 'ai-team-comment' | 'cleanup';
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
  const [showDecisionPopup, setShowDecisionPopup] = useState(false);
  
  const demoRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Calculate proper canvas center
  const getCanvasCenter = () => {
    const sidebarWidth = 320;
    const navbarHeight = 64;
    const statusBarHeight = 32;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    const canvasWidth = windowWidth - sidebarWidth;
    const canvasHeight = windowHeight - navbarHeight - statusBarHeight;
    
    return {
      x: sidebarWidth + (canvasWidth / 2),
      y: navbarHeight + (canvasHeight / 2)
    };
  };

  const demoSteps: DemoStep[] = [
    {
      id: 'startup-intro',
      title: '🚀 MindMeld Enterprise - AI Collaboration Platform',
      description: 'Professional startup introduction with initial strategy diagram',
      duration: 8000,
      narration: 'Welcome to MindMeld Enterprise - the revolutionary AI-powered collaboration platform that transforms how teams ideate and make decisions.',
      actions: [
        { type: 'highlight', target: 'navbar', delay: 500, duration: 1500 },
        { type: 'canvas-action', target: 'create-strategy-diagram', delay: 2000 },
        { type: 'cursor', position: { x: 400, y: 300 }, user: 'Sarah Chen', color: '#10B981', delay: 5500 },
        { type: 'cursor', position: { x: 600, y: 400 }, user: 'Marcus Rodriguez', color: '#F59E0B', delay: 6000 },
        { type: 'cleanup', target: 'cursors', delay: 7500 }
      ]
    },
    {
      id: 'sidebar-exploration',
      title: '📂 Complete Sidebar Navigation',
      description: 'Exploring sidebar sections with AI assistance',
      duration: 10000,
      narration: 'Let me show you our comprehensive sidebar navigation. Each section contains powerful features for different aspects of collaboration.',
      actions: [
        { type: 'sidebar-click', target: 'current-session', delay: 500, duration: 1000 },
        { type: 'sidebar-click', target: 'recent-sessions', delay: 2000, duration: 1000 },
        { type: 'search', text: 'Product Strategy', delay: 3500 },
        { type: 'ai-team-comment', position: { x: 500, y: 200 }, text: 'I found 3 relevant sessions matching your search criteria.', user: 'AI Assistant', delay: 4000 },
        { type: 'sidebar-click', target: 'templates', delay: 6500, duration: 1000 },
        { type: 'cleanup', target: 'all', delay: 9500 }
      ]
    },
    {
      id: 'new-session-creation',
      title: '🎯 New Session Creation & Canvas',
      description: 'Creating a new session with AI Innovation diagram',
      duration: 8000,
      narration: 'Now I will create a new collaboration session. Watch as we set up a fresh workspace for our team.',
      actions: [
        { type: 'new-session', delay: 500 },
        { type: 'type', text: 'AI Innovation Workshop 2024', delay: 2000 },
        { type: 'click', target: 'create-session-btn', delay: 3500 },
        { type: 'canvas-action', target: 'create-innovation-diagram', delay: 5000 },
        { type: 'cleanup', target: 'modals', delay: 7500 }
      ]
    },
    {
      id: 'canvas-collaboration',
      title: '🎨 Advanced Canvas Collaboration',
      description: 'Professional canvas tools with team interaction',
      duration: 12000,
      narration: 'Our professional canvas supports real-time collaboration with advanced drawing tools, shapes, and smart connections.',
      actions: [
        { type: 'canvas-action', target: 'create-rectangle', position: { x: 300, y: 200 }, delay: 500 },
        { type: 'canvas-action', target: 'add-text', text: 'User Research', position: { x: 300, y: 200 }, delay: 1500 },
        { type: 'cursor', position: { x: 500, y: 300 }, user: 'Sarah Chen', color: '#10B981', delay: 2500 },
        { type: 'canvas-action', target: 'create-circle', position: { x: 500, y: 300 }, delay: 3000 },
        { type: 'canvas-action', target: 'add-text', text: 'AI Analysis', position: { x: 500, y: 300 }, delay: 3500 },
        { type: 'cursor', position: { x: 700, y: 250 }, user: 'Marcus Rodriguez', color: '#F59E0B', delay: 6000 },
        { type: 'canvas-action', target: 'create-diamond', position: { x: 700, y: 250 }, delay: 6500 },
        { type: 'canvas-action', target: 'add-text', text: 'Decision', position: { x: 700, y: 250 }, delay: 7000 },
        { type: 'canvas-action', target: 'connect-shapes', delay: 8500 },
        { type: 'cleanup', target: 'cursors', delay: 11500 }
      ]
    },
    {
      id: 'collaboration-panel',
      title: '👥 Team Collaboration with Voting & Reactions',
      description: 'Collaboration panel with voting, comments, and emoji reactions',
      duration: 12000,
      narration: 'Our collaboration panel enables rich team interaction with voting, emoji reactions, real-time chat, and comprehensive team management.',
      actions: [
        { type: 'panel', target: 'collaboration-panel', delay: 500 },
        { type: 'idea', position: { x: 200, y: 150 }, text: 'Implement AI-powered user onboarding', user: 'Sarah Chen', delay: 1500 },
        { type: 'vote', target: 'idea-1', user: 'Marcus Rodriguez', delay: 2500 },
        { type: 'vote', target: 'idea-1', user: 'Emily Watson', delay: 3000 },
        { type: 'emoji', emoji: '👍', position: { x: 250, y: 150 }, user: 'Emily Watson', delay: 3500 },
        { type: 'idea', position: { x: 450, y: 200 }, text: 'Mobile-first design system', user: 'Emily Watson', delay: 5000 },
        { type: 'vote', target: 'idea-2', user: 'Sarah Chen', delay: 5500 },
        { type: 'ai-team-comment', position: { x: 200, y: 180 }, text: 'Based on user data, AI onboarding could increase retention by 40%.', user: 'AI Assistant', delay: 7000 },
        { type: 'emoji', emoji: '🚀', position: { x: 500, y: 200 }, user: 'Marcus Rodriguez', delay: 8500 },
        { type: 'cleanup', target: 'emojis', delay: 11500 }
      ]
    },
    {
      id: 'ai-insights-complete',
      title: '🧠 Complete AI Analysis & Team AI Insights',
      description: 'AI analysis and comprehensive reports',
      duration: 14000,
      narration: 'Watch our advanced AI system analyze all ideas, generate comprehensive insights, and participate as a team member with intelligent suggestions.',
      actions: [
        { type: 'close-panel', target: 'collaboration-panel', delay: 500 },
        { type: 'panel', target: 'ai-panel', delay: 1000 },
        { type: 'click', target: 'generate-insights', delay: 2000 },
        { type: 'wait', delay: 3000 },
        { type: 'ai-insights', delay: 5000 },
        { type: 'highlight', target: 'ai-themes', delay: 6000, duration: 1500 },
        { type: 'ai-team-comment', position: { x: 350, y: 400 }, text: 'I recommend prioritizing the AI onboarding feature - 89% confidence based on market analysis.', user: 'AI Assistant', delay: 9000 },
        { type: 'highlight', target: 'ai-recommendations', delay: 11000, duration: 1500 },
        { type: 'cleanup', target: 'highlights', delay: 13500 }
      ]
    },
    {
      id: 'decision-finalization',
      title: '✅ Decision Finalization & Export',
      description: 'Complete workflow to final decision with export options',
      duration: 8000,
      narration: 'Finally, we finalize our decisions based on team consensus and AI insights, then export our collaborative session for stakeholders.',
      actions: [
        { type: 'cursor', position: { x: 200, y: 150 }, user: 'Project Manager', color: '#8B5CF6', delay: 500 },
        { type: 'click', target: 'approve-idea', delay: 1500 },
        { type: 'canvas-action', target: 'finalize-decision', delay: 2000 },
        { type: 'close-panel', target: 'ai-panel', delay: 4000 },
        { type: 'highlight', target: 'export-button', delay: 5000, duration: 1500 },
        { type: 'cleanup', target: 'all', delay: 7500 }
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

  // Demo progression logic
  useEffect(() => {
    if (!isPlaying) return;

    const currentStepData = demoSteps[currentStep];
    if (!currentStepData) {
      setIsPlaying(false);
      if (onDemoComplete) {
        setTimeout(() => onDemoComplete(), 100);
      }
      return;
    }

    setCurrentNarration(currentStepData.narration);
    
    // Voice narration
    if (voiceEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentStepData.narration);
      utterance.rate = 1.1;
      utterance.pitch = 1.2;
      utterance.volume = 0.9;
      speechRef.current = utterance;
      speechSynthesis.speak(utterance);
    }

    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (currentStepData.duration / 80));
        
        if (newProgress >= 100) {
          if (currentStep < demoSteps.length - 1) {
            setCurrentStep(prev => prev + 1);
            return 0;
          } else {
            setIsPlaying(false);
            if (onDemoComplete) {
              setTimeout(() => onDemoComplete(), 100);
            }
            return 100;
          }
        }
        
        return newProgress;
      });
    }, 80);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (speechRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, [isPlaying, currentStep, onDemoComplete, voiceEnabled]);

  // Execute demo actions
  useEffect(() => {
    if (!isPlaying) return;

    const currentStepData = demoSteps[currentStep];
    if (!currentStepData) return;

    currentStepData.actions.forEach((action, index) => {
      setTimeout(() => {
        executeAction(action);
      }, action.delay || index * 800);
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
          const emojiId = `emoji-${Date.now()}`;
          setEmojiReactions(prev => [...prev, {
            id: emojiId,
            emoji: action.emoji,
            position: action.position,
            user: action.user,
            timestamp: new Date()
          }]);
          
          // Remove emoji after 3 seconds
          setTimeout(() => {
            setEmojiReactions(prev => prev.filter(e => e.id !== emojiId));
          }, 3000);
        }
        break;

      case 'comment':
      case 'ai-team-comment':
        if (action.position && action.text && action.user) {
          const commentId = `comment-${Date.now()}`;
          setDemoComments(prev => [...prev, {
            id: commentId,
            text: action.text,
            position: action.position,
            author: action.user,
            timestamp: new Date(),
            isAI: action.type === 'ai-team-comment'
          }]);
          
          // Remove comment after 4 seconds
          setTimeout(() => {
            setDemoComments(prev => prev.filter(c => c.id !== commentId));
          }, 4000);
        }
        break;

      case 'canvas-action':
        const center = getCanvasCenter();
        
        if (action.target === 'create-strategy-diagram') {
          // Create Product Strategy Diagram with connections
          const strategyShapes = [
            // Main boxes
            { id: 'strategy-1', type: 'rectangle', position: { x: center.x - 200, y: center.y - 100 }, text: 'Market Analysis', color: '#3B82F6', width: 120, height: 60 },
            { id: 'strategy-2', type: 'rectangle', position: { x: center.x - 50, y: center.y - 100 }, text: 'User Research', color: '#10B981', width: 120, height: 60 },
            { id: 'strategy-3', type: 'rectangle', position: { x: center.x + 100, y: center.y - 100 }, text: 'Competitive Analysis', color: '#F59E0B', width: 120, height: 60 },
            { id: 'strategy-4', type: 'rectangle', position: { x: center.x - 200, y: center.y + 50 }, text: 'Product Vision', color: '#EF4444', width: 120, height: 60 },
            { id: 'strategy-5', type: 'rectangle', position: { x: center.x - 50, y: center.y + 50 }, text: 'Roadmap Planning', color: '#8B5CF6', width: 120, height: 60 },
            { id: 'strategy-6', type: 'rectangle', position: { x: center.x + 100, y: center.y + 50 }, text: 'Success Metrics', color: '#06B6D4', width: 120, height: 60 },
            // Horizontal connections
            { id: 'line-h1', type: 'line', startPos: { x: center.x - 80, y: center.y - 70 }, endPos: { x: center.x - 50, y: center.y - 70 }, color: '#6B7280' },
            { id: 'line-h2', type: 'line', startPos: { x: center.x + 70, y: center.y - 70 }, endPos: { x: center.x + 100, y: center.y - 70 }, color: '#6B7280' },
            { id: 'line-h3', type: 'line', startPos: { x: center.x - 80, y: center.y + 80 }, endPos: { x: center.x - 50, y: center.y + 80 }, color: '#6B7280' },
            { id: 'line-h4', type: 'line', startPos: { x: center.x + 70, y: center.y + 80 }, endPos: { x: center.x + 100, y: center.y + 80 }, color: '#6B7280' },
            // Vertical connections
            { id: 'line-v1', type: 'line', startPos: { x: center.x - 140, y: center.y - 40 }, endPos: { x: center.x - 140, y: center.y + 50 }, color: '#6B7280' },
            { id: 'line-v2', type: 'line', startPos: { x: center.x + 10, y: center.y - 40 }, endPos: { x: center.x + 10, y: center.y + 50 }, color: '#6B7280' },
            { id: 'line-v3', type: 'line', startPos: { x: center.x + 160, y: center.y - 40 }, endPos: { x: center.x + 160, y: center.y + 50 }, color: '#6B7280' }
          ];
          setCanvasShapes(strategyShapes);
        } else if (action.target === 'create-innovation-diagram') {
          // Clear previous diagram and create AI Innovation Hub with connections
          setCanvasShapes([]);
          setTimeout(() => {
            const innovationShapes = [
              // Central AI Hub
              { id: 'ai-hub', type: 'circle', position: { x: center.x - 50, y: center.y - 50 }, text: 'AI Core', color: '#8B5CF6', width: 100, height: 100 },
              // Surrounding innovation areas
              { id: 'innovation-1', type: 'rectangle', position: { x: center.x - 250, y: center.y - 150 }, text: 'Machine Learning', color: '#3B82F6', width: 120, height: 60 },
              { id: 'innovation-2', type: 'rectangle', position: { x: center.x + 100, y: center.y - 150 }, text: 'Natural Language', color: '#10B981', width: 120, height: 60 },
              { id: 'innovation-3', type: 'rectangle', position: { x: center.x - 250, y: center.y + 50 }, text: 'Computer Vision', color: '#F59E0B', width: 120, height: 60 },
              { id: 'innovation-4', type: 'rectangle', position: { x: center.x + 100, y: center.y + 50 }, text: 'Predictive Analytics', color: '#EF4444', width: 120, height: 60 },
              // Connection lines to hub
              { id: 'hub-line-1', type: 'line', startPos: { x: center.x - 130, y: center.y - 120 }, endPos: { x: center.x - 30, y: center.y - 30 }, color: '#8B5CF6' },
              { id: 'hub-line-2', type: 'line', startPos: { x: center.x + 120, y: center.y - 120 }, endPos: { x: center.x + 30, y: center.y - 30 }, color: '#8B5CF6' },
              { id: 'hub-line-3', type: 'line', startPos: { x: center.x - 130, y: center.y + 80 }, endPos: { x: center.x - 30, y: center.y + 30 }, color: '#8B5CF6' },
              { id: 'hub-line-4', type: 'line', startPos: { x: center.x + 120, y: center.y + 80 }, endPos: { x: center.x + 30, y: center.y + 30 }, color: '#8B5CF6' }
            ];
            setCanvasShapes(innovationShapes);
          }, 500);
        } else if (action.target === 'create-rectangle' && action.position) {
          setCanvasShapes(prev => [...prev, {
            id: `shape-${Date.now()}`,
            type: 'rectangle',
            position: action.position,
            text: '',
            color: '#3B82F6',
            width: 120,
            height: 60
          }]);
        } else if (action.target === 'create-circle' && action.position) {
          setCanvasShapes(prev => [...prev, {
            id: `shape-${Date.now()}`,
            type: 'circle',
            position: action.position,
            text: '',
            color: '#10B981',
            width: 80,
            height: 80
          }]);
        } else if (action.target === 'create-diamond' && action.position) {
          setCanvasShapes(prev => [...prev, {
            id: `shape-${Date.now()}`,
            type: 'diamond',
            position: action.position,
            text: '',
            color: '#F59E0B',
            width: 80,
            height: 80
          }]);
        } else if (action.target === 'add-text' && action.text && action.position) {
          setCanvasShapes(prev => prev.map(shape => 
            shape.position && shape.position.x === action.position?.x && shape.position.y === action.position?.y
              ? { ...shape, text: action.text }
              : shape
          ));
        } else if (action.target === 'connect-shapes') {
          // Add connecting lines between the created shapes
          setCanvasShapes(prev => [...prev, 
            {
              id: `connector-1-${Date.now()}`,
              type: 'line',
              startPos: { x: 420, y: 230 },
              endPos: { x: 500, y: 330 },
              color: '#6B7280'
            },
            {
              id: `connector-2-${Date.now()}`,
              type: 'line',
              startPos: { x: 580, y: 330 },
              endPos: { x: 700, y: 280 },
              color: '#6B7280'
            }
          ]);
        } else if (action.target === 'finalize-decision') {
          // Highlight the top idea as approved
          setAutoIdeas(prev => prev.map((idea, index) => 
            index === 0 ? { ...idea, approved: true } : idea
          ));
          setShowDecisionPopup(true);
          setTimeout(() => setShowDecisionPopup(false), 3000);
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

      case 'ai-insights':
        setAiInsightsData({
          themes: [
            'User Experience & Interface Design (45% of ideas)',
            'AI & Machine Learning Integration (32% of ideas)',
            'Performance & Scalability (28% of ideas)'
          ],
          contradictions: [
            'Simplicity vs. Advanced Features: Some ideas favor minimal UI while others suggest comprehensive toolsets'
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
          setSidebarContent(null);
        }, action.duration || 1000);
        break;

      case 'search':
        if (action.text) {
          setSearchResults([
            { name: 'Product Strategy Session', type: 'session', participants: 8 },
            { name: 'Design Sprint Workshop', type: 'session', participants: 12 },
            { name: 'User Journey Mapping', type: 'session', participants: 6 }
          ]);
          setTimeout(() => setSearchResults([]), 2000);
        }
        break;

      case 'new-session':
        setNewSessionModal(true);
        setTimeout(() => setNewSessionModal(false), 3000);
        break;

      case 'highlight':
        setHighlightedElement(action.target || null);
        setTimeout(() => setHighlightedElement(null), action.duration || 1500);
        break;

      case 'cleanup':
        // Clean up elements based on target
        if (action.target === 'cursors') {
          setCursors([]);
        } else if (action.target === 'emojis') {
          setEmojiReactions([]);
        } else if (action.target === 'comments') {
          setDemoComments([]);
        } else if (action.target === 'modals') {
          setNewSessionModal(false);
          setShowAIPrompt(false);
          setShowMermaidChart(false);
        } else if (action.target === 'highlights') {
          setHighlightedElement(null);
        } else if (action.target === 'all') {
          setCursors([]);
          setEmojiReactions([]);
          setDemoComments([]);
          setHighlightedElement(null);
          setSidebarContent(null);
          setSearchResults([]);
          setNewSessionModal(false);
          setShowAIPrompt(false);
          setShowMermaidChart(false);
        }
        break;

      case 'wait':
        // Just wait
        break;
    }
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
    setShowDecisionPopup(false);
    if (speechRef.current) {
      speechSynthesis.cancel();
    }
  };

  const currentStepData = demoSteps[currentStep];

  return (
    <div ref={demoRef} className="fixed inset-0 z-50 pointer-events-none">
      {/* Demo Controls */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[100] pointer-events-auto">
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

      {/* Narration Box */}
      {showNarration && currentNarration && (
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="absolute bottom-4 left-4 max-w-sm bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-xl border border-gray-200 pointer-events-auto z-[90]"
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

      {/* AI Insights Report Modal */}
      <AnimatePresence>
        {aiInsightsData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 translate-y-[-15px] bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-[80] max-w-sm"
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

      {/* Decision Finalization Popup */}
      <AnimatePresence>
        {showDecisionPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-50 border-2 border-green-300 rounded-xl p-4 z-[85] shadow-xl"
          >
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-green-800 mb-1">Decision Approved! 🎉</h3>
              <p className="text-sm text-green-700">AI-powered user onboarding selected</p>
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
            className="absolute pointer-events-none z-[70]"
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

      {/* Auto-generated Ideas with Voting */}
      <AnimatePresence>
        {autoIdeas.map((idea) => (
          <motion.div
            key={idea.id}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="absolute pointer-events-none z-[60]"
            style={{
              left: idea.position.x,
              top: idea.position.y,
            }}
          >
            <div className={`w-56 border-2 rounded-xl p-3 shadow-lg ${
              idea.approved 
                ? 'bg-green-100 border-green-400' 
                : 'bg-yellow-100 border-yellow-300'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-800">{idea.author}</span>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
                  idea.approved ? 'bg-green-200' : 'bg-yellow-200'
                }`}>
                  <TrendingUp className="w-3 h-3 text-gray-700" />
                  <span className="text-xs font-bold text-gray-700">{idea.votes}</span>
                </div>
              </div>
              <p className="text-xs text-gray-900 mb-2">{idea.text}</p>
              {idea.approved && (
                <div className="text-center">
                  <span className="inline-flex items-center px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                    ✅ APPROVED
                  </span>
                </div>
              )}
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
            className="absolute pointer-events-none z-[75] text-xl"
            style={{
              left: reaction.position.x,
              top: reaction.position.y,
            }}
          >
            {reaction.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Canvas Shapes - Professional Diagrams with Connections */}
      <AnimatePresence>
        {canvasShapes.map((shape) => {
          // Ensure shape has required properties
          if (!shape || !shape.id) return null;
          
          const position = shape.position || shape.startPos || { x: 0, y: 0 };
          
          return (
            <motion.div
              key={shape.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute pointer-events-none z-[50]"
              style={{
                left: position.x,
                top: position.y,
              }}
            >
              {shape.type === 'line' ? (
                <svg width="200" height="150" className="absolute" style={{ left: -100, top: -75 }}>
                  <line
                    x1={shape.startPos ? 100 : 0}
                    y1={shape.startPos ? 75 : 0}
                    x2={shape.endPos ? shape.endPos.x - position.x + 100 : 100}
                    y2={shape.endPos ? shape.endPos.y - position.y + 75 : 100}
                    stroke={shape.color}
                    strokeWidth="2"
                    className="drop-shadow-sm"
                  />
                </svg>
              ) : (
                <div 
                  className={`flex items-center justify-center text-white text-xs font-medium shadow-lg ${
                    shape.type === 'rectangle' ? 'rounded-lg' :
                    shape.type === 'circle' ? 'rounded-full' :
                    'transform rotate-45 rounded-lg'
                  }`}
                  style={{ 
                    backgroundColor: shape.color,
                    width: shape.width || (shape.type === 'circle' ? '80px' : '120px'),
                    height: shape.height || (shape.type === 'circle' ? '80px' : '60px')
                  }}
                >
                  <span className={shape.type === 'diamond' ? 'transform -rotate-45' : ''}>
                    {shape.text}
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Comments with AI Team Member */}
      <AnimatePresence>
        {demoComments.map((comment) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute pointer-events-none z-[65]"
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
            className="absolute left-80 top-32 bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-[70] max-w-xs"
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
            {sidebarContent === 'templates' && (
              <div className="space-y-2">
                <div className="p-2 bg-green-50 rounded border-l-2 border-green-500">
                  <div className="font-medium text-xs">📋 Brainstorming Template</div>
                  <div className="text-xs text-gray-500">67 uses</div>
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
            className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-[70] w-72"
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
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-[80] max-w-sm"
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
          className="absolute inset-0 pointer-events-none z-[55]"
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
          className="absolute inset-0 bg-black/60 flex items-center justify-center z-[100]"
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
                onClick={() => onDemoComplete && onDemoComplete()}
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