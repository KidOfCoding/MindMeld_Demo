import React, { useState } from 'react';
import { MessageSquare, Send, Star } from 'lucide-react';

export const FeedbackSection: React.FC = () => {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback.trim()) {
      // Here you would normally send feedback to your backend
      console.log('Feedback submitted:', { feedback, rating });
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFeedback('');
        setRating(0);
      }, 3000);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
          <Send className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="font-semibold text-green-800">Thank you!</h3>
        <p className="text-sm text-green-700">
          Your feedback helps us improve MindMeld
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <MessageSquare className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold text-gray-800">Feedback</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How would you rate your experience?
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`p-1 rounded transition-colors ${
                  star <= rating ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'
                }`}
              >
                <Star className="w-5 h-5 fill-current" />
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
            Was the AI insight useful? What would you improve?
          </label>
          <textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Share your thoughts on the AI insights, collaboration features, or overall experience..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-none h-20"
          />
        </div>
        
        <button
          type="submit"
          disabled={!feedback.trim()}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors"
        >
          <Send className="w-4 h-4" />
          <span>Submit Feedback</span>
        </button>
      </form>
    </div>
  );
};