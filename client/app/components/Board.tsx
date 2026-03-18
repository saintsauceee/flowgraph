"use client";

import { useState } from "react";

interface Stop {
  id: number;
  name: string;
  days: string;
  notes: string;
}

let idCounter = 0;

const INITIAL_STOPS: Stop[] = [
  { id: ++idCounter, name: "Tokyo", days: "5", notes: "Shinjuku, Shibuya, Akihabara" },
  { id: ++idCounter, name: "Kyoto", days: "3", notes: "Arashiyama, Fushimi Inari" },
  { id: ++idCounter, name: "Osaka", days: "2", notes: "Dotonbori, street food" },
];

export default function Board() {
  const [stops, setStops] = useState<Stop[]>(INITIAL_STOPS);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ name: "", days: "", notes: "" });

  function addStop() {
    if (!draft.name.trim()) return;
    setStops((prev) => [...prev, { id: ++idCounter, ...draft }]);
    setDraft({ name: "", days: "", notes: "" });
    setAdding(false);
  }

  function removeStop(id: number) {
    setStops((prev) => prev.filter((s) => s.id !== id));
  }

  function updateStop(id: number, field: keyof Omit<Stop, "id">, value: string) {
    setStops((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  }

  const totalDays = stops.reduce((sum, s) => sum + (parseInt(s.days) || 0), 0);

  return (
    <div className="w-full h-full bg-gray-50 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-8 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-gray-900 text-xl font-medium">Trip Plan</h1>
            <p className="text-gray-400 text-sm mt-0.5">{stops.length} stops · {totalDays} days</p>
          </div>
          <button
            onClick={() => setAdding(true)}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-lg transition-colors"
          >
            + Add stop
          </button>
        </div>

        {/* Stops */}
        <div className="flex flex-col gap-3">
          {stops.map((stop, i) => (
            <div key={stop.id} className="flex gap-4 items-start">
              {/* Index + connector */}
              <div className="flex flex-col items-center pt-3">
                <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-[10px] shrink-0">
                  {i + 1}
                </div>
                {i < stops.length - 1 && (
                  <div className="w-px flex-1 bg-gray-200 mt-1 min-h-4" />
                )}
              </div>

              {/* Card */}
              <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4 mb-3">
                <div className="flex items-start justify-between gap-4">
                  <input
                    value={stop.name}
                    onChange={(e) => updateStop(stop.id, "name", e.target.value)}
                    className="bg-transparent text-gray-900 text-sm font-medium outline-none flex-1 placeholder-gray-300"
                    placeholder="Destination"
                  />
                  <div className="flex items-center gap-1.5 shrink-0">
                    <input
                      value={stop.days}
                      onChange={(e) => updateStop(stop.id, "days", e.target.value)}
                      className="bg-gray-100 text-gray-600 text-xs rounded-md px-2 py-1 w-10 text-center outline-none"
                      placeholder="0"
                    />
                    <span className="text-gray-400 text-xs">days</span>
                  </div>
                </div>
                <input
                  value={stop.notes}
                  onChange={(e) => updateStop(stop.id, "notes", e.target.value)}
                  className="bg-transparent text-gray-400 text-xs outline-none w-full mt-1.5 placeholder-gray-300"
                  placeholder="Notes…"
                />
                <button
                  onClick={() => removeStop(stop.id)}
                  className="mt-3 text-gray-300 hover:text-gray-500 text-[10px] transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* Add form */}
          {adding && (
            <div className="flex gap-4 items-start">
              <div className="flex flex-col items-center pt-3">
                <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-[10px] shrink-0">
                  {stops.length + 1}
                </div>
              </div>
              <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-4">
                  <input
                    autoFocus
                    value={draft.name}
                    onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                    onKeyDown={(e) => e.key === "Enter" && addStop()}
                    className="bg-transparent text-gray-900 text-sm font-medium outline-none flex-1 placeholder-gray-300"
                    placeholder="Destination"
                  />
                  <div className="flex items-center gap-1.5 shrink-0">
                    <input
                      value={draft.days}
                      onChange={(e) => setDraft((d) => ({ ...d, days: e.target.value }))}
                      className="bg-gray-100 text-gray-600 text-xs rounded-md px-2 py-1 w-10 text-center outline-none"
                      placeholder="0"
                    />
                    <span className="text-gray-400 text-xs">days</span>
                  </div>
                </div>
                <input
                  value={draft.notes}
                  onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
                  className="bg-transparent text-gray-400 text-xs outline-none w-full mt-1.5 placeholder-gray-300"
                  placeholder="Notes…"
                />
                <div className="flex gap-2 mt-3">
                  <button onClick={addStop} className="text-gray-700 hover:text-gray-900 text-xs transition-colors">Add</button>
                  <button onClick={() => setAdding(false)} className="text-gray-400 hover:text-gray-600 text-xs transition-colors">Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
