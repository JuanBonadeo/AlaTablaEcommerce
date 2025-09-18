"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

export default function Banner() {
  return (
    <section className="relative h-[90vh] w-full overflow-hidden mt-4 rounded-md">
      {/* Imagen de fondo */}
      <Image
        src="/fondo.jpg" // 🔄 poné la imagen que quieras en /public
        alt="Banner"
        fill
        className="object-cover"
        priority
      />

      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Contenido */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center text-center text-white"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 120 }}
            className="mb-1"
          >
            <Image
              src="/logo.png" // 🔄 poné tu logo en /public
              alt="Logo"
              width={300}
              height={300}
              className="rounded-full   "
            />
          </motion.div>

          {/* Nombre */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-wide"
          >
            A la Tabla
          </motion.h1>

          {/* Subtítulo opcional */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-4 text-lg sm:text-xl text-white/80 max-w-xl"
          >
            Productos artesanales de calidad para vos 
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
