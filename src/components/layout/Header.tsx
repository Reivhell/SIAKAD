import React, { useState, useRef, useEffect } from 'react';
import { Bell, Menu, Sun, Moon, Sparkles, UserCheck, RefreshCw, Globe } from 'lucide-react';
import { User, Role } from '../../types';
import { NotificationCenter } from './NotificationCenter';
import { GlobalSearch } from './GlobalSearch';
import { UserProfileModal } from './UserProfileModal';
import { useLanguage } from '../../lib/i18n';
import { LanguageSwitcher } from './LanguageSwitcher';
import { motion } from 'motion/react';
import { safeDispatchCustomEvent } from '../../lib/utils';

interface HeaderProps {
  user: User;
  onUserChange: (newUser: User) => void;
  onMenuToggle?: () => void;
  darkMode: boolean;
  onToggleTheme: () => void;
  onTriggerSkeleton?: () => void;
  currentView?: string;
  isSkeletonLoading?: boolean;
}

const mockUsers: Record<Role, User> = {
  admin: {
    id: 'u1',
    name: 'Hendra Wijaya, M.T.',
    email: 'admin@kampus.ac.id',
    role: 'admin',
    phone: '0812-9988-7766',
    department: 'Admin'
  },
  lecturer: {
    id: 'u2',
    name: 'Dr. Budi Rahardjo',
    email: 'budi.rahardjo@kampus.ac.id',
    role: 'lecturer',
    phone: '0811-2233-4455',
    department: 'Teknik Informatika'
  },
  student: {
    id: 'u3',
    name: 'Ahmad Syafiq',
    email: 'ahmad.syafiq@mahasiswa.ac.id',
    role: 'student',
    phone: '0812-3456-7890',
    department: 'Teknik Informatika'
  },
  kaprodi: {
    id: 'u4',
    name: 'Dr. Budi Rahardjo',
    email: 'kaprodi@kampus.ac.id',
    role: 'kaprodi',
    phone: '0813-4567-8901',
    department: 'Teknik Informatika'
  },
  dekan: {
    id: 'u5',
    name: 'Prof. Dr. Ir. Faisal Akbar',
    email: 'dekan@kampus.ac.id',
    role: 'dekan',
    phone: '0812-7777-6666',
    department: 'Fakultas Teknologi Informasi'
  },
  alumni: {
    id: 'u6',
    name: 'Rian Hidayat, S.Kom',
    email: 'rian.hidayat@alumni.ac.id',
    role: 'alumni',
    phone: '0812-3456-7890',
    department: 'Teknik Informatika'
  },
  baak: {
    id: 'u7',
    name: 'Admin BAAK',
    email: 'baak@kampus.ac.id',
    role: 'baak',
    phone: '0812-1122-3344',
    department: 'Administrasi Akademik'
  },
  bauk: {
    id: 'u8',
    name: 'Admin BAUK',
    email: 'bauk@kampus.ac.id',
    role: 'bauk',
    phone: '0812-5566-7788',
    department: 'Biro Keuangan'
  },
  applicant: {
    id: 'u9',
    name: 'Rian Hidayat (Calon Maba)',
    email: 'rian@gmail.com',
    role: 'applicant',
    phone: '0812-3456-7890',
    department: 'Penerimaan Mahasiswa Baru'
  }
};

const getRoleAvatarStyle = (role: Role) => {
  switch (role) {
    case 'admin':
      return 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-blue-300 dark:border-indigo-500';
    case 'lecturer':
      return 'bg-gradient-to-br from-amber-500 to-orange-600 text-white border-amber-300 dark:border-orange-500';
    case 'kaprodi':
      return 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-indigo-300 dark:border-purple-500';
    case 'dekan':
      return 'bg-gradient-to-br from-rose-500 to-pink-600 text-white border-rose-300 dark:border-pink-500';
    case 'alumni':
      return 'bg-gradient-to-br from-amber-500 to-yellow-600 text-white border-amber-300 dark:border-yellow-500';
    case 'baak':
      return 'bg-gradient-to-br from-violet-500 to-purple-600 text-white border-violet-300 dark:border-purple-500';
    case 'bauk':
      return 'bg-gradient-to-br from-cyan-500 to-teal-600 text-white border-cyan-300 dark:border-teal-500';
    case 'applicant':
      return 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white border-indigo-300 dark:border-blue-500';
    case 'student':
    default:
      return 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-emerald-300 dark:border-teal-500';
  }
};

export function Header({ 
  user, 
  onUserChange, 
  onMenuToggle, 
  darkMode, 
  onToggleTheme, 
  onTriggerSkeleton,
  currentView,
  isSkeletonLoading
}: HeaderProps) {
  const { t, lang, changeLanguage, languages } = useLanguage();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Global Progress Bar States
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true);

  const startProgress = () => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    
    setVisible(true);
    setActive(true);
    setProgress(15);

    // Trickle progress up to 90%
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev < 30) {
          return prev + Math.random() * 15;
        } else if (prev < 65) {
          return prev + Math.random() * 8;
        } else if (prev < 88) {
          return prev + Math.random() * 2;
        }
        return prev;
      });
    }, 120);
  };

  const completeProgress = () => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    setProgress(100);
    setActive(false);
    
    // Fade out after reaching 100%
    fadeTimeoutRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 400);
  };

  // Close notifications on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 1. Listen for currentView changes (tab switches)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    startProgress();
    const timer = setTimeout(() => {
      completeProgress();
    }, 550 + Math.random() * 300);
    return () => clearTimeout(timer);
  }, [currentView]);

  // 2. Listen for isSkeletonLoading changes (major data-loading/simulation triggers)
  useEffect(() => {
    if (isSkeletonLoading) {
      startProgress();
    } else {
      if (progress > 0) {
        completeProgress();
      }
    }
  }, [isSkeletonLoading]);

  // 3. Listen for global custom events and intercept fetch requests safely
  useEffect(() => {
    const handleStart = () => startProgress();
    const handleEnd = () => completeProgress();

    window.addEventListener('global-progress-start', handleStart);
    window.addEventListener('global-progress-end', handleEnd);
    
    const getCookie = (name: string): string => {
      if (typeof document === 'undefined') return '';
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift() || '';
      return '';
    };

    let originalFetch = window.fetch;
    let isPatched = false;

    const injectCsrfHeader = (args: any[]) => {
      let init = args[1] || {};
      const method = (init.method || 'GET').toUpperCase();
      if (method !== 'GET' && method !== 'HEAD') {
        const csrfToken = getCookie('csrfToken');
        if (csrfToken) {
          if (!init.headers) {
            init.headers = {};
          }
          if (init.headers instanceof Headers) {
            if (!init.headers.has('X-CSRF-Token')) {
              init.headers.set('X-CSRF-Token', csrfToken);
            }
          } else if (Array.isArray(init.headers)) {
            const hasCsrf = init.headers.some(([k]) => k.toLowerCase() === 'x-csrf-token');
            if (!hasCsrf) {
              init.headers.push(['X-CSRF-Token', csrfToken]);
            }
          } else {
            const keys = Object.keys(init.headers);
            const hasCsrf = keys.some(k => k.toLowerCase() === 'x-csrf-token');
            if (!hasCsrf) {
              init.headers = {
                ...init.headers,
                'X-CSRF-Token': csrfToken
              };
            }
          }
          args[1] = init;
        }
      }
    };

    try {
      if (originalFetch) {
        const desc = Object.getOwnPropertyDescriptor(window, 'fetch');
        if (!desc || desc.writable || desc.set || desc.configurable !== false) {
          Object.defineProperty(window, 'fetch', {
            value: async function (...args: any[]) {
              injectCsrfHeader(args);
              safeDispatchCustomEvent('global-progress-start');
              try {
                return await originalFetch.apply(window, args);
              } finally {
                safeDispatchCustomEvent('global-progress-end');
              }
            },
            writable: true,
            configurable: true
          });
          isPatched = true;
        }
      }
    } catch (e) {
      console.warn("Could not redefine window.fetch with defineProperty:", e);
    }

    if (!isPatched) {
       try {
         (window as any).fetch = async function (...args: any[]) {
           injectCsrfHeader(args);
           safeDispatchCustomEvent('global-progress-start');
           try {
             return await originalFetch.apply(window, args);
           } finally {
             safeDispatchCustomEvent('global-progress-end');
           }
         };
         isPatched = true;
       } catch (e) {
         console.warn("Could not patch window.fetch via assignment:", e);
       }
     }

    return () => {
      window.removeEventListener('global-progress-start', handleStart);
      window.removeEventListener('global-progress-end', handleEnd);
      if (isPatched && originalFetch) {
        try {
          const desc = Object.getOwnPropertyDescriptor(window, 'fetch');
          if (desc && desc.configurable !== false) {
            Object.defineProperty(window, 'fetch', {
              value: originalFetch,
              writable: true,
              configurable: true
            });
          } else {
            (window as any).fetch = originalFetch;
          }
        } catch (e) {
          console.warn("Could not restore original fetch:", e);
        }
      }
    };
  }, []);

  const handleRoleChange = (role: Role) => {
    startProgress();
    onUserChange(mockUsers[role]);
    setTimeout(() => {
      completeProgress();
    }, 850);
  };

  if (!user) return null;

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 lg:px-8 relative z-30 transition-colors duration-200">
      {/* Global Progress Bar Indicator */}
      {visible && (
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-slate-100/50 dark:bg-slate-800/30 z-50 pointer-events-none overflow-hidden">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ 
              type: 'tween', 
              ease: active ? 'linear' : [0.16, 1, 0.3, 1],
              duration: active ? 0.25 : 0.4 
            }}
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] relative"
          >
            {/* Glowing tail trailing effect */}
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/30 dark:to-white/20 blur-[2px]" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_#fff,0_0_5px_#3b82f6] animate-pulse" />
          </motion.div>
        </div>
      )}
      <div className="flex items-center flex-1">
        <button 
          onClick={onMenuToggle}
          className="mr-4 lg:hidden p-2 rounded-md text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
        >
          <Menu className="h-6 w-6" />
        </button>
        
        {/* Interactive Global Search Component */}
        <div className="max-w-md w-full lg:max-w-xs relative hidden sm:block">
          <GlobalSearch />
        </div>
      </div>
      
      <div className="ml-auto flex items-center gap-1.5 sm:gap-3 lg:gap-4 font-sans flex-shrink-0">
        {/* Toggle/Simulate Skeleton Loader */}
        {onTriggerSkeleton && (
          <button
            onClick={onTriggerSkeleton}
            className="flex items-center gap-1 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20 border border-blue-500/25 dark:border-blue-500/45 text-blue-600 dark:text-blue-400 p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            title={t('header.sim_skeleton')}
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
            <span className="hidden sm:inline">{t('header.sim_skeleton')}</span>
          </button>
        )}

        {/* Interactive Language Switcher */}
        <LanguageSwitcher />

        {/* Interactive Role Switcher - Outstanding value for demonstration */}
        <div className="flex items-center justify-center gap-1 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm w-32 h-8 sm:w-40 lg:w-44 sm:h-9 flex-shrink-0 px-1 sm:px-2">
          <UserCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 hidden sm:inline-block" />
          <select 
            value={user.role} 
            onChange={(e) => handleRoleChange(e.target.value as Role)}
            className="bg-transparent border-none text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer focus:ring-0 py-0 px-1 text-center w-full focus:outline-none"
          >
            <option value="admin" className="dark:bg-slate-900 text-slate-900 dark:text-white">{t('role.admin')}</option>
            <option value="lecturer" className="dark:bg-slate-900 text-slate-900 dark:text-white">{t('role.lecturer')}</option>
            <option value="kaprodi" className="dark:bg-slate-900 text-slate-900 dark:text-white">{t('role.kaprodi')}</option>
            <option value="dekan" className="dark:bg-slate-900 text-slate-900 dark:text-white">{t('role.dekan')}</option>
            <option value="student" className="dark:bg-slate-900 text-slate-900 dark:text-white">{t('role.student')}</option>
          </select>
        </div>

        {/* Bell Button & Notification Center */}
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className={`p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none relative transition-colors ${
              isNotificationsOpen ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-500 dark:hover:text-slate-300'
            }`}
          >
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            )}
          </button>

          <NotificationCenter 
            currentRole={user.role} 
            isOpen={isNotificationsOpen} 
            onClose={() => setIsNotificationsOpen(false)} 
            onUnreadCountChange={setUnreadNotificationsCount}
          />
        </div>

        {/* Interactive User Profile Trigger */}
        <button 
          onClick={() => setIsProfileOpen(true)}
          className="flex items-center gap-2 sm:gap-3 text-left hover:opacity-85 active:opacity-70 focus:outline-none transition-all group"
          title="Buka Pengaturan Profil"
        >
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {user.name || 'User'}
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{user.role || 'student'}</span>
          </div>
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name || 'User'} 
              className="h-8 w-8 rounded-full object-cover border border-blue-200 dark:border-blue-800 select-none group-hover:border-blue-500 transition-colors"
            />
          ) : (
            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold border select-none transition-all duration-300 group-hover:scale-110 group-hover:shadow-md ${getRoleAvatarStyle(user.role)}`}>
              {(user.name || 'User').charAt(0)}
            </div>
          )}
        </button>
      </div>

      {/* User Profile Modal */}
      {isProfileOpen && (
        <UserProfileModal 
          user={user} 
          onClose={() => setIsProfileOpen(false)} 
          onSave={(updatedUser) => {
            onUserChange(updatedUser);
          }} 
        />
      )}
    </header>
  );
}
