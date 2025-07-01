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
  type: 'cursor' | 'click' | 'type' | 'highlight' | 'panel' | 'wait' | 'idea' | 'vote' | 'comment' | 'session' | 'close-panel' | 'emoji' | 'ai-prompt' | 'mermaid-chart' | 'sidebar-click' | 'search' | 'new-session' | 'canvas-action' | 'ai-insights' | 'ai-team-comment' | 'close-popup' | 'decision-finalize';
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
  const [finalizedComment, setFinalizedComment] = useState<string | null>(null);
  
  const demoRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const completionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get canvas center position accounting for sidebar and navbar
  const getCanvasCenter = () => {
    const sidebarWidth = 320; // Sidebar width
    const navbarHeight = 64; // Navbar height
    const statusBarHeight = 32; // Status bar height
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
      description: 'Professional startup introduction with AI-powered workflow',
      duration: 10000,
      narration: 'Welcome to MindMeld Enterprise - the revolutionary AI-powered collaboration platform that transforms how teams ideate and make decisions.',
      actions: [
        { type: 'highlight', target: 'navbar', delay: 500, duration: 1500 },
        { type: 'mermaid-chart', delay: 2000 },
        { type: 'cursor', position: { x: 400, y: 300 }, user: 'Sarah Chen', color: '#10B981', delay: 4000 },
        { type: 'cursor', position: { x: 600, y: 400 }, user: 'Marcus Rodriguez', color: '#F59E0B', delay: 4500 },
        { type: 'ai-team-comment', position: { x: 450, y: 500 }, text: 'Welcome to the session! I\'ve analyzed our current product strategy and prepared some initial insights.', user: 'AI Assistant', delay: 6000 },
        { type: 'close-popup', target: 'mermaid-chart', delay: 8500 }
      ]
    },
    {
      id: 'sidebar-exploration',
      title: '📂 Complete Sidebar Navigation',
      description: 'Exploring every sidebar section with actual content',
      duration: 12000,
      narration: 'Let me show you our comprehensive sidebar navigation. Each section contains powerful features for different aspects of collaboration.',
      actions: [
        { type: 'sidebar-click', target: 'current-session', delay: 500, duration: 1000 },
        { type: 'sidebar-click', target: 'recent-sessions', delay: 2000, duration: 1000 },
        { type: 'search', text: 'Product Strategy', delay: 3500 },
        { type: 'ai-team-comment', position: { x: 500, y: 350 }, text: 'I found 3 relevant sessions with similar themes. The Product Strategy session has 89% alignment with current goals.', user: 'AI Assistant', delay: 4500 },
        { type: 'sidebar-click', target: 'starred', delay: 6000, duration: 1000 },
        { type: 'sidebar-click', target: 'templates', delay: 7500, duration: 1000 },
        { type: 'ai-team-comment', position: { x: 520, y: 400 }, text: 'Based on your team\'s history, I recommend the Strategy Planning template for maximum efficiency.', user: 'AI Assistant', delay: 9000 },
        { type: 'sidebar-click', target: 'team-spaces', delay: 10500, duration: 1000 }
      ]
    },
    {
      id: 'new-session-creation',
      title: '🎯 New Session Creation & Canvas',
      description: 'Creating a new session with AI Innovation theme',
      duration: 8000,
      narration: 'Now I will create a new collaboration session. Watch as we set up a fresh workspace for our AI Innovation Workshop.',
      actions: [
        { type: 'new-session', delay: 500 },
        { type: 'type', text: 'AI Innovation Workshop 2024', delay: 2000 },
        { type: 'click', target: 'create-session-btn', delay: 3500 },
        { type: 'mermaid-chart', delay: 5000 },
        { type: 'ai-team-comment', position: { x: 480, y: 520 }, text: 'Perfect! I\'ve set up an AI Innovation framework. This structure will help us explore machine learning opportunities systematically.', user: 'AI Assistant', delay: 6500 },
        { type: 'close-popup', target: 'mermaid-chart', delay: 7500 }
      ]
    },
    {
      id: 'canvas-collaboration',
      title: '🎨 Advanced Canvas Collaboration',
      description: 'Professional canvas tools with team interaction',
      duration: 14000,
      narration: 'Our professional canvas supports real-time collaboration with advanced drawing tools, shapes, and smart connections.',
      actions: [
        { type: 'canvas-action', target: 'create-rectangle', position: { x: 300, y: 200 }, delay: 500 },
        { type: 'canvas-action', target: 'add-text', text: 'User Research', position: { x: 300, y: 200 }, delay: 1500 },
        { type: 'cursor', position: { x: 500, y: 300 }, user: 'Sarah Chen', color: '#10B981', delay: 2500 },
        { type: 'canvas-action', target: 'create-circle', position: { x: 500, y: 300 }, delay: 3000 },
        { type: 'canvas-action', target: 'add-text', text: 'AI Analysis', position: { x: 500, y: 300 }, delay: 3500 },
        { type: 'ai-team-comment', position: { x: 350, y: 450 }, text: 'Excellent connection! User research combined with AI analysis creates a powerful feedback loop for product development.', user: 'AI Assistant', delay: 4500 },
        { type: 'canvas-action', target: 'connect-shapes', delay: 5000 },
        { type: 'cursor', position: { x: 700, y: 250 }, user: 'Marcus Rodriguez', color: '#F59E0B', delay: 6500 },
        { type: 'canvas-action', target: 'create-diamond', position: { x: 700, y: 250 }, delay: 7000 },
        { type: 'canvas-action', target: 'add-text', text: 'Decision', position: { x: 700, y: 250 }, delay: 7500 },
        { type: 'ai-team-comment', position: { x: 600, y: 450 }, text: 'This decision point is critical. I suggest adding validation criteria to ensure data-driven choices.', user: 'AI Assistant', delay: 9000 },
        { type: 'canvas-action', target: 'connect-all', delay: 10000 },
        { type: 'comment', position: { x: 400, y: 350 }, text: 'This workflow looks comprehensive! Great visual representation.', user: 'Sarah Chen', delay: 11500 },
        { type: 'comment', position: { x: 550, y: 380 }, text: 'I love how the AI analysis feeds into our decision making.', user: 'Marcus Rodriguez', delay: 12500 }
      ]
    },
    {
      id: 'collaboration-panel',
      title: '👥 Team Collaboration with AI Participation',
      description: 'Collaboration panel with voting, comments, and AI suggestions',
      duration: 16000,
      narration: 'Our collaboration panel enables rich team interaction with voting, emoji reactions, real-time chat, and AI team member participation.',
      actions: [
        { type: 'panel', target: 'collaboration-panel', delay: 500 },
        { type: 'idea', position: { x: 200, y: 150 }, text: 'Implement AI-powered user onboarding that adapts to user behavior patterns', user: 'Sarah Chen', delay: 1500 },
        { type: 'ai-team-comment', position: { x: 250, y: 200 }, text: 'Excellent idea! Adaptive onboarding can increase user retention by 40%. I can help design the ML model for this.', user: 'AI Assistant', delay: 2500 },
        { type: 'vote', target: 'idea-1', user: 'Marcus Rodriguez', delay: 3500 },
        { type: 'emoji', emoji: '👍', position: { x: 250, y: 150 }, user: 'Emily Watson', delay: 4000 },
        { type: 'emoji', emoji: '🚀', position: { x: 270, y: 150 }, user: 'AI Assistant', delay: 4500 },
        { type: 'idea', position: { x: 450, y: 200 }, text: 'Create a mobile-first design system with dark mode support', user: 'Emily Watson', delay: 5500 },
        { type: 'ai-team-comment', position: { x: 500, y: 250 }, text: 'Mobile-first is crucial! 73% of users prefer dark mode. I recommend implementing adaptive themes based on time and user preference.', user: 'AI Assistant', delay: 6500 },
        { type: 'vote', target: 'idea-2', user: 'Sarah Chen', delay: 7500 },
        { type: 'emoji', emoji: '⭐', position: { x: 500, y: 200 }, user: 'Marcus Rodriguez', delay: 8000 },
        { type: 'idea', position: { x: 300, y: 350 }, text: 'Integrate real-time collaboration features with conflict resolution', user: 'Marcus Rodriguez', delay: 9000 },
        { type: 'ai-team-comment', position: { x: 350, y: 400 }, text: 'Smart suggestion! Real-time collaboration with AI-powered conflict resolution can reduce merge conflicts by 60%. I can implement automatic conflict detection.', user: 'AI Assistant', delay: 10000 },
        { type: 'vote', target: 'idea-3', user: 'Emily Watson', delay: 11000 },
        { type: 'comment', position: { x: 200, y: 300 }, text: 'These ideas align perfectly with our Q4 roadmap!', user: 'Sarah Chen', delay: 12000 },
        { type: 'ai-team-comment', position: { x: 400, y: 480 }, text: 'Based on market analysis, these features address the top 3 user pain points. Implementation priority: 1) Onboarding 2) Design system 3) Collaboration.', user: 'AI Assistant', delay: 13500 },
        { type: 'emoji', emoji: '💡', position: { x: 350, y: 350 }, user: 'AI Assistant', delay: 14500 }
      ]
    },
    {
      id: 'ai-insights-complete',
      title: '🧠 Complete AI Analysis & Team AI Insights',
      description: 'AI analysis, team member AI interactions, and comprehensive reports',
      duration: 18000,
      narration: 'Watch our advanced AI system analyze all ideas, generate comprehensive insights, and participate as an intelligent team member with detailed recommendations.',
      actions: [
        { type: 'close-panel', target: 'collaboration-panel', delay: 500 },
        { type: 'panel', target: 'ai-panel', delay: 1000 },
        { type: 'click', target: 'generate-insights', delay: 2000 },
        { type: 'ai-team-comment', position: { x: 400, y: 300 }, text: 'Analyzing 3 ideas with 8 votes total. Processing themes, contradictions, and breakthrough opportunities...', user: 'AI Assistant', delay: 3000 },
        { type: 'wait', delay: 4000 },
        { type: 'ai-insights', delay: 6000 },
        { type: 'highlight', target: 'ai-themes', delay: 7000, duration: 1500 },
        { type: 'ai-team-comment', position: { x: 450, y: 350 }, text: 'I\'ve identified 3 key themes with 89% confidence. The user experience focus is particularly strong across all ideas.', user: 'AI Assistant', delay: 8000 },
        { type: 'highlight', target: 'ai-breakthrough', delay: 9500, duration: 1500 },
        { type: 'ai-team-comment', position: { x: 420, y: 400 }, text: 'Breakthrough insight: Modular AI-powered platform with adaptive complexity. This addresses both novice and expert user needs simultaneously.', user: 'AI Assistant', delay: 10500 },
        { type: 'cursor', position: { x: 350, y: 450 }, user: 'Project Manager', color: '#8B5CF6', delay: 12000 },
        { type: 'comment', position: { x: 350, y: 480 }, text: 'This AI analysis is incredibly thorough! The breakthrough insight could be our competitive advantage.', user: 'Project Manager', delay: 12500 },
        { type: 'ai-team-comment', position: { x: 500, y: 500 }, text: 'Thank you! I recommend prioritizing the AI-powered onboarding as it has the highest impact-to-effort ratio (9:6). Shall I create a detailed implementation plan?', user: 'AI Assistant', delay: 14000 },
        { type: 'emoji', emoji: '🏆', position: { x: 400, y: 450 }, user: 'AI Assistant', delay: 15500 },
        { type: 'highlight', target: 'ai-recommendations', delay: 16500, duration: 1500 }
      ]
    },
    {
      id: 'decision-finalization',
      title: '✅ Decision Finalization & Export',
      description: 'Complete workflow to final decision with project manager approval',
      duration: 10000,
      narration: 'Finally, we finalize our decisions based on team consensus and AI insights, with project manager approval and export options.',
      actions: [
        { type: 'highlight', target: 'top-idea', delay: 500, duration: 1500 },
        { type: 'cursor', position: { x: 200, y: 150 }, user: 'Project Manager', color: '#8B5CF6', delay: 2000 },
        { type: 'decision-finalize', target: 'idea-1', delay: 2500 },
        { type: 'ai-team-comment', position: { x: 300, y: 200 }, text: 'Excellent decision! AI-powered onboarding aligns with our strategic goals and has the highest ROI potential. I\'ll prepare the technical specifications.', user: 'AI Assistant', delay: 3500 },
        { type: 'close-panel', target: 'ai-panel', delay: 5000 },
        { type: 'highlight', target: 'export-button', delay: 6000, duration: 1500 },
        { type: 'click', target: 'export-menu', delay: 7000 },
        { type: 'ai-team-comment', position: { x: 450, y: 300 }, text: 'Session summary ready! I\'ve compiled all decisions, insights, and next steps into a comprehensive report for stakeholders.', user: 'AI Assistant', delay: 8000 },
        { type: 'highlight', target: 'share-button', delay: 9000, duration: 1500 }
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
      if (completionTimeoutRef.current) {
        clearTimeout(completionTimeoutRef.current);
      }
      completionTimeoutRef.current = setTimeout(() => {
        onDemoComplete?.();
      }, 100);
      return;
    }

    setCurrentNarration(currentStepData.narration);
    
    // Voice narration with better modulation
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
            if (completionTimeoutRef.current) {
              clearTimeout(completionTimeoutRef.current);
            }
            completionTimeoutRef.current = setTimeout(() => {
              onDemoComplete?.();
            }, 100);
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

  // Execute demo actions with faster timing
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
          setEmojiReactions(prev => [...prev, {
            id: `emoji-${Date.now()}`,
            emoji: action.emoji,
            position: action.position,
            user: action.user,
            timestamp: new Date()
          }]);
          
          setTimeout(() => {
            setEmojiReactions(prev => prev.filter(e => e.timestamp.getTime() < Date.now() - 2000));
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

      case 'decision-finalize':
        if (action.target) {
          setFinalizedComment(action.target);
          setShowDecisionPopup(true);
          setTimeout(() => {
            setShowDecisionPopup(false);
            setFinalizedComment(null);
          }, 3000);
        }
        break;

      case 'mermaid-chart':
        const center = getCanvasCenter();
        if (currentStep === 0) {
          // Product Strategy Diagram
          setCanvasShapes(prev => [...prev, {
            id: `diagram-${Date.now()}`,
            type: 'strategy-diagram',
            position: { x: center.x - 200, y: center.y - 150 },
            elements: [
              { type: 'rect', x: 0, y: 0, width: 120, height: 60, text: 'Market Research', color: '#3B82F6' },
              { type: 'rect', x: 140, y: 0, width: 120, height: 60, text: 'User Analysis', color: '#10B981' },
              { type: 'rect', x: 280, y: 0, width: 120, height: 60, text: 'Competitive Intel', color: '#F59E0B' },
              { type: 'rect', x: 70, y: 100, width: 120, height: 60, text: 'Product Strategy', color: '#8B5CF6' },
              { type: 'rect', x: 210, y: 100, width: 120, height: 60, text: 'Implementation', color: '#EF4444' },
              { type: 'rect', x: 140, y: 200, width: 120, height: 60, text: 'Success Metrics', color: '#06B6D4' }
            ]
          }]);
        } else {
          // AI Innovation Diagram
          setCanvasShapes(prev => [...prev, {
            id: `diagram-${Date.now()}`,
            type: 'ai-innovation-diagram',
            position: { x: center.x - 200, y: center.y - 150 },
            elements: [
              { type: 'circle', x: 200, y: 150, radius: 40, text: 'AI Hub', color: '#8B5CF6' },
              { type: 'rect', x: 50, y: 50, width: 100, height: 50, text: 'ML Models', color: '#3B82F6' },
              { type: 'rect', x: 300, y: 50, width: 100, height: 50, text: 'Data Pipeline', color: '#10B981' },
              { type: 'rect', x: 50, y: 250, width: 100, height: 50, text: 'User Interface', color: '#F59E0B' },
              { type: 'rect', x: 300, y: 250, width: 100, height: 50, text: 'Analytics', color: '#EF4444' }
            ]
          }]);
        }
        setShowMermaidChart(true);
        break;

      case 'close-popup':
        if (action.target === 'mermaid-chart') {
          setShowMermaidChart(false);
        }
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

      case 'canvas-action':
        const canvasCenter = getCanvasCenter();
        if (action.target === 'create-rectangle' && action.position) {
          setCanvasShapes(prev => [...prev, {
            id: `shape-${Date.now()}`,
            type: 'rectangle',
            position: { x: canvasCenter.x - 200 + (action.position?.x || 0) - 300, y: canvasCenter.y - 100 + (action.position?.y || 0) - 200 },
            text: '',
            color: '#3B82F6'
          }]);
        } else if (action.target === 'create-circle' && action.position) {
          setCanvasShapes(prev => [...prev, {
            id: `shape-${Date.now()}`,
            type: 'circle',
            position: { x: canvasCenter.x - 200 + (action.position?.x || 0) - 300, y: canvasCenter.y - 100 + (action.position?.y || 0) - 200 },
            text: '',
            color: '#10B981'
          }]);
        } else if (action.target === 'create-diamond' && action.position) {
          setCanvasShapes(prev => [...prev, {
            id: `shape-${Date.now()}`,
            type: 'diamond',
            position: { x: canvasCenter.x - 200 + (action.position?.x || 0) - 300, y: canvasCenter.y - 100 + (action.position?.y || 0) - 200 },
            text: '',
            color: '#F59E0B'
          }]);
        } else if (action.target === 'add-text' && action.text && action.position) {
          setCanvasShapes(prev => prev.map(shape => {
            const targetX = canvasCenter.x - 200 + (action.position?.x || 0) - 300;
            const targetY = canvasCenter.y - 100 + (action.position?.y || 0) - 200;
            return Math.abs(shape.position.x - targetX) < 50 && Math.abs(shape.position.y - targetY) < 50
              ? { ...shape, text: action.text }
              : shape;
          }));
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
    setFinalizedComment(null);
    if (speechRef.current) {
      speechSynthesis.cancel();
    }
    if (completionTimeoutRef.current) {
      clearTimeout(completionTimeoutRef.current);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (speechRef.current) {
        speechSynthesis.cancel();
      }
      if (completionTimeoutRef.current) {
        clearTimeout(completionTimeoutRef.current);
      }
    };
  }, []);

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

      {/* AI Insights Report Modal - Shifted up */}
      <AnimatePresence>
        {aiInsightsData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-60 max-w-sm"
            style={{ transform: 'translate(0, calc(-50% - 20px))' }}
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

      {/* Decision Finalization Popup */}
      <AnimatePresence>
        {showDecisionPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-50 border-2 border-green-300 rounded-xl p-4 z-60 shadow-xl"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-green-800">✅ Decision Finalized!</h3>
                <p className="text-sm text-green-700">Project Manager approved this idea</p>
              </div>
              <span className="text-2xl">🎉</span>
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
              left: idea.position?.x || 0,
              top: idea.position?.y || 0,
            }}
          >
            <div className={`w-56 rounded-xl p-3 shadow-lg border-2 ${
              finalizedComment === idea.id 
                ? 'bg-green-100 border-green-400' 
                : 'bg-yellow-100 border-yellow-300'
            }`}>
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
                {finalizedComment === idea.id && (
                  <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full font-medium ml-2">
                    ✅ APPROVED
                  </span>
                )}
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
              left: reaction.position?.x || 0,
              top: reaction.position?.y || 0,
            }}
          >
            {reaction.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Canvas Shapes and Diagrams */}
      <AnimatePresence>
        {canvasShapes.map((shape) => (
          <motion.div
            key={shape.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute pointer-events-none z-25"
            style={{
              left: shape.position?.x || 0,
              top: shape.position?.y || 0,
            }}
          >
            {shape.type === 'strategy-diagram' && (
              <div className="relative">
                {shape.elements?.map((element: any, index: number) => (
                  <div
                    key={index}
                    className="absolute flex items-center justify-center text-white text-xs font-medium shadow-lg rounded-lg"
                    style={{
                      left: element.x,
                      top: element.y,
                      width: element.width,
                      height: element.height,
                      backgroundColor: element.color
                    }}
                  >
                    {element.text}
                  </div>
                ))}
                {/* Connecting lines */}
                <svg className="absolute inset-0 w-full h-full" style={{ width: '400px', height: '300px' }}>
                  <line x1="60" y1="60" x2="130" y2="130" stroke="#6B7280" strokeWidth="2" />
                  <line x1="200" y1="60" x2="130" y2="130" stroke="#6B7280" strokeWidth="2" />
                  <line x1="340" y1="60" x2="270" y2="130" stroke="#6B7280" strokeWidth="2" />
                  <line x1="130" y1="160" x2="200" y2="230" stroke="#6B7280" strokeWidth="2" />
                  <line x1="270" y1="160" x2="200" y2="230" stroke="#6B7280" strokeWidth="2" />
                </svg>
              </div>
            )}
            
            {shape.type === 'ai-innovation-diagram' && (
              <div className="relative">
                {shape.elements?.map((element: any, index: number) => (
                  <div
                    key={index}
                    className="absolute flex items-center justify-center text-white text-xs font-medium shadow-lg"
                    style={{
                      left: element.x,
                      top: element.y,
                      width: element.type === 'circle' ? element.radius * 2 : element.width,
                      height: element.type === 'circle' ? element.radius * 2 : element.height,
                      backgroundColor: element.color,
                      borderRadius: element.type === 'circle' ? '50%' : '8px'
                    }}
                  >
                    {element.text}
                  </div>
                ))}
                {/* Connecting lines to center */}
                <svg className="absolute inset-0 w-full h-full" style={{ width: '450px', height: '350px' }}>
                  <line x1="100" y1="75" x2="200" y2="150" stroke="#8B5CF6" strokeWidth="3" />
                  <line x1="350" y1="75" x2="240" y2="150" stroke="#8B5CF6" strokeWidth="3" />
                  <line x1="100" y1="275" x2="200" y2="190" stroke="#8B5CF6" strokeWidth="3" />
                  <line x1="350" y1="275" x2="240" y2="190" stroke="#8B5CF6" strokeWidth="3" />
                </svg>
              </div>
            )}
            
            {!shape.type.includes('diagram') && (
              <div 
                className={`w-20 h-12 flex items-center justify-center text-white text-xs font-medium shadow-lg ${
                  shape.type === 'rectangle' ? 'rounded-lg' :
                  shape.type === 'circle' ? 'rounded-full' :
                  'transform rotate-45 rounded-lg'
                }`}
                style={{ backgroundColor: shape.color }}
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
              left: (comment.position?.x || 0) + 20,
              top: (comment.position?.y || 0) - 10,
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