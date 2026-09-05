import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { sounds } from '../lib/audio';
import {
  User,
  Settings as SettingsIcon,
  Volume2,
  VolumeX,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  Zap,
  Save,
  Bell,
  Crown,
  CreditCard,
  Lock,
  Unlock,
  AlertTriangle,
  UserPlus
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    user,
    profile,
    updateName,
    logout,
    openPaywall,
    openAuthModal,
    cancelSubscription,
    expireTrialTesting,
    resetToNewUser,
    canUserPlay
  } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(sounds.isEnabled());
  const [subActionLoading, setSubActionLoading] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const access = canUserPlay();

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;

    setSaving(true);
    setSaveSuccess(false);
    try {
      await updateName(displayName.trim());
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update name:', err);
    } finally {
      setSaving(false);
    }
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.setEnabled(next);
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your BrainPulse Pro membership?')) return;
    setSubActionLoading(true);
    try {
      await cancelSubscription();
      setActionFeedback('Subscription canceled.');
      setTimeout(() => setActionFeedback(null), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubActionLoading(false);
    }
  };

  const handleExpireTrial = async () => {
    setSubActionLoading(true);
    try {
      await expireTrialTesting();
      setActionFeedback('Free trial expired! Paywall lock is now active for testing.');
      setTimeout(() => setActionFeedback(null), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubActionLoading(false);
    }
  };

  const handleResetToNewUser = async () => {
    setSubActionLoading(true);
    try {
      await resetToNewUser();
      setActionFeedback('Turned into a brand new user that just joined! 7-Day free trial active with 7 days remaining.');
      setTimeout(() => setActionFeedback(null), 5000);
    } catch (err) {
      console.error(err);
      setActionFeedback('Failed to reset user. Please check logs.');
    } finally {
      setSubActionLoading(false);
    }
  };

  const creationDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    : 'Recently';

  const trialExpiresDateStr = profile?.trialExpiresAt
    ? new Date(profile.trialExpiresAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'N/A';

  return (
    <div id="settings-view" className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300 text-slate-800">
      <div className="pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-extrabold tracking-wider uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Account & Audio ⚙️
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-black text-slate-900">Profile & Preferences</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Manage your athlete handle, subscription, sound effects, and sync settings.</p>
      </div>

      {/* Membership & Subscription Status Panel */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              profile?.isSubscribed ? 'bg-amber-100 text-amber-600' : 'bg-blue-50 text-blue-600'
            }`}>
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-black text-slate-900">Membership & Subscription</h2>
              <p className="text-xs text-slate-500">Manage your subscription, 1-week free trial, and access tier.</p>
            </div>
          </div>

          <div>
            {profile?.isSubscribed ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-black shadow-xs">
                <Crown className="w-3.5 h-3.5 fill-slate-950" />
                <span>Pro Active</span>
              </span>
            ) : user && access.canPlay ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-black">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>7-Day Free Trial ({access.daysLeft}d left)</span>
              </span>
            ) : user && !access.canPlay ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300 text-xs font-black">
                <Lock className="w-3.5 h-3.5" />
                <span>Trial Expired</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                Guest (Sign-in Required)
              </span>
            )}
          </div>
        </div>

        {actionFeedback && (
          <div className="mb-4 p-3 rounded-2xl bg-blue-50 border border-blue-200 text-xs font-bold text-blue-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{actionFeedback}</span>
          </div>
        )}

        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 mb-5 space-y-3">
          <div className="grid sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Current Tier</span>
              <span className="font-extrabold text-slate-800 text-sm">
                {profile?.isSubscribed
                  ? `BrainPulse Pro (${profile.subscriptionPlan === 'annual' ? 'Annual $119.99' : 'Monthly $9.99'})`
                  : user && access.canPlay
                  ? '7-Day Free Trial'
                  : user
                  ? 'Expired (Paywall Locked)'
                  : 'Unregistered Guest'}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Game Access</span>
              <span className={`font-extrabold text-sm flex items-center gap-1 ${
                access.canPlay ? 'text-emerald-600' : 'text-rose-600'
              }`}>
                {access.canPlay ? (
                  <>
                    <Unlock className="w-4 h-4" />
                    <span>Full Access (All 15 Games)</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Locked (Payment Required)</span>
                  </>
                )}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Trial Status</span>
              <span className="font-bold text-slate-700">
                {user ? `Ends: ${trialExpiresDateStr}` : 'Sign in to start 7-day trial'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {!profile?.isSubscribed ? (
            <button
              id="btn-upgrade-pro-settings"
              onClick={openPaywall}
              className="py-2.5 px-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white text-xs font-extrabold rounded-2xl shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer transition-all"
            >
              <Crown className="w-4 h-4 text-amber-300" />
              <span>{access.canPlay ? 'Upgrade to Pro Membership' : 'Subscribe to Unlock Games ($9.99/mo)'}</span>
            </button>
          ) : (
            <button
              id="btn-cancel-subscription"
              onClick={handleCancelSubscription}
              disabled={subActionLoading}
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-2xl transition-colors cursor-pointer"
            >
              Cancel Subscription
            </button>
          )}

          {!user && (
            <button
              id="btn-signin-settings"
              onClick={() => openAuthModal('play_gate')}
              className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl shadow-sm cursor-pointer"
            >
              Sign In to Start 7-Day Trial
            </button>
          )}

          {/* Developer / Testing Switcher Controls */}
          <div className="w-full pt-3 mt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <span className="text-[11px] font-medium text-slate-400">Sandbox Testing Controls:</span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                id="btn-reset-to-new-user"
                onClick={handleResetToNewUser}
                disabled={subActionLoading}
                title="Reset profile, stats, score, and history to simulate a brand new user that just joined with 7 days trial"
                className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
                <span>Turn Me Into Brand New User (Just Joined)</span>
              </button>

              <button
                type="button"
                id="btn-expire-trial"
                onClick={handleExpireTrial}
                disabled={subActionLoading}
                title="Fast-forward clock to simulate trial expiration and test paywall game blocking"
                className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-bold border border-amber-200 transition-colors cursor-pointer flex items-center gap-1"
              >
                <AlertTriangle className="w-3 h-3 text-amber-600" />
                <span>Simulate Expired Trial (Lock Games)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Management Form */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <h2 className="font-display text-xl font-black text-slate-900">Player Profile</h2>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div>
            <label className="block text-xs font-extrabold uppercase text-slate-500 tracking-wider mb-2">Display Name</label>
            <div className="flex gap-3">
              <input
                id="input-display-name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your name..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-cyan-500 font-bold"
              />
              <button
                id="btn-save-name"
                type="submit"
                disabled={saving || !displayName.trim() || displayName === profile?.displayName}
                className="py-3 px-6 bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 disabled:opacity-40 text-white text-xs font-extrabold rounded-2xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                {saving ? 'Saving...' : 'Save Name'}
              </button>
            </div>
          </div>

          {saveSuccess && (
            <div className="p-3.5 bg-lime-50 border border-lime-300 rounded-2xl flex items-center gap-2 text-xs font-bold text-lime-900 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-lime-600 shrink-0" />
              <span>Display name successfully updated!</span>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
              <span className="font-bold text-slate-400 uppercase text-[10px]">Email Account</span>
              <span className="font-mono font-bold text-slate-800 truncate max-w-[160px]">{user?.email || 'Authenticated'}</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
              <span className="font-bold text-slate-400 uppercase text-[10px]">Member Since</span>
              <span className="font-bold text-slate-800">{creationDate}</span>
            </div>
          </div>
        </form>
      </div>

      {/* Preferences & Sound */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
            <Volume2 className="w-4 h-4" />
          </div>
          <h2 className="font-display text-xl font-black text-slate-900">Audio & Sound FX</h2>
        </div>

        <div className="pt-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-extrabold text-slate-800">Game Audio Feedback</div>
              <div className="text-[11px] text-slate-500">Chimes, victory flourishes, countdown beeps, and tile taps.</div>
            </div>
            <button
              id="settings-sound-btn"
              onClick={toggleSound}
              className={`py-2 px-5 text-xs font-extrabold rounded-xl border transition-all cursor-pointer ${
                soundEnabled
                  ? 'bg-cyan-500 text-white border-cyan-500 shadow-md shadow-cyan-500/25'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              {soundEnabled ? 'Enabled 🔊' : 'Muted 🔇'}
            </button>
          </div>
        </div>
      </div>


      {/* Account Security & Sign Out */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">Session</span>
          <div className="font-display text-base font-black text-slate-900">Authenticated Player</div>
          <div className="text-[11px] text-slate-400 font-mono">UID: {user?.uid.slice(0, 10)}...</div>
        </div>

        <button
          id="btn-logout-settings"
          onClick={logout}
          className="py-2.5 px-6 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-extrabold rounded-2xl transition-colors cursor-pointer flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
