import React from "react";
import { motion } from "framer-motion";

const floatTransition = {
  duration: 3.2,
  repeat: Infinity,
  repeatType: "reverse",
  ease: "easeInOut"
};

export function MrBingoCharacter({ size = "lg" }) {
  const baseSize = size === "lg" ? "w-56 h-56" : "w-32 h-32";

  return (
    <motion.div
      aria-label="Mr. Bingo, your friendly learning buddy"
      role="img"
      className={`relative ${baseSize} rounded-full bg-gradient-to-br from-bingo-blue via-bingo-mint to-bingo-lavender shadow-soft flex items-center justify-center border-4 border-white`}
      animate={{ y: [0, -14, 0] }}
      transition={floatTransition}
    >
      {/* Face */}
      <div className="relative w-[78%] h-[78%] rounded-full bg-white/90 flex flex-col items-center justify-center shadow-inner">
        {/* Eyes */}
        <div className="flex items-center justify-between w-[70%] mb-3">
          <motion.div
            className="w-8 h-8 bg-bingo-blue rounded-full flex items-center justify-center overflow-hidden"
            animate={{ y: [0, -2, 0] }}
            transition={floatTransition}
          >
            <div className="w-4 h-4 bg-slate-900 rounded-full translate-x-[2px] translate-y-[2px]" />
          </motion.div>
          <motion.div
            className="w-8 h-8 bg-bingo-blue rounded-full flex items-center justify-center overflow-hidden"
            animate={{ y: [0, -1, 0] }}
            transition={floatTransition}
          >
            <div className="w-4 h-4 bg-slate-900 rounded-full translate-x-[1px] translate-y-[2px]" />
          </motion.div>
        </div>

        {/* Blush */}
        <div className="flex gap-8 mb-1">
          <div className="w-6 h-3 rounded-full bg-bingo-coral/60 blur-[1px]" />
          <div className="w-6 h-3 rounded-full bg-bingo-coral/60 blur-[1px]" />
        </div>

        {/* Mouth */}
        <div className="w-12 h-6 rounded-b-full border-[3px] border-t-0 border-bingo-coral mt-1 flex items-center justify-center bg-gradient-to-b from-transparent to-bingo-coral/15">
          <div className="w-4 h-3 bg-bingo-coral rounded-b-full" />
        </div>
      </div>

      {/* Top antenna */}
      <motion.div
        className="absolute -top-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        animate={{ y: [0, -4, 0] }}
        transition={floatTransition}
      >
        <div className="w-7 h-7 rounded-2xl bg-bingo-yellow shadow-md border-2 border-white" />
        <div className="w-1 h-4 bg-white rounded-full" />
      </motion.div>

      {/* Decorative sparkles */}
      <motion.div
        className="absolute -right-6 top-6 w-7 h-7 rounded-2xl bg-bingo-lavender shadow-md border-2 border-white"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ ...floatTransition, duration: 2.6 }}
      />
      <motion.div
        className="absolute -left-5 bottom-5 w-5 h-5 rounded-2xl bg-bingo-mint shadow-md border-2 border-white"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ ...floatTransition, duration: 2.1 }}
      />
    </motion.div>
  );
}

