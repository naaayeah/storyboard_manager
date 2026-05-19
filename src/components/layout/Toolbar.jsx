import { useState } from 'react';
import { usePDF } from '../../hooks/usePDF';

export default function Toolbar({
  project, resetProject, versions, saveVersion, loadVersion, setProject, exportVersionsJSON, importVersionsJSON
}) {
  const [versionName, setVersionName] = useState('');
  const [showVersionInput, setShowVersionInput] = useState(false);
  const [showVersionDrop, setShowVersionDrop] = useState(false);
  const { generatePDF } = usePDF(project);

  const handleSaveVersion = () => {
    saveVersion(versionName || undefined);
    setVersionName('');
    setShowVersionInput(false);
  };

  const handleLoadVersion = (vId) => {
    const v = loadVersion(vId);
    if (v) setProject(prev => ({ ...prev, episodes: v.episodes, fixedValues: v.fixedValues }));
    setShowVersionDrop(false);
  };

  const handleNewProject = () => {
    if (window.confirm('새 프로젝트를 시작하면 현재 작업이 초기화됩니다. 계속하시겠습니까?')) {
      resetProject();
    }
  };

  return (
    <div style={{
      height: '52px',
      backgroundColor: '#191919',
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      gap: '10px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
        <div style={{
          width: '28px', height: '28px', borderRadius: '8px',
          backgroundColor: 'var(--tds-blue)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexShrink: 0,
        }}>
          <span style={{ color: 'white', fontSize: '12px', fontWeight: '800', letterSpacing: '-0.03em' }}>씨</span>
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ color: 'white', fontSize: '13px', fontWeight: '700', lineHeight: 1.2 }}>씨댄스 2.0</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.2 }}>
            {project.title || '제목 없는 프로젝트'}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        {showVersionInput ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input
              type="text"
              value={versionName}
              onChange={e => setVersionName(e.target.value)}
              placeholder="버전 이름..."
              onKeyDown={e => e.key === 'Enter' && handleSaveVersion()}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: 'white',
                padding: '5px 10px',
                fontSize: '13px',
                width: '140px',
                fontFamily: 'inherit',
                outline: 'none',
              }}
              autoFocus
            />
            <button
              onClick={handleSaveVersion}
              style={{
                height: '30px', padding: '0 12px', borderRadius: '8px',
                backgroundColor: 'var(--tds-blue)', color: 'white',
                border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600', fontFamily: 'inherit',
              }}
            >저장</button>
            <button className="btn-ghost" onClick={() => setShowVersionInput(false)} style={{ color: 'rgba(255,255,255,0.4)', padding: '4px' }}>✕</button>
          </div>
        ) : (
          <button className="btn-dark" onClick={() => setShowVersionInput(true)}>버전 저장</button>
        )}

        {/* Version Dropdown */}
        <div style={{ position: 'relative' }}>
          <button className="btn-dark" onClick={() => setShowVersionDrop(p => !p)}>
            버전 목록 <span style={{ opacity: 0.6, fontSize: '11px' }}>({versions.length})</span>
          </button>
          {showVersionDrop && (
            <div style={{
              position: 'absolute', right: 0, top: '38px',
              backgroundColor: 'var(--tds-surface)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              minWidth: '240px', zIndex: 200,
              maxHeight: '320px', overflowY: 'auto',
              border: '1px solid var(--tds-border)',
            }}>
              {versions.length === 0 ? (
                <div style={{ padding: '20px 16px', color: 'var(--tds-text-3)', fontSize: '14px', textAlign: 'center' }}>
                  저장된 버전 없음
                </div>
              ) : versions.map(v => (
                <div key={v.id} className="list-row" onClick={() => handleLoadVersion(v.id)}>
                  <div>
                    <div className="list-row-title">{v.name}</div>
                    <div className="list-row-desc">{v.cutCount}컷 · {new Date(v.createdAt).toLocaleDateString('ko-KR')}</div>
                  </div>
                  <span className="list-row-arrow">›</span>
                </div>
              ))}
              <div style={{ padding: '10px 12px', borderTop: '1px solid var(--tds-border)', display: 'flex', gap: '8px' }}>
                <button className="btn-ghost" onClick={exportVersionsJSON} style={{ fontSize: '12px', color: 'var(--tds-text-3)' }}>JSON 내보내기</button>
                <label style={{ cursor: 'pointer' }}>
                  <span className="btn-ghost" style={{ fontSize: '12px', color: 'var(--tds-text-3)', display: 'inline-flex', alignItems: 'center', padding: '6px 10px', borderRadius: '8px' }}>JSON 가져오기</span>
                  <input type="file" accept=".json" style={{ display: 'none' }} onChange={e => e.target.files[0] && importVersionsJSON(e.target.files[0])} />
                </label>
              </div>
            </div>
          )}
        </div>

        <button className="btn-dark" onClick={() => generatePDF()}>PDF 내보내기</button>
        <button className="btn-ghost" onClick={handleNewProject} style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px' }}>새 프로젝트</button>
      </div>
    </div>
  );
}
