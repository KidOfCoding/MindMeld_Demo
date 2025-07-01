import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Folder, 
  Clock, 
  Star, 
  Archive, 
  Plus,
  ChevronLeft,
  ChevronRight,
  FileText,
  Users,
  Zap,
  Settings,
  Search,
  Filter,
  MoreHorizontal,
  FolderPlus,
  Upload,
  Download,
  Trash2,
  Edit3,
  Play,
  Copy,
  Share2,
  CheckCircle,
  X,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

interface Session {
  id: string;
  name: string;
  ideas: any[];
  canvasElements: any[];
  createdAt: Date;
  lastModified: Date;
  participants: number;
  status: 'active' | 'completed' | 'archived';
}

interface SidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
  width: number;
  sessions: Session[];
  currentSessionId: string;
  onSessionSwitch: (sessionId: string) => void;
  onNewSession: (name: string, templateId?: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isExpanded, 
  onToggle, 
  width,
  sessions,
  currentSessionId,
  onSessionSwitch,
  onNewSession
}) => {
  const [activeItem, setActiveItem] = useState('current');
  const [showNewSessionModal, setShowNewSessionModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRecentActions, setShowRecentActions] = useState<string | null>(null);
  const [newSessionName, setNewSessionName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const menuItems = [
    { id: 'current', icon: Home, label: 'Current Session', badge: null, color: 'blue' },
    { id: 'recent', icon: Clock, label: 'Recent Sessions', badge: sessions.length.toString(), color: 'gray' },
    { id: 'starred', icon: Star, label: 'Starred', badge: '3', color: 'yellow' },
    { id: 'templates', icon: FileText, label: 'Templates', badge: null, color: 'green' },
    { id: 'team', icon: Users, label: 'Team Spaces', badge: '2', color: 'purple' },
    { id: 'archive', icon: Archive, label: 'Archive', badge: null, color: 'gray' },
  ];

  const templates = [
    { 
      id: 'strategy',
      name: 'Product Strategy', 
      description: 'Strategic planning session with SWOT analysis', 
      uses: 45,
      thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100&h=60&fit=crop'
    },
    { 
      id: 'sprint',
      name: 'Design Sprint', 
      description: '5-day design process framework', 
      uses: 32,
      thumbnail: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=100&h=60&fit=crop'
    },
    { 
      id: 'retro',
      name: 'Retrospective', 
      description: 'Team reflection and improvement meeting', 
      uses: 28,
      thumbnail: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=100&h=60&fit=crop'
    },
    { 
      id: 'journey',
      name: 'User Journey Mapping', 
      description: 'Customer experience flow analysis', 
      uses: 19,
      thumbnail: 'https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg?auto=compress&cs=tinysrgb&w=100&h=60&fit=crop'
    },
    { 
      id: 'brainstorm',
      name: 'Brainstorming', 
      description: 'Creative ideation and problem solving', 
      uses: 67,
      thumbnail: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=100&h=60&fit=crop'
    },
    { 
      id: 'roadmap',
      name: 'Product Roadmap', 
      description: 'Timeline and feature planning', 
      uses: 34,
      thumbnail: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=100&h=60&fit=crop'
    }
  ];

  const filteredSessions = sessions.filter(session =>
    session.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewSession = () => {
    if (newSessionName.trim()) {
      onNewSession(newSessionName, selectedTemplate);
      setNewSessionName('');
      setSelectedTemplate('');
      setShowNewSessionModal(false);
    }
  };

  const handleSessionAction = (sessionId: string, action: string) => {
    const session = sessions.find(s => s.id === sessionId);
    switch (action) {
      case 'open':
        onSessionSwitch(sessionId);
        break;
      case 'duplicate':
        if (session) {
          onNewSession(`${session.name} (Copy)`, '');
        }
        break;
      case 'export':
        alert(`Exporting "${session?.name}"`);
        break;
      case 'archive':
        alert(`Archiving "${session?.name}"`);
        break;
      case 'delete':
        if (confirm(`Delete "${session?.name}"? This action cannot be undone.`)) {
          alert(`Deleted "${session?.name}"`);
        }
        break;
    }
    setShowRecentActions(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />;
      case 'completed':
        return <CheckCircle className="w-3 h-3 text-blue-500" />;
      case 'archived':
        return <div className="w-2 h-2 bg-gray-400 rounded-full" />;
      default:
        return <div className="w-2 h-2 bg-gray-400 rounded-full" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50';
      case 'completed':
        return 'text-blue-600 bg-blue-50';
      case 'archived':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <>
      {/* Enhanced Sidebar Container */}
      <motion.div
        initial={false}
        animate={{ 
          width: isExpanded ? width : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{ 
          type: "spring", 
          damping: 25, 
          stiffness: 200,
          opacity: { duration: 0.2 }
        }}
        className="bg-white border-r border-gray-200 flex flex-col h-full relative z-40 overflow-hidden shadow-sm"
      >
        {/* Enhanced Toggle Button - Inside Sidebar */}
        <motion.button
          onClick={onToggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute -right-4 top-6 w-8 h-8 bg-white border border-gray-200 rounded-md flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all z-50 shadow-md group"
          title="Collapse Sidebar (< key)"
        >
          <PanelLeftClose className="w-4 h-4 text-gray-600 group-hover:text-gray-800 transition-colors" />
        </motion.button>

        <div className="p-4 space-y-6 flex-1 overflow-y-auto">
          {/* New Session Button */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowNewSessionModal(true)}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-sm"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">New Session</span>
            </motion.button>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveItem(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all ${
                    isActive 
                      ? `bg-${item.color}-50 text-${item.color}-700 border border-${item.color}-200` 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 text-left text-sm font-medium">
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                      {item.badge}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* Search & Filter */}
          {activeItem === 'recent' && (
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search sessions..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Content based on active item */}
          <div className="space-y-3 flex-1">
            {activeItem === 'recent' && (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Recent Sessions ({filteredSessions.length})
                  </h3>
                  <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                    <Filter className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                  {filteredSessions.map((session) => (
                    <motion.div
                      key={session.id}
                      whileHover={{ scale: 1.02 }}
                      className={`relative group p-3 rounded-lg transition-colors cursor-pointer ${
                        session.id === currentSessionId 
                          ? 'bg-blue-50 border border-blue-200' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => onSessionSwitch(session.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            {getStatusIcon(session.status)}
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {session.name}
                            </h4>
                            {session.id === currentSessionId && (
                              <span className="text-xs text-blue-600 font-medium px-2 py-1 bg-blue-100 rounded-full">
                                Current
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-3 text-xs text-gray-500">
                            <span>{session.lastModified.toLocaleDateString()}</span>
                            <div className="flex items-center space-x-1">
                              <Users className="w-3 h-3" />
                              <span>{session.participants}</span>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                              {session.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1 truncate">
                            {session.ideas.length} ideas • {session.canvasElements.length} elements
                          </p>
                        </div>
                        
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowRecentActions(showRecentActions === session.id ? null : session.id);
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          
                          {showRecentActions === session.id && (
                            <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSessionAction(session.id, 'open');
                                }}
                                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                              >
                                <Play className="w-3 h-3" />
                                <span>Open</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSessionAction(session.id, 'duplicate');
                                }}
                                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                              >
                                <Copy className="w-3 h-3" />
                                <span>Duplicate</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSessionAction(session.id, 'export');
                                }}
                                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                              >
                                <Download className="w-3 h-3" />
                                <span>Export</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSessionAction(session.id, 'archive');
                                }}
                                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                              >
                                <Archive className="w-3 h-3" />
                                <span>Archive</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSessionAction(session.id, 'delete');
                                }}
                                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}

            {activeItem === 'templates' && (
              <>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Session Templates
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                  {templates.map((template) => (
                    <motion.div
                      key={template.id}
                      whileHover={{ scale: 1.02 }}
                      className="p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedTemplate(template.id);
                        setShowNewSessionModal(true);
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <img 
                          src={template.thumbnail} 
                          alt={template.name}
                          className="w-12 h-8 rounded object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-green-900">{template.name}</h4>
                          <p className="text-xs text-green-700 mt-1">{template.description}</p>
                          <p className="text-xs text-green-600 mt-1">{template.uses} uses</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}

            {activeItem === 'starred' && (
              <>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Starred Sessions
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                  <div className="p-3 bg-yellow-50 rounded-lg cursor-pointer hover:bg-yellow-100 transition-colors">
                    <div className="flex items-start space-x-3">
                      <img 
                        src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100&h=60&fit=crop"
                        alt="Product Strategy 2024"
                        className="w-12 h-8 rounded object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-yellow-900">Product Strategy 2024</h4>
                        <p className="text-xs text-yellow-700 mt-1">Last week • 12 participants</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg cursor-pointer hover:bg-yellow-100 transition-colors">
                    <div className="flex items-start space-x-3">
                      <img 
                        src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=100&h=60&fit=crop"
                        alt="Design System Overhaul"
                        className="w-12 h-8 rounded object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-yellow-900">Design System Overhaul</h4>
                        <p className="text-xs text-yellow-700 mt-1">2 weeks ago • 8 participants</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg cursor-pointer hover:bg-yellow-100 transition-colors">
                    <div className="flex items-start space-x-3">
                      <img 
                        src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=100&h=60&fit=crop"
                        alt="Customer Journey Workshop"
                        className="w-12 h-8 rounded object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-yellow-900">Customer Journey Workshop</h4>
                        <p className="text-xs text-yellow-700 mt-1">1 month ago • 15 participants</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeItem === 'team' && (
              <>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Team Workspaces
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                  <div className="p-3 bg-purple-50 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors">
                    <h4 className="text-sm font-medium text-purple-900">Product Team</h4>
                    <p className="text-xs text-purple-700 mt-1">15 members • 8 active sessions</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="flex -space-x-1">
                        <img src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=24&h=24&fit=crop" className="w-4 h-4 rounded-full border border-white" alt="" />
                        <img src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=24&h=24&fit=crop" className="w-4 h-4 rounded-full border border-white" alt="" />
                        <img src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=24&h=24&fit=crop" className="w-4 h-4 rounded-full border border-white" alt="" />
                      </div>
                      <span className="text-xs text-purple-600">+12 more</span>
                    </div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors">
                    <h4 className="text-sm font-medium text-purple-900">Design Team</h4>
                    <p className="text-xs text-purple-700 mt-1">12 members • 5 active sessions</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="flex -space-x-1">
                        <img src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=24&h=24&fit=crop" className="w-4 h-4 rounded-full border border-white" alt="" />
                        <img src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=24&h=24&fit=crop" className="w-4 h-4 rounded-full border border-white" alt="" />
                      </div>
                      <span className="text-xs text-purple-600">+10 more</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeItem === 'archive' && (
              <>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Archived Sessions
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                  <div className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                    <h4 className="text-sm font-medium text-gray-700">Q3 Retrospective</h4>
                    <p className="text-xs text-gray-500 mt-1">3 months ago • 18 participants</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                    <h4 className="text-sm font-medium text-gray-700">Feature Prioritization</h4>
                    <p className="text-xs text-gray-500 mt-1">4 months ago • 7 participants</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* AI Insights Quick Access */}
          <div className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-100">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-4 h-4 text-purple-600" />
              <h3 className="text-sm font-semibold text-purple-900">AI Insights</h3>
            </div>
            <p className="text-xs text-purple-700 mb-3">
              Get instant analysis of your ideas and collaboration patterns.
            </p>
            <button className="w-full px-3 py-2 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 transition-colors">
              Generate Insights
            </button>
          </div>
        </div>

        {/* Settings at bottom */}
        <div className="p-4 border-t border-gray-200">
          <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            <Settings className="w-4 h-4" />
            <span className="text-sm">Settings</span>
          </button>
        </div>
      </motion.div>

      {/* New Session Modal */}
      <AnimatePresence>
        {showNewSessionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowNewSessionModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Create New Session</h3>
                <button
                  onClick={() => setShowNewSessionModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Session Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Name *
                  </label>
                  <input
                    type="text"
                    value={newSessionName}
                    onChange={(e) => setNewSessionName(e.target.value)}
                    placeholder="Enter session name..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  />
                </div>

                {/* Template Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Choose Template (Optional)
                  </label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Blank Template */}
                    <div
                      onClick={() => setSelectedTemplate('')}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedTemplate === '' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-8 bg-gray-100 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                          <Plus className="w-4 h-4 text-gray-400" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Blank Session</div>
                          <div className="text-sm text-gray-500">Start with an empty canvas</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Template Options */}
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedTemplate === template.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <img 
                            src={template.thumbnail} 
                            alt={template.name}
                            className="w-12 h-8 rounded object-cover flex-shrink-0"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{template.name}</div>
                            <div className="text-sm text-gray-500">{template.description}</div>
                            <div className="text-xs text-gray-400 mt-1">{template.uses} uses</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={() => setShowNewSessionModal(false)}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNewSession}
                  disabled={!newSessionName.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Create Session
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};