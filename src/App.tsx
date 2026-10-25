import React, { useState, useEffect } from 'react';
import { Sidebar, NavigationTab } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { TournamentsView } from './components/TournamentsView';
import { TeamsView } from './components/TeamsView';
import { PlayersView } from './components/PlayersView';
import { FixturesView } from './components/FixturesView';
import { LiveScoresView } from './components/LiveScoresView';
import { LeaderboardsView } from './components/LeaderboardsView';
import { AnalyticsView } from './components/AnalyticsView';
import { SqlExplorerView } from './components/SqlExplorer/SqlExplorerView';
import { SettingsView } from './components/SettingsView';
import { JavaExportModal } from './components/JavaExportModal';
import { LandingPage } from './components/LandingPage/LandingPage';
import { AuthModal } from './components/Auth/AuthModal';
import { dbStore } from './data/databaseStore';
import { UserRole } from './types';

export default function App() {
  const [viewMode, setViewMode] = useState<'landing' | 'app'>('landing');
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [targetTournamentId, setTargetTournamentId] = useState<number | null>(null);
  const [targetMatchId, setTargetMatchId] = useState<number | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialRole, setAuthInitialRole] = useState<UserRole>('ADMIN');
  const [, setTick] = useState(0);

  // Subscribe to database state modifications so views re-render in real time
  useEffect(() => {
    const unsubscribe = dbStore.subscribe(() => {
      setTick(prev => prev + 1);
    });
    return unsubscribe;
  }, []);

  const handleOpenAuth = (role: UserRole = 'ADMIN') => {
    setAuthInitialRole(role);
    setIsAuthModalOpen(true);
  };

  const handleSuccessLogin = (role: UserRole) => {
    setViewMode('app');
    // Role-based initial landing module
    if (role === 'ADMIN') {
      setActiveTab('dashboard');
    } else if (role === 'ORGANIZER') {
      setActiveTab('tournaments');
    } else {
      setActiveTab('players');
    }
  };

  const getModuleMeta = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Tournament Command Center',
          subtitle: 'Live statistics, ongoing matches, and relational database activity stream.'
        };
      case 'tournaments':
        return {
          title: 'Tournament Management',
          subtitle: 'Create, schedule, and approve collegiate competitions across Knockout, Round Robin, and League formats.'
        };
      case 'teams':
        return {
          title: 'Squad & Team Roster Directory',
          subtitle: 'Manage 22 collegiate sports squads, player rosters, and captains.'
        };
      case 'players':
        return {
          title: 'Athlete & Player Profiles',
          subtitle: '110 student athletes across Cricket, Football, Badminton, and Basketball.'
        };
      case 'fixtures':
        return {
          title: 'Automated Fixtures & Tournament Brackets',
          subtitle: 'Single elimination knockout trees with BYE handling and round-robin schedule generator.'
        };
      case 'scores':
        return {
          title: 'Live Scoring Console & Result Management',
          subtitle: 'Sport-specific scorekeeping for Cricket (Runs/Overs), Football (Goals), Badminton (Sets), and Basketball (Quarters).'
        };
      case 'leaderboards':
        return {
          title: 'Championship Leaderboards & Points Table',
          subtitle: 'Standings dynamically compiled from completed match results in MySQL storage.'
        };
      case 'analytics':
        return {
          title: 'Sports Analytics & Performance Metrics',
          subtitle: 'Win percentage efficiency, scoring volumes, and home/away breakdown.'
        };
      case 'sql-explorer':
        return {
          title: 'Interactive SQL Explorer & Educational DBMS Engine',
          subtitle: 'Inspect 11 normalized tables, generate ER diagrams, run queries, and trace SQL logical pipelines.'
        };
      case 'settings':
        return {
          title: 'System Settings & Data Modes',
          subtitle: 'Toggle Demo, Local, or API modes, test safety controls, and export the Java 21 desktop project.'
        };
    }
  };

  const meta = getModuleMeta();

  return (
    <>
      {viewMode === 'landing' ? (
        <LandingPage
          onOpenAuth={handleOpenAuth}
          onOpenExportModal={() => setIsExportModalOpen(true)}
          onQuickEnter={() => setViewMode('app')}
        />
      ) : (
        <div className="flex h-screen w-screen overflow-hidden bg-[#080C15] text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
          {/* 1. Sidebar Navigation */}
          <Sidebar
            activeTab={activeTab}
            onSelectTab={(tab) => {
              setActiveTab(tab);
              setTargetTournamentId(null);
              setTargetMatchId(null);
            }}
            onOpenExportModal={() => setIsExportModalOpen(true)}
            onOpenLandingPage={() => setViewMode('landing')}
            onOpenAuthModal={() => handleOpenAuth()}
          />

          {/* 2. Main Content Area */}
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <Header
              title={meta.title}
              subtitle={meta.subtitle}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              onOpenLandingPage={() => setViewMode('landing')}
              onOpenAuthModal={() => handleOpenAuth()}
            />

            <main className="flex-1 overflow-y-auto px-6 py-6">
              <div className="max-w-7xl mx-auto">
                {activeTab === 'dashboard' && (
                  <DashboardView onNavigate={(tab) => setActiveTab(tab)} />
                )}
                {activeTab === 'tournaments' && (
                  <TournamentsView
                    onOpenFixtures={(tournId) => {
                      setTargetTournamentId(tournId);
                      setActiveTab('fixtures');
                    }}
                  />
                )}
                {activeTab === 'teams' && <TeamsView />}
                {activeTab === 'players' && <PlayersView />}
                {activeTab === 'fixtures' && (
                  <FixturesView
                    initialTournamentId={targetTournamentId}
                    onOpenLiveScore={(matchId) => {
                      setTargetMatchId(matchId);
                      setActiveTab('scores');
                    }}
                  />
                )}
                {activeTab === 'scores' && (
                  <LiveScoresView initialMatchId={targetMatchId} />
                )}
                {activeTab === 'leaderboards' && <LeaderboardsView />}
                {activeTab === 'analytics' && <AnalyticsView />}
                {activeTab === 'sql-explorer' && <SqlExplorerView />}
                {activeTab === 'settings' && (
                  <SettingsView onOpenExportModal={() => setIsExportModalOpen(true)} />
                )}
              </div>
            </main>
          </div>
        </div>
      )}

      {/* Role-Based Authentication Portal Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccessLogin={handleSuccessLogin}
        initialRole={authInitialRole}
      />

      {/* Java Project Source & ZIP Export Modal */}
      <JavaExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </>
  );
}
