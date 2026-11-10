-- =====================================================================
-- SIPENA MI PERSONAL (SISTEM INFORMASI PERANGKAT AJAR MADRASAH IBTIDAIYAH)
-- TAHAP 2 — SUPABASE POSTGRESQL SCHEMA WITH ROW LEVEL SECURITY (RLS)
-- =====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USERS & PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'guru_mi',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to create profile automatically on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Guru MI'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. MADRASAH TABLE
CREATE TABLE IF NOT EXISTS public.madrasah (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  nama_madrasah TEXT NOT NULL,
  npsn TEXT NOT NULL,
  nsm TEXT NOT NULL,
  jenjang TEXT DEFAULT 'MI',
  status TEXT DEFAULT 'Swasta',
  akreditasi TEXT DEFAULT 'A',
  alamat TEXT,
  desa_kelurahan TEXT,
  kecamatan TEXT,
  kabupaten_kota TEXT,
  provinsi TEXT,
  kode_pos TEXT,
  email TEXT,
  telepon TEXT,
  website TEXT,
  nama_kepala TEXT,
  nip_kepala TEXT,
  logo_url TEXT,
  kementerian TEXT DEFAULT 'KEMENTERIAN AGAMA REPUBLIK INDONESIA',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TEACHERS TABLE
CREATE TABLE IF NOT EXISTS public.teachers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  nama_lengkap TEXT NOT NULL,
  gelar_depan TEXT,
  gelar_belakang TEXT,
  nip_niy TEXT,
  nuptk TEXT,
  jabatan TEXT DEFAULT 'Guru Kelas / Guru PAI MI',
  pangkat_golongan TEXT,
  jenis_kelamin TEXT DEFAULT 'L',
  pendidikan_terakhir TEXT,
  jurusan TEXT,
  email TEXT,
  no_hp TEXT,
  alamat TEXT,
  foto_url TEXT,
  mapel_diampu TEXT[] DEFAULT ARRAY[]::TEXT[],
  kelas_diampu INT[] DEFAULT ARRAY[]::INT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ACADEMIC YEARS TABLE
CREATE TABLE IF NOT EXISTS public.academic_years (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tahun TEXT NOT NULL, -- e.g. '2024/2025'
  status_aktif BOOLEAN DEFAULT FALSE,
  tanggal_mulai DATE,
  tanggal_selesai DATE,
  keterangan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SEMESTERS TABLE
CREATE TABLE IF NOT EXISTS public.semesters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  academic_year_id UUID REFERENCES public.academic_years(id) ON DELETE CASCADE,
  semester TEXT NOT NULL, -- 'Ganjil' or 'Genap'
  nomor INT NOT NULL, -- 1 or 2
  status_aktif BOOLEAN DEFAULT FALSE,
  pekan_efektif INT DEFAULT 19,
  pekan_tidak_efektif INT DEFAULT 5,
  total_pekan INT DEFAULT 24,
  tanggal_bagi_rapor DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CLASSES TABLE
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tingkat INT NOT NULL CHECK (tingkat BETWEEN 1 AND 6),
  fase TEXT NOT NULL CHECK (fase IN ('A', 'B', 'C')),
  nama_kelas TEXT NOT NULL,
  rombel TEXT DEFAULT 'A',
  jumlah_siswa_l INT DEFAULT 0,
  jumlah_siswa_p INT DEFAULT 0,
  wali_kelas TEXT,
  ruang TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SUBJECTS TABLE
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  kode TEXT NOT NULL,
  nama TEXT NOT NULL,
  kategori TEXT NOT NULL, -- 'Pendidikan Agama Islam', 'Bahasa Arab', 'Mata Pelajaran Umum', 'Muatan Lokal'
  jp_per_minggu INT DEFAULT 2,
  kelas INT[] DEFAULT ARRAY[1,2,3,4,5,6],
  ringkasan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. CURRICULUM REFERENCES (Untuk RAG dan Dokumen Acuan AI)
CREATE TABLE IF NOT EXISTS public.curriculum_references (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- 'CP', 'Kurikulum', 'Buku Pelajaran', 'Panduan', 'Lainnya'
  subject TEXT,
  fase TEXT,
  class_grade INT,
  file_url TEXT,
  file_name TEXT,
  file_size INT,
  content_text TEXT, -- Text extract for AI grounding & verification
  is_verified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. TEACHING ASSIGNMENTS (Penugasan Guru)
CREATE TABLE IF NOT EXISTS public.teaching_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES public.teachers(id) ON DELETE CASCADE,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  academic_year_id UUID REFERENCES public.academic_years(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. LEARNING PLANS (Rencana Pembelajaran & RPE)
CREATE TABLE IF NOT EXISTS public.learning_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  academic_year_id UUID REFERENCES public.academic_years(id) ON DELETE CASCADE,
  semester_id UUID REFERENCES public.semesters(id) ON DELETE CASCADE,
  class_grade INT NOT NULL,
  fase TEXT NOT NULL,
  total_weeks INT DEFAULT 24,
  effective_weeks INT DEFAULT 19,
  non_effective_weeks INT DEFAULT 5,
  jp_per_week INT DEFAULT 2,
  total_jp INT DEFAULT 38,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. LEARNING OUTCOMES (Capaian Pembelajaran / CP KMA 450)
CREATE TABLE IF NOT EXISTS public.learning_outcomes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  fase TEXT NOT NULL,
  elemen TEXT NOT NULL,
  deskripsi TEXT NOT NULL,
  regulasi TEXT DEFAULT 'KMA Nomor 450 Tahun 2024',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. LEARNING OBJECTIVES (Tujuan Pembelajaran / TP)
CREATE TABLE IF NOT EXISTS public.learning_objectives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  class_grade INT NOT NULL,
  fase TEXT NOT NULL,
  kko TEXT NOT NULL, -- Kata Kerja Operasional
  materi_pokok TEXT NOT NULL,
  konteks_karakter TEXT,
  full_objective TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. ATP DOCUMENTS (Alur Tujuan Pembelajaran)
CREATE TABLE IF NOT EXISTS public.atp_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  class_grade INT NOT NULL,
  fase TEXT NOT NULL,
  total_jp INT,
  sequence_data JSONB NOT NULL DEFAULT '[]'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. ANNUAL PROGRAMS (PROTA)
CREATE TABLE IF NOT EXISTS public.annual_programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  class_grade INT NOT NULL,
  academic_year TEXT NOT NULL,
  sem1_jp INT DEFAULT 36,
  sem2_jp INT DEFAULT 36,
  program_data JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. SEMESTER PROGRAMS (PROMES)
CREATE TABLE IF NOT EXISTS public.semester_programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  class_grade INT NOT NULL,
  semester TEXT NOT NULL,
  distribution_matrix JSONB NOT NULL DEFAULT '[]'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. TEACHING MODULES (Modul Ajar / RPP Kurikulum Merdeka)
CREATE TABLE IF NOT EXISTS public.teaching_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  judul TEXT NOT NULL,
  subject TEXT NOT NULL,
  class_grade INT NOT NULL,
  fase TEXT NOT NULL,
  alokasi_waktu TEXT,
  tujuan_pembelajaran TEXT,
  komponen_inti JSONB NOT NULL DEFAULT '{}'::JSONB,
  profil_ppra TEXT[],
  status TEXT DEFAULT 'Draft',
  is_ai_generated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. ASSESSMENTS
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  class_grade INT NOT NULL,
  assessment_type TEXT NOT NULL, -- 'Awal', 'Formatif', 'Sumatif'
  rubric_data JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. QUESTION BANKS (Bank Soal)
CREATE TABLE IF NOT EXISTS public.question_banks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  class_grade INT NOT NULL,
  bab TEXT,
  indikator TEXT,
  bentuk_soal TEXT NOT NULL, -- 'Pilihan Ganda', 'Isian Singkat', 'Uraian', 'Benar/Salah'
  tingkat_kesulitan TEXT DEFAULT 'Sedang',
  pertanyaan TEXT NOT NULL,
  pilihan TEXT[],
  kunci_jawaban TEXT NOT NULL,
  pembahasan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. WORKSHEETS (LKPD)
CREATE TABLE IF NOT EXISTS public.worksheets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  class_grade INT NOT NULL,
  topic TEXT,
  activity_steps JSONB NOT NULL DEFAULT '[]'::JSONB,
  instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. TEACHING MATERIALS (Bahan & Materi Pembelajaran)
CREATE TABLE IF NOT EXISTS public.teaching_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  class_grade INT NOT NULL,
  chapter TEXT,
  summary_text TEXT NOT NULL,
  keywords TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 22. TEACHING JOURNALS (Jurnal Mengajar Harian)
CREATE TABLE IF NOT EXISTS public.teaching_journals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tanggal DATE NOT NULL,
  class_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  jam_ke TEXT,
  materi_pokok TEXT NOT NULL,
  tujuan_pembelajaran TEXT,
  jumlah_hadir INT DEFAULT 0,
  jumlah_absen INT DEFAULT 0,
  catatan_siswa TEXT,
  kendala_refleksi TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 23. TEACHING AGENDAS (Agenda & Jadwal)
CREATE TABLE IF NOT EXISTS public.teaching_agendas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  hari TEXT NOT NULL,
  jam_mulai TEXT NOT NULL,
  jam_selesai TEXT NOT NULL,
  class_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  ruang TEXT,
  kegiatan_khusus TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 24. STUDENT GRADES (Rekap Nilai Siswa)
CREATE TABLE IF NOT EXISTS public.student_grades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  nisn TEXT NOT NULL,
  nama_siswa TEXT NOT NULL,
  class_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  nilai_formatif INT DEFAULT 0,
  nilai_sumatif_materi INT DEFAULT 0,
  nilai_sts INT DEFAULT 0,
  nilai_sas INT DEFAULT 0,
  nilai_akhir INT DEFAULT 0,
  capaian_tertinggi TEXT,
  capaian_terendah TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 25. REMEDIAL & ENRICHMENT
CREATE TABLE IF NOT EXISTS public.remedial_enrichment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  class_name TEXT NOT NULL,
  tp_materi TEXT NOT NULL,
  nama_siswa TEXT NOT NULL,
  nilai_awal INT NOT NULL,
  nilai_akhir INT NOT NULL,
  bentuk_remedial TEXT NOT NULL,
  keterangan TEXT DEFAULT 'Tuntas',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 26. DOCUMENT TEMPLATES
CREATE TABLE IF NOT EXISTS public.document_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  document_type TEXT NOT NULL,
  content_structure JSONB NOT NULL DEFAULT '[]'::JSONB,
  is_master BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 27. GENERATED DOCUMENTS (Katalog Dokumen Saya)
CREATE TABLE IF NOT EXISTS public.generated_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  judul TEXT NOT NULL,
  tipe TEXT NOT NULL,
  tipe_label TEXT NOT NULL,
  kelas INT NOT NULL,
  fase TEXT NOT NULL,
  mata_pelajaran TEXT NOT NULL,
  tahun_pelajaran TEXT NOT NULL,
  semester TEXT NOT NULL,
  kurikulum TEXT NOT NULL,
  alokasi_waktu TEXT,
  tujuan_ringkas TEXT,
  status TEXT DEFAULT 'Draft',
  sections JSONB NOT NULL DEFAULT '[]'::JSONB,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_ai_generated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 28. AI GENERATION LOGS (Audit Trail Penggunaan AI)
CREATE TABLE IF NOT EXISTS public.ai_generation_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  feature TEXT NOT NULL, -- 'generate_doc', 'perbaiki_doc', 'kembangkan_materi', 'ringkas_materi', 'buat_soal', dll.
  prompt_input TEXT NOT NULL,
  response_output TEXT NOT NULL,
  model_used TEXT DEFAULT 'gemini-3.8-flash',
  tokens_used INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.madrasah ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curriculum_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teaching_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.atp_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.annual_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.semester_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teaching_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worksheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teaching_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teaching_journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teaching_agendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.remedial_enrichment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_generation_logs ENABLE ROW LEVEL SECURITY;

-- Helper to create standard user RLS policies
DO $$
DECLARE
  tbl text;
  tables text[] := ARRAY[
    'madrasah', 'teachers', 'academic_years', 'semesters', 'classes', 'subjects',
    'curriculum_references', 'teaching_assignments', 'learning_plans', 'learning_outcomes',
    'learning_objectives', 'atp_documents', 'annual_programs', 'semester_programs',
    'teaching_modules', 'assessments', 'question_banks', 'worksheets', 'teaching_materials',
    'teaching_journals', 'teaching_agendas', 'student_grades', 'remedial_enrichment',
    'document_templates', 'generated_documents', 'ai_generation_logs'
  ];
BEGIN
  -- Profiles specific policies
  EXECUTE 'CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);';
  EXECUTE 'CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);';

  -- Loop through all domain tables
  FOREACH tbl IN ARRAY tables LOOP
    EXECUTE format('CREATE POLICY "Users can view own %I" ON public.%I FOR SELECT USING (auth.uid() = user_id);', tbl, tbl);
    EXECUTE format('CREATE POLICY "Users can insert own %I" ON public.%I FOR INSERT WITH CHECK (auth.uid() = user_id);', tbl, tbl);
    EXECUTE format('CREATE POLICY "Users can update own %I" ON public.%I FOR UPDATE USING (auth.uid() = user_id);', tbl, tbl);
    EXECUTE format('CREATE POLICY "Users can delete own %I" ON public.%I FOR DELETE USING (auth.uid() = user_id);', tbl, tbl);
  END LOOP;
END $$;
