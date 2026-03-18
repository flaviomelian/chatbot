"use client";

import React from "react";
import Link from "next/link";
import {
    Cpu,
    ChevronRight,
    Terminal,
    ShieldCheck,
    Zap,
    Code2,
    ArrowUpRight
} from "lucide-react";

export default function Home() {
    return (
        <div className="min-h-screen w-full bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 font-sans selection:bg-blue-500/30">

            {/* --- BACKGROUND DECORATION --- */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[25%] -left-[10%] w-[70%] h-[70%] bg-blue-500/5 rounded-full blur-[120px]" />
                <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[100px]" />
            </div>

            {/* --- NAVBAR --- */}
            <nav className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12 border-b border-zinc-200 dark:border-zinc-800 backdrop-blur-md bg-white/30 dark:bg-[#09090b]/30">
                <div className="flex items-center gap-3 group">
                    <div className="bg-blue-600 p-2 rounded-lg transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(37,99,235,0.8)] group-hover:scale-110">
                        <Cpu size={20} className="text-white transition-transform duration-300 group-hover:rotate-12" />
                    </div>
                    <h2 className="text-sm font-bold tracking-tighter uppercase bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:via-white group-hover:to-blue-400 transition-all duration-300">
                        Azure AI GPT-4o
                    </h2>
                </div>
                <div className="flex gap-6 items-center">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest hidden sm:block">v4.2.0 / Stable</span>
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <main className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-32">
                <div className="flex flex-col items-center text-center space-y-8">

                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                        <Terminal size={12} /> Powered by Azure OpenAI Service
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl leading-[1.1]">
                        Interface avanzada para <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-400 to-indigo-500">
                            Modelos de Lenguaje.
                        </span>
                    </h1>

                    <p className="max-w-2xl text-zinc-500 dark:text-zinc-400 text-sm md:text-base leading-relaxed font-medium">
                        Entorno de experimentación y despliegue para especialistas en AI. Ajusta temperaturas, prompts de sistema y gestiona contextos de manera eficiente sobre infraestructura de nivel empresarial.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Link
                            href="/chat"
                            className="group flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm transition-all hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Iniciar Conversación <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link><Link
                            href="/documentation"
                            className="group flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm transition-all hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:scale-[1.02] active:scale-[0.98]"
                        >Documentación <ArrowUpRight size={18} className="opacity-50" />
                        </Link>
                    </div>
                </div>

                {/* --- FEATURES GRID --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32">
                    <FeatureCard
                        icon={<Zap className="text-blue-500" />}
                        title="Baja Latencia"
                        desc="Optimizado para respuestas rápidas mediante instancias de Azure AI Foundry."
                    />
                    <FeatureCard
                        icon={<ShieldCheck className="text-blue-500" />}
                        title="Enterprise Ready"
                        desc="Control total sobre los prompts de sistema y parámetros de inferencia."
                    />
                    <FeatureCard
                        icon={<Code2 className="text-blue-500" />}
                        title="Context Awareness"
                        desc="Gestión inteligente de historial para mantener coherencia en conversaciones técnicas."
                    />
                </div>
            </main>

            {/* --- FOOTER DECORATION --- */}
            <footer className="absolute bottom-8 left-0 w-full px-12 flex justify-between items-center opacity-30">
                <p className="text-[10px] font-mono tracking-widest uppercase italic">Data Encryption: AES-256</p>
                <div className="flex gap-4">
                    <div className="w-12 h-[1px] bg-zinc-500" />
                    <div className="w-12 h-[1px] bg-zinc-500" />
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="p-8 rounded-[32px] bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/50 transition-colors group">
            <div className="mb-4 p-3 w-fit rounded-2xl bg-zinc-50 dark:bg-zinc-900 group-hover:scale-110 transition-transform duration-500">
                {icon}
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-2">{title}</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                {desc}
            </p>
        </div>
    );
}