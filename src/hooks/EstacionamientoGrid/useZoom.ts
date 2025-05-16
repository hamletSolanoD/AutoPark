import { useState, useCallback, RefObject } from 'react';

interface Position {
    x: number;
    y: number;
}

export function useZoom(containerRef: RefObject<HTMLDivElement>, zoomLevel: number, setZoomLevel: (zoom: number) => void) {
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

    const handleWheel = useCallback((e: React.WheelEvent) => {
        if (e.ctrlKey) {
            e.preventDefault();
            const rect = containerRef.current?.getBoundingClientRect();
            if (!rect) return;

            const mouseX = e.clientX - rect.left - position.x;
            const mouseY = e.clientY - rect.top - position.y;

            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            const newZoom = Math.min(Math.max(0.1, zoom * delta), 5);

            const newPosition = {
                x: position.x - (mouseX * (delta - 1)),
                y: position.y - (mouseY * (delta - 1)),
            };

            setZoom(newZoom);
            setPosition(newPosition);
        }
    }, [zoom, position]);

    return { zoom, setZoom, position, setPosition, handleWheel };
}