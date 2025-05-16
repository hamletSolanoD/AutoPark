import { useState, useCallback } from 'react';

interface Position {
    x: number;
    y: number;
}

interface UseDragProps {
    position: Position;
    setPosition: (position: Position) => void;
    totalWidth: number;
    totalHeight: number;
    viewportDimensions: { width: number; height: number };
}

export function useDrag({
    position,
    setPosition,
    totalWidth,
    totalHeight,
    viewportDimensions
}: UseDragProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });
    }, [position]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (isDragging) {
            const newX = e.clientX - dragStart.x;
            const newY = e.clientY - dragStart.y;

            const minX = -totalWidth + viewportDimensions.width;
            const minY = -totalHeight + viewportDimensions.height;

            setPosition({
                x: Math.min(0, Math.max(minX, newX)),
                y: Math.min(0, Math.max(minY, newY)),
            });
        }
    }, [isDragging, dragStart, totalWidth, totalHeight, viewportDimensions]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    return {
        isDragging,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp
    };
}