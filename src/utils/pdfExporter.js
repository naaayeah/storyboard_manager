import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// A4 at 96 dpi = 794px wide. scale:2 → 1588px wide canvas.
const A4_PX_H = 1123 * 2; // A4 height at scale:2
const SCALE   = 2;

const FONT = "'Pretendard Variable', 'Noto Sans KR', sans-serif";

/* ── render an HTML string into a canvas ── */
const htmlToCanvas = async (html) => {
  const wrap = document.createElement('div');
  Object.assign(wrap.style, {
    position:   'fixed',
    left:       '-9999px',
    top:        '0',
    width:      '794px',
    background: '#ffffff',
    fontFamily: FONT,
    color:      '#191919',
    lineHeight: '1.55',
    boxSizing:  'border-box',
  });
  wrap.innerHTML = html;
  document.body.appendChild(wrap);

  const canvas = await html2canvas(wrap, {
    scale:           SCALE,
    useCORS:         true,
    backgroundColor: '#ffffff',
    logging:         false,
  });

  document.body.removeChild(wrap);
  return canvas;
};

/* ── slice a canvas into A4-height pages and add to jsPDF ── */
const canvasToPdfPages = (doc, canvas, project, pageNumRef) => {
  const totalH = canvas.height;
  const pages  = Math.ceil(totalH / A4_PX_H);

  for (let i = 0; i < pages; i++) {
    if (pageNumRef.n > 1) doc.addPage();

    const srcY = i * A4_PX_H;
    const srcH = Math.min(A4_PX_H, totalH - srcY);

    const slice = document.createElement('canvas');
    slice.width  = canvas.width;
    slice.height = A4_PX_H;
    const ctx = slice.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, slice.width, A4_PX_H);
    ctx.drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH);

    doc.addImage(slice.toDataURL('image/jpeg', 0.93), 'JPEG', 0, 0, 210, 297);

    // Footer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(160, 160, 155);
    const title = project.title || '씨댄스 스토리보드';
    doc.text(`${title} · CiDance 2.0`, 10, 293);
    doc.text(`${pageNumRef.n}`, 200, 293, { align: 'right' });
    pageNumRef.n++;
  }
};

/* ── HTML builders ── */
const sectionHeader = (title, color = '#191919') =>
  `<div style="font-size:11px;font-weight:700;color:#fff;background:${color};padding:4px 10px;margin:16px 0 6px;letter-spacing:0.04em;">${title}</div>`;

const labelRow = (label, value) =>
  value
    ? `<div style="display:flex;gap:8px;padding:3px 0;border-bottom:1px solid #f0efeb;font-size:11px;">
        <span style="width:90px;color:#8B95A1;flex-shrink:0;">${label}</span>
        <span style="color:#191919;">${value}</span>
       </div>`
    : '';

const buildFixedValuesHtml = (project) => {
  const fv = project.fixedValues;
  const charHtml = ['A', 'B'].map(key => {
    const ch = fv.characters?.[key];
    if (!ch || !ch.name) return '';
    return `
      ${sectionHeader(`CHARACTER ${key} — ${ch.name} (${ch.role || ''})`, '#3182F6')}
      <div style="padding:0 2px;">
        ${labelRow('Face', ch.face)}
        ${labelRow('Hair', ch.hair)}
        ${labelRow('Eyes', ch.eyes)}
        ${labelRow('Outfit', ch.outfit)}
        ${labelRow('Energy', ch.energy)}
      </div>`;
  }).join('');

  const bg = fv.background || {};
  const bgHtml = `
    ${sectionHeader('FIXED BACKGROUND', '#3182F6')}
    <div style="padding:0 2px;">
      ${labelRow('Location', bg.location)}
      ${labelRow('Ground', bg.ground)}
      ${labelRow('Props', bg.props)}
      ${labelRow('Kids', bg.kids)}
      ${labelRow('Time', bg.time)}
    </div>`;

  const st = fv.style || {};
  const styleHtml = `
    ${sectionHeader('FIXED STYLE', '#191919')}
    <div style="padding:0 2px;font-size:11px;color:#4E5968;line-height:1.6;">
      <div style="margin-bottom:4px;"><b>Quality:</b> ${st.quality || ''}</div>
      <div style="margin-bottom:4px;"><b>Prohibit:</b> ${st.prohibit || ''}</div>
      <div style="margin-bottom:4px;"><b>Motion:</b> ${st.motion || ''}</div>
      <div><b>Ratio:</b> ${st.ratio || ''}</div>
    </div>`;

  const lt = fv.lighting || {};
  const lightHtml = `
    ${sectionHeader('FIXED LIGHTING', '#191919')}
    <div style="padding:0 2px;">
      ${labelRow('Outdoor', lt.outdoor)}
      ${labelRow('Char A', lt.charA)}
      ${labelRow('Char B', lt.charB)}
    </div>`;

  return `
    <div style="padding:32px 40px;font-family:${FONT};">
      <div style="font-size:20px;font-weight:800;color:#191919;margin-bottom:4px;">${project.title || '씨댄스 2.0 스토리보드'}</div>
      <div style="font-size:12px;color:#8B95A1;margin-bottom:8px;">장르: ${project.genre} · 플랫폼: ${project.platform}</div>
      <div style="height:2px;background:#3182F6;margin-bottom:16px;"></div>
      ${charHtml}
      ${bgHtml}
      ${styleHtml}
      ${lightHtml}
    </div>`;
};

const EMOTION_COLORS = {
  shock:  { bg: '#FFF3E8', text: '#D65E00' },
  anger:  { bg: '#FFF0F1', text: '#F04452' },
  freeze: { bg: '#EBF3FF', text: '#3182F6' },
  panic:  { bg: '#F3EAFF', text: '#7C3AED' },
};

const buildEpisodeHtml = (ep) => {
  const rows = (ep.cuts || []).map((cut, i) => {
    const em = EMOTION_COLORS[cut.emotion] || { bg: '#F9FAFB', text: '#8B95A1' };
    const emotionBadge = cut.emotion && cut.emotion !== 'null'
      ? `<span style="background:${em.bg};color:${em.text};padding:1px 6px;border-radius:999px;font-size:10px;font-weight:600;">${cut.emotion}</span>`
      : '';
    const keyBadge = cut.isKey
      ? `<span style="background:#3182F6;color:#fff;padding:1px 6px;border-radius:999px;font-size:10px;font-weight:700;margin-left:3px;">KEY</span>`
      : '';

    return `
      <tr style="background:${i % 2 === 0 ? '#ffffff' : '#F9FAFB'};">
        <td style="padding:7px 8px;border-bottom:1px solid #E5E8EB;white-space:nowrap;vertical-align:top;font-size:11px;font-weight:700;color:#3182F6;">${cut.id}<br>${emotionBadge}${keyBadge}</td>
        <td style="padding:7px 8px;border-bottom:1px solid #E5E8EB;vertical-align:top;font-size:11px;">${cut.situation || ''}</td>
        <td style="padding:7px 8px;border-bottom:1px solid #E5E8EB;vertical-align:top;font-size:11px;">${cut.camera || ''}<br><span style="color:#8B95A1;">${cut.lens || ''}</span></td>
        <td style="padding:7px 8px;border-bottom:1px solid #E5E8EB;vertical-align:top;font-size:11px;">${cut.composition || ''}</td>
        <td style="padding:7px 8px;border-bottom:1px solid #E5E8EB;vertical-align:top;font-size:11px;">${cut.background || ''}</td>
        <td style="padding:7px 8px;border-bottom:1px solid #E5E8EB;vertical-align:top;font-size:11px;">${cut.lighting || ''}</td>
        <td style="padding:7px 8px;border-bottom:1px solid #E5E8EB;vertical-align:top;font-size:11px;color:#4E5968;">${cut.dialogue || ''}</td>
      </tr>`;
  }).join('');

  const endingHtml = ep.ending
    ? `<div style="background:#191919;color:#fff;font-size:12px;font-weight:700;padding:8px 14px;margin-top:8px;border-radius:4px;">ENDING: ${ep.ending}</div>`
    : '';

  return `
    <div style="padding:28px 36px;font-family:${FONT};">
      <div style="font-size:16px;font-weight:800;color:#191919;margin-bottom:2px;">${ep.id} — ${ep.title}</div>
      <div style="font-size:11px;color:#8B95A1;margin-bottom:10px;">${(ep.cuts || []).length}컷</div>
      <div style="height:2px;background:#191919;margin-bottom:12px;"></div>
      <table style="width:100%;border-collapse:collapse;font-family:${FONT};">
        <thead>
          <tr style="background:#191919;">
            <th style="padding:7px 8px;text-align:left;font-size:10px;color:#fff;font-weight:700;white-space:nowrap;">CUT</th>
            <th style="padding:7px 8px;text-align:left;font-size:10px;color:#fff;font-weight:700;width:22%;">상황</th>
            <th style="padding:7px 8px;text-align:left;font-size:10px;color:#fff;font-weight:700;">카메라 / 렌즈</th>
            <th style="padding:7px 8px;text-align:left;font-size:10px;color:#fff;font-weight:700;">구도</th>
            <th style="padding:7px 8px;text-align:left;font-size:10px;color:#fff;font-weight:700;">배경</th>
            <th style="padding:7px 8px;text-align:left;font-size:10px;color:#fff;font-weight:700;">라이팅</th>
            <th style="padding:7px 8px;text-align:left;font-size:10px;color:#fff;font-weight:700;">대사</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      ${endingHtml}
    </div>`;
};

/* ── Main export function ── */
export const exportToPDF = async (project, options = {}) => {
  const {
    episodeIds      = project.episodes.map(e => e.id),
    includeFixedValues = true,
  } = options;

  const doc        = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageNumRef = { n: 1 };
  let firstSection = true;

  const addSection = async (html) => {
    const canvas = await htmlToCanvas(html);
    if (!firstSection) {
      // pages are added inside canvasToPdfPages
    }
    canvasToPdfPages(doc, canvas, project, pageNumRef);
    firstSection = false;
  };

  // Page 1: Fixed values
  if (includeFixedValues) {
    await addSection(buildFixedValuesHtml(project));
  }

  // Episode pages
  const episodesToExport = project.episodes.filter(ep => episodeIds.includes(ep.id));
  for (const ep of episodesToExport) {
    await addSection(buildEpisodeHtml(ep));
  }

  doc.save(`${project.title || 'storyboard'}_CiDance2.0.pdf`);
};
