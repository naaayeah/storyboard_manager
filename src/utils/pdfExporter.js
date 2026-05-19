import jsPDF from 'jspdf';

/**
 * Export storyboard to PDF using jsPDF
 * A4 portrait, text-based (no html2canvas dependency for performance)
 */
export const exportToPDF = async (project, options = {}) => {
  const {
    episodeIds = project.episodes.map(e => e.id),
    includeFixedValues = true,
    colorMode = 'color',
  } = options;

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = 210;
  const pageH = 297;
  const margin = 15;
  const contentW = pageW - margin * 2;
  let pageNum = 1;

  // Helper: add footer
  const addFooter = () => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 140);
    doc.text(`${project.title || '씨댄스 스토리보드'} · CiDance 2.0`, margin, pageH - 8);
    doc.text(`${pageNum}`, pageW - margin, pageH - 8, { align: 'right' });
    pageNum++;
  };

  // Helper: new page
  const newPage = () => {
    addFooter();
    doc.addPage();
  };

  // Page 1: Fixed Values
  if (includeFixedValues) {
    const fv = project.fixedValues;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(26, 25, 23);
    doc.text(project.title || '씨댄스 2.0 스토리보드', margin, margin + 8);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(90, 88, 85);
    doc.text(`장르: ${project.genre}  ·  플랫폼: ${project.platform}`, margin, margin + 16);

    let y = margin + 28;

    // Fixed style
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(26, 25, 23);
    doc.text('FIXED STYLE', margin, y);
    y += 6;
    doc.setDrawColor(200, 57, 26);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageW - margin, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(90, 88, 85);
    const styleLines = [
      `Quality: ${fv.style?.quality || ''}`,
      `Prohibit: ${fv.style?.prohibit || ''}`,
      `Motion: ${fv.style?.motion || ''}`,
      `Ratio: ${fv.style?.ratio || ''}`,
    ];
    styleLines.forEach(line => {
      const wrapped = doc.splitTextToSize(line, contentW);
      doc.text(wrapped, margin, y);
      y += wrapped.length * 5;
    });
    y += 6;

    // Characters
    ['A', 'B'].forEach(key => {
      const ch = fv.characters?.[key];
      if (!ch) return;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(26, 25, 23);
      doc.text(`CHARACTER ${key} — ${ch.name || '(미설정)'}`, margin, y);
      y += 6;
      doc.setDrawColor(200);
      doc.setLineWidth(0.3);
      doc.line(margin, y, pageW - margin, y);
      y += 5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(90, 88, 85);
      const chLines = [
        `Role: ${ch.role || ''}`,
        `Face: ${ch.face || ''}`,
        `Hair: ${ch.hair || ''}`,
        `Eyes: ${ch.eyes || ''}`,
        `Outfit: ${ch.outfit || ''}`,
        `Energy: ${ch.energy || ''}`,
      ];
      chLines.forEach(line => {
        const wrapped = doc.splitTextToSize(line, contentW);
        doc.text(wrapped, margin, y);
        y += wrapped.length * 5;
      });
      y += 6;
    });

    // Background
    const bg = fv.background;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(26, 25, 23);
    doc.text('FIXED BACKGROUND', margin, y);
    y += 6;
    doc.setDrawColor(200);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageW - margin, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(90, 88, 85);
    const bgLines = [
      `Location: ${bg?.location || ''}`,
      `Ground: ${bg?.ground || ''}`,
      `Props: ${bg?.props || ''}`,
      `Time: ${bg?.time || ''}`,
    ];
    bgLines.forEach(line => {
      const wrapped = doc.splitTextToSize(line, contentW);
      doc.text(wrapped, margin, y);
      y += wrapped.length * 5;
    });

    newPage();
  }

  // Storyboard pages
  const episodesToExport = project.episodes.filter(ep => episodeIds.includes(ep.id));

  for (const ep of episodesToExport) {
    let y = margin + 8;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(26, 25, 23);
    doc.text(`${ep.id} — ${ep.title}`, margin, y);
    y += 8;
    doc.setDrawColor(26, 25, 23);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageW - margin, y);
    y += 6;

    // Table headers
    const cols = [
      { label: 'CUT', w: 20 },
      { label: '상황', w: 38 },
      { label: '카메라/렌즈', w: 28 },
      { label: '구도', w: 28 },
      { label: '배경', w: 28 },
      { label: '라이팅', w: 22 },
      { label: '대사', w: 26 },
    ];
    const rowH = 18;
    let x = margin;

    // Draw header
    doc.setFillColor(26, 25, 23);
    doc.rect(margin, y, contentW, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(240, 239, 235);
    cols.forEach(col => {
      doc.text(col.label, x + 2, y + 5);
      x += col.w;
    });
    y += 7;

    // Draw rows
    const cuts = ep.cuts || [];
    for (const cut of cuts) {
      if (y + rowH > pageH - 20) {
        newPage();
        y = margin + 8;
      }

      const isKeyRow = cut.isKey;
      doc.setFillColor(isKeyRow ? 255 : 248, isKeyRow ? 248 : 247, isKeyRow ? 248 : 245);
      doc.rect(margin, y, contentW, rowH, 'F');
      doc.setDrawColor(221, 219, 212);
      doc.setLineWidth(0.2);
      doc.rect(margin, y, contentW, rowH);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(26, 25, 23);

      const cellValues = [
        cut.id,
        cut.situation || '',
        `${cut.camera || ''}\n${cut.lens || ''}`,
        cut.composition || '',
        cut.background || '',
        cut.lighting || '',
        cut.dialogue || '',
      ];
      x = margin;
      cols.forEach((col, i) => {
        const wrapped = doc.splitTextToSize(cellValues[i] || '', col.w - 3);
        doc.text(wrapped.slice(0, 3), x + 2, y + 5);
        x += col.w;
      });
      y += rowH;
    }

    // Ending card
    if (ep.ending) {
      if (y + 12 > pageH - 20) {
        newPage();
        y = margin + 8;
      }
      doc.setFillColor(26, 25, 23);
      doc.rect(margin, y, contentW, 10, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(240, 239, 235);
      doc.text(`ENDING: ${ep.ending}`, margin + 4, y + 7);
      y += 10;
    }

    newPage();
  }

  // Save (last page already added footer via newPage(), undo extra page)
  doc.deletePage(doc.internal.getNumberOfPages());
  addFooter();

  doc.save(`${project.title || 'storyboard'}_CiDance2.0.pdf`);
};
