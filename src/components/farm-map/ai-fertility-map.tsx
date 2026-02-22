'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const LeafletMap = dynamic(
    () => import('./leaflet-fertility-map-impl'),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-full flex items-center justify-center bg-muted">
                <Loader2 className="animate-spin h-8 w-8 text-primary" />
                <p className='ml-2'>Loading map...</p>
            </div>
        )
    }
);

export function AIFertilityMap() {
    return <LeafletMap />;
}
