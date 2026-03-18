"use client";

import { useState, useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";

interface Feature {
  id: string;
  place_name: string;
  center: [number, number];
}

interface Props {
  map: mapboxgl.Map | null;
  onPointSelect?: (center: [number, number] | null) => void;
}

export default function SearchBar({ map, onPointSelect }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Feature[]>([]);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value.trim()) { setResults([]); setOpen(false); return; }

    debounceRef.current = setTimeout(async () => {
      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(value)}.json?types=address,poi&access_token=${token}`
      );
      const data = await res.json();
      setResults(data.features ?? []);
      setOpen(true);
    }, 300);
  }

  function handleSelect(feature: Feature) {
    setQuery(feature.place_name);
    setOpen(false);

    if (!map) return;

    markerRef.current?.remove();

    const el = document.createElement("div");
    el.style.cssText = `
      width: 16px; height: 16px;
      background: #1f2937; border-radius: 50%;
      box-shadow: 0 0 0 3px rgba(31,41,55,0.2), 0 0 12px rgba(31,41,55,0.3);
    `;

    markerRef.current = new mapboxgl.Marker({ element: el, anchor: "center" })
      .setLngLat(feature.center)
      .addTo(map);

    onPointSelect?.(feature.center);
    map.flyTo({ center: feature.center, zoom: 15, speed: 1.8, curve: 1 });
  }

  return (
    <div ref={containerRef} className="absolute top-4 left-4 w-72 z-10">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={() => results.length > 0 && setOpen(true)}
        placeholder="Search..."
        className="w-full bg-white/90 backdrop-blur text-gray-900 text-xs placeholder-gray-400 px-3 py-2 rounded-lg border border-gray-300 outline-none focus:border-gray-400 transition-colors"
      />
      {open && results.length > 0 && (
        <ul className="mt-1 bg-white/95 backdrop-blur border border-gray-200 rounded-lg overflow-hidden">
          {results.map((f, i) => (
            <li
              key={`${f.id}-${i}`}
              onMouseDown={() => handleSelect(f)}
              className="px-3 py-2 text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-900 cursor-pointer truncate transition-colors"
            >
              {f.place_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
