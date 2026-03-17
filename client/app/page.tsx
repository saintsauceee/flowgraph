import MapWrapper from "./components/MapWrapper";

export default function Home() {
  return (
    <div className="w-screen h-screen grid grid-cols-2 grid-rows-2">
      {/* Top-left: Map */}
      <div className="relative">
        <MapWrapper />
      </div>

      {/* Top-right */}
      <div className="bg-neutral-900 border-l border-neutral-700 flex items-center justify-center">
        <span className="text-neutral-600 text-sm">top right</span>
      </div>

      {/* Bottom-left */}
      <div className="bg-neutral-900 border-t border-neutral-700 flex items-center justify-center">
        <span className="text-neutral-600 text-sm">bottom left</span>
      </div>

      {/* Bottom-right */}
      <div className="bg-neutral-900 border-t border-l border-neutral-700 flex items-center justify-center">
        <span className="text-neutral-600 text-sm">bottom right</span>
      </div>
    </div>
  );
}
