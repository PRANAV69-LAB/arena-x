import React from 'react';
import {
  Trophy,
  ArrowRight,
  Database,
  Activity,
  Layers,
  ShieldCheck,
  Cpu,
  Download,
  CalendarDays,
  Sparkles,
  Users,
  CheckCircle2,
  Terminal,
  KeyRound,
  ExternalLink,
  Github,
  Award,
  GitBranch,
  Flame,
  Binary,
  Compass
} from 'lucide-react';
import { UserRole } from '../../types';

interface LandingPageProps {
  onOpenAuth: (role?: UserRole) => void;
  onOpenExportModal: () => void;
  onQuickEnter: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuth,
  onOpenExportModal,
  onQuickEnter
}) => {
  return (
    <div className="min-h-screen bg-[#080C15] text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300 overflow-x-hidden">
      {/* 1. Top Navbar */}
      <nav className="sticky top-0 z-40 bg-[#080C15]/85 backdrop-blur-md border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 glow-emerald-sm">
              <Trophy className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-black text-xl tracking-wider text-white">ARENA</span>
                <span className="font-heading font-black text-xl tracking-wider text-emerald-400">-X</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest leading-none">
                Sports &amp; DBMS Platform
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-400">
            <a href="#features" className="hover:text-emerald-400 transition-colors">Features</a>
            <a href="#sql-explorer" className="hover:text-emerald-400 transition-colors">SQL Engine</a>
            <a href="#algorithms" className="hover:text-emerald-400 transition-colors">Algorithms</a>
            <a href="#leadership" className="hover:text-emerald-400 transition-colors">Leadership</a>
            <a href="#architecture" className="hover:text-emerald-400 transition-colors">Architecture</a>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenExportModal}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Java 21 Project</span>
            </button>

            <button
              onClick={() => onOpenAuth('ADMIN')}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20 glow-emerald-sm cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Sign In / RBAC</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative pt-16 pb-20 px-6 overflow-hidden">
        {/* Subtle Ambient Neon Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[250px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-7 relative z-10">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ENTERPRISE SPORTS TOURNAMENT &amp; DBMS PLATFORM</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400 font-mono-code">Java 21 + MySQL 8.0</span>
          </div>

          {/* Catchy Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-black tracking-tight text-white leading-[1.1]">
            Enterprise Sports Tournament <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Management &amp; DBMS Platform
            </span>
          </h1>

          {/* Subheadline */}
          <p className="max-w-3xl mx-auto text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed font-normal">
            Automate single-elimination knockout brackets with mathematical BYE distribution, manage live scoring across Cricket, Football, Badminton, and Basketball, and explore an educational ANSI SQL visualization engine built directly on MySQL 8.0 &amp; JDBC transactions.
          </p>

          {/* CTA Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onOpenAuth('ADMIN')}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition-all shadow-lg shadow-emerald-500/25 glow-emerald cursor-pointer group"
            >
              <span>Explore Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onOpenExportModal}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm border border-slate-700/80 hover:border-slate-600 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>View Documentation / Architecture</span>
            </button>

            <button
              onClick={onQuickEnter}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 font-bold text-sm border border-emerald-500/30 transition-all cursor-pointer"
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Live Console (Guest)</span>
            </button>
          </div>

          {/* Live System Metrics Bar */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-left">
            {[
              { label: 'Active Tournaments', value: '4 Formats', sub: 'Knockout / League' },
              { label: 'Collegiate Squads', value: '22 Teams', sub: 'Verified Rosters' },
              { label: 'Student Athletes', value: '110 Players', sub: '4 Sports Disciplines' },
              { label: 'Match Records', value: '34+ Fixtures', sub: 'Live & Historical' },
              { label: 'Relational Schema', value: '11 Tables', sub: '3NF Normalized' },
              { label: 'ACID Transactions', value: '100% Guaranteed', sub: 'HikariCP + InnoDB' },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xs"
              >
                <div className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
                  {stat.label}
                </div>
                <div className="text-base font-black text-white font-heading mt-0.5">{stat.value}</div>
                <div className="text-[10px] text-emerald-400 font-mono-code">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Core Features Showcase */}
      <section id="features" className="py-20 px-6 border-t border-slate-800/80 bg-[#090D1A]/60">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 font-mono-code">
              Comprehensive Sports-Tech Architecture
            </span>
            <h2 className="text-3xl sm:text-5xl font-heading font-black text-white">
              Built for Collegiate Organizers &amp; Evaluators
            </h2>
            <p className="text-sm text-slate-400">
              A dual-purpose software engineering capstone uniting professional sports tournament operations with an interactive educational DBMS lab.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1: Tournaments & Fixtures */}
            <div className="p-7 rounded-3xl bg-slate-900/80 border border-slate-800/90 hover:border-emerald-500/40 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                <Trophy className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-heading font-bold text-white">Automated Fixture Algorithms</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Single-elimination Knockout scheduler with power-of-2 expansion and top-seed BYE calculations. Round Robin polygon circle rotation ensuring zero duplicate matchups.
              </p>
              <ul className="space-y-2 text-xs text-slate-300 font-medium pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Knockout with dynamic seed advancement</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Berger circle method round robin</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Interactive tree bracket visualization</span>
                </li>
              </ul>
            </div>

            {/* Feature 2: Multi-Sport Scoring */}
            <div className="p-7 rounded-3xl bg-slate-900/80 border border-slate-800/90 hover:border-cyan-500/40 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                <Activity className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-heading font-bold text-white">Multi-Sport Live Scoring</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Granular, sport-specific scorekeeping interfaces tailored for Cricket (runs, wickets, overs, RPO), Football (goals, cards, time), Badminton (sets, points), and Basketball (quarters).
              </p>
              <ul className="space-y-2 text-xs text-slate-300 font-medium pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Cricket run-rate and wicket tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Football match clock &amp; draw detection</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Instant winner &amp; standings recalculation</span>
                </li>
              </ul>
            </div>

            {/* Feature 3: SQL Explorer */}
            <div className="p-7 rounded-3xl bg-slate-900/80 border border-slate-800/90 hover:border-amber-500/40 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                <Database className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-heading font-bold text-white">Interactive SQL Explorer</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Explore the actual MySQL schema with an interactive ER diagram, run SQL queries with milliseconds execution benchmarks, and visualize the ANSI SQL logical order pipeline.
              </p>
              <ul className="space-y-2 text-xs text-slate-300 font-medium pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>11 Normalized relational InnoDB tables</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Step-by-step query order pipeline</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>ACID transaction commit &amp; rollback demo</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SQL Engine & Visualizer Spotlight */}
      <section id="sql-explorer" className="py-20 px-6 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono-code text-emerald-400">
                <Terminal className="w-3.5 h-3.5" />
                <span>RELATIONAL DATABASE MANAGEMENT SYSTEM</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-heading font-black text-white leading-tight">
                Inspect Real Queries &amp; Relational Constraints
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                ARENA-X isn't a static interface. It is connected to a normalized MySQL 8.0 schema containing tables for athletes, squads, venues, fixtures, match scores, and immutable audit logs.
              </p>

              <div className="space-y-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
                  <GitBranch className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-heading font-bold text-white text-xs">Generated Relational ER Diagram</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      SVG entity graph mapping foreign keys and primary keys across 11 normalized tables.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
                  <Layers className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-heading font-bold text-white text-xs">ANSI SQL Order of Operations</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Visualizes execution phases: FROM/JOIN &gt; WHERE &gt; GROUP BY &gt; SELECT &gt; ORDER BY &gt; LIMIT.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-heading font-bold text-white text-xs">ACID Multi-Step Transactions</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Interactive test demonstrating automatic rollback when simulated constraint failures occur.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Code / Visualizer Mockup Preview */}
            <div className="p-6 rounded-3xl bg-[#070B14] border border-slate-800 shadow-2xl space-y-4">
              <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-800">
                <span className="font-mono-code text-slate-300 font-bold flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  MySQL 8.0 Console Query Plan
                </span>
                <span className="text-emerald-400 font-mono-code text-[11px]">Execution Time: 1.82 ms</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 font-mono-code text-xs text-emerald-400 overflow-x-auto">
                <pre>{`SELECT t.team_name, count(m.match_id) as games_played
FROM teams t
INNER JOIN matches m 
  ON t.team_id = m.team_a_id OR t.team_id = m.team_b_id
WHERE m.status = 'COMPLETED'
GROUP BY t.team_name
ORDER BY games_played DESC
LIMIT 5;`}</pre>
              </div>

              {/* Execution Steps */}
              <div className="space-y-2 pt-1 font-mono-code text-[11px]">
                <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 flex items-center justify-between">
                  <span>1. FROM &amp; INNER JOIN (teams ↔ matches)</span>
                  <span className="text-[10px] text-emerald-400 font-bold">MATCHED 34 TUPLES</span>
                </div>
                <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300 flex items-center justify-between">
                  <span>2. WHERE (m.status = 'COMPLETED')</span>
                  <span className="text-[10px] text-amber-400 font-bold">18 QUALIFIED</span>
                </div>
                <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 flex items-center justify-between">
                  <span>3. GROUP BY &amp; PROJECTION</span>
                  <span className="text-[10px] text-cyan-400 font-bold">5 ROWS PROJECTED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Founders & Engineering Leadership Section (Crucial) */}
      <section id="leadership" className="py-24 px-6 border-t border-slate-800/80 bg-gradient-to-b from-[#090D1A] to-[#080C15] relative">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 font-mono-code">
              Leadership &amp; System Engineering
            </span>
            <h2 className="text-3xl sm:text-5xl font-heading font-black text-white">
              Architected by Pranav Sheelavantamath
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl mx-auto">
              Meet the visionary engineering leader behind ARENA-X's dual-runtime sports tournament scheduling and database visualization ecosystem.
            </p>
          </div>

          {/* Sleek Founder Showcase Card */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#0D1527] via-slate-900 to-[#0B1120] border border-slate-800/90 shadow-2xl relative overflow-hidden group hover:border-emerald-500/40 transition-all">
            {/* Top Accent Gradient Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {/* Left Column: Avatar & Quick Info */}
              <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4">
                <div className="relative">
                  <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 p-1 shadow-xl glow-emerald">
                    <div className="w-full h-full rounded-[22px] bg-slate-950 flex items-center justify-center text-white font-heading font-black text-3xl">
                      PS
                    </div>
                  </div>
                  <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-slate-950 border border-emerald-300 shadow">
                    FOUNDER
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-heading font-black text-white tracking-wide">
                    Pranav Sheelavantamath
                  </h3>
                  <p className="text-sm font-semibold text-emerald-400 font-mono-code mt-0.5">
                    Founder &amp; CEO
                  </p>
                  <p className="text-xs text-slate-400 mt-1">ARENA-X Systems</p>
                </div>
              </div>

              {/* Middle & Right Columns: Bio & Architectural Highlights */}
              <div className="md:col-span-2 space-y-5">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono-code">
                    <Award className="w-3.5 h-3.5" />
                    <span>Lead System Architect</span>
                  </div>

                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                    <strong className="text-white">Architecting enterprise sports-tech solutions and high-performance database visualization systems.</strong> Dedicated to engineering robust, scalable software that eliminates manual tournament logistics while demystifying complex relational DBMS internals for engineering students and academic evaluators.
                  </p>
                </div>

                {/* Key Engineering Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                    <div className="font-heading font-bold text-xs text-white flex items-center gap-2">
                      <Binary className="w-4 h-4 text-emerald-400" />
                      <span>Algorithmic Scheduling</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      Engineered zero-duplicate round-robin rotation and power-of-2 knockout trees with dynamic BYE seeds.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                    <div className="font-heading font-bold text-xs text-white flex items-center gap-2">
                      <Database className="w-4 h-4 text-cyan-400" />
                      <span>DBMS &amp; ACID Guarantees</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      Designed 11 normalized MySQL tables and multi-table atomic transactions with automated rollback safety.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => onOpenAuth('ADMIN')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-md cursor-pointer"
                  >
                    <span>Launch as System Admin</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={onOpenExportModal}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700/80 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Download Java 21 Codebase</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Ready to Launch Call to Action */}
      <section className="py-16 px-6 border-t border-slate-800/80 bg-slate-900/40">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-white">
            Experience ARENA-X Today
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Choose your role to enter the live management console, test live scores, or download the JavaFX source repository.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onOpenAuth('ADMIN')}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-md cursor-pointer"
            >
              Sign In as Admin (Dr. Vance)
            </button>
            <button
              onClick={() => onOpenAuth('ORGANIZER')}
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all shadow-md cursor-pointer"
            >
              Sign In as Organizer (Carter)
            </button>
            <button
              onClick={() => onOpenAuth('PLAYER')}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors cursor-pointer"
            >
              Sign In as Athlete (Rohit Sen)
            </button>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="border-t border-slate-800/80 bg-[#060911] px-6 py-10 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Credit */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <div className="font-heading font-black text-white text-sm tracking-wider">ARENA-X</div>
              <p className="text-[11px] text-slate-400 font-medium">
                Designed &amp; Developed by <span className="text-emerald-400 font-semibold">Pranav Sheelavantamath</span> — Founder &amp; CEO
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center gap-6 text-[11px] font-medium text-slate-400">
            <button onClick={onOpenExportModal} className="hover:text-emerald-400 transition-colors cursor-pointer">
              JavaFX Maven Repo
            </button>
            <button onClick={() => onOpenAuth('ADMIN')} className="hover:text-emerald-400 transition-colors cursor-pointer">
              Admin Portal
            </button>
            <button onClick={() => onOpenAuth('ORGANIZER')} className="hover:text-emerald-400 transition-colors cursor-pointer">
              Organizer Suite
            </button>
            <button onClick={() => onOpenAuth('PLAYER')} className="hover:text-emerald-400 transition-colors cursor-pointer">
              Athlete Dashboard
            </button>
          </div>

          {/* Copyright notice */}
          <div className="text-[11px] text-slate-400 text-center md:text-right">
            © 2026 ARENA-X Systems. All rights reserved. <br />
            Enterprise Sports Management &amp; DBMS Architecture.
          </div>
        </div>
      </footer>
    </div>
  );
};
