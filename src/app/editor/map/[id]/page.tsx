// app/editor/map/[id]/page.tsx
'use client'
import React from 'react';
import { useMapContext } from './_components/MapViewer/MapProvider';
import { EstacionamientoGrid } from './_components/MapViewer/EstacionamientoGrid';

export default function MapPage() {
  const { mapId, currentMap, isLoading } = useMapContext();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Cargando mapa...
          </h3>
          <p className="text-gray-500">ID: {mapId}</p>
        </div>
      </div>
    );
  }

  if (!currentMap) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Mapa no encontrado
          </h3>
          <p className="text-gray-500">ID: {mapId}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header del mapa */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {currentMap.nombreDeArea}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {currentMap.metrosX}m × {currentMap.metrosY}m • {currentMap.numeroEstacionamientos} espacios
            </p>
          </div>
          <div className="text-xs text-gray-400">
            ID: {mapId}
          </div>
        </div>
      </div>

      {/* Grid del estacionamiento */}
      <div className="flex-1">
        <EstacionamientoGrid
          metrosX={currentMap.metrosX}
          metrosY={currentMap.metrosY}
        />
      </div>
    </div>
  );
}