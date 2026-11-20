"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Loader2, MessageSquare, Send, X } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING: Msg = {
  role: "assistant",
  content: "Hi! I'm the Nexovate assistant. Ask me about our services, packages or how to start a project.",
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, open]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: "user" as const, content: text.slice(0, 2000) }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.filter((m) => m !== GREETING) }),
      });
      const json = await res.json().catch(() => null);
      const reply = json?.ok ? json.data.reply : (json?.error?.message ?? "Sorry, something went wrong.");
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Network error — please try again or use the contact form." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div
          role="dialog"
          aria-label="Nexovate assistant"
          className="card mb-3 flex h-[480px] w-[min(380px,calc(100vw-2.5rem))] flex-col overflow-hidden"
        >
          <div className="flex items-center justify-between border-b border-line bg-ink px-4 py-3 text-white">
            <p className="text-sm font-semibold">Nexovate Assistant</p>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat" className="text-white/70 hover:text-white">
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm" aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex"}>
                <p
                  className={
                    m.role === "user"
                      ? "max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-sm bg-brand px-3.5 py-2 text-white"
                      : "max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-bl-sm bg-paper px-3.5 py-2"
                  }
                >
                  {m.content}
                </p>
              </div>
            ))}
            {loading && <Loader2 size={16} className="animate-spin text-muted" aria-label="Thinking" />}
            <div ref={endRef} />
          </div>
          <p className="px-4 pb-1 text-[11px] text-muted">
            AI answers can be incomplete. For a confirmed quote, use <Link href="/get-a-quote" className="text-brand">Get a Quote</Link>.
          </p>
          <form onSubmit={send} className="flex gap-2 border-t border-line p-3">
            <label htmlFor="chat-input" className="sr-only">Your message</label>
            <input
              id="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={2000}
              placeholder="Ask a question…"
              className="field h-10 py-2"
            />
            <button type="submit" disabled={loading} aria-label="Send" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-white disabled:opacity-60">
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close assistant" : "Open assistant"}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-card transition hover:bg-brand-deep"
      >
        {open ? <X size={22} /> : <MessageSquare size={22} />}
      </button>
    </div>
  );
}
