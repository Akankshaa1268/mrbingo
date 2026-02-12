import React, { useState } from "react";
import { motion } from "framer-motion";

const sectionCardClass =
  "bg-white/95 rounded-3xl shadow-soft border border-slate-100 p-4 sm:p-5 h-full flex flex-col";

// --- Mock Data ---

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

// --- Sub-Components ---

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
            <div key={c.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center hover:shadow-md transition-shadow">
              <div>
                <h4 className="font-bold text-slate-800">{c.name}</h4>
                <p className="text-xs text-slate-500 mt-1">{c.members.toLocaleString()} members</p>
              </div>
              <button className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors">
                Join
              </button>
            </div>
          ))}
        </div>
      )}

      {subTab === 'vent' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Write a Vent (Anonymous)</label>
            <textarea
              className="w-full border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 min-h-[100px]"
              placeholder="Share your thoughts anonymously... This is a safe, judgment-free space."
            ></textarea>
            <div className="flex justify-end mt-3">
              <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-sm hover:opacity-90 transition-opacity">
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
          <div key={plan.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:border-slate-300 transition-colors group">
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
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-[500px] flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="bg-slate-900 p-4 text-white">
        <h3 className="font-bold">Mr. Bingo Assistant</h3>
        <p className="text-xs text-slate-300">Ask me about parenting, IEPs, or game tips!</p>
      </div>
      <div className="flex-1 p-4 bg-slate-50 overflow-y-auto space-y-4">
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs">MB</div>
          <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-slate-700 max-w-[80%] border border-slate-100">
            Hello! How can I support you and your child today?
          </div>
        </div>
      </div>
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type your question..."
            className="flex-1 border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-slate-900 focus:outline-none"
          />
          <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:opacity-90">
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
    if (mode === 'offline') return !t.isOnline; // In real app, would filter by location too
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Filters */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
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
              className="w-full border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-slate-900 focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* List */}
      <div className="grid gap-4">
        {filteredTherapists.map(t => (
          <div key={t.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between items-center hover:border-bingo-blue transition-colors group">
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
            <button className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-slate-800 transition-colors">
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

// --- Main Component ---

export function ParentDashboard() {
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics', 'community', 'plans', 'chatbot', 'booking'

  const getTabLabel = (tab) => {
    switch (tab) {
      case 'analytics': return "Child Progress Analytics";
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
      className="relative max-w-6xl mx-auto px-4 py-8 pb-16 lg:py-12"
    >
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl lg:rounded-4xl shadow-soft border border-slate-100 overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-slate-100 bg-gradient-to-b from-sky-50/80 to-slate-50/80">
          <div className="px-5 pt-4 pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Parent Mode
              </p>
              <p className="text-sm font-semibold text-slate-900 mt-1">
                Dashboard
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
            <SidebarBtn
              isActive={activeTab === 'analytics'}
              onClick={() => setActiveTab('analytics')}
              icon="📈"
              label="Progress Analytics"
            />
            <SidebarBtn
              isActive={activeTab === 'community'}
              onClick={() => setActiveTab('community')}
              icon="🤝"
              label="Community Pod"
            />
            <SidebarBtn
              isActive={activeTab === 'plans'}
              onClick={() => setActiveTab('plans')}
              icon="📝"
              label="Activity Plans"
            />
            <SidebarBtn
              isActive={activeTab === 'chatbot'}
              onClick={() => setActiveTab('chatbot')}
              icon="🤖"
              label="AI Assistant"
            />
            <SidebarBtn
              isActive={activeTab === 'booking'}
              onClick={() => setActiveTab('booking')}
              icon="📅"
              label="Book a Therapist"
            />
          </nav>

          <div className="px-5 pb-4 pt-2 text-[0.7rem] text-slate-500 space-y-1 mt-auto">
            <p>
              Designed to support your journey with data, community, and expert tools.
            </p>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-5 lg:p-6 bg-slate-50/60 soft-scrollbar overflow-y-auto">
          <header className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {getTabLabel(activeTab)}
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700 border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Live Updates
              </span>
            </div>
          </header>

          {/* Tab Content */}
          {activeTab === 'analytics' && <AnalyticsView />}
          {activeTab === 'community' && <CommunityPod />}
          {activeTab === 'plans' && <ActivityPlans />}
          {activeTab === 'chatbot' && <Chatbot />}
          {activeTab === 'booking' && <TherapistBooking />}

        </main>
      </div>
    </section>
  );
}

// Helper Components

function SidebarBtn({ isActive, onClick, icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 rounded-2xl px-3 py-2.5 text-xs sm:text-sm font-semibold transition-all ${isActive
        ? 'bg-slate-900 text-white shadow-sm'
        : 'text-slate-700 hover:bg-white hover:shadow-sm'
        }`}
    >
      <span aria-hidden="true">{icon}</span>
      {label}
    </button>
  );
}

function AnalyticsView() {
  return (
    <>
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
          className="grid gap-4 sm:grid-cols-1"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <div className={sectionCardClass}>
            <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-2">
              Regulation Notes
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-3">
              Observations from recent sessions.
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
              <li>• Shorter sessions in afternoon = better focus.</li>
              <li>• Visual timers reduced anxiety.</li>
              <li>• Memory Grid score improved by 15%.</li>
            </ul>
          </div>
        </motion.div>
      </div>
      <div className={sectionCardClass}>
        <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-2">
          Export Reports
        </h3>
        <div className="space-y-2 text-xs sm:text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-700">Weekly Summary (PDF)</span>
            <button className="text-[0.7rem] font-semibold text-slate-700 px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200">Download</button>
          </div>
        </div>
      </div>
    </>
  );
}
