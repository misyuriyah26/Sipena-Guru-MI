import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize Google GenAI client
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiConfigured: hasGeminiKey,
    environment: process.env.NODE_ENV || 'development',
  });
});

// Generic Document Generator Endpoint
app.post('/api/gemini/generate', async (req, res) => {
  try {
    const ai = getAiClient();
    if (!ai) {
      return res.status(503).json({
        success: false,
        error: 'GEMINI_API_KEY_MISSING',
        message: 'Kunci Gemini API belum dikonfigurasi pada server. Silakan atur di Secrets Panel AI Studio.',
      });
    }

    const {
      prompt,
      docType,
      mapel,
      kelas,
      fase,
      kurikulum,
      tahunPelajaran,
      semester,
      alokasiWaktu,
      materi,
      capaianPembelajaran,
      tujuanPembelajaran,
      identitasMadrasah,
      identitasGuru,
      curriculumReferences,
    } = req.body;

    const referenceContext = Array.isArray(curriculumReferences) && curriculumReferences.length > 0
      ? `\nREFERENSI KURIKULUM & SUMBER RESMI DARI PENGGUNA:\n${curriculumReferences
          .map((r: any, i: number) => `[Ref ${i + 1}] ${r.title} (${r.category}): ${r.contentText?.slice(0, 1000) || 'Terlampir'}`)
          .join('\n')}\n(PENTING: Gunakan referensi di atas sebagai landasan utama. Jangan mengarang CP/regulasi yang tidak ada dalam referensi. Beri catatan jika ada materi yang perlu verifikasi guru).`
      : '\nCATATAN: Belum ada referensi kurikulum yang diunggah pengguna. Sertakan tanda bahwa dokumen perlu diverifikasi oleh guru sesuai pedoman resmi madrasah.';

    const systemInstruction = `
Anda adalah pakar kurikulum Madrasah Ibtidaiyah (MI) profesional Kementerian Agama Republik Indonesia (Kemenag RI).
Tugas Anda adalah menyusun dokumen perangkat ajar Kurikulum Merdeka (KMA Nomor 450 Tahun 2024 / regulasi madrasah terkini) dalam Bahasa Indonesia baku yang formal, runtut, edukatif, dan islami.

Identitas Lembaga: ${identitasMadrasah?.namaMadrasah || 'Madrasah Ibtidaiyah'}
Identitas Guru: ${identitasGuru?.namaLengkap || 'Guru MI'}
Jenjang: Madrasah Ibtidaiyah (MI)
Kelas: ${kelas || 4} (Fase ${fase || 'B'})
Mata Pelajaran: ${mapel || 'Akidah Akhlak'}
Kurikulum: ${kurikulum || 'Kurikulum Merdeka (KMA 450/2024)'}
Tahun Pelajaran: ${tahunPelajaran || '2024/2025'} | Semester: ${semester || 'Ganjil'}
Alokasi Waktu: ${alokasiWaktu || '4 JP'}
Materi / Bab: ${materi || 'Materi Pokok'}
Capaian Pembelajaran (CP): ${capaianPembelajaran || 'Sesuai Fase dan Elemen'}
Tujuan Pembelajaran (TP): ${tujuanPembelajaran || 'Sesuai KKO Taksonomi Bloom'}
${referenceContext}

Aturan Penulisan:
1. Integrasikan nilai Profil Pelajar Pancasila dan Profil Pelajar Rahmatan Lil Alamin (PPRA): Berkeadaban (Ta'addub), Keteladanan (Qudwah), Kewarganegaraan & Kebangsaan (Muwatanah), Mengambil Jalan Tengah (Tawassut), Berimbang (Tawazun), Lurus & Tegas (I'tidal), Kesetaraan (Musawah), Musyawarah (Syura), Toleransi (Tasamuh), Dinamis & Inovatif (Tatawwur wa Ibtikar).
2. Format output harus terstruktur rapi ke dalam beberapa bagian utama yang mudah dibaca.
3. Seluruh teks dalam Bahasa Indonesia formal yang santun dan profesional.
`.trim();

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
      },
    });

    const generatedText = response.text || '';

    res.json({
      success: true,
      content: generatedText,
      modelUsed: 'gemini-3.8-flash',
    });
  } catch (error: any) {
    console.error('Gemini Generate Error:', error);
    res.status(500).json({
      success: false,
      error: 'GEMINI_ERROR',
      message: error?.message || 'Terjadi kesalahan saat memproses permintaan AI.',
    });
  }
});

// Specialized AI Actions Endpoint (Perbaiki, Kembangkan, Ringkas, Buat Soal, Buat Rubrik, Buat LKPD, Buat Modul)
app.post('/api/gemini/action', async (req, res) => {
  try {
    const ai = getAiClient();
    if (!ai) {
      return res.status(503).json({
        success: false,
        error: 'GEMINI_API_KEY_MISSING',
        message: 'Kunci Gemini API belum dikonfigurasi.',
      });
    }

    const { actionType, inputContent, metadata } = req.body;

    let systemPrompt = 'Anda adalah asisten AI kurikulum Madrasah Ibtidaiyah (Kemenag RI).';
    let userPrompt = '';

    switch (actionType) {
      case 'perbaiki_doc':
        systemPrompt = 'Perbaiki tata bahasa, struktur kurikulum, makhraj/istilah Arab/PAI, dan kelengkapan dokumen ajar MI ini agar sesuai regulasi KMA 450 Tahun 2024.';
        userPrompt = `Berikut adalah dokumen yang perlu diperbaiki:\n\n${inputContent}\n\nInstruksi Tambahan: ${metadata?.instruction || 'Lakukan perbaikan redaksi dan sempurnakan alurnya.'}`;
        break;

      case 'kembangkan_materi':
        systemPrompt = 'Kembangkan intisari materi berikut menjadi bahan ajar tatap muka yang kaya, dilengkapi tadabbur hikmah islami, contoh kontekstual kehidupan siswa MI, dan studi kasus ringan.';
        userPrompt = `Materi dasar:\n\n${inputContent}\n\nMata Pelajaran: ${metadata?.mapel || 'PAI'} - Kelas ${metadata?.kelas || 4}`;
        break;

      case 'ringkas_materi':
        systemPrompt = 'Ringkas materi pembelajaran berikut menjadi intisari konsep, poin-poin utama, serta peta konsep yang mudah dipahami dan dihafal peserta didik Madrasah Ibtidaiyah.';
        userPrompt = `Teks Materi:\n\n${inputContent}`;
        break;

      case 'buat_soal':
        systemPrompt = 'Buat paket 5 butir soal evaluasi pembelajaran Madrasah Ibtidaiyah berbasis HOTS (Higher Order Thinking Skills). Sertakan: Nomor soal, bentuk soal (Pilihan Ganda & Uraian), teks stimulus, pilihan A-B-C-D, Kunci Jawaban Benar, dan Pembahasan Lengkap.';
        userPrompt = `Materi & Indikator:\n${inputContent}\nMapel: ${metadata?.mapel || 'Akidah Akhlak'} Kelas ${metadata?.kelas || 4}`;
        break;

      case 'buat_rubrik':
        systemPrompt = 'Susun rubrik Kriteria Ketercapaian Tujuan Pembelajaran (KKTP) dalam 4 tingkat interval (0-65% Perlu Bimbingan, 66-75% Cukup, 76-85% Baik, 86-100% Sangat Baik) beserta deskripsi capaian dan rekomendasi tindak lanjut intervensi guru.';
        userPrompt = `Tujuan Pembelajaran yang dinilai:\n${inputContent}`;
        break;

      case 'buat_lkpd':
        systemPrompt = 'Susun Lembar Kerja Peserta Didik (LKPD) yang menarik, eksploratif, dan kolaboratif. Lengkapi dengan: Judul LKPD, Identitas Kelompok, Tujuan Belajar, Alat & Bahan, Langkah Kerja Percobaan/Pengamatan, Tabel Pengisian Hasil, dan Refleksi Karakter Rahmatan Lil Alamin.';
        userPrompt = `Topik LKPD:\n${inputContent}\nKelas: ${metadata?.kelas || 4} - Mapel: ${metadata?.mapel || 'IPAS'}`;
        break;

      case 'buat_modul_ajar':
        systemPrompt = 'Susun Modul Ajar Kurikulum Merdeka lengkap sesuai KMA 450 Tahun 2024. Meliputi: I. Informasi Umum (Identitas, Kompetensi Awal, Profil P5-PPRA, Sarpras, Model Belajar), II. Komponen Inti (Tujuan, Pemahaman Bermakna, Pertanyaan Pemantik, Kegiatan Pendahuluan 10m - Inti 50m - Penutup 10m), III. Asesmen & Lampiran (Format Formatif, Sumatif, Remedial, Pengayaan, Glosarium).';
        userPrompt = `Topik Pembelajaran:\n${inputContent}\nMapel: ${metadata?.mapel} Kelas ${metadata?.kelas}`;
        break;

      case 'buat_program':
        systemPrompt = 'Susun pemetaan alokasi Program Tahunan (PROTA) atau Program Semester (PROMES) untuk madrasah ibtidaiyah dengan distribusi pekan efektif.';
        userPrompt = `Informasi Program:\n${inputContent}`;
        break;

      default:
        userPrompt = inputContent;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    res.json({
      success: true,
      actionType,
      result: response.text || '',
      modelUsed: 'gemini-3.8-flash',
    });
  } catch (error: any) {
    console.error('Gemini Action Error:', error);
    res.status(500).json({
      success: false,
      error: 'GEMINI_ACTION_ERROR',
      message: error?.message || 'Gagal memproses aksi AI.',
    });
  }
});

// Mount Vite or serve static files
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[SIPENA MI Server] Server running on http://localhost:${PORT}`);
  });
}

startServer();
