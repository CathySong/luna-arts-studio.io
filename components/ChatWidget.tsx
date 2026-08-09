"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Loader2, Phone, Mail } from "lucide-react";
import { fallEnrollmentConfig } from "@/config/fall-enrollment";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const { phone, email, wechat } = fallEnrollmentConfig.contact;
const phoneHref = phone.replace(/\s+/g, "");

const SUGGESTIONS = [
  "What Fall classes do you offer?",
  "What ages for Creative Art?",
  "How much do classes cost?",
  "How can I talk to Luna?",
];

const WELCOME = `Hi! I'm Luna's studio assistant. Ask me about Fall classes, schedules, ages, enrollment, or pricing.

Prefer to talk with Luna directly?
• Call or text: ${phone}
• Email: ${email}
• WeChat: ${wechat}`;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: WELCOME },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [open, messages, busy]);

  async function copyWeChat() {
    try {
      await navigator.clipboard.writeText(wechat);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  async function sendMessage(text: string) {
    const content = text.trim();
    if (!content || busy) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setBusy(true);

    try {
      const payload = nextMessages.filter(
        (m, i) => !(i === 0 && m.role === "assistant" && m.content === WELCOME)
      );

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payload }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        reply?: string;
        error?: string;
      };

      if (!res.ok || !data.reply) {
        throw new Error(data.error || "Could not get a reply");
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.reply! }]);
    } catch (err) {
      const msg =
        err instanceof Error
          ? `${err.message}\n\nYou can also call/text Luna at ${phone}, email ${email}, or WeChat ${wechat}.`
          : `Something went wrong. Call/text ${phone}, email ${email}, or WeChat ${wechat}.`;
      setError(msg);
    } finally {
      setBusy(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    void sendMessage(input);
  }

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3">
      {open && (
        <div
          className="w-[min(100vw-2rem,380px)] h-[min(72vh,560px)] bg-white border border-gray-lightest shadow-xl flex flex-col overflow-hidden"
          role="dialog"
          aria-label="Chat with Luna"
        >
          <div className="bg-accent-warm text-white px-5 py-4 flex items-start justify-between gap-3 shrink-0">
            <div>
              <p className="font-mono text-[9px] tracking-widest uppercase opacity-90 mb-1">
                Ask Luna
              </p>
              <h2 className="font-display text-2xl font-light leading-tight">Studio Chat</h2>
              <p className="font-body text-xs font-light opacity-90 mt-1">
                Classes · pricing · talk to Luna
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/15 transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gradient-to-b from-gray-50/80 to-white">
            {messages.map((m, i) => (
              <div
                key={`${m.role}-${i}`}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-accent-warm text-white font-body"
                      : "bg-white border border-gray-lightest text-gray-darkest font-body font-light"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {busy && (
              <div className="flex justify-start">
                <div className="px-3.5 py-2.5 bg-white border border-gray-lightest text-gray-darker flex items-center gap-2 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-accent-warm" />
                  Luna is typing…
                </div>
              </div>
            )}

            {error && (
              <p className="font-body text-xs text-red-600 leading-relaxed whitespace-pre-wrap">
                {error}
              </p>
            )}

            {messages.length <= 1 && !busy && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => void sendMessage(q)}
                    className="font-mono text-[9px] tracking-wide uppercase px-3 py-2 border border-accent-warm/30 text-accent-warm hover:bg-accent-warm/10 transition-colors text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Direct ways to reach Luna */}
          <div className="border-t border-gray-lightest px-3 py-3 bg-gray-50/70 shrink-0">
            <p className="font-mono text-[8px] tracking-widest uppercase text-gray-darker mb-2">
              Talk to Luna
            </p>
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:${phoneHref}`}
                className="flex items-center gap-2 px-2.5 py-2 bg-white border border-gray-lightest hover:border-accent-warm/40 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-accent-warm shrink-0" />
                <span className="min-w-0">
                  <span className="block font-mono text-[8px] tracking-widest uppercase text-gray-darker">
                    Call
                  </span>
                  <span className="block font-body text-[11px] text-gray-darkest truncate">
                    {phone}
                  </span>
                </span>
              </a>
              <a
                href={`sms:${phoneHref}`}
                className="flex items-center gap-2 px-2.5 py-2 bg-white border border-gray-lightest hover:border-accent-warm/40 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-accent-warm shrink-0" />
                <span className="min-w-0">
                  <span className="block font-mono text-[8px] tracking-widest uppercase text-gray-darker">
                    Text
                  </span>
                  <span className="block font-body text-[11px] text-gray-darkest truncate">
                    {phone}
                  </span>
                </span>
              </a>
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 px-2.5 py-2 bg-white border border-gray-lightest hover:border-accent-warm/40 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-accent-warm shrink-0" />
                <span className="min-w-0">
                  <span className="block font-mono text-[8px] tracking-widest uppercase text-gray-darker">
                    Email
                  </span>
                  <span className="block font-body text-[11px] text-gray-darkest truncate">
                    {email}
                  </span>
                </span>
              </a>
              <button
                type="button"
                onClick={() => void copyWeChat()}
                className="flex items-center gap-2 px-2.5 py-2 bg-white border border-gray-lightest hover:border-accent-warm/40 transition-colors text-left"
              >
                <span className="w-3.5 h-3.5 text-accent-warm shrink-0 font-display text-sm leading-none">
                  微
                </span>
                <span className="min-w-0">
                  <span className="block font-mono text-[8px] tracking-widest uppercase text-gray-darker">
                    {copied ? "Copied" : "WeChat"}
                  </span>
                  <span className="block font-body text-[11px] text-gray-darkest truncate">
                    {wechat}
                  </span>
                </span>
              </button>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-gray-lightest p-3 flex items-end gap-2 shrink-0 bg-white"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void sendMessage(input);
                }
              }}
              rows={1}
              placeholder="Ask about classes or price…"
              disabled={busy}
              className="flex-1 resize-none max-h-28 font-body text-sm text-gray-darkest placeholder:text-gray-darker/70 px-3 py-2.5 border border-gray-lightest focus:outline-none focus:border-accent-warm/50 bg-gray-50/50"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="shrink-0 w-11 h-11 flex items-center justify-center bg-accent-warm text-white hover:bg-accent-warm/90 disabled:opacity-40 transition-colors"
              aria-label="Send message"
            >
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-14 h-14 rounded-full bg-accent-warm text-white shadow-lg hover:bg-accent-warm/90 transition-all duration-300 flex items-center justify-center hover:scale-105"
        aria-label={open ? "Close chat" : "Ask Luna about classes"}
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
}
