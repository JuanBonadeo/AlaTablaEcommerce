"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";
import Image from "next/image.js";

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo / Marca */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="font-semibold tracking-wide text-lg">
                A la Tabla
              </span>
              <Image
                src="/logo.png"
                alt="A la Tabla Logo"
                width={300}
                height={300}
                className="h-20 w-20 rounded-full object-cover"
              />
            </Link>
            <p className="mt-4 text-sm text-white/70 max-w-xs">
              Tablas y cuchillos parrilleros artesanales. Calidad hecha a mano
              para tus momentos de fuego 🔥
            </p>
          </div>

          {/* Navegación */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-4">
              Navegación
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white/90">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/productos" className="hover:text-white/90">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/nosotros" className="hover:text-white/90">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-white/90">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-4">
              Contacto
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:admin@alatabla.store" className="hover:text-white/90">
                    admin@alatabla.store
                </a>
              </li>
              <li>
                <a href="tel:+5493412510795" className="hover:text-white/90">
                  +54 9 341 2510795
                </a>
              </li>
              <li>Rosario, Argentina</li>
            </ul>
          </div>

          {/* Redes sociales */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-4">
              Seguinos
            </h3>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/_alatabla_/" className="hover:text-white/90" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white/90" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white/90" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="mailto:admin@alatabla.store" className="hover:text-white/90" aria-label="Email">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/60">
          <p>© {new Date().getFullYear()} A la Tabla. Todos los derechos reservados.</p>
          <p>Hecho por JuanBonadeo</p>
        </div>
      </div>
    </footer>
  );
}
