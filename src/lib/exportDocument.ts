import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  Header,
  Footer,
  PageNumber,
  HeadingLevel,
} from 'docx';
import { DocumentItem, MadrasahProfile, TeacherProfile } from '../types';

/**
 * Clean sanitization for filename
 */
export function generateDocumentFilename(
  doc: DocumentItem,
  extension: 'docx' | 'pdf'
): string {
  const sanitize = (str: string) =>
    str
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');

  const tipe = sanitize(doc.tipeLabel || doc.tipe);
  const mapel = sanitize(doc.mataPelajaran);
  const kelas = `Kelas${doc.kelas}`;
  const tahun = sanitize(doc.tahunPelajaran.replace('/', '-'));

  return `${tipe}_${mapel}_${kelas}_${tahun}.${extension}`;
}

/**
 * Parse markdown table into rows and cells if present
 */
function parseMarkdownTable(text: string): string[][] | null {
  const lines = text.trim().split('\n');
  const tableLines = lines.filter((l) => l.trim().startsWith('|') && l.trim().endsWith('|'));
  if (tableLines.length < 2) return null;

  const rows: string[][] = [];
  for (const line of tableLines) {
    if (line.includes('---')) continue; // Skip divider row
    const cells = line
      .split('|')
      .slice(1, -1)
      .map((c) => c.trim());
    if (cells.length > 0) rows.push(cells);
  }

  return rows.length > 0 ? rows : null;
}

/**
 * Generate Microsoft Word (.docx) file from DocumentItem
 */
export async function exportToDocx(
  doc: DocumentItem,
  madrasah: MadrasahProfile,
  teacher: TeacherProfile
): Promise<Blob> {
  const teacherDisplayName = [teacher.gelarDepan, teacher.namaLengkap, teacher.gelarBelakang]
    .filter(Boolean)
    .join(' ');

  const currentDateStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const children: (Paragraph | Table)[] = [];

  // 1. KOP SURAT MADRASAH (Header Identitas Resmi)
  const includeKop = doc.paperSettings?.includeKop !== false;
  if (includeKop) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: madrasah.kementerian ? madrasah.kementerian.toUpperCase() : 'KEMENTERIAN AGAMA REPUBLIK INDONESIA',
            bold: true,
            size: 20, // 10pt
            font: 'Calibri',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: `KANTOR KEMENTERIAN AGAMA KABUPATEN/KOTA ${madrasah.kabupatenKota.toUpperCase()}`,
            bold: true,
            size: 22, // 11pt
            font: 'Calibri',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: madrasah.namaMadrasah.toUpperCase(),
            bold: true,
            size: 28, // 14pt
            font: 'Calibri',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: `${madrasah.alamat}, Desa/Kel. ${madrasah.desaKelurahan}, Kec. ${madrasah.kecamatan}, ${madrasah.kabupatenKota} - ${madrasah.kodePos} | Email: ${madrasah.email}`,
            italics: true,
            size: 16, // 8pt
            font: 'Calibri',
          }),
        ],
      }),
      // Garis ganda Kop Surat
      new Paragraph({
        border: {
          bottom: {
            color: '000000',
            space: 1,
            style: BorderStyle.DOUBLE,
            size: 12,
          },
        },
        spacing: { after: 240 },
        children: [],
      })
    );
  }

  // 2. JUDUL DOKUMEN PERANGKAT AJAR
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 180 },
      children: [
        new TextRun({
          text: doc.judul.replace(/\[AI\]\s*/i, '').toUpperCase(),
          bold: true,
          size: 26, // 13pt
          font: 'Calibri',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
      children: [
        new TextRun({
          text: `TAHUN PELAJARAN ${doc.tahunPelajaran} • SEMESTER ${doc.semester.toUpperCase()}`,
          bold: true,
          size: 20, // 10pt
          font: 'Calibri',
        }),
      ],
    })
  );

  // 3. TABEL IDENTITAS PERANGKAT
  const identitasRows = [
    ['Madrasah', `: ${madrasah.namaMadrasah}`, 'Mata Pelajaran', `: ${doc.mataPelajaran}`],
    ['Kelas / Fase', `: Kelas ${doc.kelas} / Fase ${doc.fase}`, 'Alokasi Waktu', `: ${doc.alokasiWaktu || 'Sesuai Rencana'}`],
    ['Kurikulum', `: ${doc.kurikulum}`, 'Penyusun', `: ${teacherDisplayName}`],
  ];

  const idTableRows = identitasRows.map(
    (row) =>
      new TableRow({
        children: [
          new TableCell({
            width: { size: 20, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            children: [
              new Paragraph({
                children: [new TextRun({ text: row[0], bold: true, size: 18, font: 'Calibri' })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            children: [
              new Paragraph({
                children: [new TextRun({ text: row[1], size: 18, font: 'Calibri' })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 20, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            children: [
              new Paragraph({
                children: [new TextRun({ text: row[2], bold: true, size: 18, font: 'Calibri' })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            children: [
              new Paragraph({
                children: [new TextRun({ text: row[3], size: 18, font: 'Calibri' })],
              }),
            ],
          }),
        ],
      })
  );

  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: idTableRows,
    }),
    new Paragraph({ spacing: { after: 200 }, children: [] })
  );

  // 4. BAGIAN / SECTIONS DOKUMEN
  for (const sec of doc.sections) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
        children: [
          new TextRun({
            text: sec.title,
            bold: true,
            size: 22,
            font: 'Calibri',
          }),
        ],
      })
    );

    // Check if section contains a table
    const tableData = parseMarkdownTable(sec.content);
    if (tableData) {
      const docTableRows = tableData.map((rowCells, rIdx) => {
        return new TableRow({
          children: rowCells.map((cellText) => {
            return new TableCell({
              borders: {
                top: { style: BorderStyle.SINGLE, size: 1, color: '888888' },
                bottom: { style: BorderStyle.SINGLE, size: 1, color: '888888' },
                left: { style: BorderStyle.SINGLE, size: 1, color: '888888' },
                right: { style: BorderStyle.SINGLE, size: 1, color: '888888' },
              },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: cellText,
                      bold: rIdx === 0,
                      size: 18,
                      font: 'Calibri',
                    }),
                  ],
                }),
              ],
            });
          }),
        });
      });

      children.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: docTableRows,
        }),
        new Paragraph({ spacing: { after: 120 }, children: [] })
      );
    } else {
      // Split into paragraphs
      const paragraphs = sec.content.split('\n');
      for (const pText of paragraphs) {
        if (!pText.trim()) continue;

        const isBullet = pText.trim().startsWith('-') || pText.trim().startsWith('•') || pText.trim().startsWith('*');
        const cleanText = isBullet ? pText.trim().replace(/^[-•*]\s*/, '') : pText;

        children.push(
          new Paragraph({
            bullet: isBullet ? { level: 0 } : undefined,
            spacing: { after: 80, line: 276 }, // 1.15 line spacing
            children: [
              new TextRun({
                text: cleanText,
                size: 20, // 10pt
                font: 'Calibri',
              }),
            ],
          })
        );
      }
    }
  }

  // 5. TANDA TANGAN (Kemenag Official Signatures)
  const includeSignatures = doc.paperSettings?.includeSignatures !== false;
  if (includeSignatures) {
    const ttdRows = [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            children: [
              new Paragraph({
                spacing: { before: 240 },
                children: [new TextRun({ text: 'Mengetahui,', size: 18, font: 'Calibri' })],
              }),
              new Paragraph({
                children: [new TextRun({ text: `Kepala ${madrasah.namaMadrasah}`, bold: true, size: 18, font: 'Calibri' })],
              }),
              new Paragraph({ spacing: { before: 900 }, children: [] }), // Jarak tanda tangan
              new Paragraph({
                children: [
                  new TextRun({
                    text: madrasah.namaKepala,
                    bold: true,
                    underline: {},
                    size: 18,
                    font: 'Calibri',
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `NIP. ${madrasah.nipKepala || '-'}`,
                    size: 18,
                    font: 'Calibri',
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            children: [
              new Paragraph({
                spacing: { before: 240 },
                children: [
                  new TextRun({
                    text: `${madrasah.kecamatan || madrasah.kabupatenKota}, ${currentDateStr}`,
                    size: 18,
                    font: 'Calibri',
                  }),
                ],
              }),
              new Paragraph({
                children: [new TextRun({ text: 'Guru Mata Pelajaran,', bold: true, size: 18, font: 'Calibri' })],
              }),
              new Paragraph({ spacing: { before: 900 }, children: [] }), // Jarak tanda tangan
              new Paragraph({
                children: [
                  new TextRun({
                    text: teacherDisplayName,
                    bold: true,
                    underline: {},
                    size: 18,
                    font: 'Calibri',
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `NIP/NIY. ${teacher.nipNiy || '-'}`,
                    size: 18,
                    font: 'Calibri',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ];

    children.push(
      new Paragraph({ spacing: { before: 200 }, children: [] }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: ttdRows,
      })
    );
  }

  // 6. BUILD WORD DOCUMENT
  const wordDoc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch = 1440 twips
              bottom: 1440,
              left: 1440,
              right: 1440,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: `${doc.tipeLabel} • ${doc.mataPelajaran} Kelas ${doc.kelas} - ${madrasah.namaMadrasah}`,
                    italics: true,
                    size: 14,
                    color: '888888',
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'Halaman ',
                    size: 14,
                    color: '888888',
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 14,
                    color: '888888',
                  }),
                  new TextRun({
                    text: ' | SIPENA MI PERSONAL',
                    size: 14,
                    color: '888888',
                  }),
                ],
              }),
            ],
          }),
        },
        children,
      },
    ],
  });

  return await Packer.toBlob(wordDoc);
}

/**
 * Triggers native browser print preview tailored as A4 PDF document
 */
export function printDocumentAsPdf(
  doc: DocumentItem,
  madrasah: MadrasahProfile,
  teacher: TeacherProfile
): void {
  const teacherDisplayName = [teacher.gelarDepan, teacher.namaLengkap, teacher.gelarBelakang]
    .filter(Boolean)
    .join(' ');

  const currentDateStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Mohon izinkan pop-up peramban untuk mencetak dokumen atau ekspor PDF.');
    return;
  }

  const sectionsHtml = doc.sections
    .map((sec) => {
      const tableData = parseMarkdownTable(sec.content);
      let contentRendered = '';

      if (tableData) {
        contentRendered = `
          <table class="data-table">
            <thead>
              <tr>${tableData[0].map((c) => `<th>${c}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${tableData
                .slice(1)
                .map((row) => `<tr>${row.map((c) => `<td>${c}</td>`).join('')}</tr>`)
                .join('')}
            </tbody>
          </table>
        `;
      } else {
        contentRendered = sec.content
          .split('\n')
          .filter((line) => line.trim().length > 0)
          .map((line) => {
            if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
              return `<li>${line.trim().replace(/^[-•*]\s*/, '')}</li>`;
            }
            return `<p>${line}</p>`;
          })
          .join('');
      }

      return `
        <div class="section-block">
          <h2 class="section-title">${sec.title}</h2>
          <div class="section-content">${contentRendered}</div>
        </div>
      `;
    })
    .join('');

  const html = `
    <!DOCTYPE html>
    <html lang="id">
      <head>
        <meta charset="UTF-8">
        <title>${generateDocumentFilename(doc, 'pdf')}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 20mm 20mm 25mm 20mm;
          }
          body {
            font-family: 'Times New Roman', Times, serif;
            color: #111;
            font-size: 11pt;
            line-height: 1.5;
            margin: 0;
            padding: 0;
            background: #fff;
          }
          .kop-container {
            text-align: center;
            border-bottom: 3px double #000;
            padding-bottom: 12px;
            margin-bottom: 24px;
          }
          .kop-kemenag {
            font-size: 10pt;
            font-weight: bold;
            margin: 0;
            text-transform: uppercase;
          }
          .kop-kantor {
            font-size: 11pt;
            font-weight: bold;
            margin: 2px 0;
            text-transform: uppercase;
          }
          .kop-madrasah {
            font-size: 14pt;
            font-weight: bold;
            margin: 4px 0;
            text-transform: uppercase;
          }
          .kop-alamat {
            font-size: 8.5pt;
            font-style: italic;
            margin: 2px 0;
          }
          .doc-header {
            text-align: center;
            margin-bottom: 24px;
          }
          .doc-title {
            font-size: 13pt;
            font-weight: bold;
            text-transform: uppercase;
            margin: 0 0 4px 0;
          }
          .doc-subtitle {
            font-size: 10pt;
            font-weight: bold;
            margin: 0;
          }
          .meta-table {
            width: 100%;
            margin-bottom: 20px;
            font-size: 10pt;
          }
          .meta-table td {
            padding: 2px 4px;
            vertical-align: top;
          }
          .section-block {
            margin-bottom: 18px;
            page-break-inside: avoid;
          }
          .section-title {
            font-size: 11pt;
            font-weight: bold;
            margin: 14px 0 6px 0;
            border-bottom: 1px solid #ccc;
            padding-bottom: 2px;
          }
          .section-content p {
            margin: 4px 0;
            text-align: justify;
          }
          .section-content li {
            margin: 2px 0;
          }
          .data-table {
            width: 100%;
            border-collapse: collapse;
            margin: 8px 0;
            font-size: 9.5pt;
          }
          .data-table th, .data-table td {
            border: 1px solid #666;
            padding: 6px 8px;
            text-align: left;
          }
          .data-table th {
            background-color: #f2f2f2;
            font-weight: bold;
          }
          .signature-table {
            width: 100%;
            margin-top: 40px;
            page-break-inside: avoid;
            font-size: 10pt;
          }
          .signature-table td {
            width: 50%;
            vertical-align: top;
          }
          .sig-spacer {
            height: 70px;
          }
          .sig-name {
            font-weight: bold;
            text-decoration: underline;
          }
          @media print {
            body { -webkit-print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="kop-container">
          <p class="kop-kemenag">${madrasah.kementerian ? madrasah.kementerian.toUpperCase() : 'KEMENTERIAN AGAMA REPUBLIK INDONESIA'}</p>
          <p class="kop-kantor">KANTOR KEMENTERIAN AGAMA KABUPATEN/KOTA ${madrasah.kabupatenKota.toUpperCase()}</p>
          <p class="kop-madrasah">${madrasah.namaMadrasah.toUpperCase()}</p>
          <p class="kop-alamat">${madrasah.alamat}, Desa/Kel. ${madrasah.desaKelurahan}, Kec. ${madrasah.kecamatan}, ${madrasah.kabupatenKota} - ${madrasah.kodePos} | Email: ${madrasah.email}</p>
        </div>

        <div class="doc-header">
          <h1 class="doc-title">${doc.judul.replace(/\[AI\]\s*/i, '')}</h1>
          <p class="doc-subtitle">TAHUN PELAJARAN ${doc.tahunPelajaran} • SEMESTER ${doc.semester.toUpperCase()}</p>
        </div>

        <table class="meta-table">
          <tr>
            <td style="width: 18%; font-weight: bold;">Madrasah</td>
            <td style="width: 32%;">: ${madrasah.namaMadrasah}</td>
            <td style="width: 18%; font-weight: bold;">Mata Pelajaran</td>
            <td style="width: 32%;">: ${doc.mataPelajaran}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Kelas / Fase</td>
            <td>: Kelas ${doc.kelas} / Fase ${doc.fase}</td>
            <td style="font-weight: bold;">Alokasi Waktu</td>
            <td>: ${doc.alokasiWaktu || 'Sesuai Rencana'}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Kurikulum</td>
            <td>: ${doc.kurikulum}</td>
            <td style="font-weight: bold;">Penyusun</td>
            <td>: ${teacherDisplayName}</td>
          </tr>
        </table>

        ${sectionsHtml}

        <table class="signature-table">
          <tr>
            <td>
              <p>Mengetahui,</p>
              <p><strong>Kepala ${madrasah.namaMadrasah}</strong></p>
              <div class="sig-spacer"></div>
              <p class="sig-name">${madrasah.namaKepala}</p>
              <p>NIP. ${madrasah.nipKepala || '-'}</p>
            </td>
            <td>
              <p>${madrasah.kecamatan || madrasah.kabupatenKota}, ${currentDateStr}</p>
              <p><strong>Guru Mata Pelajaran,</strong></p>
              <div class="sig-spacer"></div>
              <p class="sig-name">${teacherDisplayName}</p>
              <p>NIP/NIY. ${teacher.nipNiy || '-'}</p>
            </td>
          </tr>
        </table>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

/**
 * Downloads Word Blob to user device
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
