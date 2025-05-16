// app/editor/map/_components/MapContext.tsx
'use client'
import React, { createContext, useContext, ReactNode, useState } from 'react';
import { api } from "~/trpc/react";

export type ToolType = 'zoom' | 'objects' | 'eraser';

export type ObjectType = {
  id: string;
  name: string;
  icon: string;
  width: number;
  height: number;
  color: string;
};

export interface PlacedObject {
  id: string;
  objectType: ObjectType;
  x: number;
  y: number;
  rotation?: number;
}

export const AVAILABLE_OBJECTS: ObjectType[] = [
  {
    id: 'estacionamiento',
    name: 'Estacionamiento',
    icon: '🚗',
    width: 2,
    height: 1,
    color: 'bg-blue-100 border-blue-300'
  },
  {
    id: 'zona-reunion',
    name: 'Zona de Reunión',
    icon: '👥',
    width: 3,
    height: 3,
    color: 'bg-green-100 border-green-300'
  },
  {
    id: 'calle',
    name: 'Calle',
    icon: '🛣️',
    width: 1,
    height: 1,
    color: 'bg-gray-100 border-gray-300'
  }
];

interface MapContextType {
  mapId: number;
  currentMap?: {
    id: number;
    nombreDeArea: string;
    metrosX: number;
    metrosY: number;
    numeroEstacionamientos: number;
    createdAt: Date;
    updatedAt: Date;
    createdById: string;
  };
  isLoading: boolean;
  error?: any;
  // Herramientas
  selectedTool: ToolType;
  setSelectedTool: (tool: ToolType) => void;
  selectedObject?: ObjectType;
  setSelectedObject: (object: ObjectType) => void;
  objectSearchTerm: string;
  setObjectSearchTerm: (term: string) => void;
  zoomLevel: number;
  setZoomLevel: (zoom: number) => void;
  // Nuevas funciones para objetos colocados
  placedObjects: PlacedObject[];
  setPlacedObjects: (objects: PlacedObject[]) => void;
  addPlacedObject: (object: PlacedObject) => void;
  removePlacedObject: (id: string) => void;
  previewPosition: { x: number; y: number } | null;
  setPreviewPosition: (position: { x: number; y: number } | null) => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export function MapProvider({ children, mapId }: { children: ReactNode; mapId: number }) {
  // Datos del mapa
  const { data: currentMap, isLoading, error } = api.zonaEstacionamiento.getById.useQuery(
    { id: mapId },
    { enabled: !!mapId }
  );

  // Estado de herramientas
  const [selectedTool, setSelectedTool] = useState<ToolType>('objects');
  const [selectedObject, setSelectedObject] = useState<ObjectType | undefined>(AVAILABLE_OBJECTS[0]);
  const [objectSearchTerm, setObjectSearchTerm] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  
  // Nuevo estado para objetos colocados
  const [placedObjects, setPlacedObjects] = useState<PlacedObject[]>([]);
  const [previewPosition, setPreviewPosition] = useState<{ x: number; y: number } | null>(null);

  // Funciones para manejar objetos colocados
  const addPlacedObject = (object: PlacedObject) => {
    setPlacedObjects(prev => [...prev, object]);
  };

  const removePlacedObject = (id: string) => {
    setPlacedObjects(prev => prev.filter(obj => obj.id !== id));
  };

  let map = currentMap || {
    id: mapId,
    nombreDeArea: 'Cargando...',
    metrosX: 10,
    metrosY: 10,
    numeroEstacionamientos: 100,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdById: '',
  };

  const value: MapContextType = {
    mapId,
    currentMap: map,
    isLoading,
    error,
    selectedTool,
    setSelectedTool,
    selectedObject,
    setSelectedObject,
    objectSearchTerm,
    setObjectSearchTerm,
    zoomLevel,
    setZoomLevel,
    placedObjects,
    setPlacedObjects,
    addPlacedObject,
    removePlacedObject,
    previewPosition,
    setPreviewPosition,
  };

  return (
    <MapContext.Provider value={value}>
      {children}
    </MapContext.Provider>
  );
}

export function useMapContext() {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error('useMapContext must be used within a MapProvider');
  }
  return context;
}

export function useMapData() {
  const { currentMap, isLoading, error } = useMapContext();
  return { currentMap, isLoading, error };
}