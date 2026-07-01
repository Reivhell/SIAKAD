import React, { useState } from 'react';
import { Bell, Check, X, ShieldAlert, CreditCard, Calendar, Info, CheckSquare } from 'lucide-react';
import { Role } from '../../types';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  category: 'akademik' | 'keuangan' | 'sistem' | 'kegiatan';
  read: boolean;
  targetRole: Role | 'all';
}

const initialNotifications: NotificationItem[] = [
  {
    id: '1',
    title: 'Penutupan KRS',
    message: 'Pengisian KRS Semester Ganjil akan ditutup dalam 3 hari pada tanggal 27 Juni 2026.',
    time: '10 menit yang lalu',
    category: 'akademik',
    read: false,
    targetRole: 'all',
  },
  {
    id: '2',
    title: 'Pembayaran UKT Berhasil',
    message: 'Pembayaran UKT semester Ganjil 2023/2024 Anda telah diverifikasi oleh sistem keuangan.',
    time: '2 jam yang lalu',
    category: 'keuangan',
    read: false,
    targetRole: 'student',
  },
  {
    id: '3',
    title: 'Persetujuan KRS Wali',
    message: 'KRS Anda telah disetujui oleh Dosen Wali (Dr. Budi R.). Silakan cetak KRS Anda.',
    time: '5 jam yang lalu',
    category: 'akademik',
    read: true,
    targetRole: 'student',
  },
  {
    id: '4',
    title: 'Evaluasi Dosen Pengampu',
    message: 'Mohon mengisi kuesioner evaluasi dosen pengampu semester sebelumnya untuk membuka KHS.',
    time: '1 hari yang lalu',
    category: 'akademik',
    read: false,
    targetRole: 'student',
  },
  {
    id: '5',
    title: 'Maintenance Terjadwal',
    message: 'Server SIAKAD akan mengalami maintenance berkala pada hari Sabtu, 27 Juni pukul 22.00 - 24.00 WIB.',
    time: '1 hari yang lalu',
    category: 'sistem',
    read: false,
    targetRole: 'all',
  },
  {
    id: '6',
    title: 'Batas Penyerahan Nilai UAS',
    message: 'Pengingat bagi dosen: batas akhir penyerahan nilai UAS Semester Genap adalah 2 Juli 2026.',
    time: '2 hari yang lalu',
    category: 'akademik',
    read: false,
    targetRole: 'lecturer',
  },
  {
    id: '7',
    title: 'Pengajuan Beasiswa Dibuka',
    message: 'Beasiswa Unggulan Prestasi Kampus dibuka sampai dengan tanggal 15 Juli 2026.',
    time: '3 hari yang lalu',
    category: 'kegiatan',
    read: true,
    targetRole: 'all',
  },
  {
    id: '8',
    title: 'Persetujuan Mahasiswa Bimbingan',
    message: 'Ada 5 mahasiswa bimbingan baru yang mengajukan draft KRS dan membutuhkan persetujuan Anda.',
    time: '4 jam yang lalu',
    category: 'akademik',
    read: false,
    targetRole: 'lecturer',
  }
];

interface NotificationCenterProps {
  currentRole: Role;
  isOpen: boolean;
  onClose: () => void;
  onUnreadCountChange?: (count: number) => void;
}

export function NotificationCenter({ currentRole, isOpen, onClose, onUnreadCountChange }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // Filter based on the current role AND target audience
  const roleFiltered = notifications.filter(notif => 
    notif.targetRole === 'all' || notif.targetRole === currentRole
  );

  const displayNotifications = filter === 'all' 
    ? roleFiltered 
    : roleFiltered.filter(n => !n.read);

  const unreadCount = roleFiltered.filter(n => !n.read).length;

  // Inform parent of the unread count changes
  React.useEffect(() => {
    if (onUnreadCountChange) {
      onUnreadCountChange(unreadCount);
    }
  }, [unreadCount, onUnreadCountChange]);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => n.targetRole === 'all' || n.targetRole === currentRole ? { ...n, read: true } : n));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'akademik':
        return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'keuangan':
        return <CreditCard className="w-4 h-4 text-emerald-500" />;
      case 'sistem':
        return <ShieldAlert className="w-4 h-4 text-amber-500" />;
      default:
        return <Info className="w-4 h-4 text-purple-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl z-50 overflow-hidden text-slate-800 dark:text-slate-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/40">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h4 className="font-semibold text-sm">Notifikasi ({unreadCount})</h4>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center gap-0.5"
            >
              <CheckSquare className="w-3 h-3" />
              Baca Semua
            </button>
          )}
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-100 dark:border-slate-800/80 text-xs px-2 py-1 gap-1">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            filter === 'all' 
              ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400' 
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Semua ({roleFiltered.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            filter === 'unread' 
              ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400' 
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Belum Dibaca ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="max-h-[350px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
        {displayNotifications.length === 0 ? (
          <div className="py-12 text-center text-slate-500 dark:text-slate-400">
            <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
            <p className="text-xs font-medium">Tidak ada notifikasi baru</p>
          </div>
        ) : (
          displayNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-4 text-xs relative flex gap-3 transition-colors ${
                !notification.read 
                  ? 'bg-blue-50/40 dark:bg-blue-950/10' 
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  {getCategoryIcon(notification.category)}
                </div>
              </div>
              <div className="flex-1 min-w-0 pr-6">
                <div className="flex items-center justify-between gap-1">
                  <h5 className="font-bold text-slate-900 dark:text-white truncate">{notification.title}</h5>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">{notification.time}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{notification.message}</p>
                <div className="flex gap-2 mt-2 items-center">
                  <span className="text-[10px] uppercase font-semibold text-slate-400">
                    #{notification.category}
                  </span>
                  {!notification.read && (
                    <button 
                      onClick={() => markAsRead(notification.id)}
                      className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline font-bold flex items-center gap-0.5"
                    >
                      <Check className="w-3 h-3" />
                      Tandai Dibaca
                    </button>
                  )}
                </div>
              </div>

              {/* Delete button */}
              <button 
                onClick={() => deleteNotification(notification.id)}
                className="absolute top-4 right-4 p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
                title="Hapus"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Target Roles Summary for UI feedback */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/60 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
        <span>Menampilkan notifikasi untuk peran: </span>
        <span className="font-bold uppercase text-blue-600 dark:text-blue-400">
          {currentRole === 'admin' ? 'Staf Akademik' : currentRole === 'lecturer' ? 'Dosen' : 'Mahasiswa'}
        </span>
      </div>
    </div>
  );
}
