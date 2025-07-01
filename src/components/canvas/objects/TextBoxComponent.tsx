import React, { useState, useRef, useEffect } from 'react';
import { Text, Group } from 'react-konva';
import { CanvasObject } from '../../../types/canvas';
import Konva from 'konva';

interface TextBoxComponentProps {
  object: CanvasObject;
  isSelected: boolean;
  onUpdate: (id: string, updates: Partial<CanvasObject>) => void;
  onSelect: () => void;
}

export const TextBoxComponent: React.FC<TextBoxComponentProps> = ({
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

  const handleDragEnd = (e: any) => {
    onUpdate(object.id, {
      position: { x: e.target.x(), y: e.target.y() }
    });
  };

  const handleTransformEnd = (e: any) => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

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
      textarea.style.fontSize = (object.style.fontSize || 16) + 'px';
      textarea.style.fontFamily = object.style.fontFamily || 'Arial';
      textarea.style.fontWeight = object.style.fontWeight || 'normal';
      textarea.style.border = 'none';
      textarea.style.padding = '0px';
      textarea.style.margin = '0px';
      textarea.style.overflow = 'hidden';
      textarea.style.background = 'transparent';
      textarea.style.outline = 'none';
      textarea.style.resize = 'none';
      textarea.style.lineHeight = '1.2';
      textarea.style.color = object.style.fill || '#000000';

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
      {!isEditing && (
        <Text
          ref={textRef}
          text={object.content || 'Type here...'}
          width={object.size.width}
          height={object.size.height}
          fontSize={object.style.fontSize || 16}
          fontFamily={object.style.fontFamily || 'Arial'}
          fontStyle={object.style.fontWeight || 'normal'}
          fill={object.style.fill || '#000000'}
          align={object.style.textAlign || 'left'}
          verticalAlign="top"
          wrap="word"
        />
      )}
    </Group>
  );
};