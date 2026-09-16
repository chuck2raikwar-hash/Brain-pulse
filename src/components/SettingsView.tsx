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
  UserPlus,
  Download,
  Smartphone,
  Copy,
  Check,
  Loader2,
  Code2
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
  const [hasCopiedCmds, setHasCopiedCmds] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState<string | null>(null);

  const access = canUserPlay();

  const handleDownloadZip = async (fileName: string) => {
    try {
      setDownloadingZip(fileName);
      sounds.playTick();
      const response = await fetch(`/${fileName}`);
      if (!response.ok) {
        throw new Error(`Failed to download ${fileName}: ${response.statusText}`);
      }
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      sounds.playCorrect();
    } catch (err) {
      console.error('Download error:', err);
      // Fallback directly
      window.location.href = `/${fileName}`;
    } finally {
      setDownloadingZip(null);
    }
  };

  const handleCopyCommands = () => {
    const text = `npm install\nnpm run build\nnpx cap sync\n# To open in Android Studio:\nnpx cap open android\n# To open in Xcode (macOS):\nnpx cap open ios`;
    navigator.clipboard.writeText(text);
    setHasCopiedCmds(true);
    sounds.playTick();
    setTimeout(() => setHasCopiedCmds(false), 2500);
  };

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
      <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-sm relative overflow-hidden">
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
      <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-sm">
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
      <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-sm">
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

      {/* 100% React Native Mobile Application Card */}
      <div className="bg-gradient-to-br from-cyan-950 via-slate-900 to-slate-900 border border-cyan-500/40 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-2xl text-white relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/30 text-cyan-200 border border-cyan-400/40 tracking-wider">
                    React Native &bull; Expo SDK 52
                  </span>
                  <span className="text-[10px] font-bold text-slate-300">iOS &bull; Android</span>
                </div>
                <h2 className="font-display text-xl sm:text-2xl font-black text-white mt-0.5">
                  React Native Mobile Application
                </h2>
              </div>
            </div>

            <button
              id="btn-download-react-native-zip"
              type="button"
              disabled={downloadingZip !== null}
              onClick={() => handleDownloadZip('brainpulse-react-native.zip')}
              className="py-3 px-6 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:opacity-95 disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-xl shadow-cyan-500/30 flex items-center justify-center gap-2.5 transition-all cursor-pointer whitespace-nowrap active:scale-98"
            >
              {downloadingZip === 'brainpulse-react-native.zip' ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Download className="w-4 h-4 text-white" />
              )}
              <span>
                {downloadingZip === 'brainpulse-react-native.zip'
                  ? 'Downloading React Native ZIP...'
                  : 'Download React Native (.ZIP)'}
              </span>
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl mb-4">
            Full cross-platform conversion written in <strong>TypeScript, React Native, and Expo SDK 52</strong>. Includes native bottom tab navigation, AsyncStorage persistence, Expo Haptics tactile responses, and pure React Native implementations of Color Confusion (Stroop), Memory Matrix, Reaction Speed, 2-Back, and 4-7-8 Breathing Pacer.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-cyan-500/30">
              <div className="text-[10px] font-black uppercase text-cyan-300 mb-1">📱 Expo / React Native App</div>
              <div className="text-xs text-slate-300 font-medium">Ready for <code>npx expo start</code>, Expo Go, or EAS build</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-sky-500/30">
              <div className="text-[10px] font-black uppercase text-sky-300 mb-1">⚡ Native Components</div>
              <div className="text-xs text-slate-300 font-medium">Built with View, Text, TouchableOpacity, and native haptics</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-blue-500/30">
              <div className="text-[10px] font-black uppercase text-blue-300 mb-1">🍎 Cross-Platform iOS &amp; Android</div>
              <div className="text-xs text-slate-300 font-medium">One codebase targeting iPhones, iPads, and Android devices</div>
            </div>
          </div>
        </div>
      </div>

      {/* 100% Native Swift & SwiftUI Application Card */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 border border-indigo-500/40 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-2xl text-white relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                <Code2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/40 tracking-wider">
                    Pure Native Swift &bull; SwiftUI
                  </span>
                  <span className="text-[10px] font-bold text-slate-300">iOS 16+ &bull; Xcode 15+</span>
                </div>
                <h2 className="font-display text-xl sm:text-2xl font-black text-white mt-0.5">
                  Native Swift iOS Application
                </h2>
              </div>
            </div>

            <button
              id="btn-download-swift-native-zip"
              type="button"
              disabled={downloadingZip !== null}
              onClick={() => handleDownloadZip('brainpulse-swift-native.zip')}
              className="py-3 px-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-95 disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-2.5 transition-all cursor-pointer whitespace-nowrap active:scale-98"
            >
              {downloadingZip === 'brainpulse-swift-native.zip' ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Download className="w-4 h-4 text-white" />
              )}
              <span>
                {downloadingZip === 'brainpulse-swift-native.zip'
                  ? 'Downloading Swift ZIP...'
                  : 'Download Native Swift (.ZIP)'}
              </span>
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl mb-4">
            Converted from the React web stack to a <strong>100% pure Apple Swift 5.9+ &amp; SwiftUI codebase</strong>. Includes full MVVM architecture, native AVFoundation audio synthesizer, UIKit tactile haptics, standalone <code>BrainPulse.xcodeproj</code>, and pure SwiftUI implementations of the flagship cognitive drills.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-indigo-500/30">
              <div className="text-[10px] font-black uppercase text-indigo-300 mb-1">🛠 Native Xcode Project</div>
              <div className="text-xs text-slate-300 font-medium">Includes <code>BrainPulse.xcodeproj</code> with target schemas &amp; Info.plist</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-purple-500/30">
              <div className="text-[10px] font-black uppercase text-purple-300 mb-1">🎨 Pure SwiftUI Views</div>
              <div className="text-xs text-slate-300 font-medium">Memory Matrix, Reaction Speed, Stroop, 4-7-8 Breathing &amp; N-Back</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-pink-500/30">
              <div className="text-[10px] font-black uppercase text-pink-300 mb-1">⚡ Zero Webviews</div>
              <div className="text-xs text-slate-300 font-medium">100% native compiled execution with 120 FPS ProMotion responsiveness</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile App Download Card (iOS & Android) */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-xl text-white relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-44 h-44 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Capacitor Cross-Platform
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">iOS &bull; Android &bull; Web</span>
                </div>
                <h2 className="font-display text-xl font-black text-white mt-0.5">
                  Mobile App Package (.ZIP)
                </h2>
              </div>
            </div>

            {/* Download Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                id="btn-download-xcode-zip"
                type="button"
                disabled={downloadingZip !== null}
                onClick={() => handleDownloadZip('brainpulse-ios-xcode.zip')}
                className="py-2.5 px-4.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-95 disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
              >
                {downloadingZip === 'brainpulse-ios-xcode.zip' ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Download className="w-4 h-4 text-white" />
                )}
                <span>
                  {downloadingZip === 'brainpulse-ios-xcode.zip'
                    ? 'Preparing Xcode ZIP...'
                    : 'Download Xcode iOS (.ZIP)'}
                </span>
              </button>

              <button
                id="btn-download-mobile-zip"
                type="button"
                disabled={downloadingZip !== null}
                onClick={() => handleDownloadZip('brainpulse-mobile-app.zip')}
                className="py-2.5 px-4.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 border border-slate-600/80 text-cyan-300 text-xs font-bold uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
              >
                {downloadingZip === 'brainpulse-mobile-app.zip' ? (
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-300" />
                ) : (
                  <Download className="w-4 h-4 text-cyan-300" />
                )}
                <span>
                  {downloadingZip === 'brainpulse-mobile-app.zip'
                    ? 'Preparing Mobile ZIP...'
                    : 'Full Mobile Bundle (.ZIP)'}
                </span>
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl mb-4">
            Download the complete cross-platform mobile package. Includes pre-configured native projects for <strong>Android Studio (Gradle)</strong> and <strong>Xcode (iOS)</strong>, compiled web assets, audio synthesizer engine, and all 15 cognitive training modules.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
              <div className="text-[10px] font-extrabold uppercase text-cyan-400 mb-1">🤖 Android Studio</div>
              <div className="text-xs text-slate-300 font-medium">Ready for Gradle APK / Play Store Bundle build</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
              <div className="text-[10px] font-extrabold uppercase text-indigo-400 mb-1">🍏 Apple iOS</div>
              <div className="text-xs text-slate-300 font-medium">Full Xcode workspace with iPhone/iPad simulator support</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
              <div className="text-[10px] font-extrabold uppercase text-emerald-400 mb-1">⚡ Hot Sync</div>
              <div className="text-xs text-slate-300 font-medium">Fast reload workflow using <code>npx cap sync</code></div>
            </div>
          </div>

          {/* Quick instructions & copy command bar */}
          <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="font-mono text-[11px] text-slate-300 bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800 flex-1 overflow-x-auto">
              <code>npm install &amp;&amp; npm run build &amp;&amp; npx cap open android</code>
            </div>

            <button
              id="btn-copy-mobile-cmds"
              type="button"
              onClick={handleCopyCommands}
              className="py-2 px-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
            >
              {hasCopiedCmds ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Run Steps</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Account Security & Sign Out */}
      <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-sm flex items-center justify-between">
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
