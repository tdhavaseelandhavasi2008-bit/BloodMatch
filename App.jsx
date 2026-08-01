import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Droplet, Heart, MapPin, Bell, User, Users, ShieldCheck, Clock, Activity,
  LogOut, Menu, X, Search, Phone, Mail, Lock, ChevronRight, CheckCircle2,
  XCircle, AlertTriangle, TrendingUp, BarChart3, Settings, PlusCircle,
  Navigation, Star, Award, Calendar, ArrowRight, Sparkles, Building2,
  Siren, Loader2, ChevronDown, LayoutDashboard, ClipboardList, Package,
  UserCheck, ShieldAlert, Zap, Eye, EyeOff, Smartphone, ArrowLeft, Filter
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar,
  PieChart, Pie, Cell, CartesianGrid, LineChart, Line
} from "recharts";

/* ============================================================
   DESIGN TOKENS
   ============================================================ */
const T = {
  primary: "#D32F2F",
  primaryDark: "#B71C1C",
  primaryDeep: "#7F0000",
  secondary: "#FFFFFF",
  accent: "#424242",
  success: "#2E7D32",
  warning: "#F9A825",
  error: "#C62828",
  tint: "#FFF6F5",
  ink: "#1C1B1F",
  mute: "#79747A",
  line: "#F0DEDE",
};

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
`;

const GLOBAL_CSS = `
${FONTS}
* { box-sizing: border-box; }
.bm-root { font-family: 'Inter', system-ui, sans-serif; color: ${T.ink}; background: ${T.tint}; }
.f-display { font-family: 'Sora', system-ui, sans-serif; }
.f-mono { font-family: 'JetBrains Mono', monospace; }

.bm-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
.bm-scroll::-webkit-scrollbar-thumb { background: #E8B4B4; border-radius: 10px; }

.grad-primary { background: linear-gradient(135deg, #E53935 0%, #C62828 55%, #8E0000 100%); }
.grad-dark { background: radial-gradient(120% 140% at 10% 0%, #2A1414 0%, #140707 55%, #0A0303 100%); }
.grad-warm { background: linear-gradient(180deg, #FFFFFF 0%, #FFF6F5 100%); }

.glass {
  background: rgba(255,255,255,0.72);
  backdrop-filter: blur(18px) saturate(160%);
  -webkit-backdrop-filter: blur(18px) saturate(160%);
  border: 1px solid rgba(255,255,255,0.6);
}
.glass-dark {
  background: rgba(255,255,255,0.06);
  backdrop-filter: blur(18px) saturate(160%);
  -webkit-backdrop-filter: blur(18px) saturate(160%);
  border: 1px solid rgba(255,255,255,0.12);
}

.card {
  background: #fff;
  border: 1px solid ${T.line};
  border-radius: 20px;
  box-shadow: 0 1px 2px rgba(20,4,4,0.04), 0 10px 30px -14px rgba(120,20,20,0.12);
}
.card:hover.card-hover { box-shadow: 0 8px 24px -8px rgba(120,20,20,0.22); }

.btn { font-family: 'Sora', sans-serif; font-weight: 600; border-radius: 14px; transition: all .18s ease; cursor: pointer; }
.btn:active { transform: translateY(1px) scale(0.99); }
.btn-primary { background: linear-gradient(135deg, #E53935, #C62828); color: #fff; box-shadow: 0 8px 20px -6px rgba(198,40,40,0.55); }
.btn-primary:hover { box-shadow: 0 10px 26px -6px rgba(198,40,40,0.7); filter: brightness(1.04); }
.btn-ghost { background: transparent; color: ${T.ink}; border: 1.5px solid #E7DADA; }
.btn-ghost:hover { background: #FFF1F1; border-color: #F0BFBF; }
.btn-dark { background: ${T.ink}; color: #fff; }

.pulse-ring { position: absolute; inset: 0; border-radius: 999px; border: 2px solid ${T.primary}; animation: pulseRing 1.8s cubic-bezier(.4,0,.2,1) infinite; }
@keyframes pulseRing { 0% { transform: scale(0.9); opacity: .9;} 100% { transform: scale(2.1); opacity: 0; } }

.heartbeat-line { stroke-dasharray: 400; stroke-dashoffset: 400; animation: drawLine 2.6s ease-in-out infinite; }
@keyframes drawLine { 0% { stroke-dashoffset: 400; } 55% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: -400; } }

.fade-up { animation: fadeUp .6s ease both; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(14px);} to { opacity: 1; transform: translateY(0);} }

.spin-slow { animation: spin 2.4s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.badge { font-family:'JetBrains Mono', monospace; font-weight: 600; font-size: 11px; letter-spacing: .03em; padding: 4px 10px; border-radius: 999px; display:inline-flex; align-items:center; gap:4px; }

input[type=text]::placeholder, input[type=email]::placeholder, input[type=tel]::placeholder, input[type=password]::placeholder { color: #B9AEAE; }
input, select { font-family: 'Inter', sans-serif; }
.focus-ring:focus { outline: none; box-shadow: 0 0 0 3px rgba(211,47,47,0.18); border-color: ${T.primary} !important; }

.sidebar-item { transition: all .15s ease; }
.sidebar-item:hover { background: #FFF1F1; }
.sidebar-item.active { background: linear-gradient(135deg, #E53935, #C62828); color: #fff; box-shadow: 0 6px 16px -6px rgba(198,40,40,0.6); }

@media (prefers-reduced-motion: reduce) {
  .pulse-ring, .heartbeat-line, .fade-up, .spin-slow { animation: none !important; }
}
`;

/* ============================================================
   MOCK DATA
   ============================================================ */
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const COMPAT = {
  "O-": ["O-"], "O+": ["O-", "O+"],
  "A-": ["O-", "A-"], "A+": ["O-", "O+", "A-", "A+"],
  "B-": ["O-", "B-"], "B+": ["O-", "O+", "B-", "B+"],
  "AB-": ["O-", "A-", "B-", "AB-"], "AB+": BLOOD_GROUPS,
};

const HOSPITALS = [
  "City Care Multispecialty Hospital",
  "Metro General Hospital",
  "Sunrise Medical Center",
  "Lakeview Heart Institute",
  "St. Mary's Trauma Center",
];

const NAMES = ["Arjun Kumar","Priya Sharma","Vikram Singh","Sneha Reddy","Karthik Raj","Ananya Iyer","Rahul Menon","Divya Nair","Sanjay Patel","Meera Pillai","Farhan Ali","Lakshmi Rao","Vishal Gupta","Nisha Verma","Rohan Das"];

function seedDonors(bg, n = 8) {
  const compatible = COMPAT[bg] || BLOOD_GROUPS;
  return Array.from({ length: n }).map((_, i) => {
    const g = compatible[Math.floor(Math.random() * compatible.length)];
    return {
      id: `D-${1000 + i}`,
      name: NAMES[Math.floor(Math.random() * NAMES.length)],
      bloodGroup: g,
      distance: (0.4 + Math.random() * 6.5).toFixed(1),
      eta: Math.floor(4 + Math.random() * 22),
      verified: Math.random() > 0.25,
      donations: Math.floor(Math.random() * 20),
      rating: (4 + Math.random()).toFixed(1),
    };
  }).sort((a, b) => a.distance - b.distance);
}

const REQUEST_HISTORY = [
  { id: "REQ-2291", bg: "O+", qty: 2, hospital: HOSPITALS[0], status: "Fulfilled", date: "Jul 18, 2026", urgency: "Critical" },
  { id: "REQ-2214", bg: "O+", qty: 1, hospital: HOSPITALS[2], status: "Fulfilled", date: "Jun 02, 2026", urgency: "High" },
  { id: "REQ-2106", bg: "O+", qty: 3, hospital: HOSPITALS[1], status: "Cancelled", date: "Apr 27, 2026", urgency: "Medium" },
];

const DONOR_HISTORY = [
  { id: "DON-771", date: "May 14, 2026", hospital: HOSPITALS[3], units: 1, status: "Completed" },
  { id: "DON-702", date: "Jan 02, 2026", hospital: HOSPITALS[0], units: 1, status: "Completed" },
  { id: "REQ ALERT-919", date: "Jul 29, 2026", hospital: HOSPITALS[1], units: 1, status: "Rejected" },
];

const HOSPITAL_REQUESTS = [
  { id: "REQ-3391", patient: "Ramesh Iyer", bg: "AB-", qty: 2, urgency: "Critical", status: "Pending", time: "3 min ago" },
  { id: "REQ-3388", patient: "Fatima Khan", bg: "O+", qty: 1, urgency: "High", status: "Matched", time: "18 min ago" },
  { id: "REQ-3379", patient: "Suresh Nambiar", bg: "B+", qty: 3, urgency: "Medium", status: "Approved", time: "1 hr ago" },
  { id: "REQ-3355", patient: "Anjali Bose", bg: "A-", qty: 1, urgency: "Low", status: "Fulfilled", time: "5 hrs ago" },
];

const INVENTORY = [
  { bg: "A+", units: 42, cap: 60 }, { bg: "A-", units: 9, cap: 40 },
  { bg: "B+", units: 31, cap: 60 }, { bg: "B-", units: 6, cap: 30 },
  { bg: "AB+", units: 14, cap: 30 }, { bg: "AB-", units: 3, cap: 20 },
  { bg: "O+", units: 55, cap: 70 }, { bg: "O-", units: 8, cap: 40 },
];

const WEEK_TREND = [
  { d: "Mon", req: 22, match: 19 }, { d: "Tue", req: 30, match: 27 },
  { d: "Wed", req: 18, match: 17 }, { d: "Thu", req: 34, match: 29 },
  { d: "Fri", req: 41, match: 35 }, { d: "Sat", req: 27, match: 25 },
  { d: "Sun", req: 20, match: 18 },
];

const BG_DISTRIBUTION = INVENTORY.map(i => ({ name: i.bg, value: i.units }));
const PIE_COLORS = ["#D32F2F","#E53935","#EF5350","#F9A825","#2E7D32","#66BB6A","#424242","#8D8D8D"];

const ADMIN_USERS = [
  { name: "Priya Sharma", role: "Donor", status: "Active", joined: "Feb 2026" },
  { name: "City Care Hospital", role: "Hospital", status: "Active", joined: "Nov 2025" },
  { name: "Rahul Menon", role: "Patient", status: "Active", joined: "Jul 2026" },
  { name: "LifeFlow Blood Bank", role: "Blood Bank", status: "Pending", joined: "Jul 2026" },
  { name: "Vikram Singh", role: "Donor", status: "Suspended", joined: "Mar 2026" },
];

/* ============================================================
   SHARED UI PRIMITIVES
   ============================================================ */
function Logo({ dark }) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-9 h-9 rounded-xl grad-primary flex items-center justify-center shadow-lg">
        <Droplet size={18} color="#fff" fill="#fff" />
      </div>
      <span className={`f-display font-bold text-lg ${dark ? "text-white" : ""}`} style={{ color: dark ? "#fff" : T.ink }}>
        Blood<span style={{ color: T.primary }}>Match</span>
      </span>
    </div>
  );
}

function Badge({ tone = "mute", children, icon }) {
  const map = {
    success: { bg: "#E8F5E9", fg: T.success },
    warning: { bg: "#FFF8E1", fg: "#946200" },
    error: { bg: "#FDECEA", fg: T.error },
    primary: { bg: "#FDECEA", fg: T.primaryDark },
    mute: { bg: "#F1EFEF", fg: T.accent },
    dark: { bg: "#EDEDED", fg: T.ink },
  };
  const c = map[tone] || map.mute;
  return (
    <span className="badge" style={{ background: c.bg, color: c.fg }}>
      {icon}{children}
    </span>
  );
}

function UrgencyBadge({ level }) {
  const map = { Critical: "error", High: "primary", Medium: "warning", Low: "mute" };
  return <Badge tone={map[level] || "mute"}>{level}</Badge>;
}

function StatCard({ icon, label, value, delta, tone = "primary" }) {
  const toneColor = { primary: T.primary, success: T.success, warning: "#946200", accent: T.accent }[tone];
  return (
    <div className="card p-5 fade-up">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${toneColor}14` }}>
          {React.cloneElement(icon, { size: 19, color: toneColor })}
        </div>
        {delta && (
          <span className="text-xs font-semibold flex items-center gap-1" style={{ color: T.success }}>
            <TrendingUp size={12} /> {delta}
          </span>
        )}
      </div>
      <div className="f-display text-2xl font-bold mt-3" style={{ color: T.ink }}>{value}</div>
      <div className="text-xs mt-1" style={{ color: T.mute }}>{label}</div>
    </div>
  );
}

function BloodChip({ bg, size = "md" }) {
  const dims = size === "sm" ? "w-8 h-8 text-[11px]" : "w-11 h-11 text-sm";
  return (
    <div className={`${dims} rounded-full grad-primary flex items-center justify-center text-white font-bold f-mono shrink-0`}>
      {bg}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: T.mute }}>{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

const inputCls = "w-full px-3.5 py-2.5 rounded-xl border text-sm focus-ring transition-colors";
const inputStyle = { borderColor: "#E7DADA" };

/* ============================================================
   HEARTBEAT SVG (signature motif)
   ============================================================ */
function HeartbeatLine({ width = "100%", height = 60, stroke = "#fff", opacity = 0.9 }) {
  return (
    <svg viewBox="0 0 400 60" width={width} height={height} preserveAspectRatio="none" style={{ opacity }}>
      <polyline
        className="heartbeat-line"
        points="0,30 60,30 80,10 95,50 115,5 130,45 150,30 200,30 220,15 235,45 250,30 400,30"
        fill="none"
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ============================================================
   LANDING PAGE
   ============================================================ */
function Landing({ goLogin }) {
  const [liveCount, setLiveCount] = useState(1247);
  useEffect(() => {
    const t = setInterval(() => setLiveCount(c => c + (Math.random() > 0.5 ? 1 : 0)), 2600);
    return () => clearInterval(t);
  }, []);

  const steps = [
    { n: "01", title: "Raise an emergency request", desc: "Patient or hospital submits blood group, quantity, urgency and location in under 30 seconds.", icon: <Siren size={20} /> },
    { n: "02", title: "We match compatible donors nearby", desc: "The matching engine ranks eligible donors by blood compatibility, distance and availability.", icon: <Zap size={20} /> },
    { n: "03", title: "Donors get notified instantly", desc: "Nearby donors receive a live alert and can accept in one tap, with ETA shared automatically.", icon: <Bell size={20} /> },
  ];

  const roles = [
    { key: "patient", title: "I need blood", desc: "Raise an emergency request and track matched donors live.", icon: <Heart size={20} />, tone: T.primary },
    { key: "donor", title: "I want to donate", desc: "Get notified when someone nearby needs your blood type.", icon: <Droplet size={20} />, tone: T.success },
    { key: "hospital", title: "Hospital / Blood Bank", desc: "Manage requests, inventory and verified donor network.", icon: <Building2 size={20} />, tone: T.accent },
    { key: "admin", title: "Administrator", desc: "Oversee the entire donor–patient matching network.", icon: <ShieldCheck size={20} />, tone: "#8D6E00" },
  ];

  return (
    <div className="bm-root min-h-screen">
      {/* NAV */}
      <div className="sticky top-0 z-40 glass">
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          <Logo />
          <div className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: T.accent }}>
            <a href="#how" className="hover:opacity-70">How it works</a>
            <a href="#roles" className="hover:opacity-70">For everyone</a>
            <a href="#stats" className="hover:opacity-70">Impact</a>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => goLogin("patient")} className="btn btn-ghost px-4 py-2 text-sm hidden sm:block">Log in</button>
            <button onClick={() => goLogin("patient", true)} className="btn btn-primary px-4 py-2 text-sm flex items-center gap-1.5">
              <Siren size={15} /> Emergency request
            </button>
          </div>
        </div>
      </div>

      {/* HERO */}
      <div className="grad-dark relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full" style={{ background: "radial-gradient(circle, rgba(211,47,47,0.35), transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 w-full opacity-40">
          <HeartbeatLine height={80} stroke="#D32F2F" />
        </div>
        <div className="max-w-7xl mx-auto px-5 md:px-8 pt-16 pb-24 md:pt-24 md:pb-32 relative">
          <div className="max-w-2xl fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-dark text-xs font-semibold text-white mb-6">
              <span className="relative w-2 h-2 rounded-full" style={{ background: "#4CD964" }}>
                <span className="absolute inset-0 rounded-full animate-ping" style={{ background: "#4CD964" }} />
              </span>
              Live · {liveCount.toLocaleString()} donors on the network right now
            </div>
            <h1 className="f-display text-white font-bold leading-[1.05] text-4xl md:text-6xl">
              Every second counts.<br />
              <span style={{ color: "#FF8A80" }}>Find compatible blood</span><br />
              before it's too late.
            </h1>
            <p className="mt-6 text-base md:text-lg" style={{ color: "#D9C9C9" }}>
              BloodMatch connects patients, verified donors, hospitals and blood banks in one
              real-time network — cutting emergency response time from hours to minutes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => goLogin("patient", true)} className="btn btn-primary px-6 py-3.5 flex items-center gap-2">
                <Siren size={17} /> Raise emergency request <ArrowRight size={16} />
              </button>
              <button onClick={() => goLogin("donor")} className="btn px-6 py-3.5 flex items-center gap-2 text-white" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.25)" }}>
                <Droplet size={17} /> Become a donor
              </button>
            </div>
          </div>

          {/* floating match card */}
          <div className="hidden lg:block absolute right-8 top-20 w-80 fade-up" style={{ animationDelay: ".2s" }}>
            <div className="glass-dark rounded-3xl p-5 text-white shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wide" style={{ color: "#FF8A80" }}>MATCH FOUND</span>
                <Badge tone="error" icon={<Siren size={11} />}>Critical</Badge>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <BloodChip bg="O-" />
                <div>
                  <div className="font-semibold f-display">Arjun Kumar</div>
                  <div className="text-xs" style={{ color: "#C9B7B7" }}>1.8 km away · Verified donor</div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs" style={{ color: "#C9B7B7" }}>
                <Clock size={13} /> Estimated arrival <span className="f-mono text-white">9 min</span>
              </div>
              <div className="mt-4 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.15)" }}>
                <div className="h-full rounded-full grad-primary" style={{ width: "72%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STATS STRIP */}
      <div id="stats" className="max-w-7xl mx-auto px-5 md:px-8 -mt-10 md:-mt-14 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { v: "8.4 min", l: "Avg. donor response time", i: <Clock size={18} /> },
            { v: "31,200+", l: "Verified donors", i: <Users size={18} /> },
            { v: "96.4%", l: "Requests fulfilled", i: <CheckCircle2 size={18} /> },
            { v: "142", l: "Partner hospitals", i: <Building2 size={18} /> },
          ].map((s, i) => (
            <div key={i} className="card p-5 text-center fade-up" style={{ animationDelay: `${i * 0.06}s` }}>
              <div className="w-9 h-9 mx-auto rounded-xl flex items-center justify-center mb-2" style={{ background: "#FDECEA", color: T.primary }}>{s.i}</div>
              <div className="f-display font-bold text-xl">{s.v}</div>
              <div className="text-xs mt-1" style={{ color: T.mute }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div id="how" className="max-w-7xl mx-auto px-5 md:px-8 py-20 md:py-28">
        <div className="max-w-xl">
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: T.primary }}>How it works</span>
          <h2 className="f-display text-3xl md:text-4xl font-bold mt-2">From request to donor, in three steps.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {steps.map((s, i) => (
            <div key={i} className="card card-hover p-6 fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl grad-primary flex items-center justify-center text-white">{s.icon}</div>
                <span className="f-mono text-3xl font-bold" style={{ color: T.line }}>{s.n}</span>
              </div>
              <h3 className="f-display font-semibold text-lg mt-5">{s.title}</h3>
              <p className="text-sm mt-2 leading-relaxed" style={{ color: T.mute }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ROLES */}
      <div id="roles" className="grad-warm py-20 md:py-28 border-y" style={{ borderColor: T.line }}>
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="max-w-xl">
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: T.primary }}>Built for everyone in the chain</span>
            <h2 className="f-display text-3xl md:text-4xl font-bold mt-2">One network. Every role.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
            {roles.map((r) => (
              <button key={r.key} onClick={() => goLogin(r.key)} className="card card-hover p-6 text-left fade-up group">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${r.tone}15`, color: r.tone }}>{r.icon}</div>
                <h3 className="f-display font-semibold mt-4">{r.title}</h3>
                <p className="text-sm mt-1.5" style={{ color: T.mute }}>{r.desc}</p>
                <div className="flex items-center gap-1 mt-4 text-sm font-semibold" style={{ color: r.tone }}>
                  Continue <ChevronRight size={15} className="transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="grad-dark">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo dark />
          <p className="text-xs text-center md:text-right" style={{ color: "#9A8888" }}>
            © 2026 BloodMatch. A demonstration prototype — not connected to a real donor network.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   AUTH SCREEN
   ============================================================ */
function LoginScreen({ initialRole, emergencyIntent, onLogin, onBack }) {
  const [role, setRole] = useState(initialRole || "patient");
  const [mode, setMode] = useState("email"); // email | phone
  const [showPw, setShowPw] = useState(false);

  const roleTabs = [
    { key: "patient", label: "Patient", icon: <Heart size={15} /> },
    { key: "donor", label: "Donor", icon: <Droplet size={15} /> },
    { key: "hospital", label: "Hospital", icon: <Building2 size={15} /> },
    { key: "bloodbank", label: "Blood Bank", icon: <Package size={15} /> },
    { key: "admin", label: "Admin", icon: <ShieldCheck size={15} /> },
  ];

  return (
    <div className="bm-root min-h-screen grad-warm flex flex-col">
      <div className="max-w-7xl mx-auto w-full px-5 md:px-8 h-16 flex items-center justify-between">
        <Logo />
        <button onClick={onBack} className="text-sm font-medium flex items-center gap-1.5" style={{ color: T.accent }}>
          <ArrowLeft size={15} /> Back home
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-5 py-8">
        <div className="w-full max-w-md">
          {emergencyIntent && (
            <div className="mb-5 rounded-2xl p-4 flex items-start gap-3 fade-up" style={{ background: "#FDECEA", border: "1px solid #F3C6C6" }}>
              <Siren size={18} style={{ color: T.error }} className="mt-0.5 shrink-0" />
              <div className="text-sm" style={{ color: T.primaryDark }}>
                <span className="font-semibold">Emergency mode.</span> Log in or continue as guest patient to raise your request in seconds.
              </div>
            </div>
          )}

          <div className="card p-7 fade-up">
            <h1 className="f-display text-2xl font-bold text-center">Welcome back</h1>
            <p className="text-sm text-center mt-1" style={{ color: T.mute }}>Sign in to continue to your dashboard</p>

            {/* role tabs */}
            <div className="flex flex-wrap gap-1.5 mt-6 p-1 rounded-2xl" style={{ background: "#FBEFEF" }}>
              {roleTabs.map(t => (
                <button
                  key={t.key}
                  onClick={() => setRole(t.key)}
                  className="flex-1 min-w-[30%] flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-xs font-semibold transition-all"
                  style={role === t.key ? { background: T.primary, color: "#fff" } : { color: T.accent }}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            {/* email/phone toggle */}
            <div className="flex gap-2 mt-6">
              <button onClick={() => setMode("email")} className="flex-1 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 border transition-colors"
                style={mode === "email" ? { borderColor: T.primary, color: T.primary, background: "#FDECEA" } : { borderColor: T.line, color: T.mute }}>
                <Mail size={14} /> Email
              </button>
              <button onClick={() => setMode("phone")} className="flex-1 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 border transition-colors"
                style={mode === "phone" ? { borderColor: T.primary, color: T.primary, background: "#FDECEA" } : { borderColor: T.line, color: T.mute }}>
                <Smartphone size={14} /> Phone OTP
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {mode === "email" ? (
                <>
                  <Field label="Email address">
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: T.mute }} />
                      <input type="email" placeholder="you@example.com" className={inputCls} style={{ ...inputStyle, paddingLeft: 38 }} />
                    </div>
                  </Field>
                  <Field label="Password">
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: T.mute }} />
                      <input type={showPw ? "text" : "password"} placeholder="••••••••" className={inputCls} style={{ ...inputStyle, paddingLeft: 38, paddingRight: 38 }} />
                      <button onClick={() => setShowPw(s => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: T.mute }}>
                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </Field>
                  <div className="flex justify-end -mt-1">
                    <button className="text-xs font-semibold" style={{ color: T.primary }}>Forgot password?</button>
                  </div>
                </>
              ) : (
                <>
                  <Field label="Phone number">
                    <div className="relative">
                      <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: T.mute }} />
                      <input type="tel" placeholder="+91 98765 43210" className={inputCls} style={{ ...inputStyle, paddingLeft: 38 }} />
                    </div>
                  </Field>
                  <button className="btn btn-ghost w-full py-2.5 text-sm">Send OTP</button>
                  <Field label="Enter OTP">
                    <div className="flex gap-2">
                      {[0, 1, 2, 3].map(i => (
                        <input key={i} maxLength={1} className="w-full text-center py-2.5 rounded-xl border text-lg font-semibold focus-ring" style={inputStyle} />
                      ))}
                    </div>
                  </Field>
                </>
              )}

              <button onClick={() => onLogin(role)} className="btn btn-primary w-full py-3 flex items-center justify-center gap-2">
                Continue <ArrowRight size={16} />
              </button>

              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px" style={{ background: T.line }} />
                <span className="text-xs" style={{ color: T.mute }}>or</span>
                <div className="flex-1 h-px" style={{ background: T.line }} />
              </div>

              <button onClick={() => onLogin(role)} className="btn btn-ghost w-full py-2.5 flex items-center justify-center gap-2 text-sm">
                <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6 29.6 4 24 4c-7.4 0-13.8 4.1-17.1 10.1z"/><path fill="#4CAF50" d="M24 44c5.5 0 10.4-1.9 14.2-5.1l-6.6-5.4C29.6 35.4 27 36 24 36c-5.3 0-9.6-3.1-11.2-7.5l-6.6 5.1C9.9 39.8 16.4 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1 2.8-2.9 5.1-5.3 6.7l6.6 5.4C40.4 36.6 44 30.9 44 24c0-1.3-.1-2.7-.4-3.5z"/></svg>
                Continue with Google
              </button>
            </div>

            <p className="text-xs text-center mt-6" style={{ color: T.mute }}>
              New to BloodMatch? <button onClick={() => onLogin(role)} className="font-semibold" style={{ color: T.primary }}>Create an account</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   DASHBOARD SHELL (sidebar + topbar)
   ============================================================ */
function DashboardShell({ title, subtitle, navItems, activeNav, setActiveNav, roleLabel, roleIcon, onLogout, children, notifCount = 3 }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="bm-root min-h-screen flex" style={{ background: "#FCF7F7" }}>
      {/* Sidebar */}
      <aside className={`fixed lg:static z-40 top-0 left-0 h-full w-64 bg-white border-r flex-col ${mobileOpen ? "flex" : "hidden lg:flex"}`} style={{ borderColor: T.line }}>
        <div className="h-16 flex items-center px-5 border-b" style={{ borderColor: T.line }}>
          <Logo />
          <button className="ml-auto lg:hidden" onClick={() => setMobileOpen(false)}><X size={20} /></button>
        </div>
        <div className="p-4 flex items-center gap-3 border-b" style={{ borderColor: T.line }}>
          <div className="w-10 h-10 rounded-full grad-primary flex items-center justify-center text-white">{roleIcon}</div>
          <div>
            <div className="text-sm font-semibold">{roleLabel}</div>
            <div className="text-xs" style={{ color: T.mute }}>Verified account</div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1 bm-scroll overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => { setActiveNav(item.key); setMobileOpen(false); }}
              className={`sidebar-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium ${activeNav === item.key ? "active" : ""}`}
              style={activeNav !== item.key ? { color: T.accent } : {}}
            >
              {item.icon} {item.label}
              {item.badge ? <span className="ml-auto text-[10px] f-mono font-bold px-1.5 py-0.5 rounded-full" style={{ background: activeNav === item.key ? "rgba(255,255,255,0.25)" : "#FDECEA", color: activeNav === item.key ? "#fff" : T.primary }}>{item.badge}</span> : null}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t" style={{ borderColor: T.line }}>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium hover:bg-red-50" style={{ color: T.error }}>
            <LogOut size={17} /> Log out
          </button>
        </div>
      </aside>

      {mobileOpen && <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="h-16 bg-white border-b flex items-center px-5 md:px-8 gap-4 sticky top-0 z-20" style={{ borderColor: T.line }}>
          <button className="lg:hidden" onClick={() => setMobileOpen(true)}><Menu size={22} /></button>
          <div>
            <h1 className="f-display font-bold text-lg leading-none">{title}</h1>
            {subtitle && <p className="text-xs mt-1" style={{ color: T.mute }}>{subtitle}</p>}
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "#FBEFEF" }}>
              <Bell size={16} style={{ color: T.accent }} />
              {notifCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center" style={{ background: T.error }}>{notifCount}</span>}
            </button>
          </div>
        </div>
        <div className="flex-1 p-5 md:p-8 bm-scroll overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PATIENT DASHBOARD
   ============================================================ */
function PatientDashboard({ onLogout }) {
  const [active, setActive] = useState("request");
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ bg: "O+", qty: 1, hospital: HOSPITALS[0], urgency: "Critical", location: "" });
  const [matching, setMatching] = useState(false);
  const [matched, setMatched] = useState(false);
  const [donors, setDonors] = useState([]);

  const navItems = [
    { key: "request", label: "Emergency Request", icon: <Siren size={17} /> },
    { key: "live", label: "Live Status", icon: <Activity size={17} />, badge: matched ? "1" : null },
    { key: "history", label: "Request History", icon: <ClipboardList size={17} /> },
    { key: "contact", label: "Emergency Contact", icon: <Phone size={17} /> },
  ];

  function submitRequest() {
    setMatching(true);
    setActive("live");
    setTimeout(() => {
      setDonors(seedDonors(form.bg, 6));
      setMatching(false);
      setMatched(true);
    }, 2200);
  }

  return (
    <DashboardShell
      title="Patient Dashboard" subtitle="Welcome back, Rahul Menon"
      navItems={navItems} activeNav={active} setActiveNav={setActive}
      roleLabel="Rahul Menon" roleIcon={<Heart size={18} />} onLogout={onLogout}
    >
      {active === "request" && (
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-6">
            {[1, 2, 3].map(s => (
              <React.Fragment key={s}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold f-mono"
                  style={step >= s ? { background: T.primary, color: "#fff" } : { background: "#F1E4E4", color: T.mute }}>{s}</div>
                {s < 3 && <div className="flex-1 h-0.5" style={{ background: step > s ? T.primary : T.line }} />}
              </React.Fragment>
            ))}
          </div>

          <div className="card p-6 md:p-8 fade-up">
            {step === 1 && (
              <>
                <h2 className="f-display font-bold text-xl mb-1">What blood do you need?</h2>
                <p className="text-sm mb-6" style={{ color: T.mute }}>Select the blood group and quantity required.</p>
                <div className="grid grid-cols-4 gap-3">
                  {BLOOD_GROUPS.map(bg => (
                    <button key={bg} onClick={() => setForm(f => ({ ...f, bg }))}
                      className="py-4 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all"
                      style={form.bg === bg ? { borderColor: T.primary, background: "#FDECEA" } : { borderColor: T.line }}>
                      <span className="f-display font-bold text-lg" style={{ color: form.bg === bg ? T.primary : T.ink }}>{bg}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-6">
                  <Field label="Quantity (units)">
                    <div className="flex items-center gap-4">
                      <button onClick={() => setForm(f => ({ ...f, qty: Math.max(1, f.qty - 1) }))} className="w-10 h-10 rounded-xl border font-bold" style={{ borderColor: T.line }}>−</button>
                      <span className="f-mono font-bold text-xl w-8 text-center">{form.qty}</span>
                      <button onClick={() => setForm(f => ({ ...f, qty: f.qty + 1 }))} className="w-10 h-10 rounded-xl border font-bold" style={{ borderColor: T.line }}>+</button>
                    </div>
                  </Field>
                </div>
                <button onClick={() => setStep(2)} className="btn btn-primary px-6 py-3 mt-8 flex items-center gap-2">Next: Location & hospital <ArrowRight size={16} /></button>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="f-display font-bold text-xl mb-1">Where do you need it?</h2>
                <p className="text-sm mb-6" style={{ color: T.mute }}>Choose the receiving hospital and confirm your location.</p>
                <Field label="Hospital">
                  <select className={inputCls} style={inputStyle} value={form.hospital} onChange={e => setForm(f => ({ ...f, hospital: e.target.value }))}>
                    {HOSPITALS.map(h => <option key={h}>{h}</option>)}
                  </select>
                </Field>
                <div className="mt-4">
                  <Field label="Current location">
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: T.mute }} />
                      <input placeholder="Use GPS or type an address" className={inputCls} style={{ ...inputStyle, paddingLeft: 38 }} value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
                    </div>
                  </Field>
                </div>
                <div className="mt-4 rounded-2xl overflow-hidden border relative h-44" style={{ borderColor: T.line }}>
                  <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,#FDECEA,#FCE4E4)" }} />
                  <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 400 176"><path d="M0 40 H400 M0 90 H400 M0 140 H400 M60 0 V176 M160 0 V176 M260 0 V176 M340 0 V176" stroke={T.accent} strokeWidth="1" /></svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col gap-1">
                    <div className="relative">
                      <div className="pulse-ring" style={{ width: 40, height: 40 }} />
                      <div className="w-10 h-10 rounded-full grad-primary flex items-center justify-center text-white relative"><MapPin size={18} /></div>
                    </div>
                    <span className="text-xs font-medium mt-1" style={{ color: T.accent }}>Tap map to drop pin (demo)</span>
                  </div>
                </div>
                <div className="flex gap-3 mt-8">
                  <button onClick={() => setStep(1)} className="btn btn-ghost px-6 py-3">Back</button>
                  <button onClick={() => setStep(3)} className="btn btn-primary px-6 py-3 flex items-center gap-2">Next: Urgency <ArrowRight size={16} /></button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="f-display font-bold text-xl mb-1">How urgent is this?</h2>
                <p className="text-sm mb-6" style={{ color: T.mute }}>This determines how aggressively we alert nearby donors.</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { k: "Critical", d: "Immediate danger to life", c: T.error },
                    { k: "High", d: "Needed within hours", c: T.primary },
                    { k: "Medium", d: "Needed within 24 hrs", c: "#946200" },
                    { k: "Low", d: "Planned / scheduled", c: T.accent },
                  ].map(u => (
                    <button key={u.k} onClick={() => setForm(f => ({ ...f, urgency: u.k }))}
                      className="p-4 rounded-2xl border-2 text-left" style={form.urgency === u.k ? { borderColor: u.c, background: `${u.c}0F` } : { borderColor: T.line }}>
                      <div className="font-semibold f-display" style={{ color: u.c }}>{u.k}</div>
                      <div className="text-xs mt-1" style={{ color: T.mute }}>{u.d}</div>
                    </button>
                  ))}
                </div>
                <div className="mt-6 p-4 rounded-2xl flex items-center gap-3" style={{ background: "#FBEFEF" }}>
                  <BloodChip bg={form.bg} size="sm" />
                  <div className="text-sm">
                    <span className="font-semibold">{form.qty} unit(s) of {form.bg}</span> · {form.hospital} · <UrgencyBadge level={form.urgency} />
                  </div>
                </div>
                <div className="flex gap-3 mt-8">
                  <button onClick={() => setStep(2)} className="btn btn-ghost px-6 py-3">Back</button>
                  <button onClick={submitRequest} className="btn btn-primary px-6 py-3 flex items-center gap-2">
                    <Siren size={16} /> Submit emergency request
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {active === "live" && (
        <div className="max-w-4xl space-y-6">
          {matching && (
            <div className="card p-10 text-center fade-up">
              <div className="relative w-20 h-20 mx-auto">
                <div className="pulse-ring" />
                <div className="w-20 h-20 rounded-full grad-primary flex items-center justify-center text-white relative">
                  <Droplet size={30} className="spin-slow" />
                </div>
              </div>
              <h3 className="f-display font-bold text-lg mt-6">Searching for compatible donors…</h3>
              <p className="text-sm mt-1" style={{ color: T.mute }}>Scanning verified donors near {form.hospital}</p>
            </div>
          )}

          {!matching && matched && (
            <>
              <div className="card p-6 flex flex-col md:flex-row md:items-center gap-4 justify-between fade-up" style={{ background: "linear-gradient(135deg,#FDECEA,#FFF)" }}>
                <div className="flex items-center gap-4">
                  <BloodChip bg={form.bg} />
                  <div>
                    <div className="font-semibold f-display flex items-center gap-2">Request {`#REQ-${4210}`} <UrgencyBadge level={form.urgency} /></div>
                    <div className="text-xs mt-1" style={{ color: T.mute }}>{form.qty} unit(s) · {form.hospital}</div>
                  </div>
                </div>
                <button className="btn px-4 py-2 text-sm" style={{ background: "#FDECEA", color: T.error }}>Cancel request</button>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <StatCard icon={<Users />} label="Compatible donors found" value={donors.length} tone="primary" />
                <StatCard icon={<Clock />} label="Fastest ETA" value={`${Math.min(...donors.map(d => d.eta))} min`} tone="success" />
                <StatCard icon={<Activity />} label="Request status" value="Matching" tone="warning" />
              </div>

              <div className="card p-5">
                <h3 className="f-display font-semibold mb-4">Nearby compatible donors</h3>
                <div className="space-y-3">
                  {donors.map(d => (
                    <div key={d.id} className="flex items-center gap-3 p-3 rounded-xl border" style={{ borderColor: T.line }}>
                      <BloodChip bg={d.bloodGroup} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 text-sm font-semibold truncate">
                          {d.name} {d.verified && <ShieldCheck size={13} style={{ color: T.success }} />}
                        </div>
                        <div className="text-xs flex items-center gap-3 mt-0.5" style={{ color: T.mute }}>
                          <span className="flex items-center gap-1"><Navigation size={11} />{d.distance} km</span>
                          <span className="flex items-center gap-1"><Clock size={11} />{d.eta} min ETA</span>
                          <span className="flex items-center gap-1"><Star size={11} />{d.rating}</span>
                        </div>
                      </div>
                      <Badge tone="success" icon={<CheckCircle2 size={11} />}>Notified</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {!matching && !matched && (
            <div className="card p-10 text-center">
              <ClipboardList size={28} className="mx-auto" style={{ color: T.mute }} />
              <p className="text-sm mt-3" style={{ color: T.mute }}>No active request. Raise an emergency request to see live status here.</p>
            </div>
          )}
        </div>
      )}

      {active === "history" && (
        <div className="card overflow-hidden">
          <div className="p-5 border-b" style={{ borderColor: T.line }}>
            <h3 className="f-display font-semibold">Request history</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide" style={{ color: T.mute, background: "#FCF7F7" }}>
                  <th className="px-5 py-3 font-semibold">Request</th>
                  <th className="px-5 py-3 font-semibold">Hospital</th>
                  <th className="px-5 py-3 font-semibold">Urgency</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {REQUEST_HISTORY.map(r => (
                  <tr key={r.id} className="border-t" style={{ borderColor: T.line }}>
                    <td className="px-5 py-3.5 flex items-center gap-2 f-mono text-xs font-semibold">
                      <BloodChip bg={r.bg} size="sm" /> {r.id}
                    </td>
                    <td className="px-5 py-3.5" style={{ color: T.accent }}>{r.hospital}</td>
                    <td className="px-5 py-3.5"><UrgencyBadge level={r.urgency} /></td>
                    <td className="px-5 py-3.5 f-mono text-xs" style={{ color: T.mute }}>{r.date}</td>
                    <td className="px-5 py-3.5">
                      <Badge tone={r.status === "Fulfilled" ? "success" : "mute"}>{r.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {active === "contact" && (
        <div className="max-w-md card p-6">
          <h3 className="f-display font-semibold mb-4">Emergency contact</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "#FBEFEF" }}>
              <Phone size={16} style={{ color: T.primary }} /><div><div className="text-sm font-semibold">Ambulance / Emergency</div><div className="text-xs f-mono" style={{ color: T.mute }}>108</div></div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "#FBEFEF" }}>
              <Building2 size={16} style={{ color: T.primary }} /><div><div className="text-sm font-semibold">{form.hospital}</div><div className="text-xs f-mono" style={{ color: T.mute }}>+91 44 4000 1122</div></div>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

/* ============================================================
   DONOR DASHBOARD
   ============================================================ */
function DonorDashboard({ onLogout }) {
  const [active, setActive] = useState("overview");
  const [available, setAvailable] = useState(true);
  const [emergencyOptIn, setEmergencyOptIn] = useState(true);
  const [incoming, setIncoming] = useState([
    { id: "ALR-901", bg: "O+", hospital: HOSPITALS[0], distance: "1.8", urgency: "Critical", status: "pending" },
    { id: "ALR-887", bg: "O+", hospital: HOSPITALS[3], distance: "4.2", urgency: "High", status: "pending" },
  ]);

  const navItems = [
    { key: "overview", label: "Overview", icon: <LayoutDashboard size={17} /> },
    { key: "alerts", label: "Incoming Requests", icon: <Bell size={17} />, badge: incoming.filter(i => i.status === "pending").length || null },
    { key: "history", label: "Donation History", icon: <ClipboardList size={17} /> },
    { key: "profile", label: "Profile & Eligibility", icon: <UserCheck size={17} /> },
  ];

  function respond(id, decision) {
    setIncoming(list => list.map(i => i.id === id ? { ...i, status: decision } : i));
  }

  return (
    <DashboardShell
      title="Donor Dashboard" subtitle="Welcome back, Priya Sharma"
      navItems={navItems} activeNav={active} setActiveNav={setActive}
      roleLabel="Priya Sharma · B+" roleIcon={<Droplet size={18} />} onLogout={onLogout}
    >
      {active === "overview" && (
        <div className="space-y-6">
          <div className="card p-6 flex flex-col md:flex-row md:items-center justify-between gap-5" style={{ background: available ? "linear-gradient(135deg,#E8F5E9,#FFF)" : "#FCF7F7" }}>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl grad-primary flex items-center justify-center text-white font-bold f-display text-lg">B+</div>
              <div>
                <div className="font-semibold f-display flex items-center gap-2">Priya Sharma {<ShieldCheck size={15} style={{ color: T.success }} />}</div>
                <div className="text-xs mt-0.5" style={{ color: T.mute }}>Chennai, Tamil Nadu · Last donated 78 days ago</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">{available ? "Available to donate" : "Not available"}</span>
              <button onClick={() => setAvailable(a => !a)} className="w-12 h-7 rounded-full relative transition-colors" style={{ background: available ? T.success : "#D8D0D0" }}>
                <span className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-all" style={{ left: available ? 22 : 2 }} />
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <StatCard icon={<Droplet />} label="Total donations" value="9" tone="primary" />
            <StatCard icon={<Heart />} label="Lives potentially saved" value="27" tone="success" delta="+3" />
            <StatCard icon={<Calendar />} label="Eligible to donate again in" value="12 days" tone="warning" />
          </div>

          <div className="card p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#FDECEA", color: T.primary }}><Siren size={18} /></div>
              <div>
                <div className="font-semibold text-sm">Emergency availability</div>
                <div className="text-xs" style={{ color: T.mute }}>Get notified even outside your usual radius for critical cases</div>
              </div>
            </div>
            <button onClick={() => setEmergencyOptIn(v => !v)} className="w-12 h-7 rounded-full relative transition-colors" style={{ background: emergencyOptIn ? T.primary : "#D8D0D0" }}>
              <span className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-all" style={{ left: emergencyOptIn ? 22 : 2 }} />
            </button>
          </div>

          <div className="card p-6">
            <h3 className="f-display font-semibold mb-4">Your impact this year</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={WEEK_TREND}>
                <defs>
                  <linearGradient id="donorGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={T.primary} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={T.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1E4E4" vertical={false} />
                <XAxis dataKey="d" tick={{ fontSize: 12, fill: T.mute }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: T.mute }} axisLine={false} tickLine={false} width={24} />
                <Tooltip />
                <Area type="monotone" dataKey="match" stroke={T.primary} strokeWidth={2.5} fill="url(#donorGrad)" name="Alerts responded" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {active === "alerts" && (
        <div className="space-y-4 max-w-3xl">
          {incoming.map(r => (
            <div key={r.id} className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between fade-up">
              <div className="flex items-center gap-4">
                <div className="relative">
                  {r.status === "pending" && <div className="pulse-ring" style={{ width: 44, height: 44 }} />}
                  <BloodChip bg={r.bg} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold f-display text-sm">{r.hospital}</span>
                    <UrgencyBadge level={r.urgency} />
                  </div>
                  <div className="text-xs mt-1 flex items-center gap-3" style={{ color: T.mute }}>
                    <span className="flex items-center gap-1"><Navigation size={11} />{r.distance} km away</span>
                    <span className="f-mono">{r.id}</span>
                  </div>
                </div>
              </div>
              {r.status === "pending" ? (
                <div className="flex gap-2">
                  <button onClick={() => respond(r.id, "rejected")} className="btn px-4 py-2 text-sm flex items-center gap-1.5" style={{ background: "#F1EFEF", color: T.accent }}><XCircle size={15} /> Decline</button>
                  <button onClick={() => respond(r.id, "accepted")} className="btn btn-primary px-4 py-2 text-sm flex items-center gap-1.5"><CheckCircle2 size={15} /> Accept</button>
                </div>
              ) : (
                <Badge tone={r.status === "accepted" ? "success" : "mute"} icon={r.status === "accepted" ? <CheckCircle2 size={11} /> : <XCircle size={11} />}>
                  {r.status === "accepted" ? "Accepted" : "Declined"}
                </Badge>
              )}
            </div>
          ))}
          {incoming.length === 0 && <div className="card p-10 text-center text-sm" style={{ color: T.mute }}>No incoming requests right now.</div>}
        </div>
      )}

      {active === "history" && (
        <div className="card overflow-hidden">
          <div className="p-5 border-b" style={{ borderColor: T.line }}><h3 className="f-display font-semibold">Donation history</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-xs uppercase tracking-wide" style={{ color: T.mute, background: "#FCF7F7" }}>
                <th className="px-5 py-3 font-semibold">ID</th><th className="px-5 py-3 font-semibold">Hospital</th><th className="px-5 py-3 font-semibold">Units</th><th className="px-5 py-3 font-semibold">Date</th><th className="px-5 py-3 font-semibold">Status</th>
              </tr></thead>
              <tbody>
                {DONOR_HISTORY.map(r => (
                  <tr key={r.id} className="border-t" style={{ borderColor: T.line }}>
                    <td className="px-5 py-3.5 f-mono text-xs font-semibold">{r.id}</td>
                    <td className="px-5 py-3.5">{r.hospital}</td>
                    <td className="px-5 py-3.5">{r.units}</td>
                    <td className="px-5 py-3.5 f-mono text-xs" style={{ color: T.mute }}>{r.date}</td>
                    <td className="px-5 py-3.5"><Badge tone={r.status === "Completed" ? "success" : "error"}>{r.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {active === "profile" && (
        <div className="max-w-2xl card p-6">
          <h3 className="f-display font-semibold mb-5">Profile & medical eligibility</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Blood group"><input className={inputCls} style={inputStyle} defaultValue="B+" readOnly /></Field>
            <Field label="Age"><input className={inputCls} style={inputStyle} defaultValue="27" /></Field>
            <Field label="Weight (kg)"><input className={inputCls} style={inputStyle} defaultValue="64" /></Field>
            <Field label="Gender"><input className={inputCls} style={inputStyle} defaultValue="Female" /></Field>
            <Field label="Last donation date"><input className={inputCls} style={inputStyle} defaultValue="2026-05-14" /></Field>
            <Field label="City / District"><input className={inputCls} style={inputStyle} defaultValue="Chennai, Tamil Nadu" /></Field>
          </div>
          <div className="mt-5 p-4 rounded-2xl flex items-center gap-3" style={{ background: "#E8F5E9" }}>
            <ShieldCheck size={20} style={{ color: T.success }} />
            <div className="text-sm" style={{ color: "#1B5E20" }}>
              <span className="font-semibold">Verified donor.</span> Medical eligibility confirmed by City Care Hospital on May 14, 2026.
            </div>
          </div>
          <button className="btn btn-primary px-6 py-2.5 mt-5">Save changes</button>
        </div>
      )}
    </DashboardShell>
  );
}

/* ============================================================
   HOSPITAL DASHBOARD
   ============================================================ */
function HospitalDashboard({ onLogout }) {
  const [active, setActive] = useState("requests");
  const [requests, setRequests] = useState(HOSPITAL_REQUESTS);

  const navItems = [
    { key: "requests", label: "Blood Requests", icon: <Siren size={17} />, badge: requests.filter(r => r.status === "Pending").length || null },
    { key: "donors", label: "Nearby Donors", icon: <Users size={17} /> },
    { key: "inventory", label: "Blood Inventory", icon: <Package size={17} /> },
    { key: "analytics", label: "Analytics", icon: <BarChart3 size={17} /> },
  ];

  function approve(id) {
    setRequests(rs => rs.map(r => r.id === id ? { ...r, status: "Approved" } : r));
  }

  const nearbyDonors = useMemo(() => seedDonors("O+", 10), []);

  return (
    <DashboardShell
      title="Hospital Dashboard" subtitle="City Care Multispecialty Hospital"
      navItems={navItems} activeNav={active} setActiveNav={setActive}
      roleLabel="City Care Hospital" roleIcon={<Building2 size={18} />} onLogout={onLogout}
    >
      {active === "requests" && (
        <div className="space-y-5">
          <div className="grid sm:grid-cols-3 gap-4">
            <StatCard icon={<Siren />} label="Pending requests" value={requests.filter(r => r.status === "Pending").length} tone="primary" />
            <StatCard icon={<CheckCircle2 />} label="Approved today" value="6" tone="success" />
            <StatCard icon={<AlertTriangle />} label="Critical cases" value={requests.filter(r => r.urgency === "Critical").length} tone="warning" />
          </div>
          <div className="card overflow-hidden">
            <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: T.line }}>
              <h3 className="f-display font-semibold">Active blood requests</h3>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: T.mute }} />
                <input placeholder="Search patient / ID" className="pl-8 pr-3 py-1.5 rounded-lg border text-xs focus-ring" style={inputStyle} />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-xs uppercase tracking-wide" style={{ color: T.mute, background: "#FCF7F7" }}>
                  <th className="px-5 py-3 font-semibold">Request</th><th className="px-5 py-3 font-semibold">Patient</th><th className="px-5 py-3 font-semibold">Blood</th><th className="px-5 py-3 font-semibold">Urgency</th><th className="px-5 py-3 font-semibold">Received</th><th className="px-5 py-3 font-semibold">Status</th><th className="px-5 py-3 font-semibold"></th>
                </tr></thead>
                <tbody>
                  {requests.map(r => (
                    <tr key={r.id} className="border-t" style={{ borderColor: T.line }}>
                      <td className="px-5 py-3.5 f-mono text-xs font-semibold">{r.id}</td>
                      <td className="px-5 py-3.5">{r.patient}</td>
                      <td className="px-5 py-3.5 flex items-center gap-2"><BloodChip bg={r.bg} size="sm" /> {r.qty}u</td>
                      <td className="px-5 py-3.5"><UrgencyBadge level={r.urgency} /></td>
                      <td className="px-5 py-3.5 text-xs" style={{ color: T.mute }}>{r.time}</td>
                      <td className="px-5 py-3.5"><Badge tone={r.status === "Fulfilled" ? "success" : r.status === "Pending" ? "error" : "warning"}>{r.status}</Badge></td>
                      <td className="px-5 py-3.5 text-right">
                        {r.status === "Pending" && <button onClick={() => approve(r.id)} className="btn btn-primary px-3 py-1.5 text-xs">Approve</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {active === "donors" && (
        <div className="card p-5">
          <h3 className="f-display font-semibold mb-4">Nearby available donors</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {nearbyDonors.map(d => (
              <div key={d.id} className="p-4 rounded-2xl border flex items-center gap-3" style={{ borderColor: T.line }}>
                <BloodChip bg={d.bloodGroup} size="sm" />
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate flex items-center gap-1">{d.name} {d.verified && <ShieldCheck size={12} style={{ color: T.success }} />}</div>
                  <div className="text-xs" style={{ color: T.mute }}>{d.distance} km · {d.eta} min ETA</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {active === "inventory" && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="f-display font-semibold">Blood inventory</h3>
            <button className="btn btn-primary px-4 py-2 text-sm flex items-center gap-1.5"><PlusCircle size={15} /> Add stock</button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {INVENTORY.map(i => {
              const pct = Math.round((i.units / i.cap) * 100);
              const low = pct < 25;
              return (
                <div key={i.bg} className="p-4 rounded-2xl border" style={{ borderColor: low ? "#F3C6C6" : T.line, background: low ? "#FEF6F6" : "#fff" }}>
                  <div className="flex items-center justify-between">
                    <BloodChip bg={i.bg} size="sm" />
                    {low && <Badge tone="error" icon={<AlertTriangle size={10} />}>Low</Badge>}
                  </div>
                  <div className="f-display font-bold text-2xl mt-3">{i.units} <span className="text-xs font-normal" style={{ color: T.mute }}>units</span></div>
                  <div className="h-1.5 rounded-full mt-2 overflow-hidden" style={{ background: "#F1E4E4" }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: low ? T.error : T.success }} />
                  </div>
                  <div className="text-[11px] mt-1" style={{ color: T.mute }}>Capacity {i.cap}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {active === "analytics" && (
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="card p-6">
            <h3 className="f-display font-semibold mb-4">Requests vs. matches (7 days)</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={WEEK_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1E4E4" vertical={false} />
                <XAxis dataKey="d" tick={{ fontSize: 12, fill: T.mute }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: T.mute }} axisLine={false} tickLine={false} width={24} />
                <Tooltip />
                <Bar dataKey="req" fill="#F3C6C6" radius={[6, 6, 0, 0]} name="Requests" />
                <Bar dataKey="match" fill={T.primary} radius={[6, 6, 0, 0]} name="Matched" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card p-6">
            <h3 className="f-display font-semibold mb-4">Inventory distribution</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={BG_DISTRIBUTION} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                  {BG_DISTRIBUTION.map((e, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

/* ============================================================
   ADMIN DASHBOARD
   ============================================================ */
function AdminDashboard({ onLogout }) {
  const [active, setActive] = useState("overview");

  const navItems = [
    { key: "overview", label: "Overview", icon: <LayoutDashboard size={17} /> },
    { key: "users", label: "Manage Users", icon: <Users size={17} /> },
    { key: "hospitals", label: "Hospitals & Banks", icon: <Building2 size={17} /> },
    { key: "requests", label: "Manage Requests", icon: <ClipboardList size={17} /> },
    { key: "settings", label: "Settings", icon: <Settings size={17} /> },
  ];

  return (
    <DashboardShell
      title="Admin Dashboard" subtitle="Network-wide overview"
      navItems={navItems} activeNav={active} setActiveNav={setActive}
      roleLabel="System Admin" roleIcon={<ShieldCheck size={18} />} onLogout={onLogout}
    >
      {active === "overview" && (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={<Users />} label="Total donors" value="31,204" tone="primary" delta="+2.1%" />
            <StatCard icon={<ClipboardList />} label="Total requests" value="8,940" tone="accent" delta="+4.4%" />
            <StatCard icon={<CheckCircle2 />} label="Successful matches" value="8,617" tone="success" delta="+3.9%" />
            <StatCard icon={<AlertTriangle />} label="Pending requests" value="42" tone="warning" />
          </div>

          <div className="grid lg:grid-cols-3 gap-5">
            <div className="card p-6 lg:col-span-2">
              <h3 className="f-display font-semibold mb-4">Weekly request &amp; match trend</h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={WEEK_TREND}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1E4E4" vertical={false} />
                  <XAxis dataKey="d" tick={{ fontSize: 12, fill: T.mute }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: T.mute }} axisLine={false} tickLine={false} width={24} />
                  <Tooltip />
                  <Line type="monotone" dataKey="req" stroke={T.accent} strokeWidth={2.5} dot={false} name="Requests" />
                  <Line type="monotone" dataKey="match" stroke={T.primary} strokeWidth={2.5} dot={false} name="Matches" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="card p-6">
              <h3 className="f-display font-semibold mb-4">Donor blood group mix</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={BG_DISTRIBUTION} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={2}>
                    {BG_DISTRIBUTION.map((e, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="f-display font-semibold mb-4">Donation statistics by urgency fulfilled</h3>
            <div className="grid sm:grid-cols-4 gap-4">
              {[{ l: "Critical", v: 92, c: T.error }, { l: "High", v: 88, c: T.primary }, { l: "Medium", v: 95, c: "#946200" }, { l: "Low", v: 99, c: T.accent }].map(x => (
                <div key={x.l}>
                  <div className="flex justify-between text-xs mb-1.5"><span className="font-semibold">{x.l}</span><span className="f-mono" style={{ color: T.mute }}>{x.v}%</span></div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "#F1E4E4" }}>
                    <div className="h-full rounded-full" style={{ width: `${x.v}%`, background: x.c }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {active === "users" && (
        <div className="card overflow-hidden">
          <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: T.line }}>
            <h3 className="f-display font-semibold">Manage users</h3>
            <button className="btn btn-ghost px-3 py-1.5 text-xs flex items-center gap-1.5"><Filter size={13} /> Filter</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-xs uppercase tracking-wide" style={{ color: T.mute, background: "#FCF7F7" }}>
                <th className="px-5 py-3 font-semibold">Name</th><th className="px-5 py-3 font-semibold">Role</th><th className="px-5 py-3 font-semibold">Joined</th><th className="px-5 py-3 font-semibold">Status</th><th className="px-5 py-3 font-semibold"></th>
              </tr></thead>
              <tbody>
                {ADMIN_USERS.map((u, i) => (
                  <tr key={i} className="border-t" style={{ borderColor: T.line }}>
                    <td className="px-5 py-3.5 font-medium">{u.name}</td>
                    <td className="px-5 py-3.5" style={{ color: T.accent }}>{u.role}</td>
                    <td className="px-5 py-3.5 f-mono text-xs" style={{ color: T.mute }}>{u.joined}</td>
                    <td className="px-5 py-3.5"><Badge tone={u.status === "Active" ? "success" : u.status === "Pending" ? "warning" : "error"}>{u.status}</Badge></td>
                    <td className="px-5 py-3.5 text-right"><button className="text-xs font-semibold" style={{ color: T.primary }}>Manage</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {active === "hospitals" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {HOSPITALS.map((h, i) => (
            <div key={h} className="card p-5">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#FDECEA", color: T.primary }}><Building2 size={18} /></div>
                <Badge tone="success">Verified</Badge>
              </div>
              <div className="font-semibold f-display mt-3 text-sm">{h}</div>
              <div className="text-xs mt-1" style={{ color: T.mute }}>{12 + i * 3} active requests · {60 + i * 9} units in stock</div>
            </div>
          ))}
        </div>
      )}

      {active === "requests" && (
        <div className="card overflow-hidden">
          <div className="p-5 border-b" style={{ borderColor: T.line }}><h3 className="f-display font-semibold">All network requests</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-xs uppercase tracking-wide" style={{ color: T.mute, background: "#FCF7F7" }}>
                <th className="px-5 py-3 font-semibold">Request</th><th className="px-5 py-3 font-semibold">Patient</th><th className="px-5 py-3 font-semibold">Blood</th><th className="px-5 py-3 font-semibold">Urgency</th><th className="px-5 py-3 font-semibold">Status</th>
              </tr></thead>
              <tbody>
                {HOSPITAL_REQUESTS.map(r => (
                  <tr key={r.id} className="border-t" style={{ borderColor: T.line }}>
                    <td className="px-5 py-3.5 f-mono text-xs font-semibold">{r.id}</td>
                    <td className="px-5 py-3.5">{r.patient}</td>
                    <td className="px-5 py-3.5 flex items-center gap-2"><BloodChip bg={r.bg} size="sm" />{r.qty}u</td>
                    <td className="px-5 py-3.5"><UrgencyBadge level={r.urgency} /></td>
                    <td className="px-5 py-3.5"><Badge tone={r.status === "Fulfilled" ? "success" : r.status === "Pending" ? "error" : "warning"}>{r.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {active === "settings" && (
        <div className="max-w-lg card p-6">
          <h3 className="f-display font-semibold mb-4">Platform settings</h3>
          <div className="space-y-4 text-sm">
            {["Auto-approve verified hospital requests", "Enable emergency SMS fallback", "Require donor medical re-verification every 6 months"].map((s, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "#FCF7F7" }}>
                <span>{s}</span>
                <button className="w-11 h-6 rounded-full relative" style={{ background: i !== 1 ? T.primary : "#D8D0D0" }}>
                  <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow" style={{ left: i !== 1 ? 22 : 2 }} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

/* ============================================================
   ROOT APP
   ============================================================ */
export default function App() {
  const [screen, setScreen] = useState("landing"); // landing | login | patient | donor | hospital | bloodbank | admin
  const [loginRole, setLoginRole] = useState("patient");
  const [emergencyIntent, setEmergencyIntent] = useState(false);

  function goLogin(role, emergency = false) {
    setLoginRole(role);
    setEmergencyIntent(emergency);
    setScreen("login");
  }

  function handleLogin(role) {
    setScreen(role === "bloodbank" ? "hospital" : role);
  }

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      {screen === "landing" && <Landing goLogin={goLogin} />}
      {screen === "login" && <LoginScreen initialRole={loginRole} emergencyIntent={emergencyIntent} onLogin={handleLogin} onBack={() => setScreen("landing")} />}
      {screen === "patient" && <PatientDashboard onLogout={() => setScreen("landing")} />}
      {screen === "donor" && <DonorDashboard onLogout={() => setScreen("landing")} />}
      {screen === "hospital" && <HospitalDashboard onLogout={() => setScreen("landing")} />}
      {screen === "admin" && <AdminDashboard onLogout={() => setScreen("landing")} />}
    </>
  );
}
