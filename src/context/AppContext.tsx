import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MadrasahProfile,
  TeacherProfile,
  SchoolYear,
  Semester,
  Curriculum,
  ClassGrade,
  Subject,
  DocumentItem,
  JournalEntry,
  AgendaEntry,
  StudentScore,
  QuestionItem,
  RemedialItem,
  CurriculumReference,
  AIGenerationLog,
  PageId,
} from '../types';
import {
  initialMadrasahProfile,
  initialTeacherProfile,
  initialSchoolYears,
  initialSemesters,
  initialCurriculums,
  initialClasses,
  initialSubjects,
  initialDocuments,
  initialJournalEntries,
  initialAgendaEntries,
  initialStudentScores,
  initialQuestions,
  initialRemedials,
  initialCurriculumReferences,
} from '../data/initialData';
import {
  getSupabaseClient,
  isSupabaseConfigured,
  testSupabaseConnection,
} from '../lib/supabaseClient';

interface ConfirmState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
}

interface NotificationState {
  message: string;
  type: 'success' | 'info' | 'error';
}

interface SupabaseStatusState {
  connected: boolean;
  checking: boolean;
  error?: string;
  url?: string;
}

interface AppContextType {
  // Navigation & Auth
  isLoggedIn: boolean;
  setIsLoggedIn: (status: boolean) => void;
  activePage: PageId;
  setActivePage: (page: PageId) => void;

  // Supabase Auth & State
  supabaseUser: any | null;
  supabaseStatus: SupabaseStatusState;
  checkSupabaseStatus: () => Promise<void>;
  loginWithSupabase: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signupWithSupabase: (email: string, pass: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logoutSupabase: () => Promise<void>;
  syncDataWithSupabase: () => Promise<{ success: boolean; message: string }>;

  // Network & Online state
  isOnline: boolean;

  // Identity Profiles
  madrasahProfile: MadrasahProfile;
  updateMadrasahProfile: (data: Partial<MadrasahProfile>) => void;
  teacherProfile: TeacherProfile;
  updateTeacherProfile: (data: Partial<TeacherProfile>) => void;

  // Academic Settings
  schoolYears: SchoolYear[];
  setSchoolYears: React.Dispatch<React.SetStateAction<SchoolYear[]>>;
  activeSchoolYear: SchoolYear;
  setActiveSchoolYearId: (id: string) => void;

  semesters: Semester[];
  setSemesters: React.Dispatch<React.SetStateAction<Semester[]>>;
  activeSemester: Semester;
  setActiveSemesterId: (id: string) => void;

  curriculums: Curriculum[];
  setCurriculums: React.Dispatch<React.SetStateAction<Curriculum[]>>;
  activeCurriculum: Curriculum;
  setActiveCurriculumId: (id: string) => void;

  // Curriculum References (RAG & Verifikasi Dokumen)
  curriculumReferences: CurriculumReference[];
  addCurriculumReference: (ref: Omit<CurriculumReference, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCurriculumReference: (id: string, data: Partial<CurriculumReference>) => void;
  deleteCurriculumReference: (id: string) => void;

  // Classes & Subjects
  classes: ClassGrade[];
  addClass: (cls: Omit<ClassGrade, 'id'>) => void;
  updateClass: (id: string, cls: Partial<ClassGrade>) => void;
  deleteClass: (id: string) => void;

  subjects: Subject[];
  addSubject: (subj: Omit<Subject, 'id'>) => void;
  updateSubject: (id: string, subj: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;

  // Documents
  documents: DocumentItem[];
  addDocument: (doc: Omit<DocumentItem, 'id' | 'tanggalDibuat' | 'tanggalDiperbarui'>) => DocumentItem;
  updateDocument: (id: string, data: Partial<DocumentItem>) => void;
  deleteDocument: (id: string) => void;
  duplicateDocument: (id: string) => void;

  // Teacher Administration Records
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  deleteJournalEntry: (id: string) => void;

  agendaEntries: AgendaEntry[];
  addAgendaEntry: (entry: Omit<AgendaEntry, 'id'>) => void;
  deleteAgendaEntry: (id: string) => void;

  studentScores: StudentScore[];
  updateStudentScore: (id: string, data: Partial<StudentScore>) => void;

  questions: QuestionItem[];
  addQuestion: (q: Omit<QuestionItem, 'id'>) => void;
  deleteQuestion: (id: string) => void;

  remedials: RemedialItem[];
  addRemedial: (r: Omit<RemedialItem, 'id'>) => void;

  // Gemini AI Operations
  aiLogs: AIGenerationLog[];
  generateDocumentWithAI: (params: {
    prompt: string;
    docType: string;
    mapel: string;
    kelas: number;
    fase: string;
    materi?: string;
  }) => Promise<{ success: boolean; content?: string; error?: string }>;
  performAIAction: (
    actionType: string,
    inputContent: string,
    metadata?: Record<string, any>
  ) => Promise<{ success: boolean; result?: string; error?: string }>;

  // Modals & UI helpers
  isCreateDocOpen: boolean;
  openCreateDoc: () => void;
  closeCreateDoc: () => void;

  isAiDocOpen: boolean;
  openAiDoc: (initialPrompt?: string) => void;
  closeAiDoc: () => void;

  previewDoc: DocumentItem | null;
  openPreviewDoc: (doc: DocumentItem) => void;
  closePreviewDoc: () => void;

  editingDoc: DocumentItem | null;
  openEditDoc: (doc: DocumentItem) => void;
  closeEditDoc: () => void;

  confirmState: ConfirmState;
  requestConfirm: (title: string, message: string, onConfirm: () => void) => void;
  closeConfirm: () => void;

  notification: NotificationState | null;
  showNotification: (message: string, type?: 'success' | 'info' | 'error') => void;

  // System
  resetAllData: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonStr: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'sipena_mi_app_state_v2';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const loadStored = <T,>(key: string, fallback: T): T => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_${key}`);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  };

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [activePage, setActivePage] = useState<PageId>('dashboard');
  const [supabaseUser, setSupabaseUser] = useState<any | null>(null);
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseStatusState>({
    connected: false,
    checking: true,
  });
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  // Online / Offline listener
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showNotification('Koneksi internet tersambung kembali', 'success');
    };
    const handleOffline = () => {
      setIsOnline(false);
      showNotification('Koneksi internet terputus. Mode luring aktif.', 'error');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const [madrasahProfile, setMadrasahProfile] = useState<MadrasahProfile>(() =>
    loadStored('madrasah', initialMadrasahProfile)
  );
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile>(() =>
    loadStored('teacher', initialTeacherProfile)
  );
  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>(() =>
    loadStored('schoolYears', initialSchoolYears)
  );
  const [semesters, setSemesters] = useState<Semester[]>(() =>
    loadStored('semesters', initialSemesters)
  );
  const [curriculums, setCurriculums] = useState<Curriculum[]>(() =>
    loadStored('curriculums', initialCurriculums)
  );
  const [curriculumReferences, setCurriculumReferences] = useState<CurriculumReference[]>(() =>
    loadStored('curriculumReferences', initialCurriculumReferences)
  );
  const [classes, setClasses] = useState<ClassGrade[]>(() =>
    loadStored('classes', initialClasses)
  );
  const [subjects, setSubjects] = useState<Subject[]>(() =>
    loadStored('subjects', initialSubjects)
  );
  const [documents, setDocuments] = useState<DocumentItem[]>(() =>
    loadStored('documents', initialDocuments)
  );
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() =>
    loadStored('journal', initialJournalEntries)
  );
  const [agendaEntries, setAgendaEntries] = useState<AgendaEntry[]>(() =>
    loadStored('agenda', initialAgendaEntries)
  );
  const [studentScores, setStudentScores] = useState<StudentScore[]>(() =>
    loadStored('scores', initialStudentScores)
  );
  const [questions, setQuestions] = useState<QuestionItem[]>(() =>
    loadStored('questions', initialQuestions)
  );
  const [remedials, setRemedials] = useState<RemedialItem[]>(() =>
    loadStored('remedials', initialRemedials)
  );
  const [aiLogs, setAiLogs] = useState<AIGenerationLog[]>(() =>
    loadStored('aiLogs', [])
  );

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_madrasah`, JSON.stringify(madrasahProfile));
      localStorage.setItem(`${STORAGE_KEY}_teacher`, JSON.stringify(teacherProfile));
      localStorage.setItem(`${STORAGE_KEY}_schoolYears`, JSON.stringify(schoolYears));
      localStorage.setItem(`${STORAGE_KEY}_semesters`, JSON.stringify(semesters));
      localStorage.setItem(`${STORAGE_KEY}_curriculums`, JSON.stringify(curriculums));
      localStorage.setItem(`${STORAGE_KEY}_curriculumReferences`, JSON.stringify(curriculumReferences));
      localStorage.setItem(`${STORAGE_KEY}_classes`, JSON.stringify(classes));
      localStorage.setItem(`${STORAGE_KEY}_subjects`, JSON.stringify(subjects));
      localStorage.setItem(`${STORAGE_KEY}_documents`, JSON.stringify(documents));
      localStorage.setItem(`${STORAGE_KEY}_journal`, JSON.stringify(journalEntries));
      localStorage.setItem(`${STORAGE_KEY}_agenda`, JSON.stringify(agendaEntries));
      localStorage.setItem(`${STORAGE_KEY}_scores`, JSON.stringify(studentScores));
      localStorage.setItem(`${STORAGE_KEY}_questions`, JSON.stringify(questions));
      localStorage.setItem(`${STORAGE_KEY}_remedials`, JSON.stringify(remedials));
      localStorage.setItem(`${STORAGE_KEY}_aiLogs`, JSON.stringify(aiLogs));
    } catch {
      // ignore quota error
    }
  }, [
    madrasahProfile,
    teacherProfile,
    schoolYears,
    semesters,
    curriculums,
    curriculumReferences,
    classes,
    subjects,
    documents,
    journalEntries,
    agendaEntries,
    studentScores,
    questions,
    remedials,
    aiLogs,
  ]);

  // Check Supabase status on mount
  const checkSupabaseStatus = async () => {
    setSupabaseStatus((prev) => ({ ...prev, checking: true }));
    if (!isSupabaseConfigured()) {
      setSupabaseStatus({
        connected: false,
        checking: false,
        error: 'Belum terkonfigurasi. Masukkan URL dan Anon Key pada Pengaturan.',
      });
      return;
    }

    const test = await testSupabaseConnection();
    setSupabaseStatus({
      connected: test.success,
      checking: false,
      error: test.success ? undefined : test.message,
    });

    const client = getSupabaseClient();
    if (client) {
      const { data } = await client.auth.getSession();
      if (data?.session?.user) {
        setSupabaseUser(data.session.user);
        setIsLoggedIn(true);
      }
    }
  };

  useEffect(() => {
    checkSupabaseStatus();

    // Listen to Supabase auth state change
    const client = getSupabaseClient();
    if (client) {
      const { data: authListener } = client.auth.onAuthStateChange((_event, session) => {
        setSupabaseUser(session?.user ?? null);
        if (session?.user) {
          setIsLoggedIn(true);
        }
      });
      return () => {
        authListener?.subscription?.unsubscribe();
      };
    }
  }, []);

  // Supabase Auth Methods
  const loginWithSupabase = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const client = getSupabaseClient();
    if (!client) {
      // Local fallback simulator for personal mode
      if (email && pass) {
        setIsLoggedIn(true);
        showNotification('Masuk dalam mode simulasi personal lokal', 'info');
        return { success: true };
      }
      return { success: false, error: 'Supabase belum dikonfigurasi.' };
    }

    try {
      const { data, error } = await client.auth.signInWithPassword({ email, password: pass });
      if (error) {
        showNotification(`Gagal masuk: ${error.message}`, 'error');
        return { success: false, error: error.message };
      }
      setSupabaseUser(data.user);
      setIsLoggedIn(true);
      showNotification('Berhasil masuk melalui Supabase Authentication', 'success');
      return { success: true };
    } catch (err: any) {
      showNotification(err?.message || 'Gagal menghubungi server autentikasi', 'error');
      return { success: false, error: err?.message };
    }
  };

  const signupWithSupabase = async (email: string, pass: string, name: string): Promise<{ success: boolean; error?: string }> => {
    const client = getSupabaseClient();
    if (!client) {
      return { success: false, error: 'Supabase belum dikonfigurasi.' };
    }

    try {
      const { data, error } = await client.auth.signUp({
        email,
        password: pass,
        options: {
          data: { full_name: name },
        },
      });
      if (error) {
        showNotification(`Pendaftaran gagal: ${error.message}`, 'error');
        return { success: false, error: error.message };
      }
      showNotification('Pendaftaran berhasil! Silakan periksa email untuk konfirmasi.', 'success');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message };
    }
  };

  const logoutSupabase = async () => {
    const client = getSupabaseClient();
    if (client) {
      await client.auth.signOut();
    }
    setSupabaseUser(null);
    setIsLoggedIn(false);
    showNotification('Sesi berhasil keluar', 'info');
  };

  const syncDataWithSupabase = async (): Promise<{ success: boolean; message: string }> => {
    const client = getSupabaseClient();
    if (!client || !supabaseUser) {
      return {
        success: false,
        message: 'Koneksi Supabase belum aktif atau pengguna belum login. Menggunakan data tersimpan lokal.',
      };
    }

    try {
      // Sync madrasah profile
      await client.from('madrasah').upsert({
        user_id: supabaseUser.id,
        nama_madrasah: madrasahProfile.namaMadrasah,
        npsn: madrasahProfile.npsn,
        nsm: madrasahProfile.nsm,
        alamat: madrasahProfile.alamat,
        nama_kepala: madrasahProfile.namaKepala,
        nip_kepala: madrasahProfile.nipKepala,
      });

      // Sync documents
      for (const doc of documents) {
        await client.from('generated_documents').upsert({
          id: doc.id.includes('-') && doc.id.length > 20 ? doc.id : undefined,
          user_id: supabaseUser.id,
          judul: doc.judul,
          tipe: doc.tipe,
          tipe_label: doc.tipeLabel,
          kelas: doc.kelas,
          fase: doc.fase,
          mata_pelajaran: doc.mataPelajaran,
          tahun_pelajaran: doc.tahunPelajaran,
          semester: doc.semester,
          kurikulum: doc.kurikulum,
          status: doc.status,
          sections: doc.sections,
          tags: doc.tags,
        });
      }

      showNotification('Sinkronisasi data ke Supabase Cloud berhasil', 'success');
      return { success: true, message: 'Data lokal berhasil tersinkronisasi ke PostgreSQL Supabase.' };
    } catch (err: any) {
      showNotification(`Gagal sinkronisasi: ${err.message}`, 'error');
      return { success: false, message: err.message };
    }
  };

  // Gemini AI Calling Helper
  const generateDocumentWithAI = async (params: {
    prompt: string;
    docType: string;
    mapel: string;
    kelas: number;
    fase: string;
    materi?: string;
  }): Promise<{ success: boolean; content?: string; error?: string }> => {
    try {
      const activeReferences = curriculumReferences.filter((r) =>
        r.subject === params.mapel || r.subject?.includes('Seluruh') || r.fase === params.fase || r.fase === 'Semua'
      );

      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: params.prompt,
          docType: params.docType,
          mapel: params.mapel,
          kelas: params.kelas,
          fase: params.fase,
          kurikulum: activeCurriculum.nama,
          tahunPelajaran: activeSchoolYear.tahun,
          semester: activeSemester.semester,
          materi: params.materi,
          identitasMadrasah: madrasahProfile,
          identitasGuru: teacherProfile,
          curriculumReferences: activeReferences,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const errorMsg = data?.message || 'Gagal menghasilkan dokumen dengan Gemini AI.';
        showNotification(errorMsg, 'error');
        return { success: false, error: errorMsg };
      }

      // Log AI invocation
      const newLog: AIGenerationLog = {
        id: `log-${Date.now()}`,
        feature: `generate_${params.docType.toLowerCase()}`,
        promptInput: params.prompt,
        responseOutput: data.content?.slice(0, 300) || '',
        modelUsed: data.modelUsed || 'gemini-3.8-flash',
        createdAt: new Date().toISOString(),
      };
      setAiLogs((prev) => [newLog, ...prev]);

      return { success: true, content: data.content };
    } catch (err: any) {
      const errMsg = err?.message || 'Tidak dapat terhubung ke endpoint backend AI.';
      showNotification(errMsg, 'error');
      return { success: false, error: errMsg };
    }
  };

  const performAIAction = async (
    actionType: string,
    inputContent: string,
    metadata?: Record<string, any>
  ): Promise<{ success: boolean; result?: string; error?: string }> => {
    try {
      const response = await fetch('/api/gemini/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionType,
          inputContent,
          metadata: {
            ...metadata,
            kurikulum: activeCurriculum.nama,
            tahun: activeSchoolYear.tahun,
            semester: activeSemester.semester,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        const errorMsg = data?.message || 'Gagal memproses aksi AI.';
        showNotification(errorMsg, 'error');
        return { success: false, error: errorMsg };
      }

      const newLog: AIGenerationLog = {
        id: `log-${Date.now()}`,
        feature: actionType,
        promptInput: inputContent.slice(0, 200),
        responseOutput: data.result?.slice(0, 300) || '',
        modelUsed: data.modelUsed || 'gemini-3.8-flash',
        createdAt: new Date().toISOString(),
      };
      setAiLogs((prev) => [newLog, ...prev]);

      return { success: true, result: data.result };
    } catch (err: any) {
      const errMsg = err?.message || 'Gagal terhubung ke endpoint AI.';
      showNotification(errMsg, 'error');
      return { success: false, error: errMsg };
    }
  };

  // Curriculum Reference CRUD
  const addCurriculumReference = (ref: Omit<CurriculumReference, 'id' | 'createdAt' | 'updatedAt'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newRef: CurriculumReference = {
      ...ref,
      id: `ref-${Date.now()}`,
      createdAt: today,
      updatedAt: today,
    };
    setCurriculumReferences((prev) => [newRef, ...prev]);
    showNotification(`Referensi "${newRef.title}" berhasil diunggah dan diverifikasi`);
  };

  const updateCurriculumReference = (id: string, data: Partial<CurriculumReference>) => {
    const today = new Date().toISOString().split('T')[0];
    setCurriculumReferences((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...data, updatedAt: today } : r))
    );
    showNotification('Referensi kurikulum berhasil diperbarui');
  };

  const deleteCurriculumReference = (id: string) => {
    setCurriculumReferences((prev) => prev.filter((r) => r.id !== id));
    showNotification('Referensi berhasil dihapus');
  };

  // Active items
  const activeSchoolYear =
    schoolYears.find((y) => y.statusAktif) || schoolYears[0] || initialSchoolYears[0];
  const activeSemester =
    semesters.find((s) => s.statusAktif) || semesters[0] || initialSemesters[0];
  const activeCurriculum =
    curriculums.find((c) => c.statusAktif) || curriculums[0] || initialCurriculums[0];

  const setActiveSchoolYearId = (id: string) => {
    setSchoolYears((prev) =>
      prev.map((y) => ({
        ...y,
        statusAktif: y.id === id,
      }))
    );
    showNotification('Tahun pelajaran aktif berhasil diperbarui');
  };

  const setActiveSemesterId = (id: string) => {
    setSemesters((prev) =>
      prev.map((s) => ({
        ...s,
        statusAktif: s.id === id,
      }))
    );
    showNotification('Semester aktif berhasil diperbarui');
  };

  const setActiveCurriculumId = (id: string) => {
    setCurriculums((prev) =>
      prev.map((c) => ({
        ...c,
        statusAktif: c.id === id,
      }))
    );
    showNotification('Kurikulum aktif berhasil diperbarui');
  };

  // Modals
  const [isCreateDocOpen, setIsCreateDocOpen] = useState(false);
  const [isAiDocOpen, setIsAiDocOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);
  const [editingDoc, setEditingDoc] = useState<DocumentItem | null>(null);
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const showNotification = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 3500);
  };

  const requestConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirmState({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const closeConfirm = () => {
    setConfirmState((prev) => ({ ...prev, isOpen: false }));
  };

  const updateMadrasahProfile = (data: Partial<MadrasahProfile>) => {
    setMadrasahProfile((prev) => ({ ...prev, ...data }));
    showNotification('Profil madrasah berhasil disimpan');
  };

  const updateTeacherProfile = (data: Partial<TeacherProfile>) => {
    setTeacherProfile((prev) => ({ ...prev, ...data }));
    showNotification('Profil guru berhasil disimpan');
  };

  // Class CRUD
  const addClass = (cls: Omit<ClassGrade, 'id'>) => {
    const newClass: ClassGrade = {
      ...cls,
      id: `cls-${Date.now()}`,
    };
    setClasses((prev) => [...prev, newClass]);
    showNotification(`Data ${cls.namaKelas} berhasil ditambahkan`);
  };

  const updateClass = (id: string, cls: Partial<ClassGrade>) => {
    setClasses((prev) => prev.map((c) => (c.id === id ? { ...c, ...cls } : c)));
    showNotification('Data kelas berhasil diperbarui');
  };

  const deleteClass = (id: string) => {
    setClasses((prev) => prev.filter((c) => c.id !== id));
    showNotification('Kelas berhasil dihapus');
  };

  // Subject CRUD
  const addSubject = (subj: Omit<Subject, 'id'>) => {
    const newSubj: Subject = {
      ...subj,
      id: `sub-${Date.now()}`,
    };
    setSubjects((prev) => [...prev, newSubj]);
    showNotification(`Mata pelajaran ${subj.nama} berhasil ditambahkan`);
  };

  const updateSubject = (id: string, subj: Partial<Subject>) => {
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, ...subj } : s)));
    showNotification('Mata pelajaran berhasil diperbarui');
  };

  const deleteSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    showNotification('Mata pelajaran berhasil dihapus');
  };

  // Document Management
  const addDocument = (
    docData: Omit<DocumentItem, 'id' | 'tanggalDibuat' | 'tanggalDiperbarui'>
  ): DocumentItem => {
    const today = new Date().toISOString().split('T')[0];
    const newDoc: DocumentItem = {
      ...docData,
      id: `doc-${Date.now()}`,
      tanggalDibuat: today,
      tanggalDiperbarui: today,
    };
    setDocuments((prev) => [newDoc, ...prev]);
    showNotification(`Dokumen "${newDoc.judul}" berhasil disimpan`);
    return newDoc;
  };

  const updateDocument = (id: string, data: Partial<DocumentItem>) => {
    const today = new Date().toISOString().split('T')[0];
    let hasDerived = false;

    setDocuments((prev) => {
      // Check if any derived documents exist
      const updatedList = prev.map((doc) => {
        if (doc.id === id) {
          return { ...doc, ...data, tanggalDiperbarui: today };
        }
        if (doc.sourceDocId === id) {
          hasDerived = true;
          return {
            ...doc,
            needsSyncWithSource: true,
            sourceModifiedAt: today,
          };
        }
        return doc;
      });
      return updatedList;
    });

    if (editingDoc && editingDoc.id === id) {
      setEditingDoc((prev) => (prev ? { ...prev, ...data, tanggalDiperbarui: today } : null));
    }
    if (previewDoc && previewDoc.id === id) {
      setPreviewDoc((prev) => (prev ? { ...prev, ...data, tanggalDiperbarui: today } : null));
    }

    if (hasDerived) {
      showNotification('Perubahan disimpan. Dokumen turunan ditandai untuk diselaraskan.', 'info');
    } else {
      showNotification('Perubahan dokumen berhasil disimpan');
    }
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    showNotification('Dokumen berhasil dihapus');
  };

  const duplicateDocument = (id: string) => {
    const original = documents.find((d) => d.id === id);
    if (!original) return;
    const today = new Date().toISOString().split('T')[0];
    const copy: DocumentItem = {
      ...original,
      id: `doc-${Date.now()}`,
      judul: `${original.judul} (Salinan)`,
      tanggalDibuat: today,
      tanggalDiperbarui: today,
      status: 'Draft',
    };
    setDocuments((prev) => [copy, ...prev]);
    showNotification(`Salinan "${copy.judul}" berhasil dibuat`);
  };

  // Journal
  const addJournalEntry = (entry: Omit<JournalEntry, 'id'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: `jrn-${Date.now()}`,
    };
    setJournalEntries((prev) => [newEntry, ...prev]);
    showNotification('Catatan jurnal mengajar berhasil ditambahkan');
  };

  const deleteJournalEntry = (id: string) => {
    setJournalEntries((prev) => prev.filter((j) => j.id !== id));
    showNotification('Catatan jurnal berhasil dihapus');
  };

  // Agenda
  const addAgendaEntry = (entry: Omit<AgendaEntry, 'id'>) => {
    const newEntry: AgendaEntry = {
      ...entry,
      id: `agd-${Date.now()}`,
    };
    setAgendaEntries((prev) => [...prev, newEntry]);
    showNotification('Agenda mengajar berhasil ditambahkan');
  };

  const deleteAgendaEntry = (id: string) => {
    setAgendaEntries((prev) => prev.filter((a) => a.id !== id));
    showNotification('Agenda berhasil dihapus');
  };

  // Scores
  const updateStudentScore = (id: string, data: Partial<StudentScore>) => {
    setStudentScores((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...data } : s))
    );
    showNotification('Nilai siswa berhasil diperbarui');
  };

  // Question Bank
  const addQuestion = (q: Omit<QuestionItem, 'id'>) => {
    const newQ: QuestionItem = {
      ...q,
      id: `qst-${Date.now()}`,
    };
    setQuestions((prev) => [newQ, ...prev]);
    showNotification('Soal berhasil ditambahkan ke Bank Soal');
  };

  const deleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    showNotification('Butir soal berhasil dihapus');
  };

  // Remedial
  const addRemedial = (r: Omit<RemedialItem, 'id'>) => {
    const newR: RemedialItem = {
      ...r,
      id: `rem-${Date.now()}`,
    };
    setRemedials((prev) => [newR, ...prev]);
    showNotification('Data tindak lanjut remedial ditambahkan');
  };

  // Reset and Backup
  const resetAllData = () => {
    setMadrasahProfile(initialMadrasahProfile);
    setTeacherProfile(initialTeacherProfile);
    setSchoolYears(initialSchoolYears);
    setSemesters(initialSemesters);
    setCurriculums(initialCurriculums);
    setCurriculumReferences(initialCurriculumReferences);
    setClasses(initialClasses);
    setSubjects(initialSubjects);
    setDocuments(initialDocuments);
    setJournalEntries(initialJournalEntries);
    setAgendaEntries(initialAgendaEntries);
    setStudentScores(initialStudentScores);
    setQuestions(initialQuestions);
    setRemedials(initialRemedials);
    setAiLogs([]);
    localStorage.clear();
    showNotification('Semua data berhasil direset ke standar awal', 'info');
  };

  const exportDataJSON = () => {
    const fullState = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      madrasahProfile,
      teacherProfile,
      schoolYears,
      semesters,
      curriculums,
      curriculumReferences,
      classes,
      subjects,
      documents,
      journalEntries,
      agendaEntries,
      studentScores,
      questions,
      remedials,
      aiLogs,
    };
    return JSON.stringify(fullState, null, 2);
  };

  const importDataJSON = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.madrasahProfile) setMadrasahProfile(parsed.madrasahProfile);
      if (parsed.teacherProfile) setTeacherProfile(parsed.teacherProfile);
      if (parsed.schoolYears) setSchoolYears(parsed.schoolYears);
      if (parsed.semesters) setSemesters(parsed.semesters);
      if (parsed.curriculums) setCurriculums(parsed.curriculums);
      if (parsed.curriculumReferences) setCurriculumReferences(parsed.curriculumReferences);
      if (parsed.classes) setClasses(parsed.classes);
      if (parsed.subjects) setSubjects(parsed.subjects);
      if (parsed.documents) setDocuments(parsed.documents);
      if (parsed.journalEntries) setJournalEntries(parsed.journalEntries);
      if (parsed.agendaEntries) setAgendaEntries(parsed.agendaEntries);
      if (parsed.studentScores) setStudentScores(parsed.studentScores);
      if (parsed.questions) setQuestions(parsed.questions);
      if (parsed.remedials) setRemedials(parsed.remedials);
      if (parsed.aiLogs) setAiLogs(parsed.aiLogs);
      showNotification('Data berhasil dipulihkan dari cadangan JSON', 'success');
      return true;
    } catch {
      showNotification('Gagal memproses file cadangan. Format tidak valid.', 'error');
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        activePage,
        setActivePage,
        supabaseUser,
        supabaseStatus,
        checkSupabaseStatus,
        loginWithSupabase,
        signupWithSupabase,
        logoutSupabase,
        syncDataWithSupabase,
        isOnline,
        madrasahProfile,
        updateMadrasahProfile,
        teacherProfile,
        updateTeacherProfile,
        schoolYears,
        setSchoolYears,
        activeSchoolYear,
        setActiveSchoolYearId,
        semesters,
        setSemesters,
        activeSemester,
        setActiveSemesterId,
        curriculums,
        setCurriculums,
        activeCurriculum,
        setActiveCurriculumId,
        curriculumReferences,
        addCurriculumReference,
        updateCurriculumReference,
        deleteCurriculumReference,
        classes,
        addClass,
        updateClass,
        deleteClass,
        subjects,
        addSubject,
        updateSubject,
        deleteSubject,
        documents,
        addDocument,
        updateDocument,
        deleteDocument,
        duplicateDocument,
        journalEntries,
        addJournalEntry,
        deleteJournalEntry,
        agendaEntries,
        addAgendaEntry,
        deleteAgendaEntry,
        studentScores,
        updateStudentScore,
        questions,
        addQuestion,
        deleteQuestion,
        remedials,
        addRemedial,
        aiLogs,
        generateDocumentWithAI,
        performAIAction,
        isCreateDocOpen,
        openCreateDoc: () => setIsCreateDocOpen(true),
        closeCreateDoc: () => setIsCreateDocOpen(false),
        isAiDocOpen,
        openAiDoc: () => setIsAiDocOpen(true),
        closeAiDoc: () => setIsAiDocOpen(false),
        previewDoc,
        openPreviewDoc: (doc) => setPreviewDoc(doc),
        closePreviewDoc: () => setPreviewDoc(null),
        editingDoc,
        openEditDoc: (doc) => setEditingDoc(doc),
        closeEditDoc: () => setEditingDoc(null),
        confirmState,
        requestConfirm,
        closeConfirm,
        notification,
        showNotification,
        resetAllData,
        exportDataJSON,
        importDataJSON,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
