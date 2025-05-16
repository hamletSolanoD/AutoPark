// app/editor/map/_components/EraserTool.tsx
'use client'
import React from 'react';
import { TrashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export function EraserTool() {
  return (
    <div className="p-4 space-y-4">
      <div className="text-sm font-medium text-gray-700 mb-3">
        Herramienta de Borrado
      </div>

      {/* Estado de la herramienta */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
        <div className="flex items-center">
          <TrashIcon className="h-6 w-6 text-red-600 mr-3" />
          <div>
            <div className="font-medium text-red-900">
              Modo Borrador Activo
            </div>
            <div className="text-xs text-red-600 mt-1">
              Haz clic en los objetos para eliminarlos
            </div>
          </div>
        </div>
      </div>

      {/* Instrucciones */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
        <div className="flex items-start">
          <ExclamationTriangleIcon className="h-5 w-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-800">
            <div className="font-medium mb-1">Instrucciones:</div>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>Haz clic en cualquier objeto para eliminarlo</li>
              <li>Los cambios se aplicarán inmediatamente</li>
              <li>No se puede deshacer esta acción</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Opciones de borrado */}
      <div className="space-y-3">
        <div className="text-sm font-medium text-gray-700">
          Opciones de Borrado
        </div>

        <button className="w-full flex items-center justify-center px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors border border-red-200">
          <TrashIcon className="h-5 w-5 mr-2" />
          Borrar Todo el Mapa
        </button>

        <button className="w-full flex items-center justify-center px-4 py-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors border border-orange-200">
          <TrashIcon className="h-5 w-5 mr-2" />
          Borrar Solo Estacionamientos
        </button>

        <button className="w-full flex items-center justify-center px-4 py-3 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors border border-yellow-200">
          <TrashIcon className="h-5 w-5 mr-2" />
          Borrar Solo Zonas de Reunión
        </button>
      </div>

      {/* Estadísticas de objetos */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-sm font-medium text-gray-700 mb-3">
          Objetos en el Mapa
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Estacionamientos:</span>
            <span className="font-medium">24</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Zonas de Reunión:</span>
            <span className="font-medium">3</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Calles:</span>
            <span className="font-medium">5</span>
          </div>
        </div>
      </div>
    </div>
  );
}