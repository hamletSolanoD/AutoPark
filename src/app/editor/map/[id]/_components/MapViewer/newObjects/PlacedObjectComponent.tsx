'use client'
import React from 'react';
import { PlacedObject } from '../../MapProvider';

interface PlacedObjectComponentProps {
  placedObject: PlacedObject;
  cellSize: number;
  onClick?: (id: string) => void;
  isHovered?: boolean;
  showDeleteOverlay?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function PlacedObjectComponent({ 
  placedObject, 
  cellSize, 
  onClick,
  isHovered,
  showDeleteOverlay,
  onMouseEnter,
  onMouseLeave
}: PlacedObjectComponentProps) {
  const { objectType, x, y, id } = placedObject;

  return (
    <div
      className={`absolute cursor-pointer transition-all ${
        isHovered && showDeleteOverlay 
          ? 'ring-2 ring-red-500 bg-red-100/80' 
          : objectType.color
      }`}
      style={{
        left: x * cellSize,
        top: y * cellSize,
        width: objectType.width * cellSize,
        height: objectType.height * cellSize,
        zIndex: 100,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(id);
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="w-full h-full flex items-center justify-center border border-gray-300 rounded">
        <div className="text-2xl">
          {objectType.icon}
        </div>
      </div>
      {showDeleteOverlay && isHovered && (
        <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
          <div className="text-red-600 font-bold">🗑️</div>
        </div>
      )}
    </div>
  );
}