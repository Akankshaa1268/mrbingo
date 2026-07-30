import React from "react";
import { motion } from "framer-motion";
import { MrBingoCharacter } from "./MrBingoCharacter.jsx";
import { LetterMatchingGame } from "./LetterMatchingGame.jsx";
import { CerebralCarGame } from "./CerebralCarGame.jsx";
import DiagnosticRecorder from "./DiagnosticRecorder.jsx";
import { EmotionGame } from "./EmotionGame.jsx";
import { TypingAdventureGame } from "./TypingAdventureGame.jsx";
import { MemoryGridGame } from "./MemoryGridGame.jsx";
import { StarsJourney } from "./StarsJourney.jsx";
import { getActivityHistory } from "../utils/activityHistory.js";

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
    title: "Dyslexia Screening",
    description: "Match identical letters (b-b). Watch for lookalikes!",
    color: "from-bingo-yellow to-bingo-coral",
    icon: "🧩",
    accent: "bg-bingo-yellow"
  },
  {
    id: "typing",
    title: "Typing Hero",
    description: "Type letters and words to win stars!",
    color: "from-bingo-blue to-bingo-indigo",
    icon: "⌨️",
    accent: "bg-bingo-blue"
  },
  {
    id: "memory",
    title: "Memory Grid",
    description: "Remember the lights and win points!",
    color: "from-emerald-400 to-teal-500",
    icon: "🧠",
    accent: "bg-bingo-mint"
  },
  {
    id: "racer",
    title: "Cerebral Racer",
    description: "Dodge cars and follow the turns!",
    color: "from-bingo-mint to-bingo-blue",
    icon: "🏎️",
    accent: "bg-bingo-coral"
  },
  {
    id: "challenge",
    title: "Daily Challenge",
    description: "A tiny challenge crafted just for today.",
    color: "from-bingo-mint to-bingo-blue",
    icon: "🎯",
    accent: "bg-bingo-indigo"
  },
  {
    id: "diagnostic",
    title: "Focus Diagnostic",
    description: "Test your focus with a fun red dot game!",
    color: "from-purple-400 to-pink-500",
    icon: "👁️",
    accent: "bg-bingo-lavender"
  },
  {
    id: "emotions",
    title: "Emotion Explorer",
    description: "Can you guess the feeling? Fun picture quiz!",
    color: "from-orange-400 to-amber-500",
    icon: "🧐",
    accent: "bg-orange-400"
  },
  {
    id: "stars",
    title: "My Stars",
    description: "See all the shiny stars you’ve earned.",
    color: "from-bingo-lavender to-bingo-blue",
    icon: "⭐",
    accent: "bg-bingo-yellow"

  }
];

export function ChildMode() {
  const [activeGame, setActiveGame] = React.useState(null); // 'letter-match', 'cerebral-racer', 'typing-adventure', 'memory-grid', null
  const [selectedDifficulty, setSelectedDifficulty] = React.useState("EASY");
  const earnedStars = getActivityHistory().reduce((total, item) => {
    const percentage = item.maxScore > 0 ? (item.score / item.maxScore) * 100 : 0;
    return total + (percentage >= 85 ? 3 : percentage >= 60 ? 2 : 1);
  }, 0);
  const journeyLevel = Math.min(8, Math.max(1, Math.floor(earnedStars / 5) + 1));

  const launchGame = (cardId, difficulty) => {
    const routes = {
      adventure: "letter-match",
      racer: "cerebral-racer",
      diagnostic: "diagnostic",
      emotions: "emotion-game",
      typing: "typing-adventure",
      memory: "memory-grid",
      stars: "stars",
    };
    setSelectedDifficulty(difficulty);
    if (routes[cardId]) setActiveGame(routes[cardId]);
  };

  if (activeGame === 'letter-match') {
    return <LetterMatchingGame onBack={() => setActiveGame(null)} initialDifficulty={selectedDifficulty} />;
  }

  if (activeGame === 'cerebral-racer') {
    return <CerebralCarGame onBack={() => setActiveGame(null)} initialDifficulty={selectedDifficulty} />;
  }

  if (activeGame === 'diagnostic') {
    return <DiagnosticRecorder onBack={() => setActiveGame(null)} difficulty={selectedDifficulty} />;
  }

  if (activeGame === 'emotion-game') {
    return <EmotionGame onBack={() => setActiveGame(null)} initialDifficulty={selectedDifficulty} />;
  }

  if (activeGame === 'typing-adventure') {
    return <TypingAdventureGame onBack={() => setActiveGame(null)} difficulty={selectedDifficulty} />;
  }

  if (activeGame === 'memory-grid') {
    return <MemoryGridGame onBack={() => setActiveGame(null)} difficulty={selectedDifficulty} />;
  }

  if (activeGame === 'stars') {
    return <StarsJourney onBack={() => setActiveGame(null)} />;
  }

  return (
    <section
      aria-label="Child learning playground"
      className="relative mx-auto max-w-7xl px-4 py-8 pb-16 lg:py-12"
    >
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,.65fr)]">
        {/* Left: playful controls & cards */}
        <div>
          <p className="toon-kicker mb-4">
            <span className="text-base" aria-hidden="true">
              ✨
            </span>
            Pick your next adventure
          </p>
          <h2 className="mb-3 text-4xl font-bold leading-[0.98] tracking-[-0.03em] text-bingo-navy sm:text-5xl lg:text-6xl">
            What should we
            <span className="block text-bingo-coral">play today?</span>
          </h2>
          <p className="mb-7 max-w-xl text-base font-semibold leading-relaxed text-bingo-navy/70">
            Every challenge is a tiny brain adventure. Choose one big card and Mr. Bingo will be right beside you.
          </p>

          {/* Cards */}
          <div className="relative mx-auto max-w-3xl space-y-6 py-5" aria-label="Learning adventure map">
            <div className="absolute bottom-10 left-1/2 top-10 w-5 -translate-x-1/2 rounded-full bg-gradient-to-b from-bingo-yellow via-bingo-coral to-bingo-indigo opacity-30" />
            {cards.filter((card) => card.id !== "challenge").map((card, i) => (
              <motion.div
                key={card.id}
                className={`relative z-10 flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
                variants={cardVariants}
                initial="initial"
                animate="animate"
                custom={i}
              >
                <div className="toon-card group relative w-[48%] min-w-64 overflow-hidden p-4">
                  <div className={`absolute -right-8 -top-9 h-28 w-28 rounded-full opacity-20 ${card.accent}`} />
                  <div className="relative flex items-center gap-3">
                    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-[3px] border-white bg-gradient-to-br text-3xl shadow-pop-sm ${card.color}`} aria-hidden="true">
                      {card.icon}
                    </div>
                    <div>
                      <p className="font-display text-lg font-bold leading-tight text-bingo-navy">{card.title}</p>
                      <p className="mt-1 text-xs font-semibold text-bingo-navy/55">{card.description}</p>
                    </div>
                  </div>
                  <div className={`relative mt-4 grid gap-2 ${card.id === "stars" ? "grid-cols-1" : "grid-cols-3"}`}>
                    {(card.id === "stars" ? ["OPEN"] : ["EASY", "MEDIUM", "HARD"]).map((level, levelIndex) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => launchGame(card.id, level === "OPEN" ? "EASY" : level)}
                        className={`rounded-xl border-2 border-bingo-navy/10 px-2 py-2 text-[0.65rem] font-extrabold transition hover:-translate-y-0.5 ${levelIndex === 0 ? "bg-bingo-mint/35" : levelIndex === 1 ? "bg-bingo-yellow/60" : "bg-bingo-coral/25"}`}
                      >
                        {level[0] + level.slice(1).toLowerCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Star rewards bar */}
          <div className="mt-6 rounded-3xl border-[3px] border-bingo-navy/10 bg-bingo-yellow px-5 py-4 shadow-pop-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl" aria-hidden="true">
                  ⭐
                </span>
                <div>
                  <p className="font-display text-sm font-bold text-bingo-navy">
                    Today&apos;s Stars
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`inline-block h-4 w-4 rounded-[35%] border border-bingo-navy/10 ${star <= Math.min(5, earnedStars % 5 || (earnedStars ? 5 : 0)) ? "rotate-12 bg-bingo-coral" : "bg-white/70"
                          } shadow-sm`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[0.68rem] font-extrabold uppercase tracking-widest text-bingo-navy/70">
                  Level {journeyLevel}
                </p>
                <div className="mt-1 h-3 w-24 overflow-hidden rounded-full border border-bingo-navy/10 bg-white/60">
                  <div className="h-full rounded-full bg-bingo-mint" style={{ width: `${(earnedStars % 5) * 20}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Mr. Bingo + speech bubble */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="relative w-full max-w-sm rounded-[3rem] border-[4px] border-bingo-navy/10 bg-bingo-blue/30 px-4 pt-4 shadow-pop">
            <MrBingoCharacter />

            {/* Speech bubble */}
            <motion.div
              className="absolute -bottom-10 left-1/2 max-w-xs -translate-x-1/2 rounded-3xl border-[3px] border-bingo-navy/10 bg-white px-5 py-4 font-bold text-bingo-navy shadow-pop-sm sm:-right-8 sm:left-auto sm:translate-x-0"
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

