import { motion } from "motion/react";
import museYouLogo from "figma:asset/30d8eb2264f1d14c16f1555f23c2913e56460bad.png";

interface MuseYouLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
}

export function MuseYouLogo({ size = "lg" }: MuseYouLogoProps) {
  const sizes = {
    sm: {
      maxWidth: "max-w-[200px]",
      padding: "p-4",
      glowSize: "w-32 h-32",
    },
    md: {
      maxWidth: "max-w-[300px]",
      padding: "p-6",
      glowSize: "w-40 h-40",
    },
    lg: {
      maxWidth: "max-w-[400px] md:max-w-[500px]",
      padding: "p-8 md:p-10",
      glowSize: "w-56 h-56 md:w-64 md:h-64",
    },
    xl: {
      maxWidth: "max-w-[500px] md:max-w-[600px]",
      padding: "p-10 md:p-12",
      glowSize: "w-64 h-64 md:w-80 md:h-80",
    },
  };

  const currentSize = sizes[size];

  return (
    <motion.div
      className="relative select-none"
      initial={{ opacity: 0, scale: 0.8, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1, type: "spring", bounce: 0.4 }}
    >
      {/* Multi-layer glassmorphism container with gradient */}
      <div className="relative">
        {/* Outer glow layer */}
        <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-emerald-500/30 via-purple-500/30 to-pink-500/30 blur-2xl" />
        
        {/* Main container */}
        <div className={`
          relative backdrop-blur-2xl 
          bg-gradient-to-br from-white/60 via-purple-50/40 to-pink-50/40
          rounded-[2rem] ${currentSize.padding} 
          border-2 border-white/60 
          shadow-[0_8px_32px_0_rgba(236,72,153,0.15),0_8px_32px_0_rgba(139,92,246,0.15),0_8px_32px_0_rgba(16,185,129,0.15)]
          overflow-hidden
        `}>
          {/* Animated gradient overlay */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 via-purple-400/10 to-pink-400/10"
            animate={{
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Decorative corner accents */}
          <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-emerald-400/40 to-transparent rounded-br-full blur-xl" />
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-pink-400/40 to-transparent rounded-bl-full blur-xl" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-gradient-to-t from-purple-400/40 to-transparent rounded-t-full blur-xl" />

          {/* Logo Image with enhanced styling */}
          <motion.div
            className="relative"
            initial={{ scale: 0.7, opacity: 0, rotateY: -20 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
          >
            <img
              src={museYouLogo}
              alt="Muse You"
              className={`w-full h-auto ${currentSize.maxWidth} mx-auto relative z-10`}
              style={{
                filter: "drop-shadow(0 15px 40px rgba(16, 185, 129, 0.25)) drop-shadow(0 10px 30px rgba(139, 92, 246, 0.3)) drop-shadow(0 5px 20px rgba(236, 72, 153, 0.35))",
              }}
            />
          </motion.div>

          {/* Inner shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 2,
            }}
          />
        </div>
      </div>

      {/* Dynamic floating glow orbs */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <motion.div 
          className={`absolute -top-24 -left-24 ${currentSize.glowSize} bg-gradient-to-br from-emerald-500 to-emerald-300 rounded-full blur-3xl opacity-40`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div 
          className={`absolute -top-24 -right-24 ${currentSize.glowSize} bg-gradient-to-bl from-pink-500 to-rose-300 rounded-full blur-3xl opacity-40`}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, -20, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div 
          className={`absolute -bottom-24 left-1/2 -translate-x-1/2 ${currentSize.glowSize} bg-gradient-to-t from-purple-500 to-indigo-300 rounded-full blur-3xl opacity-35`}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.25, 0.5, 0.25],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
      </div>

      {/* Ambient background glow */}
      <motion.div 
        className="absolute inset-0 -z-20 blur-[100px] opacity-20 pointer-events-none"
        animate={{
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-500 via-purple-500 to-pink-500 rounded-full" />
      </motion.div>
    </motion.div>
  );
}