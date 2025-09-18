"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image.js";
const links = [
  { label: "Inicio", href: "/" },
  { label: "Productos", href: "/productos" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Contacto", href: "/contacto" },
];

export default function Navbar() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
  }, [open]);

  return (
    <header className="sticky top-0 z-50 bg-black  border-b border-white/10">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Marca */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="A la Tabla Logo"
              width={500}
              height={500}
              className="h-20 w-20 rounded-full object-cover"
            />
            <span className="font-semibold tracking-wide text-primary text-xl">A la Tabla</span>
          </Link>

          {/* Links desktop */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
              >
                <span className={`text-mdfont-bold transition-colors ${pathname === l.href ? "text-primary"  : "text-white "}`}>{l.label}</span>
              </Link>
            ))}
          </div>

          {/* Acción (desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/auth/login"
              className="btn-primary"
            >
              Login
            </Link>
          </div>

          {/* Toggle mobile */}
          <div className="md:hidden">
            <button
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center justify-center rounded-xl p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <span className="sr-only">Abrir menú</span>
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Panel mobile */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="mobile"
              id="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-3 border-t border-white/10">
                <div className="flex flex-col gap-1">
                  {links.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={`block rounded-lg px-3 py-2 text-base font-medium ${
                        pathname === l.href
                          ? "bg-primary "
                          : " "
                      }`}
                    >
                      {l.label}
                    </Link>
                  ))}
                  <Link
                    href="/whatsapp"
                    onClick={() => setOpen(false)}
                    className="btn-primary mt-2 w-min px-5 py-2 text-center"
                  >
                    Login
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
