"use client";

import React, { useState, useEffect, useRef } from "react";
import { Message, sendChatMessage, fetchChatHistory } from "./service";
import {
  Settings2,
  Trash2,
  Send,
  Cpu,
  Database,
  Thermometer,
} from "lucide-react";

export default function AzureChatApp() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    [],
  );
  const [input, setInput] = useState("");
  const [temp, setTemp] = useState(0.7);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false); // ESTADO DE CARGA
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]); // Scroll también cuando carga

  useEffect(() => {
    fetchChatHistory()
      .then((history) => {
        if (history.length > 0) setMessages(history);
      })
      .catch((error) => console.error("Error historial:", error));
  }, []);

  const handleSendMessage = () => {
    if (!input.trim() || isLoading) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true); // EMPIEZA LA CARGA

    sendChatMessage({
      message: input,
      systemPrompt,
      temperature: temp,
      history: messages.slice(-10) as Message[],
    })
      .then((response) => {
        if (response.status === "success") {
          setMessages((prev) => [
            ...prev,
            { role: response.role, content: response.content },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: `Error: ${response.message}` },
          ]);
        }
      })
      .catch((error) => {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Error de red: ${error.message}` },
        ]);
      })
      .finally(() => setIsLoading(false)); // TERMINA LA CARGA
  };

  const resetChat = () => setMessages([]);

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 md:overflow-hidden font-sans">
      {/* --- SIDEBAR (Desktop) --- */}
      <aside className="hidden md:flex w-80 flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c0c0e] p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Cpu size={20} className="text-white" />
          </div>
          <h2 className="text-sm font-bold tracking-tighter uppercase">
            Azure AI Foundry
          </h2>
        </div>
        <div className="space-y-6 flex-1 overflow-y-auto">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2 block italic">
              System Prompt Override
            </label>
            <textarea
              className="w-full h-40 p-3 text-xs font-mono bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
            />
          </div>
          {/* Temperature Slider */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2 mb-2">
              <Thermometer size={14} /> Temperature: {temp}
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={temp}
              onChange={(e) => setTemp(parseFloat(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>
        </div>
        <button
          onClick={resetChat}
          className="mt-6 flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-xs font-bold transition-all border border-red-500/20"
        >
          <Trash2 size={16} /> RESET HISTORY
        </button>
      </aside>

      {/* --- MAIN CHAT AREA --- */}
      <main className="flex-1 flex flex-col h-screen bg-white dark:bg-[#09090b] overflow-y-auto md:overflow-hidden">
        {/* Header Fijo */}
        <header className="sticky top-0 z-30 flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md md:hidden">
          <span className="font-bold text-[10px] uppercase tracking-[0.2em] text-blue-500">
            <Cpu /> Azure Engine v3.1
          </span>
          <Settings2 size={18} className="text-zinc-400" />
        </header>

        {/* Messages Display: Ocupa el máximo posible */}
        <div className="flex-1 p-4 md:p-8 space-y-6">
          {messages.length === 0 && (
            <div className="h-[40vh] flex flex-col items-center justify-center text-center opacity-20">
              <Database size={40} className="mb-4" />
              <p className="text-[10px] font-mono tracking-widest uppercase">
                System Ready
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
            >
              <span className="text-[9px] font-black uppercase mb-1 tracking-widest text-zinc-500">
                {msg.role === "user" ? ">>> User" : "<<< Azure"}
              </span>
              <div
                className={`max-w-[92%] md:max-w-[80%] p-4 rounded-2xl text-[13px] md:text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                    : "bg-zinc-100 dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex flex-col items-start animate-pulse">
              <div className="bg-zinc-100 dark:bg-[#18181b] px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex gap-1.5">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} className="h-4" />
        </div>

        {/* --- INPUT FRAME: Rediseñado para comodidad --- */}
        <div className="sticky bottom-0 p-3 md:p-6 bg-gradient-to-t from-white dark:from-[#09090b] via-white dark:via-[#09090b] to-transparent">
          <div className="max-w-4xl mx-auto">
            <div className="relative flex items-end gap-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 rounded-[24px] focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all shadow-lg">
              <textarea
                rows={1}
                disabled={isLoading}
                placeholder="Describa su problema técnico..."
                className="flex-1 max-h-40 min-h-[44px] py-3 pl-4 pr-2 bg-transparent outline-none text-sm resize-none scrollbar-hide"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  // Auto-resize simple
                  e.target.style.height = "inherit";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className={`h-10 w-10 flex items-center justify-center rounded-full transition-all ${
                  isLoading || !input.trim()
                    ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-400"
                    : "bg-blue-600 text-white shadow-md shadow-blue-500/40 active:scale-90"
                }`}
              >
                <Send size={18} />
              </button>
            </div>
            <p className="hidden md:block text-center mt-3 text-[9px] text-zinc-500 uppercase tracking-[0.3em]">
              Precision Engineering | Azure GPT-4o
            </p>
          </div>
        </div>

        {/* --- MOBILE CONFIG: Solo al final del scroll --- */}
        <div className="md:hidden mt-10 p-6 bg-zinc-50 dark:bg-[#0c0c0e] border-t border-zinc-200 dark:border-zinc-800 pb-32">
          <div className="flex items-center gap-2 mb-6 opacity-50">
            <Settings2 size={14} />
            <h3 className="text-[9px] font-bold uppercase tracking-widest">
              System Parameters
            </h3>
          </div>
          <div className="space-y-6">
            <textarea
              className="w-full h-32 p-4 text-xs font-mono bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl outline-none"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
            />
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={temp}
              onChange={(e) => setTemp(parseFloat(e.target.value))}
              className="w-full accent-blue-600"
            />
            <button
              onClick={resetChat}
              className="mt-6 flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-xs font-bold transition-all border border-red-500/20"
            >
              <Trash2 size={16} /> RESET HISTORY
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
