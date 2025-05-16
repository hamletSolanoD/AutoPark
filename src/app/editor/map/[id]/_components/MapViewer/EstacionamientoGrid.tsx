'use client'
import React, { useRef, useState, useCallback } from 'react';
import { useDrag } from '~/hooks/EstacionamientoGrid/useDrag';
import { useViewport } from '~/hooks/EstacionamientoGrid/useViewport';
import { useVisibleCells } from '~/hooks/EstacionamientoGrid/useVisibleCells';
import { useZoom } from '~/hooks/EstacionamientoGrid/useZoom';
import { useMapContext } from '../MapProvider';
import { SaveIndicator } from '../sidebar/ObjectSelector/SaveIndicator';
import { ObjectPreview } from './newObjects/ObjectPreview';
import { PlacedObjectComponent } from './newObjects/PlacedObjectComponent';


export function EstacionamientoGrid() {
    const {
        currentMap,
        selectedTool,
        selectedObject,
        zoomLevel,
        setZoomLevel,
        placedObjects,
        addPlacedObject,
        removePlacedObject,
        previewPosition,
        setPreviewPosition,
    } = useMapContext();

    const [hoveredObjectId, setHoveredObjectId] = useState<string | null>(null);

    if (!currentMap || !currentMap.metrosX || !currentMap.metrosY) {
        return (
            <div className="flex h-full items-center justify-center text-gray-500">
                Selecciona un estacionamiento para ver la cuadrícula
            </div>
        );
    }

    const { metrosX, metrosY } = currentMap;
    const containerRef = useRef<HTMLDivElement>(null);
    const BASE_CELL_SIZE = 40;

    const viewportDimensions = useViewport(containerRef);
    const { position, setPosition, handleWheel } = useZoom(containerRef, zoomLevel, setZoomLevel);
    const CELL_SIZE = BASE_CELL_SIZE * zoomLevel;

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

    const getGridCoordinates = useCallback((clientX: number, clientY: number) => {
        if (!containerRef.current) return null;
        
        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left - position.x;
        const y = clientY - rect.top - position.y;
        
        const gridX = Math.floor(x / CELL_SIZE);
        const gridY = Math.floor(y / CELL_SIZE);
        
        return { x: gridX, y: gridY };
    }, [CELL_SIZE, position]);

    const isValidPosition = useCallback((x: number, y: number, object: any) => {
        if (x < 0 || y < 0 || x + object.width > metrosX || y + object.height > metrosY) {
            return false;
        }

        for (const placedObj of placedObjects) {
            const { objectType, x: px, y: py } = placedObj;
            if (!(x + object.width <= px || px + objectType.width <= x || 
                  y + object.height <= py || py + objectType.height <= y)) {
                return false;
            }
        }
        return true;
    }, [metrosX, metrosY, placedObjects]);

    const handleGridMouseMove = useCallback((e: React.MouseEvent) => {
        handleMouseMove(e);
        
        if (selectedTool === 'objects' && selectedObject) {
            const coords = getGridCoordinates(e.clientX, e.clientY);
            setPreviewPosition(coords);
        } else {
            setPreviewPosition(null);
        }
    }, [selectedTool, selectedObject, getGridCoordinates, setPreviewPosition, handleMouseMove]);

    const handleGridMouseLeave = useCallback(() => {
        handleMouseUp();
        setPreviewPosition(null);
        setHoveredObjectId(null);
    }, [handleMouseUp, setPreviewPosition]);

    const handleGridClick = useCallback((e: React.MouseEvent) => {
        if (isDragging) return;

        const coords = getGridCoordinates(e.clientX, e.clientY);
        if (!coords) return;

        if (selectedTool === 'objects' && selectedObject) {
            if (isValidPosition(coords.x, coords.y, selectedObject)) {
                const newObject = {
                    id: `${selectedObject.id}-${Date.now()}-${Math.random()}`,
                    objectType: selectedObject,
                    x: coords.x,
                    y: coords.y,
                };
                addPlacedObject(newObject);
            }
        } else if (selectedTool === 'eraser') {
            const clickedObject = placedObjects.find(obj => {
                const { objectType, x, y } = obj;
                return coords.x >= x && coords.x < x + objectType.width &&
                       coords.y >= y && coords.y < y + objectType.height;
            });
            
            if (clickedObject) {
                removePlacedObject(clickedObject.id);
            }
        }
    }, [selectedTool, selectedObject, isValidPosition, addPlacedObject, removePlacedObject, placedObjects, getGridCoordinates, isDragging]);

    const handleObjectMouseEnter = useCallback((id: string) => {
        if (selectedTool === 'eraser') {
            setHoveredObjectId(id);
        }
    }, [selectedTool]);

    const handleObjectMouseLeave = useCallback(() => {
        setHoveredObjectId(null);
    }, []);

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

    const getCursor = () => {
        if (isDragging) return 'grabbing';
        if (selectedTool === 'eraser') return 'pointer';
        if (selectedTool === 'objects' && selectedObject) return 'crosshair';
        return 'grab';
    };

    return (
        <div
            ref={containerRef}
            className="w-full h-[85%] relative overflow-hidden"
            style={{ cursor: getCursor() }}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleGridMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleGridMouseLeave}
            onClick={handleGridClick}
        >
            <div
                className="absolute"
                style={{
                    width: totalWidth,
                    height: totalHeight,
                    transform: `translate(${position.x}px, ${position.y}px)`,
                }}
            >
                {cells}
                
                {placedObjects.map((placedObject) => (
                    <PlacedObjectComponent
                        key={placedObject.id}
                        placedObject={placedObject}
                        cellSize={CELL_SIZE}
                        onClick={selectedTool === 'eraser' ? removePlacedObject : undefined}
                        isHovered={hoveredObjectId === placedObject.id}
                        showDeleteOverlay={selectedTool === 'eraser'}
                        onMouseEnter={() => handleObjectMouseEnter(placedObject.id)}
                        onMouseLeave={handleObjectMouseLeave}
                    />
                ))}

                {selectedTool === 'objects' && selectedObject && previewPosition && (
                    <ObjectPreview
                        object={selectedObject}
                        x={previewPosition.x}
                        y={previewPosition.y}
                        cellSize={CELL_SIZE}
                        isValid={isValidPosition(previewPosition.x, previewPosition.y, selectedObject)}
                    />
                )}
            </div>

            <SaveIndicator />
        </div>
    );
}