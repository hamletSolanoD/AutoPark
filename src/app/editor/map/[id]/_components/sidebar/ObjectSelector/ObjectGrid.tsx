// app/editor/map/_components/ObjectGrid.tsx
'use client'
import React from 'react';
import { AVAILABLE_OBJECTS, ObjectType, useMapContext } from '../../MapProvider';

export function ObjectGrid() {
  const { selectedObject, setSelectedObject, objectSearchTerm } = useMapContext();

  // Filtrar objetos basado en la búsqueda
  const filteredObjects = AVAILABLE_OBJECTS.filter(object =>
    object.name.toLowerCase().includes(objectSearchTerm.toLowerCase())
  );

  const handleObjectSelect = (object: ObjectType) => {
    setSelectedObject(object);
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      {filteredObjects.map((object) => (
        <button
          key={object.id}
          onClick={() => handleObjectSelect(object)}
          className={`p-3 rounded-lg border text-center transition-all ${
            selectedObject?.id === object.id
              ? `${object.color} border-2 scale-105 shadow-md`
              : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
          }`}
        >
          <div className="text-2xl mb-2">
            {object.icon}
          </div>
          <div className="text-xs font-medium text-gray-700 truncate">
            {object.name}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {object.width}×{object.height}
          </div>
        </button>
      ))}
      
      {filteredObjects.length === 0 && objectSearchTerm && (
        <div className="col-span-3 text-center py-8 text-gray-500">
          <div className="text-sm">No se encontraron objetos</div>
          <div className="text-xs mt-1">
            Intenta con otro término de búsqueda
          </div>
        </div>
      )}
    </div>
  );
}