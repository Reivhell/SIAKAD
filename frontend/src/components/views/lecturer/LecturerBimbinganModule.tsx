import React, { useState } from 'react';
import { StudentAcademic, SkripsiItem } from '../../../api/academic.api';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  ClipboardList, 
  Users, 
  GraduationCap, 
  Check, 
  X, 
  MessageSquare, 
  Calendar, 
  Plus, 
  BookOpen, 
  TrendingUp,
  FileText
} from 'lucide-react';

interface LecturerBimbinganModuleProps {
  students: StudentAcademic[];
  setStudents: React.Dispatch<React.SetStateAction<StudentAcademic[]>>;
  skripsi: SkripsiItem[];
  setSkripsi: React.Dispatch<React.SetStateAction<SkripsiItem[]>>;
  onShowToast: (message: string) => void;
  subTab: string;
}

export function LecturerBimbinganModule({
  students,
  setStudents,
  skripsi,
  setSkripsi,
  onShowToast,
  subTab
}: LecturerBimbinganModuleProps) {
  // Selected student for active viewing / notes
  const [activeStudentNim, setActiveStudentNim] = useState<string>(students[0]?.nim || '');
  const [activeThesisId, setActiveThesisId] = useState<string>(skripsi[0]?.id || '');

  // Consultation Note form state
  const [consultationTopic, setConsultationTopic] = useState('');
  const [consultationNotes, setConsultationNotes] = useState('');

  // KRS Revision Note input
  const [revisionNoteInput, setRevisionNoteInput] = useState('');

  // Thesis Log form states
  const [thesisNote, setThesisNote] = useState('');
  const [thesisApproved, setThesisApproved] = useState(true);

  // Get active selected objects
  const activeStudent = students.find(s => s.nim === activeStudentNim) || students[0];
  const activeThesis = skripsi.find(s => s.id === activeThesisId) || skripsi[0];

  // Submit KRS Approval
  const handleKrsStatusChange = (studentNim: string, newStatus: 'Approved' | 'Revised') => {
    setStudents(prev => prev.map(student => {
      if (student.nim === studentNim) {
        onShowToast(`KRS Mahasiswa ${student.name} diset: ${newStatus === 'Approved' ? 'DISETUJUI' : 'PERLU REVISI'}`);
        return {
          ...student,
          krs: {
            ...student.krs,
            status: newStatus,
            revisionNotes: newStatus === 'Revised' ? revisionNoteInput : undefined
          }
        };
      }
      return student;
    }));
    setRevisionNoteInput('');
  };

  // Submit Consultation Note
  const handleAddConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultationTopic || !consultationNotes) {
      onShowToast('Error: Tema bimbingan dan catatan wajib diisi!');
      return;
    }
    setStudents(prev => prev.map(student => {
      if (student.nim === activeStudentNim) {
        const newNote = {
          date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
          topic: consultationTopic,
          notes: consultationNotes
        };
        return {
          ...student,
          consultations: [newNote, ...student.consultations]
        };
      }
      return student;
    }));
    setConsultationTopic('');
    setConsultationNotes('');
    onShowToast(`Sukses menambahkan catatan konsultasi untuk ${activeStudent?.name}`);
  };

  // Submit Thesis Guidance Log
  const handleAddThesisLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!thesisNote) {
      onShowToast('Error: Catatan revisi bimbingan wajib diisi!');
      return;
    }
    setSkripsi(prev => prev.map(item => {
      if (item.id === activeThesisId) {
        const newLog = {
          date: new Date().toISOString().split('T')[0],
          note: thesisNote,
          approval: thesisApproved
        };
        // Recalculate progress slightly
        const currentProgress = item.progressPercentage;
        const nextProgress = thesisApproved ? Math.min(100, currentProgress + 5) : currentProgress;
        const nextStatus = nextProgress >= 100 ? 'Lulus' : nextProgress >= 80 ? 'Siap Kolokium' : item.status;
        
        return {
          ...item,
          progressPercentage: nextProgress,
          status: nextStatus as any,
          logs: [newLog, ...item.logs]
        };
      }
      return item;
    }));
    setThesisNote('');
    onShowToast(`Catatan bimbingan tugas akhir berhasil ditambahkan!`);
  };

  const handleApproveThesisReady = (id: string, stage: 'Siap Kolokium' | 'Siap Sidang') => {
    setSkripsi(prev => prev.map(item => {
      if (item.id === id) {
        onShowToast(`Mahasiswa ${item.name} dinyatakan ${stage}!`);
        return { ...item, status: stage };
      }
      return item;
    }));
  };

  return (
    <div className="space-y-6">
      {/* 1. BIMBINGAN AKADEMIK */}
      {subTab === 'bimbingan-akademik' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Student list + quick stats */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
              <h4 className="text-xs font-bold text-slate-800 dark:text-whiter mb-4 flex items-center gap-2">
                <Users className="w-4.5 h-4.5 text-blue-500" /> Mahasiswa Bimbingan Wali
              </h4>
              <div className="space-y-2.5">
                {students.map((student) => {
                  const isSelected = student.nim === activeStudentNim;
                  return (
                    <button
                      key={student.nim}
                      onClick={() => setActiveStudentNim(student.nim)}
                      className={`w-full p-3.5 border rounded-xl text-left transition-colors cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected 
                          ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/10' 
                          : 'border-slate-100 dark:border-slate-800 hover:border-blue-500/30 text-slate-800 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-950/20'
                      }`}
                    >
                      <div>
                        <h5 className="text-xs font-extrabold">{student.name}</h5>
                        <p className={`text-[10px] mt-0.5 font-mono ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>NIM. {student.nim}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] font-bold ${isSelected ? 'text-white' : 'text-blue-600'}`}>IPK {student.ipkHistory[student.ipkHistory.length - 1]?.ipk}</span>
                        <p className={`text-[9px] mt-0.5 px-1.5 py-0.5 rounded font-bold ${
                          student.krs.status === 'Approved' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' :
                          student.krs.status === 'Revised' ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400' :
                          'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                        }`}>
                          KRS: {student.krs.status}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* GPA progression chart */}
            {activeStudent && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                <h4 className="text-xs font-bold text-slate-800 dark:text-whiter mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" /> Monitoring Tren IPK: {activeStudent.name}
                </h4>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={activeStudent.ipkHistory} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="semester" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                      <YAxis domain={[0, 4.0]} tickCount={5} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12 }} />
                      <Line type="monotone" dataKey="ipk" stroke="#2563eb" strokeWidth={3} activeDot={{ r: 6 }} dot={{ strokeWidth: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {/* Consultation Notes + Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-5">Tambah Catatan Konsultasi ({activeStudent?.name})</h4>
              <form onSubmit={handleAddConsultation} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Topik Konsultasi</label>
                    <input 
                      type="text" 
                      value={consultationTopic}
                      onChange={(e) => setConsultationTopic(e.target.value)}
                      placeholder="Contoh: Rencana Topik Tugas Akhir"
                      className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 font-semibold"
                    />
                  </div>
                  <div className="flex items-end">
                    <button 
                      type="submit" 
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                    >
                      Simpan Catatan
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Isi Bimbingan / Arahan Wali</label>
                  <textarea 
                    rows={2}
                    value={consultationNotes}
                    onChange={(e) => setConsultationNotes(e.target.value)}
                    placeholder="Tulis ringkasan solusi, revisi, atau saran bimbingan..."
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 font-semibold resize-none"
                  />
                </div>
              </form>
            </div>

            {/* History Consultation Log */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-5 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-500" /> Log Histori Konsultasi
              </h4>
              <div className="space-y-4">
                {activeStudent?.consultations.map((c, idx) => (
                  <div key={idx} className="p-4 border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl">
                    <div className="flex justify-between text-[10px] font-bold mb-1.5">
                      <span className="text-blue-600 uppercase">{c.topic}</span>
                      <span className="text-slate-400 font-mono">{c.date}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{c.notes}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. PERSETUJUAN KRS */}
      {subTab === 'persetujuan-krs' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white">Persetujuan KRS (Rencana Studi Mahasiswa)</h4>
            <p className="text-xs text-slate-500">Evaluasi draf perkuliahan mahasiswa bimbingan wali untuk disetujui atau dikembalikan.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* KRS Selector */}
            <div className="lg:col-span-4 space-y-3.5">
              <label className="block text-[11px] font-bold text-slate-500 uppercase">Pilih Mahasiswa</label>
              <div className="space-y-2">
                {students.map((student) => {
                  const isSelected = student.nim === activeStudentNim;
                  return (
                    <button
                      key={student.nim}
                      onClick={() => setActiveStudentNim(student.nim)}
                      className={`w-full p-3.5 border rounded-xl text-left transition-colors cursor-pointer flex justify-between items-center ${
                        isSelected 
                          ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                          : 'border-slate-100 dark:border-slate-800 hover:border-blue-500/30 text-slate-800 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-950/20'
                      }`}
                    >
                      <div>
                        <h5 className="text-xs font-bold">{student.name}</h5>
                        <p className={`text-[10px] font-mono mt-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>{student.nim}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        student.krs.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400' :
                        student.krs.status === 'Revised' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {student.krs.status}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* KRS Details & Review */}
            <div className="lg:col-span-8 p-6 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/20 dark:bg-slate-950/10 space-y-5">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-whiter">Draf Rencana Studi ({activeStudent?.name})</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Semester Ganjil 2026/2027</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleKrsStatusChange(activeStudent.nim, 'Revised')}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 rounded-xl text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <X className="w-3.5 h-3.5" /> Tolak / Revisi
                  </button>
                  <button 
                    onClick={() => handleKrsStatusChange(activeStudent.nim, 'Approved')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" /> Setujui KRS
                  </button>
                </div>
              </div>

              {/* Revision note textbox */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Catatan Revisi (Hanya jika mengajukan penolakan)</label>
                <input 
                  type="text" 
                  value={revisionNoteInput}
                  onChange={(e) => setRevisionNoteInput(e.target.value)}
                  placeholder="Contoh: Tolong kurangi SKS, silakan ambil makul pilihan semester depan."
                  className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Course list */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2.5">
                {activeStudent?.krs.courses.map((c, i) => (
                  <div key={i} className="p-3 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-between text-xs font-semibold">
                    <div>
                      <span className="text-[10px] text-blue-600 font-mono font-bold uppercase">{c.code}</span>
                      <h5 className="text-xs font-bold text-slate-800 dark:text-white mt-0.5">{c.name}</h5>
                    </div>
                    <span className="text-slate-600 dark:text-slate-400 font-bold">{c.sks} SKS</span>
                  </div>
                ))}
                
                <div className="flex justify-between items-center p-3 border-t border-dashed border-slate-200 mt-4 text-xs font-extrabold text-slate-800 dark:text-white">
                  <span>Total Beban Kredit Rencana</span>
                  <span className="text-blue-600 font-mono text-sm">{activeStudent?.krs.courses.reduce((sum, c) => sum + c.sks, 0)} SKS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. SKRIPSI / TUGAS AKHIR */}
      {subTab === 'skripsi' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Thesis guidance list */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
              <h4 className="text-xs font-bold text-slate-800 dark:text-whiter mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-500" /> Bimbingan Tugas Akhir / Skripsi
              </h4>
              <div className="space-y-2.5">
                {skripsi.map((item) => {
                  const isSelected = item.id === activeThesisId;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveThesisId(item.id)}
                      className={`w-full p-3.5 border rounded-xl text-left transition-colors cursor-pointer flex justify-between items-center ${
                        isSelected 
                          ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                          : 'border-slate-100 dark:border-slate-800 hover:border-blue-500/30 text-slate-800 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-950/20'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <h5 className="text-xs font-bold">{item.name}</h5>
                        <p className={`text-[10px] font-mono ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>{item.nim}</p>
                        <p className={`text-[10px] line-clamp-1 italic ${isSelected ? 'text-blue-100/80' : 'text-slate-400'}`}>{item.title}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] font-bold ${isSelected ? 'text-white' : 'text-slate-600'}`}>Progress {item.progressPercentage}%</span>
                        <p className={`text-[9px] font-bold uppercase mt-0.5 px-1.5 py-0.5 rounded ${
                          item.status === 'Lulus' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-orange-500/15 text-orange-400'
                        }`}>{item.status}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Log bimbingan form + history */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Input Kemajuan Bimbingan & Revisi ({activeThesis?.name})</h4>
              <form onSubmit={handleAddThesisLog} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Kelayakan / Persetujuan Bab</label>
                    <select
                      value={thesisApproved ? 'true' : 'false'}
                      onChange={(e) => setThesisApproved(e.target.value === 'true')}
                      className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white focus:outline-none"
                    >
                      <option value="true">Disetujui (Lanjut Bab Berikutnya)</option>
                      <option value="false">Perlu Perbaikan / Revisi</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                    >
                      Simpan Log Bimbingan
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Catatan Bimbingan / Hambatan / Evaluasi</label>
                  <textarea
                    rows={2}
                    value={thesisNote}
                    onChange={(e) => setThesisNote(e.target.value)}
                    placeholder="Contoh: Bab 4 pengujian masih ada bug pada library parsing JWT. Perbaiki kodenya..."
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 font-semibold resize-none"
                  />
                </div>
              </form>

              {activeThesis?.status === 'Siap Kolokium' && (
                <div className="mt-5 p-4 border border-emerald-100 dark:border-emerald-950 rounded-2xl bg-emerald-500/5 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">Siap Maju Kolokium / Seminar</span>
                    <p className="text-[10px] text-slate-500 mt-0.5">Mahasiswa telah menyelesaikan Bab 1-3 dengan sempurna.</p>
                  </div>
                  <button
                    onClick={() => handleApproveThesisReady(activeThesis.id, 'Siap Sidang')}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-bold cursor-pointer transition-colors shadow-sm"
                  >
                    Rilis Izin Seminar
                  </button>
                </div>
              )}
            </div>

            {/* Guidance history timeline */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-5">Histori Log Bimbingan</h4>
              <div className="relative border-l border-slate-200 dark:border-slate-800 ml-3 space-y-6">
                {activeThesis?.logs.map((log, index) => (
                  <div key={index} className="relative pl-6">
                    <div className={`absolute -left-1.5 top-1 w-3 h-3 rounded-full border border-white dark:border-slate-900 ${
                      log.approval ? 'bg-emerald-500' : 'bg-rose-500'
                    }`} />
                    <span className="text-[10px] text-slate-400 font-mono font-bold">{log.date}</span>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-white mt-0.5">{log.note}</h5>
                    <span className={`text-[9px] mt-1 inline-block px-1.5 py-0.5 rounded font-bold ${
                      log.approval ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600' : 'bg-rose-50 dark:bg-rose-950/30 text-rose-600'
                    }`}>
                      {log.approval ? 'Disetujui / OK' : 'Revisi / Perbaikan'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
