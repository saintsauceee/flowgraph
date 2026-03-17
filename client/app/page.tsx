import MapWrapper from "./components/MapWrapper";
import NewsFeed from "./components/NewsFeed";
import Chat from "./components/Chat";

export default function Home() {
  return (
    <div className="w-screen h-screen flex">
      {/* Left: Map — 65% width, full height */}
      <div className="relative h-full" style={{ width: "75%" }}>
        <MapWrapper />
      </div>

      {/* Right: two stacked panels — 35% width */}
      <div className="flex flex-col h-full border-l border-neutral-700" style={{ width: "25%" }}>
        {/* Top-right: News feed */}
        <div className="bg-neutral-900 overflow-hidden" style={{ height: "35%" }}>
          <NewsFeed />
        </div>

        {/* Bottom-right: Chat */}
        <div className="flex-1 bg-neutral-900 border-t border-neutral-700 overflow-hidden">
          <Chat />
        </div>
      </div>
    </div>
  );
}
