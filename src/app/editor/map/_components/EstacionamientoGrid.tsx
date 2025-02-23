// EstacionamientoGrid.tsx
interface EstacionamientoGridProps {
    metrosX: number | null;  // Cambiamos de undefined a null
    metrosY: number | null;  // Cambiamos de undefined a null
  }
  
  export function EstacionamientoGrid({ metrosX, metrosY }: EstacionamientoGridProps) {
    if (!metrosX || !metrosY) {
      return (
        <div className="flex h-full items-center justify-center text-gray-500">
          Selecciona un estacionamiento para ver la cuadrícula
        </div>
      );
    }
  
    const gridStyle = {
      display: 'grid',
      gridTemplateColumns: `repeat(${metrosX}, 10px)`,
      gridTemplateRows: `repeat(${metrosY}, 10px)`,
      gap: '1px',
      background: '#e5e7eb',
      padding: '1px',
      width: 'fit-content'
    };
  
    return (
      <div className="flex justify-center overflow-auto p-4">
        <div style={gridStyle}>
          {Array.from({ length: metrosX * metrosY }).map((_, index) => (
            <div
              key={index}
              className="bg-white"
              style={{ width: '10px', height: '10px' }}
            />
          ))}
        </div>
      </div>
    );
  }