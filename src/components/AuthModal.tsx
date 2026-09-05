import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Brain, Lock, Mail, User, Sparkles, ArrowRight, CheckCircle2, ShieldAlert, KeyRound, Zap, Flame, Trophy, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen = true, onClose }) => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, sendPasswordReset, authModalReason } = useAuth();
  
  const [tab, setTab] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (tab === 'signin') {
        await signInWithEmail(email, password);
      } else if (tab === 'signup') {
        if (!name.trim()) {
          setError('Please provide your name or player handle.');
          setLoading(false);
          return;
        }
        await signUpWithEmail(email, password, name.trim());
      } else if (tab === 'forgot') {
        await sendPasswordReset(email);
        setSuccessMessage('Password reset link sent! Check your email inbox.');
      }
    } catch (err: any) {
      let msg = err.message || 'Authentication failed. Please check your credentials.';
      if (err.code === 'auth/operation-not-allowed') {
        msg = 'Email sign-in is not enabled in Firebase Console. Please sign in with Google or continue with the Instant Demo Profile.';
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password. Please try again.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists. Try signing in.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters long.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        setError('Google sign-in was canceled or interrupted. You can also use Instant Demo Profile or Email.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('demo.athlete@cortex.ai');
    setPassword('Cortex2026!');
    setError(null);
    setLoading(true);
    try {
      await signInWithEmail('demo.athlete@cortex.ai', 'Cortex2026!');
    } catch {
      try {
        await signUpWithEmail('demo.athlete@cortex.ai', 'Cortex2026!', 'Alex Vance');
      } catch (err: any) {
        setError('Could not initialize demo profile.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="auth-gate-container" className="min-h-screen bg-gradient-to-br from-cyan-50/60 via-slate-50 to-blue-50/50 flex flex-col items-center justify-center p-4 sm:p-6 text-slate-800 relative overflow-hidden">
      {/* Playful background decorative blurs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-lime-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-3/4 w-72 h-72 bg-orange-300/15 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-4xl grid md:grid-cols-12 bg-white border border-slate-200/90 rounded-3xl shadow-2xl shadow-blue-500/10 overflow-hidden relative z-10"
      >
        {/* Left Side: Brand & Feature Value Prop */}
        <div className="md:col-span-5 bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-lime-400/20 rounded-full blur-2xl" />

          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-2xl bg-white text-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/30">
                <Brain className="w-6 h-6" />
              </div>
              <span className="font-display text-2xl font-black tracking-tight text-white">
                CORTEX<span className="text-cyan-300">.AI</span>
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-[11px] font-extrabold uppercase tracking-wider text-cyan-200 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-lime-300" />
              <span>1-Week Free Trial Included</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-black text-white mb-3 leading-tight">
              Train your mind, boost memory & speed.
            </h2>
            <p className="text-xs sm:text-sm text-cyan-100 mb-6 leading-relaxed">
              Sign in to immediately start your 7-day full access free trial across all 15 cognitive games and wellness drills.
            </p>

            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xs">
                <div className="w-8 h-8 rounded-xl bg-cyan-400 text-slate-900 flex items-center justify-center font-black text-xs shadow-xs shrink-0">
                  <Zap className="w-4 h-4 fill-slate-900" />
                </div>
                <div>
                  <div className="text-xs font-black text-white">15 Brain Workouts</div>
                  <div className="text-[11px] text-cyan-100 font-medium">Memory, attention, speed, logic & relaxation</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xs">
                <div className="w-8 h-8 rounded-xl bg-lime-400 text-slate-900 flex items-center justify-center font-black text-xs shadow-xs shrink-0">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black text-white">7-Day Free Trial</div>
                  <div className="text-[11px] text-cyan-100 font-medium">Full game access with zero commitment</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xs">
                <div className="w-8 h-8 rounded-xl bg-orange-400 text-slate-900 flex items-center justify-center font-black text-xs shadow-xs shrink-0">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black text-white">Global Leaderboard</div>
                  <div className="text-[11px] text-cyan-100 font-medium">Rankings, personal bests, & streak tracker</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/15 flex items-center justify-between text-[11px] font-bold text-cyan-200">
            <span>Cloud Persistence Ready</span>
            <span className="flex items-center gap-1.5 text-lime-300 font-extrabold">
              <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse"></span> 7-Day Free Pass
            </span>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center bg-white">
          {/* Reason Notification Banner if triggered by play gate */}
          {authModalReason === 'play_gate' && (
            <div className="mb-4 p-3 rounded-2xl bg-blue-50 border border-blue-200 flex items-start gap-2.5 text-xs text-blue-900">
              <Lock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Sign In Required to Play</span>
                <span className="text-[11px] text-blue-700">
                  Sign in or create your account to activate your 7-day free trial and play all 15 brain games.
                </span>
              </div>
            </div>
          )}

          {/* Tab Selector */}
          <div className="flex items-center p-1.5 bg-slate-100 rounded-2xl mb-6">
            <button
              id="tab-signin"
              onClick={() => { setTab('signin'); setError(null); setSuccessMessage(null); }}
              className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                tab === 'signin'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In
            </button>
            <button
              id="tab-signup"
              onClick={() => { setTab('signup'); setError(null); setSuccessMessage(null); }}
              className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                tab === 'signup'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Register
            </button>
            <button
              id="tab-forgot"
              onClick={() => { setTab('forgot'); setError(null); setSuccessMessage(null); }}
              className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                tab === 'forgot'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Reset Pass
            </button>
          </div>

          {/* Google Sign In Button */}
          {tab !== 'forgot' && (
            <div className="mb-5">
              <button
                id="btn-google-auth"
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-slate-50 border-2 border-blue-200/80 hover:border-blue-400 rounded-2xl text-slate-800 text-xs font-extrabold shadow-xs transition-all disabled:opacity-50 cursor-pointer group"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.8 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.1 7.5 23 12 23z"
                  />
                </svg>
                <span>Continue with Google</span>
                <span className="ml-auto text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Cloud Sync
                </span>
              </button>

              <div className="relative my-4 flex items-center justify-center">
                <div className="border-t border-slate-200 w-full"></div>
                <span className="bg-white px-3 text-[10px] text-slate-400 uppercase tracking-wider font-extrabold absolute">
                  or email account
                </span>
              </div>
            </div>
          )}

          {/* Feedback messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-bold"
              >
                <div className="flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                  <span>{error}</span>
                </div>
              </motion.div>
            )}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3.5 bg-lime-50 border border-lime-300 rounded-2xl text-lime-900 text-xs font-bold"
              >
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-lime-600 mt-0.5" />
                  <span>{successMessage}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'signup' && (
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-500 tracking-wider mb-1.5">
                  Player Name
                </label>
                <div className="relative">
                  <input
                    id="input-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jordan Hayes"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-800 font-bold placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-500 tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="input-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="athlete@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-800 font-bold placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {tab !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-extrabold uppercase text-slate-500 tracking-wider">Password</label>
                  {tab === 'signin' && (
                    <button
                      type="button"
                      onClick={() => setTab('forgot')}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="input-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-800 font-bold placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            )}

            <button
              id="btn-auth-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-lime-500 hover:opacity-95 text-slate-900 font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 mt-3 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-3 border-slate-900 border-t-transparent rounded-full animate-spin" />
              ) : tab === 'signin' ? (
                <>
                  <span className="text-white">Sign In & Play</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              ) : tab === 'signup' ? (
                <>
                  <span className="text-white">Create Player Profile</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              ) : (
                <>
                  <span className="text-white">Send Reset Link</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              )}
            </button>
          </form>

            {/* Quick Demo Athlete & Guest Launch */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-center">
              <button
                id="btn-demo-login"
                type="button"
                onClick={handleDemoLogin}
                disabled={loading}
                className="w-full sm:w-auto text-xs font-extrabold text-blue-600 hover:text-blue-700 inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer bg-blue-50 hover:bg-blue-100 px-4 py-2.5 rounded-xl"
              >
                <Play className="w-3.5 h-3.5 fill-blue-600" />
                <span>Instant Demo Profile</span>
              </button>

              {onClose && (
                <button
                  id="btn-continue-guest"
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto text-xs font-extrabold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer px-4 py-2.5 rounded-xl hover:bg-slate-100"
                >
                  Play as Guest →
                </button>
              )}
            </div>
        </div>
      </motion.div>
    </div>
  );
};
