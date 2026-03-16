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
}

export default function SearchBar({ map }: Props) {
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
      background: white; border-radius: 50%;
      box-shadow: 0 0 0 3px rgba(255,255,255,0.25), 0 0 12px rgba(255,255,255,0.4);
    `;

    markerRef.current = new mapboxgl.Marker({ element: el, anchor: "center" })
      .setLngLat(feature.center)
      .addTo(map);

    map.flyTo({ center: feature.center, zoom: 15, speed: 1.8, curve: 1 });
  }

  return (
    <div ref={containerRef} className="absolute top-4 left-1/2 -translate-x-1/2 w-96 z-10">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={() => results.length > 0 && setOpen(true)}
        placeholder="Search for a road or place..."
        className="w-full bg-neutral-900/90 backdrop-blur text-white text-sm placeholder-neutral-500 px-4 py-3 rounded-xl border border-neutral-700 outline-none focus:border-neutral-500 transition-colors"
      />
      {open && results.length > 0 && (
        <ul className="mt-1 bg-neutral-900/95 backdrop-blur border border-neutral-700 rounded-xl overflow-hidden">
          {results.map((f, i) => (
            <li
              key={`${f.id}-${i}`}
              onMouseDown={() => handleSelect(f)}
              className="px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-800 cursor-pointer truncate"
            >
              {f.place_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
