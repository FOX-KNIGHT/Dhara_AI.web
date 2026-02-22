'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getBivariateColor, MapLegend } from './map-legend';
import { Button } from '@/components/ui/button';
import { Loader2, LocateFixed, Undo, Expand, Shrink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getSmartRecommendation } from '@/ai/flows/smart-recommendations';
import { useTranslation } from '@/hooks/use-translation';
import { Skeleton } from '@/components/ui/skeleton';

// Fix default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const INDIA_CENTER: [number, number] = [20.5937, 78.9629];
const GRID_RESOLUTION = 7;

type CellData = {
    id: string;
    polygon: [number, number][]; // lat, lng
    center: [number, number];
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    soilMoisture: number;
};

// --- Helper functions ---
const simulateSensorDataForGrid = (
    baseData: { nitrogen: number, phosphorus: number, potassium: number, soilMoisture: number },
    gridCells: { id: string, center: [number, number] }[]
): Omit<CellData, 'polygon'>[] => {
    return gridCells.map((cell, index) => {
        const row = Math.floor(index / GRID_RESOLUTION);
        const col = index % GRID_RESOLUTION;

        const nitrogenVariation = (col / (GRID_RESOLUTION - 1)) * 200;
        const moistureVariation = (row / (GRID_RESOLUTION - 1)) * 60;

        const simulatedData = {
            nitrogen: 50 + nitrogenVariation,
            soilMoisture: 10 + moistureVariation,
            phosphorus: baseData.phosphorus + (Math.random() - 0.5) * 10,
            potassium: baseData.potassium + (Math.random() - 0.5) * 20,
        };

        return {
            id: cell.id,
            center: cell.center,
            ...simulatedData,
        };
    });
};

// Check if a point is inside a polygon using ray casting
function isInPolygon(point: [number, number], vs: [number, number][]) {
    const x = point[0], y = point[1];
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        const xi = vs[i][0], yi = vs[i][1];
        const xj = vs[j][0], yj = vs[j][1];
        const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}
// ---

function BivariateMap() {
    const map = useMap();
    const { t } = useTranslation();
    const { toast } = useToast();

    const [fieldPath, setFieldPath] = useState<L.LatLng[]>([]);
    const [isDefiningArea, setIsDefiningArea] = useState(false);
    const [markers, setMarkers] = useState<L.LatLng[]>([]);

    const [isLoadingMap, setIsLoadingMap] = useState(false);
    const [mapData, setMapData] = useState<CellData[] | null>(null);

    // InfoPopup State
    const [activeCell, setActiveCell] = useState<CellData | null>(null);
    const [infoWindowRecommendation, setInfoWindowRecommendation] = useState<string | null>(null);
    const [isRecommendationLoading, setIsRecommendationLoading] = useState(false);

    useEffect(() => {
        const storedLocation = localStorage.getItem('dharaai_user_location');
        if (storedLocation) {
            try {
                const loc = JSON.parse(storedLocation);
                map.setView([loc.lat, loc.lng], 15);
            } catch (e) { }
        }

        const storedPolygon = localStorage.getItem('dharaai_field_coordinates');
        if (storedPolygon) {
            try {
                const path = JSON.parse(storedPolygon); // {lat, lng} array
                if (path && path.length > 2) {
                    const latlngs = path.map((p: any) => L.latLng(p.lat, p.lng));
                    setFieldPath(latlngs);
                    const bounds = L.latLngBounds(latlngs);
                    map.fitBounds(bounds);
                } else {
                    toast({ title: "Define your farm", description: "Click 'Define Field Area' to get started." });
                }
            } catch (e) {
                toast({ title: "Define your farm", description: "Click 'Define Field Area' to get started." });
            }
        } else {
            toast({ title: "Define your farm", description: "Click 'Define Field Area' to get started." });
        }
    }, [map, toast]);

    useMapEvents({
        click(e) {
            if (!isDefiningArea) return;
            setMarkers(prev => [...prev, e.latlng]);
        }
    });

    const startDefiningArea = () => {
        setMapData(null);
        setFieldPath([]);
        setMarkers([]);
        setIsDefiningArea(true);
        setActiveCell(null);
    };

    const finishDefiningArea = useCallback(() => {
        if (markers.length < 3) {
            toast({ variant: "destructive", title: "Not enough points", description: "Please mark at least 3 points to form a field area." });
            return;
        }
        setFieldPath(markers);
        localStorage.setItem('dharaai_field_coordinates', JSON.stringify(markers.map(m => ({ lat: m.lat, lng: m.lng }))));
        setIsDefiningArea(false);
        setMarkers([]);
    }, [markers, toast]);

    const undoLastMarker = () => {
        setMarkers(prev => prev.slice(0, -1));
    };

    const fetchRecommendationForCell = useCallback(async (cellData: CellData) => {
        setIsRecommendationLoading(true);
        setInfoWindowRecommendation(null);
        try {
            const result = await getSmartRecommendation({
                soilMoisture: cellData.soilMoisture,
                lightLevel: 98,
                gasLevel: 29,
                temperature: 32,
                humidity: 74,
                nitrogen: cellData.nitrogen,
                phosphorus: cellData.phosphorus,
                potassium: cellData.potassium,
            });
            const combinedRecommendation = `${result.irrigation} ${result.fertilization}`;
            setInfoWindowRecommendation(combinedRecommendation);
        } catch (error) {
            setInfoWindowRecommendation("Could not load recommendation.");
        } finally {
            setIsRecommendationLoading(false);
        }
    }, []);

    const onCellClick = useCallback((data: CellData) => {
        setActiveCell(data);
        fetchRecommendationForCell(data);
    }, [fetchRecommendationForCell]);

    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    map.setView([position.coords.latitude, position.coords.longitude], 15);
                    toast({ title: "Location found!", description: "Map centered on your current location." });
                },
                () => {
                    toast({ title: "Could not get location.", variant: "destructive" });
                }
            );
        }
    };

    // Grid Generation and Simulation logic
    useEffect(() => {
        if (fieldPath.length < 3) return;

        setIsLoadingMap(true);
        setMapData(null);

        const generateMap = async () => {
            const bounds = L.latLngBounds(fieldPath);
            const sw = bounds.getSouthWest();
            const ne = bounds.getNorthEast();

            const cellsToAnalyze: { id: string, center: [number, number] }[] = [];
            const cellPolygons: { id: string, polygon: [number, number][], center: [number, number] }[] = [];

            const latStep = (ne.lat - sw.lat) / GRID_RESOLUTION;
            const lngStep = (ne.lng - sw.lng) / GRID_RESOLUTION;

            const fieldTuplePath = fieldPath.map(p => [p.lat, p.lng] as [number, number]);

            for (let i = 0; i < GRID_RESOLUTION; i++) {
                for (let j = 0; j < GRID_RESOLUTION; j++) {
                    const cellSWLat = sw.lat + i * latStep;
                    const cellSWLng = sw.lng + j * lngStep;
                    const cellNELat = sw.lat + (i + 1) * latStep;
                    const cellNELng = sw.lng + (j + 1) * lngStep;
                    const cellCenter: [number, number] = [cellSWLat + latStep / 2, cellSWLng + lngStep / 2];

                    if (isInPolygon(cellCenter, fieldTuplePath)) {
                        const id = `cell_${i}_${j}`;
                        cellsToAnalyze.push({ id, center: cellCenter });
                        cellPolygons.push({
                            id,
                            center: cellCenter,
                            polygon: [
                                [cellSWLat, cellSWLng],
                                [cellSWLat, cellNELng],
                                [cellNELat, cellNELng],
                                [cellNELat, cellSWLng]
                            ]
                        });
                    }
                }
            }

            if (cellsToAnalyze.length === 0) {
                toast({ variant: "destructive", title: "No area to analyze", description: "The defined field area is too small." });
                setIsLoadingMap(false);
                return;
            };

            const baseData = { soilMoisture: 45, nitrogen: 150, phosphorus: 50, potassium: 100 };
            const result = simulateSensorDataForGrid(baseData, cellsToAnalyze);

            const combinedData: CellData[] = result.map(region => {
                const cellPoly = cellPolygons.find(p => p.id === region.id);
                return { ...region, polygon: cellPoly!.polygon, center: cellPoly!.center };
            });

            setMapData(combinedData);
            setIsLoadingMap(false);
        };

        setTimeout(generateMap, 100);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fieldPath, toast]);

    const tempPolyPositions = markers.map(m => [m.lat, m.lng] as [number, number]);
    const fieldPolyPositions = fieldPath.map(p => [p.lat, p.lng] as [number, number]);

    return (
        <>
            {isDefiningArea && markers.map((pos, index) => <Marker key={index} position={[pos.lat, pos.lng]} />)}
            {isDefiningArea && markers.length > 1 && (
                <Polygon
                    positions={tempPolyPositions}
                    pathOptions={{ color: '#FFFFFF', opacity: 0.7, weight: 2, fillColor: '#FFFFFF', fillOpacity: 0.2 }}
                />
            )}

            {!isDefiningArea && fieldPath.length > 2 && (
                <Polygon
                    positions={fieldPolyPositions}
                    pathOptions={{ color: '#00FF00', weight: 2, fillOpacity: 0.0 }}
                />
            )}

            {mapData && mapData.map(region => {
                const color = getBivariateColor(region.nitrogen, region.soilMoisture);
                return (
                    <Polygon
                        key={region.id}
                        positions={region.polygon}
                        pathOptions={{ color: '#FFFFFF', opacity: 0.2, weight: 1, fillColor: color, fillOpacity: 0.7 }}
                        eventHandlers={{
                            click: () => onCellClick(region)
                        }}
                    />
                );
            })}

            {activeCell && (
                <Popup position={activeCell.center}>
                    <div className="p-1 text-black font-sans w-64">
                        <h4 className="font-bold text-base mb-2 font-headline">Cell: {activeCell.id}</h4>
                        <p className="text-xs font-mono">Lat: {activeCell.center[0].toFixed(4)}, Lng: {activeCell.center[1].toFixed(4)}</p>
                        <hr className="my-2" />
                        <p className="text-xs"><b>N:</b> {activeCell.nitrogen.toFixed(0)} mg/kg</p>
                        <p className="text-xs"><b>Moisture:</b> {activeCell.soilMoisture.toFixed(1)}%</p>
                        <hr className="my-2" />
                        <p className="text-xs font-semibold">AI Recommendation:</p>
                        <div className="mt-1 text-xs italic">
                            {isRecommendationLoading ? (
                                <div className="space-y-1">
                                    <Skeleton className="h-3 w-full" />
                                    <Skeleton className="h-3 w-3/4" />
                                </div>
                            ) : (
                                <p>{infoWindowRecommendation}</p>
                            )}
                        </div>
                    </div>
                </Popup>
            )}

            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] flex gap-2">
                {!isDefiningArea ? (
                    <Button onClick={startDefiningArea}>Define New Field Area</Button>
                ) : (
                    <>
                        <Button onClick={finishDefiningArea}>Generate Fertility Map</Button>
                        <Button onClick={undoLastMarker} variant="secondary" disabled={markers.length === 0}><Undo className="mr-2 h-4 w-4" /> Undo</Button>
                        <Button onClick={() => setIsDefiningArea(false)} variant="ghost">Cancel</Button>
                    </>
                )}
            </div>

            {isDefiningArea && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-background/80 p-2 rounded-md shadow-lg text-center z-[1000]">
                    <p className="text-sm text-muted-foreground">Click on the map to mark the corners of your field.</p>
                </div>
            )}

            <div className="absolute bottom-4 left-4 z-[1000]">
                <Button type="button" size="icon" variant="secondary" onClick={getUserLocation} title="Get my current location">
                    <LocateFixed className="h-5 w-5" />
                </Button>
            </div>

            {isLoadingMap && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 p-3 rounded-lg shadow-lg text-center z-[1000] flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <p className="text-sm text-muted-foreground">{t('generating_map_and_recommendation')}</p>
                </div>
            )}
        </>
    );
}

export default function LeafletFertilityMapImpl() {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const mapContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', onFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
    }, [])

    const handleFullscreen = () => {
        if (!mapContainerRef.current) return;
        if (!document.fullscreenElement) {
            mapContainerRef.current.requestFullscreen().catch(err => {
                alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    return (
        <div ref={mapContainerRef} className="w-full h-full relative bg-muted">
            <MapContainer
                center={INDIA_CENTER}
                zoom={5}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" // Satellite imagery
                />
                <BivariateMap />
            </MapContainer>
            <div className="absolute top-4 right-4 z-[1000]">
                <Button type="button" size="icon" variant="secondary" onClick={handleFullscreen} title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}>
                    {isFullscreen ? <Shrink className="h-5 w-5" /> : <Expand className="h-5 w-5" />}
                </Button>
            </div>
            <div className="absolute bottom-4 right-4 z-[1000]">
                <MapLegend />
            </div>
        </div>
    );
}
