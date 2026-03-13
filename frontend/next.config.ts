import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Esto permite que Next.js acepte peticiones desde tu IP local
    allowedDevOrigins: ['192.168.1.117', 'localhost:3000'],
  },
  // Si tienes otras configuraciones (como imágenes o redirecciones), déjalas ahí.
};

export default nextConfig;
