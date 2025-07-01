import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MousePointer } from 'lucide-react';

interface Collaborator {
  id: string;
  name: string;
  color: string;
  cursor?: { x: number; y: number };
}

interface CollaborativeCursorsProps {
  collaborators: Collaborator[];
  viewport: { x: number; y: number; zoom: number };
}

export const CollaborativeCursors: React.FC<CollaborativeCursorsProps> = ({
  collaborators,
  viewport
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      <AnimatePresence>
        {collaborators.map((collaborator) => {
          if (!collaborator.cursor) return null;

          const screenX = collaborator.cursor.x * viewport.zoom + viewport.x;
          const screenY = collaborator.cursor.y * viewport.zoom + viewport.y;

          return (
            <motion.div
              key={collaborator.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute"
              style={{
                left: screenX,
                top: screenY,
                transform: 'translate(-2px, -2px)'
              }}
            >
              {/* Cursor */}
              <div className="relative">
                <MousePointer 
                  className="w-5 h-5 drop-shadow-lg"
                  style={{ color: collaborator.color }}
                />
                
                {/* Name Label */}
                <div 
                  className="absolute top-6 left-2 px-2 py-1 rounded text-white text-xs font-medium whitespace-nowrap shadow-lg"
                  style={{ backgroundColor: collaborator.color }}
                >
                  {collaborator.name}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};