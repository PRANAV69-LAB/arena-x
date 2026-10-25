import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  RefreshCw,
  Download,
  AlertCircle,
  Database,
  Radio,
  Sliders,
  KeyRound
} from 'lucide-react';
import { dbStore } from '../data/databaseStore';
import { UserRole } from '../types';

interface HeaderProps {
  title: string;
  subtitle: string;
  onOpenExportModal: () => void;
  onOpenLandingPage?: () => void;
  onOpenAuthModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onOpenExportModal,
  onOpenLandingPage,
  onOpenAuthModal
}) => {
  const state = dbStore.getState();
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleRoleChange = (role: UserRole) => {
    dbStore.switchRole(role);
  };

  const handleModeChange = (mode: 'DEMO' | 'LOCAL' | 'API') => {
    dbStore.setDataMode(mode);
  };

  const handleReset = () => {
    dbStore.resetDatabase();
    setShowConfirmReset(false);
  };

  return (
    <header className="border-b border-slate-800/80 bg-[#0A0F1D]/80 backdrop-blur-md px-6 py-3.5 sticky top-0 z-30 flex flex-col gap-2.5">
      {/* Top Banner Notice */}
      <div className="flex items-center justify-between text-[11px] px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-emerald-300">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-white">ARENA-X Architecture:</span>
          <span>
            Enterprise Java 21 + JavaFX Desktop System with MySQL 8.0 &amp; JDBC. Complete Maven project available for 1-click ZIP export.
          </span>
        </div>
        <button
          onClick={onOpenExportModal}
          className="underline font-semibold hover:text-white transition-colors cursor-pointer shrink-0 ml-3"
        >
          View / Download Java Project →
        </button>
      </div>

      {/* Main Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-heading font-bold text-white tracking-wide flex items-center gap-2.5">
            {title}
          </h1>
          <p className="text-xs text-slate-400 font-normal">{subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Active Data Mode Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] text-slate-400">Mode:</span>
            <select
              value={state.dataMode}
              onChange={(e) => handleModeChange(e.target.value as any)}
              aria-label="Select Active Data Mode"
              className="bg-transparent text-emerald-400 font-semibold text-xs focus:outline-none cursor-pointer"
            >
              <option value="DEMO" className="bg-slate-900 text-slate-200">Demo Data (Seeded)</option>
              <option value="LOCAL" className="bg-slate-900 text-slate-200">Local Tournaments</option>
              <option value="API" className="bg-slate-900 text-slate-200">External Sports API</option>
            </select>
          </div>

          {/* Role Switcher */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            {state.currentUser.role === 'ADMIN' ? (
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            ) : state.currentUser.role === 'ORGANIZER' ? (
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            ) : (
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span className="text-[11px] text-slate-400">Role:</span>
            <select
              value={state.currentUser.role}
              onChange={(e) => handleRoleChange(e.target.value as UserRole)}
              aria-label="Select User Role"
              className="bg-transparent text-white font-semibold text-xs focus:outline-none cursor-pointer"
            >
              <option value="ADMIN" className="bg-slate-900 text-slate-200">Admin (Dr. Vance)</option>
              <option value="ORGANIZER" className="bg-slate-900 text-slate-200">Organizer (Carter)</option>
              <option value="PLAYER" className="bg-slate-900 text-slate-200">Player (Rohit Sen)</option>
            </select>
          </div>

          {/* Quick Database Reset Button */}
          <button
            onClick={() => setShowConfirmReset(true)}
            title="Reset database to fresh seed state"
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Export Java Button */}
          <button
            onClick={onOpenExportModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Java ZIP</span>
          </button>

          {/* Return to Public Portal */}
          {onOpenLandingPage && (
            <button
              onClick={onOpenLandingPage}
              title="Return to Public Landing Page"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            >
              <span>Public Portal</span>
            </button>
          )}

          {/* Switch Role / Login */}
          {onOpenAuthModal && (
            <button
              onClick={onOpenAuthModal}
              title="Switch user account or log in"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Switch Role</span>
            </button>
          )}
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Reset Database to Seed State?</h3>
                <p className="text-xs text-slate-400 mt-1">
                  This will reload the pristine MySQL seed dataset (22 teams, 110 athletes, 4 tournaments, 34+ matches). Any manual test changes will be overwritten.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950"
              >
                Yes, Reset Database
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
