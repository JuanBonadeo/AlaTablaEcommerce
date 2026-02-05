import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ShoppingCart } from 'lucide-react';

export const ToastNotification = ({ show, message = "Producto agregado al carrito" }: { show: boolean, message?: string }) => {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    role="status"
                    aria-live="polite"
                    className="fixed right-3 sm:right-6 bottom-3 sm:bottom-6 z-50"
                    initial={{ opacity: 0, y: 50, scale: 0.3 }}
                    animate={{ 
                        opacity: 1, 
                        y: 0, 
                        scale: 1,
                    }}
                    exit={{ 
                        opacity: 0, 
                        scale: 0.5, 
                        y: 20,
                        transition: { duration: 0.2 }
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                        mass: 1
                    }}
                >
                    <motion.div 
                        className="bg-gradient-to-br from-[#171718] to-[#0f0f10] border-2 border-green-500/50 px-2 sm:px-6 py-2 sm:py-4 rounded-xl shadow-2xl shadow-green-500/25 flex items-center gap-2 sm:gap-3 backdrop-blur-sm overflow-hidden relative"
                        animate={{
                            boxShadow: [
                                "0 10px 30px -5px rgba(34, 197, 94, 0.25)",
                                "0 10px 40px -5px rgba(34, 197, 94, 0.4)",
                                "0 10px 30px -5px rgba(34, 197, 94, 0.25)"
                            ]
                        }}
                        transition={{
                            boxShadow: {
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }
                        }}
                    >
                        {/* Progress bar animado */}
                        <motion.div 
                            className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-green-500 to-green-400"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 3, ease: "linear" }}
                        />
                        
                        {/* Icono con animación */}
                        <motion.div
                            className="flex-shrink-0 p-1.5 sm:p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg shadow-green-500/50"
                            animate={{
                                rotate: [0, 10, -10, 10, 0],
                                scale: [1, 1.1, 1, 1.1, 1]
                            }}
                            transition={{
                                duration: 0.6,
                                ease: "easeInOut"
                            }}
                        >
                            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </motion.div>

                        {/* Texto */}
                        <motion.span 
                            className="text-green-400 font-medium text-xs sm:text-sm"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            {message}
                        </motion.span>

                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
