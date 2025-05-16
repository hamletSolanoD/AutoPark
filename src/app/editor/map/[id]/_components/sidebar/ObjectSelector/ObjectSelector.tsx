// app/editor/map/_components/ObjectSelector.tsx
'use client'
import React from 'react';
import { ObjectSearchBar } from './ObjectSearchBar';
import { useMapContext } from '../../MapViewer/MapProvider';
import { ObjectGrid } from './ObjectGrid';

export function ObjectSelector() {
  const { selectedObject } = useMapContext();

  return (
    <div className="p-4 space-y-4 h-full flex flex-col">
      {/* Header */}
      <div className="text-sm font-medium text-gray-700">
        Seleccionar Objeto
      </div>

      {/* Objeto seleccionado */}
      {selectedObject && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-2xl mr-3">{selectedObject.icon}</span>
              <div>
                <div className="font-medium text-indigo-900">
                  {selectedObject.name}
                </div>
                <div className="text-xs text-indigo-600">
                  {selectedObject.width}x{selectedObject.height} metros
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Búsqueda */}
      <ObjectSearchBar />

      {/* Grid de objetos disponibles */}
      <div className="flex-1 overflow-y-auto">
        <ObjectGrid />
      </div>

      {/* Propiedades del objeto seleccionado */}
      {selectedObject && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm font-medium text-gray-700 mb-3">
            Propiedades
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Ancho:</span>
              <span className="font-medium">{selectedObject.width}m</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Alto:</span>
              <span className="font-medium">{selectedObject.height}m</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tipo:</span>
              <span className="font-medium">{selectedObject.name}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}