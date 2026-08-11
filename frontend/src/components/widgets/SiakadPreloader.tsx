import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Shield, Cpu, Database, CheckCircle, Network, Server, UserCheck } from 'lucide-react';

interface SiakadPreloaderProps {
  onComplete: () => void;
  userRole?: string;
  userName?: string;
}

const loadingSteps = [
  { text: 'Mengautentikasi kredensial...', icon: Shield, color: 'text-blue-500' },
  { text: 'Menghubungkan ke API Gateway & SSO...', icon: Network, color: 'text-indigo-500' },
  { text: 'Memuat modul SIAKAD Enterprise...', icon: Cpu, color: 'text-purple-500' },
  { text: 'Sinkronisasi basis data & cache...', icon: Database, color: 'text-amber-500' },
  { text: 'Mempersiapkan dashboard personal...', icon: UserCheck, color: 'text-emerald-500' }
];

export function SiakadPreloader({ onComplete, userRole = 'student', userName = '' }: SiakadPreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Increment progress dynamically with varying increments for a realistic loading feel
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        
        // Random natural increments
        const remaining = 100 - prev;
        const increment = Math.max(2, Math.floor(Math.random() * Math.min(15, remaining)));
        const nextProgress = prev + increment;

        // Map progress to steps
        const stepIndex = Math.min(
          loadingSteps.length - 1,
          Math.floor((nextProgress / 100) * loadingSteps.length)
        );
        setCurrentStepIndex(stepIndex);

        return nextProgress;
      });
    }, 180);

    return () => clearInterval(interval);
  }, []);

  // Trigger completion callback when progress reaches 100% with a slight exit hold
  useEffect(() => {
    if (progress === 100) {
      const exitTimeout = setTimeout(() => {
        setIsExiting(true);
      }, 500);

      const completeTimeout = setTimeout(() => {
        onComplete();
      }, 1000); // Allow fade-out animation to complete

      return () => {
        clearTimeout(exitTimeout);
        clearTimeout(completeTimeout);
      };
    }
  }, [progress, onComplete]);

  const CurrentStepIcon = loadingSteps[currentStepIndex]?.icon || Sparkles;

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          id="siakad-preloader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-slate-950 text-white select-none overflow-hidden"
        >
          {/* Cosmic Background Accent Lights */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

          {/* Glowing Top Frame */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />

          {/* Central Logo Container */}
          <div className="relative flex flex-col items-center max-w-md px-6 text-center z-10 space-y-8">
            
            {/* Animated Ring & Logo */}
            <div className="relative">
              {/* Pulsing outer ring */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="absolute inset-[-15px] rounded-full border border-blue-500/20"
              />
              
              {/* Outer rotating decorative dashes */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
                className="absolute inset-[-8px] rounded-full border-2 border-dashed border-indigo-500/10"
              />

              {/* Main Glowing Circle */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="relative bg-gradient-to-tr from-blue-600 to-indigo-600 p-5 rounded-2xl shadow-2xl shadow-blue-500/30 text-white flex items-center justify-center w-20 h-20"
              >
                <Sparkles className="w-10 h-10 text-white" />
              </motion.div>
            </div>

            {/* Brand Title */}
            <div className="space-y-2">
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-3xl font-black tracking-widest text-white uppercase"
              >
                SIAKAD<span className="text-blue-500">.</span>
              </motion.h1>
              <motion.p
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 0.7 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-xs font-semibold text-slate-400"
              >
                Sistem Informasi Akademik Terpadu
              </motion.p>
            </div>

            {/* Progress and Step Details Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="w-80 bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-md space-y-4 shadow-xl"
            >
              {/* Step indicator */}
              <div className="flex items-center gap-2.5 min-h-[30px]">
                <div className="p-1.5 rounded-lg bg-slate-800 text-indigo-400">
                  <CurrentStepIcon className={`w-4 h-4 animate-spin ${loadingSteps[currentStepIndex]?.color}`} />
                </div>
                <div className="text-left flex-1">
                  <span className="text-[10px] text-slate-500 font-bold blockr">Status Memuat</span>
                  <span className="text-xs font-bold text-slate-200 block transition-colors duration-300">
                    {loadingSteps[currentStepIndex]?.text}
                  </span>
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="space-y-2">
                <div className="h-[6px] w-full bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full"
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: 'easeOut', duration: 0.1 }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono font-bold">
                  <span>SIAKAD SECURE CHANNEL</span>
                  <span className="text-blue-400 font-extrabold">{progress}%</span>
                </div>
              </div>
            </motion.div>

            {/* Personalized Welcome Overlay */}
            {userName && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-xs text-slate-400/80 mt-2 font-medium"
              >
                Selamat datang kembali, <span className="text-white font-bold">{userName}</span> &bull; Masuk sebagai <span className="capitalize text-indigo-400 font-black">{userRole === 'student' ? 'Mahasiswa' : userRole}</span>
              </motion.div>
            )}

            {/* Footer metadata */}
            <div className="text-[9px] text-slate-600 font-mono tracking-widest uppercase">
              UNIVERSITAS ENTERPRISE CLOUD SUITE &bull; ID #{Math.floor(10000 + Math.random() * 90000)}
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
