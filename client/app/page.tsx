import MapWrapper from "./components/MapWrapper";
import NewsFeed from "./components/NewsFeed";

export default function Home() {
  return (
    <div className="w-screen h-screen flex">
      {/* Left: Map — 65% width, full height */}
      <div className="relative h-full" style={{ width: "65%" }}>
        <MapWrapper />
      </div>

      {/* Right: two stacked panels — 35% width */}
      <div className="flex flex-col h-full border-l border-neutral-700" style={{ width: "35%" }}>
        {/* Top-right: News feed */}
        <div className="bg-neutral-900 overflow-hidden" style={{ height: "35%" }}>
          <NewsFeed />
        </div>

        {/* Bottom-right */}
        <div className="flex-1 bg-neutral-900 border-t border-neutral-700 flex items-center justify-center">
          <span className="text-neutral-600 text-sm">bottom right</span>
        </div>
      </div>
    </div>
  );
}
