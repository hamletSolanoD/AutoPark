
// EstacionamientoDropdown.tsx (actualizado para navegación)
import { AwaitedReactNode, Fragment, JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon, PlusCircleIcon, MapIcon } from '@heroicons/react/24/outline';
import { api } from "~/trpc/react";

import { useRouter } from 'next/navigation';
import { CreateZonaModal } from './CreateZonaModal';
import { useMapContext } from '../[id]/_components/MapProvider';


export function EstacionamientoDropdown({ 
  onSelect, 
  selectedId 
}: { 
  onSelect: (id: number) => void;
  selectedId?: number;
}) {
  const { mapId } = useMapContext();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: zonas } = api.zonaEstacionamiento.getById.useQuery({ id: mapId });
  const { data: maps } = api.zonaEstacionamiento.getAll.useQuery();
  
  const currentMap = maps?.find((map: { id: number; }) => map.id === mapId);

  const handleMapChange = (newMapId: number) => {
    router.push(`/editor/map/${newMapId}`);
  };

  return (
    <div className="flex space-x-2">
      {/* Dropdown para cambiar de mapa */}
      <Listbox value={mapId} onChange={handleMapChange}>
        <div className="relative">
          <Listbox.Button className="relative w-48 cursor-default rounded-lg bg-blue-50 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-300 sm:text-sm">
            <span className="flex items-center">
              <MapIcon className="h-4 w-4 text-blue-600 mr-2" />
              <span className="block truncate text-blue-900">
                {currentMap?.nombreDeArea || `Mapa ${mapId}`}
              </span>
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-blue-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10">
              {maps?.map((map) => (
                <Listbox.Option
                  key={map.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                    }`
                  }
                  value={map.id}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {map.nombreDeArea}
                      </span>
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>

    </div>
  );
}