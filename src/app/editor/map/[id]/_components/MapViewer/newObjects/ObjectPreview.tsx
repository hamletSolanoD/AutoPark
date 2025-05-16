'use client'
import React from 'react';
import { ObjectType } from '../../MapProvider';

interface ObjectPreviewProps {
  object: ObjectType;
  x: number;
  y: number;
  cellSize: number;
  isValid: boolean;
}

export function ObjectPreview({ object, x, y, cellSize, isValid }: ObjectPreviewProps) {
  return (
    <div
      className={`absolute border-2 border-dashed ${
        isValid 
          ? 'border-green-500 bg-green-100/50' 
          : 'border-red-500 bg-red-100/50'
      } pointer-events-none`}
      style={{
        left: x * cellSize,
        top: y * cellSize,
        width: object.width * cellSize,
        height: object.height * cellSize,
        zIndex: 1000,
      }}
    >
      <div className="w-full h-full flex items-center justify-center">
        <div className={`text-2xl ${isValid ? 'opacity-80' : 'opacity-60'}`}>
          {object.icon}
        </div>
      </div>
    </div>
  );
}