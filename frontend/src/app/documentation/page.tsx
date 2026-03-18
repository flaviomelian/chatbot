"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link'; // Importamos Link
import { Home } from 'lucide-react'; // Icono para volver
import arquitech from '../img/arquitectura.png';
import { TechCard } from '../component/TechCard'; // Componente para mostrar cada tecnología

const techStack = [
    {
        name: 'Next.js',
        icon: '▲',
        iconColor: 'text-white',
        role: 'Capa de Presentación (Frontend)',
        description: 'Framework de React para el desarrollo web de frontend, enfocado en la experiencia de usuario y el rendimiento.',
        functions: [
            'Proporciona la interfaz de usuario (UI) de chat reactiva y moderna.',
            'Gestiona el estado de la conversación en el cliente (mensajes, carga, errores).',
            'Envía los prompts del usuario al backend orquestador (Spring Boot) vía REST API.',
            'Muestra las respuestas generadas por la IA en tiempo real.',
        ],
    },
    {
        name: 'Spring Boot',
        icon: '🍃',
        iconColor: 'text-green-600',
        role: 'Capa de Orquestación y Negocio',
        description: 'Framework de Java para crear microservicios robustos, escalables y listos para producción.',
        functions: [
            'Actúa como el punto de entrada central y API Gateway para el frontend.',
            'Implementa la lógica de negocio, validaciones y la seguridad (según se requiera).',
            'Gestiona la persistencia de datos y el historial de chat en la base de datos MySQL.',
            'Funciona como un cliente HTTP que delega la inferencia de IA al microservicio FastAPI.',
        ],
    },
    {
        name: 'FastAPI',
        icon: '🚀',
        iconColor: 'text-purple-600',
        role: 'Capa de Proxy de IA',
        description: 'Framework web de Python moderno y de alto rendimiento, ideal para servir modelos de Machine Learning.',
        functions: [
            'Especializado en la comunicación rápida y eficiente con modelos de IA.',
            'Recibe las peticiones de inferencia desde Spring Boot.',
            'Orquesta la llamada al SDK de Azure OpenAI, gestionando credenciales y parámetros.',
            'Aísla la complejidad de la integración de la IA de la lógica de negocio principal en Java.',
        ],
    },
    {
        name: 'Azure OpenAI (GPT-4o)',
        icon: '☁️',
        iconColor: 'text-blue-700',
        role: 'Capa del Modelo de Lenguaje (LLM)',
        description: 'Servicio en la nube de Microsoft que proporciona acceso privado y seguro a los modelos avanzados de OpenAI.',
        functions: [
            'Procesa el lenguaje natural y genera respuestas coherentes, contextuales y de alta calidad (GPT-4o).',
            'Garantiza la seguridad, privacidad de datos y el cumplimiento de nivel empresarial de Azure.',
            'Permite el escalado global del modelo de IA según la demanda de la aplicación.',
        ],
    },
    {
        name: 'MySQL',
        icon: '🐬',
        iconColor: 'text-green-600',
        role: 'Capa de Persistencia',
        description: 'Sistema de gestión de bases de datos relacionales (RDBMS) fiable y de alto rendimiento.',
        functions: [
            'Almacena de forma segura el historial completo de conversaciones y mensajes.',
            'Guarda datos de usuario, sesiones y configuraciones del sistema.',
            'Garantiza la integridad, consistencia y disponibilidad de los datos históricos.',
        ],
    },
];

export default function PaginaArquitectura() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#09090b] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">

            {/* --- BOTÓN VOLVER (HOME) --- */}
            <div className="max-w-7xl mx-auto px-4 pt-6 sm:px-6 lg:px-8">
                <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all shadow-sm group">
                    <Home size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Volver a Inicio
                </Link>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 sm:px-6 lg:px-8">

                {/* Header */}
                <header className="text-center mb-10 md:mb-16 pb-6 md:pb-8 border-b-4 border-blue-500 dark:border-blue-600">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-950 dark:text-white tracking-tight mb-3 transition-colors">
                        Arquitectura del Sistema
                    </h1>
                    <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 font-normal max-w-3xl mx-auto transition-colors">
                        Ecosistema de Chatbot IA Desacoplado: Next.js + Spring Boot + FastAPI + Azure
                    </p>
                </header>

                {/* Visión General */}
                <section className="mb-10 md:mb-16 bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-blue-900/20">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-950 dark:text-white mb-6 pb-2 border-b-2 border-gray-200 dark:border-zinc-700 transition-colors">
                        Visión General
                    </h2>
                    <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none text-gray-700 dark:text-gray-300 prose-dark leading-relaxed transition-colors">
                        <p>
                            Este documento detalla la arquitectura técnica de la aplicación de chatbot, que utiliza un enfoque moderno de microservicios para separar claramente las responsabilidades. El sistema está diseñado intencionalmente para ser escalable, mantenible y flexible, permitiendo que cada componente evolucione de forma independiente sin afectar al resto.
                        </p>
                        <p>
                            La arquitectura se divide en cuatro capas lógicas principales que trabajan en armonía: Presentación (Frontend), Orquestación de Negocio (Backend Java), Proxy de IA (Backend Python), y el Modelo de Lenguaje (servicio en la nube).
                        </p>
                    </div>
                </section>

                {/* Diagrama de Flujo */}
                <section className="mb-10 md:mb-16 bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-blue-900/20">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-950 dark:text-white mb-6 pb-2 border-b-2 border-gray-200 dark:border-zinc-700 transition-colors">
                        Diagrama de Flujo y Arquitectura
                    </h2>
                    <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 mb-8 transition-colors">
                        El siguiente diagrama ilustra visualmente la interacción secuencial entre los componentes cuando un usuario envía un mensaje y recibe una respuesta generada por la IA.
                    </p>

                    <div className="bg-gray-100 dark:bg-zinc-800 border-2 border-dashed border-gray-300 dark:border-zinc-700 text-gray-600 dark:text-gray-400 rounded-xl p-4 md:p-10 lg:p-16 text-center font-semibold text-lg flex flex-col items-center justify-center min-h-[300px] md:min-h-[400px] transition-colors">
                        <Image
                            src={arquitech}
                            alt="Diagrama de Arquitectura del Chatbot"
                            width={1000}
                            height={500}
                            className="rounded-lg shadow-md w-full h-auto object-contain"
                            priority
                        />
                    </div>
                </section>

                {/* Pila Tecnológica */}
                <section className="mb-10 md:mb-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-950 dark:text-white mb-8 md:mb-10 pb-2 border-b-2 border-gray-200 dark:border-zinc-700 transition-colors">
                        Pila Tecnológica y Funciones Detalladas
                    </h2>

                    <div className="flex flex-col gap-6 md:gap-8">
                        {/* Fila superior: 3 elementos */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {techStack.slice(0, 3).map((tech, index) => (
                                <TechCard key={index} tech={tech} />
                            ))}
                        </div>

                        {/* Fila inferior: 2 elementos centrados */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:justify-center gap-6 md:gap-8">
                            {techStack.slice(3, 5).map((tech, index) => (
                                <div key={index} className="lg:w-[calc(33.333%-1.5rem)]">
                                    <TechCard tech={tech} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="mt-16 md:mt-20 pt-8 md:pt-10 border-t border-gray-200 dark:border-zinc-800 text-center text-gray-600 dark:text-gray-400 transition-colors">
                    <p className="text-sm">
                        &copy; {new Date().getFullYear()} - Documentación Técnica Interna del Repositorio Chatbot.
                    </p>
                </footer>

            </div>
        </div>
    );
}