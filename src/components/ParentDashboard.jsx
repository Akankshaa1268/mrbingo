import React from "react";
import { motion } from "framer-motion";

const sectionCardClass =
  "bg-white/95 rounded-3xl shadow-soft border border-slate-100 p-4 sm:p-5 h-full flex flex-col";

function PlaceholderChart({ title, description }) {
  return (
    <div className={sectionCardClass} aria-label={title}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-slate-900">
            {title}
          </h3>
          {description && (
            <p className="mt-1 text-xs text-slate-500">{description}</p>
          )}
        </div>
        <span
          className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-[0.65rem] font-semibold text-slate-600"
          aria-hidden="true"
        >
          Preview
        </span>
      </div>
      <div className="mt-1 flex-1 flex items-center justify-center">
        <div className="w-full max-w-xs h-32 sm:h-36 rounded-2xl bg-slate-50 border border-dashed border-slate-200 px-4 py-3 flex flex-col justify-between">
          <div className="flex items-end gap-2 h-16">
            {[40, 72, 56, 84].map((h, idx) => (
              <div
                key={idx}
                className="flex-1 rounded-full bg-gradient-to-t from-sky-200 to-sky-400"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between text-[0.6rem] text-slate-400 mt-1">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
            <span>Sun</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ParentDashboard() {
  return (
    <section
      aria-label="Parent and therapist dashboard"
      className="relative max-w-6xl mx-auto px-4 py-8 pb-16 lg:py-12"
    >
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl lg:rounded-4xl shadow-soft border border-slate-100 overflow-hidden flex flex-col lg:flex-row min-h-[420px]">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-slate-100 bg-gradient-to-b from-sky-50/80 to-slate-50/80">
          <div className="px-5 pt-4 pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                For grown-ups
              </p>
              <p className="text-sm font-semibold text-slate-900 mt-1">
                Mr. Bingo Insights
              </p>
            </div>
            <span
              className="inline-flex items-center justify-center w-9 h-9 rounded-2xl bg-slate-900 text-white text-xs font-semibold"
              aria-hidden="true"
            >
              MB
            </span>
          </div>

          <nav
            className="px-3 py-3 space-y-1 text-sm"
            aria-label="Dashboard sections"
          >
            <button
              type="button"
              className="w-full flex items-center gap-3 rounded-2xl px-3 py-2.5 bg-slate-900 text-white text-xs sm:text-sm font-semibold shadow-sm"
            >
              <span aria-hidden="true">📈</span>
              Child Progress Analytics
            </button>
            <button
              type="button"
              className="w-full flex items-center gap-3 rounded-2xl px-3 py-2.5 text-xs sm:text-sm text-slate-700 hover:bg-slate-100"
            >
              <span aria-hidden="true">📋</span>
              Assigned Activities
            </button>
            <button
              type="button"
              className="w-full flex items-center gap-3 rounded-2xl px-3 py-2.5 text-xs sm:text-sm text-slate-700 hover:bg-slate-100"
            >
              <span aria-hidden="true">📑</span>
              Performance Reports
            </button>
          </nav>

          <div className="px-5 pb-4 pt-2 text-[0.7rem] text-slate-500 space-y-1">
            <p>
              Designed with occupational therapists and neurodivergent adults to
              keep experiences gentle and predictable.
            </p>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-5 lg:p-6 bg-slate-50/60 soft-scrollbar overflow-y-auto">
          <header className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                Today&apos;s overview
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-md">
                Glanceable, privacy‑respecting insights to support your child&apos;s
                regulation, focus, and confidence.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700 border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Calm, low‑stim mode
              </span>
            </div>
          </header>

          <div className="grid gap-4 lg:gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] mb-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <PlaceholderChart
                title="Engagement over the last week"
                description="Time spent in calm focus across key activities."
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
            >
              <div className={sectionCardClass}>
                <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-3">
                  Assigned Activities
                </h3>
                <div className="space-y-2.5 text-xs sm:text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-800">
                        Sensory‑friendly warm‑up
                      </p>
                      <p className="text-[0.7rem] text-slate-500">
                        5‑minute breathing + matching game
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-50 text-emerald-700 px-2 py-1 text-[0.65rem]">
                      Completed
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-800">
                        Communication adventure
                      </p>
                      <p className="text-[0.7rem] text-slate-500">
                        Turn‑taking &amp; simple choices
                      </p>
                    </div>
                    <span className="rounded-full bg-amber-50 text-amber-700 px-2 py-1 text-[0.65rem]">
                      In progress
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-800">
                        Movement break
                      </p>
                      <p className="text-[0.7rem] text-slate-500">
                        Low‑stim stretching with stars
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 text-slate-700 px-2 py-1 text-[0.65rem]">
                      Scheduled
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="grid gap-4 sm:grid-cols-2"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className={sectionCardClass}>
              <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-2">
                Regulation &amp; energy notes
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-3">
                Mr. Bingo gently flags moments of dysregulation so you can
                adjust expectations and supports.
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                <li>
                  • Shorter sessions in the afternoon led to more consistent
                  success.
                </li>
                <li>
                  • Visual countdown timers reduced anxiety during transitions.
                </li>
                <li>
                  • Movement breaks every 10 minutes increased star completion
                  rates.
                </li>
              </ul>
            </div>
            <div className={sectionCardClass}>
              <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-2">
                Performance reports
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-3">
                Exportable summaries for IEP meetings, therapy notes, or sharing
                across care teams.
              </p>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Weekly overview</span>
                  <button
                    type="button"
                    className="text-[0.7rem] font-semibold text-slate-700 px-2 py-1 rounded-full bg-slate-100 hover:bg-slate-200"
                  >
                    Download PDF
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Goal progress snapshot</span>
                  <button
                    type="button"
                    className="text-[0.7rem] font-semibold text-slate-700 px-2 py-1 rounded-full bg-slate-100 hover:bg-slate-200"
                  >
                    Download CSV
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </section>
  );
}

