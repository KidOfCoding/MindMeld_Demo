import React from 'react';
import { Idea, User } from '../../types';
import { Users, Lightbulb, TrendingUp, Wifi, WifiOff, Clock, Save } from 'lucide-react';

interface Session {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'archived';
  lastModified: Date;
}

interface StatusBarProps {
  ideas: Idea[];
  collaborators: User[];
  selectedTool: string;
  currentSession?: Session;
}

export const StatusBar: React.FC<StatusBarProps> = ({ 
  ideas, 
  collaborators, 
  selectedTool,
  currentSession 
}) => {
  const totalVotes = ideas.reduce((sum, idea) => sum + idea.votes, 0);
  const onlineCount = collaborators.filter(c => c.isOnline).length + 1; // +1 for current user
  const isConnected = true; // Mock connection status

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600';
      case 'completed':
        return 'text-blue-600';
      case 'archived':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="h-8 bg-gray-100 border-t border-gray-200 flex items-center justify-between px-4 text-xs text-gray-600">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        {currentSession && (
          <div className="flex items-center space-x-1">
            <span className="font-medium">{currentSession.name}</span>
            <span className={`px-2 py-1 rounded text-xs ${getStatusColor(currentSession.status)}`}>
              • {currentSession.status}
            </span>
          </div>
        )}
        
        <div className="flex items-center space-x-1">
          <Lightbulb className="w-3 h-3" />
          <span>{ideas.length} ideas</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <TrendingUp className="w-3 h-3" />
          <span>{totalVotes} votes</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <Users className="w-3 h-3" />
          <span>{onlineCount} online</span>
        </div>
      </div>

      {/* Center Section */}
      <div className="flex items-center space-x-4">
        <span className="capitalize">Tool: {selectedTool}</span>
        
        {currentSession && (
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>Last saved: {currentSession.lastModified.toLocaleTimeString()}</span>
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          {isConnected ? (
            <>
              <Wifi className="w-3 h-3 text-green-600" />
              <span className="text-green-600">Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3 text-red-600" />
              <span className="text-red-600">Disconnected</span>
            </>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          <Save className="w-3 h-3 text-green-600" />
          <span className="text-green-600">Auto-save enabled</span>
        </div>
      </div>
    </div>
  );
};