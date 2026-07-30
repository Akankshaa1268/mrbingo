const STORAGE_KEY = "mr-bingo-activity-history-v1";
export const HISTORY_UPDATED_EVENT = "mr-bingo-history-updated";

const SKILL_LABELS = {
  literacy: "Literacy",
  memory: "Memory",
  social: "Emotion Skills",
  attention: "Attention",
  coordination: "Coordination",
};

export function getActivityHistory() {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function recordActivity(activity) {
  if (typeof window === "undefined") return;
  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    completedAt: new Date().toISOString(),
    durationSeconds: 0,
    score: 0,
    maxScore: 100,
    status: "Completed",
    ...activity,
  };
  const next = [entry, ...getActivityHistory()].slice(0, 100);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(HISTORY_UPDATED_EVENT, { detail: entry }));
}

export function summarizeHistory(history = getActivityHistory()) {
  const completed = history.filter((item) => item.status === "Completed");
  const percentages = completed.map((item) =>
    item.maxScore > 0 ? Math.round((Number(item.score) / Number(item.maxScore)) * 100) : 0
  );
  const average = percentages.length
    ? Math.round(percentages.reduce((sum, value) => sum + value, 0) / percentages.length)
    : 0;
  const totalSeconds = completed.reduce(
    (sum, item) => sum + Math.max(0, Number(item.durationSeconds) || 0),
    0
  );
  const bySkill = completed.reduce((groups, item) => {
    const skill = item.skill || "attention";
    const percentage = item.maxScore > 0
      ? Math.round((Number(item.score) / Number(item.maxScore)) * 100)
      : 0;
    if (!groups[skill]) groups[skill] = [];
    groups[skill].push(percentage);
    return groups;
  }, {});
  const skills = Object.entries(bySkill)
    .map(([key, values]) => ({
      key,
      label: SKILL_LABELS[key] || key,
      value: Math.round(values.reduce((sum, value) => sum + value, 0) / values.length),
    }))
    .sort((a, b) => b.value - a.value);

  return {
    sessionCount: completed.length,
    average,
    totalSeconds,
    skills,
    strongestSkill: skills[0] || null,
    focusSkill: [...skills].sort((a, b) => a.value - b.value)[0] || null,
  };
}

export function formatDuration(seconds) {
  const total = Math.max(0, Math.round(Number(seconds) || 0));
  if (total < 60) return `${total}s`;
  const minutes = Math.floor(total / 60);
  const remaining = total % 60;
  return remaining ? `${minutes}m ${remaining}s` : `${minutes}m`;
}

export function formatActivityDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function buildAssistantResponse(text, history = getActivityHistory()) {
  const summary = summarizeHistory(history);
  const lower = text.toLowerCase();
  if (!summary.sessionCount) {
    return "I do not have any completed activities to review yet. Finish a game first, then I can summarize scores, strengths, and useful next steps.";
  }
  if (lower.includes("progress") || lower.includes("report") || lower.includes("doing")) {
    const focus = summary.focusSkill
      ? ` The current practice area is ${summary.focusSkill.label} at ${summary.focusSkill.value}%.`
      : "";
    return `Based on ${summary.sessionCount} completed ${summary.sessionCount === 1 ? "session" : "sessions"}, the average score is ${summary.average}%.${focus}`;
  }
  if (lower.includes("recommend") || lower.includes("next") || lower.includes("practice")) {
    const recommendations = {
      literacy: "Typing Hero or Dyslexia Screening",
      memory: "Memory Grid",
      social: "Emotion Explorer",
      attention: "Focus Diagnostic",
      coordination: "Cerebral Racer",
    };
    const focus = summary.focusSkill;
    return focus
      ? `The history suggests practicing ${focus.label} next. Try ${recommendations[focus.key] || "a short matching activity"}, and keep the session brief and encouraging.`
      : "Try one short activity and return after it is complete so I can make a history-based recommendation.";
  }
  if (lower.includes("best") || lower.includes("strength")) {
    return summary.strongestSkill
      ? `${summary.strongestSkill.label} is currently the strongest measured area at ${summary.strongestSkill.value}%.`
      : "There is not enough history to identify a strength yet.";
  }
  if (lower.includes("last") || lower.includes("recent")) {
    const recent = history[0];
    const percentage = recent.maxScore > 0 ? Math.round((recent.score / recent.maxScore) * 100) : 0;
    return `The latest completed activity was ${recent.activity}, with ${recent.score}/${recent.maxScore} (${percentage}%).`;
  }
  if (lower.includes("iep") || lower.includes("school")) {
    return "I can summarize recorded activity history for a school conversation, but this is not a clinical assessment. Ask me for the progress report or current practice area.";
  }
  return "I answer from recorded activity history. Try asking “How is progress?”, “What should we practice next?”, “What is the strongest skill?”, or “What was the latest result?”";
}
