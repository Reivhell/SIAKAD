import React, { useState } from 'react';
import { LecturerProfile } from '../../../api/academic.api';
import { User, Award, Shield, FileText, CheckCircle2 } from 'lucide-react';

interface LecturerProfileModuleProps {
  profile: LecturerProfile;
  setProfile: React.Dispatch<React.SetStateAction<LecturerProfile>>;
  onShowToast: (message: string) => void;
  subTab?: string;
}

export function LecturerProfileModule({ profile, setProfile, onShowToast, subTab = 'profil' }: LecturerProfileModuleProps) {
  // Ubah Password States
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Edit Profile States
  const [phone, setPhone] = useState(profile.phone);
  const [email, setEmail] = useState(profile.email);
  const [address, setAddress] = useState(profile.address);

  const handleUpdateContact = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(prev => ({
      ...prev,
      phone,
      email,
      address
    }));
    onShowToast('Kontak profil berhasil diperbarui!');
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      onShowToast('Error: Semua kolom kata sandi wajib diisi!');
      return;
    }
    if (newPassword !== confirmPassword) {
      onShowToast('Error: Konfirmasi kata sandi baru tidak cocok!');
      return;
    }
    onShowToast('Kata sandi berhasil diubah secara aman!');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6">
      {/* Profil View */}
      {subTab === 'profil' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left profile card */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
            <div className="relative group">
              <img 
                src={profile.foto} 
                alt={profile.name} 
                className="w-28 h-28 rounded-full object-cover border-4 border-blue-500/10 shadow-lg"
                referrerPolicy="no-referrer"
              />
              <button 
                onClick={() => onShowToast('Simulasi unggah foto profil berhasil!')}
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700 transition-colors cursor-pointer text-xs font-bold"
                title="Ubah Foto Profil"
              >
                +
              </button>
            </div>
            <h3 className="mt-4 text-base font-extrabold text-slate-800 dark:text-white leading-tight">
              {profile.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
              NIDN. {profile.nidn}
            </p>
            <div className="mt-2.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-[11px] font-bold text-blue-600 dark:text-blue-400">
              {profile.jabatan}
            </div>

            <div className="w-full border-t border-slate-100 dark:border-slate-800 my-5 pt-5 space-y-4 text-left">
              <div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">Program Studi</span>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">{profile.prodi}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">Status Ikatan Kerja</span>
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Dosen Tetap PNS
                </p>
              </div>
            </div>
          </div>

          {/* Right details panel */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-5 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-500" /> Detail Informasi Pribadi
              </h4>
              <form onSubmit={handleUpdateContact} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Email Akademis</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">No. Telepon / WA</label>
                    <input 
                      type="text" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 font-semibold"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Alamat Tempat Tinggal</label>
                  <textarea 
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 font-semibold resize-none"
                  />
                </div>
                <div className="flex justify-end">
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm"
                  >
                    Simpan Perubahan Kontak
                  </button>
                </div>
              </form>
            </div>

            {/* Riwayat Pendidikan */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-5 flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-500" /> Riwayat Pendidikan Tinggi
              </h4>
              <div className="relative border-l border-slate-200 dark:border-slate-800 ml-3 space-y-6">
                {profile.riwayatPendidikan.map((edu, idx) => (
                  <div key={idx} className="relative pl-6">
                    <div className="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-blue-600 border border-white dark:border-slate-900" />
                    <span className="text-[10px] text-blue-600 font-boldr">{edu.jenjang} - Lulus Tahun {edu.tahun}</span>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-white mt-0.5">{edu.institusi}</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">Program Studi: {edu.prodi}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ubah Password View */}
      {subTab === 'ubah-password' && (
        <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">Ubah Kata Sandi Akun</h4>
              <p className="text-[11px] text-slate-500">Pastikan menggunakan kombinasi karakter yang kuat.</p>
            </div>
          </div>
          <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Kata Sandi Lama</label>
              <input 
                type="password" 
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Kata Sandi Baru</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Ulangi Kata Sandi Baru</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <div className="flex justify-end pt-2">
              <button 
                type="submit" 
                className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm shadow-orange-600/10"
              >
                Perbarui Kata Sandi Akun
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
