import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const sizes = {
  sm: {
    shell: "w-36 h-44",
    head: "w-24 h-[5.5rem]",
    eyes: "w-7 h-8",
    body: "w-[4.6rem] h-14"
  },
  lg: {
    shell: "w-72 h-[22rem]",
    head: "w-52 h-44",
    eyes: "w-12 h-14",
    body: "w-36 h-28"
  }
};

export function MrBingoCharacter({ size = "lg", mood = "happy" }) {
  const { isSummer } = useTheme();
  const scale = size === "lg" ? sizes.lg : sizes.sm;
  const isSmall = size !== "lg";
  const faceGradient = isSummer
    ? "from-[#ffd33d] via-[#ff9f43] to-[#ff5b74]"
    : "from-[#61d7ff] via-[#7c8cff] to-[#b276ff]";
  const bodyGradient = isSummer
    ? "from-[#ff7b4d] to-[#ff4e44]"
    : "from-[#6f75ff] to-[#8f56e8]";

  return (
    <motion.div
      aria-label={`Mr. Bingo, your ${mood} learning buddy`}
      role="img"
      className={`relative ${scale.shell} mx-auto flex flex-col items-center justify-end`}
      animate={{ y: [0, -7, 0], rotate: [0, -0.7, 0.7, 0] }}
      transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="absolute inset-x-6 top-10 bottom-4 rounded-[45%] bg-bingo-yellow/30 blur-3xl" />
      <motion.span
        className={`absolute ${isSmall ? "right-1 top-8 text-lg" : "-right-1 top-10 text-3xl"} text-bingo-yellow drop-shadow`}
        animate={{ scale: [0.8, 1.18, 0.8], rotate: [0, 18, 0] }}
        transition={{ duration: 2.6, repeat: Infinity }}
      >
        ✦
      </motion.span>

      <div className="relative z-20 flex flex-col items-center">
        <motion.div
          className={`absolute ${isSmall ? "-top-7" : "-top-11"} z-0 flex flex-col items-center`}
          animate={{ rotate: [-7, 7, -7] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className={`${isSmall ? "h-4 w-4" : "h-7 w-7"} rounded-full border-[3px] border-white bg-bingo-yellow shadow-pop-sm`} />
          <div className={`${isSmall ? "h-3 w-1" : "h-6 w-2"} rounded-full bg-bingo-navy/40`} />
        </motion.div>

        <div className={`relative ${scale.head} z-10 overflow-hidden rounded-[38%_42%_36%_40%] border-[5px] border-white bg-gradient-to-br ${faceGradient} shadow-[0_10px_0_rgba(31,35,69,.16),inset_12px_14px_22px_rgba(255,255,255,.48),inset_-12px_-14px_20px_rgba(31,35,69,.13)]`}>
          <div className="absolute left-[12%] top-[8%] h-[22%] w-[45%] -rotate-12 rounded-full bg-white/45 blur-sm" />
          <div className={`absolute inset-0 flex items-center justify-center ${isSmall ? "pt-3" : "pt-5"}`}>
            <div className={`flex ${isSmall ? "gap-2" : "gap-5"}`}>
              {[0, 1].map((eye) => (
                <motion.div
                  key={eye}
                  className={`relative ${scale.eyes} overflow-hidden rounded-[48%] border-[3px] border-white/80 bg-bingo-navy shadow-inner`}
                  animate={{ scaleY: [1, 1, 0.08, 1, 1] }}
                  transition={{ duration: 4.6, repeat: Infinity, times: [0, 0.42, 0.45, 0.48, 1], delay: eye * 0.04 }}
                >
                  <div className={`absolute ${isSmall ? "right-1 top-1 h-2 w-2" : "right-2 top-2 h-4 w-4"} rounded-full bg-white`} />
                  <div className={`absolute ${isSmall ? "bottom-1 left-2 h-1 w-1" : "bottom-2 left-3 h-2 w-2"} rounded-full bg-bingo-blue`} />
                </motion.div>
              ))}
            </div>
          </div>
          <div className={`absolute ${isSmall ? "bottom-4 left-4 h-2 w-4" : "bottom-9 left-7 h-3 w-7"} rounded-full bg-bingo-coral/55 blur-[2px]`} />
          <div className={`absolute ${isSmall ? "bottom-4 right-4 h-2 w-4" : "bottom-9 right-7 h-3 w-7"} rounded-full bg-bingo-coral/55 blur-[2px]`} />
          <div className={`absolute left-1/2 -translate-x-1/2 overflow-hidden bg-bingo-navy ${isSmall ? "bottom-4 h-3 w-5 rounded-b-full" : "bottom-8 h-5 w-9 rounded-b-[1.5rem]"}`}>
            <div className="absolute -bottom-1 left-1/2 h-3 w-5 -translate-x-1/2 rounded-full bg-bingo-coral" />
          </div>
        </div>
      </div>

      <div className={`relative z-10 ${isSmall ? "-mt-3" : "-mt-7"}`}>
        <div className={`relative ${scale.body} rounded-[42%_42%_34%_34%] border-[5px] border-white bg-gradient-to-b ${bodyGradient} shadow-[0_9px_0_rgba(31,35,69,.17),inset_8px_10px_14px_rgba(255,255,255,.32)]`}>
          <div className={`absolute left-1/2 -translate-x-1/2 rounded-full border-2 border-white/60 bg-bingo-yellow text-center font-display font-bold text-bingo-navy shadow-inner ${isSmall ? "top-3 h-7 w-7 text-sm leading-6" : "top-6 h-12 w-12 text-2xl leading-[2.6rem]"}`}>
            B
          </div>
        </div>
        <motion.div
          className={`absolute origin-top-right rounded-full border-[3px] border-white bg-bingo-indigo shadow-pop-sm ${isSmall ? "-left-3 top-3 h-9 w-3" : "-left-5 top-6 h-16 w-6"}`}
          animate={{ rotate: [10, -5, 10] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className={`absolute origin-bottom-left rounded-full border-[3px] border-white bg-bingo-indigo shadow-pop-sm ${isSmall ? "-right-4 top-0 h-11 w-3" : "-right-7 top-1 h-20 w-6"}`}
          animate={{ rotate: [-12, 28, -12] }}
          transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className={`absolute rounded-b-2xl border-[3px] border-white bg-bingo-navy ${isSmall ? "-bottom-3 left-3 h-5 w-4" : "-bottom-5 left-7 h-8 w-7"}`} />
        <div className={`absolute rounded-b-2xl border-[3px] border-white bg-bingo-navy ${isSmall ? "-bottom-3 right-3 h-5 w-4" : "-bottom-5 right-7 h-8 w-7"}`} />
      </div>

      <div className={`absolute bottom-0 rounded-[100%] bg-bingo-navy/15 blur-md ${isSmall ? "h-3 w-20" : "h-5 w-40"}`} />
    </motion.div>
  );
}
