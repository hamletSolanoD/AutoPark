// EstacionamientoDropdown.tsx
import { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { api } from "~/trpc/react";
import { CreateZonaModal } from './CreateZonaModal';

export function EstacionamientoDropdown({ 
  onSelect, 
  selectedId 
}: { 
  onSelect: (id: number) => void;
  selectedId?: number;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: zonas } = api.zonaEstacionamiento.getAll.useQuery();
  
  const selectedZona = zonas?.find(zona => zona.id === selectedId);

  return (
    <>
      <Listbox value={selectedId} onChange={onSelect}>
        <div className="relative mt-1 w-72">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
            <span className="block truncate">
              {selectedZona?.nombreDeArea || "Seleccionar estacionamiento"}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
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
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {zonas?.map((zona) => (
                <Listbox.Option
                  key={zona.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'
                    }`
                  }
                  value={zona.id}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {zona.nombreDeArea}
                      </span>
                    </>
                  )}
                </Listbox.Option>
              ))}
              
              {/* Opción para crear nueva zona */}
              <div
                className="relative cursor-pointer select-none border-t py-2 pl-3 pr-9 text-indigo-600 hover:bg-indigo-50"
                onClick={() => setIsModalOpen(true)}
              >
                <div className="flex items-center">
                  <PlusCircleIcon className="mr-2 h-5 w-5" />
                  <span>Crear Zona</span>
                </div>
              </div>
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>

      <CreateZonaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}