// MinimapComponent.tsx
'use client'
import React from 'react';

interface MinimapProps {
    metrosX: number;
    metrosY: number;
    position: { x: number; y: number };
    viewportDimensions: { width: number; height: number };
    totalWidth: number;
    totalHeight: number;
    BASE_CELL_SIZE: number;
    onMinimapClick: (x: number, y: number) => void;
}

export function Minimap({
    metrosX,
    metrosY,
    position,
    viewportDimensions,
    totalWidth,
    totalHeight,
    BASE_CELL_SIZE,
    onMinimapClick
}: MinimapProps) {
    const MINIMAP_SIZE = 200;
    
    // Calcular escala del minimapa
    const minimapScale = Math.min(
        MINIMAP_SIZE / (metrosX * BASE_CELL_SIZE),
        MINIMAP_SIZE / (metrosY * BASE_CELL_SIZE)
    );

    // Calcular la posición del viewport en el minimapa
    const minimapViewport = {
        width: (viewportDimensions.width / totalWidth) * (metrosX * BASE_CELL_SIZE * minimapScale),
        height: (viewportDimensions.height / totalHeight) * (metrosY * BASE_CELL_SIZE * minimapScale),
        x: (-position.x / totalWidth) * (metrosX * BASE_CELL_SIZE * minimapScale),
        y: (-position.y / totalHeight) * (metrosY * BASE_CELL_SIZE * minimapScale)
    };

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        onMinimapClick(x, y);
    };

    return (
        <div 
            className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-2 z-10"
            style={{
                width: MINIMAP_SIZE + 4,
                height: MINIMAP_SIZE + 4,
            }}
        >
            <div
                className="relative bg-gray-100"
                style={{
                    width: MINIMAP_SIZE,
                    height: MINIMAP_SIZE,
                }}
                onClick={handleClick}
            >
                <div
                    className="absolute bg-gray-200"
                    style={{
                        width: metrosX * BASE_CELL_SIZE * minimapScale,
                        height: metrosY * BASE_CELL_SIZE * minimapScale,
                    }}
                />
                <div
                    className="absolute border-2 border-red-500"
                    style={{
                        width: Math.min(minimapViewport.width, MINIMAP_SIZE),
                        height: Math.min(minimapViewport.height, MINIMAP_SIZE),
                        transform: `translate(${minimapViewport.x}px, ${minimapViewport.y}px)`,
                        pointerEvents: 'none',
                    }}
                />
            </div>
        </div>
    );
}