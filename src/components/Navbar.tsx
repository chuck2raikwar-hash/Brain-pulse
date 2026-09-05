import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Brain,
  Flame,
  Zap,
  Trophy,
  LayoutDashboard,
  Gamepad2,
  Swords,
  LineChart,
  Settings,
  LogOut,
  Volume2,
  VolumeX,
  Sparkles,
  User as UserIcon,
  ChevronDown,
  Crown,
  CreditCard,
  Lock
} from 'lucide-react';
import { sounds } from '../lib/audio';

export type NavTab = 'dashboard' | 'games' | 'pvp' | 'progress' | 'leaderboard' | 'settings';

interface NavbarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  activeGameId?: string | null;
  onExitGame?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  activeGameId,
  onExitGame
}) => {
  const { user, profile, logout, openAuthModal, openPaywall, canUserPlay } = useAuth();
  const [soundEnabled, setSoundEnabled] = useState(sounds.isEnabled());
  const [menuOpen, setMenuOpen] = useState(false);

  const access = canUserPlay();

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.setEnabled(next);
  };

  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard' },
    { id: 'games' as NavTab, label: 'Games' },
    { id: 'pvp' as NavTab, label: 'PvP' },
    { id: 'progress' as NavTab, label: 'Progress' },
    { id: 'leaderboard' as NavTab, label: 'Leaderboard' },
    { id: 'settings' as NavTab, label: 'Settings' },
  ];

  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
    : '2026';

  const userInitials = profile?.displayName
    ? profile.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'NL';

  return (
    <header id="app-navbar" className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-6 lg:gap-10">
          <button
            id="brand-logo-btn"
            onClick={() => {
              if (activeGameId && onExitGame) {
                onExitGame();
              }
              onTabChange('dashboard');
            }}
            className="flex items-center gap-3 text-left group focus:outline-none cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-lime-400 p-0.5 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <Brain className="w-5 h-5 text-blue-600 group-hover:text-cyan-500 transition-colors" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl font-black tracking-tight text-slate-900 flex items-center gap-1">
                Brain<span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Pulse</span>
                <span className="w-2 h-2 rounded-full bg-lime-400 inline-block animate-pulse"></span>
              </span>
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase -mt-0.5">
                Brain Fitness Gym
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-2xl border border-slate-200/60 text-xs font-bold">
            {navItems.map((item) => {
              const isActive = currentTab === item.id && !activeGameId;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => {
                    if (activeGameId && onExitGame) onExitGame();
                    onTabChange(item.id);
                  }}
                  className={`transition-all px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                  }`}
                >
                  {item.id === 'dashboard' && <LayoutDashboard className="w-3.5 h-3.5" />}
                  {item.id === 'games' && <Gamepad2 className="w-3.5 h-3.5" />}
                  {item.id === 'pvp' && <Swords className="w-3.5 h-3.5" />}
                  {item.id === 'progress' && <LineChart className="w-3.5 h-3.5" />}
                  {item.id === 'leaderboard' && <Trophy className="w-3.5 h-3.5" />}
                  {item.id === 'settings' && <Settings className="w-3.5 h-3.5" />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right: Metrics, Sound, and User Profile Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Subscription / Free Trial Status Badge */}
          {user && (profile?.isSubscribed || profile?.subscriptionStatus === 'active') ? (
            <button
              id="navbar-pro-badge"
              onClick={openPaywall}
              title="Pro Member - Unlimited Access"
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 px-3 py-1.5 rounded-full text-xs font-black shadow-xs hover:brightness-105 transition-all cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5 fill-slate-950" />
              <span>PRO</span>
            </button>
          ) : user && access.canPlay ? (
            <button
              id="navbar-trial-badge"
              onClick={openPaywall}
              title={`${access.daysLeft} day(s) left in your 7-day free trial. Click to subscribe.`}
              className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-300 text-emerald-700 hover:bg-emerald-100 px-3 py-1.5 rounded-full text-xs font-extrabold shadow-xs transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Trial: {access.daysLeft}d left</span>
            </button>
          ) : user && !access.canPlay ? (
            <button
              id="navbar-expired-badge"
              onClick={openPaywall}
              title="Your 7-day free trial has expired. Subscribe to unlock all games."
              className="flex items-center gap-1.5 bg-rose-50 border border-rose-300 text-rose-700 hover:bg-rose-100 px-3 py-1.5 rounded-full text-xs font-black shadow-xs transition-all cursor-pointer animate-pulse"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Trial Expired • Unlock</span>
            </button>
          ) : (
            <button
              id="navbar-guest-trial-btn"
              onClick={() => openAuthModal('play_gate')}
              title="Sign in to start your 7-Day Free Trial"
              className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-3 py-1.5 rounded-full text-xs font-extrabold shadow-xs hover:opacity-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-lime-300" />
              <span className="hidden sm:inline">Start 7-Day Free Trial</span>
              <span className="sm:hidden">Free Trial</span>
            </button>
          )}

          {/* Daily Streak Indicator */}
          <div
            id="user-streak-badge"
            title={`Daily Streak: ${profile?.dailyStreak || 1} day(s)`}
            className="flex items-center gap-1.5 bg-orange-50 border border-orange-200/90 text-orange-600 px-3 py-1.5 rounded-full text-xs font-extrabold shadow-xs"
          >
            <Flame className="w-4 h-4 text-orange-500 fill-orange-400 animate-bounce" />
            <span>{profile?.dailyStreak || 1}d Streak</span>
          </div>

          {/* Total Brain Power / Score Badge */}
          <div
            id="user-total-score-badge"
            title="Total Brain Power Points"
            className="hidden sm:flex items-center gap-1.5 bg-blue-50 border border-blue-200/90 text-blue-700 px-3.5 py-1.5 rounded-full text-xs font-extrabold shadow-xs"
          >
            <Zap className="w-3.5 h-3.5 text-blue-600 fill-blue-500" />
            <span className="font-mono font-bold">{profile?.brainPowerScore?.toLocaleString() || '100'}</span>
            <span className="text-[10px] text-blue-500 font-semibold uppercase">PTS</span>
          </div>

          {/* Sound FX Toggle */}
          <button
            id="sound-toggle-btn"
            onClick={toggleSound}
            title={soundEnabled ? 'Mute Sound Effects' : 'Unmute Sound Effects'}
            className="p-2 rounded-xl bg-slate-100 hover:bg-cyan-50 border border-slate-200 text-slate-700 hover:text-cyan-600 transition-colors cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* User Profile Dropdown / Log Out */}
          <div className="relative">
            <button
              id="user-profile-menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 p-1 rounded-2xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all text-xs cursor-pointer"
            >
              {profile?.photoURL ? (
                <img
                  src={profile.photoURL}
                  alt={profile.displayName}
                  className="w-9 h-9 rounded-xl object-cover border-2 border-cyan-400"
                />
              ) : (
                <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 via-cyan-500 to-lime-400 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-sm">
                  {userInitials}
                </div>
              )}
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {menuOpen && (
              <div
                id="user-dropdown-menu"
                className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-slate-800"
              >
                <div className="px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-100 mb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-cyan-600 uppercase tracking-wider">
                      {user ? 'Brain Athlete' : 'Guest Profile'}
                    </span>
                    {profile?.isSubscribed ? (
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                        Pro Active
                      </span>
                    ) : user ? (
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        7-Day Trial
                      </span>
                    ) : null}
                  </div>
                  <div className="font-bold text-sm truncate text-slate-900 mt-0.5">{profile?.displayName || 'Brain Athlete'}</div>
                  <div className="text-xs text-slate-400 truncate font-mono">{user?.email || 'Sign in to start free trial'}</div>
                </div>

                {!user && (
                  <button
                    id="dropdown-signin-btn"
                    onClick={() => {
                      setMenuOpen(false);
                      openAuthModal('play_gate');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold transition-all mb-1.5 shadow-sm cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-lime-300" />
                    <span>Sign In & Start 7-Day Trial</span>
                  </button>
                )}

                <button
                  id="dropdown-subscription-btn"
                  onClick={() => {
                    setMenuOpen(false);
                    openPaywall();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-100 font-semibold transition-colors cursor-pointer mb-1"
                >
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span>{profile?.isSubscribed ? 'Manage Subscription' : 'Upgrade to Pro'}</span>
                </button>

                <button
                  id="dropdown-settings-link"
                  onClick={() => {
                    setMenuOpen(false);
                    if (activeGameId && onExitGame) onExitGame();
                    onTabChange('settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-100 font-semibold transition-colors cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-slate-500" />
                  <span>Profile & Sound Settings</span>
                </button>

                {user && (
                  <button
                    id="dropdown-logout-btn"
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 font-semibold transition-colors mt-1 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Tab Bar Sub-Header */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200/80 bg-white/95 py-2 px-2">
        {navItems.map((item) => {
          const isActive = currentTab === item.id && !activeGameId;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (activeGameId && onExitGame) onExitGame();
                onTabChange(item.id);
              }}
              className={`py-1 px-2.5 rounded-lg text-xs font-bold transition-all ${
                isActive ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
