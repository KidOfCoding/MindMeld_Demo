import React from 'react';
import { motion } from 'framer-motion';
import { 
  Copy, 
  Clipboard, 
  RotateCw, 
  Trash2, 
  Edit3, 
  Lock, 
  Unlock,
  Layers,
  Palette,
  Move
} from 'lucide-react';

interface ContextMenuProps {
  position: { x: number; y: number };
  onClose: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  hasSelection: boolean;
  hasClipboard: boolean;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  position,
  onClose,
  onCopy,
  onPaste,
  onDuplicate,
  onDelete,
  hasSelection,
  hasClipboard
}) => {
  const menuItems = [
    {
      label: 'Copy',
      icon: Copy,
      shortcut: 'Ctrl+C',
      action: onCopy,
      disabled: !hasSelection
    },
    {
      label: 'Paste',
      icon: Clipboard,
      shortcut: 'Ctrl+V',
      action: onPaste,
      disabled: !hasClipboard
    },
    {
      label: 'Duplicate',
      icon: RotateCw,
      shortcut: 'Ctrl+D',
      action: onDuplicate,
      disabled: !hasSelection
    },
    { type: 'divider' },
    {
      label: 'Edit',
      icon: Edit3,
      action: () => {},
      disabled: !hasSelection
    },
    {
      label: 'Bring to Front',
      icon: Layers,
      action: () => {},
      disabled: !hasSelection
    },
    {
      label: 'Send to Back',
      icon: Layers,
      action: () => {},
      disabled: !hasSelection
    },
    { type: 'divider' },
    {
      label: 'Lock',
      icon: Lock,
      action: () => {},
      disabled: !hasSelection
    },
    {
      label: 'Change Color',
      icon: Palette,
      action: () => {},
      disabled: !hasSelection
    },
    { type: 'divider' },
    {
      label: 'Delete',
      icon: Trash2,
      shortcut: 'Del',
      action: onDelete,
      disabled: !hasSelection,
      danger: true
    }
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      
      {/* Menu */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="absolute bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[200px] z-50"
        style={{
          left: position.x,
          top: position.y,
        }}
      >
        {menuItems.map((item, index) => {
          if (item.type === 'divider') {
            return <div key={index} className="h-px bg-gray-200 my-1" />;
          }

          const Icon = item.icon;
          
          return (
            <button
              key={index}
              onClick={() => {
                if (!item.disabled) {
                  item.action();
                  onClose();
                }
              }}
              disabled={item.disabled}
              className={`w-full flex items-center justify-between px-4 py-2 text-sm transition-colors ${
                item.disabled 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : item.danger
                    ? 'text-red-600 hover:bg-red-50'
                    : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
              {item.shortcut && (
                <span className="text-xs text-gray-400">{item.shortcut}</span>
              )}
            </button>
          );
        })}
      </motion.div>
    </>
  );
};