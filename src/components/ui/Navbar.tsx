"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn, Menu, ShoppingCart, User, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image.js";
import { authClient } from "@/lib/auth/auth-client";


const linksMobile = [
  { label: "Inicio", href: "/" },
  { label: "Mis Ordenes", href: "/profile/orders" },
  { label: "Productos", href: "/productos" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Contacto", href: "/contacto" },
];
const links = [
  { label: "Inicio", href: "/" },
  { label: "Productos", href: "/productos" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Contacto", href: "/contacto" },
];

export default function Navbar() {
  const {
    data: session,
    isPending,
  } = authClient.useSession()
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
  }, [open]);

  return (
    <header className="sticky top-0 z-50 bg-[#171718]/90 backdrop-blur-md border-b border-gray-800 transition-all duration-300">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Marca */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-transparent group-hover:border-orange-500 transition-all">
              <Image
                src="/logo.png"
                alt="A la Tabla Logo"
                fill
                className="object-cover"
              />
            </div>
            <span className="font-bold tracking-tight text-white text-xl group-hover:text-orange-500 transition-colors">A la Tabla</span>
          </Link>

          {/* Links desktop */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${pathname === l.href
                    ? "text-orange-500 bg-orange-500/10"
                    : "text-gray-300 hover:text-white hover:bg-gray-800"
                  }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Toggle mobile */}
          <div className="flex items-center justify-center gap-4">
            {/* Acción (desktop) */}
            <div className="hidden xl:block min-w-[140px] text-right">
              {isPending ? (
                <div className="h-10 w-32 bg-gray-800 rounded-lg animate-pulse ml-auto" />
              ) : session ? (
                <Link
                  href="/profile"
                  className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg font-medium shadow-lg shadow-orange-900/20"
                >
                  <User className="w-4 h-4" />
                  Mi perfil
                </Link>
              ) : (
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white bg-gray-800 hover:bg-gray-700 transition-colors border border-gray-700"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
              )}
            </div>

            {/* cart Icon*/}
            <Link
              href="/cart"
              className="relative p-2 text-gray-300 hover:text-orange-500 transition-colors group"
            >
              <ShoppingCart className="w-7 h-7" />
              {/* Optional: Add badge here if needed */}
            </Link>

            <button
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
              className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-gray-300 hover:bg-gray-800 hover:text-white focus:outline-none transition-colors"
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
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }} // smooth ease
              className="md:hidden overflow-hidden bg-[#171718] border-b border-gray-800"
            >
              <div className="pb-6 px-4 space-y-4">
                {/* User Section Mobile */}
                <div className="pt-4 pb-2 border-b border-gray-800 mb-2">
                  {isPending ? (
                    <div className="h-12 w-full bg-gray-800 rounded-lg animate-pulse" />
                  ) : session ? (
                    <Link
                      onClick={() => setOpen(false)}
                      href="/profile"
                      className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-orange-500/30 transition-all"
                    >
                      <div className="p-2 bg-orange-500/10 rounded-full text-orange-500">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{session.user.name}</p>
                        <p className="text-gray-500 text-xs truncate">{session.user.email}</p>
                      </div>
                    </Link>
                  ) : (
                    <Link
                      onClick={() => setOpen(false)}
                      href="/auth/login"
                      className="flex items-center justify-center gap-2 p-3 rounded-xl bg-orange-500 text-white font-bold shadow-lg shadow-orange-900/20"
                    >
                      <LogIn className="w-5 h-5" />
                      Iniciar Sesión
                    </Link>
                  )}
                </div>

                {/* Navigation Links */}
                <div className="space-y-1">
                  {linksMobile.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={`block rounded-lg px-4 py-3 text-base font-medium transition-all ${pathname === l.href
                          ? "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                        }`}
                    >
                      {l.label}
                    </Link>
                  ))}

                  {session?.user?.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-4 py-3 text-base font-medium text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 transition-all"
                    >
                      Panel de Admin
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
