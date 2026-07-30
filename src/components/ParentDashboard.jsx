import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  buildAssistantResponse,
  formatActivityDate,
  formatDuration,
  getActivityHistory,
  HISTORY_UPDATED_EVENT,
  summarizeHistory,
} from "../utils/activityHistory.js";

// --- Mock Data for Dashboard ---

const SUMMARY_STATS = [
  { title: "Overall Progress", value: "78%", sub: "+12% this week", color: "from-bingo-blue/40 to-bingo-blue/10", iconType: "progress" },
  { title: "Skills Mastered", value: "14", sub: "Trending up", color: "from-bingo-mint/40 to-bingo-mint/10", iconType: "trend" },
  { title: "Focus Area", value: "Social Skills", sub: "needs support", color: "from-bingo-yellow/60 to-bingo-yellow/20", iconType: "focus", isSoftWarning: true },
  { title: "Time Spent", value: "4h 30m", sub: "Daily avg: 45m", color: "from-bingo-lavender/40 to-bingo-lavender/10", iconType: "time" },
];

const SKILL_BREAKDOWN = [
  { label: "Reading", value: 85, color: "bg-bingo-coral" },
  { label: "Math", value: 65, color: "bg-bingo-yellow" },
  { label: "Logic", value: 75, color: "bg-bingo-mint" },
  { label: "Creativity", value: 90, color: "bg-bingo-lavender" },
  { label: "Communication", value: 60, color: "bg-bingo-blue" },
];

const RECENT_ACTIVITY = [
  { id: 1, date: "Today, 10:30 AM", activity: "Emotion Recognition", score: "8/10", time: "15m", status: "Completed" },
  { id: 2, date: "Yesterday, 4:15 PM", activity: "Pattern Matching", score: "10/10", time: "12m", status: "Completed" },
  { id: 3, date: "Yesterday, 3:00 PM", activity: "Social Stories", score: "5/10", time: "20m", status: "Needs Revision" },
  { id: 4, date: "Mon, 5:30 PM", activity: "Calm Breathing", score: "-", time: "5m", status: "Completed" },
];

const CHILD_PROFILE = {
  name: "Leo",
  age: 7,
  grade: "2nd Grade",
  style: "Visual Learner",
  strength: "Pattern Recognition",
  goal: "Social Referencing",
  mood: "Calm & Focused",
};

// --- Existing Mock Data (Preserved) ---

const COMMUNITIES = [
  { id: 1, name: "2-4 Years (Girls) - Autism", members: 1240 },
  { id: 2, name: "2-4 Years (Boys) - Autism", members: 3400 },
  { id: 3, name: "Non-verbal Support", members: 890 },
  { id: 4, name: "Sensory Processing", members: 1560 },
  { id: 5, name: "Speech Delay Heroes", members: 2100 },
];

const VENT_POSTS = [
  { id: 1, text: "Some days are just hard. The sensory overload was real today, but we made it through.", time: "2h ago", likes: 12 },
  { id: 2, text: "Small win: We tried a new food today and no meltdown! Celebrating the little things.", time: "5h ago", likes: 45 },
  { id: 3, text: "Exhausted but hopeful. The new routine seems to be helping with sleep.", time: "1d ago", likes: 28 },
];

const ACTIVITY_PLANS = [
  { id: 1, title: "Morning Routine Builder", desc: "Visual steps for a calm start.", duration: "10 mins" },
  { id: 2, title: "Sensory Regulation Break", desc: "Heavy work and calming input.", duration: "5 mins" },
  { id: 3, title: "Bedtime Wind-down", desc: "Low-stim activities for sleep.", duration: "20 mins" },
  { id: 4, title: "Social Story: Sharing", desc: "Practice taking turns.", duration: "15 mins" },
];

const THERAPISTS = [
  { id: 1, name: "Dr. Sarah Miller", role: "Occupational Therapist", rating: 4.9, location: "New York, NY", isOnline: true },
  { id: 2, name: "Mark Wilson", role: "Speech Therapist", rating: 4.8, location: "Brooklyn, NY", isOnline: false },
  { id: 3, name: "Emily Chen", role: "Child Psychologist", rating: 5.0, location: "Online", isOnline: true },
  { id: 4, name: "David Ross", role: "Behavioral Therapist", rating: 4.7, location: "Queens, NY", isOnline: false },
];

// --- SVG Icons Components ---

function IconTrendUp() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
      <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
  );
}

function IconTime() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  );
}

function IconFocus() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}

function IconUser() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
}

function IconChart() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"></line>
      <line x1="12" y1="20" x2="12" y2="4"></line>
      <line x1="6" y1="20" x2="6" y2="14"></line>
    </svg>
  );
}

function IconBell() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
    </svg>
  );
}


// --- Sub-Components ---

function SummaryCard({ title, value, sub, color, iconType, isSoftWarning }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`relative flex min-h-[145px] flex-col justify-between overflow-hidden rounded-3xl border-[3px] border-bingo-navy/10 bg-gradient-to-br p-5 shadow-pop-sm ${color}`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
        <div className={`p-2 rounded-full bg-white/40 text-slate-700`}>
          {iconType === 'trend' && <IconTrendUp />}
          {iconType === 'time' && <IconTime />}
          {iconType === 'focus' && <IconFocus />}
          {iconType === 'progress' && (
            <div className="w-5 h-5 rounded-full border-2 border-slate-700 border-t-transparent animate-spin-slow" />
          )}
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className={`text-xs mt-1 font-medium ${isSoftWarning ? 'text-amber-700' : 'text-slate-600'}`}>
          {sub}
        </p>
      </div>
    </motion.div>
  );
}

function LearningChart({ history }) {
  // Simple SVG Line Chart
  const values = [...history]
    .reverse()
    .slice(-8)
    .map((item) => item.maxScore > 0 ? Math.round((item.score / item.maxScore) * 100) : 0);
  const points = values.length > 1 ? values : [values[0] || 0, values[0] || 0];
  const width = 100; // viewbox units
  const height = 50;

  // Create path
  let pathD = `M 0 ${height - points[0] / 2}`;
  points.forEach((p, i) => {
    const x = (i / (points.length - 1)) * width;
    const y = height - (p / 2);
    pathD += ` L ${x} ${y}`;
  });

  return (
    <div className="w-full h-48 sm:h-64 relative bg-white rounded-2xl p-4 flex items-end overflow-hidden">
      {/* Grid lines */}
      <div className="absolute inset-4 flex flex-col justify-between text-[10px] text-slate-300 pointer-events-none">
        <div className="border-b border-slate-100 w-full h-0"></div>
        <div className="border-b border-slate-100 w-full h-0"></div>
        <div className="border-b border-slate-100 w-full h-0"></div>
        <div className="border-b border-slate-100 w-full h-0"></div>
      </div>

      {/* The Line */}
      <svg className="w-full h-full relative z-10" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C8F2E2" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#C8F2E2" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`${pathD} L ${width} ${height} L 0 ${height} Z`}
          fill="url(#lineGrad)"
        />
        <path
          d={pathD}
          fill="none"
          stroke="#0EA5E9"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Axis Labels */}
      <div className="absolute bottom-2 left-4 right-4 flex justify-between text-[10px] text-slate-400">
        <span>Older</span>
        <span>Recent sessions</span>
        <span>Latest</span>
      </div>
    </div>
  );
}

function SkillBarChart({ skills }) {
  if (!skills.length) {
    return <p className="py-8 text-sm font-semibold text-slate-500">Complete an activity to create a skill breakdown.</p>;
  }
  const colors = ["bg-bingo-coral", "bg-bingo-yellow", "bg-bingo-mint", "bg-bingo-lavender", "bg-bingo-blue"];
  return (
    <div className="space-y-4 pt-4">
      {skills.map((skill, idx) => (
        <div key={skill.key} className="group">
          <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
            <span>{skill.label}</span>
            <span>{skill.value}%</span>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${skill.value}%` }}
              transition={{ duration: 1, delay: idx * 0.1 }}
              className={`h-full rounded-full ${colors[idx % colors.length]} opacity-80 group-hover:opacity-100 transition-opacity`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function ChildSnapshotCard({ summary }) {
  return (
    <div className="toon-panel flex h-full flex-col items-center p-6 text-center">
      <div className="mb-4 relative">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-bingo-yellow via-bingo-coral to-bingo-lavender p-1">
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-2xl font-bold text-slate-800">
            B!
          </div>
        </div>
        <div className="absolute bottom-0 right-0 bg-emerald-400 w-5 h-5 rounded-full border-2 border-white"></div>
      </div>

      <h3 className="text-xl font-bold text-slate-900">Learning Snapshot</h3>
      <p className="text-sm text-slate-500 mb-4">Calculated from completed activities</p>

      <div className="w-full space-y-3 text-left bg-slate-50 rounded-2xl p-4">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500 font-medium">Sessions</span>
          <span className="text-slate-800 font-semibold bg-white px-2 py-0.5 rounded shadow-sm">{summary.sessionCount}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500 font-medium">Measured strength</span>
          <span className="text-slate-800 font-semibold bg-white px-2 py-0.5 rounded shadow-sm">{summary.strongestSkill?.label || "Not enough data"}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500 font-medium">Practice area</span>
          <span className="text-slate-800 font-semibold bg-white px-2 py-0.5 rounded shadow-sm">{summary.focusSkill?.label || "Complete a game"}</span>
        </div>
      </div>

      <div className="mt-auto pt-4 w-full">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>Average result</span>
          <span className="text-emerald-600 font-semibold">{summary.sessionCount ? `${summary.average}%` : "No data"}</span>
        </div>
        <div className="flex gap-1 h-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className={`flex-1 rounded-full ${summary.average >= i * 20 ? 'bg-bingo-mint' : 'bg-slate-200'}`}></div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RecentActivityTable({ history }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-slate-600">
        <thead className="text-xs text-slate-400 uppercase bg-slate-50/50 border-b border-slate-100">
          <tr>
            <th className="px-4 py-3 font-semibold">Date</th>
            <th className="px-4 py-3 font-semibold">Activity</th>
            <th className="px-4 py-3 font-semibold">Score</th>
            <th className="px-4 py-3 font-semibold">Time</th>
            <th className="px-4 py-3 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {history.slice(0, 10).map((item) => (
            <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-4 py-3 font-medium text-slate-900">{formatActivityDate(item.completedAt)}</td>
              <td className="px-4 py-3">{item.activity}</td>
              <td className="px-4 py-3 font-semibold text-slate-700">{item.score}/{item.maxScore}</td>
              <td className="px-4 py-3 text-slate-500">{formatDuration(item.durationSeconds)}</td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${item.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                  {item.status === 'Completed' && <IconCheck />}
                  {item.status}
                </span>
              </td>
            </tr>
          ))}
          {!history.length && (
            <tr>
              <td colSpan="5" className="px-4 py-10 text-center font-semibold text-slate-500">
                No completed activities yet. Results will appear here after a game is finished.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// --- Dashboard Views ---

function CommunityPod() {
  const [subTab, setSubTab] = useState('communities'); // 'communities' | 'vent'

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex gap-6 border-b border-slate-200 pb-2">
        <button
          onClick={() => setSubTab('communities')}
          className={`pb-2 px-1 text-sm font-semibold transition-colors ${subTab === 'communities' ? 'border-b-2 border-slate-900 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Communities
        </button>
        <button
          onClick={() => setSubTab('vent')}
          className={`pb-2 px-1 text-sm font-semibold transition-colors ${subTab === 'vent' ? 'border-b-2 border-slate-900 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Anonymous Vent Journal
        </button>
      </div>

      {subTab === 'communities' && (
        <div className="grid gap-4 sm:grid-cols-2">
          {COMMUNITIES.map(c => (
            <div key={c.id} className="toon-card flex items-center justify-between p-5">
              <div>
                <h4 className="font-bold text-slate-800">{c.name}</h4>
                <p className="text-xs text-slate-500 mt-1">{c.members.toLocaleString()} members</p>
              </div>
              <button className="toon-button min-h-10 bg-bingo-mint px-4 py-2 text-xs text-bingo-navy">
                Join
              </button>
            </div>
          ))}
        </div>
      )}

      {subTab === 'vent' && (
        <div className="space-y-6">
          <div className="toon-card p-5">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Write a Vent (Anonymous)</label>
            <textarea
              className="toon-input min-h-[100px] w-full text-sm"
              placeholder="Share your thoughts anonymously... This is a safe, judgment-free space."
            ></textarea>
            <div className="flex justify-end mt-3">
              <button className="toon-button bg-bingo-indigo px-5 py-2.5 text-sm text-white">
                Post Anonymously
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-wider">Recent Community Vents</h3>
            <div className="space-y-4">
              {VENT_POSTS.map(post => (
                <div key={post.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <p className="text-slate-800 text-sm mb-3 italic">"{post.text}"</p>
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>{post.time}</span>
                    <span className="flex items-center gap-1">❤️ {post.likes}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ActivityPlans() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h3 className="text-lg font-bold text-slate-900">Recommended Plans</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {ACTIVITY_PLANS.map(plan => (
          <div key={plan.id} className="toon-card group cursor-pointer p-5">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-slate-800 group-hover:text-bingo-blue transition-colors">{plan.title}</h4>
              <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-lg text-xs font-medium">{plan.duration}</span>
            </div>
            <p className="text-sm text-slate-500">{plan.desc}</p>
          </div>
        ))}
      </div>
      <div className="p-8 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
        <p className="text-slate-500 text-sm">Create your own custom plan +</p>
      </div>
    </div>
  );
}

function Chatbot() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I can explain the recorded learning history and suggest what to practice next.", sender: 'bot' }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userText = input;
    setMessages(prev => [...prev, { id: Date.now(), text: userText, sender: 'user' }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botText = buildAssistantResponse(userText, getActivityHistory());
      setMessages(prev => [...prev, { id: Date.now() + 1, text: botText, sender: 'bot' }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-[500px] flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="bg-slate-900 p-4 text-white">
        <h3 className="font-bold">Mr. Bingo Assistant</h3>
        <p className="text-xs text-slate-300">Answers are based on completed activities stored on this device.</p>
      </div>
      <div className="flex-1 p-4 bg-slate-50 overflow-y-auto space-y-4 soft-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
            {msg.sender === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs flex-shrink-0">MB</div>
            )}
            <div className={`p-3 rounded-2xl shadow-sm text-sm max-w-[80%] border ${msg.sender === 'user'
                ? 'bg-bingo-blue/20 text-slate-800 rounded-tr-none border-bingo-blue/30'
                : 'bg-white text-slate-700 rounded-tl-none border-slate-100'
              }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs flex-shrink-0">MB</div>
            <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 flex gap-1">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about progress or what to practice..."
            className="flex-1 border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-slate-900 focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

function TherapistBooking() {
  const [mode, setMode] = useState('online'); // 'online' | 'offline'
  const [location, setLocation] = useState('');

  const filteredTherapists = THERAPISTS.filter(t => {
    if (mode === 'online') return t.isOnline;
    if (mode === 'offline') return !t.isOnline;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Filters */}
      <div className="toon-card flex flex-col items-center justify-between gap-4 p-5 sm:flex-row">
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setMode('online')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'online' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Online
          </button>
          <button
            onClick={() => setMode('offline')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'offline' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Offline (In-Person)
          </button>
        </div>

        {mode === 'offline' && (
          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Enter Zip Code or City"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="toon-input w-full px-4 py-2.5 text-sm"
            />
          </div>
        )}
      </div>

      {/* List */}
      <div className="grid gap-4">
        {filteredTherapists.map(t => (
          <div key={t.id} className="toon-card group flex flex-col items-center justify-between p-5 sm:flex-row">
            <div className="flex items-center gap-4 mb-4 sm:mb-0 w-full sm:w-auto">
              <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-lg font-bold text-slate-500">
                {t.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h4 className="font-bold text-slate-900">{t.name}</h4>
                <p className="text-xs text-slate-500">{t.role} • ⭐ {t.rating}</p>
                <p className="text-xs text-slate-400 mt-0.5">{mode === 'offline' ? `📍 ${t.location}` : '🌐 Virtual Session'}</p>
              </div>
            </div>
            <button className="toon-button w-full bg-bingo-indigo px-6 py-2.5 text-sm text-white sm:w-auto">
              Book Now
            </button>
          </div>
        ))}
        {filteredTherapists.length === 0 && (
          <div className="text-center py-10 text-slate-500">
            No therapists found for this mode. Try switching filters.
          </div>
        )}
      </div>
    </div>
  );
}

// --- Main/Analytics View (The Redesign) ---

function AnalyticsView() {
  const [history, setHistory] = useState(() => getActivityHistory());
  const summary = summarizeHistory(history);
  const summaryStats = [
    {
      title: "Average Result",
      value: summary.sessionCount ? `${summary.average}%` : "—",
      sub: summary.sessionCount ? `Across ${summary.sessionCount} completed sessions` : "Complete a game to begin",
      color: "from-bingo-blue/40 to-bingo-blue/10",
      iconType: "progress",
    },
    {
      title: "Completed Sessions",
      value: String(summary.sessionCount),
      sub: "Stored on this device",
      color: "from-bingo-mint/40 to-bingo-mint/10",
      iconType: "trend",
    },
    {
      title: "Practice Area",
      value: summary.focusSkill?.label || "No data",
      sub: summary.focusSkill ? `${summary.focusSkill.value}% measured average` : "No result inferred yet",
      color: "from-bingo-yellow/60 to-bingo-yellow/20",
      iconType: "focus",
      isSoftWarning: Boolean(summary.focusSkill),
    },
    {
      title: "Time Recorded",
      value: formatDuration(summary.totalSeconds),
      sub: "Completed play time",
      color: "from-bingo-lavender/40 to-bingo-lavender/10",
      iconType: "time",
    },
  ];

  useEffect(() => {
    const refresh = () => setHistory(getActivityHistory());
    window.addEventListener(HISTORY_UPDATED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(HISTORY_UPDATED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 lg:space-y-8"
    >
      {/* Top Section – Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map((stat, idx) => (
          <SummaryCard key={idx} {...stat} />
        ))}
      </div>

      {/* Main Section (Charts + Snapshot) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Charts) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Line Chart */}
          <div className="toon-panel p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900">Learning Progress</h3>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">Last 30 Days</span>
            </div>
            <LearningChart history={history} />
          </div>

          {/* Bar Chart */}
          <div className="toon-panel p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Skill Breakdown</h3>
            <SkillBarChart skills={summary.skills} />
          </div>
        </div>

        {/* Right Column (Child Snapshot) */}
        <div className="lg:col-span-1">
          <ChildSnapshotCard summary={summary} />
        </div>
      </div>

      {/* Bottom Section - Recent Activity Table */}
      <div className="toon-panel p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h3>
        <RecentActivityTable history={history} />
      </div>
    </motion.div>
  );
}

// --- Main Layout Component ---

export function ParentDashboard() {
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics', 'community', 'plans', 'chatbot', 'booking'

  const getTabLabel = (tab) => {
    switch (tab) {
      case 'analytics': return "Dashboard Overview";
      case 'community': return "Community Pod";
      case 'plans': return "Activity Plans";
      case 'chatbot': return "Mr. Bingo Assistant";
      case 'booking': return "Book a Therapist";
      default: return "";
    }
  };

  return (
    <section
      aria-label="Parent and therapist dashboard"
      className="relative mx-auto max-w-7xl px-4 py-8 pb-16 lg:py-12"
    >
      <div className="toon-panel flex min-h-[800px] flex-col overflow-hidden lg:flex-row">
        {/* Sidebar */}
        <aside className="flex w-full flex-col border-b-[3px] border-bingo-navy/10 bg-bingo-yellow/20 p-6 lg:w-72 lg:border-b-0 lg:border-r-[3px]">
          <div className="pb-8 border-b border-slate-100 mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-bingo-coral">
                Parent Mode
              </p>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                Dashboard
              </h2>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-bingo-navy/10 bg-bingo-yellow font-display text-sm font-bold text-bingo-navy shadow-pop-sm">
              B!
            </span>
          </div>

          <nav className="space-y-2 flex-1">
            <SidebarBtn
              isActive={activeTab === 'analytics'}
              onClick={() => setActiveTab('analytics')}
              label="Overview"
              icon={<IconChart />}
            />
            <SidebarBtn
              isActive={activeTab === 'community'}
              onClick={() => setActiveTab('community')}
              label="Community Pod"
              icon={<IconUser />}
            />
            <SidebarBtn
              isActive={activeTab === 'plans'}
              onClick={() => setActiveTab('plans')}
              label="Activity Plans"
              icon={<IconCheck />}
            />
            <SidebarBtn
              isActive={activeTab === 'chatbot'}
              onClick={() => setActiveTab('chatbot')}
              label="AI Assistant"
              icon={<IconFocus />}
            />
            <SidebarBtn
              isActive={activeTab === 'booking'}
              onClick={() => setActiveTab('booking')}
              label="Book Therapist"
              icon={<IconTime />}
              isLast
            />
          </nav>

          <div className="pt-6 border-t border-slate-100 text-xs text-slate-400">
            <p>Mr. Bingo v1.2</p>
            <p className="mt-1">Secure &amp; Private</p>
          </div>
        </aside>

        {/* Main content */}
        <main className="soft-scrollbar flex-1 overflow-y-auto bg-white/55 p-6 lg:p-10">
          <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <h1 className="text-3xl font-bold text-bingo-navy">
              {getTabLabel(activeTab)}
            </h1>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-600 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                System Online
              </span>
              <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 shadow-sm transition-colors">
                <span className="sr-only">Notifications</span>
                <IconBell />
              </button>
            </div>
          </header>

          {/* Tab Content */}
          <div className="min-h-full">
            {activeTab === 'analytics' && <AnalyticsView />}
            {activeTab === 'community' && <CommunityPod />}
            {activeTab === 'plans' && <ActivityPlans />}
            {activeTab === 'chatbot' && <Chatbot />}
            {activeTab === 'booking' && <TherapistBooking />}
          </div>

        </main>
      </div>
    </section>
  );
}

function SidebarBtn({ isActive, onClick, icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all duration-200 group ${isActive
        ? 'translate-x-1 bg-bingo-indigo text-white shadow-pop-sm'
        : 'text-bingo-navy/60 hover:bg-white hover:text-bingo-navy'
        }`}
    >
      <span className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'} transition-colors`}>
        {icon}
      </span>
      {label}
    </button>
  );
}
