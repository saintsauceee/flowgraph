"use client";

import { useEffect, useRef, useState } from "react";

const HEADLINES = [
  { source: "Reuters", title: "Global markets rally as inflation data comes in below expectations" },
  { source: "AP", title: "Scientists discover new deep-sea species off the coast of New Zealand" },
  { source: "BBC", title: "UN calls for emergency ceasefire talks amid escalating border tensions" },
  { source: "Bloomberg", title: "Tech stocks surge following strong earnings reports from major firms" },
  { source: "AFP", title: "Severe flooding displaces thousands in southern Bangladesh" },
  { source: "WSJ", title: "Central banks signal potential rate cuts in second half of the year" },
  { source: "Guardian", title: "New study links ultra-processed foods to accelerated cognitive decline" },
  { source: "Reuters", title: "Wildfire season begins early across Pacific Northwest, officials warn" },
  { source: "AP", title: "Historic peace agreement signed between rival factions in Horn of Africa" },
  { source: "NYT", title: "AI regulation framework proposed by coalition of European nations" },
  { source: "Bloomberg", title: "Oil prices fall sharply as OPEC+ output deal faces internal resistance" },
  { source: "BBC", title: "Earthquake measuring 6.4 strikes off the coast of Japan, no tsunami warning" },
  { source: "AFP", title: "Record voter turnout reported in South American presidential election" },
  { source: "Reuters", title: "Pharmaceutical giant announces breakthrough in Alzheimer's treatment" },
  { source: "FT", title: "Supply chain disruptions ease as shipping costs return to pre-pandemic levels" },
  { source: "AP", title: "Arctic ice sheet reaches record minimum extent for third consecutive year" },
  { source: "CNN", title: "Diplomatic row deepens after ambassador recalled over espionage claims" },
  { source: "Guardian", title: "Renewable energy now accounts for 40% of global electricity generation" },
];

function timeAgo(ms: number) {
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
}

interface FeedItem {
  id: number;
  headline: (typeof HEADLINES)[number];
  timestamp: number;
}

export default function NewsFeed() {
  const [items, setItems] = useState<FeedItem[]>(() =>
    HEADLINES.slice(0, 6).map((h, i) => ({
      id: i,
      headline: h,
      timestamp: Date.now() - i * 45_000,
    }))
  );
  const [now, setNow] = useState(Date.now());
  const counterRef = useRef(HEADLINES.length);
  const listRef = useRef<HTMLDivElement>(null);

  // Add a new item every ~8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const next = counterRef.current % HEADLINES.length;
      counterRef.current += 1;
      setItems((prev) => [
        { id: counterRef.current, headline: HEADLINES[next], timestamp: Date.now() },
        ...prev.slice(0, 30),
      ]);
    }, 8_000);
    return () => clearInterval(interval);
  }, []);

  // Tick timestamps every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 10_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="px-3 py-2 border-b border-neutral-700 shrink-0">
        <span className="text-neutral-400 text-xs font-medium tracking-widest uppercase">Live Feed</span>
      </div>
      <div ref={listRef} className="flex-1 overflow-y-auto">
        {items.map((item, i) => (
          <div
            key={item.id}
            className={`px-3 py-2.5 border-b border-neutral-800 ${i === 0 ? "animate-pulse-once" : ""}`}
          >
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-neutral-500 text-[10px] font-semibold uppercase tracking-wide">
                {item.headline.source}
              </span>
              <span className="text-neutral-700 text-[10px]">{timeAgo(now - item.timestamp)}</span>
            </div>
            <p className="text-neutral-300 text-xs leading-snug">{item.headline.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
