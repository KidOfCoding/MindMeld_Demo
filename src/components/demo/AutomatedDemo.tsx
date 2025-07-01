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
  Star,
  Heart,
  ThumbsUp,
  Trophy,
  Rocket,
  Crown,
  Mic,
  MicOff,
  Settings,
  Search,
  Plus,
  FileText,
  Archive,
  Clock,
  Folder,
  Home,
  Edit3,
  Square,
  Circle,
  ArrowUpRight,
  Palette,
  Type,
  StickyNote,
  Hand,
  MousePointer2,
  ChevronUp,
  X,
  Send,
  Copy,
  Download,
  Share2,
  Eye,
  EyeOff,
  Map,
  Layers,
  Grid,
  Maximize,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

interface DemoStep {
  id: string;
  title: string;
  description: string;
  duration: number;
  actions: DemoAction[];
  narration: string;
  interactive: boolean;
}

interface DemoAction {
  type: 'cursor' | 'click' | 'type' | 'highlight' | 'panel' | 'wait' | 'idea' | 'vote' | 'comment' | 'session' | 'sidebar' | 'search' | 'shape' | 'connect' | 'ai-comment' | 'emoji' | 'star' | 'speech' | 'scroll' | 'new-session' | 'canvas-change' | 'upvote' | 'collaboration-panel' | 'ai-prompt' | 'mermaid-chart';
  target?: string;
  position?: { x: number; y: number };
  text?: string;
  delay?: number;
  user?: string;
  color?: string;
  emoji?: string;
  shapeType?: string;
  connectionType?: string;
  speechText?: string;
  scrollTarget?: string;
  sessionName?: string;
  chartData?: string;
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
  const [autoIdeas, setAutoIdeas] = useState<any[]>([]);
  const [demoComments, setDemoComments] = useState<any[]>([]);
  const [showNarration, setShowNarration] = useState(true);
  const [currentNarration, setCurrentNarration] = useState('');
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [sessionSwitched, setSessionSwitched] = useState(false);
  const [sidebarActiveItem, setSidebarActiveItem] = useState('current');
  const [searchQuery, setSearchQuery] = useState('');
  const [newSessionName, setNewSessionName] = useState('');
  const [createdShapes, setCreatedShapes] = useState<any[]>([]);
  const [connections, setConnections] = useState<any[]>([]);
  const [aiComments, setAiComments] = useState<any[]>([]);
  const [emojiReactions, setEmojiReactions] = useState<any[]>([]);
  const [starredIdeas, setStarredIdeas] = useState<string[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [showNewSessionModal, setShowNewSessionModal] = useState(false);
  const [showCollaborationPanel, setShowCollaborationPanel] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [canvasChanged, setCanvasChanged] = useState(false);
  const [sidebarContent, setSidebarContent] = useState<any>({});
  const [mermaidChart, setMermaidChart] = useState<string>('');
  const [aiPromptShown, setAiPromptShown] = useState(false);
  
  const demoRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const demoSteps: DemoStep[] = [
    {
      id: 'startup-intro',
      title: '🚀 MindMeld Enterprise - Revolutionary Platform',
      description: 'AI-powered collaborative innovation platform',
      duration: 10000,
      interactive: true,
      narration: 'Welcome to MindMeld Enterprise! The most advanced collaborative ideation platform that transforms how teams think together. Watch as we demonstrate every feature in this comprehensive startup presentation.',
      actions: [
        { type: 'speech', speechText: 'Welcome to MindMeld Enterprise! The most advanced collaborative ideation platform that transforms how teams think together.', delay: 1000 },
        { type: 'highlight', target: 'navbar', delay: 2000 },
        { type: 'highlight', target: 'logo', delay: 3000 },
        { type: 'cursor', position: { x: 400, y: 300 }, user: 'Sarah Chen', color: '#10B981', delay: 4000 },
        { type: 'cursor', position: { x: 600, y: 400 }, user: 'Marcus Rodriguez', color: '#F59E0B', delay: 5000 },
        { type: 'cursor', position: { x: 350, y: 250 }, user: 'AI Assistant', color: '#8B5CF6', delay: 6000 },
        { type: 'mermaid-chart', chartData: 'graph TD\n    A[User Input] --> B[AI Processing]\n    B --> C[Smart Insights]\n    C --> D[Team Decision]', delay: 7500 }
      ]
    },
    {
      id: 'complete-sidebar-exploration',
      title: '📂 Complete Sidebar Feature Exploration',
      description: 'Clicking through every sidebar section with content',
      duration: 25000,
      interactive: true,
      narration: 'Now I will demonstrate our comprehensive sidebar by actually clicking through every section. Watch as we explore Current Session, Recent Sessions, Starred items, Templates, Team Spaces, and AI Insights with real content.',
      actions: [
        { type: 'speech', speechText: 'Now I will demonstrate our comprehensive sidebar by actually clicking through every section with real content.', delay: 500 },
        { type: 'cursor', position: { x: 150, y: 200 }, user: 'Demo Guide', color: '#3B82F6', delay: 1000 },
        
        // Current Session - CLICK AND SHOW
        { type: 'click', target: 'sidebar-current', delay: 2000 },
        { type: 'highlight', target: 'current-session-content', delay: 2500 },
        { type: 'scroll', scrollTarget: 'current-session-details', delay: 3000 },
        
        // Recent Sessions - CLICK AND SHOW
        { type: 'click', target: 'sidebar-recent', delay: 4500 },
        { type: 'highlight', target: 'recent-sessions-list', delay: 5000 },
        { type: 'scroll', scrollTarget: 'recent-sessions-content', delay: 5500 },
        { type: 'search', text: 'Product Strategy', delay: 6500 },
        
        // Starred - CLICK AND SHOW
        { type: 'click', target: 'sidebar-starred', delay: 8000 },
        { type: 'highlight', target: 'starred-items-list', delay: 8500 },
        { type: 'scroll', scrollTarget: 'starred-content', delay: 9000 },
        
        // Templates - CLICK AND SHOW
        { type: 'click', target: 'sidebar-templates', delay: 10500 },
        { type: 'highlight', target: 'template-gallery', delay: 11000 },
        { type: 'scroll', scrollTarget: 'template-list', delay: 11500 },
        
        // Team Spaces - CLICK AND SHOW
        { type: 'click', target: 'sidebar-team', delay: 13000 },
        { type: 'highlight', target: 'team-spaces-content', delay: 13500 },
        { type: 'scroll', scrollTarget: 'team-workspaces', delay: 14000 },
        
        // AI Insights - CLICK AND SHOW
        { type: 'click', target: 'sidebar-ai-insights', delay: 15500 },
        { type: 'highlight', target: 'ai-insights-quick-access', delay: 16000 },
        
        // Search functionality demonstration
        { type: 'click', target: 'sidebar-recent', delay: 17500 },
        { type: 'search', text: 'Design Sprint', delay: 18000 },
        { type: 'highlight', target: 'search-results', delay: 18500 },
        
        // Clear search and return to current
        { type: 'search', text: '', delay: 20000 },
        { type: 'click', target: 'sidebar-current', delay: 20500 }
      ]
    },
    {
      id: 'new-session-creation',
      title: '🎯 New Session Creation & Canvas Change',
      description: 'Actually creating a new session with custom name and blank canvas',
      duration: 15000,
      interactive: true,
      narration: 'Watch as I create a completely new session with a custom name. This will generate a blank canvas showing how teams can start fresh projects.',
      actions: [
        { type: 'speech', speechText: 'Now I will create a completely new session with a custom name and show the blank canvas.', delay: 500 },
        { type: 'cursor', position: { x: 200, y: 100 }, user: 'Project Manager', color: '#EF4444', delay: 1000 },
        
        // ACTUALLY CLICK NEW SESSION BUTTON
        { type: 'click', target: 'new-session-button', delay: 2000 },
        { type: 'new-session', sessionName: 'AI Innovation Workshop 2024', delay: 2500 },
        { type: 'highlight', target: 'new-session-modal', delay: 3000 },
        
        // TYPE THE SESSION NAME
        { type: 'type', text: 'AI Innovation Workshop 2024', target: 'session-name-input', delay: 4000 },
        { type: 'highlight', target: 'session-name-field', delay: 4500 },
        
        // CLICK CREATE BUTTON
        { type: 'click', target: 'create-session-confirm', delay: 6000 },
        { type: 'canvas-change', delay: 7000 },
        { type: 'highlight', target: 'blank-canvas', delay: 7500 },
        
        // Show session switched notification
        { type: 'session', target: 'new-session-created', delay: 8500 },
        { type: 'highlight', target: 'session-indicator', delay: 9000 },
        
        // Demonstrate session switching
        { type: 'click', target: 'session-dropdown', delay: 10500 },
        { type: 'highlight', target: 'session-list', delay: 11000 },
        { type: 'click', target: 'previous-session', delay: 12000 },
        { type: 'canvas-change', delay: 12500 },
        { type: 'session', target: 'session-switched-back', delay: 13000 }
      ]
    },
    {
      id: 'canvas-collaboration-advanced',
      title: '🎨 Advanced Canvas Collaboration & Tools',
      description: 'Professional drawing tools with real-time collaboration',
      duration: 20000,
      interactive: true,
      narration: 'Experience our professional Miro-style canvas with advanced collaboration. Watch multiple team members create shapes, connect them with curved lines, and collaborate in real-time.',
      actions: [
        { type: 'speech', speechText: 'Experience our professional Miro-style canvas with advanced collaboration and drawing tools.', delay: 500 },
        { type: 'cursor', position: { x: 500, y: 300 }, user: 'Sarah Chen', color: '#10B981', delay: 1000 },
        
        // Create rectangle
        { type: 'click', target: 'rectangle-tool', delay: 2000 },
        { type: 'shape', shapeType: 'rectangle', position: { x: 400, y: 250 }, delay: 2500 },
        { type: 'type', text: 'User Research', position: { x: 420, y: 280 }, delay: 3000 },
        
        // Second user creates circle
        { type: 'cursor', position: { x: 700, y: 350 }, user: 'Marcus Rodriguez', color: '#F59E0B', delay: 4000 },
        { type: 'click', target: 'circle-tool', delay: 4500 },
        { type: 'shape', shapeType: 'circle', position: { x: 650, y: 300 }, delay: 5000 },
        { type: 'type', text: 'AI Analysis', position: { x: 670, y: 330 }, delay: 5500 },
        
        // Third user creates connection
        { type: 'cursor', position: { x: 550, y: 400 }, user: 'Emily Watson', color: '#EF4444', delay: 6500 },
        { type: 'click', target: 'arrow-tool', delay: 7000 },
        { type: 'connect', connectionType: 'curved', from: { x: 500, y: 290 }, to: { x: 650, y: 340 }, delay: 7500 },
        
        // Add sticky notes
        { type: 'click', target: 'sticky-tool', delay: 9000 },
        { type: 'idea', position: { x: 300, y: 450 }, text: 'AI-powered user onboarding system', user: 'Sarah Chen', delay: 9500 },
        { type: 'idea', position: { x: 750, y: 450 }, text: 'Mobile-first design with dark mode', user: 'Marcus Rodriguez', delay: 10500 },
        { type: 'idea', position: { x: 525, y: 500 }, text: 'Voice-to-text functionality', user: 'Emily Watson', delay: 11500 },
        
        // Show collaboration features
        { type: 'emoji', target: 'idea-1', emoji: '👍', user: 'Emily Watson', delay: 13000 },
        { type: 'emoji', target: 'idea-1', emoji: '❤️', user: 'Marcus Rodriguez', delay: 13500 },
        { type: 'upvote', target: 'idea-1', user: 'Sarah Chen', delay: 14000 },
        { type: 'upvote', target: 'idea-1', user: 'Emily Watson', delay: 14500 },
        { type: 'star', target: 'idea-1', user: 'Marcus Rodriguez', delay: 15000 },
        
        // Add more interactions
        { type: 'upvote', target: 'idea-2', user: 'Sarah Chen', delay: 16000 },
        { type: 'emoji', target: 'idea-2', emoji: '🚀', user: 'Emily Watson', delay: 16500 },
        { type: 'upvote', target: 'idea-3', user: 'Marcus Rodriguez', delay: 17000 },
        
        // Show canvas tools
        { type: 'highlight', target: 'canvas-toolbar', delay: 18000 },
        { type: 'highlight', target: 'zoom-controls', delay: 18500 }
      ]
    },
    {
      id: 'collaboration-panel-demo',
      title: '👥 Collaboration Panel & Team Features',
      description: 'Opening collaboration panel and showing team features',
      duration: 15000,
      interactive: true,
      narration: 'Now I will open the collaboration panel to show team features, online members, chat functionality, and real-time collaboration tools.',
      actions: [
        { type: 'speech', speechText: 'Now I will open the collaboration panel to show team features and real-time collaboration tools.', delay: 500 },
        { type: 'cursor', position: { x: 1100, y: 60 }, user: 'Demo Guide', color: '#3B82F6', delay: 1000 },
        
        // ACTUALLY OPEN COLLABORATION PANEL
        { type: 'click', target: 'collaborators-button', delay: 2000 },
        { type: 'collaboration-panel', delay: 2500 },
        { type: 'highlight', target: 'collaboration-panel', delay: 3000 },
        
        // Show online members
        { type: 'highlight', target: 'online-members', delay: 4000 },
        { type: 'scroll', scrollTarget: 'member-list', delay: 4500 },
        
        // Show team chat
        { type: 'highlight', target: 'team-chat', delay: 6000 },
        { type: 'type', text: 'Great collaboration everyone! 🎉', target: 'chat-input', delay: 6500 },
        { type: 'click', target: 'send-message', delay: 7500 },
        
        // Show voice/video controls
        { type: 'highlight', target: 'voice-video-controls', delay: 8500 },
        { type: 'click', target: 'mute-button', delay: 9000 },
        { type: 'click', target: 'video-button', delay: 9500 },
        
        // Show member actions
        { type: 'highlight', target: 'member-actions', delay: 10500 },
        { type: 'click', target: 'invite-button', delay: 11000 },
        { type: 'highlight', target: 'invite-modal', delay: 11500 },
        
        // Close collaboration panel
        { type: 'click', target: 'close-collaboration-panel', delay: 13000 }
      ]
    },
    {
      id: 'ai-insights-complete',
      title: '🧠 Complete AI Insights & Analysis',
      description: 'AI prompting, analysis, and team member AI comments',
      duration: 22000,
      interactive: true,
      narration: 'Watch our revolutionary AI system analyze ideas and provide intelligent insights. I will show AI prompting, analysis generation, and how AI acts like a real team member.',
      actions: [
        { type: 'speech', speechText: 'Now witness our revolutionary AI system that analyzes ideas and provides intelligent insights like a real team member.', delay: 500 },
        { type: 'cursor', position: { x: 1050, y: 60 }, user: 'Demo Guide', color: '#8B5CF6', delay: 1000 },
        
        // ACTUALLY OPEN AI PANEL
        { type: 'click', target: 'ai-button', delay: 2000 },
        { type: 'panel', target: 'ai-panel', delay: 2500 },
        { type: 'highlight', target: 'ai-panel', delay: 3000 },
        
        // Show AI prompting
        { type: 'ai-prompt', delay: 4000 },
        { type: 'type', text: 'Analyze our ideas and provide strategic recommendations', target: 'ai-prompt-input', delay: 4500 },
        { type: 'click', target: 'generate-insights', delay: 5500 },
        { type: 'highlight', target: 'ai-processing', delay: 6000 },
        
        // AI generates insights
        { type: 'highlight', target: 'ai-themes', delay: 8000 },
        { type: 'scroll', scrollTarget: 'themes-content', delay: 8500 },
        { type: 'highlight', target: 'ai-contradictions', delay: 10000 },
        { type: 'highlight', target: 'ai-breakthrough', delay: 11500 },
        
        // AI acts as team member
        { type: 'cursor', position: { x: 400, y: 350 }, user: 'AI Assistant', color: '#8B5CF6', delay: 13000 },
        { type: 'ai-comment', text: 'Based on market analysis, the AI-powered onboarding has 94% success potential. I recommend prioritizing this idea.', user: 'AI Assistant', position: { x: 350, y: 500 }, delay: 13500 },
        { type: 'upvote', target: 'idea-1', user: 'AI Assistant', delay: 15000 },
        { type: 'star', target: 'idea-1', user: 'AI Assistant', delay: 15500 },
        { type: 'ai-comment', text: 'This aligns perfectly with current market trends. 89% confidence in user adoption.', user: 'AI Assistant', position: { x: 600, y: 400 }, delay: 16500 },
        
        // Show AI analytics
        { type: 'click', target: 'analytics-tab', delay: 18000 },
        { type: 'highlight', target: 'priority-matrix', delay: 18500 },
        { type: 'click', target: 'collaboration-tab', delay: 19500 },
        { type: 'highlight', target: 'team-metrics', delay: 20000 },
        
        // Export insights
        { type: 'click', target: 'export-insights', delay: 21000 }
      ]
    },
    {
      id: 'decision-finalization',
      title: '✅ Complete Decision Finalization Process',
      description: 'How ideas are finalized with team consensus',
      duration: 12000,
      interactive: true,
      narration: 'Watch the complete decision-making process as the team finalizes their top idea through voting, AI validation, and consensus building.',
      actions: [
        { type: 'speech', speechText: 'Now see the complete decision-making process as the team finalizes their top idea through voting and consensus.', delay: 500 },
        { type: 'highlight', target: 'top-voted-idea', delay: 1500 },
        { type: 'cursor', position: { x: 350, y: 450 }, user: 'Project Manager', color: '#3B82F6', delay: 2000 },
        
        // Final voting round
        { type: 'upvote', target: 'idea-1', user: 'Project Manager', delay: 2500 },
        { type: 'emoji', target: 'idea-1', emoji: '🏆', user: 'Project Manager', delay: 3000 },
        { type: 'comment', text: 'This is our winner! Let\'s move forward with AI-powered onboarding.', user: 'Project Manager', position: { x: 350, y: 520 }, delay: 3500 },
        
        // AI provides final validation
        { type: 'ai-comment', text: 'Excellent choice! Based on comprehensive analysis: 94% market fit, 2-week MVP timeline, $2M revenue potential.', user: 'AI Assistant', position: { x: 400, y: 570 }, delay: 5000 },
        
        // Team consensus
        { type: 'emoji', target: 'idea-1', emoji: '✅', user: 'Sarah Chen', delay: 6500 },
        { type: 'emoji', target: 'idea-1', emoji: '✅', user: 'Marcus Rodriguez', delay: 7000 },
        { type: 'emoji', target: 'idea-1', emoji: '✅', user: 'Emily Watson', delay: 7500 },
        
        // Finalize decision
        { type: 'highlight', target: 'finalized-decision', delay: 8500 },
        { type: 'click', target: 'export-decision', delay: 9500 },
        { type: 'highlight', target: 'export-options', delay: 10000 },
        { type: 'click', target: 'share-results', delay: 10500 }
      ]
    },
    {
      id: 'startup-conclusion',
      title: '🎉 MindMeld Enterprise - Revolutionary Solution',
      description: 'Complete platform demonstration conclusion',
      duration: 8000,
      interactive: true,
      narration: 'MindMeld Enterprise transforms how teams collaborate, think, and decide. With AI-powered insights, real-time collaboration, and professional workflows, we are revolutionizing team productivity for the future of work.',
      actions: [
        { type: 'speech', speechText: 'MindMeld Enterprise transforms how teams collaborate, think, and decide. We are revolutionizing team productivity for the future of work.', delay: 1000 },
        { type: 'highlight', target: 'entire-app', delay: 2000 },
        { type: 'cursor', position: { x: 400, y: 300 }, user: 'All Team Members', color: '#8B5CF6', delay: 4000 },
        { type: 'emoji', target: 'entire-app', emoji: '🎉', user: 'All Team Members', delay: 5000 },
        { type: 'wait', delay: 6000 }
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

  // Speech synthesis with professional voice
  const speak = (text: string) => {
    if (!speechEnabled || !window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.pitch = 1.0;
    utterance.volume = 0.9;
    
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') || 
      voice.name.includes('Microsoft') ||
      voice.name.includes('Samantha') ||
      voice.lang.includes('en-US')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

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

      case 'click':
        // Simulate actual clicking with visual feedback
        setHighlightedElement(action.target || null);
        setTimeout(() => setHighlightedElement(null), 500);
        
        // Handle specific click targets
        if (action.target === 'new-session-button') {
          setShowNewSessionModal(true);
        } else if (action.target === 'collaborators-button') {
          setShowCollaborationPanel(true);
        } else if (action.target === 'ai-button') {
          setShowAIPanel(true);
        } else if (action.target?.includes('sidebar-')) {
          const section = action.target.replace('sidebar-', '');
          setSidebarActiveItem(section);
        }
        break;

      case 'new-session':
        if (action.sessionName) {
          setNewSessionName(action.sessionName);
          setShowNewSessionModal(true);
        }
        break;

      case 'canvas-change':
        setCanvasChanged(true);
        setTimeout(() => setCanvasChanged(false), 3000);
        break;

      case 'collaboration-panel':
        setShowCollaborationPanel(true);
        document.dispatchEvent(new CustomEvent('demo-open-comments-panel'));
        break;

      case 'ai-prompt':
        setAiPromptShown(true);
        break;

      case 'mermaid-chart':
        if (action.chartData) {
          setMermaidChart(action.chartData);
        }
        break;

      case 'sidebar':
        setSidebarActiveItem(action.target || 'current');
        setHighlightedElement(`sidebar-${action.target}`);
        setTimeout(() => setHighlightedElement(null), 2000);
        break;

      case 'search':
        if (action.text !== undefined) {
          setSearchQuery(action.text);
          if (action.text === '') {
            setTimeout(() => setSearchQuery(''), 100);
          }
        }
        break;

      case 'scroll':
        // Simulate scrolling in sidebar content
        setHighlightedElement(action.scrollTarget || null);
        setTimeout(() => setHighlightedElement(null), 2000);
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
            reactions: [],
            starred: false
          }]);
        }
        break;

      case 'shape':
        if (action.position && action.shapeType) {
          setCreatedShapes(prev => [...prev, {
            id: `shape-${Date.now()}`,
            type: action.shapeType,
            position: action.position,
            size: action.shapeType === 'circle' ? { width: 100, height: 100 } : { width: 120, height: 80 }
          }]);
        }
        break;

      case 'connect':
        if (action.from && action.to) {
          setConnections(prev => [...prev, {
            id: `connection-${Date.now()}`,
            from: action.from,
            to: action.to,
            type: action.connectionType || 'curved'
          }]);
        }
        break;

      case 'ai-comment':
        if (action.text && action.position) {
          setAiComments(prev => [...prev, {
            id: `ai-comment-${Date.now()}`,
            text: action.text,
            position: action.position,
            author: 'AI Assistant',
            timestamp: new Date()
          }]);
        }
        break;

      case 'emoji':
        if (action.target && action.emoji && action.user) {
          setEmojiReactions(prev => [...prev, {
            id: `emoji-${Date.now()}`,
            target: action.target,
            emoji: action.emoji,
            user: action.user,
            timestamp: new Date()
          }]);
        }
        break;

      case 'star':
        if (action.target) {
          setStarredIdeas(prev => [...prev, action.target]);
        }
        break;

      case 'upvote':
      case 'vote':
        setAutoIdeas(prev => prev.map(idea => 
          idea.id === action.target 
            ? { ...idea, votes: idea.votes + 1 }
            : idea
        ));
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

      case 'highlight':
        setHighlightedElement(action.target || null);
        setTimeout(() => setHighlightedElement(null), 3000);
        break;

      case 'session':
        setSessionSwitched(true);
        setTimeout(() => setSessionSwitched(false), 3000);
        break;

      case 'panel':
        if (action.target === 'ai-panel') {
          setShowAIPanel(true);
          document.dispatchEvent(new CustomEvent('demo-open-ai-panel'));
        } else if (action.target === 'comments-panel') {
          setShowCollaborationPanel(true);
          document.dispatchEvent(new CustomEvent('demo-open-comments-panel'));
        }
        break;
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (isPlaying && speechRef.current) {
      window.speechSynthesis.pause();
    } else if (!isPlaying && speechRef.current) {
      window.speechSynthesis.resume();
    }
  };

  const toggleSpeech = () => {
    setSpeechEnabled(!speechEnabled);
    if (speechEnabled) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
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
    setAutoIdeas([]);
    setDemoComments([]);
    setHighlightedElement(null);
    setCreatedShapes([]);
    setConnections([]);
    setAiComments([]);
    setEmojiReactions([]);
    setStarredIdeas([]);
    setShowNewSessionModal(false);
    setShowCollaborationPanel(false);
    setShowAIPanel(false);
    setCanvasChanged(false);
    setMermaidChart('');
    setAiPromptShown(false);
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const currentStepData = demoSteps[currentStep];

  return (
    <div ref={demoRef} className="fixed inset-0 z-50 pointer-events-none">
      {/* Demo Controls */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 pointer-events-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-black/95 backdrop-blur-sm text-white rounded-xl p-4 shadow-2xl border border-white/20 max-w-3xl"
        >
          <div className="flex items-center space-x-4 mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">🎬 PROFESSIONAL STARTUP DEMO</span>
              {isSpeaking && (
                <div className="flex items-center space-x-1">
                  <Mic className="w-4 h-4 text-green-400 animate-pulse" />
                  <span className="text-xs text-green-400">AI Narrator</span>
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
                onClick={toggleSpeech}
                className={`p-2 rounded-lg transition-colors ${speechEnabled ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
              >
                {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
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
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-2 rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Professional Narration Box */}
      {showNarration && currentNarration && (
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="absolute bottom-4 left-4 max-w-md bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-200 pointer-events-auto"
        >
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
              {isSpeaking ? (
                <Mic className="w-5 h-5 text-purple-600 animate-pulse" />
              ) : (
                <Volume2 className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">Professional AI Narrator</h4>
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

      {/* Floating Professional Cursors */}
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
                className="w-6 h-6 drop-shadow-lg transform -rotate-12"
                style={{ color: cursor.color }}
              />
              <div 
                className="absolute top-6 left-2 px-3 py-1 rounded-lg text-white text-xs font-medium whitespace-nowrap shadow-lg border border-white/20"
                style={{ backgroundColor: cursor.color }}
              >
                {cursor.name}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* New Session Modal */}
      <AnimatePresence>
        {showNewSessionModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center z-45"
          >
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold mb-4">Create New Session</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session Name</label>
                  <input
                    type="text"
                    value={newSessionName}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter session name..."
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowNewSessionModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowNewSessionModal(false);
                      setCanvasChanged(true);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Create Session
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar Content Simulation */}
      <AnimatePresence>
        {sidebarActiveItem !== 'current' && (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="absolute left-4 top-20 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-40"
          >
            <h4 className="font-semibold text-gray-900 mb-3 capitalize">
              {sidebarActiveItem.replace('-', ' ')} Content
            </h4>
            {sidebarActiveItem === 'recent' && (
              <div className="space-y-2">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h5 className="font-medium">Product Strategy Session</h5>
                  <p className="text-sm text-gray-500">2 days ago • 8 participants</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h5 className="font-medium">Design Sprint Workshop</h5>
                  <p className="text-sm text-gray-500">1 week ago • 12 participants</p>
                </div>
                {searchQuery && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <h5 className="font-medium text-blue-900">Search Results for "{searchQuery}"</h5>
                    <p className="text-sm text-blue-700">Found 3 matching sessions</p>
                  </div>
                )}
              </div>
            )}
            {sidebarActiveItem === 'starred' && (
              <div className="space-y-2">
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <h5 className="font-medium">Customer Journey Workshop</h5>
                  </div>
                  <p className="text-sm text-gray-500">Starred 3 days ago</p>
                </div>
              </div>
            )}
            {sidebarActiveItem === 'templates' && (
              <div className="space-y-2">
                <div className="p-3 bg-green-50 rounded-lg">
                  <h5 className="font-medium">Brainstorming Template</h5>
                  <p className="text-sm text-gray-500">67 uses • Popular</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <h5 className="font-medium">Design Sprint Template</h5>
                  <p className="text-sm text-gray-500">32 uses • Recommended</p>
                </div>
              </div>
            )}
            {sidebarActiveItem === 'team' && (
              <div className="space-y-2">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <h5 className="font-medium">Product Team</h5>
                  <p className="text-sm text-gray-500">15 members • 8 active sessions</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <h5 className="font-medium">Design Team</h5>
                  <p className="text-sm text-gray-500">12 members • 5 active sessions</p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mermaid Chart Display */}
      <AnimatePresence>
        {mermaidChart && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 shadow-xl border border-gray-200 z-35"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="w-5 h-5 text-purple-600" />
              <h4 className="font-semibold text-gray-900">AI-Generated Flowchart</h4>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
              {mermaidChart}
            </div>
            <p className="text-xs text-gray-500 mt-2">Generated from AI prompt: "Create user flow diagram"</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Prompt Interface */}
      <AnimatePresence>
        {aiPromptShown && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-20 right-4 w-80 bg-white rounded-xl p-4 shadow-xl border border-gray-200 z-35"
          >
            <div className="flex items-center space-x-2 mb-3">
              <Brain className="w-5 h-5 text-purple-600" />
              <h4 className="font-semibold text-gray-900">AI Prompt Interface</h4>
            </div>
            <div className="space-y-3">
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                placeholder="Ask AI to analyze ideas, create charts, or provide insights..."
                rows={3}
              />
              <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Generate AI Response
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auto-generated Ideas with Enhanced Reactions */}
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
            <div className="w-64 bg-yellow-100 border-2 border-yellow-300 rounded-xl p-4 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-yellow-800">{idea.author}</span>
                <div className="flex items-center space-x-2">
                  {starredIdeas.includes(idea.id) && (
                    <Star className="w-4 h-4 text-yellow-600 fill-current" />
                  )}
                  <div className="flex items-center space-x-1 bg-yellow-200 px-2 py-1 rounded-full">
                    <ChevronUp className="w-3 h-3 text-yellow-700" />
                    <span className="text-xs font-bold text-yellow-700">{idea.votes}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-yellow-900 mb-2">{idea.text}</p>
              
              {/* Enhanced Emoji Reactions */}
              <div className="flex items-center space-x-1 flex-wrap">
                {emojiReactions
                  .filter(reaction => reaction.target === idea.id)
                  .map((reaction, index) => (
                    <motion.span 
                      key={index} 
                      className="text-lg"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {reaction.emoji}
                    </motion.span>
                  ))}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Created Shapes with Labels */}
      <AnimatePresence>
        {createdShapes.map((shape) => (
          <motion.div
            key={shape.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute pointer-events-none z-25"
            style={{
              left: shape.position.x,
              top: shape.position.y,
              width: shape.size.width,
              height: shape.size.height,
            }}
          >
            <div 
              className={`w-full h-full border-2 border-blue-500 bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-800 ${
                shape.type === 'circle' ? 'rounded-full' : 'rounded-lg'
              }`}
            >
              {shape.type === 'rectangle' ? 'User Research' : 'AI Analysis'}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Enhanced Curved Connections */}
      <AnimatePresence>
        {connections.map((connection) => (
          <motion.svg
            key={connection.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute pointer-events-none z-24"
            style={{
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
            }}
          >
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#3B82F6" />
              </marker>
            </defs>
            <path
              d={`M ${connection.from.x} ${connection.from.y} Q ${(connection.from.x + connection.to.x) / 2} ${connection.from.y - 50} ${connection.to.x} ${connection.to.y}`}
              stroke="#3B82F6"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              markerEnd="url(#arrowhead)"
              className="drop-shadow-sm"
            />
          </motion.svg>
        ))}
      </AnimatePresence>

      {/* Enhanced AI Comments */}
      <AnimatePresence>
        {aiComments.map((comment) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute pointer-events-none z-35"
            style={{
              left: comment.position.x,
              top: comment.position.y,
            }}
          >
            <div className="max-w-xs bg-gradient-to-br from-purple-100 to-blue-100 border-2 border-purple-300 rounded-lg p-3 shadow-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Brain className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-medium text-purple-800">AI Assistant</span>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              </div>
              <p className="text-xs text-purple-700 leading-relaxed">{comment.text}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Regular Comments */}
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

      {/* Canvas Change Notification */}
      {canvasChanged && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-40"
        >
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">New Blank Canvas Created!</span>
          </div>
        </motion.div>
      )}

      {/* Enhanced Highlight Overlays */}
      {highlightedElement && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 pointer-events-none z-45"
        >
          <div className="absolute inset-0 bg-blue-500/20 animate-pulse rounded-lg" />
          <div className="absolute inset-0 border-4 border-blue-500 rounded-lg animate-pulse shadow-lg" />
          
          {/* Enhanced Corner Indicators */}
          <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full animate-ping shadow-lg" />
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full animate-ping shadow-lg" style={{ animationDelay: '0.5s' }} />
          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500 rounded-full animate-ping shadow-lg" style={{ animationDelay: '1s' }} />
          <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 rounded-full animate-ping shadow-lg" style={{ animationDelay: '1.5s' }} />
        </motion.div>
      )}

      {/* Session Switch Notification */}
      {sessionSwitched && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-40"
        >
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Session Switched Successfully!</span>
          </div>
        </motion.div>
      )}

      {/* Enhanced Feature Callouts */}
      <AnimatePresence>
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-xl shadow-xl max-w-xs pointer-events-none"
          >
            <div className="flex items-center space-x-2 mb-2">
              <Folder className="w-5 h-5" />
              <span className="font-semibold">Complete Sidebar Navigation</span>
            </div>
            <p className="text-sm opacity-90">
              Actually clicking through every sidebar section: Current Session, Recent Sessions, Starred, Templates, Team Spaces, and AI Insights.
            </p>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 rounded-xl shadow-xl max-w-xs pointer-events-none"
          >
            <div className="flex items-center space-x-2 mb-2">
              <Plus className="w-5 h-5" />
              <span className="font-semibold">New Session Creation</span>
            </div>
            <p className="text-sm opacity-90">
              Actually creating a new session with custom name and showing blank canvas transition.
            </p>
          </motion.div>
        )}

        {currentStep === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl shadow-xl max-w-xs pointer-events-none"
          >
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-5 h-5" />
              <span className="font-semibold">Live Collaboration Panel</span>
            </div>
            <p className="text-sm opacity-90">
              Opening collaboration panel with team features, chat, and real-time interaction tools.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Demo Completion */}
      {currentStep === demoSteps.length - 1 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 bg-black/60 flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-2xl p-8 max-w-lg text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">🎉 Demo Complete!</h2>
            <p className="text-gray-600 mb-6">
              You've experienced the complete MindMeld Enterprise platform with every feature demonstrated. Ready to revolutionize your team's collaboration?
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="font-semibold text-blue-900">✅ Sidebar Explored</div>
                <div className="text-blue-700">All sections clicked & shown</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="font-semibold text-green-900">✅ Session Created</div>
                <div className="text-green-700">New blank canvas demonstrated</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="font-semibold text-purple-900">✅ AI Features</div>
                <div className="text-purple-700">Complete AI workflow shown</div>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <div className="font-semibold text-orange-900">✅ Collaboration</div>
                <div className="text-orange-700">Team panel & interactions</div>
              </div>
            </div>
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