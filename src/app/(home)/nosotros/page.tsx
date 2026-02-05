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
    { number: "4+", label: "Años de experiencia" },
    { number: "100+", label: "Clientes satisfechos" },
    { number: "100%", label: "Maderas nobles" },
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
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-20 px-3 sm:px-4 overflow-hidden">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="relative max-w-6xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-2 border-orange-500/20 rounded-xl sm:rounded-2xl shadow-lg shadow-orange-500/25">
            <ChefHat className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
            <span className="font-semibold text-sm sm:text-base">Artesanía Argentina</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
            A la <span className="text-orange-500">Tabla</span>
          </h1>

          <p className="text-base sm:text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Creamos con pasión productos artesanales únicos para potenciar tu
            experiencia en la parrilla. Cada tabla, cada cuchillo, cada utensilio
            lleva el alma del verdadero asado argentino.
          </p>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-[#171718] to-[#0f0f10] border-y-2 border-gray-800/50">
        <div className="max-w-6xl mx-auto px-3 sm:px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="text-center p-4 sm:p-6 bg-[#0a0a0a] border-2 border-gray-800/50 rounded-xl hover:border-orange-500/50 transition-all hover:scale-[1.05]"
              >
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-orange-500 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 font-medium text-sm sm:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-12 sm:py-20 px-3 sm:px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <div className="inline-flex items-center gap-2 mb-4 sm:mb-6 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-2 border-orange-500/20 rounded-xl">
              <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
              <span className="text-orange-400 font-medium text-sm sm:text-base">
                Nuestra Historia
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              De la parrilla a cada mesa
            </h2>

            <div className="space-y-4 sm:space-y-6 text-gray-400 text-base sm:text-lg leading-relaxed">
              <p>
                A la Tabla nació de algo simple: hacer asados entre amigos y notar que casi
                nadie tenía buenas tablas, cuchillos o accesorios que realmente duraran.
                Siempre aparecía la misma charla: “habría que conseguir algo mejor”.
              </p>

              <p>
                Con el tiempo empezamos a probar maderas, diseños y terminaciones por
                nuestra cuenta, buscando piezas resistentes, funcionales y lindas para
                usar todos los fines de semana, no solo para lucirlas una vez.
              </p>

              <p>
                Hoy seguimos con la misma idea de siempre: ofrecer productos bien hechos,
                pensados para la parrilla real, la de todos los días. Sin vueltas, sin
                exageraciones. Cosas que acompañen buenos momentos alrededor del fuego.
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
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-4 sm:p-6 shadow-2xl shadow-orange-500/25 rotate-2">
              <div className="bg-gradient-to-br from-[#171718] to-[#0f0f10] border-2 border-gray-800/50 rounded-xl p-6 sm:p-8 -rotate-2 text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/50">
                  <Award className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 text-white">
                  Experiencia que se nota
                </h3>
                <p className="text-sm sm:text-base text-gray-400">
                  Más de cuatro años diseñando productos pensados para la parrilla real.
                  Funcionales, resistentes y hechos para acompañar muchos fuegos.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 sm:py-20 px-3 sm:px-4 bg-gradient-to-br from-[#171718] to-[#0f0f10] border-y-2 border-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-12 sm:mb-16"
          >
            <div className="inline-flex items-center gap-2 mb-3 sm:mb-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-2 border-orange-500/20 rounded-xl">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
              <span className="text-orange-400 font-medium text-sm sm:text-base">Nuestros Valores</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              Lo que nos <span className="text-orange-500">define</span>
            </h2>
            <p className="text-base sm:text-xl text-gray-400 max-w-3xl mx-auto">
              Cada decisión que tomamos está guiada por estos principios
              fundamentales
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {values.map((value, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-[#0a0a0a] border-2 border-gray-800/50 rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:border-orange-500/50"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6 text-white shadow-lg shadow-orange-500/50">
                  {value.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white">{value.title}</h3>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      {/* <section className="py-20 px-4">
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
      </section> */}

      {/* CTA Section */}
      <section className="py-12 sm:py-20 px-3 sm:px-4 bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-y-2 border-orange-500/20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
            ¿Listo para mejorar tu experiencia en la parrilla?
          </h2>
          <p className="text-base sm:text-xl mb-6 sm:mb-8 text-gray-400">
            Descubre nuestra colección de productos artesanales y lleva tu asado
            al siguiente nivel
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
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
