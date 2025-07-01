import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Eye, Settings, Volume2, VolumeX } from 'lucide-react';
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

  // Auto-show demo prompt after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDemoPrompt(true);
    }, 3000);
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

      {/* Demo Prompt */}
      <AnimatePresence>
        {showDemoPrompt && !isDemoMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-2xl p-8 max-w-lg w-full">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Play className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Ready for the Demo?
                </h2>
                <p className="text-gray-600">
                  Experience a fully automated 15-minute demonstration of MindMeld Enterprise with live collaboration, AI insights, and all features.
                </p>
              </div>

              {/* Demo Features Preview */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Eye className="w-5 h-5 text-blue-600 mb-2" />
                  <h4 className="font-semibold text-blue-900 text-sm">Live Cursors</h4>
                  <p className="text-xs text-blue-700">See team members collaborate in real-time</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Settings className="w-5 h-5 text-purple-600 mb-2" />
                  <h4 className="font-semibold text-purple-900 text-sm">Auto Actions</h4>
                  <p className="text-xs text-purple-700">Automated interactions and workflows</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <Volume2 className="w-5 h-5 text-green-600 mb-2" />
                  <h4 className="font-semibold text-green-900 text-sm">Narration</h4>
                  <p className="text-xs text-green-700">Guided explanations of each feature</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <Play className="w-5 h-5 text-orange-600 mb-2" />
                  <h4 className="font-semibold text-orange-900 text-sm">Full Demo</h4>
                  <p className="text-xs text-orange-700">Complete 15-minute experience</p>
                </div>
              </div>

              {/* Demo Settings */}
              <div className="space-y-3 mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 text-sm">Demo Settings</h4>
                
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
                  <span className="text-sm text-gray-700">Auto Start</span>
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
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDemoPrompt(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Skip Demo
                </button>
                <button
                  onClick={startDemo}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
                >
                  Start Demo
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                Perfect for presentations to judges, investors, or stakeholders
              </p>
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
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all z-40 flex items-center justify-center"
          title="Start Demo Mode"
        >
          <Play className="w-6 h-6" />
        </motion.button>
      )}
    </div>
  );
};