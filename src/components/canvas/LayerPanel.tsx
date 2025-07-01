import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Plus, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  MoreHorizontal,
  Edit3,
  Trash2,
  Copy
} from 'lucide-react';

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  objects: string[];
}

interface LayerPanelProps {
  layers: Layer[];
  onClose: () => void;
}

export const LayerPanel: React.FC<LayerPanelProps> = ({
  layers,
  onClose
}) => {
  const [editingLayer, setEditingLayer] = useState<string | null>(null);
  const [layerName, setLayerName] = useState('');

  const handleAddLayer = () => {
    // Add new layer logic
    console.log('Adding new layer');
  };

  const handleDeleteLayer = (layerId: string) => {
    // Delete layer logic
    console.log('Deleting layer:', layerId);
  };

  const handleToggleVisibility = (layerId: string) => {
    // Toggle layer visibility logic
    console.log('Toggling visibility for layer:', layerId);
  };

  const handleToggleLock = (layerId: string) => {
    // Toggle layer lock logic
    console.log('Toggling lock for layer:', layerId);
  };

  const handleRenameLayer = (layerId: string, newName: string) => {
    // Rename layer logic
    console.log('Renaming layer:', layerId, 'to:', newName);
    setEditingLayer(null);
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute right-4 top-20 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Layers</h3>
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddLayer}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Add Layer"
          >
            <Plus className="w-4 h-4" />
          </motion.button>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Layer List */}
      <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
        {layers.map((layer, index) => (
          <div
            key={layer.id}
            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {/* Layer Order */}
            <span className="text-xs text-gray-500 w-6 text-center">
              {layers.length - index}
            </span>

            {/* Visibility Toggle */}
            <button
              onClick={() => handleToggleVisibility(layer.id)}
              className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
              title={layer.visible ? 'Hide Layer' : 'Show Layer'}
            >
              {layer.visible ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>

            {/* Lock Toggle */}
            <button
              onClick={() => handleToggleLock(layer.id)}
              className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
              title={layer.locked ? 'Unlock Layer' : 'Lock Layer'}
            >
              {layer.locked ? (
                <Lock className="w-4 h-4" />
              ) : (
                <Unlock className="w-4 h-4" />
              )}
            </button>

            {/* Layer Name */}
            <div className="flex-1">
              {editingLayer === layer.id ? (
                <input
                  type="text"
                  value={layerName}
                  onChange={(e) => setLayerName(e.target.value)}
                  onBlur={() => handleRenameLayer(layer.id, layerName)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleRenameLayer(layer.id, layerName);
                    } else if (e.key === 'Escape') {
                      setEditingLayer(null);
                    }
                  }}
                  className="w-full px-2 py-1 text-sm border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              ) : (
                <div
                  className="cursor-pointer"
                  onDoubleClick={() => {
                    setEditingLayer(layer.id);
                    setLayerName(layer.name);
                  }}
                >
                  <div className="text-sm font-medium text-gray-900">
                    {layer.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {layer.objects.length} objects
                  </div>
                </div>
              )}
            </div>

            {/* Layer Actions */}
            <div className="relative group">
              <button className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="w-4 h-4" />
              </button>
              
              <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                  onClick={() => {
                    setEditingLayer(layer.id);
                    setLayerName(layer.name);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Rename</span>
                </button>
                <button
                  onClick={() => console.log('Duplicate layer:', layer.id)}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Copy className="w-3 h-3" />
                  <span>Duplicate</span>
                </button>
                <button
                  onClick={() => handleDeleteLayer(layer.id)}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Drag layers to reorder • Double-click to rename
        </div>
      </div>
    </motion.div>
  );
};