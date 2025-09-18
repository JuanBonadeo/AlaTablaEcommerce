"use client";

import React from "react";
import { ChefHat, Flame, Users, Award, Heart, TreePine, Hammer, Target } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15 },
  }),
};

const AboutUsPage = () => {
  const stats = [
    { number: "10+", label: "Años de experiencia" },
    { number: "500+", label: "Clientes satisfechos" },
    { number: "100%", label: "Madera sustentable" },
    { number: "24hs", label: "Atención personalizada" },
  ];

  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Pasión por la calidad",
      description:
        "Cada pieza que creamos lleva nuestro amor por la artesanía y el detalle perfecto.",
    },
    {
      icon: <TreePine className="w-8 h-8" />,
      title: "Materiales nobles",
      description:
        "Seleccionamos cuidadosamente maderas de primera calidad y aceros de alto carbono.",
    },
    {
      icon: <Hammer className="w-8 h-8" />,
      title: "Artesanía tradicional",
      description:
        "Combinamos técnicas ancestrales con herramientas modernas para crear piezas únicas.",
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Enfoque en el cliente",
      description:
        "Escuchamos tus necesidades para crear productos que superen tus expectativas.",
    },
  ];

  const team = [
    {
      name: "Carlos Mendoza",
      role: "Maestro Artesano",
      description:
        "20 años de experiencia en carpintería fina y diseño de utensilios de cocina.",
      image: "🧑‍🔧",
    },
    {
      name: "Ana Rodríguez",
      role: "Diseñadora",
      description:
        "Especialista en diseño funcional y estética de productos artesanales.",
      image: "👩‍🎨",
    },
    {
      name: "Miguel Torres",
      role: "Herrero",
      description:
        "Experto en forja y templado de aceros para cuchillería de alta calidad.",
      image: "🔨",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="relative max-w-6xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-amber-900/40 rounded-2xl border border-amber-500/30">
            <ChefHat className="w-6 h-6 text-amber-400" />
            <span className="font-semibold">Artesanía Argentina</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            A la <span className="text-amber-400">Tabla</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Creamos con pasión productos artesanales únicos para potenciar tu
            experiencia en la parrilla. Cada tabla, cada cuchillo, cada utensilio
            lleva el alma del verdadero asado argentino.
          </p>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-neutral-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-white/80 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-orange-900/40 rounded-xl">
              <Flame className="w-5 h-5 text-orange-300" />
              <span className="text-orange-200 font-medium">
                Nuestra Historia
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Nacimos del amor por el{" "}
              <span className="text-amber-400">asado</span>
            </h2>

            <div className="space-y-6 text-white/80 text-lg leading-relaxed">
              <p>
                Todo comenzó en el patio de casa, con un grupo de amigos
                compartiendo domingos alrededor del fuego...
              </p>
              <p>
                Desde 2014, nos dedicamos a perfeccionar cada detalle. Trabajamos
                con maderas nobles como algarrobo, quebracho y lapacho...
              </p>
              <p>
                Hoy, "A la Tabla" es sinónimo de calidad artesanal, tradición
                familiar y excelencia en cada producto.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="relative"
          >
            <div className="bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl p-6 shadow-xl rotate-2">
              <div className="bg-neutral-900 rounded-xl p-8 -rotate-2 text-center">
                <div className="w-24 h-24 bg-amber-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-12 h-12 text-amber-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2">
                  Reconocimiento Nacional
                </h3>
                <p className="text-white/70">
                  Premio "Mejor Artesano 2023" otorgado por la Fundación
                  Pro-Artesanías Argentinas
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 bg-neutral-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-amber-900/40 rounded-xl">
              <Heart className="w-5 h-5 text-amber-300" />
              <span className="text-amber-200 font-medium">Nuestros Valores</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Lo que nos <span className="text-amber-400">define</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Cada decisión que tomamos está guiada por estos principios
              fundamentales
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-black/40 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-amber-900/40 rounded-xl flex items-center justify-center mb-6 text-amber-400">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                <p className="text-white/70 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-orange-900/40 rounded-xl">
              <Users className="w-5 h-5 text-orange-300" />
              <span className="text-orange-200 font-medium">Nuestro Equipo</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Los <span className="text-amber-400">artesanos</span> detrás de
              cada pieza
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Conoce a las personas que dan vida a cada producto con sus manos
              expertas
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-neutral-900 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                    {member.image}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{member.name}</h3>
                  <div className="text-amber-400 font-semibold mb-4">
                    {member.role}
                  </div>
                  <p className="text-white/70 leading-relaxed">
                    {member.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-amber-600/20 to-orange-600/20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            ¿Listo para mejorar tu experiencia en la parrilla?
          </h2>
          <p className="text-xl mb-8 text-white/80">
            Descubre nuestra colección de productos artesanales y lleva tu asado
            al siguiente nivel
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/productos"
              className="btn-primary"
            >
              Ver Productos
            </Link>
            <Link
              href="/contacto"
              className="btn-secondary"
            >
              Contactanos
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutUsPage;
