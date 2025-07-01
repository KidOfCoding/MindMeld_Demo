import React, { useState } from 'react';
import { Map, Download, Loader2 } from 'lucide-react';
import { Idea, RoadmapStep } from '../types';

interface RoadmapGeneratorProps {
  topIdeas: Idea[];
}

export const RoadmapGenerator: React.FC<RoadmapGeneratorProps> = ({ topIdeas }) => {
  const [roadmap, setRoadmap] = useState<RoadmapStep[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateRoadmap = async () => {
    if (topIdeas.length === 0) return;
    
    setIsGenerating(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const steps = createRoadmapSteps(topIdeas);
    setRoadmap(steps);
    
    setIsGenerating(false);
  };

  const createRoadmapSteps = (ideas: Idea[]): RoadmapStep[] => {
    const topIdea = ideas[0];
    
    return [
      {
        title: "Immediate Action",
        description: `Start with user research and validation around "${topIdea?.text}". Set up basic project structure and stakeholder alignment.`,
        timeframe: "This week"
      },
      {
        title: "Short-Term Execution",
        description: "Develop MVP prototype, conduct user testing, and iterate based on feedback. Build core functionality and basic user interface.",
        timeframe: "1-2 weeks"
      },
      {
        title: "Stretch Goal",
        description: "Scale the solution, add advanced features from other top-voted ideas, and prepare for broader market launch.",
        timeframe: "1-2 months"
      }
    ];
  };

  const exportRoadmap = () => {
    const content = roadmap.map((step, index) => 
      `Step ${index + 1}: ${step.title} (${step.timeframe})\n${step.description}\n`
    ).join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mindmeld-roadmap.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Map className="w-5 h-5 text-indigo-600" />
        <h3 className="font-semibold text-gray-800">MVP Roadmap Generator</h3>
      </div>
      
      <button
        onClick={generateRoadmap}
        disabled={topIdeas.length === 0 || isGenerating}
        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white rounded-xl font-medium transition-colors"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Generating Roadmap...</span>
          </>
        ) : (
          <>
            <Map className="w-5 h-5" />
            <span>Generate 3-Step MVP Plan</span>
          </>
        )}
      </button>
      
      {topIdeas.length === 0 && (
        <p className="text-sm text-gray-500 text-center">
          Add and vote on ideas to generate a roadmap
        </p>
      )}
      
      {roadmap.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-indigo-800">Your MVP Roadmap:</h4>
            <button
              onClick={exportRoadmap}
              className="flex items-center space-x-1 px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
          
          <div className="space-y-4">
            {roadmap.map((step, index) => (
              <div key={index} className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h5 className="font-semibold text-indigo-800">{step.title}</h5>
                      <span className="text-xs bg-indigo-200 text-indigo-700 px-2 py-1 rounded-full">
                        {step.timeframe}
                      </span>
                    </div>
                    <p className="text-sm text-indigo-700">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};