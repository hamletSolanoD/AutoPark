'use client'
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

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

    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const BASE_CELL_SIZE = 40;
    const CELL_SIZE = BASE_CELL_SIZE * zoom;

    // Calcular dimensiones totales
    const totalWidth = metrosX * CELL_SIZE;
    const totalHeight = metrosY * CELL_SIZE;

    // Configurar virtualización
    const parentRef = useRef<HTMLDivElement>(null);

    const rowVirtualizer = useVirtualizer({
        count: metrosY,
        getScrollElement: () => parentRef.current,
        estimateSize: () => CELL_SIZE,
        overscan: 5,
    });

    const columnVirtualizer = useVirtualizer({
        count: metrosX,
        getScrollElement: () => parentRef.current,
        estimateSize: () => CELL_SIZE,
        horizontal: true,
        overscan: 5,
    });

    // Manejo del zoom
    const handleWheel = useCallback((e: React.WheelEvent) => {
        if (e.ctrlKey) {
            e.preventDefault();
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            setZoom(prev => Math.min(Math.max(0.1, prev * delta), 5));
        }
    }, []);

    // Manejo del drag
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y,
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Renderizar solo las celdas visibles
    const visibleCells = React.useMemo(() => {
        const cells = [];
        for (const virtualRow of rowVirtualizer.getVirtualItems()) {
            for (const virtualCol of columnVirtualizer.getVirtualItems()) {
                cells.push(
                    <div
                        key={`${virtualRow.index}-${virtualCol.index}`}
                        className="bg-white border border-gray-200"
                        style={{
                            position: 'absolute',
                            top: virtualRow.start,
                            left: virtualCol.start,
                            width: CELL_SIZE,
                            height: CELL_SIZE,
                        }}
                    />
                );
            }
        }
        return cells;
    }, [rowVirtualizer.getVirtualItems(), columnVirtualizer.getVirtualItems(), CELL_SIZE]);

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
                ref={parentRef}
                className="absolute overflow-auto"
                style={{
                    width: '100%',
                    height: '100%',
                    cursor: isDragging ? 'grabbing' : 'grab',
                }}
            >
                <div
                    style={{
                        width: totalWidth,
                        height: totalHeight,
                        position: 'relative',
                        transform: `translate(${position.x}px, ${position.y}px)`,
                    }}
                >
                    {visibleCells}
                </div>
            </div>
            
            {/* Controles de zoom */}
            <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-2">
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