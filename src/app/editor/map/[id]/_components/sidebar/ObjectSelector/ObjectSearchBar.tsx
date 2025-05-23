'use client'
import React from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useMapContext } from '../../MapProvider';

export function ObjectSearchBar() {
  const { objectSearchTerm, setObjectSearchTerm } = useMapContext();

  const clearSearch = () => {
    setObjectSearchTerm('');
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Buscar objetos..."
        value={objectSearchTerm}
        onChange={(e) => setObjectSearchTerm(e.target.value)}
        className="block w-full pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
      />
      {objectSearchTerm && (
        <button
          onClick={clearSearch}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <XMarkIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
        </button>
      )}
    </div>
  );
}