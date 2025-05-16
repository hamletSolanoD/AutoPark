'use client'
import React, { useRef } from 'react';
import { useDrag } from '~/hooks/EstacionamientoGrid/useDrag';
import { useViewport } from '~/hooks/EstacionamientoGrid/useViewport';
import { useVisibleCells } from '~/hooks/EstacionamientoGrid/useVisibleCells';
import { useZoom } from '~/hooks/EstacionamientoGrid/useZoom';
import { Minimap } from './MinimapComponent';

interface EstacionamientoGridProps {
    metrosX: number | null;
    metrosY: number | null;
}
export function EstacionamientoGrid({ metrosX, metrosY }: EstacionamientoGridProps) {
    if (!metrosX || !metrosY) {
        return (
            <div className="flex h-full items-center justify-center text-gray-500">
                Selecciona un estacionamiento para ver la cuadrícula
            </div>
        );
    }

    const containerRef = useRef<HTMLDivElement>(null);
    const BASE_CELL_SIZE = 40;

    const viewportDimensions = useViewport(containerRef);
    const { zoom, setZoom, position, setPosition, handleWheel } = useZoom(containerRef);
    const CELL_SIZE = BASE_CELL_SIZE * zoom;

    const totalWidth = metrosX * CELL_SIZE;
    const totalHeight = metrosY * CELL_SIZE;

    const { isDragging, handleMouseDown, handleMouseMove, handleMouseUp } = useDrag({
        position,
        setPosition,
        totalWidth,
        totalHeight,
        viewportDimensions
    });

    const getVisibleRange = useVisibleCells(position, CELL_SIZE, metrosX, metrosY, viewportDimensions);
    const visibleRange = getVisibleRange();

    // Renderizar celdas
    const cells = [];
    for (let y = visibleRange.startY; y < visibleRange.endY; y++) {
        for (let x = visibleRange.startX; x < visibleRange.endX; x++) {
            cells.push(
                <div
                    key={`${y}-${x}`}
                    className="absolute bg-white border border-gray-200"
                    style={{
                        left: x * CELL_SIZE,
                        top: y * CELL_SIZE,
                        width: CELL_SIZE,
                        height: CELL_SIZE,
                    }}
                />
            );
        }
    }

    const handleMinimapClick = (x: number, y: number) => {
        const minimapScale = Math.min(
            200 / (metrosX * BASE_CELL_SIZE),
            200 / (metrosY * BASE_CELL_SIZE)
        );

        // Convertir las coordenadas del minimapa a coordenadas del grid principal
        const newX = -(x / minimapScale * (CELL_SIZE / BASE_CELL_SIZE));
        const newY = -(y / minimapScale * (CELL_SIZE / BASE_CELL_SIZE));

        // Ajustar la posición considerando los límites
        const minX = -totalWidth + viewportDimensions.width;
        const minY = -totalHeight + viewportDimensions.height;

        setPosition({
            x: Math.min(0, Math.max(minX, newX)),
            y: Math.min(0, Math.max(minY, newY)),
        });
    };

    return (
        <div
            ref={containerRef}
            className="w-full h-[85%] relative overflow-hidden"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <div
                className="absolute"
                style={{
                    width: totalWidth,
                    height: totalHeight,
                    transform: `translate(${position.x}px, ${position.y}px)`,
                    cursor: isDragging ? 'grabbing' : 'grab',
                }}
            >
                {cells}
            </div>

            <Minimap
                metrosX={metrosX}
                metrosY={metrosY}
                position={position}
                viewportDimensions={viewportDimensions}
                totalWidth={totalWidth}
                totalHeight={totalHeight}
                BASE_CELL_SIZE={BASE_CELL_SIZE}
                onMinimapClick={handleMinimapClick}
            />

            {/* Controles de zoom */}
            <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-2 z-10">
                <button
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                    onClick={() => setZoom(prev => Math.min(prev * 1.1, 5))}
                >
                    +
                </button>
                <span className="mx-2">{Math.round(zoom * 100)}%</span>
                <button
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                    onClick={() => setZoom(prev => Math.max(prev * 0.9, 0.1))}
                >
                    -
                </button>
            </div>
        </div>
    );
}