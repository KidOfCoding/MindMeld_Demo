import React, { useState } from 'react';
import { Plus, Send, Brain } from 'lucide-react';

interface IdeaEntryProps {
  onAddIdea: (text: string) => void;
  currentInput: string;
  setCurrentInput: (text: string) => void;
}

export const IdeaEntry: React.FC<IdeaEntryProps> = ({ 
  onAddIdea, 
  currentInput, 
  setCurrentInput 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentInput.trim()) {
      onAddIdea(currentInput);
      setCurrentInput('');
      setIsExpanded(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-3">
        <Brain className="w-5 h-5 text-green-600" />
        <h3 className="font-semibold text-gray-800">Drop your ideas here</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <textarea
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your idea... (Press Enter to add, Shift+Enter for new line)"
            className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 resize-none ${
              isExpanded ? 'h-24' : 'h-12'
            }`}
          />
          <button
            type="submit"
            disabled={!currentInput.trim()}
            className="absolute right-2 top-2 p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
      
      <p className="text-sm text-gray-500">
        Each participant can contribute ideas in real-time. Keep it short and focused—one idea per line.
      </p>
    </div>
  );
};