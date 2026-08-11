import React, { useState, useEffect } from 'react';
import { Megaphone, X, ExternalLink, Sparkles, AlertCircle } from 'lucide-react';

interface Announcement {
  id: string;
  message: string;
  isUrgent: boolean;
  link?: string;
}

const defaultAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    message: '⚠️ PENTING: Batas akhir pengisian KRS Semester Ganjil TA 2026/2027 adalah 10 Agustus 2026. Segera lakukan konsultasi dengan Dosen Wali Anda.',
    isUrgent: true,
  },
  {
    id: 'ann-2',
    message: '🎓 Yudisium dan Pendaftaran Wisuda Periode II Tahun 2026 telah dibuka. Silakan unggah dokumen kelengkapan di modul Yudisium & Wisuda.',
    isUrgent: false,
  },
  {
    id: 'ann-3',
    message: '🔬 Penerimaan Proposal Hibah Penelitian & Pengabdian Masyarakat Program Studi Tahun Anggaran 2026 diperpanjang hingga akhir bulan ini.',
    isUrgent: false,
  },
  {
    id: 'ann-4',
    message: '🚨 PEMELIHARAAN SISTEM: Server SIAKAD Utama akan menjalani maintenance rutin pada hari Sabtu mulai pukul 22:00 WIB s.d. Minggu 02:00 WIB.',
    isUrgent: true,
  }
];

export function AnnouncementTicker() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching announcements from a database or localStorage
    const saved = localStorage.getItem('siakad_announcements');
    if (saved) {
      setAnnouncements(JSON.parse(saved));
      setLoading(false);
    } else {
      // Seed initial announcements
      localStorage.setItem('siakad_announcements', JSON.stringify(defaultAnnouncements));
      setAnnouncements(defaultAnnouncements);
      setLoading(false);
    }
  }, []);

  if (!isVisible || announcements.length === 0) return null;

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

      {/* Add Marquee CSS animation style dynamically if not present in tailwind.config */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-flex;
          white-space: nowrap;
          animation: marquee 35s linear infinite;
        }
      `}</style>
    </div>
  );
}
