"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// Datos de ejemplo
const categories = [
  {
    name: "Tablas",
    href: "/categorias/tablas",
    image: "/categorias/tablas.jpg",
  },
  {
    name: "Cuchillos",
    href: "/categorias/cuchillos",
    image: "/categorias/cuchillos.jpg",
  },
  {
    name: "Accesorios",
    href: "/categorias/accesorios",
    image: "/categorias/accesorios.jpg",
  },
  {
    name: "Promos",
    href: "/categorias/promos",
    image: "/categorias/promos.jpg",
  },
];

export default function CategoriesSection() {
  
  return (
    <section className="py-16 bg-neutral-950 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10">
          Categorías destacadas
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="relative h-48 sm:h-64 rounded-2xl overflow-hidden shadow-lg cursor-pointer group"
            >
              <Link href={cat.href}>
                {/* Imagen */}
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                {/* Nombre */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl sm:text-2xl font-semibold drop-shadow-lg">
                    {cat.name}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
