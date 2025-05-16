// src/types/grid.ts
export interface Position {
    x: number;
    y: number;
}

export interface ViewportDimensions {
    width: number;
    height: number;
}

export interface VisibleRange {
    startX: number;
    endX: number;
    startY: number;
    endY: number;
}