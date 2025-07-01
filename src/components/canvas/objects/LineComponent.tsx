import React, { useRef } from 'react';
import { Line, Arrow, Group } from 'react-konva';
import { CanvasObject } from '../../../types/canvas';
import Konva from 'konva';

interface LineComponentProps {
  object: CanvasObject;
  isSelected: boolean;
  onUpdate: (id: string, updates: Partial<CanvasObject>) => void;
  onSelect: () => void;
}

export const LineComponent: React.FC<LineComponentProps> = ({
  object,
  isSelected,
  onUpdate,
  onSelect
}) => {
  const groupRef = useRef<Konva.Group>(null);
  
  const startPoint = object.metadata?.startPoint || { x: 0, y: 0 };
  const endPoint = object.metadata?.endPoint || { x: 100, y: 0 };
  const isArrow = object.type === 'arrow';

  const handleDragEnd = (e: any) => {
    onUpdate(object.id, {
      position: { x: e.target.x(), y: e.target.y() }
    });
  };

  const points = [
    startPoint.x - object.position.x,
    startPoint.y - object.position.y,
    endPoint.x - object.position.x,
    endPoint.y - object.position.y
  ];

  const LineComponent = isArrow ? Arrow : Line;

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
    >
      <LineComponent
        points={points}
        stroke={object.style.stroke || '#000000'}
        strokeWidth={object.style.strokeWidth || 2}
        lineCap="round"
        lineJoin="round"
        opacity={object.style.opacity || 1}
        shadowColor={isSelected ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}
        shadowBlur={isSelected ? 6 : 3}
        shadowOffset={{ x: 1, y: 1 }}
        shadowOpacity={0.3}
        {...(isArrow && {
          pointerLength: 10,
          pointerWidth: 8,
          fill: object.style.stroke || '#000000'
        })}
      />
    </Group>
  );
};