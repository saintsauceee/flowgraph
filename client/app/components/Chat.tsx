"use client";

import { useEffect, useRef, useState } from "react";

const BOT_RESPONSES = [
  "I'm analyzing the latest data streams now.",
  "Cross-referencing that with known event clusters in the region.",
  "Interesting — there's a correlation spike in the last 6 hours.",
  "I don't have enough context yet. Can you narrow the timeframe?",
  "That pattern is consistent with what we saw in Q3 last year.",
  "I'd recommend flagging this node for manual review.",
  "Running a proximity query on nearby entities… stand by.",
  "Signal confidence is moderate at best. Treat with caution.",
  "Nothing anomalous detected in that zone currently.",
  "The feed is showing elevated activity. I'll keep watching.",
  "Could be noise. Let me check against historical baselines.",
  "Confirmed. This matches a known event signature.",
];

interface Message {
  id: number;
  role: "user" | "bot";
  text: string;
  pending?: boolean;
}

let idCounter = 0;
const nextId = () => ++idCounter;

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: nextId(), role: "bot", text: "Hello. I'm monitoring the feed. Ask me anything." },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  function send() {
    const text = input.trim();
    if (!text || thinking) return;

    setInput("");
    setMessages((prev) => [...prev, { id: nextId(), role: "user", text }]);
    setThinking(true);

    const delay = 800 + Math.random() * 1200;
    setTimeout(() => {
      const response = BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)];
      setMessages((prev) => [...prev, { id: nextId(), role: "bot", text: response }]);
      setThinking(false);
    }, delay);
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") send();
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="px-3 py-2 border-b border-gray-200 shrink-0">
        <span className="text-gray-500 text-xs font-medium tracking-widest uppercase">Assistant</span>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-2">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] px-3 py-2 rounded-xl text-xs leading-snug ${
                msg.role === "user"
                  ? "bg-gray-200 text-gray-800 rounded-br-sm"
                  : "bg-gray-100 text-gray-700 rounded-bl-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-3 py-2 rounded-xl rounded-bl-sm flex gap-1 items-center">
              <span className="w-1 h-1 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1 h-1 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1 h-1 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="px-3 py-2 border-t border-gray-200 shrink-0 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask something…"
          className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 outline-none focus:border-gray-400 transition-colors"
        />
        <button
          onClick={send}
          disabled={!input.trim() || thinking}
          className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 disabled:opacity-30 disabled:cursor-not-allowed text-gray-700 text-xs rounded-lg transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
}
