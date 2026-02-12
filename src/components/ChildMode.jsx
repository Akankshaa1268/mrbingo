import React from "react";
import { motion } from "framer-motion";
import { MrBingoCharacter } from "./MrBingoCharacter.jsx";
import { LetterMatchingGame } from "./LetterMatchingGame.jsx";
import { CerebralCarGame } from "./CerebralCarGame.jsx";
import { TypingAdventureGame } from "./TypingAdventureGame.jsx";
import { MemoryGridGame } from "./MemoryGridGame.jsx";

const cardVariants = {
  initial: { y: 12, opacity: 0 },
  animate: (i) => ({
    y: 0,
    opacity: 1,
    transition: { delay: 0.1 + i * 0.08, duration: 0.5, type: "spring", stiffness: 140 }
  })
};

const cards = [
  {
    id: "adventure",
    title: "Start Adventure",
    description: "Choose a playful path and learn with Mr. Bingo.",
    color: "from-bingo-yellow to-bingo-coral",
    icon: "🌈"
  },
  {
    id: "typing",
    title: "Typing Hero",
    description: "Type letters and words to win stars!",
    color: "from-bingo-blue to-bingo-indigo",
    icon: "⌨️"
  },
  {
    id: "memory",
    title: "Memory Grid",
    description: "Remember the lights and win points!",
    color: "from-emerald-400 to-teal-500",
    icon: "🧠"
  },
  {
    id: "racer",
    title: "Cerebral Racer",
    description: "Dodge cars and follow the turns!",
    color: "from-bingo-mint to-bingo-blue",
    icon: "🏎️"
  }
];

export function ChildMode() {
  const [activeGame, setActiveGame] = React.useState(null); // 'letter-match', 'cerebral-racer', 'typing-adventure', 'memory-grid', null

  if (activeGame === 'letter-match') {
    return <LetterMatchingGame onBack={() => setActiveGame(null)} />;
  }

  if (activeGame === 'cerebral-racer') {
    return <CerebralCarGame onBack={() => setActiveGame(null)} />;
  }

  if (activeGame === 'typing-adventure') {
    return <TypingAdventureGame onBack={() => setActiveGame(null)} />;
  }

  if (activeGame === 'memory-grid') {
    return <MemoryGridGame onBack={() => setActiveGame(null)} />;
  }

  return (
    <section
      aria-label="Child learning playground"
      className="relative max-w-6xl mx-auto px-4 py-8 pb-16 lg:py-12"
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-center">
        {/* Left: playful controls & cards */}
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1 text-xs font-semibold text-bingo-navy shadow-sm mb-3">
            <span className="text-base" aria-hidden="true">
              ✨
            </span>
            Friendly, low-text adventures
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-slate-900 leading-tight mb-2">
            Let&apos;s learn{" "}
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-bingo-coral to-bingo-lavender">
              your way
            </span>
            .
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mb-6 max-w-xl">
            Tap a big, friendly card to start. Mr. Bingo keeps screens calm,
            colourful, and fun—never overwhelming.
          </p>

          {/* Cards */}
          <div
            className="grid gap-4 sm:grid-cols-3"
            aria-label="Main learning actions"
          >
            {cards.map((card, i) => (
              <motion.button
                key={card.id}
                type="button"
                onClick={() => {
                  if (card.id === "adventure") {
                    setActiveGame('letter-match');
                  } else if (card.id === "racer") {
                    setActiveGame('cerebral-racer');
                  } else if (card.id === "typing") {
                    setActiveGame('typing-adventure');
                  } else if (card.id === "memory") {
                    setActiveGame('memory-grid');
                  }
                }}
                className="group relative flex flex-col items-center justify-between rounded-3xl bg-white/90 px-4 py-4 sm:px-3 sm:py-5 shadow-soft border border-white/70 focus:outline-none focus-visible:ring-4 focus-visible:ring-bingo-blue/70"
                variants={cardVariants}
                initial="initial"
                animate="animate"
                custom={i}
              >
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 from-bingo-blue/25 to-bingo-lavender/25" />
                <div className="relative z-10 flex flex-col items-center gap-3">
                  <div
                    className={`flex items-center justify-center w-14 h-14 rounded-3xl bg-gradient-to-br ${card.color} shadow-md text-3xl`}
                    aria-hidden="true"
                  >
                    {card.icon}
                  </div>
                  <div className="text-center">
                    <p className="text-sm sm:text-base font-semibold text-slate-900">
                      {card.title}
                    </p>
                    <p className="mt-1 text-[0.68rem] sm:text-xs text-slate-600">
                      {card.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Star rewards bar */}
          <div className="mt-6 rounded-3xl bg-gradient-to-r from-bingo-yellow/80 via-bingo-mint/80 to-bingo-blue/70 px-4 py-3 shadow-soft border border-white/70">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl" aria-hidden="true">
                  ⭐
                </span>
                <div>
                  <p className="text-xs font-semibold text-bingo-navy">
                    Today&apos;s Stars
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`inline-block w-4 h-4 rounded-full ${star <= 3 ? "bg-amber-400" : "bg-white/60"
                          } shadow-sm`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[0.68rem] uppercase tracking-wide text-bingo-navy/80 font-semibold">
                  Level 2
                </p>
                <div className="mt-1 w-24 h-2 rounded-full bg-white/50 overflow-hidden">
                  <div className="h-full w-2/3 bg-gradient-to-r from-amber-400 to-bingo-coral rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Mr. Bingo + speech bubble */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="relative w-full max-w-sm">
            <MrBingoCharacter />

            {/* Speech bubble */}
            <motion.div
              className="absolute -bottom-10 left-1/2 -translate-x-1/2 sm:-right-8 sm:left-auto sm:translate-x-0 rounded-3xl bg-white/95 px-4 py-3 shadow-soft border border-bingo-blue/50 max-w-xs"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <p className="text-xs sm:text-sm text-slate-800">
                Hi friend! Tap a card and I&apos;ll make a calm little game
                just for you. 🌟
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}



