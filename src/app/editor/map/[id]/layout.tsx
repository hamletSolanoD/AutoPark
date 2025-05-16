// app/editor/map/[id]/layout.tsx
'use client'
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeftIcon, MapIcon } from '@heroicons/react/24/outline';
import { useMapContext, MapProvider } from './_components/MapViewer/MapProvider';
import { Sidebar } from './_components/sidebar/SideBar';

// Componente interno para usar el contexto
function MapLayoutContent({ children }: { children: React.ReactNode }) {
  const { currentMap, mapId } = useMapContext();
  const router = useRouter();

  return (
    <div className="h-screen w-full flex flex-col bg-gray-100">
      {/* Header con navegación */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/editor/map')}
            className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Volver a Mis Estacionamientos</span>
          </button>
          
          <div className="flex items-center text-gray-400">
            <span className="mx-2">/</span>
          </div>
          
          <div className="flex items-center">
            <MapIcon className="h-5 w-5 text-indigo-600 mr-2" />
            <span className="text-sm font-medium text-gray-900">
              {currentMap ? currentMap.nombreDeArea : `Mapa ${mapId}`}
            </span>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex">
        {/* Área principal del mapa */}
        <div className="flex-1 bg-white">
          {children}
        </div>
        
        {/* Sidebar de herramientas */}
        <Sidebar />
      </div>
    </div>
  );
}

export default function MapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const mapId = parseInt(params.id as string);

  if (!mapId || isNaN(mapId)) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <p className="text-gray-500">ID de mapa inválido</p>
      </div>
    );
  }

  return (
    <MapProvider mapId={mapId}>
      <MapLayoutContent>
        {children}
      </MapLayoutContent>
    </MapProvider>
  );
}