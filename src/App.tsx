import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { LoginView } from './components/views/LoginView';
import { DashboardView } from './components/views/DashboardView';
import { MahasiswaView } from './components/views/MahasiswaView';
import { KRSView } from './components/views/KRSView';
import { KHSView } from './components/views/KHSView';
import { PresensiView } from './components/views/PresensiView';
import { MahasiswaDashboardView } from './components/views/MahasiswaDashboardView';
import { AlumniDashboardView } from './components/views/AlumniDashboardView';
import { LecturerDashboardView } from './components/views/LecturerDashboardView';
import { AdminDashboardView } from './components/views/AdminDashboardView';
import { KaprodiDashboardView } from './components/views/KaprodiDashboardView';
import { DekanDashboardView } from './components/views/DekanDashboardView';
import { BaakDashboardView } from './components/views/BaakDashboardView';
import { BaukDashboardView } from './components/views/BaukDashboardView';
import { ApplicantDashboardView } from './components/views/ApplicantDashboardView';
import ShowcaseView from './components/views/ShowcaseView';
import { User, Role } from './types';
import { AlertCircle, Lock, ArrowLeft } from 'lucide-react';
import { AcademicChatbot } from './components/widgets/AcademicChatbot';
import { FeedbackWidget } from './components/widgets/FeedbackWidget';
import { SiakadPreloader } from './components/widgets/SiakadPreloader';
import { SkeletonLoader } from './components/widgets/SkeletonLoader';
import { motion, AnimatePresence } from 'motion/react';
import { Breadcrumb } from './components/layout/Breadcrumb';
import { useLanguage } from './lib/i18n';
import { ReactLenis } from 'lenis/react';
import { useAppStore } from './store';

export default function App() {
  const { t } = useLanguage();
  const setStoreUser = useAppStore((state) => state.setUser);
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('siakad_user');
      if (savedUser) {
        try {
          return JSON.parse(savedUser);
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  });

  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '/';
  });

  const [currentView, setCurrentView] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('siakad_user');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed && parsed.themePreference) {
            return parsed.themePreference === 'dark';
          }
        } catch (e) {}
      }
      const persistedTheme = localStorage.getItem('theme');
      if (persistedTheme === 'dark') return true;
      if (persistedTheme === 'light') return false;
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [isPreloading, setIsPreloading] = useState(false);
  const [isSkeletonLoading, setIsSkeletonLoading] = useState(false);
  const [tempUserData, setTempUserData] = useState<{ loggedInUser: User; redirectRoute: string } | null>(null);

  // Track the route state and keep browser history synchronized
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync dark mode class with HTML document element cleanly removing opposing classes
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.remove('light');
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Fetch initial CSRF token on mount to bootstrap state-changing requests
  useEffect(() => {
    fetch('/api/auth/csrf-token').catch(err => {
      console.error("Gagal melakukan bootstrap token CSRF:", err);
    });
  }, []);

  // Real-time synchronization of theme and profile updates across active browser tabs/sessions
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme' && e.newValue) {
        setDarkMode(e.newValue === 'dark');
      }
      if (e.key === 'siakad_user' && e.newValue) {
        try {
          const parsedUser = JSON.parse(e.newValue);
          setUser(parsedUser);
          if (parsedUser.themePreference) {
            setDarkMode(parsedUser.themePreference === 'dark');
          }
        } catch (err) {
          // Ignore parse errors from concurrent writes
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Synchronize user profile updates back to localStorage
  useEffect(() => {
    setStoreUser(user);
    if (user) {
      localStorage.setItem('siakad_user', JSON.stringify(user));
    }
  }, [user, setStoreUser]);

  // Session Auto-logout Idle Timer (30 minutes of inactivity)
  useEffect(() => {
    if (!user) return;

    const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 minutes (1800000 ms)
    const LAST_ACTIVITY_KEY = 'siakad_last_activity';

    // Initialize/reset last activity on mount or user login
    localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());

    const updateActivity = () => {
      localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
    };

    // Events that signify user activity
    const activityEvents = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    activityEvents.forEach((event) => {
      window.addEventListener(event, updateActivity);
    });

    // Check for inactivity every 5 seconds
    const interval = setInterval(() => {
      const lastActivity = parseInt(localStorage.getItem(LAST_ACTIVITY_KEY) || '0', 10);
      const timeElapsed = Date.now() - lastActivity;

      if (timeElapsed > INACTIVITY_LIMIT) {
        // Clear session and logout
        handleLogout();
        localStorage.removeItem(LAST_ACTIVITY_KEY);
      }
    }, 5000);

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, updateActivity);
      });
      clearInterval(interval);
    };
  }, [user]);

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (user) {
      setUser({
        ...user,
        themePreference: newDarkMode ? 'dark' : 'light'
      });
    }
  };

  const handleLoginSuccess = (loggedInUser: User, redirectRoute: string) => {
    setTempUserData({ loggedInUser, redirectRoute });
    setIsPreloading(true);
  };

  const handlePreloadComplete = () => {
    if (tempUserData) {
      const { loggedInUser, redirectRoute } = tempUserData;
      
      // Update theme to match the user's preferred theme
      if (loggedInUser.themePreference) {
        setDarkMode(loggedInUser.themePreference === 'dark');
      }

      setUser(loggedInUser);
      localStorage.setItem('siakad_user', JSON.stringify(loggedInUser));
      setCurrentPath(redirectRoute);
      setCurrentView('dashboard'); // reset to dashboard on login
      window.history.pushState(null, '', redirectRoute);
      setTempUserData(null);
      
      // Smoothly transition from Preloader to Skeleton Loader for 1.2 seconds
      setIsSkeletonLoading(true);
      setTimeout(() => {
        setIsSkeletonLoading(false);
      }, 1200);
    }
    setIsPreloading(false);
  };

  const handleUserChange = (newUser: User) => {
    // Check if role actually changed
    const roleChanged = !user || user.role !== newUser.role;
    
    setIsSkeletonLoading(true);
    setUser(newUser);
    localStorage.setItem('siakad_user', JSON.stringify(newUser));
    
    // Synchronize darkMode if modified in user profile settings
    if (newUser.themePreference) {
      setDarkMode(newUser.themePreference === 'dark');
    }
    
    if (roleChanged) {
      // Automatically redirect to the correct path based on role
      let targetPath = '/siakad/mahasiswa';
      if (newUser.role === 'lecturer') targetPath = '/siakad/dosen';
      else if (newUser.role === 'admin') targetPath = '/admin';
      else if (newUser.role === 'kaprodi') targetPath = '/siakad/kaprodi';
      else if (newUser.role === 'dekan') targetPath = '/siakad/dekan';
      else if (newUser.role === 'baak') targetPath = '/siakad/baak';
      else if (newUser.role === 'bauk') targetPath = '/siakad/bauk';
      else if (newUser.role === 'applicant') targetPath = '/siakad/calon';
      else if (newUser.role === 'alumni') targetPath = '/siakad/alumni';
      
      setCurrentPath(targetPath);
      setCurrentView('dashboard');
      window.history.pushState(null, '', targetPath);
    }

    setTimeout(() => {
      setIsSkeletonLoading(false);
    }, 850);
  };

  const handleTriggerSkeleton = () => {
    setIsSkeletonLoading(true);
    setTimeout(() => {
      setIsSkeletonLoading(false);
    }, 1500);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('siakad_user');
    setCurrentPath('/');
    window.history.pushState(null, '', '/');
  };

  const navigateToPath = (path: string) => {
    setCurrentPath(path);
    window.history.pushState(null, '', path);
  };

  // Helper to verify if the user's role matches their current pathname
  const checkRouteAuthorization = (): { authorized: boolean; correctPath?: string } => {
    if (!user) return { authorized: false };

    if (user.role === 'student' && currentPath !== '/siakad/mahasiswa') {
      return { authorized: false, correctPath: '/siakad/mahasiswa' };
    }
    if (user.role === 'lecturer' && currentPath !== '/siakad/dosen') {
      return { authorized: false, correctPath: '/siakad/dosen' };
    }
    if (user.role === 'admin' && currentPath !== '/admin') {
      return { authorized: false, correctPath: '/admin' };
    }
    if (user.role === 'kaprodi' && currentPath !== '/siakad/kaprodi') {
      return { authorized: false, correctPath: '/siakad/kaprodi' };
    }
    if (user.role === 'dekan' && currentPath !== '/siakad/dekan') {
      return { authorized: false, correctPath: '/siakad/dekan' };
    }
    if (user.role === 'baak' && currentPath !== '/siakad/baak') {
      return { authorized: false, correctPath: '/siakad/baak' };
    }
    if (user.role === 'bauk' && currentPath !== '/siakad/bauk') {
      return { authorized: false, correctPath: '/siakad/bauk' };
    }
    if (user.role === 'applicant' && currentPath !== '/siakad/calon') {
      return { authorized: false, correctPath: '/siakad/calon' };
    }
    if (user.role === 'alumni' && currentPath !== '/siakad/alumni') {
      return { authorized: false, correctPath: '/siakad/alumni' };
    }

    return { authorized: true };
  };

  const authCheck = checkRouteAuthorization();

  // If user is logged in, but accesses / or wrong path, automatically redirect them to their proper route
  useEffect(() => {
    if (user) {
      if (currentPath === '/') {
        let target = '/admin';
        if (user.role === 'student') target = '/siakad/mahasiswa';
        else if (user.role === 'lecturer') target = '/siakad/dosen';
        else if (user.role === 'kaprodi') target = '/siakad/kaprodi';
        else if (user.role === 'dekan') target = '/siakad/dekan';
        else if (user.role === 'baak') target = '/siakad/baak';
        else if (user.role === 'bauk') target = '/siakad/bauk';
        else if (user.role === 'applicant') target = '/siakad/calon';
        else if (user.role === 'alumni') target = '/siakad/alumni';
        navigateToPath(target);
      } else if (!authCheck.authorized && authCheck.correctPath) {
        // Automatically correct route mismatch
        navigateToPath(authCheck.correctPath);
      }
    } else {
      // If NOT logged in, any path other than / should go back to /
      if (currentPath !== '/') {
        navigateToPath('/');
      }
    }
  }, [user, currentPath]);

  // High-level authorization guard: explicitly blocks access to KRS and Presensi modules for any user with 'lulus' (graduated) status
  useEffect(() => {
    if (user && user.role === 'student' && user.isGraduated) {
      if (currentView === 'krs' || currentView === 'presensi') {
        setCurrentView('dashboard');
      }
    }
  }, [user, currentView]);

  // Render the view corresponding to the active role state & sidebar currentView
  const renderViewContent = () => {
    if (!user) return null;

    if (currentView === 'showcase') {
      return <ShowcaseView />;
    }

    if (user.role === 'student') {
      if (user.isGraduated) {
        return (
          <AlumniDashboardView 
            user={user} 
            onUserChange={handleUserChange}
          />
        );
      }
      return (
        <MahasiswaDashboardView 
          user={user} 
          activeTab={currentView} 
          onChangeTab={setCurrentView} 
          onUserChange={handleUserChange}
        />
      );
    }

    if (user.role === 'alumni') {
      return (
        <AlumniDashboardView 
          user={user} 
          onUserChange={handleUserChange}
        />
      );
    }

    if (user.role === 'baak') {
      return (
        <BaakDashboardView 
          user={user} 
          onUserChange={handleUserChange}
        />
      );
    }

    if (user.role === 'bauk') {
      return (
        <BaukDashboardView 
          user={user} 
          onUserChange={handleUserChange}
        />
      );
    }

    if (user.role === 'applicant') {
      return (
        <ApplicantDashboardView 
          user={user} 
          onUserChange={handleUserChange}
        />
      );
    }

    if (user.role === 'lecturer') {
      return (
        <LecturerDashboardView 
          user={user} 
          activeTab={currentView} 
          onChangeTab={setCurrentView} 
          onUserChange={handleUserChange}
        />
      );
    }

    if (user.role === 'admin') {
      return (
        <AdminDashboardView 
          user={user} 
          activeTab={currentView} 
          onChangeTab={setCurrentView} 
        />
      );
    }

    if (user.role === 'kaprodi') {
      return (
        <KaprodiDashboardView 
          user={user} 
          activeTab={currentView} 
          onChangeTab={setCurrentView} 
        />
      );
    }

    if (user.role === 'dekan') {
      return (
        <DekanDashboardView 
          user={user} 
          activeTab={currentView} 
          onChangeTab={setCurrentView} 
        />
      );
    }

    switch (currentView) {
      case 'dashboard':
        return <DashboardView user={user} />;
      case 'mahasiswa':
        // Dosen & Admin only
        return user.role === 'admin' || user.role === 'lecturer' ? <MahasiswaView /> : <DashboardView user={user} />;
      case 'krs':
        // Student & Admin only
        return user.role === 'admin' || user.role === 'student' ? <KRSView /> : <DashboardView user={user} />;
      case 'khs':
        return <KHSView />;
      case 'presensi':
        // Dosen & Admin only
        return user.role === 'admin' || user.role === 'lecturer' ? <PresensiView /> : <DashboardView user={user} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 py-12">
            <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('app.coming_soon')}</h2>
            <p className="dark:text-slate-400">{t('app.module_in_dev').replace('{view}', currentView)}</p>
          </div>
        );
    }
  };

  // If not logged in, render the login view
  if (!user) {
    return (
      <div className={darkMode ? 'dark' : ''}>
        {isPreloading && tempUserData ? (
          <SiakadPreloader 
            onComplete={handlePreloadComplete}
            userRole={tempUserData.loggedInUser.role}
            userName={tempUserData.loggedInUser.name}
          />
        ) : (
          <LoginView onLoginSuccess={handleLoginSuccess} />
        )}
      </div>
    );
  }

  // Double check authorization (e.g. if state hasn't redirected yet)
  if (!authCheck.authorized && authCheck.correctPath) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl max-w-md w-full text-center shadow-xl space-y-6">
          <div className="mx-auto w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Akses Ditolak</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Anda tidak memiliki izin untuk mengakses halaman ini.
            </p>
          </div>
          <button
            onClick={() => navigateToPath(authCheck.correctPath!)}
            className="w-full py-2 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Dashboard Saya
          </button>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {isSkeletonLoading ? (
        <motion.div
          key="skeleton-loader-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="w-full min-h-screen"
        >
          <SkeletonLoader darkMode={darkMode} />
        </motion.div>
      ) : (
        <motion.div
          key="application-main-screen"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans overflow-hidden transition-colors duration-200 w-full"
        >
          {/* Mobile sidebar overlay and panel with smooth spring animations */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <>
                <motion.div 
                  id="mobile-sidebar-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 z-40 bg-slate-900/50 dark:bg-slate-950/80 lg:hidden"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                
                <motion.div 
                  id="mobile-sidebar-panel"
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                  className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden"
                >
                  <Sidebar 
                    currentView={currentView} 
                    onChangeView={(view) => {
                      setCurrentView(view);
                      setIsMobileMenuOpen(false);
                    }} 
                    role={user.role}
                    onLogout={handleLogout}
                    user={user}
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Desktop static sidebar - always visible on large screens */}
          <div id="desktop-sidebar-container" className="hidden lg:block w-64 flex-shrink-0">
            <Sidebar 
              currentView={currentView} 
              onChangeView={setCurrentView} 
              role={user.role}
              onLogout={handleLogout}
              user={user}
            />
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <Header 
              user={user} 
              onUserChange={handleUserChange}
              onMenuToggle={() => setIsMobileMenuOpen(true)} 
              darkMode={darkMode}
              onToggleTheme={toggleTheme}
              onTriggerSkeleton={handleTriggerSkeleton}
              currentView={currentView}
              isSkeletonLoading={isSkeletonLoading}
            />
            
            <ReactLenis root={false} className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
              <main className="w-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  {/* Clean modern breadcrumb navigation above active dashboard view */}
                  <Breadcrumb 
                    role={user.role} 
                    currentView={currentView} 
                    onNavigate={setCurrentView} 
                  />
                  
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentView}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="w-full"
                    >
                      {renderViewContent()}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </main>
            </ReactLenis>
          </div>

          {/* Floating Academic Chatbot Widget */}
          <AcademicChatbot user={user} />

          {/* Floating Feedback & Bug Report Widget */}
          <FeedbackWidget user={user} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
