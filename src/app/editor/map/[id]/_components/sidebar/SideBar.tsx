'use client'
import React from 'react';
import { 
  MagnifyingGlassIcon, 
  Squares2X2Icon, 
  TrashIcon,
  CloudArrowUpIcon 
} from '@heroicons/react/24/outline';
import { ToolType, useMapContext } from '../MapProvider';
import { EraserTool } from './EreaserTool';
import { ObjectSelector } from './ObjectSelector/ObjectSelector';
import { SaveTools } from './ObjectSelector/saveTools';
import { ZoomTools } from './ZoomTools';


const TOOLS = [
  {
    id: 'zoom' as ToolType,
    name: 'Zoom',
    icon: MagnifyingGlassIcon,
    description: 'Acercar y alejar el mapa'
  },
  {
    id: 'objects' as ToolType,
    name: 'Objetos',
    icon: Squares2X2Icon,
    description: 'Agregar objetos al mapa'
  },
  {
    id: 'eraser' as ToolType,
    name: 'Borrador',
    icon: TrashIcon,
    description: 'Eliminar objetos'
  },
  {
    id: 'save' as ToolType,
    name: 'Guardar',
    icon: CloudArrowUpIcon,
    description: 'Guardar y configurar auto-guardado'
  }
];

export function Sidebar() {
  const { selectedTool, setSelectedTool } = useMapContext();

  const renderToolContent = () => {
    switch (selectedTool) {
      case 'zoom':
        return <ZoomTools />;
      case 'objects':
        return <ObjectSelector />;
      case 'eraser':
        return <EraserTool />;
      case 'save':
        return <SaveTools />;
      default:
        return null;
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 shadow-lg flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Herramientas
        </h2>
        
        <div className="grid grid-cols-4 gap-2">
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className={`p-3 rounded-lg border text-center transition-all ${
                selectedTool === tool.id
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
              title={tool.description}
            >
              <tool.icon className="h-6 w-6 mx-auto mb-1" />
              <span className="text-xs font-medium block">{tool.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {renderToolContent()}
      </div>
    </div>
  );
}