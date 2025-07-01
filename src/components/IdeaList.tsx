import React from 'react';
import { ChevronUp, X, Clock, TrendingUp } from 'lucide-react';
import { Idea } from '../types';

interface IdeaListProps {
  ideas: Idea[];
  onVote: (id: string) => void;
  onRemove: (id: string) => void;
  totalVotes: number;
}

export const IdeaList: React.FC<IdeaListProps> = ({ 
  ideas, 
  onVote, 
  onRemove, 
  totalVotes 
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getVotePercentage = (votes: number) => {
    return totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-gray-800">Ideas & Votes</h3>
        </div>
        <div className="text-sm text-gray-500">
          {ideas.length} ideas, {totalVotes} votes
        </div>
      </div>

      {ideas.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-gray-400" />
          </div>
          <p>No ideas yet. Start collaborating!</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {ideas.map((idea, index) => (
            <div
              key={idea.id}
              className={`p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md ${
                index === 0 && idea.votes > 0
                  ? 'border-yellow-300 bg-yellow-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-start space-x-3">
                <button
                  onClick={() => onVote(idea.id)}
                  className="flex-shrink-0 flex flex-col items-center space-y-1 p-2 rounded-lg hover:bg-green-50 transition-colors group"
                >
                  <ChevronUp className="w-5 h-5 text-green-600 group-hover:text-green-700" />
                  <span className="text-sm font-semibold text-green-600">
                    {idea.votes}
                  </span>
                  {totalVotes > 0 && (
                    <span className="text-xs text-gray-400">
                      {getVotePercentage(idea.votes)}%
                    </span>
                  )}
                </button>
                
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 leading-relaxed break-words">
                    {idea.text}
                  </p>
                  <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(idea.timestamp)}</span>
                    {index === 0 && idea.votes > 0 && (
                      <span className="px-2 py-1 bg-yellow-200 text-yellow-800 rounded-full text-xs font-medium">
                        Top Idea
                      </span>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => onRemove(idea.id)}
                  className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};