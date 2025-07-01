import React, { useState } from 'react';
import { Brain, Sparkles, Loader2 } from 'lucide-react';
import { Idea, AIInsight } from '../types';

interface InsightPanelProps {
  ideas: Idea[];
}

export const InsightPanel: React.FC<InsightPanelProps> = ({ ideas }) => {
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateInsights = async () => {
    if (ideas.length === 0) return;
    
    setIsGenerating(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock AI insight generation based on ideas
    const themes = extractThemes(ideas);
    const contradictions = findContradictions(ideas);
    const breakthrough = generateBreakthrough(ideas, themes);
    
    setInsight({
      themes,
      contradictions,
      breakthrough
    });
    
    setIsGenerating(false);
  };

  const extractThemes = (ideas: Idea[]): string[] => {
    const themes: string[] = [];
    const ideaTexts = ideas.map(idea => idea.text.toLowerCase());
    
    // Simple theme detection based on common words
    const commonWords = ['product', 'user', 'feature', 'design', 'technology', 'market', 'team', 'growth', 'customer', 'revenue'];
    
    commonWords.forEach(word => {
      const count = ideaTexts.filter(text => text.includes(word)).length;
      if (count >= 2) {
        themes.push(`${word.charAt(0).toUpperCase() + word.slice(1)}-focused initiatives (${count} ideas)`);
      }
    });
    
    if (themes.length === 0) {
      themes.push('Innovation and improvement opportunities');
      themes.push('Strategic direction and focus areas');
    }
    
    return themes.slice(0, 3);
  };

  const findContradictions = (ideas: Idea[]): string[] => {
    const contradictions: string[] = [];
    
    // Simple contradiction detection
    const texts = ideas.map(idea => idea.text.toLowerCase());
    const opposites = [
      ['fast', 'slow'], ['big', 'small'], ['simple', 'complex'], 
      ['cheap', 'expensive'], ['new', 'old'], ['automated', 'manual']
    ];
    
    opposites.forEach(([word1, word2]) => {
      const hasWord1 = texts.some(text => text.includes(word1));
      const hasWord2 = texts.some(text => text.includes(word2));
      
      if (hasWord1 && hasWord2) {
        contradictions.push(`Tension between ${word1} and ${word2} approaches`);
      }
    });
    
    if (contradictions.length === 0 && ideas.length > 3) {
      contradictions.push('Some ideas may require different resource allocations');
    }
    
    return contradictions.slice(0, 2);
  };

  const generateBreakthrough = (ideas: Idea[], themes: string[]): string => {
    if (ideas.length === 0) return '';
    
    const topIdea = ideas.reduce((prev, current) => 
      prev.votes > current.votes ? prev : current
    );
    
    const breakthroughs = [
      `The key insight is combining ${themes[0]?.toLowerCase() || 'multiple perspectives'} with user-centric design to create maximum impact.`,
      `Consider focusing on "${topIdea.text}" as the cornerstone strategy, then building complementary features around it.`,
      `The breakthrough opportunity lies in addressing the core problem that connects all these ideas: creating genuine value for users.`,
      `By synthesizing these ideas, you could create a solution that's both innovative and practical, addressing real market needs.`
    ];
    
    return breakthroughs[Math.floor(Math.random() * breakthroughs.length)];
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Brain className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-gray-800">AI Insight Generator</h3>
      </div>
      
      <button
        onClick={generateInsights}
        disabled={ideas.length === 0 || isGenerating}
        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl font-medium transition-colors"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Analyzing Ideas...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            <span>Generate AI Insights</span>
          </>
        )}
      </button>
      
      {ideas.length === 0 && (
        <p className="text-sm text-gray-500 text-center">
          Add some ideas first to generate insights
        </p>
      )}
      
      {insight && (
        <div className="space-y-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div>
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
              🧩 Themes Identified:
            </h4>
            <ul className="space-y-1">
              {insight.themes.map((theme, index) => (
                <li key={index} className="text-sm text-blue-700 ml-4">
                  • {theme}
                </li>
              ))}
            </ul>
          </div>
          
          {insight.contradictions.length > 0 && (
            <div>
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                ⚠️ Contradictions or Gaps:
              </h4>
              <ul className="space-y-1">
                {insight.contradictions.map((contradiction, index) => (
                  <li key={index} className="text-sm text-blue-700 ml-4">
                    • {contradiction}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div>
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
              🚀 Breakthrough Insight:
            </h4>
            <p className="text-sm text-blue-700 italic">
              "{insight.breakthrough}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
};