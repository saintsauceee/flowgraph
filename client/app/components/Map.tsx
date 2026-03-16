"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import SearchBar from "./SearchBar";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

const ZOOM_STEPS = [0.5, 1, 2, 4] as const;
type ZoomStep = (typeof ZOOM_STEPS)[number];

export default function Map() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [currentPoint, setCurrentPoint] = useState<[number, number] | null>(null);
  const [zoomStep, setZoomStep] = useState<ZoomStep>(1);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const m = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      projection: "mercator",
      center: [0, 20],
      zoom: 2,
    });

    setMap(m);

    return () => m.remove();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setSettingsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleZoom(delta: 1 | -1) {
    if (!map) return;
    const nextZoom = map.getZoom() + delta * zoomStep;
    const options = currentPoint
      ? { zoom: nextZoom, around: new mapboxgl.LngLat(currentPoint[0], currentPoint[1]) }
      : { zoom: nextZoom };
    map.easeTo(options);
  }

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      <SearchBar map={map} onPointSelect={setCurrentPoint} />
      <div className="absolute bottom-8 right-4 flex flex-col gap-1">
        <button
          onClick={() => handleZoom(1)}
          className="w-8 h-8 bg-neutral-900/90 backdrop-blur border border-neutral-700 rounded-lg text-white text-lg font-light flex items-center justify-center hover:bg-neutral-800 transition-colors"
        >
          +
        </button>
        <button
          onClick={() => handleZoom(-1)}
          className="w-8 h-8 bg-neutral-900/90 backdrop-blur border border-neutral-700 rounded-lg text-white text-lg font-light flex items-center justify-center hover:bg-neutral-800 transition-colors"
        >
          −
        </button>
        <div ref={settingsRef} className="relative mt-1">
          <button
            onClick={() => setSettingsOpen((o) => !o)}
            title="Settings"
            className="w-8 h-8 bg-neutral-900/90 backdrop-blur border border-neutral-700 rounded-lg text-neutral-400 flex items-center justify-center hover:bg-neutral-800 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
          {settingsOpen && (
            <div className="absolute right-10 top-0 bg-neutral-900/95 backdrop-blur border border-neutral-700 rounded-xl p-3 w-44">
              <div className="flex items-center justify-between mb-1">
                <p className="text-neutral-500 text-xs">Zoom step</p>
                <p className="text-white text-xs tabular-nums">{zoomStep}</p>
              </div>
              <input
                type="range"
                min={0}
                max={ZOOM_STEPS.length - 1}
                step={1}
                value={ZOOM_STEPS.indexOf(zoomStep)}
                onChange={(e) => setZoomStep(ZOOM_STEPS[Number(e.target.value)])}
                className="w-full cursor-pointer"
                style={{
                  appearance: "none",
                  height: "1px",
                  background: `linear-gradient(to right, #fff ${(ZOOM_STEPS.indexOf(zoomStep) / (ZOOM_STEPS.length - 1)) * 100}%, #404040 0%)`,
                  outline: "none",
                  borderRadius: "9999px",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
