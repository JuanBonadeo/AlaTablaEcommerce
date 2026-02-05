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
        <div className="min-h-screen bg-[#0a0a0a] text-white py-12 sm:py-20 px-3 sm:px-4">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    className="text-center mb-12 sm:mb-16"
                >
                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6">
                        Ponete en <span className="text-orange-500">Contacto</span>
                    </h1>
                    <p className="text-base sm:text-xl text-gray-400 max-w-2xl mx-auto">
                        ¿Tenés alguna duda o querés un pedido personalizado? Estamos para ayudarte
                        a encontrar la pieza perfecta para tu parrilla.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
                    {/* Info Side */}
                    <motion.div
                        custom={1}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        className="space-y-6 sm:space-y-8"
                    >
                        <div className="bg-gradient-to-br from-[#171718] to-[#0f0f10] p-6 sm:p-8 rounded-2xl border-2 border-gray-800/50 space-y-6 sm:space-y-8 shadow-xl">
                            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Información de contacto</h2>

                            <div className="flex items-start gap-3 sm:gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/50 flex-shrink-0">
                                    <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-base sm:text-lg text-white">Email</h3>
                                    <p className="text-sm sm:text-base text-gray-400">admin@alatabla.store</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 sm:gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-500/50 flex-shrink-0">
                                    <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-base sm:text-lg text-white">WhatsApp</h3>
                                    <p className="text-sm sm:text-base text-gray-400">+54 9 341 2510795</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 sm:gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/50 flex-shrink-0">
                                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-base sm:text-lg text-white">Ubicación</h3>
                                    <p className="text-sm sm:text-base text-gray-400">Rosario, Santa Fe, Argentina</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <a href="https://www.instagram.com/_alatabla_/" className="flex-1 bg-gradient-to-br from-[#171718] to-[#0f0f10] py-3 sm:py-4 rounded-xl border-2 border-gray-800/50 flex items-center justify-center gap-2 hover:border-pink-500/50 hover:shadow-lg hover:shadow-pink-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" />
                                <span className="text-sm sm:text-base">Instagram</span>
                            </a>
                            <a href="https://www.facebook.com/alatabla.store" className="flex-1 bg-gradient-to-br from-[#171718] to-[#0f0f10] py-3 sm:py-4 rounded-xl border-2 border-gray-800/50 flex items-center justify-center gap-2 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                <Facebook className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                                <span className="text-sm sm:text-base">Facebook</span>
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
                        <form onSubmit={handleSubmit} className="bg-gradient-to-br from-[#171718] to-[#0f0f10] p-6 sm:p-8 md:p-10 rounded-2xl border-2 border-gray-800/50 shadow-2xl">
                            <div className="space-y-5 sm:space-y-6">
                                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-2">Nombre</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-[#0a0a0a] border-2 border-gray-800/50 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-white text-sm sm:text-base"
                                            placeholder="Tu nombre"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-2">Email</label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full bg-[#0a0a0a] border-2 border-gray-800/50 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-white text-sm sm:text-base"
                                            placeholder="tu@email.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-2">Asunto</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-[#0a0a0a] border-2 border-gray-800/50 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-white text-sm sm:text-base"
                                        placeholder="¿En qué podemos ayudarte?"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-2">Mensaje</label>
                                    <textarea
                                        rows={4}
                                        required
                                        className="w-full bg-[#0a0a0a] border-2 border-gray-800/50 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all resize-none text-white text-sm sm:text-base"
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
                                    <p className="text-green-400 text-center text-xs sm:text-sm">
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
