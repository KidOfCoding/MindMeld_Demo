import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Eye, Settings, Volume2, VolumeX, Crown, Zap, Users, Brain, Target, Award, Sparkles, Clock } from 'lucide-react';
import { AutomatedDemo } from './AutomatedDemo';

interface DemoModeWrapperProps {
  children: React.ReactNode;
}

export const DemoModeWrapper: React.FC<DemoModeWrapperProps> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [showDemoPrompt, setShowDemoPrompt] = useState(true);
  const [demoSettings, setDemoSettings] = useState({
    autoStart: true,
    showNarration: true,
    playSound: false,
    speed: 1
  });

  // Auto-show demo prompt after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDemoPrompt(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const startDemo = () => {
    setIsDemoMode(true);
    setShowDemoPrompt(false);
  };

  const endDemo = () => {
    setIsDemoMode(false);
  };

  return (
    <div className="relative">
      {children}

      {/* Demo Mode Overlay */}
      {isDemoMode && (
        <AutomatedDemo onDemoComplete={endDemo} />
      )}

      {/* Demo Prompt - Responsive and properly sized */}
      <AnimatePresence>
        {showDemoPrompt && !isDemoMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            style={{ zIndex: 10002 }}
          >
            <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-50 rounded-2xl"></div>
              
              <div className="relative z-10">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-full flex items-center justify-center relative">
                    <Play className="w-8 h-8 text-white" />
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Crown className="w-3 h-3 text-yellow-800" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    🎯 Professional Demo Mode
                  </h2>
                  <p className="text-gray-600 mb-2">
                    Perfect 15-minute automated presentation for judges
                  </p>
                  <div className="inline-flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-800">Enterprise Edition</span>
                  </div>
                </div>

                {/* Demo Features Showcase */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <Users className="w-5 h-5 text-blue-600 mb-2" />
                    <h4 className="font-semibold text-blue-900 text-sm">Live Collaboration</h4>
                    <p className="text-xs text-blue-700">Multiple floating cursors & real-time interactions</p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                    <Brain className="w-5 h-5 text-purple-600 mb-2" />
                    <h4 className="font-semibold text-purple-900 text-sm">AI Insights</h4>
                    <p className="text-xs text-purple-700">Automated analysis & breakthrough recommendations</p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                    <Target className="w-5 h-5 text-green-600 mb-2" />
                    <h4 className="font-semibold text-green-900 text-sm">Complete Workflow</h4>
                    <p className="text-xs text-green-700">Idea creation to final decision process</p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                    <Award className="w-5 h-5 text-orange-600 mb-2" />
                    <h4 className="font-semibold text-orange-900 text-sm">Professional UI</h4>
                    <p className="text-xs text-orange-700">Every feature demonstrated automatically</p>
                  </div>
                </div>

                {/* Demo Flow Timeline */}
                <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-600" />
                    15-Minute Demo Timeline
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="space-y-2">
                      <div className="font-medium text-blue-600">🚀 Setup & Navigation (5 min)</div>
                      <ul className="text-gray-600 space-y-1 text-xs">
                        <li>• Professional interface tour</li>
                        <li>• Navbar & sidebar exploration</li>
                        <li>• Session management demo</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <div className="font-medium text-purple-600">🎨 Collaboration & AI (7 min)</div>
                      <ul className="text-gray-600 space-y-1 text-xs">
                        <li>• Real-time team collaboration</li>
                        <li>• Canvas tools demonstration</li>
                        <li>• AI insights generation</li>
                        <li>• Idea validation process</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <div className="font-medium text-green-600">✅ Finalization & Export (3 min)</div>
                      <ul className="text-gray-600 space-y-1 text-xs">
                        <li>• Decision finalization</li>
                        <li>• Advanced features tour</li>
                        <li>• Export & sharing options</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Demo Settings */}
                <div className="space-y-3 mb-6 p-4 bg-white/80 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 text-sm flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Demo Configuration
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Auto-Start Demo</span>
                      <button
                        onClick={() => setDemoSettings(prev => ({ ...prev, autoStart: !prev.autoStart }))}
                        className={`w-10 h-6 rounded-full transition-colors ${
                          demoSettings.autoStart ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          demoSettings.autoStart ? 'translate-x-5' : 'translate-x-1'
                        } mt-1`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Show Narration</span>
                      <button
                        onClick={() => setDemoSettings(prev => ({ ...prev, showNarration: !prev.showNarration }))}
                        className={`w-10 h-6 rounded-full transition-colors ${
                          demoSettings.showNarration ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          demoSettings.showNarration ? 'translate-x-5' : 'translate-x-1'
                        } mt-1`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Sound Effects</span>
                      <button
                        onClick={() => setDemoSettings(prev => ({ ...prev, playSound: !prev.playSound }))}
                        className={`w-10 h-6 rounded-full transition-colors ${
                          demoSettings.playSound ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          demoSettings.playSound ? 'translate-x-5' : 'translate-x-1'
                        } mt-1`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">High Quality Mode</span>
                      <button className="w-10 h-6 rounded-full bg-blue-600">
                        <div className="w-4 h-4 bg-white rounded-full translate-x-5 mt-1" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <button
                    onClick={() => setShowDemoPrompt(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    Skip Demo
                  </button>
                  <button
                    onClick={startDemo}
                    className="flex-2 px-8 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    🎬 Start Professional Demo
                  </button>
                </div>

                <div className="text-center mt-4">
                  <p className="text-xs text-gray-500">
                    ⭐ Perfect for judge presentations, investor demos, and stakeholder meetings
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Demo Trigger */}
      {!isDemoMode && !showDemoPrompt && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowDemoPrompt(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all z-40 flex items-center justify-center group"
          title="Start Professional Demo"
          style={{ zIndex: 9999 }}
        >
          <Play className="w-7 h-7 group-hover:scale-110 transition-transform" />
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
            <Crown className="w-3 h-3 text-yellow-800" />
          </div>
        </motion.button>
      )}
    </div>
  );
};