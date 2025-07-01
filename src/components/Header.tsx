import React from 'react';
import { Brain, Users, Zap } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <div className="text-center space-y-4">
      <div className="flex justify-center items-center space-x-3 mb-4">
        <div className="relative">
          <Brain className="w-12 h-12 text-blue-600" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <Zap className="w-2 h-2 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
          MindMeld
        </h1>
      </div>
      
      <p className="text-xl text-gray-700 font-medium">
        Think Together. Decide Smarter.
      </p>
      
      <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
        A collaborative idea board powered by AI to help you discover themes, contradictions, 
        and breakthrough decisions—together.
      </p>
      
      <div className="flex justify-center items-center space-x-8 mt-6 text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4" />
          <span>Real-time Collaboration</span>
        </div>
        <div className="flex items-center space-x-2">
          <Brain className="w-4 h-4" />
          <span>AI-Powered Insights</span>
        </div>
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4" />
          <span>Smart Synthesis</span>
        </div>
      </div>
    </div>
  );
};