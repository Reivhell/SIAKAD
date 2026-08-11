import { create } from 'zustand';
import { User } from './types';

interface AppNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
  timestamp: Date;
}

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
  themePreference: 'light' | 'dark';
  setThemePreference: (theme: 'light' | 'dark') => void;
  notifications: AppNotification[];
  addNotification: (message: string, type?: 'success' | 'info' | 'warning') => void;
  clearNotifications: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),

  themePreference: 'light',
  setThemePreference: (themePreference) => set({ themePreference }),

  notifications: [
    { id: 'n1', message: 'Selamat datang di Hub Integrasi SIAKAD Modern!', type: 'success', timestamp: new Date() },
    { id: 'n2', message: 'Nilai matakuliah Rekayasa Perangkat Lunak telah dirilis.', type: 'info', timestamp: new Date() }
  ],

  addNotification: (message, type = 'info') => set((state) => ({
    notifications: [
      {
        id: Math.random().toString(36).substr(2, 9),
        message,
        type,
        timestamp: new Date()
      },
      ...state.notifications
    ]
  })),

  clearNotifications: () => set({ notifications: [] }),
}));
