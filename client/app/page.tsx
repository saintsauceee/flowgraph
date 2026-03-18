"use client";

import { useState } from "react";
import MapWrapper from "./components/MapWrapper";
import NewsFeed from "./components/NewsFeed";
import Chat from "./components/Chat";
import Navbar from "./components/Navbar";
import Board from "./components/Board";

type View = "map" | "board";

export default function Home() {
  const [view, setView] = useState<View>("map");

  return (
    <div className="w-screen h-screen flex flex-col">
      <Navbar view={view} onView={setView} />

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Map or Board */}
        <div className="relative h-full" style={{ width: "75%" }}>
          {view === "board" ? <Board /> : <MapWrapper />}
        </div>

        {/* Right: two stacked panels */}
        <div className="flex flex-col h-full border-l border-gray-200" style={{ width: "25%" }}>
          {/* Top-right: News feed */}
          <div className="bg-gray-50 overflow-hidden" style={{ height: "35%" }}>
            <NewsFeed />
          </div>

          {/* Bottom-right: Chat */}
          <div className="flex-1 bg-gray-50 border-t border-gray-200 overflow-hidden">
            <Chat />
          </div>
        </div>
      </div>
    </div>
  );
}
