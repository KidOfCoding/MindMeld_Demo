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
  TrendingUp
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
  type: 'cursor' | 'click' | 'type' | 'highlight' | 'panel' | 'wait' | 'idea' | 'vote' | 'comment' | 'session';
  target?: string;
  position?: { x: number; y: number };
  text?: string;
  delay?: number;
  user?: string;
  color?: string;
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
  const [showNarration, setShowNarration] = useState(true);
  const [currentNarration, setCurrentNarration] = useState('');
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [autoIdeas, setAutoIdeas] = useState<any[]>([]);
  const [sessionSwitched, setSessionSwitched] = useState(false);
  
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
        { type: 'highlight', target: 'navbar', delay: 1000 },
        { type: 'highlight', target: 'logo', delay: 2000 },
        { type: 'cursor', position: { x: 400, y: 300 }, user: 'Sarah Chen', color: '#10B981', delay: 3000 },
        { type: 'cursor', position: { x: 600, y: 400 }, user: 'Marcus Rodriguez', color: '#F59E0B', delay: 4000 },
        { type: 'wait', delay: 2000 }
      ]
    },
    {
      id: 'collaboration',
      title: 'Real-Time Collaboration',
      description: 'Multiple team members working together seamlessly',
      duration: 12000,
      narration: 'See how team members collaborate in real-time. Each person has their own cursor color and can add ideas simultaneously.',
      actions: [
        { type: 'cursor', position: { x: 200, y: 200 }, user: 'Sarah Chen', color: '#10B981', delay: 500 },
        { type: 'idea', position: { x: 200, y: 200 }, text: 'AI-powered user onboarding system', user: 'Sarah Chen', delay: 1000 },
        { type: 'cursor', position: { x: 500, y: 300 }, user: 'Marcus Rodriguez', color: '#F59E0B', delay: 2000 },
        { type: 'idea', position: { x: 500, y: 300 }, text: 'Mobile-first design with dark mode', user: 'Marcus Rodriguez', delay: 2500 },
        { type: 'cursor', position: { x: 350, y: 450 }, user: 'Emily Watson', color: '#EF4444', delay: 4000 },
        { type: 'idea', position: { x: 350, y: 450 }, text: 'Voice-to-text functionality', user: 'Emily Watson', delay: 4500 },
        { type: 'vote', target: 'idea-1', user: 'Marcus Rodriguez', delay: 6000 },
        { type: 'vote', target: 'idea-1', user: 'Emily Watson', delay: 6500 },
        { type: 'vote', target: 'idea-2', user: 'Sarah Chen', delay: 7000 },
        { type: 'highlight', target: 'collaborator-panel', delay: 8000 }
      ]
    },
    {
      id: 'canvas-tools',
      title: 'Professional Canvas Tools',
      description: 'Miro-style canvas with advanced drawing and shape tools',
      duration: 10000,
      narration: 'Our professional canvas offers Miro-style tools for creating diagrams, flowcharts, and visual representations of your ideas.',
      actions: [
        { type: 'highlight', target: 'canvas-toolbar', delay: 500 },
        { type: 'cursor', position: { x: 300, y: 250 }, user: 'Sarah Chen', color: '#10B981', delay: 1000 },
        { type: 'click', target: 'rectangle-tool', delay: 1500 },
        { type: 'cursor', position: { x: 400, y: 300 }, user: 'Sarah Chen', color: '#10B981', delay: 2000 },
        { type: 'cursor', position: { x: 600, y: 400 }, user: 'Marcus Rodriguez', color: '#F59E0B', delay: 3000 },
        { type: 'click', target: 'arrow-tool', delay: 3500 },
        { type: 'cursor', position: { x: 700, y: 350 }, user: 'Emily Watson', color: '#EF4444', delay: 5000 },
        { type: 'click', target: 'text-tool', delay: 5500 },
        { type: 'type', text: 'User Journey Flow', delay: 6000 },
        { type: 'highlight', target: 'canvas-area', delay: 7000 }
      ]
    },
    {
      id: 'ai-insights',
      title: 'AI-Powered Insights',
      description: 'Generate intelligent analysis and breakthrough insights',
      duration: 15000,
      narration: 'Watch as our AI analyzes all ideas and generates powerful insights, identifying themes, contradictions, and breakthrough opportunities.',
      actions: [
        { type: 'panel', target: 'ai-panel', delay: 1000 },
        { type: 'highlight', target: 'ai-button', delay: 1500 },
        { type: 'cursor', position: { x: 1200, y: 300 }, user: 'AI Assistant', color: '#8B5CF6', delay: 2000 },
        { type: 'click', target: 'generate-insights', delay: 2500 },
        { type: 'wait', delay: 3000 },
        { type: 'highlight', target: 'ai-themes', delay: 6000 },
        { type: 'highlight', target: 'ai-contradictions', delay: 8000 },
        { type: 'highlight', target: 'ai-breakthrough', delay: 10000 },
        { type: 'highlight', target: 'ai-recommendations', delay: 12000 }
      ]
    },
    {
      id: 'comments-feedback',
      title: 'Comments & Feedback System',
      description: 'Rich commenting and feedback capabilities',
      duration: 8000,
      narration: 'Team members can add contextual comments and feedback directly on the canvas, creating rich discussions around ideas.',
      actions: [
        { type: 'cursor', position: { x: 250, y: 250 }, user: 'Marcus Rodriguez', color: '#F59E0B', delay: 1000 },
        { type: 'comment', position: { x: 250, y: 250 }, text: 'This idea aligns perfectly with our Q4 goals!', user: 'Marcus Rodriguez', delay: 1500 },
        { type: 'cursor', position: { x: 550, y: 350 }, user: 'Emily Watson', color: '#EF4444', delay: 3000 },
        { type: 'comment', position: { x: 550, y: 350 }, text: 'We should consider mobile-first approach here', user: 'Emily Watson', delay: 3500 },
        { type: 'panel', target: 'comments-panel', delay: 5000 },
        { type: 'highlight', target: 'comment-system', delay: 6000 }
      ]
    },
    {
      id: 'session-management',
      title: 'Advanced Session Management',
      description: 'Switch between projects and manage multiple sessions',
      duration: 10000,
      narration: 'Easily manage multiple brainstorming sessions and switch between different projects with our advanced session management.',
      actions: [
        { type: 'highlight', target: 'session-selector', delay: 1000 },
        { type: 'cursor', position: { x: 300, y: 60 }, user: 'Sarah Chen', color: '#10B981', delay: 2000 },
        { type: 'click', target: 'session-dropdown', delay: 2500 },
        { type: 'session', target: 'design-sprint-session', delay: 3500 },
        { type: 'wait', delay: 2000 },
        { type: 'highlight', target: 'sidebar', delay: 6000 },
        { type: 'highlight', target: 'recent-sessions', delay: 7500 }
      ]
    },
    {
      id: 'export-share',
      title: 'Export & Sharing',
      description: 'Professional export options and seamless sharing',
      duration: 8000,
      narration: 'Export your collaborative sessions in multiple formats and share them with stakeholders instantly.',
      actions: [
        { type: 'highlight', target: 'export-button', delay: 1000 },
        { type: 'cursor', position: { x: 800, y: 60 }, user: 'Sarah Chen', color: '#10B981', delay: 2000 },
        { type: 'click', target: 'export-menu', delay: 2500 },
        { type: 'highlight', target: 'export-options', delay: 3500 },
        { type: 'highlight', target: 'share-button', delay: 5000 },
        { type: 'click', target: 'share-link', delay: 6000 }
      ]
    },
    {
      id: 'analytics-insights',
      title: 'Team Analytics & Metrics',
      description: 'Comprehensive collaboration analytics',
      duration: 10000,
      narration: 'Get detailed analytics on team collaboration patterns, participation rates, and idea diversity metrics.',
      actions: [
        { type: 'panel', target: 'ai-panel', delay: 1000 },
        { type: 'click', target: 'analytics-tab', delay: 2000 },
        { type: 'highlight', target: 'priority-matrix', delay: 3500 },
        { type: 'click', target: 'collaboration-tab', delay: 5000 },
        { type: 'highlight', target: 'team-metrics', delay: 6500 },
        { type: 'highlight', target: 'participation-rate', delay: 8000 }
      ]
    },
    {
      id: 'demo-complete',
      title: 'Demo Complete',
      description: 'Thank you for watching MindMeld Enterprise',
      duration: 5000,
      narration: 'Thank you for experiencing MindMeld Enterprise - where teams think together and decide smarter. Ready to transform your collaboration?',
      actions: [
        { type: 'highlight', target: 'entire-app', delay: 1000 },
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
          setAutoIdeas(prev => [...prev, {
            id: `auto-idea-${Date.now()}`,
            text: action.text,
            position: action.position,
            author: action.user,
            votes: 0,
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
        setAutoIdeas(prev => prev.map(idea => 
          idea.id === action.target 
            ? { ...idea, votes: idea.votes + 1 }
            : idea
        ));
        break;

      case 'highlight':
        setHighlightedElement(action.target || null);
        setTimeout(() => setHighlightedElement(null), 2000);
        break;

      case 'session':
        setSessionSwitched(true);
        setTimeout(() => setSessionSwitched(false), 3000);
        break;

      case 'panel':
        // Trigger panel opening
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
  };

  const currentStepData = demoSteps[currentStep];

  return (
    <div ref={demoRef} className="fixed inset-0 z-50 pointer-events-none">
      {/* Demo Controls */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 pointer-events-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-black/90 backdrop-blur-sm text-white rounded-xl p-4 shadow-2xl border border-white/20"
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

      {/* Auto-generated Ideas */}
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
                <div className="flex items-center space-x-1 bg-yellow-200 px-2 py-1 rounded-full">
                  <TrendingUp className="w-3 h-3 text-yellow-700" />
                  <span className="text-xs font-bold text-yellow-700">{idea.votes}</span>
                </div>
              </div>
              <p className="text-sm text-yellow-900">{idea.text}</p>
            </div>
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
          className="absolute inset-0 pointer-events-none z-20"
        >
          <div className="absolute inset-0 bg-blue-500/20 animate-pulse rounded-lg" />
          <div className="absolute inset-0 border-4 border-blue-500 rounded-lg animate-pulse" />
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
            <span className="font-medium">Switched to Design Sprint Session</span>
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
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 rounded-xl shadow-xl max-w-xs pointer-events-none"
          >
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-5 h-5" />
              <span className="font-semibold">Real-Time Collaboration</span>
            </div>
            <p className="text-sm opacity-90">
              Watch multiple team members add ideas simultaneously with live cursors and instant updates.
            </p>
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl shadow-xl max-w-xs pointer-events-none"
          >
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="w-5 h-5" />
              <span className="font-semibold">AI-Powered Insights</span>
            </div>
            <p className="text-sm opacity-90">
              Our AI analyzes all ideas to identify themes, contradictions, and breakthrough opportunities.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Demo Completion */}
      {currentStep === demoSteps.length - 1 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-2xl p-8 max-w-md text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Demo Complete!</h2>
            <p className="text-gray-600 mb-6">
              You've seen the power of MindMeld Enterprise. Ready to transform your team's collaboration?
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