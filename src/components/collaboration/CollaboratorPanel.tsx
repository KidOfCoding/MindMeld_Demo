import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  X, 
  Plus, 
  Crown, 
  MessageSquare, 
  Video, 
  Mic, 
  MicOff,
  VideoOff,
  Settings,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  Share2,
  Edit3,
  MoreHorizontal,
  Shield,
  Volume2,
  VolumeX,
  Camera,
  CameraOff,
  Monitor,
  Headphones
} from 'lucide-react';
import { User } from '../../types';

interface CollaboratorPanelProps {
  collaborators: User[];
  currentUser: User;
  onClose: () => void;
}

export const CollaboratorPanel: React.FC<CollaboratorPanelProps> = ({
  collaborators,
  currentUser,
  onClose
}) => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [activeTab, setActiveTab] = useState('online');
  const [showUserActions, setShowUserActions] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: 'Sarah Chen', message: 'Great ideas everyone! 🎉', time: '2 min ago' },
    { id: 2, user: 'Marcus Rodriguez', message: 'I love the AI integration concept', time: '5 min ago' },
    { id: 3, user: 'You', message: 'Should we prioritize mobile-first?', time: '8 min ago' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleInvite = () => {
    if (inviteEmail.trim()) {
      console.log('Inviting:', inviteEmail);
      setInviteEmail('');
      setShowInviteModal(false);
      // Show success message
      alert(`Invitation sent to ${inviteEmail}`);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: chatMessages.length + 1,
        user: 'You',
        message: newMessage,
        time: 'now'
      };
      setChatMessages([message, ...chatMessages]);
      setNewMessage('');
    }
  };

  const handleUserAction = (userId: string, action: string) => {
    console.log(`${action} user ${userId}`);
    setShowUserActions(null);
  };

  const allUsers = [currentUser, ...collaborators];
  const onlineUsers = allUsers.filter(user => user.isOnline);
  const offlineUsers = allUsers.filter(user => !user.isOnline);

  const tabs = [
    { id: 'online', label: 'Online', count: onlineUsers.length },
    { id: 'all', label: 'All', count: allUsers.length },
    { id: 'chat', label: 'Chat', count: chatMessages.length }
  ];

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed right-0 top-16 bottom-0 w-80 bg-white border-l border-gray-200 shadow-xl z-40 flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Collaboration</h2>
              <p className="text-sm text-gray-500">
                {onlineUsers.length} online • {allUsers.length} total
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Voice/Video Controls */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMuted(!isMuted)}
            className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              isMuted 
                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                : 'bg-green-100 text-green-600 hover:bg-green-200'
            }`}
          >
            {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span className="text-sm font-medium">
              {isMuted ? 'Unmute' : 'Mute'}
            </span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              isVideoOff 
                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
            }`}
          >
            {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
            <span className="text-sm font-medium">
              {isVideoOff ? 'Camera' : 'Video'}
            </span>
          </motion.button>
        </div>

        {/* Additional Controls */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            className={`flex items-center justify-center p-2 rounded-lg transition-colors ${
              isScreenSharing 
                ? 'bg-purple-100 text-purple-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Monitor className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Headphones className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Invite Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowInviteModal(true)}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors mt-4"
        >
          <UserPlus className="w-5 h-5" />
          <span>Invite Collaborators</span>
        </motion.button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'online' && (
          <div className="p-4">
            <div className="space-y-2">
              {onlineUsers.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="relative">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full border-2 border-white"
                    />
                    <div 
                      className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white"
                      style={{ backgroundColor: user.color }}
                    />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.name}
                        {user.id === currentUser.id && ' (You)'}
                      </p>
                      {user.id === '1' && (
                        <Crown className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500">Active now • Editing canvas</p>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors">
                      <Phone className="w-4 h-4" />
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setShowUserActions(showUserActions === user.id ? null : user.id)}
                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      
                      {showUserActions === user.id && (
                        <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                          <button
                            onClick={() => handleUserAction(user.id, 'message')}
                            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                          >
                            Send Message
                          </button>
                          <button
                            onClick={() => handleUserAction(user.id, 'call')}
                            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                          >
                            Start Call
                          </button>
                          <button
                            onClick={() => handleUserAction(user.id, 'follow')}
                            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                          >
                            Follow Cursor
                          </button>
                          {user.id !== currentUser.id && (
                            <button
                              onClick={() => handleUserAction(user.id, 'permissions')}
                              className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                            >
                              Manage Permissions
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'all' && (
          <div className="p-4 space-y-4">
            {/* Online Users */}
            {onlineUsers.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                  Online ({onlineUsers.length})
                </h3>
                <div className="space-y-2">
                  {onlineUsers.map((user) => (
                    <div key={user.id} className="flex items-center space-x-3 p-2">
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">Active</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Offline Users */}
            {offlineUsers.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-2" />
                  Offline ({offlineUsers.length})
                </h3>
                <div className="space-y-2">
                  {offlineUsers.map((user) => (
                    <div key={user.id} className="flex items-center space-x-3 p-2 opacity-60">
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full grayscale" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700">{user.name}</p>
                        <p className="text-xs text-gray-500">Last seen 2 hours ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="flex flex-col h-full">
            {/* Chat Messages */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
              {chatMessages.map((message) => (
                <div key={message.id} className={`flex ${message.user === 'You' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-3 py-2 rounded-lg ${
                    message.user === 'You' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    {message.user !== 'You' && (
                      <p className="text-xs font-medium mb-1">{message.user}</p>
                    )}
                    <p className="text-sm">{message.message}</p>
                    <p className={`text-xs mt-1 ${
                      message.user === 'You' ? 'text-blue-200' : 'text-gray-500'
                    }`}>
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowInviteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Invite Collaborators</h3>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="colleague@company.com"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleInvite();
                        }
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permission Level
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Can edit</option>
                    <option>Can comment</option>
                    <option>Can view</option>
                  </select>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowInviteModal(false)}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleInvite}
                    disabled={!inviteEmail.trim()}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Send Invite
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};