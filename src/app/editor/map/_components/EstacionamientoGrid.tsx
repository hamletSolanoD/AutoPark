'use client'
import React, { useState, useCallback, useRef, useEffect } from 'react';

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
    const [viewportDimensions, setViewportDimensions] = useState({ width: 0, height: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const BASE_CELL_SIZE = 40;
    const CELL_SIZE = BASE_CELL_SIZE * zoom;

    // Calcular dimensiones totales
    const totalWidth = metrosX * CELL_SIZE;
    const totalHeight = metrosY * CELL_SIZE;

    // Actualizar dimensiones del viewport
    useEffect(() => {
        if (containerRef.current) {
            const updateDimensions = () => {
                setViewportDimensions({
                    width: containerRef.current?.clientWidth || 0,
                    height: containerRef.current?.clientHeight || 0,
                });
            };

            updateDimensions();
            window.addEventListener('resize', updateDimensions);
            return () => window.removeEventListener('resize', updateDimensions);
        }
    }, []);

    // Calcular celdas visibles
    const getVisibleRange = useCallback(() => {
        if (!containerRef.current) return { startX: 0, endX: 0, startY: 0, endY: 0 };

        const startX = Math.max(0, Math.floor(-position.x / CELL_SIZE));
        const endX = Math.min(metrosX, Math.ceil((-position.x + viewportDimensions.width) / CELL_SIZE));
        const startY = Math.max(0, Math.floor(-position.y / CELL_SIZE));
        const endY = Math.min(metrosY, Math.ceil((-position.y + viewportDimensions.height) / CELL_SIZE));

        return { startX, endX, startY, endY };
    }, [position, CELL_SIZE, metrosX, metrosY, viewportDimensions]);

    // Manejo del zoom
    const handleWheel = useCallback((e: React.WheelEvent) => {
        if (e.ctrlKey) {
            e.preventDefault();
            const rect = containerRef.current?.getBoundingClientRect();
            if (!rect) return;

            // Calcular posición del cursor relativa al contenedor
            const mouseX = e.clientX - rect.left - position.x;
            const mouseY = e.clientY - rect.top - position.y;

            // Calcular nuevo zoom
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            const newZoom = Math.min(Math.max(0.1, zoom * delta), 5);

            // Ajustar posición para mantener el punto bajo el cursor
            const newPosition = {
                x: position.x - (mouseX * (delta - 1)),
                y: position.y - (mouseY * (delta - 1)),
            };

            setZoom(newZoom);
            setPosition(newPosition);
        }
    }, [zoom, position]);

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
            const newX = e.clientX - dragStart.x;
            const newY = e.clientY - dragStart.y;

            // Limitar el movimiento dentro de los límites
            const minX = -totalWidth + viewportDimensions.width;
            const minY = -totalHeight + viewportDimensions.height;

            setPosition({
                x: Math.min(0, Math.max(minX, newX)),
                y: Math.min(0, Math.max(minY, newY)),
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Renderizar celdas
    const visibleRange = getVisibleRange();
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