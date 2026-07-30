import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { formatActivityDate, getActivityHistory } from "../utils/activityHistory.js";

const LEVELS = [
  "Sunny Start", "Bubble Bridge", "Cookie Corner", "Jelly Jungle",
  "Rainbow Road", "Toy Town", "Cloud Castle", "Star Summit",
];

function starsFor(item) {
  const percentage = item.maxScore > 0 ? (item.score / item.maxScore) * 100 : 0;
  if (percentage >= 85) return 3;
  if (percentage >= 60) return 2;
  return 1;
}

export function StarsJourney({ onBack }) {
  const history = useMemo(() => getActivityHistory(), []);
  const totalStars = history.reduce((sum, item) => sum + starsFor(item), 0);
  const unlockedLevels = Math.min(LEVELS.length, Math.max(1, Math.floor(totalStars / 5) + 1));
  const nextTarget = unlockedLevels * 5;

  return (
    <section className="game-shell max-w-5xl">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="toon-kicker mb-3">Your reward journey</p>
          <h2 className="text-5xl font-bold text-bingo-navy">My Stars</h2>
          <p className="mt-2 font-semibold text-bingo-navy/65">
            Earn up to three stars whenever you finish an activity.
          </p>
        </div>
        <button onClick={onBack} className="toon-button-secondary">Back to adventures</button>
      </div>

      <div className="toon-panel mb-8 grid gap-5 bg-bingo-yellow/30 p-6 sm:grid-cols-3">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-bingo-navy/55">Stars earned</p>
          <p className="font-display text-5xl font-bold text-bingo-coral">{totalStars}</p>
        </div>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-bingo-navy/55">Worlds unlocked</p>
          <p className="font-display text-5xl font-bold text-bingo-indigo">{unlockedLevels}</p>
        </div>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-bingo-navy/55">Next world</p>
          <p className="mt-2 font-bold text-bingo-navy">
            {unlockedLevels === LEVELS.length ? "All unlocked!" : `${Math.max(0, nextTarget - totalStars)} more stars`}
          </p>
          <div className="mt-3 h-4 overflow-hidden rounded-full bg-white">
            <div className="h-full rounded-full bg-bingo-mint" style={{ width: `${Math.min(100, ((totalStars % 5) / 5) * 100)}%` }} />
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-2xl space-y-5 py-4">
        <div className="absolute bottom-8 left-1/2 top-8 w-3 -translate-x-1/2 rounded-full bg-bingo-blue/25" />
        {LEVELS.map((name, index) => {
          const unlocked = index < unlockedLevels;
          const left = index % 2 === 0;
          return (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`relative z-10 flex ${left ? "justify-start" : "justify-end"}`}
            >
              <div className={`toon-card flex w-[46%] min-w-40 items-center gap-3 p-4 ${unlocked ? "bg-white" : "bg-slate-100 opacity-60"}`}>
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 font-display text-lg font-bold ${unlocked ? "border-bingo-yellow bg-bingo-coral text-white" : "border-slate-300 bg-slate-200 text-slate-500"}`}>
                  {index + 1}
                </div>
                <div>
                  <p className="font-display font-bold text-bingo-navy">{name}</p>
                  <p className="text-xs font-semibold text-bingo-navy/50">{unlocked ? "Unlocked" : `${index * 5} stars needed`}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="toon-panel mt-8 p-6">
        <h3 className="mb-4 text-xl font-bold text-bingo-navy">Recent stars</h3>
        {history.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {history.slice(0, 6).map((item) => (
              <div key={item.id} className="rounded-2xl bg-bingo-yellow/15 p-4">
                <div className="flex justify-between gap-3">
                  <p className="font-bold text-bingo-navy">{item.activity}</p>
                  <span className="whitespace-nowrap font-bold text-bingo-coral">{starsFor(item)} stars</span>
                </div>
                <p className="mt-1 text-xs font-semibold text-bingo-navy/45">{formatActivityDate(item.completedAt)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-6 text-center font-semibold text-bingo-navy/55">Finish your first activity to earn stars.</p>
        )}
      </div>
    </section>
  );
}
