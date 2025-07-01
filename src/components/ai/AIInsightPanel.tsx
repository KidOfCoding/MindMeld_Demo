import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  X, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb,
  BarChart3,
  Target,
  Zap,
  Download,
  RefreshCw,
  MessageSquare,
  Users,
  Clock,
  Award,
  Layers,
  GitBranch
} from 'lucide-react';
import { Idea, AIInsight } from '../../types';

interface AIInsightPanelProps {
  ideas: Idea[];
  onClose: () => void;
}

interface AdvancedInsight {
  themes: string[];
  contradictions: string[];
  breakthrough: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  confidence: number;
  patterns: string[];
  recommendations: string[];
  priorityMatrix: { idea: string; impact: number; effort: number }[];
  collaborationMetrics: {
    participationRate: number;
    ideaDiversity: number;
    consensusLevel: number;
  };
  nextSteps: string[];
}

export const AIInsightPanel: React.FC<AIInsightPanelProps> = ({ ideas, onClose }) => {
  const [activeTab, setActiveTab] = useState('insights');
  const [isGenerating, setIsGenerating] = useState(false);
  const [insights, setInsights] = useState<AdvancedInsight | null>(null);

  const generateAdvancedInsights = async () => {
    setIsGenerating(true);
    
    // Simulate advanced AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockInsights: AdvancedInsight = {
      themes: [
        'User Experience & Interface Design (45% of ideas)',
        'AI & Machine Learning Integration (32% of ideas)',
        'Performance & Scalability (28% of ideas)',
        'Collaboration & Real-time Features (25% of ideas)',
        'Data Analytics & Insights (18% of ideas)'
      ],
      contradictions: [
        'Simplicity vs. Advanced Features: Some ideas favor minimal UI while others suggest comprehensive toolsets',
        'Speed vs. Accuracy: Real-time features conflict with thorough data processing requirements',
        'Privacy vs. Collaboration: Enhanced sharing capabilities may compromise data security'
      ],
      breakthrough: 'Create a modular AI-powered platform with adaptive complexity - simple by default but expandable based on user expertise and needs. This addresses both novice and power user requirements while maintaining performance.',
      sentiment: 'positive',
      confidence: 0.89,
      patterns: [
        'Ideas cluster around user empowerment and automation',
        'Strong focus on reducing cognitive load',
        'Emphasis on visual and intuitive interfaces',
        'Recurring theme of intelligent assistance'
      ],
      recommendations: [
        'Prioritize AI-powered user onboarding as the foundation feature',
        'Implement progressive disclosure for advanced features',
        'Focus on real-time collaboration with conflict resolution',
        'Build comprehensive analytics dashboard for insights',
        'Create modular architecture for scalable feature addition'
      ],
      priorityMatrix: [
        { idea: 'AI-powered user onboarding', impact: 9, effort: 6 },
        { idea: 'Real-time collaboration features', impact: 8, effort: 8 },
        { idea: 'Mobile-first design system', impact: 7, effort: 4 },
        { idea: 'Advanced analytics dashboard', impact: 6, effort: 7 },
        { idea: 'Voice-to-text functionality', impact: 5, effort: 5 }
      ],
      collaborationMetrics: {
        participationRate: 0.85,
        ideaDiversity: 0.72,
        consensusLevel: 0.68
      },
      nextSteps: [
        'Conduct user interviews to validate AI onboarding concept',
        'Create wireframes for adaptive interface design',
        'Prototype real-time collaboration features',
        'Develop technical architecture for modular system',
        'Plan MVP roadmap with phased feature rollout'
      ]
    };
    
    setInsights(mockInsights);
    setIsGenerating(false);
  };

  const tabs = [
    { id: 'insights', label: 'AI Insights', icon: Brain },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'recommendations', label: 'Actions', icon: Target },
    { id: 'collaboration', label: 'Team Metrics', icon: Users },
  ];

  const exportInsights = () => {
    if (!insights) return;
    
    const exportData = {
      insights,
      ideas: ideas.map(idea => ({
        text: idea.text,
        votes: idea.votes,
        author: idea.author.name,
        timestamp: idea.timestamp
      })),
      generatedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindmeld-insights-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed right-0 top-16 bottom-0 w-96 bg-white border-l border-gray-200 shadow-xl z-40 flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">AI Insights</h2>
              <p className="text-sm text-gray-500">Powered by GPT-4 Turbo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 gap-1 bg-gray-100 rounded-lg p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center space-x-1 px-2 py-2 rounded-md text-xs font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'insights' && (
          <div className="p-6 space-y-6">
            {/* Generate Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={generateAdvancedInsights}
              disabled={ideas.length === 0 || isGenerating}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Analyzing {ideas.length} Ideas...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Advanced Insights</span>
                </>
              )}
            </motion.button>

            {ideas.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Brain className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">Add some ideas to generate insights</p>
              </div>
            )}

            {/* Advanced Insights Display */}
            {insights && (
              <div className="space-y-6">
                {/* Confidence & Sentiment */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Confidence</span>
                      <span className="text-lg font-bold text-green-600">
                        {Math.round(insights.confidence * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${insights.confidence * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                    <div className="text-center">
                      <span className="text-sm font-medium text-gray-700">Sentiment</span>
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          insights.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                          insights.sentiment === 'neutral' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {insights.sentiment.charAt(0).toUpperCase() + insights.sentiment.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Themes */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">Key Themes</h3>
                  </div>
                  <div className="space-y-2">
                    {insights.themes.map((theme, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-3 bg-blue-50 rounded-lg border border-blue-200"
                      >
                        <p className="text-sm text-blue-800">{theme}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Patterns */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <GitBranch className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-gray-900">Patterns Detected</h3>
                  </div>
                  <div className="space-y-2">
                    {insights.patterns.map((pattern, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-3 bg-green-50 rounded-lg border border-green-200"
                      >
                        <p className="text-sm text-green-800">{pattern}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Contradictions */}
                {insights.contradictions.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                      <h3 className="font-semibold text-gray-900">Potential Conflicts</h3>
                    </div>
                    <div className="space-y-2">
                      {insights.contradictions.map((contradiction, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-3 bg-orange-50 rounded-lg border border-orange-200"
                        >
                          <p className="text-sm text-orange-800">{contradiction}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Breakthrough Insight */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-yellow-600" />
                    <h3 className="font-semibold text-gray-900">Breakthrough Insight</h3>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200"
                  >
                    <p className="text-sm text-yellow-800 italic leading-relaxed">
                      "{insights.breakthrough}"
                    </p>
                  </motion.div>
                </div>

                {/* Export Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={exportInsights}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  <span>Export Detailed Report</span>
                </motion.button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && insights && (
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                Priority Matrix
              </h3>
              
              <div className="space-y-3">
                {insights.priorityMatrix.map((item, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{item.idea}</span>
                      <span className="text-xs text-gray-500">#{index + 1}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Impact</span>
                          <span>{item.impact}/10</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${item.impact * 10}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Effort</span>
                          <span>{item.effort}/10</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-orange-500 h-2 rounded-full"
                            style={{ width: `${item.effort * 10}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'recommendations' && insights && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center mb-4">
                <Target className="w-5 h-5 mr-2 text-green-600" />
                Strategic Recommendations
              </h3>
              
              <div className="space-y-3">
                {insights.recommendations.map((rec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-green-50 rounded-lg border border-green-200"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <p className="text-sm text-green-800">{rec}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 flex items-center mb-4">
                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                Next Steps
              </h3>
              
              <div className="space-y-3">
                {insights.nextSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-blue-50 rounded-lg border border-blue-200"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <p className="text-sm text-blue-800">{step}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'collaboration' && insights && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center mb-4">
                <Users className="w-5 h-5 mr-2 text-purple-600" />
                Team Collaboration Metrics
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-purple-900">Participation Rate</span>
                    <span className="text-lg font-bold text-purple-600">
                      {Math.round(insights.collaborationMetrics.participationRate * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${insights.collaborationMetrics.participationRate * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-purple-700 mt-2">
                    Excellent engagement across team members
                  </p>
                </div>

                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-indigo-900">Idea Diversity</span>
                    <span className="text-lg font-bold text-indigo-600">
                      {Math.round(insights.collaborationMetrics.ideaDiversity * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-indigo-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${insights.collaborationMetrics.ideaDiversity * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-indigo-700 mt-2">
                    Good variety in perspectives and approaches
                  </p>
                </div>

                <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-teal-900">Consensus Level</span>
                    <span className="text-lg font-bold text-teal-600">
                      {Math.round(insights.collaborationMetrics.consensusLevel * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-teal-200 rounded-full h-2">
                    <div 
                      className="bg-teal-600 h-2 rounded-full"
                      style={{ width: `${insights.collaborationMetrics.consensusLevel * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-teal-700 mt-2">
                    Moderate agreement on priorities
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
              <div className="flex items-center space-x-2 mb-3">
                <Award className="w-5 h-5 text-yellow-600" />
                <h4 className="font-semibold text-yellow-900">Team Performance</h4>
              </div>
              <p className="text-sm text-yellow-800">
                Your team shows excellent collaboration patterns with high engagement and diverse thinking. 
                Consider facilitating more structured voting sessions to improve consensus building.
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};