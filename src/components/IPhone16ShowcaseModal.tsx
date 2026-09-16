import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Smartphone, Sparkles, Download, CheckCircle2, Zap, Shield, Cpu } from 'lucide-react';

interface IPhone16ShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSimulator?: () => void;
}

export const IPhone16ShowcaseModal: React.FC<IPhone16ShowcaseModalProps> = ({
  isOpen,
  onClose,
  onOpenSimulator
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-slate-900 text-white rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden my-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-20 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-300 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 tracking-wider">
                    Apple iPhone 16 Pro
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Desert Titanium</span>
                </div>
                <h2 className="font-display text-lg sm:text-xl font-black text-white">
                  BrainPulse on iPhone 16 Pro
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Visual Showcase */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Photo of iPhone 16 with BrainPulse */}
              <div className="lg:col-span-7 flex justify-center">
                <div className="relative group rounded-3xl overflow-hidden border-2 border-amber-500/30 shadow-2xl bg-gradient-to-b from-slate-800 to-slate-950 max-h-[500px] w-full flex items-center justify-center">
                  <img
                    src="/iphone_sixteen_mockup.jpg"
                    alt="BrainPulse running on Apple iPhone 16 Pro in Desert Titanium"
                    className="w-full h-auto object-contain max-h-[500px] transition-transform duration-500 group-hover:scale-[1.02]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-bold text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>iPhone 16 Pro &bull; Super Retina XDR</span>
                  </div>
                </div>
              </div>

              {/* Specifications & Highlights */}
              <div className="lg:col-span-5 space-y-4">
                <div>
                  <h3 className="text-xl font-display font-extrabold text-white">
                    Native iOS 18 Architecture
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    BrainPulse is precision-engineered for the 6.3-inch Super Retina XDR display on the iPhone 16 Pro, utilizing ProMotion 120Hz refresh rates and tactile haptic feedback.
                  </p>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/60 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Dynamic Island Live Activities</h4>
                      <p className="text-[11px] text-slate-300">
                        Displays ongoing game reaction timers, brain readiness percentage, and streak notifications seamlessly.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/60 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Grade 5 Desert Titanium Finish</h4>
                      <p className="text-[11px] text-slate-300">
                        Ultra-slim uniform bezels, Action button shortcut, and dedicated Camera Control capacitive strip.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/60 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-lime-500/20 text-lime-400 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">100% Pure Swift &amp; SwiftUI Code</h4>
                      <p className="text-[11px] text-slate-300">
                        Zero webviews in the native iOS app package. Full AVFoundation synthesis and Core Haptics engine.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                  {onOpenSimulator && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenSimulator();
                      }}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-lime-400 text-slate-950 font-black text-xs rounded-2xl shadow-lg shadow-cyan-500/20 hover:brightness-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>Play in iPhone 16 Frame</span>
                    </button>
                  )}

                  <a
                    href="/brainpulse-swift-native.zip"
                    download="brainpulse-swift-native.zip"
                    className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-2xl border border-slate-600/80 transition-all flex items-center justify-center gap-2 text-center"
                  >
                    <Download className="w-4 h-4" />
                    <span>Xcode Project (.ZIP)</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
