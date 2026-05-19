import { useState } from 'react';
import { usePDF } from '../../hooks/usePDF';

export default function ExportModal({ project, onClose }) {
  const { generatePDF } = usePDF(project);
  const [selectedEps, setSelectedEps] = useState((project.episodes || []).map(ep => ep.id));
  const [includeFixed, setIncludeFixed] = useState(true);
  const [loading, setLoading] = useState(false);

  const toggleEp = (id) => {
    setSelectedEps(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);
  };

  const handleExport = async () => {
    setLoading(true);
    try {
      await generatePDF({ episodeIds: selectedEps, includeFixedValues: includeFixed });
    } catch (e) {
      alert(`PDF 내보내기 오류: ${e.message}`);
    }
    setLoading(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <span style={{ fontWeight: '700', fontSize: '14px' }}>PDF 내보내기</span>
          <button className="btn-ghost" onClick={onClose} style={{ color: 'var(--grey-400)', fontSize: '18px' }}>✕</button>
        </div>
        <div className="modal-body">
          <div style={{ marginBottom: '16px' }}>
            <label className="label-base" style={{ marginBottom: '8px', display: 'block' }}>포함할 에피소드</label>
            {(project.episodes || []).map(ep => (
              <label key={ep.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={selectedEps.includes(ep.id)}
                  onChange={() => toggleEp(ep.id)}
                  style={{ accentColor: 'var(--accent)' }}
                />
                <span style={{ fontSize: '13px' }}>{ep.id} — {ep.title}</span>
                <span style={{ fontSize: '11px', color: 'var(--grey-400)' }}>{(ep.cuts || []).length}컷</span>
              </label>
            ))}
          </div>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={includeFixed}
                onChange={e => setIncludeFixed(e.target.checked)}
                style={{ accentColor: 'var(--accent)' }}
              />
              <span style={{ fontSize: '13px' }}>고정값 페이지 포함</span>
            </label>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>취소</button>
          <button className="btn-primary" onClick={handleExport} disabled={loading || selectedEps.length === 0}>
            {loading ? <><span className="spinner" /> 생성 중...</> : 'PDF 내보내기'}
          </button>
        </div>
      </div>
    </div>
  );
}
