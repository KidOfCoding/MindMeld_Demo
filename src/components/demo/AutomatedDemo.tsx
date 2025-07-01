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
  MousePointer2
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
  type: 'cursor' | 'click' | 'type' | 'highlight' | 'panel' | 'wait' | 'idea' | 'vote' | 'comment' | 'session' | 'sidebar' | 'search' | 'shape' | 'connect' | 'ai-comment' | 'emoji' | 'star' | 'speech';
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
  
  const demoRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const demoSteps: DemoStep[] = [
    {
      id: 'startup-intro',
      title: '🚀 MindMeld Enterprise - Startup Demo',
      description: 'Revolutionary AI-powered collaborative platform',
      duration: 8000,
      interactive: true,
      narration: 'Welcome to MindMeld Enterprise! The most advanced collaborative ideation platform that transforms how teams think together and make decisions. Watch as we demonstrate every feature in this comprehensive startup presentation.',
      actions: [
        { type: 'speech', speechText: 'Welcome to MindMeld Enterprise! The most advanced collaborative ideation platform that transforms how teams think together and make decisions.', delay: 1000 },
        { type: 'highlight', target: 'navbar', delay: 2000 },
        { type: 'highlight', target: 'logo', delay: 3000 },
        { type: 'cursor', position: { x: 400, y: 300 }, user: 'Sarah Chen', color: '#10B981', delay: 4000 },
        { type: 'cursor', position: { x: 600, y: 400 }, user: 'Marcus Rodriguez', color: '#F59E0B', delay: 5000 },
        { type: 'cursor', position: { x: 350, y: 250 }, user: 'AI Assistant', color: '#8B5CF6', delay: 6000 }
      ]
    },
    {
      id: 'sidebar-exploration',
      title: '📂 Complete Sidebar Navigation',
      description: 'Exploring every sidebar feature interactively',
      duration: 15000,
      interactive: true,
      narration: 'Let me show you our comprehensive sidebar navigation. We will explore Current Session, Recent Sessions, Starred items, Templates, Team Spaces, and AI Insights - every feature that makes MindMeld powerful.',
      actions: [
        { type: 'speech', speechText: 'Now let me show you our comprehensive sidebar navigation with all professional features.', delay: 500 },
        { type: 'cursor', position: { x: 150, y: 200 }, user: 'Demo Guide', color: '#3B82F6', delay: 1000 },
        { type: 'sidebar', target: 'current', delay: 2000 },
        { type: 'highlight', target: 'current-session', delay: 2500 },
        { type: 'sidebar', target: 'recent', delay: 4000 },
        { type: 'highlight', target: 'recent-sessions', delay: 4500 },
        { type: 'search', text: 'Product Strategy', delay: 6000 },
        { type: 'sidebar', target: 'starred', delay: 8000 },
        { type: 'highlight', target: 'starred-items', delay: 8500 },
        { type: 'sidebar', target: 'templates', delay: 10000 },
        { type: 'highlight', target: 'template-gallery', delay: 10500 },
        { type: 'sidebar', target: 'team', delay: 12000 },
        { type: 'highlight', target: 'team-spaces', delay: 12500 },
        { type: 'sidebar', target: 'ai-insights', delay: 14000 }
      ]
    },
    {
      id: 'session-management',
      title: '🎯 Professional Session Management',
      description: 'Creating new sessions and switching between projects',
      duration: 12000,
      interactive: true,
      narration: 'Watch as we create a new session with a custom name and demonstrate seamless session switching. This shows how teams can manage multiple projects simultaneously.',
      actions: [
        { type: 'speech', speechText: 'Now I will demonstrate our professional session management by creating a new session and switching between projects.', delay: 500 },
        { type: 'cursor', position: { x: 200, y: 150 }, user: 'Project Manager', color: '#EF4444', delay: 1000 },
        { type: 'click', target: 'new-session-button', delay: 2000 },
        { type: 'type', text: 'AI Innovation Workshop 2024', target: 'session-name-input', delay: 3500 },
        { type: 'click', target: 'create-session-confirm', delay: 5000 },
        { type: 'session', target: 'new-session-created', delay: 6000 },
        { type: 'highlight', target: 'session-dropdown', delay: 7500 },
        { type: 'click', target: 'session-selector', delay: 8500 },
        { type: 'session', target: 'design-sprint-session', delay: 10000 },
        { type: 'highlight', target: 'active-session-indicator', delay: 11000 }
      ]
    },
    {
      id: 'canvas-collaboration',
      title: '🎨 Interactive Canvas & Collaboration',
      description: 'Real-time drawing, shapes, and team collaboration',
      duration: 18000,
      interactive: true,
      narration: 'Experience our professional Miro-style canvas with real-time collaboration. Watch as team members create shapes, connect them with curved lines, and collaborate seamlessly.',
      actions: [
        { type: 'speech', speechText: 'Now experience our professional Miro-style canvas with real-time collaboration and advanced drawing tools.', delay: 500 },
        { type: 'cursor', position: { x: 500, y: 300 }, user: 'Sarah Chen', color: '#10B981', delay: 1000 },
        { type: 'click', target: 'rectangle-tool', delay: 2000 },
        { type: 'shape', shapeType: 'rectangle', position: { x: 400, y: 250 }, delay: 3000 },
        { type: 'cursor', position: { x: 700, y: 350 }, user: 'Marcus Rodriguez', color: '#F59E0B', delay: 4500 },
        { type: 'click', target: 'circle-tool', delay: 5000 },
        { type: 'shape', shapeType: 'circle', position: { x: 650, y: 300 }, delay: 6000 },
        { type: 'cursor', position: { x: 550, y: 400 }, user: 'Emily Watson', color: '#EF4444', delay: 7500 },
        { type: 'click', target: 'arrow-tool', delay: 8000 },
        { type: 'connect', connectionType: 'curved', from: { x: 450, y: 300 }, to: { x: 650, y: 350 }, delay: 9000 },
        { type: 'click', target: 'text-tool', delay: 11000 },
        { type: 'type', text: 'User Journey Flow', position: { x: 500, y: 200 }, delay: 12000 },
        { type: 'idea', position: { x: 300, y: 450 }, text: 'AI-powered user onboarding system', user: 'Sarah Chen', delay: 14000 },
        { type: 'idea', position: { x: 750, y: 450 }, text: 'Mobile-first design with dark mode', user: 'Marcus Rodriguez', delay: 15500 },
        { type: 'emoji', target: 'idea-1', emoji: '👍', user: 'Emily Watson', delay: 17000 }
      ]
    },
    {
      id: 'ai-insights-demo',
      title: '🧠 Advanced AI Insights & Analysis',
      description: 'AI-powered analysis with team member AI comments',
      duration: 20000,
      interactive: true,
      narration: 'Watch our revolutionary AI system analyze ideas and provide intelligent insights. Our AI acts like a team member, providing comments, suggestions, and breakthrough recommendations.',
      actions: [
        { type: 'speech', speechText: 'Now witness our revolutionary AI system that analyzes ideas and provides intelligent insights like a real team member.', delay: 500 },
        { type: 'panel', target: 'ai-panel', delay: 1500 },
        { type: 'cursor', position: { x: 1200, y: 300 }, user: 'AI Assistant', color: '#8B5CF6', delay: 2500 },
        { type: 'click', target: 'generate-insights', delay: 3500 },
        { type: 'ai-comment', text: 'I notice strong themes around user experience and AI integration. These ideas could create a powerful synergy.', user: 'AI Assistant', position: { x: 400, y: 350 }, delay: 6000 },
        { type: 'highlight', target: 'ai-themes', delay: 8000 },
        { type: 'ai-comment', text: 'Based on market analysis, the AI-powered onboarding has 94% success potential. I recommend prioritizing this.', user: 'AI Assistant', position: { x: 600, y: 400 }, delay: 10000 },
        { type: 'highlight', target: 'ai-breakthrough', delay: 12000 },
        { type: 'vote', target: 'idea-1', user: 'AI Assistant', delay: 14000 },
        { type: 'star', target: 'idea-1', user: 'AI Assistant', delay: 15000 },
        { type: 'ai-comment', text: 'This aligns perfectly with current market trends. 89% confidence in user adoption.', user: 'AI Assistant', position: { x: 350, y: 500 }, delay: 16500 },
        { type: 'highlight', target: 'ai-recommendations', delay: 18000 }
      ]
    },
    {
      id: 'team-reactions',
      title: '💫 Team Reactions & Engagement',
      description: 'Emoji reactions, starring, and team engagement',
      duration: 12000,
      interactive: true,
      narration: 'See how teams engage with ideas through emoji reactions, starring favorites, and collaborative voting. This creates an engaging decision-making process.',
      actions: [
        { type: 'speech', speechText: 'Watch how teams engage with ideas through emoji reactions, starring, and collaborative voting for better decision making.', delay: 500 },
        { type: 'cursor', position: { x: 350, y: 450 }, user: 'Sarah Chen', color: '#10B981', delay: 1000 },
        { type: 'emoji', target: 'idea-1', emoji: '❤️', user: 'Sarah Chen', delay: 2000 },
        { type: 'cursor', position: { x: 750, y: 450 }, user: 'Marcus Rodriguez', color: '#F59E0B', delay: 3000 },
        { type: 'emoji', target: 'idea-2', emoji: '🚀', user: 'Marcus Rodriguez', delay: 3500 },
        { type: 'cursor', position: { x: 350, y: 450 }, user: 'Emily Watson', color: '#EF4444', delay: 4500 },
        { type: 'emoji', target: 'idea-1', emoji: '⭐', user: 'Emily Watson', delay: 5000 },
        { type: 'star', target: 'idea-1', user: 'Sarah Chen', delay: 6500 },
        { type: 'star', target: 'idea-2', user: 'Marcus Rodriguez', delay: 7500 },
        { type: 'vote', target: 'idea-1', user: 'Emily Watson', delay: 8500 },
        { type: 'vote', target: 'idea-1', user: 'Marcus Rodriguez', delay: 9500 },
        { type: 'emoji', target: 'idea-1', emoji: '🏆', user: 'AI Assistant', delay: 10500 }
      ]
    },
    {
      id: 'decision-finalization',
      title: '✅ Decision Finalization Process',
      description: 'How ideas are finalized and decisions are made',
      duration: 10000,
      interactive: true,
      narration: 'Watch the complete decision-making process as the team finalizes their top idea. This shows how MindMeld transforms brainstorming into actionable decisions.',
      actions: [
        { type: 'speech', speechText: 'Now see the complete decision-making process as the team finalizes their top idea and creates actionable next steps.', delay: 500 },
        { type: 'highlight', target: 'top-idea', delay: 1500 },
        { type: 'cursor', position: { x: 350, y: 450 }, user: 'Project Manager', color: '#3B82F6', delay: 2500 },
        { type: 'comment', text: 'This is our winner! Let\'s move forward with AI-powered onboarding.', user: 'Project Manager', position: { x: 350, y: 500 }, delay: 3500 },
        { type: 'ai-comment', text: 'Excellent choice! I recommend starting with user research and MVP development. Timeline: 2-3 weeks.', user: 'AI Assistant', position: { x: 400, y: 550 }, delay: 5500 },
        { type: 'highlight', target: 'finalized-decision', delay: 7500 },
        { type: 'click', target: 'export-decision', delay: 8500 },
        { type: 'highlight', target: 'export-options', delay: 9000 }
      ]
    },
    {
      id: 'startup-conclusion',
      title: '🎉 MindMeld Enterprise - Complete Solution',
      description: 'Revolutionary platform for modern teams',
      duration: 8000,
      interactive: true,
      narration: 'MindMeld Enterprise transforms how teams collaborate, think, and decide. With AI-powered insights, real-time collaboration, and professional workflows, we are revolutionizing team productivity.',
      actions: [
        { type: 'speech', speechText: 'MindMeld Enterprise transforms how teams collaborate, think, and decide. We are revolutionizing team productivity for the future of work.', delay: 1000 },
        { type: 'highlight', target: 'entire-app', delay: 2000 },
        { type: 'cursor', position: { x: 400, y: 300 }, user: 'All Team Members', color: '#8B5CF6', delay: 4000 },
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

  // Speech synthesis
  const speak = (text: string) => {
    if (!speechEnabled || !window.speechSynthesis) return;
    
    // Stop any current speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 0.8;
    
    // Try to use a professional voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') || 
      voice.name.includes('Microsoft') ||
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

      case 'sidebar':
        setSidebarActiveItem(action.target || 'current');
        setHighlightedElement(`sidebar-${action.target}`);
        setTimeout(() => setHighlightedElement(null), 2000);
        break;

      case 'search':
        if (action.text) {
          setSearchQuery(action.text);
          setTimeout(() => setSearchQuery(''), 3000);
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
            type: action.connectionType || 'straight'
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
          document.dispatchEvent(new CustomEvent('demo-open-ai-panel'));
        } else if (action.target === 'comments-panel') {
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
          className="bg-black/95 backdrop-blur-sm text-white rounded-xl p-4 shadow-2xl border border-white/20 max-w-2xl"
        >
          <div className="flex items-center space-x-4 mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">🎬 PROFESSIONAL DEMO</span>
              {isSpeaking && (
                <div className="flex items-center space-x-1">
                  <Mic className="w-4 h-4 text-green-400 animate-pulse" />
                  <span className="text-xs text-green-400">AI Speaking</span>
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
        >
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              {isSpeaking ? (
                <Mic className="w-5 h-5 text-blue-600 animate-pulse" />
              ) : (
                <Volume2 className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">AI Narrator</h4>
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
            className="absolute pointer-events-none z-40"
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
                    <TrendingUp className="w-3 h-3 text-yellow-700" />
                    <span className="text-xs font-bold text-yellow-700">{idea.votes}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-yellow-900 mb-2">{idea.text}</p>
              
              {/* Emoji Reactions */}
              <div className="flex items-center space-x-1">
                {emojiReactions
                  .filter(reaction => reaction.target === idea.id)
                  .map((reaction, index) => (
                    <span key={index} className="text-lg animate-bounce" style={{ animationDelay: `${index * 0.1}s` }}>
                      {reaction.emoji}
                    </span>
                  ))}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Created Shapes */}
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
              className={`w-full h-full border-2 border-blue-500 bg-blue-100 ${
                shape.type === 'circle' ? 'rounded-full' : 'rounded-lg'
              }`}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Curved Connections */}
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
            <path
              d={`M ${connection.from.x} ${connection.from.y} Q ${(connection.from.x + connection.to.x) / 2} ${connection.from.y - 50} ${connection.to.x} ${connection.to.y}`}
              stroke="#3B82F6"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              markerEnd="url(#arrowhead)"
            />
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#3B82F6" />
              </marker>
            </defs>
          </motion.svg>
        ))}
      </AnimatePresence>

      {/* AI Comments */}
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
            <div className="max-w-xs bg-purple-100 border-2 border-purple-300 rounded-lg p-3 shadow-lg">
              <div className="flex items-center space-x-2 mb-1">
                <Brain className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-medium text-purple-800">AI Assistant</span>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              </div>
              <p className="text-xs text-purple-700">{comment.text}</p>
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

      {/* Highlight Overlays */}
      {highlightedElement && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 pointer-events-none z-45"
        >
          <div className="absolute inset-0 bg-blue-500/20 animate-pulse rounded-lg" />
          <div className="absolute inset-0 border-4 border-blue-500 rounded-lg animate-pulse" />
          
          {/* Corner Indicators */}
          <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full animate-ping" />
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
          <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 rounded-full animate-ping" style={{ animationDelay: '1.5s' }} />
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

      {/* Feature Callouts */}
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
              Exploring every sidebar feature: Current Session, Recent Sessions, Starred, Templates, Team Spaces, and AI Insights.
            </p>
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 rounded-xl shadow-xl max-w-xs pointer-events-none"
          >
            <div className="flex items-center space-x-2 mb-2">
              <Palette className="w-5 h-5" />
              <span className="font-semibold">Professional Canvas Tools</span>
            </div>
            <p className="text-sm opacity-90">
              Real-time collaboration with shapes, curved connections, and professional drawing tools.
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
              <Brain className="w-5 h-5" />
              <span className="font-semibold">AI Team Member</span>
            </div>
            <p className="text-sm opacity-90">
              Our AI acts like a real team member, providing insights, comments, and recommendations.
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
          <div className="bg-white rounded-2xl p-8 max-w-md text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">🎉 Demo Complete!</h2>
            <p className="text-gray-600 mb-6">
              You've experienced the complete MindMeld Enterprise platform. Ready to revolutionize your team's collaboration?
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