import { useState, useEffect, RefObject } from 'react';

interface ViewportDimensions {
    width: number;
    height: number;
}

export function useViewport(containerRef: RefObject<HTMLDivElement>) {
    const [viewportDimensions, setViewportDimensions] = useState<ViewportDimensions>({ width: 0, height: 0 });

    useEffect(() => {
        if (containerRef.current) {
            const updateDimensions = () => {
                setViewportDimensions({
                    width: containerRef.current?.clientWidth || 0,
                    height: containerRef.current?.clientHeight || 0,
                });
            };

            updateDimensions();
            window.addEventListener('resize', updateDimensions);
            return () => window.removeEventListener('resize', updateDimensions);
        }
    }, []);

    return viewportDimensions;
}
