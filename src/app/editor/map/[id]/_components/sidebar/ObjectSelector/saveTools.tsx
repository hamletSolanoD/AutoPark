'use client'
import React from 'react';
import { 
  CloudArrowUpIcon, 
  ClockIcon, 
  CheckCircleIcon,
  ExclamationCircleIcon 
} from '@heroicons/react/24/outline';
import { useMapContext } from '../../MapProvider';

export function SaveTools() {
  const { 
    autoSave, 
    setAutoSave, 
    saveObjects, 
    isSaving, 
    lastSaved,
    placedObjects 
  } = useMapContext();

  const formatLastSaved = () => {
    if (!lastSaved) return 'Nunca';
    
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - lastSaved.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Hace menos de 1 minuto';
    if (diffMinutes < 60) return `Hace ${diffMinutes} minuto${diffMinutes > 1 ? 's' : ''}`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    
    return lastSaved.toLocaleDateString();
  };

  const hasUnsavedChanges = () => {
    if (!lastSaved) return placedObjects.length > 0;
    return lastSaved < new Date(Date.now() - 1000); // Hay cambios si el último guardado fue hace más de 1 segundo
  };

  return (
    <div className="p-4 space-y-4">
      <div className="text-sm font-medium text-gray-700 mb-3">
        Guardado
      </div>

      {/* Estado del guardado */}
      <div className={`rounded-lg p-3 ${
        isSaving ? 'bg-blue-50 border-blue-200' :
        !hasUnsavedChanges() ? 'bg-green-50 border-green-200' :
        'bg-yellow-50 border-yellow-200'
      } border`}>
        <div className="flex items-center">
          {isSaving ? (
            <ClockIcon className="h-5 w-5 text-blue-600 mr-3 animate-spin" />
          ) : !hasUnsavedChanges() ? (
            <CheckCircleIcon className="h-5 w-5 text-green-600 mr-3" />
          ) : (
            <ExclamationCircleIcon className="h-5 w-5 text-yellow-600 mr-3" />
          )}
          <div>
            <div className={`text-sm font-medium ${
              isSaving ? 'text-blue-900' :
              !hasUnsavedChanges() ? 'text-green-900' :
              'text-yellow-900'
            }`}>
              {isSaving ? 'Guardando...' :
               !hasUnsavedChanges() ? 'Todo guardado' :
               'Cambios sin guardar'}
            </div>
            <div className={`text-xs mt-1 ${
              isSaving ? 'text-blue-600' :
              !hasUnsavedChanges() ? 'text-green-600' :
              'text-yellow-600'
            }`}>
              {isSaving ? 'Sincronizando con el servidor' :
               `Último guardado: ${formatLastSaved()}`}
            </div>
          </div>
        </div>
      </div>

      {/* Guardado manual */}
      <button
        onClick={saveObjects}
        disabled={isSaving || (!hasUnsavedChanges() && placedObjects.length === 0)}
        className="w-full flex items-center justify-center px-4 py-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <CloudArrowUpIcon className="h-5 w-5 mr-2" />
        {isSaving ? 'Guardando...' : 'Guardar Ahora'}
      </button>

      {/* Auto guardado */}
      <div className="space-y-3">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={autoSave}
            onChange={(e) => setAutoSave(e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="ml-2 text-sm text-gray-700">
            Guardado automático
          </span>
        </label>
        
        {autoSave && (
          <div className="text-xs text-gray-500 pl-6">
            Se guardará automáticamente cada 5 minutos cuando haya cambios
          </div>
        )}
      </div>

      {/* Estadísticas */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-sm font-medium text-gray-700 mb-3">
          Estado del Mapa
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Objetos colocados:</span>
            <span className="font-medium">{placedObjects.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Últimos cambios:</span>
            <span className="font-medium text-xs">
              {hasUnsavedChanges() ? 'Pendientes' : 'Guardados'}
            </span>
          </div>
        </div>
      </div>

      {/* Advertencia si hay cambios sin guardar */}
      {hasUnsavedChanges() && !autoSave && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="flex items-start">
            <ExclamationCircleIcon className="h-5 w-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-800">
              <div className="font-medium mb-1">Advertencia</div>
              <div className="text-xs">
                Tienes cambios sin guardar. Activa el guardado automático o guarda manualmente.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}