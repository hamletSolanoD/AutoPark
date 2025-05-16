'use client'
import React, { useState } from 'react';
import { api } from "~/trpc/react";
import { EstacionamientoDropdown } from './_components/EstacionamientoDropdown';
import { EstacionamientoGrid } from './_components/EstacionamientoGrid';

export default function map() {
  const [selectedZonaId, setSelectedZonaId] = useState<number | null>(null);
  const { data: selectedZona } = api.zonaEstacionamiento.getById.useQuery(
    { id: selectedZonaId! },
    { enabled: !!selectedZonaId }
  );

  return (
    <div className="h-screen w-full max-w-[1200px] mx-auto flex flex-col bg-white shadow sm:rounded-lg overflow-hidden">
      <div className="border-b border-gray-200 px-4 py-5 sm:px-6 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {selectedZona ? (
              <p className="text-sm text-gray-500 truncate">
                Zona actual: {selectedZona.nombreDeArea}
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                Ninguna zona seleccionada
              </p>
            )}
          </div>

          <div className="ml-4">
            <EstacionamientoDropdown 
              selectedId={selectedZonaId || 0} 
              onSelect={(id) => setSelectedZonaId(id)}
            />
          </div>
        </div>

        {selectedZona && (
          <h1 className="mt-4 text-center text-2xl font-bold text-gray-900 truncate">
            {selectedZona.nombreDeArea}
          </h1>
        )}
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">
        <EstacionamientoGrid
          metrosX={selectedZona?.metrosX ?? null}
          metrosY={selectedZona?.metrosY ?? null}
        />
      </div>
    </div>
  );
}