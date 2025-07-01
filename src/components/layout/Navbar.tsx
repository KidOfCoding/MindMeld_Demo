import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Users, 
  Share2, 
  Settings, 
  Bell, 
  Search,
  ChevronDown,
  Zap,
  Crown,
  Video,
  MessageSquare,
  Download,
  Upload,
  Save,
  FileText,
  HelpCircle,
  LogOut,
  User as UserIcon,
  Palette,
  Globe,
  Image,
  FileImage,
  Maximize,
  Minimize,
  MoreHorizontal,
  Edit3,
  Mail,
  Phone,
  Calendar,
  Shield,
  Key,
  CreditCard,
  Monitor,
  Clock,
  CheckCircle
} from 'lucide-react';
import { User } from '../../types';

interface Session {
  id: string;
  name: string;
  participants: number;
  status: 'active' | 'completed' | 'archived';
  lastModified: Date;
}

interface NavbarProps {
  onToggleAI: () => void;
  onToggleCollaborators: () => void;
  isAIPanelOpen: boolean;
  isCollaboratorPanelOpen: boolean;
  currentUser: User;
  onExportCanvas: (format: 'png' | 'pdf') => void;
  sessions: Session[];
  currentSessionId: string;
  onSessionSwitch: (sessionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleAI,
  onToggleCollaborators,
  isAIPanelOpen,
  isCollaboratorPanelOpen,
  currentUser,
  onExportCanvas,
  sessions,
  currentSessionId,
  onSessionSwitch
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProjectMenu, setShowProjectMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications] = useState([
    { id: 1, text: 'Sarah added 3 new ideas', time: '2 min ago', type: 'activity', unread: true },
    { id: 2, text: 'AI insights ready for review', time: '5 min ago', type: 'ai', unread: true },
    { id: 3, text: 'Marcus voted on your idea', time: '10 min ago', type: 'vote', unread: false },
    { id: 4, text: 'New team member joined', time: '1 hour ago', type: 'team', unread: false },
    { id: 5, text: 'Session auto-saved', time: '2 hours ago', type: 'system', unread: false }
  ]);

  const currentSession = sessions.find(s => s.id === currentSessionId);

  const handleExport = (format: 'png' | 'pdf') => {
    onExportCanvas(format);
    setShowExportMenu(false);
  };

  const handleSave = () => {
    console.log('Saving session...');
    // Show success notification
    alert('Session saved successfully!');
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    alert('Share link copied to clipboard!');
  };

  const handleProjectSwitch = (sessionId: string) => {
    onSessionSwitch(sessionId);
    setShowProjectMenu(false);
  };

  const unreadCount = notifications.filter(n => n.unread).length;

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
    <nav className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 relative z-50">
      {/* Left Section - Logo & Project */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Brain className="w-8 h-8 text-blue-600" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
              <Zap className="w-1.5 h-1.5 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MindMeld
            </h1>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Crown className="w-3 h-3 text-yellow-500" />
              <span>Enterprise</span>
            </div>
          </div>
        </div>
        
        <div className="h-6 w-px bg-gray-300" />
        
        {/* Project Selector */}
        <div className="relative">
          <button
            onClick={() => setShowProjectMenu(!showProjectMenu)}
            className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-2">
              {getStatusIcon(currentSession?.status || 'active')}
              <span className="text-sm font-medium text-gray-700">
                {currentSession?.name || 'Select Session'}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          <AnimatePresence>
            {showProjectMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 max-h-80 overflow-y-auto"
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Switch Session</h3>
                  <p className="text-xs text-gray-500">Select a session to work on</p>
                </div>
                
                <div className="py-2">
                  {sessions.map((session) => (
                    <button
                      key={session.id}
                      onClick={() => handleProjectSwitch(session.id)}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                        session.id === currentSessionId ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-1">
                            {getStatusIcon(session.status)}
                            <p className="font-medium text-gray-900 text-sm">{session.name}</p>
                            {session.id === currentSessionId && (
                              <span className="text-xs text-blue-600 font-medium px-2 py-1 bg-blue-100 rounded-full">
                                Current
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Users className="w-3 h-3" />
                              <span>{session.participants} members</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{session.lastModified.toLocaleDateString()}</span>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                              {session.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                
                <div className="border-t border-gray-100 mt-2 pt-2">
                  <button 
                    onClick={() => setShowProjectMenu(false)}
                    className="w-full px-4 py-2 text-left text-blue-600 hover:bg-blue-50 transition-colors text-sm font-medium"
                  >
                    + Create New Session
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Center Section - Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ideas, insights, or collaborators..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 text-sm text-gray-500">Search results for "{searchQuery}"</div>
              <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
                <div className="font-medium">AI-powered user onboarding</div>
                <div className="text-sm text-gray-500">Idea by Sarah Chen</div>
              </div>
              <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
                <div className="font-medium">Mobile-first design system</div>
                <div className="text-sm text-gray-500">Idea by Marcus Rodriguez</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Section - Actions & User */}
      <div className="flex items-center space-x-4">
        {/* Quick Actions */}
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Save Session (Ctrl+S)"
          >
            <Save className="w-5 h-5" />
          </motion.button>

          {/* Export Menu */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Export Canvas"
            >
              <Download className="w-5 h-5" />
            </motion.button>

            <AnimatePresence>
              {showExportMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                >
                  <button
                    onClick={() => handleExport('png')}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <Image className="w-4 h-4" />
                    <span>Export as PNG</span>
                  </button>
                  <button
                    onClick={() => handleExport('pdf')}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Export as PDF</span>
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={() => {
                      console.log('Exporting session data...');
                      setShowExportMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <FileImage className="w-4 h-4" />
                    <span>Export Session Data</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            title="Start Video Call"
          >
            <Video className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Team Chat"
          >
            <MessageSquare className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleCollaborators}
            className={`p-2 rounded-lg transition-colors ${
              isCollaboratorPanelOpen 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
            title="Collaborators"
          >
            <Users className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleAI}
            className={`p-2 rounded-lg transition-colors ${
              isAIPanelOpen 
                ? 'text-purple-600 bg-purple-50' 
                : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
            }`}
            title="AI Insights"
          >
            <Brain className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="h-6 w-px bg-gray-300" />

        {/* Share Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShare}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span className="text-sm font-medium">Share</span>
        </motion.button>

        {/* Notifications */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="text-xs text-blue-600">{unreadCount} new</span>
                    )}
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`px-4 py-3 hover:bg-gray-50 transition-colors border-l-2 ${
                        notification.unread ? 'border-blue-500 bg-blue-50/30' : 'border-transparent'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          notification.unread ? 'bg-blue-500' : 'bg-gray-300'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{notification.text}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 pt-2">
                  <button 
                    onClick={() => {
                      console.log('Marking all as read...');
                      setShowNotifications(false);
                    }}
                    className="w-full px-4 py-2 text-center text-blue-600 hover:bg-blue-50 transition-colors text-sm"
                  >
                    Mark all as read
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Menu */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full border-2 border-blue-200"
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </motion.button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
              >
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{currentUser.name}</p>
                      <p className="text-sm text-gray-500">Product Manager</p>
                      <p className="text-xs text-green-600">● Online</p>
                    </div>
                    <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Menu Items */}
                <div className="py-2">
                  <button 
                    onClick={() => setShowUserMenu(false)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                  >
                    <UserIcon className="w-4 h-4" />
                    <div>
                      <div>Profile Settings</div>
                      <div className="text-xs text-gray-500">Manage your account</div>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => setShowUserMenu(false)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                  >
                    <Settings className="w-4 h-4" />
                    <div>
                      <div>Workspace Settings</div>
                      <div className="text-xs text-gray-500">Customize your workspace</div>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => setShowUserMenu(false)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                  >
                    <Palette className="w-4 h-4" />
                    <div>
                      <div>Theme & Appearance</div>
                      <div className="text-xs text-gray-500">Light mode</div>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => setShowUserMenu(false)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                  >
                    <Shield className="w-4 h-4" />
                    <div>
                      <div>Privacy & Security</div>
                      <div className="text-xs text-gray-500">Manage permissions</div>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => setShowUserMenu(false)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                  >
                    <CreditCard className="w-4 h-4" />
                    <div>
                      <div>Billing & Plans</div>
                      <div className="text-xs text-gray-500">Enterprise Plan</div>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => setShowUserMenu(false)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <div>
                      <div>Help & Support</div>
                      <div className="text-xs text-gray-500">Get help and tutorials</div>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => setShowUserMenu(false)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                  >
                    <FileText className="w-4 h-4" />
                    <div>
                      <div>Keyboard Shortcuts</div>
                      <div className="text-xs text-gray-500">View all shortcuts</div>
                    </div>
                  </button>
                </div>
                
                {/* Sign Out */}
                <div className="border-t border-gray-100 py-2">
                  <button 
                    onClick={() => {
                      if (confirm('Are you sure you want to sign out?')) {
                        console.log('Signing out...');
                        setShowUserMenu(false);
                      }
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3"
                  >
                    <LogOut className="w-4 h-4" />
                    <div>Sign Out</div>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};