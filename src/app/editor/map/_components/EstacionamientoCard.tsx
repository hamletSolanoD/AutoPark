// app/editor/map/_components/EstacionamientoCard.tsx
'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import { CalendarIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface EstacionamientoCardProps {
  id: number;
  nombreDeArea: string;
  metrosX: number;
  metrosY: number;
  numeroEstacionamientos: number;
  createdAt: Date;
  updatedAt: Date;
}

export function EstacionamientoCard({
  id,
  nombreDeArea,
  metrosX,
  metrosY,
  numeroEstacionamientos,
  createdAt,
  updatedAt
}: EstacionamientoCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/editor/map/${id}`);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(new Date(date));
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg hover:border-indigo-300 transition-all duration-200 cursor-pointer group"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
            {nombreDeArea}
          </h3>
          <ArrowRightIcon className="h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors flex-shrink-0 ml-2" />
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">
              Dimensiones
            </div>
            <div className="text-lg font-semibold text-gray-900 mt-1">
              {metrosX}m × {metrosY}m
            </div>
          </div>
          <div className="bg-indigo-50 rounded-lg p-3">
            <div className="text-xs text-indigo-600 uppercase tracking-wide font-medium">
              Espacios
            </div>
            <div className="text-lg font-semibold text-indigo-900 mt-1">
              {numeroEstacionamientos.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1" />
            <span>Creado {formatDate(createdAt)}</span>
          </div>
          <div className="text-right">
            <span>ID: {id}</span>
          </div>
        </div>
        
        {createdAt.getTime() !== updatedAt.getTime() && (
          <div className="text-xs text-gray-400 mt-1 text-right">
            Actualizado {formatDate(updatedAt)}
          </div>
        )}
      </div>
    </div>
  );
}