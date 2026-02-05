"use client";

import React from "react";
import { Mail, Phone, MapPin, Send, Instagram, Facebook, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, delay: i * 0.1 },
    }),
};

const ContactPage = () => {
    const [status, setStatus] = React.useState<"idle" | "sending" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sending");
        // Simulamos envío
        setTimeout(() => {
            setStatus("success");
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Ponete en <span className="text-amber-400">Contacto</span>
                    </h1>
                    <p className="text-xl text-white/70 max-w-2xl mx-auto">
                        ¿Tenés alguna duda o querés un pedido personalizado? Estamos para ayudarte
                        a encontrar la pieza perfecta para tu parrilla.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Info Side */}
                    <motion.div
                        custom={1}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        className="space-y-8"
                    >
                        <div className="bg-neutral-900/50 p-8 rounded-3xl border border-white/5 space-y-8">
                            <h2 className="text-2xl font-bold mb-6">Información de contacto</h2>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-amber-400/10 rounded-2xl flex items-center justify-center text-amber-400">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Email</h3>
                                    <p className="text-white/60">admin@alatabla.store</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-green-400/10 rounded-2xl flex items-center justify-center text-green-400">
                                    <MessageCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">WhatsApp</h3>
                                    <p className="text-white/60">+54 9 341 2510795</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-400/10 rounded-2xl flex items-center justify-center text-blue-400">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Ubicación</h3>
                                    <p className="text-white/60">Rosario, Santa Fe, Argentina</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <a href="https://www.instagram.com/_alatabla_/" className="flex-1 bg-neutral-900 py-4 rounded-2xl border border-white/5 flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors">
                                <Instagram className="w-5 h-5 text-pink-500" />
                                <span>Instagram</span>
                            </a>
                            <a href="https://www.facebook.com/alatabla.store" className="flex-1 bg-neutral-900 py-4 rounded-2xl border border-white/5 flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors">
                                <Facebook className="w-5 h-5 text-blue-500" />
                                <span>Facebook</span>
                            </a>
                        </div>
                    </motion.div>

                    {/* Form Side */}
                    <motion.div
                        custom={2}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                    >
                        <form onSubmit={handleSubmit} className="bg-neutral-900 p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl">
                            <div className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-white/60 mb-2">Nombre</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                                            placeholder="Tu nombre"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white/60 mb-2">Email</label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                                            placeholder="tu@email.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white/60 mb-2">Asunto</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                                        placeholder="¿En qué podemos ayudarte?"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white/60 mb-2">Mensaje</label>
                                    <textarea
                                        rows={4}
                                        required
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all resize-none"
                                        placeholder="Escribí tu mensaje acá..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === "sending" || status === "success"}
                                    className="w-full btn-primary flex items-center justify-center gap-2 group"
                                >
                                    {status === "idle" && (
                                        <>
                                            <span>Enviar Mensaje</span>
                                            <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </>
                                    )}
                                    {status === "sending" && <span>Enviando...</span>}
                                    {status === "success" && <span>¡Mensaje Enviado!</span>}
                                </button>

                                {status === "success" && (
                                    <p className="text-green-400 text-center text-sm">
                                        Gracias por contactarnos. Te responderemos pronto.
                                    </p>
                                )}
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
