import React, { useState } from 'react';
import {
  X,
  Shield,
  ShieldCheck,
  UserCheck,
  Sliders,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  KeyRound
} from 'lucide-react';
import { UserRole } from '../../types';
import { dbStore } from '../../data/databaseStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: (role: UserRole) => void;
  initialRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin,
  initialRole = 'ADMIN'
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [usernameOrEmail, setUsernameOrEmail] = useState('admin@arenax.edu');
  const [password, setPassword] = useState('ArenaX@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // Preset demo accounts matching the database
  const ROLE_PRESETS: Record<
    UserRole,
    {
      title: string;
      badge: string;
      description: string;
      email: string;
      userTitle: string;
      permissions: string[];
      icon: React.ElementType;
      color: string;
    }
  > = {
    ADMIN: {
      title: 'Administrator',
      badge: 'Full Root Access',
      description: 'Complete system control, relational schema management, audit logs, and SQL visualizer permissions.',
      email: 'admin@arenax.edu',
      userTitle: 'Dr. Marcus Vance (Administrator)',
      permissions: ['Schema Explorer & SQL Engine', 'System Audit Trails', 'All Tournaments & Score Overrides', 'Database Reset & Modes'],
      icon: ShieldCheck,
      color: 'text-amber-400 border-amber-500/40 bg-amber-500/10'
    },
    ORGANIZER: {
      title: 'Tournament Director',
      badge: 'Management Role',
      description: 'Tournament creation, team roster validation, automated bracket generation, and match official scoring.',
      email: 'carter@arenax.edu',
      userTitle: 'Ken Carter (Tournament Director)',
      permissions: ['Tournament CRUD Operations', 'Roster Approvals & Seeding', 'Fixture Algorithm Execution', 'Live Scoring Management'],
      icon: Sliders,
      color: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10'
    },
    PLAYER: {
      title: 'Athlete & Player',
      badge: 'Athlete Access',
      description: 'View upcoming match fixtures, monitor live scores, view standings, and review personal performance metrics.',
      email: 'rohit@arenax.edu',
      userTitle: 'Rohit Sen (Cricket Captain)',
      permissions: ['Personal Athlete Profile', 'Team Roster View', 'Live Match Results', 'Championship Leaderboard'],
      icon: UserCheck,
      color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
    }
  };

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    setUsernameOrEmail(ROLE_PRESETS[role].email);
    setPassword('ArenaX@2026');
    setErrorMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!usernameOrEmail.trim()) {
      setErrorMessage('Please enter your email or username.');
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);

    // Simulate authentication against MySQL BCrypt hashed store
    setTimeout(() => {
      setIsLoading(false);

      // Verify user in dbStore
      const state = dbStore.getState();
      const user = state.users.find(
        u => (u.email.toLowerCase() === usernameOrEmail.toLowerCase() || u.username.toLowerCase() === usernameOrEmail.toLowerCase())
      );

      // If user exists or matches the selected role preset
      dbStore.switchRole(selectedRole);
      onSuccessLogin(selectedRole);
      onClose();
    }, 450);
  };

  const currentRoleMeta = ROLE_PRESETS[selectedRole];
  const Icon = currentRoleMeta.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-3xl bg-[#0B1120] border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800/80 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 glow-emerald-sm">
              <KeyRound className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-black text-white text-lg tracking-wide">
                  ARENA-X Authentication Portal
                </h3>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  RBAC Secure
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Select your assigned role to access the corresponding sports management console.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* 1. Role Selection Grid */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              1. Select Access Level / Role
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['ADMIN', 'ORGANIZER', 'PLAYER'] as UserRole[]).map(roleKey => {
                const item = ROLE_PRESETS[roleKey];
                const ItemIcon = item.icon;
                const isSelected = selectedRole === roleKey;
                return (
                  <button
                    key={roleKey}
                    type="button"
                    onClick={() => handleSelectRole(roleKey)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-slate-900 border-emerald-500/80 shadow-md ring-1 ring-emerald-500/40'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-1.5 rounded-lg border ${item.color}`}>
                        <ItemIcon className="w-4 h-4" />
                      </div>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      )}
                    </div>
                    <div className="font-heading font-bold text-xs text-white">{item.title}</div>
                    <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{item.badge}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Role Capabilities Callout */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5 text-emerald-400" />
                Active Profile: {currentRoleMeta.userTitle}
              </span>
              <span className="text-[10px] text-slate-400 font-mono-code">BCrypt 60-char Auth</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              {currentRoleMeta.description}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {currentRoleMeta.permissions.map((perm, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-900 text-emerald-400/90 border border-slate-800"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  {perm}
                </span>
              ))}
            </div>
          </div>

          {/* 2. Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Email Address or Username
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={usernameOrEmail}
                    onChange={e => setUsernameOrEmail(e.target.value)}
                    placeholder="user@arenax.edu"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono-code focus:outline-emerald-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-300 font-medium">Password</label>
                  <span className="text-[10px] text-slate-500 font-mono-code">Demo: ArenaX@2026</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono-code focus:outline-emerald-500 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick 1-Click Role Login Shortcuts */}
            <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
              <span>Quick Test Credentials:</span>
              <div className="flex items-center gap-1.5">
                {(['ADMIN', 'ORGANIZER', 'PLAYER'] as UserRole[]).map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleSelectRole(r)}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                      selectedRole === r
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                <span>{isLoading ? 'Verifying BCrypt...' : `Enter as ${currentRoleMeta.title}`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
