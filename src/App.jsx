import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MrBingoCharacter } from "./components/MrBingoCharacter.jsx";
import { FloatingBackground } from "./components/FloatingBackground.jsx";
import { ChildMode } from "./components/ChildMode.jsx";
import { ParentDashboard } from "./components/ParentDashboard.jsx";
import { ThemeProvider, useTheme } from "./context/ThemeContext.jsx";

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

function ThemeToggle() {
  const { isSummer, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative h-11 w-[4.5rem] rounded-full border-[3px] border-bingo-navy/15 p-1 shadow-pop-sm transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-bingo-blue/45 ${isSummer ? "bg-bingo-blue" : "bg-bingo-lavender"}`}
      aria-label={`Switch to ${isSummer ? "candy" : "sunny"} theme`}
      aria-pressed={isSummer}
    >
      <motion.span
        className="flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm"
        animate={{ x: isSummer ? 27 : 0 }}
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
      >
        <span className={`h-3 w-3 rounded-full ${isSummer ? "bg-bingo-yellow" : "bg-bingo-indigo"}`} />
      </motion.span>
    </button>
  );
}

function AppContent() {
  const [mode, setMode] = useState(MODES.LANDING);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <FloatingBackground />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="w-full">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 pt-4 sm:pt-6">
            <button
              type="button"
              onClick={() => setMode(MODES.LANDING)}
              className="group flex items-center gap-3 rounded-full border-[3px] border-bingo-navy/10 bg-white px-3 py-2 shadow-pop-sm transition hover:-rotate-1 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-bingo-blue/50"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-bingo-yellow font-display text-xl font-bold text-bingo-navy shadow-inner" aria-hidden="true">
                B!
              </span>
              <div className="text-left">
                <p className="font-display text-base font-bold leading-none text-bingo-navy">Mr. Bingo</p>
              </div>
            </button>

            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col justify-center">
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
                <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,.95fr)] lg:gap-12 lg:py-16">
                  <div className="relative z-20">
                    <p className="toon-kicker mb-5">
                      A playful place for every kind of brain
                    </p>
                    <h1 className="max-w-3xl text-[3.15rem] font-bold leading-[0.93] tracking-[-0.045em] text-bingo-navy sm:text-6xl lg:text-[5.25rem]">
                      Learn big.
                      <span className="relative block w-fit text-bingo-coral">
                        Play bigger!
                        <svg className="absolute -bottom-3 left-0 w-full text-bingo-yellow" viewBox="0 0 320 16" preserveAspectRatio="none" aria-hidden="true">
                          <path d="M5 10C85 1 232 3 315 8" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
                        </svg>
                      </span>
                    </h1>
                    <p className="mt-8 max-w-xl text-base font-semibold leading-relaxed text-bingo-navy/75 sm:text-lg">
                      Join Mr. Bingo for colorful, confidence-building adventures made for curious kids—including autistic, ADHD, and neurodivergent learners.
                    </p>

                    <div className="mt-7 flex flex-col gap-3 sm:flex-row" aria-label="Choose your experience">
                      <motion.button
                        type="button"
                        onClick={() => setMode(MODES.CHILD)}
                        className="toon-button-primary px-7 py-4 text-base"
                        whileHover={{ rotate: -1.5, scale: 1.025 }}
                        whileTap={{ scale: 0.96, y: 5 }}
                      >
                        Start my adventure
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={() => setMode(MODES.PARENT)}
                        className="toon-button-secondary px-7 py-4 text-base"
                        whileHover={{ rotate: 1, scale: 1.02 }}
                        whileTap={{ scale: 0.96, y: 5 }}
                      >
                        Grown-up space
                      </motion.button>
                    </div>
                  </div>

                  <div className="relative flex min-h-[430px] items-center justify-center lg:justify-end">
                    <div className="absolute bottom-5 left-1/2 h-12 w-72 -translate-x-1/2 rounded-[50%] bg-bingo-navy/10 blur-lg" />
                    <div className="relative z-10 pt-7">
                      <MrBingoCharacter />
                    </div>

                    <motion.div
                      className="absolute left-0 top-10 z-20 rounded-2xl border-[3px] border-bingo-navy/10 bg-bingo-yellow px-4 py-3 font-display text-sm font-bold text-bingo-navy shadow-pop-sm sm:left-2"
                      initial={{ opacity: 0, x: -15, rotate: -5 }}
                      animate={{ opacity: 1, x: 0, rotate: -4 }}
                      transition={{ delay: 0.35 }}
                    >
                      High-five rewards
                    </motion.div>
                    <motion.div
                      className="absolute bottom-8 right-0 z-20 max-w-[13rem] rounded-2xl border-[3px] border-bingo-navy/10 bg-white px-4 py-3 text-sm font-extrabold text-bingo-navy shadow-pop-sm sm:right-2"
                      initial={{ opacity: 0, x: 15, rotate: 4 }}
                      animate={{ opacity: 1, x: 0, rotate: 3 }}
                      transition={{ delay: 0.42 }}
                    >
                      Ready when you are
                    </motion.div>
                  </div>
                </div>
              </motion.section>
            )}

            {mode === MODES.CHILD && (
              <motion.div key="child" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35 }}>
                <ChildMode />
              </motion.div>
            )}

            {mode === MODES.PARENT && (
              <motion.div key="parent" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35 }}>
                <ParentDashboard />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
