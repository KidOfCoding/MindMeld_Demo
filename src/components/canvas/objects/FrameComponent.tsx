import React, { useRef } from 'react';
import { Rect, Text, Group } from 'react-konva';
import { CanvasObject } from '../../../types/canvas';
import Konva from 'konva';

interface FrameComponentProps {
  object: CanvasObject;
  isSelected: boolean;
  onUpdate: (id: string, updates: Partial<CanvasObject>) => void;
  onSelect: () => void;
}

export const FrameComponent: React.FC<FrameComponentProps> = ({
  object,
  isSelected,
  onUpdate,
  onSelect
}) => {
  const groupRef = useRef<Konva.Group>(null);

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
        width: Math.max(100, node.width() * scaleX),
        height: Math.max(100, node.height() * scaleY)
      },
      transform: {
        ...object.transform,
        rotation: node.rotation()
      }
    });
  };

  return (
    <Group
      ref={groupRef}
      id={object.id}
      x={object.position.x}
      y={object.position.y}
      rotation={object.transform.rotation}
      draggable
      onClick={onSelect}
      onDragEnd={handleDragEnd}
      onTransformEnd={handleTransformEnd}
    >
      {/* Frame Background */}
      <Rect
        width={object.size.width}
        height={object.size.height}
        fill="rgba(255,255,255,0.1)"
        stroke={object.style.stroke || '#666666'}
        strokeWidth={object.style.strokeWidth || 2}
        dash={[10, 5]}
        cornerRadius={8}
      />

      {/* Frame Title */}
      <Text
        text={object.content || 'Frame'}
        x={10}
        y={-25}
        fontSize={14}
        fontFamily="Arial"
        fontStyle="bold"
        fill={object.style.fill || '#666666'}
      />
    </Group>
  );
};