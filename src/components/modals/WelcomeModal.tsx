import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Brain, 
  Users, 
  Zap, 
  Target, 
  ArrowRight,
  Play,
  BookOpen
} from 'lucide-react';

interface WelcomeModalProps {
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to MindMeld Enterprise',
      description: 'The most advanced collaborative ideation platform for modern teams',
      icon: Brain,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <Users className="w-8 h-8 text-blue-600 mb-2" />
              <h4 className="font-semibold text-blue-900">Real-time Collaboration</h4>
              <p className="text-sm text-blue-700">Work together seamlessly with your team</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <Brain className="w-8 h-8 text-purple-600 mb-2" />
              <h4 className="font-semibold text-purple-900">AI-Powered Insights</h4>
              <p className="text-sm text-purple-700">Get intelligent analysis of your ideas</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Start Collaborating',
      description: 'Add ideas, vote, and watch the magic happen',
      icon: Zap,
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-900 mb-2">Quick Start Tips:</h4>
            <ul className="space-y-2 text-sm text-green-700">
              <li>• Click anywhere on the canvas to add sticky notes</li>
              <li>• Use the toolbar to select different tools</li>
              <li>• Vote on ideas to prioritize them</li>
              <li>• Generate AI insights from your ideas</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: 'Ready to Begin?',
      description: 'Your collaborative workspace is ready',
      icon: Target,
      content: (
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Play className="w-10 h-10 text-white" />
          </div>
          <p className="text-gray-600">
            Start by adding your first idea to the canvas, or invite team members to join your session.
          </p>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-8 w-full max-w-2xl relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Icon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {currentStepData.title}
          </h2>
          <p className="text-gray-600">
            {currentStepData.description}
          </p>
        </div>

        {/* Content */}
        <div className="mb-8">
          {currentStepData.content}
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center space-x-2 mb-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentStep ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Skip Tour
            </button>
            
            {currentStep < steps.length - 1 ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentStep(currentStep + 1)}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                <span>Get Started</span>
                <Play className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </div>

        {/* Help Link */}
        <div className="text-center mt-6 pt-6 border-t border-gray-200">
          <button className="flex items-center space-x-2 mx-auto text-sm text-gray-500 hover:text-gray-700 transition-colors">
            <BookOpen className="w-4 h-4" />
            <span>View Documentation</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};