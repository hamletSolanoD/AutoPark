

import { useCallback } from 'react';
import { Position } from '~/types/grid';

interface VisibleRange {
    startX: number;
    endX: number;
    startY: number;
    endY: number;
}

export function useVisibleCells(
    position: Position,
    CELL_SIZE: number,
    metrosX: number,
    metrosY: number,
    viewportDimensions: { width: number; height: number }
) {
    return useCallback(() => {
        const startX = Math.max(0, Math.floor(-position.x / CELL_SIZE));
        const endX = Math.min(metrosX, Math.ceil((-position.x + viewportDimensions.width) / CELL_SIZE));
        const startY = Math.max(0, Math.floor(-position.y / CELL_SIZE));
        const endY = Math.min(metrosY, Math.ceil((-position.y + viewportDimensions.height) / CELL_SIZE));

        return { startX, endX, startY, endY };
    }, [position, CELL_SIZE, metrosX, metrosY, viewportDimensions]);
}