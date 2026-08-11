import { useState, useEffect } from 'react';

export type Language = 'id' | 'en';

export const languages: { code: Language; label: string; flag: string; dir: 'ltr' | 'rtl' }[] = [
  { code: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩', dir: 'ltr' },
  { code: 'en', label: 'English', flag: '🇺🇸', dir: 'ltr' },
];

export const translations: Record<Language, Record<string, string>> = {
  id: {
    // Login
    'login.welcome': 'Portal Akademik Terpadu (SIAKAD)',
    'login.subtitle': 'Sistem Informasi Akademik Berbasis Cloud',
    'login.username': 'Nama Pengguna / Email',
    'login.password': 'Kata Sandi',
    'login.button': 'Masuk Ke Portal',
    'login.role_preview': 'Pratinjau Peran Akun',
    'login.lang_select': 'Pilih Bahasa',
    'login.credentials_desc': 'Gunakan akun terdaftar Anda untuk mengakses portal akademik.',

    // Sidebar & Navigation
    'nav.dashboard': 'Dasbor Utama',
    'nav.krs': 'Isi KRS Online',
    'nav.khs': 'Hasil Studi (KHS)',
    'nav.jadwal': 'Jadwal Kuliah',
    'nav.transkrip': 'Transkrip Akademik',
    'nav.presensi': 'Kehadiran & Absen',
    'nav.keuangan': 'Keuangan & UKT',
    'nav.profil': 'Profil Saya',
    'nav.layanan': 'E-Form Layanan',
    'nav.unduhan': 'Unduhan Berkas',
    'nav.inovasi': 'Pusat Inovasi',
    'nav.edom': 'Evaluasi Dosen (EDOM)',
    'nav.pengumuman': 'Pengumuman Resmi',
    'nav.logout': 'Keluar Sistem',

    // Headers & Common Buttons
    'header.simulation_role': 'Simulasi Peran',
    'header.sim_skeleton': 'Simulasi Skeleton',
    'header.profile_settings': 'Pengaturan Profil',
    'header.status_active': 'Aktif',
    'header.status_inactive': 'Tidak Aktif',
    'common.save': 'Simpan Perubahan',
    'common.cancel': 'Batal',
    'common.close': 'Tutup',
    'common.action': 'Aksi',
    'common.status': 'Status',
    'common.date': 'Tanggal',
    'common.description': 'Deskripsi',
    'common.download': 'Unduh',
    'common.submit': 'Kirimkan',
    'common.search': 'Cari...',

    // SKS Conversion Feature
    'sks.title': 'Konversi SKS Otomatis (Merdeka Belajar / Transfer)',
    'sks.subtitle': 'Sistem pencocokan CPL (Capaian Pembelajaran) otomatis dan pengalihan SKS resmi.',
    'sks.lecturer_view': 'Panel Pengusulan Penyetaraan (Dosen)',
    'sks.student_view': 'Riwayat Konversi SKS Anda (Mahasiswa)',
    'sks.university_origin': 'Universitas Asal / Kegiatan',
    'sks.course_origin': 'Mata Kuliah Asal',
    'sks.sks_origin': 'SKS Asal',
    'sks.course_target': 'Mata Kuliah SIAKAD Sasaran',
    'sks.match_cpl': 'Kecocokan CPL (Capaian Pembelajaran)',
    'sks.calculate_btn': 'Hitung & Cocokkan CPL',
    'sks.propose_btn': 'Usulkan Penyetaraan',
    'sks.history_title': 'Daftar Riwayat Penyetaraan & Konversi',
    'sks.status.proposed': 'Diajukan',
    'sks.status.matching': 'Mengecek CPL',
    'sks.status.approved': 'Disetujui',
    'sks.status.rejected': 'Ditolak',

    // Deadlines & Tasks Feature
    'task.title': 'Timeline Deadline & Pengingat Tugas',
    'task.subtitle': 'Pantau seluruh tugas kuliah secara terpusat dengan notifikasi pengingat otomatis.',
    'task.input_title': 'Input Deadline Tugas Baru (Dosen)',
    'task.task_name': 'Nama Tugas',
    'task.course_select': 'Pilih Mata Kuliah',
    'task.due_date': 'Batas Pengumpulan',
    'task.create_btn': 'Publikasikan Tugas',
    'task.timeline': 'Garis Waktu Deadline Tugas Kuliah',
    'task.remind_1': 'Notifikasi H-1 Dikirimkan',
    'task.remind_3': 'Pengingat H-3 Jam Berdering',
    'task.submit_status': 'Status Pengumpulan',
    'task.remaining_time': 'Sisa Waktu',

    // e-Forms Feature
    'form.title': 'E-Form & Layanan Akademik Mandiri',
    'form.subtitle': 'Pengajuan surat resmi, cuti, pindah kelas secara digital dengan tracker status real-time.',
    'form.select_type': 'Pilih Jenis Layanan',
    'form.reason': 'Alasan Pengajuan / Keterangan Tambahan',
    'form.upload_doc': 'Unggah Dokumen Pendukung (PDF/JPG)',
    'form.submit_btn': 'Kirim Permohonan',
    'form.active_letter': 'Surat Keterangan Aktif Kuliah',
    'form.academic_leave': 'Permohonan Cuti Akademik',
    'form.class_transfer': 'Permohonan Pindah Kelas',
    'form.resignation': 'Permohonan Pengunduran Diri',
    'form.transcript_req': 'Permohonan Transkrip Resmi',
    'form.track_title': 'Tracker Status Pengajuan Layanan',
    'form.step.submitted': 'Diajukan',
    'form.step.verified': 'Verifikasi Berkas',
    'form.step.approved': 'Disetujui Kaprodi',
    'form.step.completed': 'Selesai / Terbit',

    // Sidebar Groups
    'sidebar.group.main': 'Utama',
    'sidebar.group.academic': 'Akademik',
    'sidebar.group.academic_self': 'Akademik Mandiri',
    'sidebar.group.services_files': 'Layanan & Berkas',
    'sidebar.group.innovation_adv': 'Inovasi Canggih',
    'sidebar.group.info_finance': 'Informasi & Keuangan',
    'sidebar.group.grading': 'Penilaian',
    'sidebar.group.advising': 'Bimbingan',
    'sidebar.group.communication': 'Komunikasi',
    'sidebar.group.reports': 'Laporan',
    'sidebar.group.settings': 'Pengaturan',
    'sidebar.group.dashboard': 'Dashboard',
    'sidebar.group.master_data': 'Master Data',
    'sidebar.group.monitoring': 'Monitoring',
    'sidebar.group.announcements': 'Pengumuman',
    'sidebar.group.enterprise_suite': 'Enterprise Suite',
    
    // Lecturer Nav Items
    'nav.dashboard_lecturer': 'Dashboard Dosen',
    'nav.schedule_teaching': 'Jadwal Mengajar',
    'nav.class_lectures': 'Kelas Perkuliahan',
    'nav.attendance_lectures': 'Presensi Perkuliahan',
    'nav.journal_teaching': 'Jurnal Mengajar',
    'nav.course_materials': 'Materi Kuliah',
    'nav.input_grades': 'Input Nilai',
    'nav.recap_grades': 'Rekap Nilai',
    'nav.krs_students': 'KRS Mahasiswa',
    'nav.advisor_lecturer': 'Dosen Wali',
    'nav.thesis': 'Skripsi / TA',
    'nav.class_announcements': 'Pengumuman Kelas',
    'nav.messages_chat': 'Pesan / Chat',
    'nav.recap_attendance': 'Rekap Presensi',
    'nav.bkd_report': 'Laporan BKD',
    'nav.teaching_history': 'Riwayat Mengajar',
    'nav.edom_eval': 'Evaluasi Kinerja (EDOM)',
    'nav.profile_lecturer': 'Profil Dosen',
    'nav.change_password': 'Ubah Password',

    // Admin Nav Items
    'nav.dashboard_admin': 'Dashboard Admin',
    'nav.innovation_hub': 'Hub Inovasi Modern',
    'nav.students': 'Mahasiswa',
    'nav.lecturers': 'Dosen',
    'nav.study_programs': 'Program Studi',
    'nav.courses': 'Mata Kuliah',
    'nav.rooms': 'Ruangan',
    'nav.users': 'User',
    'nav.academic_year': 'Tahun Akademik',
    'nav.curriculum': 'Kurikulum',
    'nav.lecture_classes': 'Kelas Kuliah',
    'nav.lecture_schedules': 'Jadwal Kuliah',
    'nav.krs_admin': 'KRS',
    'nav.khs_admin': 'KHS',
    'nav.attendance_admin': 'Presensi',
    'nav.grades_admin': 'Nilai',
    'nav.user_activity': 'Aktivitas User',
    'nav.monitor_edom': 'Monitor EDOM',
    'nav.reports_admin': 'Laporan',
    'nav.announcements_admin': 'Pengumuman',
    'nav.workflow_engine': 'Workflow Engine',
    'nav.pddikti_feeder': 'PDDIKTI Feeder',
    'nav.obe_assessment': 'OBE Assessment',
    'nav.mbkm_module': 'Modul MBKM',
    'nav.thesis_defense': 'Sidang & Skripsi',
    'nav.conflict_engine': 'Conflict Engine',
    'nav.iot_attendance': 'IoT Attendance',
    'nav.comm_center': 'Comm Center',
    'nav.api_lms_sync': 'API & LMS Sync',
    'nav.accreditation_form': 'Borang Akreditasi',
    'nav.helpdesk_tickets': 'Helpdesk Tickets',
    'nav.audit_security': 'Audit & Security',
    'nav.database_backup': 'Backup Database',
    'nav.activity_log': 'Log Aktivitas',
    'nav.role_management': 'Manajemen Role',

    // Kaprodi / Dekan Nav Items & Groups
    'sidebar.group.class_policy': 'Kebijakan Kelas',
    'sidebar.group.faculty_policy': 'Kebijakan Fakultas',
    'nav.dashboard_kaprodi': 'Dashboard Kaprodi',
    'nav.innovation_ews': 'Inovasi & EWS',
    'nav.class_approval': 'Persetujuan Kelas',
    'nav.teaching_load': 'Beban Mengajar',
    'nav.monitor_lecturer': 'Monitoring Dosen',
    'nav.monitor_grades': 'Monitoring Nilai',
    'nav.monitor_attendance': 'Monitoring Presensi',
    'nav.report_program': 'Laporan Prodi',
    'nav.dashboard_dekan': 'Dashboard Dekan',
    'nav.innovation_bi': 'Inovasi & BI Analitik',
    'nav.load_approval': 'Beban Mengajar',
    'nav.curriculum_approval': 'Kurikulum Prodi',
    'nav.monitor_presence': 'Monitoring Kehadiran',
    'nav.finance_faculty': 'Keuangan Fakultas',
    'nav.report_faculty': 'Laporan Fakultas',

    // Role Simulation Name & App Common text
    'role.admin': 'Staf Admin',
    'role.lecturer': 'Dosen Wali',
    'role.kaprodi': 'Kaprodi (KPS)',
    'role.dekan': 'Dekan (Fakultas)',
    'role.student': 'Mahasiswa',

    'app.coming_soon': 'Modul Segera Hadir',
    'app.module_in_dev': 'Modul "{view}" sedang dikembangkan.',
    'app.access_denied': 'Akses Ditolak',
    'app.no_permission': 'Anda tidak memiliki izin untuk mengakses halaman ini.',
    'app.back_to_dashboard': 'Kembali ke Dashboard Saya',
  },
  en: {
    // Login
    'login.welcome': 'Integrated Academic Portal (SIAKAD)',
    'login.subtitle': 'Cloud-Based Academic Information System',
    'login.username': 'Username / Email Address',
    'login.password': 'Password',
    'login.button': 'Login to Portal',
    'login.role_preview': 'Account Role Preview',
    'login.lang_select': 'Select Language',
    'login.credentials_desc': 'Use your registered credentials to access the academic portal.',

    // Sidebar & Navigation
    'nav.dashboard': 'Main Dashboard',
    'nav.krs': 'Online Study Plan (KRS)',
    'nav.khs': 'Study Results (KHS)',
    'nav.jadwal': 'Class Schedule',
    'nav.transkrip': 'Academic Transcript',
    'nav.presensi': 'Attendance & Absence',
    'nav.keuangan': 'Tuition & Finance',
    'nav.profil': 'My Profile',
    'nav.layanan': 'E-Form Services',
    'nav.unduhan': 'File Downloads',
    'nav.inovasi': 'Innovation Hub',
    'nav.edom': 'Lecturer Evaluation (EDOM)',
    'nav.pengumuman': 'Official Announcements',
    'nav.logout': 'Sign Out',

    // Headers & Common Buttons
    'header.simulation_role': 'Simulate Role',
    'header.sim_skeleton': 'Simulate Skeleton',
    'header.profile_settings': 'Profile Settings',
    'header.status_active': 'Active',
    'header.status_inactive': 'Inactive',
    'common.save': 'Save Changes',
    'common.cancel': 'Cancel',
    'common.close': 'Close',
    'common.action': 'Action',
    'common.status': 'Status',
    'common.date': 'Date',
    'common.description': 'Description',
    'common.download': 'Download',
    'common.submit': 'Submit',
    'common.search': 'Search...',

    // SKS Conversion Feature
    'sks.title': 'Automated SKS Credit Conversion (MBKM / Transfer)',
    'sks.subtitle': 'Automated CPL mapping algorithm & official credit transfer system.',
    'sks.lecturer_view': 'Penyetaraan Equivalence Panel (Lecturer)',
    'sks.student_view': 'Your SKS Credit Conversion History (Student)',
    'sks.university_origin': 'Origin University / Activity',
    'sks.course_origin': 'Original Course Name',
    'sks.sks_origin': 'Original Credits',
    'sks.course_target': 'Target SIAKAD Course',
    'sks.match_cpl': 'CPL (Learning Outcome) Matching',
    'sks.calculate_btn': 'Calculate & Match CPL',
    'sks.propose_btn': 'Propose Equivalence',
    'sks.history_title': 'Equivalence & Conversion History',
    'sks.status.proposed': 'Submitted',
    'sks.status.matching': 'Matching CPL',
    'sks.status.approved': 'Approved',
    'sks.status.rejected': 'Rejected',

    // Deadlines & Tasks Feature
    'task.title': 'Task Deadline Timeline & Reminders',
    'task.subtitle': 'Monitor all homework centralized with automated countdown reminder notifications.',
    'task.input_title': 'Input New Task Deadline (Lecturer)',
    'task.task_name': 'Task Title',
    'task.course_select': 'Select Subject',
    'task.due_date': 'Due Date & Time',
    'task.create_btn': 'Publish Assignment',
    'task.timeline': 'Academic Assignment Deadline Timeline',
    'task.remind_1': 'D-1 Reminder Configured',
    'task.remind_3': '3-Hours-Before Reminder Alerts',
    'task.submit_status': 'Submission Status',
    'task.remaining_time': 'Time Remaining',

    // e-Forms Feature
    'form.title': 'Self-Service E-Form & Academic Requests',
    'form.subtitle': 'Submit official letters, academic leave, and class transfers with live status trackers.',
    'form.select_type': 'Request Service Type',
    'form.reason': 'Statement of Purpose / Additional Details',
    'form.upload_doc': 'Upload Supporting Files (PDF/JPG)',
    'form.submit_btn': 'Submit Request',
    'form.active_letter': 'Active Student Letter',
    'form.academic_leave': 'Academic Leave / Gap Request',
    'form.class_transfer': 'Class Transfer Request',
    'form.resignation': 'University Withdrawal Request',
    'form.transcript_req': 'Official Transcript Application',
    'form.track_title': 'Active Request Trackers',
    'form.step.submitted': 'Submitted',
    'form.step.verified': 'Verifying Documents',
    'form.step.approved': 'Approved by Head',
    'form.step.completed': 'Completed / Issued',

    // Sidebar Groups
    'sidebar.group.main': 'Main',
    'sidebar.group.academic': 'Academic',
    'sidebar.group.academic_self': 'Self-Service Academic',
    'sidebar.group.services_files': 'Services & Files',
    'sidebar.group.innovation_adv': 'Advanced Innovation',
    'sidebar.group.info_finance': 'Info & Finance',
    'sidebar.group.grading': 'Grading',
    'sidebar.group.advising': 'Advising',
    'sidebar.group.communication': 'Communication',
    'sidebar.group.reports': 'Reports',
    'sidebar.group.settings': 'Settings',
    'sidebar.group.dashboard': 'Dashboard',
    'sidebar.group.master_data': 'Master Data',
    'sidebar.group.monitoring': 'Monitoring',
    'sidebar.group.announcements': 'Announcements',
    'sidebar.group.enterprise_suite': 'Enterprise Suite',
    
    // Lecturer Nav Items
    'nav.dashboard_lecturer': 'Advisor Dashboard',
    'nav.schedule_teaching': 'Teaching Schedule',
    'nav.class_lectures': 'Lecture Classes',
    'nav.attendance_lectures': 'Lecture Attendance',
    'nav.journal_teaching': 'Teaching Journal',
    'nav.course_materials': 'Course Materials',
    'nav.input_grades': 'Input Grades',
    'nav.recap_grades': 'Grades Recap',
    'nav.krs_students': 'Student Study Plans',
    'nav.advisor_lecturer': 'Advisor Students',
    'nav.thesis': 'Thesis Advisory',
    'nav.class_announcements': 'Class Announcement',
    'nav.messages_chat': 'Chat / Messages',
    'nav.recap_attendance': 'Attendance Recap',
    'nav.bkd_report': 'BKD Performance',
    'nav.teaching_history': 'Teaching History',
    'nav.edom_eval': 'EDOM Performance',
    'nav.profile_lecturer': 'Advisor Profile',
    'nav.change_password': 'Change Password',

    // Admin Nav Items
    'nav.dashboard_admin': 'Admin Dashboard',
    'nav.innovation_hub': 'Modern Innovation Hub',
    'nav.students': 'Student Records',
    'nav.lecturers': 'Lecturers',
    'nav.study_programs': 'Study Programs',
    'nav.courses': 'Course Catalog',
    'nav.rooms': 'Classrooms',
    'nav.users': 'User Accounts',
    'nav.academic_year': 'Academic Year',
    'nav.curriculum': 'Curriculums',
    'nav.lecture_classes': 'Course Classes',
    'nav.lecture_schedules': 'Course Schedules',
    'nav.krs_admin': 'Study Plans (KRS)',
    'nav.khs_admin': 'Study Results (KHS)',
    'nav.attendance_admin': 'Attendance Records',
    'nav.grades_admin': 'Student Grades',
    'nav.user_activity': 'User Activity logs',
    'nav.monitor_edom': 'EDOM Monitoring',
    'nav.reports_admin': 'Export Reports',
    'nav.announcements_admin': 'Broadcast Notice',
    'nav.workflow_engine': 'Workflow Engine',
    'nav.pddikti_feeder': 'PDDIKTI Feeder',
    'nav.obe_assessment': 'OBE Assessment',
    'nav.mbkm_module': 'MBKM Module',
    'nav.thesis_defense': 'Thesis Defense',
    'nav.conflict_engine': 'Conflict Engine',
    'nav.iot_attendance': 'IoT Attendance',
    'nav.comm_center': 'Comm Center',
    'nav.api_lms_sync': 'API & LMS Sync',
    'nav.accreditation_form': 'Accreditation Form',
    'nav.helpdesk_tickets': 'Helpdesk Tickets',
    'nav.audit_security': 'Audit & Security',
    'nav.database_backup': 'Database Backup',
    'nav.activity_log': 'System Logs',
    'nav.role_management': 'Role Settings',

    // Kaprodi / Dekan Nav Items & Groups
    'sidebar.group.class_policy': 'Class Policy',
    'sidebar.group.faculty_policy': 'Faculty Policy',
    'nav.dashboard_kaprodi': 'Program Head Dashboard',
    'nav.innovation_ews': 'Innovation & EWS',
    'nav.class_approval': 'Class Approval',
    'nav.teaching_load': 'Teaching Workload',
    'nav.monitor_lecturer': 'Monitor Advisors',
    'nav.monitor_grades': 'Monitor Grades',
    'nav.monitor_attendance': 'Monitor Attendance',
    'nav.report_program': 'Program Reports',
    'nav.dashboard_dekan': 'Dean Dashboard',
    'nav.innovation_bi': 'Innovation & BI Analytics',
    'nav.load_approval': 'Workload Approval',
    'nav.curriculum_approval': 'Curriculum Approval',
    'nav.monitor_presence': 'Monitor Presence',
    'nav.finance_faculty': 'Faculty Finance',
    'nav.report_faculty': 'Faculty Reports',

    // Role Simulation Name & App Common text
    'role.admin': 'Admin Staff',
    'role.lecturer': 'Academic Advisor',
    'role.kaprodi': 'Head of Program',
    'role.dekan': 'Dean (Faculty)',
    'role.student': 'Student',

    'app.coming_soon': 'Module Coming Soon',
    'app.module_in_dev': 'Module "{view}" is under development.',
    'app.access_denied': 'Access Denied',
    'app.no_permission': 'You do not have permission to access this page.',
    'app.back_to_dashboard': 'Back to My Dashboard',
  },
};

// Global translation custom hook
export function useLanguage() {
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('siakad_lang');
      if (saved && (saved === 'id' || saved === 'en')) {
        return saved as Language;
      }
    }
    return 'id';
  });

  const changeLanguage = (lang: Language) => {
    setCurrentLang(lang);
    localStorage.setItem('siakad_lang', lang);
  };

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'siakad_lang' && e.newValue) {
        if (e.newValue === 'id' || e.newValue === 'en') {
          setCurrentLang(e.newValue as Language);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Update text HTML layout directions dynamically if language is RTL (Arabic)
  useEffect(() => {
    const activeLanguage = languages.find((l) => l.code === currentLang);
    if (activeLanguage) {
      document.documentElement.dir = activeLanguage.dir;
      document.documentElement.lang = currentLang;
    }
  }, [currentLang]);

  const t = (key: string): string => {
    return translations[currentLang]?.[key] || translations['id']?.[key] || key;
  };

  return {
    lang: currentLang,
    changeLanguage,
    t,
    dir: languages.find((l) => l.code === currentLang)?.dir || 'ltr',
    languages,
  };
}
