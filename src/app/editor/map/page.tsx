// app/editor/map/page.tsx
'use client'
import React, { useState } from 'react';
import { api } from "~/trpc/react";
import { EstacionamientoCard } from './_components/EstacionamientoCard';
import { PlusIcon, MapIcon } from '@heroicons/react/24/outline';
import { CreateZonaModal } from './_components/CreateZonaModal';

export default function MapIndexPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const { data: estacionamientos, isLoading, error } = api.zonaEstacionamiento.getAll.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900">
            Cargando estacionamientos...
          </h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <h3 className="text-lg font-semibold mb-2">Error al cargar</h3>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <MapIcon className="h-8 w-8 text-indigo-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Mis Estacionamientos
                </h1>
                <p className="text-sm text-gray-500">
                  {estacionamientos?.length || 0} mapas disponibles
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Nuevo Estacionamiento
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {estacionamientos && estacionamientos.length > 0 ? (
          <>
            {/* Grid de cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {estacionamientos.map((estacionamiento) => (
                <EstacionamientoCard
                  key={estacionamiento.id}
                  id={estacionamiento.id}
                  nombreDeArea={estacionamiento.nombreDeArea}
                  metrosX={estacionamiento.metrosX}
                  metrosY={estacionamiento.metrosY}
                  numeroEstacionamientos={estacionamiento.numeroEstacionamientos}
                  createdAt={estacionamiento.createdAt}
                  updatedAt={estacionamiento.updatedAt}
                />
              ))}
            </div>

            {/* Estadísticas */}
            <div className="mt-12 border-t border-gray-200 pt-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <div className="text-3xl font-bold text-indigo-600 mb-2">
                    {estacionamientos.length}
                  </div>
                  <div className="text-sm text-gray-600">Total de Mapas</div>
                </div>
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {estacionamientos.reduce((sum, e) => sum + e.numeroEstacionamientos, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Espacios Totales</div>
                </div>
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {Math.round(estacionamientos.reduce((sum, e) => sum + (e.metrosX * e.metrosY), 0)).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">m² Totales</div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Estado vacío */
          <div className="text-center py-16">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
              <MapIcon className="h-full w-full" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No hay estacionamientos
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Comienza creando tu primer mapa de estacionamiento para poder visualizar y gestionar tus espacios.
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white text-base font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Crear Primer Estacionamiento
            </button>
          </div>
        )}
      </div>

      {/* Modal de creación */}
      <CreateZonaModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}