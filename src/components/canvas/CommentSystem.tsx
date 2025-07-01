import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  MessageSquare, 
  Plus, 
  Send, 
  MoreHorizontal,
  Check,
  Reply,
  Edit3,
  Trash2
} from 'lucide-react';
import { Comment } from '../../types/canvas';

interface CommentSystemProps {
  onClose: () => void;
}

export const CommentSystem: React.FC<CommentSystemProps> = ({ onClose }) => {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      position: { x: 200, y: 150 },
      content: 'This sticky note needs more detail about the user journey.',
      author: 'Sarah Chen',
      createdAt: new Date(Date.now() - 3600000),
      resolved: false,
      replies: [
        {
          id: '1-1',
          content: 'I agree, let me add more context.',
          author: 'You',
          createdAt: new Date(Date.now() - 1800000)
        }
      ]
    },
    {
      id: '2',
      position: { x: 500, y: 300 },
      content: 'Great idea! This aligns with our Q4 goals.',
      author: 'Marcus Rodriguez',
      createdAt: new Date(Date.now() - 7200000),
      resolved: true,
      replies: []
    }
  ]);

  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      position: { x: 300, y: 200 }, // Default position
      content: newComment,
      author: 'You',
      createdAt: new Date(),
      resolved: false,
      replies: []
    };

    setComments(prev => [...prev, comment]);
    setNewComment('');
  };

  const handleAddReply = (commentId: string) => {
    if (!replyText.trim()) return;

    setComments(prev => prev.map(comment => 
      comment.id === commentId
        ? {
            ...comment,
            replies: [
              ...comment.replies,
              {
                id: `${commentId}-${Date.now()}`,
                content: replyText,
                author: 'You',
                createdAt: new Date()
              }
            ]
          }
        : comment
    ));

    setReplyText('');
    setReplyingTo(null);
  };

  const handleResolveComment = (commentId: string) => {
    setComments(prev => prev.map(comment =>
      comment.id === commentId
        ? { ...comment, resolved: !comment.resolved }
        : comment
    ));
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute right-4 top-20 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[80vh] flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Comments</h3>
          <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
            {comments.filter(c => !c.resolved).length}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Add Comment */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex space-x-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
          />
          <button
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className={`p-4 rounded-lg border transition-all ${
              comment.resolved
                ? 'bg-green-50 border-green-200'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            {/* Comment Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {comment.author.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {comment.author}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatTime(comment.createdAt)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleResolveComment(comment.id)}
                  className={`p-1 rounded transition-colors ${
                    comment.resolved
                      ? 'text-green-600 hover:bg-green-100'
                      : 'text-gray-400 hover:bg-gray-100'
                  }`}
                  title={comment.resolved ? 'Mark as unresolved' : 'Mark as resolved'}
                >
                  <Check className="w-4 h-4" />
                </button>
                
                <div className="relative group">
                  <button className="p-1 text-gray-400 hover:bg-gray-100 rounded transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                  
                  <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button
                      onClick={() => setReplyingTo(comment.id)}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <Reply className="w-3 h-3" />
                      <span>Reply</span>
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Comment Content */}
            <p className="text-sm text-gray-700 mb-3">{comment.content}</p>

            {/* Replies */}
            {comment.replies.length > 0 && (
              <div className="space-y-2 ml-4 border-l-2 border-gray-200 pl-4">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="bg-white p-3 rounded border">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs">
                        {reply.author.charAt(0)}
                      </div>
                      <span className="text-xs font-medium text-gray-700">
                        {reply.author}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTime(reply.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{reply.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Reply Input */}
            {replyingTo === comment.id && (
              <div className="mt-3 flex space-x-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddReply(comment.id);
                    } else if (e.key === 'Escape') {
                      setReplyingTo(null);
                      setReplyText('');
                    }
                  }}
                  autoFocus
                />
                <button
                  onClick={() => handleAddReply(comment.id)}
                  disabled={!replyText.trim()}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm transition-colors"
                >
                  <Send className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No comments yet</p>
            <p className="text-sm text-gray-400">Add a comment to start the conversation</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};