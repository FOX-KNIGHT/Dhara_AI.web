'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useToast } from '@/hooks/use-toast';
import { Redo, Undo, X, LocateFixed, Expand, Shrink } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Fix for default marker icon in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface RegistrationMapProps {
    onPolygonChange: (coordinates: string) => void;
}

const FALLBACK_CENTER: [number, number] = [20.245763, 85.802415];

function MapEventsHandler({
    isMarking,
    onMapClick
}: {
    isMarking: boolean;
    onMapClick: (latlng: L.LatLng) => void
}) {
    useMapEvents({
        click(e) {
            if (isMarking) {
                onMapClick(e.latlng);
            }
        },
    });
    return null;
}

export default function LeafletRegistrationMapImpl({ onPolygonChange }: RegistrationMapProps) {
    const [center, setCenter] = useState<[number, number]>(FALLBACK_CENTER);
    const [zoom, setZoom] = useState(5);
    const [isMarking, setIsMarking] = useState(false);
    const [vertices, setVertices] = useState<L.LatLng[]>([]);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const mapContainerRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

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

    useEffect(() => {
        const onFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', onFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
    }, []);

    const getUserLocation = useCallback(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCenter([position.coords.latitude, position.coords.longitude]);
                    setZoom(15);
                    toast({ title: "Location found!", description: "Map centered on your current location." });
                },
                () => {
                    toast({ title: "Could not get location.", description: "Defaulting to a central location.", variant: "destructive" });
                    setCenter(FALLBACK_CENTER);
                    setZoom(5);
                }
            );
        } else {
            toast({ title: "Geolocation not supported.", description: "Your browser does not support geolocation.", variant: "destructive" });
        }
    }, [toast]);

    // Handle map clicks during marking mode
    const handleMapClick = (latlng: L.LatLng) => {
        setVertices(prev => [...prev, latlng]);
    };

    const toggleMarking = () => {
        if (isMarking) {
            // Finish marking
            if (vertices.length > 2) {
                const coords = vertices.map(v => ({ lat: v.lat, lng: v.lng }));
                onPolygonChange(JSON.stringify(coords));
                toast({ title: "Farm area defined successfully!", description: `${vertices.length} points marked.` });
            } else {
                toast({ title: "Not enough points", description: "Please mark at least 3 points to define an area.", variant: "destructive" });
            }
        }
        setIsMarking(!isMarking);
    };

    const handleUndo = () => {
        setVertices(prev => prev.slice(0, -1));
    };

    const handleClear = () => {
        setVertices([]);
        onPolygonChange('');
    };

    const polygonPositions = vertices.map(v => [v.lat, v.lng] as [number, number]);

    return (
        <div
            ref={mapContainerRef}
            className="w-full h-full relative bg-muted"
            style={{ cursor: isMarking ? 'crosshair' : 'default' }}
        >
            <MapContainer
                center={center}
                zoom={zoom}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapEventsHandler isMarking={isMarking} onMapClick={handleMapClick} />

                {vertices.map((v, i) => (
                    <Marker key={i} position={[v.lat, v.lng]} />
                ))}

                {vertices.length > 1 && (
                    <Polygon
                        positions={polygonPositions}
                        pathOptions={{
                            color: '#4C8BF5',
                            fillColor: '#4C8BF5',
                            fillOpacity: 0.35,
                            weight: 2
                        }}
                    />
                )}
            </MapContainer>

            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-[1000] flex gap-2">
                <Button type="button" onClick={toggleMarking} variant="default" size="sm">
                    {isMarking ? "Finish Marking" : "Start Marking Farm Area"}
                </Button>
                {isMarking && (
                    <>
                        <Button type="button" variant="secondary" size="sm" onClick={handleUndo} disabled={vertices.length === 0}><Undo className="mr-2 h-4 w-4" /> Undo</Button>
                        <Button type="button" variant="destructive" size="sm" onClick={handleClear} disabled={vertices.length === 0}><X className="mr-2 h-4 w-4" /> Clear All</Button>
                    </>
                )}
            </div>

            <div className="absolute top-2 right-2 z-[1000]">
                <Button type="button" size="icon" variant="secondary" onClick={handleFullscreen} title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}>
                    {isFullscreen ? <Shrink className="h-5 w-5" /> : <Expand className="h-5 w-5" />}
                </Button>
            </div>

            <div className="absolute bottom-16 right-2 z-[1000]">
                <Button type="button" size="icon" variant="secondary" onClick={getUserLocation} title="Get my current location">
                    <LocateFixed className="h-5 w-5" />
                </Button>
            </div>

            {isMarking && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-background/80 p-2 rounded-md shadow-lg text-center z-[1000]">
                    <p className="text-xs text-muted-foreground">Click on the map corners to trace your farm. Click 'Finish Marking' when done.</p>
                </div>
            )}
        </div>
    );
}
