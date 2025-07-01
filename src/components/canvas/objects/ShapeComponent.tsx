import React, { useRef } from 'react';
import { Rect, Circle, RegularPolygon, Group } from 'react-konva';
import { CanvasObject } from '../../../types/canvas';
import Konva from 'konva';

interface ShapeComponentProps {
  object: CanvasObject;
  isSelected: boolean;
  onUpdate: (id: string, updates: Partial<CanvasObject>) => void;
  onSelect: () => void;
}

export const ShapeComponent: React.FC<ShapeComponentProps> = ({
  object,
  isSelected,
  onUpdate,
  onSelect
}) => {
  const groupRef = useRef<Konva.Group>(null);
  const shapeType = object.metadata?.shapeType || 'rectangle';

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

  const renderShape = () => {
    const commonProps = {
      fill: object.style.fill || '#3B82F6',
      stroke: object.style.stroke || '#1E40AF',
      strokeWidth: object.style.strokeWidth || 2,
      opacity: object.style.opacity || 1,
      shadowColor: isSelected ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)',
      shadowBlur: isSelected ? 8 : 4,
      shadowOffset: { x: 2, y: 2 },
      shadowOpacity: 0.3
    };

    switch (shapeType) {
      case 'circle':
        return (
          <Circle
            x={object.size.width / 2}
            y={object.size.height / 2}
            radius={Math.min(object.size.width, object.size.height) / 2}
            {...commonProps}
          />
        );
      case 'triangle':
        return (
          <RegularPolygon
            x={object.size.width / 2}
            y={object.size.height / 2}
            sides={3}
            radius={Math.min(object.size.width, object.size.height) / 2}
            {...commonProps}
          />
        );
      case 'diamond':
        return (
          <RegularPolygon
            x={object.size.width / 2}
            y={object.size.height / 2}
            sides={4}
            radius={Math.min(object.size.width, object.size.height) / 2}
            rotation={45}
            {...commonProps}
          />
        );
      case 'star':
        return (
          <RegularPolygon
            x={object.size.width / 2}
            y={object.size.height / 2}
            sides={5}
            radius={Math.min(object.size.width, object.size.height) / 2}
            innerRadius={Math.min(object.size.width, object.size.height) / 4}
            {...commonProps}
          />
        );
      default: // rectangle
        return (
          <Rect
            width={object.size.width}
            height={object.size.height}
            cornerRadius={object.style.borderRadius || 0}
            {...commonProps}
          />
        );
    }
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
      {renderShape()}
    </Group>
  );
};