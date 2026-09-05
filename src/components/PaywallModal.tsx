import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { SubscriptionPlan } from '../types';
import {
  Brain,
  Check,
  CreditCard,
  Lock,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
  Award,
  ArrowRight,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  gameTitle?: string;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  gameTitle
}) => {
  const { profile, subscribe } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('annual');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [cardName, setCardName] = useState(profile?.displayName || 'Brain Athlete');
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  if (!isOpen) return null;

  const isTrialExpired = profile?.subscriptionStatus === 'expired';

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate real-world secure payment authorization latency
      await new Promise(res => setTimeout(res, 850));
      await subscribe(selectedPlan);
      setPurchaseSuccess(true);
      setTimeout(() => {
        setIsProcessing(false);
        setPurchaseSuccess(false);
        if (onSuccess) {
          onSuccess();
        } else {
          onClose();
        }
      }, 1200);
    } catch (err) {
      console.error('Subscription error:', err);
      setIsProcessing(false);
    }
  };

  const handleQuickDemoUnlock = async () => {
    setIsProcessing(true);
    try {
      await subscribe(selectedPlan);
      setPurchaseSuccess(true);
      setTimeout(() => {
        setIsProcessing(false);
        setPurchaseSuccess(false);
        if (onSuccess) {
          onSuccess();
        } else {
          onClose();
        }
      }, 800);
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      <div
        id="paywall-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden relative my-auto"
        >
          {/* Close button */}
          <button
            id="paywall-close-btn"
            onClick={onClose}
            aria-label="Close paywall"
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Banner Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-white/20 text-[11px] font-extrabold tracking-wider uppercase flex items-center gap-1.5 backdrop-blur-xs text-cyan-200">
                <Sparkles className="w-3.5 h-3.5 text-lime-300" />
                <span>BrainPulse Pro Membership</span>
              </span>
              {isTrialExpired && (
                <span className="px-2.5 py-1 rounded-full bg-amber-400/30 text-amber-200 text-[10px] font-bold border border-amber-300/30">
                  1-Week Free Trial Ended
                </span>
              )}
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-black text-white leading-tight">
              {gameTitle ? `Unlock "${gameTitle}" & Full Brain Gym` : 'Unlock Unlimited Cognitive Training'}
            </h2>
            <p className="text-xs sm:text-sm text-cyan-100 mt-2 max-w-xl leading-relaxed">
              {isTrialExpired
                ? 'Your 7-day free trial has expired. Subscribe to continue playing all 15 cognitive games and mindfulness drills.'
                : 'Subscribe now to access all 15 scientifically-designed brain games, memory tracking, and global rankings.'}
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {purchaseSuccess ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10 animate-bounce" />
                </div>
                <h3 className="font-display text-2xl font-black text-slate-900">
                  Welcome to BrainPulse Pro!
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Your subscription is activated. You now have unlimited access to all 15 games, drills, and cloud analytics.
                </p>
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-600">
                  <Sparkles className="w-4 h-4" />
                  <span>Unlocking games...</span>
                </div>
              </div>
            ) : (
              <>
                {/* Plan Selection Cards */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 block">
                    Choose Your Plan
                  </label>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Annual Plan */}
                    <div
                      id="plan-annual"
                      onClick={() => setSelectedPlan('annual')}
                      className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        selectedPlan === 'annual'
                          ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-black text-sm text-slate-900">Annual Membership</span>
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            selectedPlan === 'annual' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                          }`}>
                            {selectedPlan === 'annual' && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-500 mb-3">12 months full unlimited access</p>
                      </div>
                      <div className="pt-2 border-t border-slate-200/60">
                        <div className="flex items-baseline gap-1">
                          <span className="font-display text-2xl font-black text-slate-900">$119.99</span>
                          <span className="text-xs font-bold text-slate-500">/ year</span>
                        </div>
                        <span className="text-[10px] text-slate-500 block font-medium">Billed annually at $119.99/yr ($9.99/mo)</span>
                      </div>
                    </div>

                    {/* Monthly Plan */}
                    <div
                      id="plan-monthly"
                      onClick={() => setSelectedPlan('monthly')}
                      className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        selectedPlan === 'monthly'
                          ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-black text-sm text-slate-900">Monthly Plan</span>
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            selectedPlan === 'monthly' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                          }`}>
                            {selectedPlan === 'monthly' && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-500 mb-3">Flexible month-to-month billing</p>
                      </div>
                      <div className="pt-2 border-t border-slate-200/60">
                        <div className="flex items-baseline gap-1">
                          <span className="font-display text-2xl font-black text-slate-900">$9.99</span>
                          <span className="text-xs font-bold text-slate-500">/ month</span>
                        </div>
                        <span className="text-[10px] text-slate-500 block font-medium">Billed monthly, cancel anytime</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulated Payment Card Form */}
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold uppercase tracking-wider">Payment Details</span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>256-Bit Encrypted Simulation</span>
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="Card Number"
                        className="w-full px-3.5 py-2.5 pl-10 text-xs font-mono bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800"
                        required
                      />
                      <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM / YY"
                        className="w-full px-3.5 py-2.5 text-xs font-mono bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800"
                        required
                      />
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="CVC"
                        className="w-full px-3.5 py-2.5 text-xs font-mono bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800"
                        required
                      />
                    </div>
                  </div>

                  {/* Primary CTA */}
                  <button
                    id="btn-confirm-subscription"
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:opacity-95 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-blue-600/25 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-4 active:scale-[0.99]"
                  >
                    {isProcessing ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>
                          Pay {selectedPlan === 'annual' ? '$119.99/year' : '$9.99/month'} & Unlock Now
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Testing Helpers for instant review */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-center text-[11px]">
                  <button
                    type="button"
                    onClick={handleQuickDemoUnlock}
                    disabled={isProcessing}
                    className="text-blue-600 hover:text-blue-800 font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Instant 1-Click Sandbox Activation</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
