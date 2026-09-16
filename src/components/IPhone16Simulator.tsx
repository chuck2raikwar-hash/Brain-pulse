import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Smartphone,
  Brain,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Sparkles,
  Wifi,
  Battery,
  Flame,
  Zap,
  ChevronLeft,
  LayoutDashboard,
  LayoutGrid,
  Gamepad2,
  Swords,
  LineChart,
  Trophy,
  Settings,
  Crown,
  Camera,
  Image as ImageIcon,
  Download,
  RotateCcw
} from 'lucide-react';
import { NavTab } from './Navbar';
import { sounds } from '../lib/audio';

export type IPhoneFinish = 'desert' | 'natural' | 'black' | 'white' | 'ultramarine';

interface IPhone16SimulatorProps {
  children: React.ReactNode;
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  activeGameId: string | null;
  onExitGame: () => void;
  dailyStreak: number;
  brainPowerScore: number;
  isSubscribed?: boolean;
  onOpenPaywall?: () => void;
  onOpenShowcasePhoto: () => void;
  onToggleFullScreen: () => void;
  isSimulatorActive: boolean;
}

const FINISH_CONFIGS: Record<
  IPhoneFinish,
  {
    name: string;
    border: string;
    bezelHighlight: string;
    accent: string;
    bgRing: string;
    metalGradient: string;
  }
> = {
  desert: {
    name: 'Desert Titanium',
    border: 'border-[#C8AC94]',
    bezelHighlight: 'from-[#DFC8B2] via-[#C8AC94] to-[#A48870]',
    accent: '#C8AC94',
    bgRing: 'ring-[#C8AC94]/40',
    metalGradient: 'bg-gradient-to-b from-[#DFC8B2] via-[#C8AC94] to-[#967C65]'
  },
  natural: {
    name: 'Natural Titanium',
    border: 'border-[#A3A09A]',
    bezelHighlight: 'from-[#D0CEC9] via-[#A3A09A] to-[#7D7A74]',
    accent: '#A3A09A',
    bgRing: 'ring-[#A3A09A]/40',
    metalGradient: 'bg-gradient-to-b from-[#D0CEC9] via-[#A3A09A] to-[#73706B]'
  },
  black: {
    name: 'Black Titanium',
    border: 'border-[#2D2E30]',
    bezelHighlight: 'from-[#4D4E52] via-[#2D2E30] to-[#17181A]',
    accent: '#2D2E30',
    bgRing: 'ring-[#4D4E52]/40',
    metalGradient: 'bg-gradient-to-b from-[#4A4B4F] via-[#2D2E30] to-[#141517]'
  },
  white: {
    name: 'White Titanium',
    border: 'border-[#E3E4E8]',
    bezelHighlight: 'from-[#FFFFFF] via-[#E3E4E8] to-[#C7C9D1]',
    accent: '#E3E4E8',
    bgRing: 'ring-[#E3E4E8]/50',
    metalGradient: 'bg-gradient-to-b from-[#FFFFFF] via-[#E5E6EB] to-[#BFC1CB]'
  },
  ultramarine: {
    name: 'Ultramarine',
    border: 'border-[#385C95]',
    bezelHighlight: 'from-[#5C84C4] via-[#385C95] to-[#20375E]',
    accent: '#385C95',
    bgRing: 'ring-[#5C84C4]/40',
    metalGradient: 'bg-gradient-to-b from-[#5C84C4] via-[#385C95] to-[#1C3256]'
  }
};

export const IPhone16Simulator: React.FC<IPhone16SimulatorProps> = ({
  children,
  currentTab,
  onTabChange,
  activeGameId,
  onExitGame,
  dailyStreak,
  brainPowerScore,
  isSubscribed,
  onOpenPaywall,
  onOpenShowcasePhoto,
  onToggleFullScreen,
  isSimulatorActive
}) => {
  const [finish, setFinish] = useState<IPhoneFinish>('desert');
  const [scale, setScale] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      if (window.innerHeight < 850 || window.innerWidth < 640) return 0.75;
      if (window.innerHeight < 980) return 0.85;
    }
    return 0.95;
  });
  const [isDynamicIslandExpanded, setIsDynamicIslandExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('9:41');
  const [batteryLevel] = useState(96);
  const [soundEnabled, setSoundEnabled] = useState(sounds.isEnabled());
  const [cameraFlash, setCameraFlash] = useState(false);
  const [screenDimmed, setScreenDimmed] = useState(false);

  // Live real-time clock updating every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      // 12-hour or 24-hour style
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      setCurrentTime(`${hours}:${formattedMinutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.setEnabled(next);
  };

  const handleCameraControlPress = () => {
    setCameraFlash(true);
    sounds.click();
    setTimeout(() => setCameraFlash(false), 200);
    setIsDynamicIslandExpanded(true);
    setTimeout(() => setIsDynamicIslandExpanded(false), 3500);
  };

  const selectedFinish = FINISH_CONFIGS[finish];

  // If simulator is toggled off (Desktop Mode), just render children directly in desktop layout
  if (!isSimulatorActive) {
    return <>{children}</>;
  }

  return (
    <div className="w-full flex flex-col items-center justify-center py-4 px-2 sm:px-4">
      {/* Top Device Workbench Control Bar */}
      <div className="w-full max-w-4xl mb-6 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200 shadow-sm p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Device Label & Finish Badges */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-display font-extrabold text-slate-800">
            <Smartphone className="w-4 h-4 text-blue-600" />
            <span>iPhone 16 Pro</span>
            <span className="text-[10px] font-bold text-slate-400 font-mono">6.3&quot; Super Retina XDR</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {(Object.keys(FINISH_CONFIGS) as IPhoneFinish[]).map((fKey) => (
              <button
                key={fKey}
                onClick={() => setFinish(fKey)}
                title={FINISH_CONFIGS[fKey].name}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  finish === fKey
                    ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {FINISH_CONFIGS[fKey].name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Scale & View Actions */}
        <div className="flex items-center gap-2">
          {/* Zoom scale selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-[11px] font-bold">
            <button
              onClick={() => setScale(0.75)}
              className={`px-2 py-0.5 rounded-md cursor-pointer ${scale === 0.75 ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'}`}
            >
              75%
            </button>
            <button
              onClick={() => setScale(0.85)}
              className={`px-2 py-0.5 rounded-md cursor-pointer ${scale === 0.85 ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'}`}
            >
              85%
            </button>
            <button
              onClick={() => setScale(0.95)}
              className={`px-2 py-0.5 rounded-md cursor-pointer ${scale === 0.95 ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'}`}
            >
              95%
            </button>
            <button
              onClick={() => setScale(1.0)}
              className={`px-2 py-0.5 rounded-md cursor-pointer ${scale === 1.0 ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'}`}
            >
              100%
            </button>
          </div>

          {/* Showcase Photo Render Modal */}
          <button
            id="btn-open-iphone16-photo"
            onClick={onOpenShowcasePhoto}
            className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Photo Render</span>
          </button>

          {/* Toggle Fullscreen / Desktop Layout */}
          <button
            id="btn-toggle-desktop-layout"
            onClick={onToggleFullScreen}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            title="Switch to Full Width Web Layout"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Full-Width Web</span>
          </button>
        </div>
      </div>

      {/* Main iPhone 16 Device Frame */}
      <div
        className="relative transition-all duration-300 select-none"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center'
        }}
      >
        {/* Flash overlay for camera control demo */}
        {cameraFlash && (
          <div className="absolute inset-0 bg-white/70 z-50 rounded-[54px] pointer-events-none transition-opacity duration-200" />
        )}

        {/* Titanium Outer Chassis (Physical Phone) */}
        <div
          className={`relative p-[10px] rounded-[54px] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.35),0_0_0_1px_rgba(0,0,0,0.08)] ${selectedFinish.metalGradient} ring-1 ring-black/10`}
          style={{ width: '416px', minHeight: '868px' }}
        >
          {/* Antenna Bands on side frame */}
          <div className="absolute top-28 -left-[2px] w-[3px] h-3 bg-black/30 rounded-r" />
          <div className="absolute top-28 -right-[2px] w-[3px] h-3 bg-black/30 rounded-l" />
          <div className="absolute bottom-28 -left-[2px] w-[3px] h-3 bg-black/30 rounded-r" />
          <div className="absolute bottom-28 -right-[2px] w-[3px] h-3 bg-black/30 rounded-l" />

          {/* LEFT HARDWARE BUTTONS */}
          {/* Action Button */}
          <button
            title="Action Button (Toggles Sound Effects)"
            onClick={toggleSound}
            className="absolute -left-[5px] top-[110px] w-[5px] h-[28px] rounded-l-md bg-gradient-to-r from-[#5a483a] to-[#a48870] hover:brightness-125 active:translate-x-[2px] transition-all cursor-pointer shadow-sm"
          />
          {/* Volume Up */}
          <button
            title="Volume Up"
            onClick={toggleSound}
            className="absolute -left-[5px] top-[155px] w-[5px] h-[52px] rounded-l-md bg-gradient-to-r from-[#5a483a] to-[#a48870] hover:brightness-125 active:translate-x-[2px] transition-all cursor-pointer shadow-sm"
          />
          {/* Volume Down */}
          <button
            title="Volume Down"
            onClick={toggleSound}
            className="absolute -left-[5px] top-[220px] w-[5px] h-[52px] rounded-l-md bg-gradient-to-r from-[#5a483a] to-[#a48870] hover:brightness-125 active:translate-x-[2px] transition-all cursor-pointer shadow-sm"
          />

          {/* RIGHT HARDWARE BUTTONS */}
          {/* Side Power / Sleep Button */}
          <button
            title="Side Power Button (Sleep/Wake Display)"
            onClick={() => setScreenDimmed(!screenDimmed)}
            className="absolute -right-[5px] top-[170px] w-[5px] h-[80px] rounded-r-md bg-gradient-to-l from-[#5a483a] to-[#a48870] hover:brightness-125 active:-translate-x-[2px] transition-all cursor-pointer shadow-sm"
          />

          {/* NEW iPhone 16 Camera Control Sensor (Lower Right) */}
          <button
            title="iPhone 16 Camera Control (Capacitive Sensor & Shutter)"
            onClick={handleCameraControlPress}
            className="absolute -right-[5px] top-[540px] w-[5px] h-[64px] rounded-r-md bg-gradient-to-l from-slate-800 to-[#a48870] hover:brightness-130 active:-translate-x-[2px] transition-all cursor-pointer shadow-inner border-y border-black/30"
          >
            <span className="sr-only">Camera Control</span>
          </button>

          {/* Inner OLED Display Bezel (Ultra-thin 2.5mm uniform bezel) */}
          <div
            className={`relative w-[396px] h-[848px] bg-black rounded-[46px] p-[3px] shadow-inner overflow-hidden ${
              screenDimmed ? 'opacity-20' : 'opacity-100'
            } transition-opacity duration-300`}
          >
            {/* Screen Glass Corner Highlights */}
            <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-[44px] z-30" />

            {/* SCREEN VIEWPORT CONTAINER */}
            <div className="relative w-full h-full bg-[#F8FAFC] rounded-[43px] overflow-hidden flex flex-col justify-between">
              
              {/* TOP STATUS BAR & DYNAMIC ISLAND */}
              <div className="relative z-40 pt-3 px-6 flex items-center justify-between text-slate-900 bg-white/70 backdrop-blur-md">
                {/* Left: Clock */}
                <div className="w-16 font-semibold text-[14px] tracking-tight font-display text-slate-900">
                  {currentTime}
                </div>

                {/* Center: DYNAMIC ISLAND */}
                <motion.div
                  layout
                  transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  onClick={() => setIsDynamicIslandExpanded(!isDynamicIslandExpanded)}
                  className={`bg-black text-white rounded-full flex items-center justify-between px-3 cursor-pointer shadow-lg z-50 overflow-hidden ${
                    isDynamicIslandExpanded
                      ? 'w-[320px] h-[64px] py-2 px-4 rounded-[32px]'
                      : 'w-[124px] h-[34px]'
                  }`}
                >
                  {isDynamicIslandExpanded ? (
                    <div className="w-full flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white">
                          <Brain className="w-4 h-4 animate-pulse" />
                        </div>
                        <div>
                          <div className="font-bold text-[11px] text-white">BrainPulse Pro</div>
                          <div className="text-[9px] text-cyan-300 font-mono">
                            {activeGameId ? 'Drill Active' : '94% Readiness'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-[10px] text-orange-400 font-bold bg-white/10 px-2 py-0.5 rounded-full">
                          <Flame className="w-3 h-3 fill-orange-400" />
                          <span>{dailyStreak}d</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSound();
                          }}
                          className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white"
                        >
                          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-rose-400" />}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Left: Camera dot */}
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-[#1A1A1E] border border-white/10 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#0A0A10]" />
                        </div>
                        {activeGameId && (
                          <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-ping" />
                        )}
                      </div>

                      {/* Right: Audio / Pulse glyph */}
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-2 bg-cyan-400 rounded-full animate-pulse" />
                        <div className="w-1 h-3 bg-cyan-300 rounded-full animate-pulse" style={{ animationDelay: '100ms' }} />
                        <div className="w-1 h-2.5 bg-lime-400 rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
                      </div>
                    </>
                  )}
                </motion.div>

                {/* Right: Status Icons (Cellular, 5G, Battery) */}
                <div className="w-16 flex items-center justify-end gap-1.5 text-slate-800">
                  <div className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 h-1 bg-slate-800 rounded-xs" />
                    <span className="w-0.5 h-1.5 bg-slate-800 rounded-xs" />
                    <span className="w-0.5 h-2 bg-slate-800 rounded-xs" />
                    <span className="w-0.5 h-2.5 bg-slate-800 rounded-xs" />
                  </div>
                  <span className="text-[10px] font-black tracking-tight text-slate-800">5G</span>
                  <div className="flex items-center">
                    <div className="w-5 h-2.5 border border-slate-800 rounded-sm p-0.5 flex items-center">
                      <div className="h-full bg-slate-900 rounded-xs" style={{ width: `${batteryLevel}%` }} />
                    </div>
                    <div className="w-0.5 h-1 bg-slate-800 rounded-r-xs" />
                  </div>
                </div>
              </div>

              {/* NATIVE iOS APP TOP NAVIGATION BAR */}
              <div className="px-4 py-2 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between z-20">
                {activeGameId ? (
                  <button
                    onClick={onExitGame}
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer active:scale-95 transition-transform"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white text-xs font-black shadow-xs">
                      BP
                    </div>
                    <div className="font-display font-black text-sm text-slate-900 tracking-tight">
                      BrainPulse
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-orange-50 border border-orange-200 text-orange-600 px-2 py-0.5 rounded-full text-[11px] font-extrabold">
                    <Flame className="w-3 h-3 fill-orange-400" />
                    <span>{dailyStreak}d</span>
                  </div>

                  {isSubscribed ? (
                    <div className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1">
                      <Crown className="w-3 h-3 fill-amber-500" />
                      <span>PRO</span>
                    </div>
                  ) : onOpenPaywall ? (
                    <button
                      onClick={onOpenPaywall}
                      className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs active:scale-95 transition-transform cursor-pointer"
                    >
                      Unlock Pro
                    </button>
                  ) : null}
                </div>
              </div>

              {/* APP CONTENT AREA (Scrollable with hidden scrollbar for authentic iOS touch feel) */}
              <div
                id="iphone-app-scroll-container"
                className="flex-1 w-full max-w-full overflow-y-auto overflow-x-hidden px-2.5 sm:px-3 py-3 space-y-3 sm:space-y-4 scrollbar-none"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
                {children}
              </div>

              {/* NATIVE iOS FROSTED GLASS BOTTOM TAB BAR (DOCK) */}
              <div className="relative z-30 bg-white/85 backdrop-blur-xl border-t border-slate-200/80 px-2 pt-1.5 pb-2">
                <div className="flex items-center justify-around">
                  <button
                    id="ios-tab-dashboard"
                    onClick={() => {
                      if (activeGameId) onExitGame();
                      onTabChange('dashboard');
                    }}
                    className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all cursor-pointer active:scale-95 ${
                      currentTab === 'dashboard' && !activeGameId
                        ? 'text-blue-600 font-bold'
                        : 'text-slate-400 hover:text-slate-600 font-medium'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span className="text-[10px]">Today</span>
                  </button>

                  <button
                    id="ios-tab-games"
                    onClick={() => {
                      if (activeGameId) onExitGame();
                      onTabChange('games');
                    }}
                    className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all cursor-pointer active:scale-95 ${
                      currentTab === 'games' || activeGameId
                        ? 'text-blue-600 font-bold'
                        : 'text-slate-400 hover:text-slate-600 font-medium'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                    <span className="text-[10px]">Games</span>
                  </button>

                  <button
                    id="ios-tab-pvp"
                    onClick={() => {
                      if (activeGameId) onExitGame();
                      onTabChange('pvp');
                    }}
                    className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all cursor-pointer active:scale-95 ${
                      currentTab === 'pvp' && !activeGameId
                        ? 'text-blue-600 font-bold'
                        : 'text-slate-400 hover:text-slate-600 font-medium'
                    }`}
                  >
                    <Swords className="w-4 h-4" />
                    <span className="text-[10px]">1v1 Arena</span>
                  </button>

                  <button
                    id="ios-tab-progress"
                    onClick={() => {
                      if (activeGameId) onExitGame();
                      onTabChange('progress');
                    }}
                    className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all cursor-pointer active:scale-95 ${
                      currentTab === 'progress' && !activeGameId
                        ? 'text-blue-600 font-bold'
                        : 'text-slate-400 hover:text-slate-600 font-medium'
                    }`}
                  >
                    <LineChart className="w-4 h-4" />
                    <span className="text-[10px]">Analytics</span>
                  </button>

                  <button
                    id="ios-tab-settings"
                    onClick={() => {
                      if (activeGameId) onExitGame();
                      onTabChange('settings');
                    }}
                    className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all cursor-pointer active:scale-95 ${
                      currentTab === 'settings' && !activeGameId
                        ? 'text-blue-600 font-bold'
                        : 'text-slate-400 hover:text-slate-600 font-medium'
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-[10px]">Settings</span>
                  </button>
                </div>

                {/* iOS HOME INDICATOR BAR */}
                <div className="pt-2 pb-0.5 flex justify-center">
                  <div className="w-32 h-1 bg-slate-900/30 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shadow and Stand base under the phone */}
        <div className="w-64 h-4 bg-slate-900/15 rounded-full blur-md mx-auto mt-3" />
      </div>
    </div>
  );
};

