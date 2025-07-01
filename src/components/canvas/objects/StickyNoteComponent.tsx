import React, { useState, useRef, useEffect } from 'react';
import { Rect, Text, Group } from 'react-konva';
import { CanvasObject } from '../../../types/canvas';
import Konva from 'konva';

interface StickyNoteComponentProps {
  object: CanvasObject;
  isSelected: boolean;
  onUpdate: (id: string, updates: Partial<CanvasObject>) => void;
  onSelect: () => void;
}

export const StickyNoteComponent: React.FC<StickyNoteComponentProps> = ({
  object,
  isSelected,
  onUpdate,
  onSelect
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const textRef = useRef<Konva.Text>(null);
  const groupRef = useRef<Konva.Group>(null);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTextChange = (e: any) => {
    const newText = e.target.value;
    onUpdate(object.id, { content: newText });
  };

  const handleTextBlur = () => {
    setIsEditing(false);
  };

  const handleDragEnd = (e: any) => {
    onUpdate(object.id, {
      position: { x: e.target.x(), y: e.target.y() }
    });
  };

  const handleTransformEnd = (e: any) => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // Reset scale and update size
    node.scaleX(1);
    node.scaleY(1);

    onUpdate(object.id, {
      size: {
        width: Math.max(5, node.width() * scaleX),
        height: Math.max(5, node.height() * scaleY)
      },
      transform: {
        ...object.transform,
        rotation: node.rotation()
      }
    });
  };

  useEffect(() => {
    if (isEditing && textRef.current) {
      // Create textarea for editing
      const textNode = textRef.current;
      const stage = textNode.getStage();
      if (!stage) return;

      const textarea = document.createElement('textarea');
      document.body.appendChild(textarea);

      const transform = textNode.getAbsoluteTransform();
      const pos = transform.point({ x: 0, y: 0 });

      textarea.value = object.content || '';
      textarea.style.position = 'absolute';
      textarea.style.top = pos.y + 'px';
      textarea.style.left = pos.x + 'px';
      textarea.style.width = object.size.width + 'px';
      textarea.style.height = object.size.height + 'px';
      textarea.style.fontSize = (object.style.fontSize || 14) + 'px';
      textarea.style.fontFamily = object.style.fontFamily || 'Arial';
      textarea.style.border = 'none';
      textarea.style.padding = '10px';
      textarea.style.margin = '0px';
      textarea.style.overflow = 'hidden';
      textarea.style.background = 'transparent';
      textarea.style.outline = 'none';
      textarea.style.resize = 'none';
      textarea.style.lineHeight = '1.2';
      textarea.style.transformOrigin = 'left top';

      textarea.focus();
      textarea.select();

      textarea.addEventListener('blur', () => {
        onUpdate(object.id, { content: textarea.value });
        document.body.removeChild(textarea);
        setIsEditing(false);
      });

      textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          document.body.removeChild(textarea);
          setIsEditing(false);
        }
      });
    }
  }, [isEditing, object, onUpdate]);

  return (
    <Group
      ref={groupRef}
      id={object.id}
      x={object.position.x}
      y={object.position.y}
      rotation={object.transform.rotation}
      draggable
      onClick={onSelect}
      onDblClick={handleDoubleClick}
      onDragEnd={handleDragEnd}
      onTransformEnd={handleTransformEnd}
    >
      {/* Sticky Note Background */}
      <Rect
        width={object.size.width}
        height={object.size.height}
        fill={object.style.fill || '#FFE066'}
        stroke={object.style.stroke || '#E6CC00'}
        strokeWidth={object.style.strokeWidth || 1}
        cornerRadius={8}
        shadowColor="rgba(0,0,0,0.2)"
        shadowBlur={isSelected ? 10 : 5}
        shadowOffset={{ x: 2, y: 2 }}
        shadowOpacity={0.3}
      />

      {/* Text Content */}
      {!isEditing && (
        <Text
          ref={textRef}
          text={object.content || 'Double-click to edit'}
          x={10}
          y={10}
          width={object.size.width - 20}
          height={object.size.height - 20}
          fontSize={object.style.fontSize || 14}
          fontFamily={object.style.fontFamily || 'Arial'}
          fill={object.style.textColor || '#000000'}
          align={object.style.textAlign || 'left'}
          verticalAlign="top"
          wrap="word"
        />
      )}
    </Group>
  );
};