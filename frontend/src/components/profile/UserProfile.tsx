import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  User as UserIcon, Mail, Phone, Bookmark, Save, Upload, Camera, Trash2, Check, AlertCircle, Sun, Moon,
  Building2, GraduationCap, Briefcase, BookOpen, Award, Lock, Info
} from 'lucide-react';
import { User } from '../../types';
import { useAppStore } from '../../store';

// Zod validation schema for profile basic information
const profileSchema = z.object({
  name: z.string().min(3, { message: 'Nama lengkap minimal 3 karakter' }),
  email: z.string().email({ message: 'Alamat email tidak valid' }),
  phone: z.string()
    .min(10, { message: 'Nomor telepon minimal 10 digit' })
    .regex(/^[\d\-+()\s]+$/, { message: 'Nomor telepon hanya boleh berisi angka dan simbol (+, -, (, ))' }),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface UserProfileProps {
  user: User;
  onSave: (updatedUser: User) => void;
  onCancel?: () => void;
}

export function UserProfile({ user, onSave, onCancel }: UserProfileProps) {
  const [avatar, setAvatar] = useState(user.avatar || '');
  const [themePreference, setThemePreference] = useState<'light' | 'dark'>(user.themePreference || 'light');
  
  const [isDragOver, setIsDragOver] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Predefined cool avatar colors/gradients in case they don't upload
  const defaultAvatars = [
    { name: 'Blue Sky', value: 'bg-gradient-to-br from-blue-500 to-sky-600 text-white' },
    { name: 'Emerald Forest', value: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white' },
    { name: 'Indigo Night', value: 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' },
    { name: 'Sunset Orange', value: 'bg-gradient-to-br from-orange-500 to-rose-600 text-white' },
    { name: 'Crimson Rose', value: 'bg-gradient-to-br from-rose-500 to-pink-600 text-white' },
  ];

  const [avatarTheme, setAvatarTheme] = useState(() => {
    return localStorage.getItem(`siakad_avatar_theme_${user.id}`) || defaultAvatars[0].value;
  });

  const getDefaultDepartment = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'dekan':
        return 'Fakultas Teknologi Informasi';
      default:
        return 'Teknik Informatika';
    }
  };

  // Load current user from the global AppStore
  const currentUser = useAppStore((state) => state.user);

  // Helper function to validate whether the current user has permission to edit profile fields.
  // Ensures only admins can modify fields belonging to other roles while students remain restricted.
  const checkPermission = (fieldName: keyof ProfileFormData | 'department' | 'avatar' | 'theme'): boolean => {
    const effectiveCurrentUser = currentUser || user;
    if (!effectiveCurrentUser) return false;

    // Admins can modify any profile fields for any role
    if (effectiveCurrentUser.role === 'admin') return true;

    // Non-admins cannot modify other users' profiles at all
    if (effectiveCurrentUser.id !== user.id) return false;

    // If modifying their own profile:
    // Students remain restricted: they cannot edit 'name' or 'department' (prodi)
    if (effectiveCurrentUser.role === 'student') {
      if (fieldName === 'name' || fieldName === 'department') {
        return false;
      }
      return true;
    }

    // Other roles (lecturer, kaprodi, dekan) can modify everything except their 'department'
    if (fieldName === 'department') {
      return false;
    }

    return true;
  };

  // Helper to render role-specific badge info as a conditionally rendered footer below profile fields
  const renderInformationalFooter = () => {
    const roleColors = {
      admin: {
        bg: 'bg-blue-50/50 dark:bg-blue-950/20',
        border: 'border-blue-100 dark:border-blue-900/30',
        text: 'text-blue-700 dark:text-blue-400',
        label: 'Unit Kerja',
        value: user.department || 'Admin',
        icon: Building2
      },
      student: {
        bg: 'bg-emerald-50/50 dark:bg-emerald-950/20',
        border: 'border-emerald-100 dark:border-emerald-900/30',
        text: 'text-emerald-700 dark:text-emerald-400',
        label: 'Prodi',
        value: user.department || 'Teknik Informatika',
        icon: GraduationCap
      },
      lecturer: {
        bg: 'bg-amber-50/50 dark:bg-amber-950/20',
        border: 'border-amber-100 dark:border-amber-900/30',
        text: 'text-amber-700 dark:text-amber-400',
        label: 'Prodi',
        value: user.department || 'Teknik Informatika',
        icon: Briefcase
      },
      kaprodi: {
        bg: 'bg-indigo-50/50 dark:bg-indigo-950/20',
        border: 'border-indigo-100 dark:border-indigo-900/30',
        text: 'text-indigo-700 dark:text-indigo-400',
        label: 'Prodi',
        value: user.department || 'Teknik Informatika',
        icon: BookOpen
      },
      dekan: {
        bg: 'bg-rose-50/50 dark:bg-rose-950/20',
        border: 'border-rose-100 dark:border-rose-900/30',
        text: 'text-rose-700 dark:text-rose-400',
        label: 'Fakultas',
        value: user.department || 'Fakultas Teknologi Informasi',
        icon: Award
      },
      baak: {
        bg: 'bg-teal-50/50 dark:bg-teal-950/20',
        border: 'border-teal-100 dark:border-teal-900/30',
        text: 'text-teal-700 dark:text-teal-400',
        label: 'Unit Kerja',
        value: user.department || 'Administrasi Akademik',
        icon: Building2
      },
      bauk: {
        bg: 'bg-purple-50/50 dark:bg-purple-950/20',
        border: 'border-purple-100 dark:border-purple-900/30',
        text: 'text-purple-700 dark:text-purple-400',
        label: 'Unit Kerja',
        value: user.department || 'Biro Keuangan',
        icon: Building2
      },
      applicant: {
        bg: 'bg-cyan-50/50 dark:bg-cyan-950/20',
        border: 'border-cyan-100 dark:border-cyan-900/30',
        text: 'text-cyan-700 dark:text-cyan-400',
        label: 'Pendaftaran',
        value: user.department || 'Penerimaan Mahasiswa Baru',
        icon: Building2
      },
      alumni: {
        bg: 'bg-orange-50/50 dark:bg-orange-950/20',
        border: 'border-orange-100 dark:border-orange-900/30',
        text: 'text-orange-700 dark:text-orange-400',
        label: 'Alumni',
        value: user.department || 'Teknik Informatika',
        icon: Building2
      },
    };

    const config = roleColors[user.role] || roleColors.student;
    const IconComponent = config.icon;

    return (
      <div className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${config.bg} ${config.border} transition-all duration-300 shadow-sm mt-2`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-white dark:bg-slate-900 border ${config.border} ${config.text} shadow-sm`}>
            <IconComponent className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {config.label === 'Unit Kerja' ? 'Unit Kerja' : 'Prodi / Fakultas'}
            </p>
            <p className="text-xs font-black text-slate-800 dark:text-slate-200">
              {config.label}: {config.value}
            </p>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${config.border} ${config.bg} ${config.text} uppercase tracking-wider`}>
            {user.role}
          </span>
        </div>
      </div>
    );
  };

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phone || '0812-3456-7890',
    },
  });

  // Reset form default values when user changes
  useEffect(() => {
    reset({
      name: user.name,
      email: user.email,
      phone: user.phone || '0812-3456-7890',
    });
    setAvatar(user.avatar || '');
    setThemePreference(user.themePreference || 'light');
    setAvatarTheme(localStorage.getItem(`siakad_avatar_theme_${user.id}`) || defaultAvatars[0].value);
  }, [user, reset]);

  // Watch display name to generate dynamic single-letter placeholder
  const watchedName = watch('name', user.name);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setFileError('File harus berupa gambar (JPEG, PNG, WEBP).');
      return;
    }
    
    // Check file size (max 2MB for base64 storage)
    if (file.size > 2 * 1024 * 1024) {
      setFileError('Ukuran gambar terlalu besar. Maksimal adalah 2MB.');
      return;
    }

    setFileError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setAvatar(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveAvatar = () => {
    setAvatar('');
    setFileError(null);
  };

  const onSubmitForm = (data: ProfileFormData) => {
    const updatedUser: User = {
      ...user,
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      department: user.department || getDefaultDepartment(user.role),
      avatar: avatar,
      themePreference: themePreference
    };

    // Save avatar theme
    localStorage.setItem(`siakad_avatar_theme_${user.id}`, avatarTheme);
    
    // Call parent handler
    onSave(updatedUser);
    
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2500);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      {fileError && (
        <div className="p-3.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900 rounded-xl text-xs text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{fileError}</span>
        </div>
      )}

      {saveSuccess && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 rounded-xl text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>Profil berhasil disimpan &amp; disinkronkan ke Local Storage!</span>
        </div>
      )}

      {/* Picture Upload / Avatar Area */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Foto Profil / Gambar Pengguna
        </label>
        
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
          {/* Preview circle */}
          <div className="sm:col-span-3 flex justify-center">
            {avatar ? (
              <div className="relative group w-20 h-20 rounded-full overflow-hidden border-2 border-blue-500 shadow-md">
                <img 
                  src={avatar} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-150 cursor-pointer"
                  title="Hapus foto profil"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black shadow-md border-2 border-slate-200 dark:border-slate-800 ${avatarTheme}`}>
                {watchedName && typeof watchedName === 'string' && watchedName.length > 0 ? watchedName.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
          </div>

          {/* Upload Dropzone */}
          <div className="sm:col-span-9">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={triggerFileInput}
              className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-155 ${
                isDragOver 
                  ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/15' 
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/20 dark:bg-slate-950/10'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFile(e.target.files[0]);
                  }
                }}
                className="hidden"
                accept="image/*"
              />
              <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1.5" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Tarik gambar kemari atau <span className="text-blue-600 dark:text-blue-400 underline">pilih file</span>
              </p>
              <p className="text-[10px] text-slate-400 mt-1 font-medium">
                Format: JPEG, PNG, WEBP (Maks 2MB)
              </p>
            </div>
          </div>
        </div>

        {/* Preset theme options in case they don't upload a picture */}
        {!avatar && (
          <div className="pt-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Tema Profil Default
            </span>
            <div className="flex gap-2">
              {defaultAvatars.map((theme, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatarTheme(theme.value)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${theme.value} ${
                    avatarTheme === theme.value 
                      ? 'border-slate-800 dark:border-white scale-110 shadow-md' 
                      : 'border-transparent hover:scale-105'
                  }`}
                  title={theme.name}
                >
                  {avatarTheme === theme.value && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Details Inputs with react-hook-form */}
      <div className="space-y-4">
        {/* Name input */}
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Nama Lengkap / Nama Tampilan
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <UserIcon className="w-4 h-4" />
            </div>
            <input
              type="text"
              {...register('name')}
              readOnly={!checkPermission('name')}
              className={`block w-full pl-10 pr-3 py-2 border rounded-xl text-xs font-semibold placeholder-slate-400 focus:outline-none focus:ring-1 transition-colors ${
                !checkPermission('name')
                  ? 'bg-slate-50 dark:bg-slate-900/40 text-slate-400 dark:text-slate-500 cursor-not-allowed border-slate-200 dark:border-slate-800'
                  : errors.name 
                    ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white border-rose-500 focus:ring-rose-500 focus:border-rose-500' 
                    : 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="Display Name"
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-[10px] text-rose-500 font-semibold">{errors.name.message}</p>
          )}
        </div>

        {/* Email input */}
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Alamat Email Kontak
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              {...register('email')}
              readOnly={!checkPermission('email')}
              className={`block w-full pl-10 pr-3 py-2 border rounded-xl text-xs font-semibold placeholder-slate-400 focus:outline-none focus:ring-1 transition-colors ${
                !checkPermission('email')
                  ? 'bg-slate-50 dark:bg-slate-900/40 text-slate-400 dark:text-slate-500 cursor-not-allowed border-slate-200 dark:border-slate-800'
                  : errors.email 
                    ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white border-rose-500 focus:ring-rose-500 focus:border-rose-500' 
                    : 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="contact@email.com"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-[10px] text-rose-500 font-semibold">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            No. Telepon / HP
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Phone className="w-4 h-4" />
            </div>
            <input
              type="text"
              {...register('phone')}
              readOnly={!checkPermission('phone')}
              className={`block w-full pl-10 pr-3 py-2 border rounded-xl text-xs font-semibold placeholder-slate-400 focus:outline-none focus:ring-1 transition-colors ${
                !checkPermission('phone')
                  ? 'bg-slate-50 dark:bg-slate-900/40 text-slate-400 dark:text-slate-500 cursor-not-allowed border-slate-200 dark:border-slate-800'
                  : errors.phone 
                    ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white border-rose-500 focus:ring-rose-500 focus:border-rose-500' 
                    : 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="0812345678"
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-[10px] text-rose-500 font-semibold">{errors.phone.message}</p>
          )}
        </div>

        {/* Informational Footer Section */}
        {renderInformationalFooter()}

        {/* Theme Preference Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Preferensi Tema Tampilan
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setThemePreference('light')}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                themePreference === 'light'
                  ? 'border-blue-500 bg-blue-50/50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950'
              }`}
            >
              <Sun className={`w-4 h-4 ${themePreference === 'light' ? 'animate-spin-slow' : ''}`} />
              Mode Terang (Light)
            </button>
            <button
              type="button"
              onClick={() => setThemePreference('dark')}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                themePreference === 'dark'
                  ? 'border-blue-500 bg-blue-50/50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950'
              }`}
            >
              <Moon className="w-4 h-4" />
              Mode Gelap (Dark)
            </button>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors"
          >
            Batal
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/10 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>
    </form>
  );
}
