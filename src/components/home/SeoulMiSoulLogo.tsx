import { motion } from "motion/react";

interface SeoulMiSoulLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
}

export function SeoulMiSoulLogo({ size = "lg" }: SeoulMiSoulLogoProps) {
  const sizes = {
    sm: {
      letterSize: "text-5xl md:text-6xl",
      subText: "text-sm md:text-base",
      spacing: "space-y-2",
      gap: "gap-1",
    },
    md: {
      letterSize: "text-6xl md:text-7xl lg:text-8xl",
      subText: "text-base md:text-lg lg:text-xl",
      spacing: "space-y-3",
      gap: "gap-1 md:gap-2",
    },
    lg: {
      letterSize: "text-7xl md:text-8xl lg:text-9xl",
      subText: "text-lg md:text-xl lg:text-2xl xl:text-3xl",
      spacing: "space-y-4 md:space-y-6",
      gap: "gap-1 md:gap-2",
    },
    xl: {
      letterSize: "text-8xl md:text-9xl",
      subText: "text-xl md:text-2xl lg:text-3xl",
      spacing: "space-y-6 md:space-y-8",
      gap: "gap-2 md:gap-3",
    },
  };

  const currentSize = sizes[size];

  const blackLetterStyle = {
    background: "linear-gradient(135deg, #374151 0%, #1f2937 50%, #374151 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    textShadow: `
      0 4px 12px rgba(0, 0, 0, 0.08),
      0 8px 24px rgba(0, 0, 0, 0.06)
    `,
    filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
  };

  const colorLetterStyle = (color: string, shadowColor: string) => ({
    color: color,
    textShadow: `
      0 2px 8px ${shadowColor},
      0 4px 16px ${shadowColor},
      0 8px 32px ${shadowColor}
    `,
    filter: `drop-shadow(0 4px 12px ${shadowColor})`,
  });

  // Custom components with softer design
  const Heart = () => (
    <svg viewBox="0 0 100 100" className="inline-block w-[0.85em] h-[0.85em] align-baseline" style={{ marginBottom: "0.1em" }}>
      {/* Outer glow */}
      <defs>
        <filter id="heart-glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <path
        d="M50,90 C50,90 10,60 10,35 C10,20 20,10 32,10 C40,10 47,15 50,22 C53,15 60,10 68,10 C80,10 90,20 90,35 C90,60 50,90 50,90 Z"
        fill="currentColor"
        opacity="0.3"
        filter="url(#heart-glow)"
      />
      <path
        d="M50,85 C50,85 18,58 18,35 C18,23 25,16 35,16 C42,16 47,20 50,26 C53,20 58,16 65,16 C75,16 82,23 82,35 C82,58 50,85 50,85 Z"
        fill="currentColor"
      />
      <path
        d="M50,80 C50,80 25,55 25,35 C25,25 30,20 38,20 C44,20 48,23 50,28 C52,23 56,20 62,20 C70,20 75,25 75,35 C75,55 50,80 50,80 Z"
        fill="white"
        opacity="0.6"
      />
    </svg>
  );

  const ExclamationIcon = () => (
    <svg viewBox="0 0 100 140" className="inline-block w-[0.4em] h-[0.85em] align-baseline" style={{ marginBottom: "0.1em" }}>
      <defs>
        <filter id="exclamation-glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="exclamation-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      {/* Triangle with rounded corners effect */}
      <path 
        d="M50,15 L85,75 Q87,80 82,80 L18,80 Q13,80 15,75 Z" 
        fill="url(#exclamation-gradient)"
        filter="url(#exclamation-glow)"
      />
      {/* Circle */}
      <circle cx="50" cy="115" r="18" fill="url(#exclamation-gradient)" filter="url(#exclamation-glow)" />
      {/* Highlights */}
      <path d="M50,20 L80,70 L20,70 Z" fill="white" opacity="0.3" />
      <circle cx="50" cy="115" r="12" fill="white" opacity="0.4" />
    </svg>
  );

  const SmileU = () => (
    <svg viewBox="0 0 100 100" className="inline-block w-[0.85em] h-[0.85em] align-baseline" style={{ marginBottom: "0.1em" }}>
      <defs>
        <filter id="smile-glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="smile-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.85" />
        </linearGradient>
      </defs>
      {/* U shape with rounded edges */}
      <path
        d="M 20,10 L 20,55 Q 20,85 50,85 Q 80,85 80,55 L 80,10 Q 80,8 78,8 L 68,8 Q 66,8 66,10 L 66,55 Q 66,72 50,72 Q 34,72 34,55 L 34,10 Q 34,8 32,8 L 22,8 Q 20,8 20,10 Z"
        fill="url(#smile-gradient)"
        filter="url(#smile-glow)"
      />
      {/* Inner smile grid with softer edges */}
      <rect x="37" y="35" width="9" height="28" fill="white" opacity="0.7" rx="3" />
      <rect x="54" y="35" width="9" height="28" fill="white" opacity="0.7" rx="3" />
      <rect x="35" y="48" width="30" height="7" fill="white" opacity="0.7" rx="3" />
      {/* Highlight */}
      <path d="M 25,12 L 25,55 Q 25,78 50,78 Q 75,78 75,55 L 75,12" fill="white" opacity="0.2" />
    </svg>
  );

  return (
    <div className={`relative select-none ${currentSize.spacing} max-w-full`}>
      {/* Glassmorphism container */}
      <div className="relative backdrop-blur-sm bg-gradient-to-br from-white/40 via-purple-50/30 to-pink-50/30 rounded-3xl p-6 md:p-10 lg:p-12 border border-white/50 shadow-2xl">
        {/* Decorative glow orbs */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-emerald-400/20 rounded-full blur-3xl" />
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-pink-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-60 h-60 bg-purple-400/15 rounded-full blur-3xl" />

        {/* First Line: SEOUL */}
        <div className={`flex items-center justify-center ${currentSize.gap} flex-wrap`}>
          <motion.span
            className={`${currentSize.letterSize} inline-block`}
            style={{
              ...colorLetterStyle("#10d9a1", "rgba(16, 217, 161, 0.4)"),
              fontFamily: "system-ui, -apple-system, 'Segoe UI', Arial, sans-serif",
              letterSpacing: "-0.02em",
            }}
            initial={{ opacity: 0, y: -30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.6, type: "spring", bounce: 0.4 }}
            whileHover={{ scale: 1.1, rotate: -5 }}
          >
            S
          </motion.span>
          <motion.span
            className={`${currentSize.letterSize} inline-block`}
            style={{
              ...blackLetterStyle,
              fontFamily: "system-ui, -apple-system, 'Segoe UI', Arial, sans-serif",
              letterSpacing: "-0.02em",
            }}
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
          >
            E
          </motion.span>
          <motion.span
            className={`${currentSize.letterSize} inline-block`}
            style={{
              ...colorLetterStyle("#ff4d8f", "rgba(255, 77, 143, 0.5)"),
            }}
            initial={{ opacity: 0, scale: 0, rotate: -45 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, duration: 0.7, type: "spring", bounce: 0.5 }}
            whileHover={{ scale: 1.2, rotate: 10 }}
          >
            <Heart />
          </motion.span>
          <motion.span
            className={`${currentSize.letterSize} inline-block`}
            style={{
              ...blackLetterStyle,
              fontFamily: "system-ui, -apple-system, 'Segoe UI', Arial, sans-serif",
              letterSpacing: "-0.02em",
            }}
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
          >
            U
          </motion.span>
          <motion.span
            className={`${currentSize.letterSize} inline-block`}
            style={{
              ...blackLetterStyle,
              fontFamily: "system-ui, -apple-system, 'Segoe UI', Arial, sans-serif",
              letterSpacing: "-0.02em",
            }}
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
          >
            L
          </motion.span>
        </div>

        {/* Second Line: MI SOUL */}
        <div className={`flex items-center justify-center ${currentSize.gap} flex-wrap mt-2 md:mt-4`}>
          <motion.span
            className={`${currentSize.letterSize} inline-block`}
            style={{
              ...blackLetterStyle,
              fontFamily: "system-ui, -apple-system, 'Segoe UI', Arial, sans-serif",
              letterSpacing: "-0.02em",
            }}
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
          >
            M
          </motion.span>
          <motion.span
            className={`${currentSize.letterSize} inline-block`}
            style={{
              ...colorLetterStyle("#ffc107", "rgba(255, 193, 7, 0.5)"),
            }}
            initial={{ opacity: 0, y: -40, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.45, duration: 0.7, type: "spring", bounce: 0.6 }}
            whileHover={{ scale: 1.2, y: -5 }}
          >
            <ExclamationIcon />
          </motion.span>
          <motion.span className={`${currentSize.letterSize} inline-block`} style={{ width: "0.3em" }} />
          <motion.span
            className={`${currentSize.letterSize} inline-block`}
            style={{
              ...blackLetterStyle,
              fontFamily: "system-ui, -apple-system, 'Segoe UI', Arial, sans-serif",
              letterSpacing: "-0.02em",
            }}
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
          >
            S
          </motion.span>
          <motion.span
            className={`${currentSize.letterSize} inline-block`}
            style={{
              ...blackLetterStyle,
              fontFamily: "system-ui, -apple-system, 'Segoe UI', Arial, sans-serif",
              letterSpacing: "-0.02em",
            }}
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
          >
            O
          </motion.span>
          <motion.span
            className={`${currentSize.letterSize} inline-block`}
            style={{
              ...colorLetterStyle("#3b9eff", "rgba(59, 158, 255, 0.5)"),
            }}
            initial={{ opacity: 0, scale: 0, rotate: 180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.65, duration: 0.7, type: "spring", bounce: 0.5 }}
            whileHover={{ scale: 1.2, rotate: 10 }}
          >
            <SmileU />
          </motion.span>
          <motion.span
            className={`${currentSize.letterSize} inline-block`}
            style={{
              ...blackLetterStyle,
              fontFamily: "system-ui, -apple-system, 'Segoe UI', Arial, sans-serif",
              letterSpacing: "-0.02em",
            }}
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
          >
            L
          </motion.span>
        </div>

        {/* Korean Subtitle */}
        <motion.div
          className="text-center mt-4 md:mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <p
            className={`${currentSize.subText}`}
            style={{
              background: "linear-gradient(135deg, #6b7280 0%, #4b5563 50%, #6b7280 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontFamily: "system-ui, -apple-system, 'Malgun Gothic', sans-serif",
              letterSpacing: "0.03em",
              filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
            }}
          >
            마음이 모이면 서울이 됩니다
          </p>
        </motion.div>
      </div>
    </div>
  );
}
