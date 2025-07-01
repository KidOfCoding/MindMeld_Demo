import React, { useState } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { ChevronUp, X, MessageSquare, Tag, Link } from 'lucide-react';
import { Idea } from '../../types';

interface IdeaCardProps {
  idea: Idea;
  onVote: (id: string) => void;
  onRemove: (id: string) => void;
  onUpdatePosition: (id: string, position: { x: number; y: number }) => void;
  isSelected: boolean;
  zoom: number;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({
  idea,
  onVote,
  onRemove,
  onUpdatePosition,
  isSelected,
  zoom
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const dragControls = useDragControls();

  const handleDragEnd = (event: any, info: any) => {
    const newPosition = {
      x: idea.position.x + info.offset.x / zoom,
      y: idea.position.y + info.offset.y / zoom
    };
    onUpdatePosition(idea.id, newPosition);
  };

  const getCardColor = () => {
    if (idea.votes >= 5) return 'from-yellow-100 to-yellow-200 border-yellow-300';
    if (idea.votes >= 3) return 'from-green-100 to-green-200 border-green-300';
    if (idea.votes >= 1) return 'from-blue-100 to-blue-200 border-blue-300';
    return 'from-gray-100 to-gray-200 border-gray-300';
  };

  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={`absolute cursor-move select-none ${isSelected ? 'z-30' : 'z-20'}`}
      style={{
        left: idea.position.x,
        top: idea.position.y,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowActions(false);
      }}
    >
      <div className={`w-64 bg-gradient-to-br ${getCardColor()} border-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-white/50">
          <div className="flex items-center space-x-2">
            <img
              src={idea.author.avatar}
              alt={idea.author.name}
              className="w-6 h-6 rounded-full border-2 border-white"
            />
            <span className="text-xs font-medium text-gray-700">
              {idea.author.name}
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            {isHovered && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setShowActions(!showActions)}
                className="p-1 text-gray-500 hover:text-gray-700 hover:bg-white/50 rounded transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
              </motion.button>
            )}
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onRemove(idea.id)}
              className="p-1 text-gray-500 hover:text-red-500 hover:bg-white/50 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-gray-800 text-sm leading-relaxed mb-3">
            {idea.text}
          </p>
          
          {/* Tags */}
          {idea.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {idea.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-white/70 text-xs text-gray-600 rounded-full flex items-center space-x-1"
                >
                  <Tag className="w-3 h-3" />
                  <span>{tag}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-3 border-t border-white/50">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span>{idea.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            {idea.connections.length > 0 && (
              <div className="flex items-center space-x-1">
                <Link className="w-3 h-3" />
                <span>{idea.connections.length}</span>
              </div>
            )}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onVote(idea.id)}
            className="flex items-center space-x-1 px-3 py-1 bg-white/70 hover:bg-white rounded-full transition-colors"
          >
            <ChevronUp className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-600">
              {idea.votes}
            </span>
          </motion.button>
        </div>

        {/* Actions Panel */}
        {showActions && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 p-2 z-40"
          >
            <button className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors">
              Add Comment
            </button>
            <button className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors">
              Add Tag
            </button>
            <button className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors">
              Create Connection
            </button>
            <button className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors">
              Duplicate
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};