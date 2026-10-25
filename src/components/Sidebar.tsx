import React from 'react';
import {
  LayoutDashboard,
  Trophy,
  Users,
  UserCheck,
  CalendarDays,
  Activity,
  Award,
  BarChart3,
  Database,
  Settings,
  Download,
  Server,
  Layers
} from 'lucide-react';
import { dbStore } from '../data/databaseStore';

export type NavigationTab =
  | 'dashboard'
  | 'tournaments'
  | 'teams'
  | 'players'
  | 'fixtures'
  | 'scores'
  | 'leaderboards'
  | 'analytics'
  | 'sql-explorer'
  | 'settings';

interface SidebarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onOpenExportModal: () => void;
  onOpenLandingPage?: () => void;
  onOpenAuthModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onOpenExportModal,
  onOpenLandingPage,
  onOpenAuthModal
}) => {
  const state = dbStore.getState();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tournaments', label: 'Tournaments', icon: Trophy, count: state.tournaments.length },
    { id: 'teams', label: 'Teams', icon: Users, count: state.teams.length },
    { id: 'players', label: 'Players', icon: UserCheck, count: state.players.length },
    { id: 'fixtures', label: 'Fixtures & Brackets', icon: CalendarDays },
    { id: 'scores', label: 'Live Scores', icon: Activity, live: state.matches.filter(m => m.status === 'LIVE').length },
    { id: 'leaderboards', label: 'Leaderboards', icon: Award },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'sql-explorer', label: 'SQL Explorer', icon: Database, highlight: true },
    { id: 'settings', label: 'Settings & Modes', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0A0F1D] border-r border-slate-800/80 flex flex-col shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 glow-emerald-sm">
            <Trophy className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-black text-xl tracking-wider text-white">ARENA</span>
              <span className="font-heading font-black text-xl tracking-wider text-emerald-400">-X</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Sports &amp; SQL DBMS</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Management Modules
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id as NavigationTab)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-300 font-semibold border-l-2 border-emerald-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              } ${item.highlight && !isActive ? 'hover:bg-emerald-950/20 text-emerald-400/90' : ''}`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive
                      ? 'text-emerald-400'
                      : item.highlight
                      ? 'text-emerald-400/80 group-hover:text-emerald-300'
                      : 'text-slate-400 group-hover:text-slate-300'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.live ? (
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  {item.live} LIVE
                </span>
              ) : item.count !== undefined ? (
                <span className="text-[11px] text-slate-400 font-mono-code px-1.5 py-0.5 rounded bg-slate-800/60">
                  {item.count}
                </span>
              ) : item.highlight ? (
                <span className="text-[9px] uppercase tracking-wider font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-1.5 py-0.5 rounded">
                  DBMS
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Java & Database Status Box */}
      <div className="p-3.5 m-3 rounded-xl bg-slate-900/90 border border-slate-800/90 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300 font-medium">
            <Server className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px]">Database Engine</span>
          </div>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            MySQL 8.0
          </span>
        </div>

        <div className="text-[11px] text-slate-400 leading-tight">
          Database: <span className="text-slate-300 font-mono-code">arena_x_db</span>
          <br />
          Tables: <span className="text-slate-300 font-mono-code">11 Normalized</span>
        </div>

        <button
          onClick={onOpenExportModal}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition-all shadow-sm"
        >
          <Download className="w-3.5 h-3.5 text-emerald-400" />
          <span>Export Java 21 Project</span>
        </button>
      </div>

      {/* Footer User Info */}
      <div className="p-3 border-t border-slate-800/80 space-y-2 text-xs text-slate-400">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold text-[10px]">
              {state.currentUser.full_name.charAt(0)}
            </div>
            <div className="truncate">
              <p className="text-[11px] font-semibold text-slate-200 truncate">{state.currentUser.full_name}</p>
              <p className="text-[9px] text-emerald-400 font-mono-code">{state.currentUser.role}</p>
            </div>
          </div>

          {onOpenAuthModal && (
            <button
              onClick={onOpenAuthModal}
              title="Switch user account"
              className="text-[10px] text-slate-400 hover:text-emerald-400 font-medium cursor-pointer"
            >
              Switch
            </button>
          )}
        </div>

        {onOpenLandingPage && (
          <button
            onClick={onOpenLandingPage}
            className="w-full py-1.5 px-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-[11px] text-slate-300 hover:text-white transition-colors text-center cursor-pointer font-medium"
          >
            ← Public Landing Page
          </button>
        )}
      </div>
    </aside>
  );
};
