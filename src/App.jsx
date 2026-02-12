import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MrBingoCharacter } from "./components/MrBingoCharacter.jsx";
import { FloatingBackground } from "./components/FloatingBackground.jsx";
import { ChildMode } from "./components/ChildMode.jsx";
import { ParentDashboard } from "./components/ParentDashboard.jsx";

const MODES = {
  LANDING: "landing",
  CHILD: "child",
  PARENT: "parent"
};

const pageVariants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -14 }
};

function App() {
  const [mode, setMode] = useState(MODES.LANDING);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-bingo-blue/40 via-bingo-mint/30 to-bingo-lavender/40">
      <FloatingBackground />

      {/* App shell */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top nav */}
        <header className="w-full">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-4 pt-4 sm:pt-6">
            <button
              type="button"
              onClick={() => setMode(MODES.LANDING)}
              className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 sm:px-4 sm:py-2 shadow-soft border border-white/80 focus:outline-none focus-visible:ring-4 focus-visible:ring-bingo-blue/70"
            >
              <span
                className="inline-flex items-center justify-center w-7 h-7 rounded-2xl bg-gradient-to-br from-bingo-yellow to-bingo-coral text-lg"
                aria-hidden="true"
              >
                🧠
              </span>
              <div className="text-left">
                <p className="text-xs sm:text-sm leading-none font-extrabold text-slate-900 tracking-tight">
                  Mr. Bingo
                </p>
                <p className="text-[0.6rem] sm:text-[0.65rem] text-slate-500">
                  Gentle AI learning for neurodivergent kids
                </p>
              </div>
            </button>

            <div className="hidden sm:flex items-center gap-2 text-[0.7rem] text-slate-600">
              <span className="rounded-full bg-white/70 px-3 py-1 border border-white/80">
                Inclusive by design
              </span>
              <span className="rounded-full bg-white/70 px-3 py-1 border border-white/80">
                Built with caregivers &amp; therapists
              </span>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {mode === MODES.LANDING && (
              <motion.section
                key="landing"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4 }}
                aria-label="Welcome to Mr. Bingo"
              >
                <div className="max-w-6xl mx-auto px-4 py-10 lg:py-16 grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center">
                  {/* Text column */}
                  <div>
                    <p className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-[0.7rem] font-semibold text-bingo-navy shadow-sm mb-3">
                      <span aria-hidden="true">💫</span>
                      Designed with neurodivergent kids &amp; clinicians
                    </p>
                    <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-slate-900 leading-tight mb-3">
                      A gentle, playful{" "}
                      <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-bingo-coral to-bingo-lavender">
                        AI buddy
                      </span>{" "}
                      for curious brains.
                    </h1>
                    <p className="text-sm sm:text-base text-slate-700 max-w-xl mb-5">
                      Mr. Bingo turns everyday learning into small, predictable
                      adventures—supporting autistic, ADHD, and otherwise
                      neurodivergent children with calm visuals, clear choices,
                      and gamified stars.
                    </p>

                    {/* Mode buttons */}
                    <div
                      className="flex flex-col sm:flex-row gap-3 sm:items-center"
                      aria-label="Choose your experience"
                    >
                      <motion.button
                        type="button"
                        onClick={() => setMode(MODES.CHILD)}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-bingo-yellow to-bingo-coral text-slate-900 font-semibold px-5 py-3 text-sm sm:text-base shadow-soft border border-white/80 focus:outline-none focus-visible:ring-4 focus-visible:ring-bingo-yellow/60"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <span aria-hidden="true" className="text-lg">
                          👶
                        </span>
                        I am a Child
                      </motion.button>

                      <motion.button
                        type="button"
                        onClick={() => setMode(MODES.PARENT)}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-white/90 text-slate-900 font-semibold px-5 py-3 text-sm sm:text-base shadow-soft border border-slate-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-bingo-blue/60"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <span aria-hidden="true" className="text-lg">
                          👩‍⚕️
                        </span>
                        I am a Parent / Therapist
                      </motion.button>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3 text-[0.7rem] text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        No flashing lights or surprise sounds
                      </span>
                      <span>• Star rewards, not streak pressure</span>
                    </div>
                  </div>

                  {/* Character column */}
                  <div className="relative flex justify-center lg:justify-end">
                    <div className="relative w-full max-w-sm">
                      <MrBingoCharacter />

                      {/* Cloud panel behind */}
                      <motion.div
                        className="absolute -z-10 inset-x-4 top-10 bottom-[-1.5rem] rounded-4xl bg-white/80 shadow-soft border border-white/70"
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.5 }}
                      />

                      {/* Floating badges */}
                      <motion.div
                        className="absolute -left-3 sm:-left-6 top-5 rounded-3xl bg-bingo-yellow/90 px-3 py-2 shadow-soft border border-white/80 text-xs sm:text-sm font-semibold text-bingo-navy flex items-center gap-1.5"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25, duration: 0.4 }}
                      >
                        <span aria-hidden="true">⭐</span>
                        Gentle star rewards
                      </motion.div>

                      <motion.div
                        className="absolute -right-3 sm:-right-6 top-20 rounded-3xl bg-bingo-mint/90 px-3 py-2 shadow-soft border border-white/80 text-xs sm:text-sm font-semibold text-bingo-navy flex items-center gap-1.5"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                      >
                        <span aria-hidden="true">🧩</span>
                        Built for different brains
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}

            {mode === MODES.CHILD && (
              <motion.div
                key="child"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.35 }}
              >
                <ChildMode />
              </motion.div>
            )}

            {mode === MODES.PARENT && (
              <motion.div
                key="parent"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.35 }}
              >
                <ParentDashboard />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="w-full pb-4">
          <div className="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2 text-[0.7rem] text-slate-500">
            <p>Made for neurodivergent joy, safety, and calm.</p>
            <p className="flex gap-2">
              <span>Accessible‑first UI</span>
              <span aria-hidden="true">•</span>
              <span>WCAG‑aware colour choices</span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;

