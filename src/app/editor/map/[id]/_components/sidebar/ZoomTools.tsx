'use client'
import React from 'react';
import { 
  MagnifyingGlassPlusIcon, 
  MagnifyingGlassMinusIcon,
  ArrowsPointingOutIcon 
} from '@heroicons/react/24/outline';
import { useMapContext } from '../MapProvider';

export function ZoomTools() {
  const { zoomLevel, setZoomLevel } = useMapContext();

  const handleZoomIn = () => {
    setZoomLevel(Math.min(zoomLevel * 1.2, 5));
  };

  const handleZoomOut = () => {
    setZoomLevel(Math.max(zoomLevel * 0.8, 0.1));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="text-sm font-medium text-gray-700 mb-3">
        Control de Zoom
      </div>

      {/* Nivel de zoom actual */}
      <div className="bg-gray-50 rounded-lg p-3 text-center">
        <div className="text-xs text-gray-500 uppercase tracking-wide">
          Nivel Actual
        </div>
        <div className="text-2xl font-bold text-gray-900 mt-1">
          {Math.round(zoomLevel * 100)}%
        </div>
      </div>

      {/* Controles de zoom */}
      <div className="space-y-2">
        <button
          onClick={handleZoomIn}
          className="w-full flex items-center justify-center px-4 py-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-200"
        >
          <MagnifyingGlassPlusIcon className="h-5 w-5 mr-2" />
          Acercar
        </button>

        <button
          onClick={handleZoomOut}
          className="w-full flex items-center justify-center px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
        >
          <MagnifyingGlassMinusIcon className="h-5 w-5 mr-2" />
          Alejar
        </button>

        <button
          onClick={handleResetZoom}
          className="w-full flex items-center justify-center px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors border border-green-200"
        >
          <ArrowsPointingOutIcon className="h-5 w-5 mr-2" />
          Ajustar a Ventana
        </button>
      </div>

      {/* Slider de zoom */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Zoom Manual
        </label>
        <input
          type="range"
          min="10"
          max="500"
          value={zoomLevel * 100}
          onChange={(e) => setZoomLevel(Number(e.target.value) / 100)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>10%</span>
          <span>500%</span>
        </div>
      </div>

      {/* Marcadores de zoom predefinidos */}
      <div className="mt-6">
        <div className="text-sm font-medium text-gray-700 mb-2">
          Zoom Rápido
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[0.25, 0.5, 1, 2].map((zoom) => (
            <button
              key={zoom}
              onClick={() => setZoomLevel(zoom)}
              className={`px-2 py-1 text-xs rounded ${
                Math.abs(zoomLevel - zoom) < 0.01
                  ? 'bg-indigo-100 text-indigo-700 border-indigo-300'
                  : 'bg-gray-100 text-gray-600 border-gray-200'
              } border transition-colors hover:bg-gray-150`}
            >
              {zoom * 100}%
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}