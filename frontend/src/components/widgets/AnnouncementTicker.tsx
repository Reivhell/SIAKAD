import React, { useState, useEffect } from 'react';
import { Megaphone, X, AlertCircle } from 'lucide-react';
import { User as UserType } from '../../types';
import { getAcademicAnnouncements } from '../../api/academic.api';

interface Announcement {
  id: string;
  message: string;
  isUrgent: boolean;
  link?: string;
}

export function AnnouncementTicker({ user }: { user?: UserType }) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rows = await getAcademicAnnouncements();
        if (cancelled) return;
        // Filter sesuai peran pengguna agar ticker menampilkan pengumuman yang relevan.
        const targets = user?.role === 'lecturer'
          ? ['Semua', 'Dosen']
          : user?.role === 'student'
            ? ['Semua', 'Mahasiswa']
            : ['Semua'];
        const items: Announcement[] = rows
          .filter((a) => targets.includes(a.target || 'Semua'))
          .map((a) => ({
            id: a.id,
            message: `${a.title}${a.content ? ' — ' + a.content : ''} (${a.date || ''})`,
            isUrgent: /(urgent|penting|pemeliharaan|maintenance|darurat)/i.test(`${a.title} ${a.content}`),
            link: a.author ? `Diterbitkan oleh ${a.author}` : undefined,
          }));
        setAnnouncements(items);
      } catch {
        if (!cancelled) setAnnouncements([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

  if (loading || !isVisible || announcements.length === 0) return null;

  return (
    <div className="relative w-full bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 rounded-2xl overflow-hidden shadow-sm transition-colors duration-200">
      <div className="flex items-center">
        {/* Fixed Title Label */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-white font-bold text-xs select-none z-10 rounded-l-2xl shrink-0">
          <Megaphone className="w-4 h-4 animate-pulse" />
          <span className="hidden sm:inline">PENGUMUMAN</span>
          <span className="inline sm:hidden">INFO</span>
        </div>

        {/* Ticker Container */}
        <div className="flex-1 overflow-hidden relative py-2 bg-transparent select-none">
          <div className="flex whitespace-nowrap animate-marquee hover:[animation-play-state:paused] cursor-pointer">
            {/* Double the list to create infinite seamless loop effect */}
            {[...announcements, ...announcements].map((ann, idx) => (
              <span
                key={`${ann.id}-${idx}`}
                className="inline-flex items-center mx-10 text-xs font-bold text-amber-900 dark:text-amber-300 gap-2"
              >
                {ann.isUrgent && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-rose-600 text-white font-black animate-pulse flex items-center gap-1 shrink-0">
                    <AlertCircle className="w-2.5 h-2.5" /> URGENT
                  </span>
                )}
                <span>{ann.message}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="p-2 mr-1 text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-950/40 rounded-xl transition-colors shrink-0 cursor-pointer"
          title="Tutup pengumuman"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
