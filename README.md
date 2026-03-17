# Flowgraph
This is LA <3.

A dark monitor interface meets trip planner. You're looking at the world, tracking what's happening, and figuring out where to go next.

The left side is a map. The right side has a live news feed up top and a chat with an assistant below. The idea is that these three things talk to each other — a headline flies you to a location, the assistant knows where you're looking and helps you plan a trip there, pins accumulate into an itinerary.

---

## Stack

| Area | Technologies |
|------|-------------|
| Frontend | Next.js (React), TypeScript, Tailwind CSS, Mapbox GL JS |

---

## What's here

- **Map** — dark Mapbox globe, search bar, zoom controls. The main canvas for everything.
- **Live feed** — scrolling news headlines that update every few seconds. Simulated for now.
- **Assistant** — chat panel at the bottom right. Also simulated for now, will connect to Claude.
