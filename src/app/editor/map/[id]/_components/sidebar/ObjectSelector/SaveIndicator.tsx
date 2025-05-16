'use client'
import React from 'react';
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  ClockIcon 
} from '@heroicons/react/24/outline';
import { useMapContext } from '../../MapProvider';

export function SaveIndicator() {
  const { isSaving, lastSaved, placedObjects, autoSave } = useMapContext();

  const hasUnsavedChanges = () => {
    if (!lastSaved) return placedObjects.length > 0;
    return lastSaved < new Date(Date.now() - 1000);
  };

  if (!placedObjects.length && !lastSaved) return null;

  return (
    <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md border px-3 py-2 z-10">
      <div className="flex items-center space-x-2">
        {isSaving ? (
          <>
            <ClockIcon className="h-4 w-4 text-blue-600 animate-spin" />
            <span className="text-sm text-blue-900">Guardando...</span>
          </>
        ) : !hasUnsavedChanges() ? (
          <>
            <CheckCircleIcon className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-900">
              Guardado {autoSave && '(Auto)'}
            </span>
          </>
        ) : (
          <>
            <ExclamationCircleIcon className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-900">Sin guardar</span>
          </>
        )}
      </div>
    </div>
  );
}