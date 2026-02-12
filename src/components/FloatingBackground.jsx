import React from "react";
import { motion } from "framer-motion";

const float = (delay = 0, distance = 18, duration = 8) => ({
  animate: { y: [0, -distance, 0] },
  transition: {
    duration,
    delay,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut"
  }
});

export function FloatingBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Soft blobs */}
      <motion.div
        className="absolute -top-40 -left-28 w-80 h-80 bg-bingo-blue/60 blur-3xl rounded-full"
        {...float(0, 24, 18)}
      />
      <motion.div
        className="absolute -bottom-32 -right-24 w-80 h-80 bg-bingo-lavender/70 blur-3xl rounded-full"
        {...float(2, 26, 16)}
      />
      <motion.div
        className="absolute top-40 -right-10 w-64 h-64 bg-bingo-mint/60 blur-3xl rounded-full"
        {...float(1, 20, 14)}
      />

      {/* Stars and clouds */}
      <motion.div
        className="absolute top-10 left-10 text-yellow-300 text-2xl"
        {...float(0.4, 12, 10)}
      >
        ✨
      </motion.div>
      <motion.div
        className="absolute top-28 right-16 text-yellow-200 text-3xl"
        {...float(0.9, 14, 11)}
      >
        ⭐
      </motion.div>
      <motion.div
        className="absolute bottom-24 left-14 text-sky-100 text-4xl"
        {...float(0.6, 10, 13)}
      >
        ☁️
      </motion.div>
      <motion.div
        className="absolute bottom-10 right-24 text-sky-100 text-4xl"
        {...float(1.2, 10, 12)}
      >
        ☁️
      </motion.div>
    </div>
  );
}

