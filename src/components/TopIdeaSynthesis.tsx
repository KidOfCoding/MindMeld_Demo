import React, { useState } from 'react';
import { Trophy, Zap, Loader2 } from 'lucide-react';
import { Idea } from '../types';

interface TopIdeaSynthesisProps {
  topIdeas: Idea[];
}

interface SynthesisResult {
  direction: string;
  nextStep: string;
  impact: string;
}

export const TopIdeaSynthesis: React.FC<TopIdeaSynthesisProps> = ({ topIdeas }) => {
  const [synthesis, setSynthesis] = useState<SynthesisResult | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const synthesizeTopIdeas = async () => {
    if (topIdeas.length === 0) return;
    
    setIsSynthesizing(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const result = generateSynthesis(topIdeas);
    setSynthesis(result);
    
    setIsSynthesizing(false);
  };

  const generateSynthesis = (ideas: Idea[]): SynthesisResult => {
    const topIdea = ideas[0];
    const hasMultipleIdeas = ideas.length > 1;
    
    const directions = [
      `Focus on "${topIdea?.text}" as your primary initiative, building a comprehensive solution around this core concept.`,
      `Combine the top-voted ideas into a unified strategy that addresses the underlying user need they all point to.`,
      `Prioritize "${topIdea?.text}" while keeping the other high-voted ideas as supporting features or future iterations.`,
      `Create a solution that synthesizes these ideas into a cohesive product that solves the core problem more effectively.`
    ];
    
    const nextSteps = [
      'Conduct user interviews to validate this direction and understand the specific pain points',
      'Create a detailed prototype or wireframe to test the concept with stakeholders',
      'Develop a minimum viable product (MVP) focusing on the core functionality',
      'Analyze the market opportunity and competitive landscape for this approach'
    ];
    
    const impacts = [
      'High - This direction addresses a clear user need with strong team consensus',
      'Medium-High - Significant potential with proper execution and market validation',
      'High - Strong foundation for scalable growth and user adoption',
      'Medium-High - Good alignment with current capabilities and market trends'
    ];
    
    return {
      direction: directions[Math.floor(Math.random() * directions.length)],
      nextStep: nextSteps[Math.floor(Math.random() * nextSteps.length)],
      impact: impacts[Math.floor(Math.random() * impacts.length)]
    };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Trophy className="w-5 h-5 text-purple-600" />
        <h3 className="font-semibold text-gray-800">Top Idea Synthesis</h3>
      </div>
      
      {topIdeas.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Top Voted Ideas:</h4>
          <div className="space-y-2">
            {topIdeas.slice(0, 3).map((idea, index) => (
              <div key={idea.id} className="flex items-center space-x-2 p-2 bg-purple-50 rounded-lg">
                <span className="text-sm font-bold text-purple-600">#{index + 1}</span>
                <span className="text-sm text-gray-700 flex-1">{idea.text}</span>
                <span className="text-sm font-medium text-purple-600">{idea.votes} votes</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <button
        onClick={synthesizeTopIdeas}
        disabled={topIdeas.length === 0 || isSynthesizing}
        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white rounded-xl font-medium transition-colors"
      >
        {isSynthesizing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Synthesizing Ideas...</span>
          </>
        ) : (
          <>
            <Zap className="w-5 h-5" />
            <span>Synthesize Top Ideas</span>
          </>
        )}
      </button>
      
      {topIdeas.length === 0 && (
        <p className="text-sm text-gray-500 text-center">
          Vote on ideas to see synthesis
        </p>
      )}
      
      {synthesis && (
        <div className="space-y-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
          <div>
            <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
              🧠 Synthesized Direction:
            </h4>
            <p className="text-sm text-purple-700">
              {synthesis.direction}
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
              ✅ Recommended Next Step:
            </h4>
            <p className="text-sm text-purple-700">
              {synthesis.nextStep}
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
              📈 Potential Impact:
            </h4>
            <p className="text-sm text-purple-700">
              {synthesis.impact}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};