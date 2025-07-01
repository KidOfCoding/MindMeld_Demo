import React, { useState } from 'react';
import { AlertTriangle, Search, Loader2 } from 'lucide-react';
import { Idea, Contradiction } from '../types';

interface ContradictionDetectorProps {
  ideas: Idea[];
}

export const ContradictionDetector: React.FC<ContradictionDetectorProps> = ({ ideas }) => {
  const [contradictions, setContradictions] = useState<Contradiction[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const scanForContradictions = async () => {
    if (ideas.length < 2) return;
    
    setIsScanning(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const detectedContradictions = findContradictions(ideas);
    setContradictions(detectedContradictions);
    
    setIsScanning(false);
  };

  const findContradictions = (ideas: Idea[]): Contradiction[] => {
    const contradictions: Contradiction[] = [];
    
    // Simple contradiction detection logic
    const ideaTexts = ideas.map(idea => idea.text.toLowerCase());
    
    // Check for opposing concepts
    const opposingPairs = [
      { words: ['fast', 'quick', 'rapid'], opposite: ['slow', 'gradual', 'careful'] },
      { words: ['simple', 'easy', 'basic'], opposite: ['complex', 'advanced', 'sophisticated'] },
      { words: ['cheap', 'affordable', 'budget'], opposite: ['expensive', 'premium', 'costly'] },
      { words: ['automated', 'automatic'], opposite: ['manual', 'human'] },
      { words: ['big', 'large', 'scale'], opposite: ['small', 'minimal', 'micro'] }
    ];
    
    opposingPairs.forEach(pair => {
      const ideasWithFirst = ideas.filter(idea => 
        pair.words.some(word => idea.text.toLowerCase().includes(word))
      );
      const ideasWithSecond = ideas.filter(idea => 
        pair.opposite.some(word => idea.text.toLowerCase().includes(word))
      );
      
      if (ideasWithFirst.length > 0 && ideasWithSecond.length > 0) {
        contradictions.push({
          ideaA: ideasWithFirst[0].text,
          ideaB: ideasWithSecond[0].text,
          explanation: `These ideas suggest different approaches to the same problem`,
          suggestion: `Consider if both approaches can coexist or if one should be prioritized based on user needs`
        });
      }
    });
    
    // Add some generic contradictions if none found
    if (contradictions.length === 0 && ideas.length > 2) {
      const randomIdeas = ideas.sort(() => 0.5 - Math.random()).slice(0, 2);
      contradictions.push({
        ideaA: randomIdeas[0].text,
        ideaB: randomIdeas[1].text,
        explanation: 'These ideas may require different resource allocations or priorities',
        suggestion: 'Evaluate which idea aligns better with your current goals and constraints'
      });
    }
    
    return contradictions;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <AlertTriangle className="w-5 h-5 text-orange-600" />
        <h3 className="font-semibold text-gray-800">Contradiction Detector</h3>
      </div>
      
      <button
        onClick={scanForContradictions}
        disabled={ideas.length < 2 || isScanning}
        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white rounded-xl font-medium transition-colors"
      >
        {isScanning ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Scanning for Contradictions...</span>
          </>
        ) : (
          <>
            <Search className="w-5 h-5" />
            <span>Scan for Contradictions</span>
          </>
        )}
      </button>
      
      {ideas.length < 2 && (
        <p className="text-sm text-gray-500 text-center">
          Add at least 2 ideas to detect contradictions
        </p>
      )}
      
      {contradictions.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold text-orange-800 flex items-center">
            ⚠️ Contradictions Detected:
          </h4>
          
          {contradictions.map((contradiction, index) => (
            <div key={index} className="p-4 bg-orange-50 rounded-xl border border-orange-200">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-orange-800">Conflicting Ideas:</p>
                  <div className="mt-2 space-y-2">
                    <div className="p-2 bg-white rounded border-l-4 border-red-400">
                      <p className="text-sm text-gray-700">"{contradiction.ideaA}"</p>
                    </div>
                    <div className="text-center text-orange-600 font-medium">vs</div>
                    <div className="p-2 bg-white rounded border-l-4 border-red-400">
                      <p className="text-sm text-gray-700">"{contradiction.ideaB}"</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-orange-800">Explanation:</p>
                  <p className="text-sm text-orange-700 mt-1">{contradiction.explanation}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-orange-800">🛠 Suggested Fix:</p>
                  <p className="text-sm text-orange-700 mt-1">{contradiction.suggestion}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {contradictions.length === 0 && ideas.length >= 2 && !isScanning && (
        <div className="p-4 bg-green-50 rounded-xl border border-green-200">
          <p className="text-sm text-green-700 flex items-center">
            <span className="mr-2">✅</span>
            No major contradictions detected. Your ideas seem well-aligned!
          </p>
        </div>
      )}
    </div>
  );
};