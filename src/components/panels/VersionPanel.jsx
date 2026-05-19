import { useState } from 'react';

export default function VersionPanel({
  project, versions, saveVersion, loadVersion, deleteVersion,
  exportVersionsJSON, importVersionsJSON, setProject,
}) {
  const [versionName, setVersionName] = useState('');

  const handleSave = () => {
    saveVersion(versionName || undefined);
    setVersionName('');
  };

  const handleLoad = (vId) => {
    const v = loadVersion(vId);
    if (v && window.confirm(`"${v.name}" 버전을 불러오시겠습니까?`)) {
      setProject(prev => ({
        ...prev,
        episodes: v.episodes,
        fixedValues: v.fixedValues,
      }));
    }
  };

  const handleDelete = (vId, name) => {
    if (window.confirm(`"${name}" 버전을 삭제하시겠습니까?`)) {
      deleteVersion(vId);
    }
  };

  return (
    <div style={{ padding: '12px' }}>
      {/* Save new version */}
      <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: 'var(--grey-100)', border: '1px solid var(--grey-200)' }}>
        <label className="label-base">버전 저장</label>
        <input
          className="input-base"
          type="text"
          value={versionName}
          onChange={e => setVersionName(e.target.value)}
          placeholder="버전 이름 (선택)"
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          style={{ marginBottom: '8px', fontSize: '12px' }}
        />
        <button className="btn-primary" onClick={handleSave} style={{ width: '100%', justifyContent: 'center', fontSize: '12px' }}>
          현재 상태 저장
        </button>
      </div>

      {/* Export/Import */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
        <button className="btn-secondary" onClick={exportVersionsJSON} style={{ flex: 1, fontSize: '11px', justifyContent: 'center' }}>
          JSON 내보내기
        </button>
        <label style={{ flex: 1, cursor: 'pointer' }}>
          <div className="btn-secondary" style={{ fontSize: '11px', justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
            JSON 가져오기
          </div>
          <input
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={e => e.target.files[0] && importVersionsJSON(e.target.files[0])}
          />
        </label>
      </div>

      {/* Version list */}
      <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--grey-600)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
        저장된 버전 ({versions.length})
      </div>
      {versions.length === 0 ? (
        <div style={{ color: 'var(--grey-400)', fontSize: '12px', padding: '12px 0' }}>저장된 버전 없음</div>
      ) : (
        versions.map(v => (
          <div
            key={v.id}
            style={{
              padding: '10px',
              border: '1px solid var(--grey-200)',
              marginBottom: '6px',
              backgroundColor: 'white',
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--ink)', marginBottom: '2px' }}>{v.name}</div>
            <div style={{ fontSize: '11px', color: 'var(--grey-400)', marginBottom: '6px' }}>
              {new Date(v.createdAt).toLocaleString('ko-KR')} · {v.cutCount}컷
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button className="btn-secondary" onClick={() => handleLoad(v.id)} style={{ flex: 1, fontSize: '11px', justifyContent: 'center' }}>
                불러오기
              </button>
              <button className="btn-ghost" onClick={() => handleDelete(v.id, v.name)} style={{ color: 'var(--accent)', fontSize: '11px' }}>
                삭제
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
