import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../utils/i18n';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Bell, 
  BookOpen, 
  CheckCircle, 
  AlertTriangle, 
  ChevronRight,
  Sparkles,
  Volume2,
  ListTodo,
  Info,
  CornerDownRight,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { getAcademicAssignments, createAcademicAssignment, deleteAcademicAssignment } from '../../api/academic.api';

interface Task {
  id: string;
  courseCode: string;
  courseName: string;
  title: string;
  description: string;
  deadline: string; // ISO String or custom formatted date
  status: 'Belum Selesai' | 'Selesai' | 'Terlambat';
  submittedAt?: string;
  h1ReminderSent: boolean;
  h3ReminderSent: boolean;
}

export function CentralizedTasksModule({ role }: { role: string }) {
  const { t, lang } = useLanguage();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Lecturer form states
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskCourse, setTaskCourse] = useState('IF3110');
  const [taskDate, setTaskDate] = useState('2026-06-29');
  const [taskTime, setTaskTime] = useState('23:59');

  // Interactive local states
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Muat daftar tugas riil dari backend (Assignment)
  const loadTasks = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const assignments = await getAcademicAssignments();
      const mapped: Task[] = assignments.map((a) => ({
        id: a.id,
        courseCode: a.courseCode,
        courseName: a.classLabel || a.courseCode,
        title: a.title,
        description: a.description || '',
        deadline: a.deadline,
        status: 'Belum Selesai',
        h1ReminderSent: false,
        h3ReminderSent: false,
      }));
      setTasks(mapped);
    } catch (err) {
      setLoadError('Gagal memuat data tugas. Periksa koneksi ke server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Calculate remaining times dynamically
  const getRemainingTimeText = (deadlineStr: string) => {
    const deadlineDate = new Date(deadlineStr);
    const now = new Date();
    const diffMs = deadlineDate.getTime() - now.getTime();

    if (diffMs < 0) {
      return { text: 'Sudah Melewati Batas', isExpired: true, urgency: 'expired' };
    }

    const diffHrs = diffMs / (1000 * 60 * 60);
    const diffDays = Math.floor(diffHrs / 24);
    const remainingHrs = Math.floor(diffHrs % 24);
    const remainingMins = Math.floor((diffMs / (1000 * 60)) % 60);

    if (diffDays > 0) {
      return { 
        text: `${diffDays} hari ${remainingHrs} jam lagi`, 
        isExpired: false, 
        urgency: diffDays <= 1 ? 'urgent' : 'safe' 
      };
    } else {
      return { 
        text: `${remainingHrs} jam ${remainingMins} menit lagi`, 
        isExpired: false, 
        urgency: 'critical' 
      };
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle || !taskDesc) {
      triggerToast('Judul tugas dan deskripsi wajib diisi!');
      return;
    }

    const targetIsoDeadline = `${taskDate}T${taskTime}:00`;

    try {
      await createAcademicAssignment({
        courseCode: taskCourse,
        classLabel: `${taskCourse}-A`,
        title: taskTitle,
        description: taskDesc,
        deadline: targetIsoDeadline,
      });
      setTaskTitle('');
      setTaskDesc('');
      triggerToast(`Tugas "${taskTitle}" resmi dirilis terpusat!`);
      await loadTasks();
    } catch (err) {
      triggerToast('Gagal menyimpan tugas. Coba lagi.');
    }
  };

  const handleToggleStatus = (id: string) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const isCurrentlyCompleted = t.status === 'Selesai';
        return {
          ...t,
          status: isCurrentlyCompleted ? 'Belum Selesai' : 'Selesai',
          submittedAt: isCurrentlyCompleted ? undefined : new Date().toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
        };
      }
      return t;
    }));
    triggerToast('Status pengerjaan tugas diperbarui.');
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteAcademicAssignment(id);
      setTasks(tasks.filter(t => t.id !== id));
      triggerToast('Tugas berhasil dihapus.');
    } catch (err) {
      triggerToast('Gagal menghapus tugas.');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 relative overflow-hidden transition-colors duration-200">
      
      {/* Toast Alert Widget */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-800 dark:border-slate-200 animate-slide-up">
          <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <p className="text-xs font-bold leading-tight">{toastMessage}</p>
        </div>
      )}

      {/* Blue Header Accent */}
      <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500" />

      {/* Header */}
      <div className="space-y-1 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-500/10 rounded-lg border border-blue-500/25">
            <Calendar className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
          </div>
          <h4 className="text-sm font-black text-slate-900 dark:text-white">
            {t('task.title')}
          </h4>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
          {t('task.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LECTURER: ASSIGNMENT CREATION */}
        {role !== 'student' && (
          <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-950/40 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 space-y-4">
            <h5 className="text-xs font-bold text-slate-800 dark:text-whiter flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-blue-500" />
              {t('task.input_title')}
            </h5>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs font-semibold">
              <div className="space-y-1.5">
                <label className="text-[9px] text-slate-400 uppercase font-black">{t('task.course_select')}</label>
                <select
                  value={taskCourse}
                  onChange={(e) => setTaskCourse(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 font-bold outline-none"
                >
                  <option value="IF3110">IF3110 - Pengembangan Web & Cloud</option>
                  <option value="IF3240">IF3240 - Pengantar Inteligensi Buatan</option>
                  <option value="IF2230">IF2230 - Pemrograman Berorientasi Objek</option>
                  <option value="IF2211">IF2211 - Matematika Diskrit</option>
                  <option value="IF4120">IF4120 - Kriptografi & Keamanan Jaringan</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] text-slate-400 uppercase font-black">{t('task.task_name')}</label>
                <input 
                  type="text"
                  required
                  placeholder="Contoh: Tugas 4: Rancang Skema Basis Data"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 outline-none text-slate-800 dark:text-slate-200 font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] text-slate-400 uppercase font-black">Spesifikasi Detail Tugas</label>
                <textarea 
                  rows={2}
                  placeholder="Instruksi pengerjaan..."
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 outline-none text-slate-800 dark:text-slate-200 focus:border-blue-500 font-semibold resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <label className="text-[9px] text-slate-400 uppercase font-black">Batas Tanggal</label>
                  <input 
                    type="date"
                    value={taskDate}
                    onChange={(e) => setTaskDate(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 font-bold text-slate-700 dark:text-slate-300 outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] text-slate-400 uppercase font-black">Batas Jam</label>
                  <input 
                    type="time"
                    value={taskTime}
                    onChange={(e) => setTaskTime(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 font-bold text-slate-700 dark:text-slate-300 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> {t('task.create_btn')}
              </button>
            </form>
          </div>
        )}

        {/* STUDENT / UNIFIED: TASK LIST TIMELINE */}
        <div className={`${role === 'student' ? 'lg:col-span-12' : 'lg:col-span-8'} space-y-4`}>
          <div className="flex justify-between items-center">
            <h5 className="text-xs font-extrabold text-slate-800 dark:text-whiter flex items-center gap-1.5">
              <ListTodo className="w-4.5 h-4.5 text-blue-500" />
              {t('task.timeline')}
            </h5>
            <div className="flex items-center gap-1.5 text-[9.5px] text-slate-400 font-bold">
              <span>Urut Berdasarkan Terdekat</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="relative border-l border-slate-200 dark:border-slate-800 pl-4 sm:pl-6 ml-3 space-y-5">
            {loading && (
              <div className="text-center py-10 bg-slate-50/50 dark:bg-slate-900/10 rounded-2xl border border-dashed border-slate-250 dark:border-slate-800">
                <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2 animate-spin" />
                <p className="text-xs text-slate-500">Memuat data tugas...</p>
              </div>
            )}

            {!loading && loadError && (
              <div className="text-center py-10 bg-slate-50/50 dark:bg-slate-900/10 rounded-2xl border border-dashed border-slate-250 dark:border-slate-800">
                <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <p className="text-xs text-slate-500">{loadError}</p>
              </div>
            )}

            {!loading && !loadError && tasks.map((task, idx) => {
              const rem = getRemainingTimeText(task.deadline);
              const isTaskDone = task.status === 'Selesai';
              
              let urgencyBg = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200';
              if (rem.urgency === 'urgent') urgencyBg = 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-200/50';
              if (rem.urgency === 'critical') urgencyBg = 'bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border-rose-200/50';
              if (rem.urgency === 'expired') urgencyBg = 'bg-slate-100 dark:bg-slate-900/40 text-slate-400 dark:text-slate-500 border-slate-200';

              return (
                <div key={task.id} className="relative group">
                  {/* Visual timeline bullet dots */}
                  <div className={`absolute -left-[22px] sm:-left-[30px] top-1.5 w-4 h-4 rounded-full border-2 bg-white dark:bg-slate-900 transition-colors ${
                    isTaskDone 
                      ? 'border-emerald-500 bg-emerald-500 dark:bg-emerald-500' 
                      : rem.urgency === 'critical'
                      ? 'border-rose-500 animate-ping'
                      : 'border-blue-500'
                  }`}>
                    {isTaskDone && <div className="w-1.5 h-1.5 bg-white rounded-full mx-auto mt-[3px]" />}
                  </div>

                  {/* Bullet duplicate to cover ping */}
                  {rem.urgency === 'critical' && !isTaskDone && (
                    <div className="absolute -left-[22px] sm:-left-[30px] top-1.5 w-4 h-4 rounded-full border-2 bg-white dark:bg-slate-900 border-rose-500" />
                  )}

                  {/* Course assignment item box */}
                  <div className={`p-4 rounded-2xl border transition-colors ${
                    isTaskDone 
                      ? 'bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40' 
                      : rem.urgency === 'critical'
                      ? 'bg-rose-500/5 border-rose-500/20 hover:border-rose-500/40'
                      : 'bg-slate-50/50 dark:bg-slate-900/25 border-slate-150 dark:border-slate-800/80 hover:border-slate-200 dark:hover:border-slate-700'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-mono font-bold text-slate-400">
                            {task.courseCode} &bull; {task.courseName}
                          </span>
                          <span className="text-slate-300 dark:text-slate-750">&bull;</span>
                          <span className="text-[9.5px] font-bold text-slate-450 uppercase">{task.id.slice(0, 8)}</span>
                        </div>
                        <h6 className={`font-extrabold text-xs ${isTaskDone ? 'line-through text-slate-500' : 'text-slate-800 dark:text-white'}`}>
                          {task.title}
                        </h6>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                          {task.description}
                        </p>
                      </div>

                      <div className="sm:text-right shrink-0 flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:gap-1.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold border font-mono ${urgencyBg}`}>
                          <Clock className="w-3.5 h-3.5" />
                          <span>{isTaskDone ? t('sks.status.approved') : rem.text}</span>
                        </span>
                        
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          DL: {new Date(task.deadline).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>

                    {/* Action bar */}
                    <div className="mt-3.5 pt-3 border-t border-dashed border-slate-250 dark:border-slate-850/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{task.courseCode}</span>
                      </div>

                      <div className="flex gap-2">
                        {role === 'student' && (
                          <button
                            onClick={() => handleToggleStatus(task.id)}
                            className={`px-3 py-1 rounded-xl text-[10px] font-black cursor-pointer transition-colors flex items-center gap-1 ${
                              isTaskDone
                                ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
                                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/10'
                            }`}
                          >
                            {isTaskDone ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                <span>{t('sks.status.approved')} ({task.submittedAt})</span>
                              </>
                            ) : (
                              <span>Tandai Selesai &amp; Kumpulkan</span>
                            )}
                          </button>
                        )}

                        {/* Dosen & admin dapat menghapus tugas */}
                        {role !== 'student' && (
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-1 text-slate-300 hover:text-rose-600 transition-colors"
                            title="Hapus tugas"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}

            {!loading && !loadError && tasks.length === 0 && (
              <div className="text-center py-10 bg-slate-50/50 dark:bg-slate-900/10 rounded-2xl border border-dashed border-slate-250 dark:border-slate-800">
                <ListTodo className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">Belum ada data tugas pada garis waktu.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
