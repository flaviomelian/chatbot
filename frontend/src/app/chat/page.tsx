"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link"; // Importar Link para la navegación
import { Message, sendChatMessage, fetchChatHistory } from "../service";
import {
  Settings2,
  Trash2,
  Send,
  Cpu,
  Database,
  Thermometer,
  Home, // Importar icono Home
} from "lucide-react";

export default function AzureChatApp() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [temp, setTemp] = useState(0.7);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

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
    setIsLoading(true);

    sendChatMessage({
      message: input,
      systemPrompt,
      temperature: temp,
      history: messages.slice(-10) as Message[],
    }).then((response) => {
      if (response.status === "success")
        setMessages((prev) => [...prev, { role: response.role, content: response.content }]);
    }).finally(() => setIsLoading(false));
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 overflow-hidden font-sans">
      {/* --- SIDEBAR --- */}
      <aside className="hidden md:flex w-80 flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c0c0e] p-6">
        <div className="flex items-center gap-3 mb-8 group">
          <div className="bg-blue-600 p-2 rounded-lg transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(37,99,235,0.8)] group-hover:scale-110">
            <Cpu size={20} className="text-white transition-transform duration-300 group-hover:rotate-12" />
          </div>
          <h2 className="text-sm font-bold tracking-tighter uppercase bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:via-white group-hover:to-blue-400 transition-all duration-300">
            Azure AI Foundry
          </h2>
        </div>
        <div className="space-y-6 flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent dark:scrollbar-thumb-zinc-800">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2 block italic">System Prompt</label>
            <textarea
              className="w-full h-40 p-3 text-xs font-mono bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none resize-none"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
            />
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2 mb-2">
              <Thermometer size={14} /> Temp: {temp}
            </label>
            <input type="range" min="0" max="2" step="0.1" value={temp} onChange={(e) => setTemp(parseFloat(e.target.value))} className="w-full accent-blue-600" />
          </div>
        </div>

        {/* --- BOTÓN VOLVER A INICIO --- */}
        <Link href="/" passHref>
          <button className="mb-3 flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white text-xs font-bold border border-zinc-200 dark:border-zinc-800 transition-all">
            <Home size={16} /> INICIO
          </button>
        </Link>

        <button onClick={() => setMessages([])} className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-xs font-bold border border-red-500/20 transition-all">
          <Trash2 size={16} /> RESET
        </button>
      </aside>

      {/* --- MAIN CHAT AREA --- */}
      <main className="flex-1 flex flex-col h-full bg-white dark:bg-[#09090b] relative overflow-hidden">

        {/* Messages Display: Scrollbar personalizada para que el fondo sea transparente */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 chat-scrollbar">

          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
              <Database size={40} className="mb-4" />
              <p className="text-[10px] font-mono tracking-widest uppercase">System Ready</p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
              <span className="text-[9px] font-black uppercase mb-1 tracking-widest text-zinc-500">
                {msg.role === "user" ? ">>> User" : "<<< Azure"}
              </span>
              <div className={`max-w-[92%] md:max-w-[80%] p-4 rounded-2xl text-[13px] md:text-sm leading-relaxed ${msg.role === "user" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/10" : "bg-zinc-100 dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800"
                }`}>
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-1.5 p-4 animate-pulse">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            </div>
          )}
          <div ref={chatEndRef} className="h-32" />
        </div>

        {/* --- INPUT FRAME CON GRADIENTE DIFUMINADO MEJORADO --- */}
        <div className="absolute bottom-0 left-0 w-full p-6 
          bg-gradient-to-t 
          from-white via-white/90 to-transparent 
          dark:from-[#09090b] dark:via-[#09090b]/90 dark:to-transparent 
          pt-24 pointer-events-none">

          <div className="max-w-4xl mx-auto pointer-events-auto">
            <div className="relative flex items-end gap-2 bg-white/70 dark:bg-[#09090b]/70 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 p-2 rounded-[24px] focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-2xl">
              <textarea
                rows={1}
                disabled={isLoading}
                placeholder="Describa su problema técnico..."
                className="flex-1 max-h-40 min-h-[44px] py-3 pl-4 pr-2 bg-transparent outline-none text-sm resize-none"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "inherit";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className={`h-10 w-10 flex items-center justify-center rounded-full transition-all ${isLoading || !input.trim() ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-400" : "bg-blue-600 text-white shadow-lg active:scale-95"
                  }`}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}