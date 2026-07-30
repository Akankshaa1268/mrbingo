import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const shapes = [
  { id: "star-a", icon: "★", className: "left-[5%] top-[16%] text-bingo-yellow text-3xl", delay: 0 },
  { id: "bolt", icon: "⚡", className: "right-[7%] top-[13%] text-bingo-coral text-3xl", delay: 0.8 },
  { id: "star-b", icon: "✦", className: "left-[12%] top-[58%] text-bingo-blue text-2xl", delay: 1.2 },
  { id: "plus", icon: "✚", className: "right-[12%] top-[62%] text-bingo-mint text-2xl", delay: 0.35 },
  { id: "ring", icon: "◉", className: "left-[42%] top-[10%] text-bingo-lavender text-xl", delay: 1.7 }
];

export function FloatingBackground() {
  const { isSummer } = useTheme();

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden">
      <div className={`absolute -left-28 top-24 h-72 w-72 rounded-full border-[42px] ${isSummer ? "border-bingo-yellow/20" : "border-bingo-coral/15"}`} />
      <div className={`absolute -right-36 top-1/3 h-96 w-96 rounded-full border-[56px] ${isSummer ? "border-bingo-blue/20" : "border-bingo-blue/15"}`} />
      <svg className="absolute bottom-0 left-0 w-full text-bingo-mint/15" viewBox="0 0 1440 250" preserveAspectRatio="none">
        <path fill="currentColor" d="M0 158C170 87 280 214 452 151s286-43 414 13 278-59 574-18v104H0Z" />
      </svg>
      {shapes.map((shape) => (
        <motion.span
          key={shape.id}
          className={`absolute font-display opacity-70 ${shape.className}`}
          animate={{ y: [0, -9, 0], rotate: [-4, 5, -4] }}
          transition={{ duration: 5.5, delay: shape.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          {shape.icon}
        </motion.span>
      ))}
      <div className="absolute left-[7%] top-[33%] h-3 w-16 -rotate-12 rounded-full bg-bingo-coral/20" />
      <div className="absolute right-[18%] top-[38%] h-3 w-20 rotate-6 rounded-full bg-bingo-yellow/25" />
    </div>
  );
}
