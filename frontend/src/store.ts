import { create } from 'zustand';
import { User } from './types';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  color?: string;
}

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
  customEvents: CalendarEvent[];
  addCustomEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  deleteCustomEvent: (id: string) => void;
  notifications: AppNotification[];
  addNotification: (message: string, type?: 'success' | 'info' | 'warning') => void;
  clearNotifications: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  
  themePreference: 'light',
  setThemePreference: (themePreference) => set({ themePreference }),

  customEvents: [
    { id: '1', title: 'Awal Perkuliahan Semester Ganjil', start: '2026-09-01', color: '#3b82f6' },
    { id: '2', title: 'Batas Akhir Pembayaran UKT', start: '2026-08-25', color: '#ef4444' },
    { id: '3', title: 'Ujian Tengah Semester (UTS)', start: '2026-10-15', color: '#f59e0b' },
    { id: '4', title: 'Wisuda Sarjana Periode I', start: '2026-11-20', color: '#10b981' },
  ],

  addCustomEvent: (event) => set((state) => ({
    customEvents: [
      ...state.customEvents,
      {
        ...event,
        id: Math.random().toString(36).substr(2, 9),
      }
    ]
  })),

  deleteCustomEvent: (id) => set((state) => ({
    customEvents: state.customEvents.filter((ev) => ev.id !== id)
  })),

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
