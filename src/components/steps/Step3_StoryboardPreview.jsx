import { useState } from 'react';
import StoryboardTable from '../storyboard/StoryboardTable';

export default function Step3_StoryboardPreview({ project, goToStep }) {
  const [activeEp, setActiveEp] = useState(0);
  const episodes = project.episodes || [];
  const totalCuts = episodes.reduce((a, ep) => a + (ep.cuts || []).length, 0);

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="para-title" style={{ marginBottom: '6px' }}>스토리보드 미리보기</h1>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span className="badge badge-blue">{episodes.length}에피소드</span>
            <span className="badge badge-grey">{totalCuts}컷</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-secondary" onClick={() => goToStep(2)}>↩ 재생성</button>
          <button className="btn-primary" onClick={() => goToStep(4)}>편집하기 →</button>
        </div>
      </div>

      {episodes.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px', color: 'var(--tds-text-3)' }}>
          스토리보드 데이터가 없습니다.
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Episode Tabs */}
          <div style={{
            display: 'flex', gap: '4px', padding: '12px 16px',
            borderBottom: '1px solid var(--tds-border)', overflowX: 'auto',
            backgroundColor: 'var(--tds-surface)',
          }}>
            {episodes.map((ep, i) => (
              <button
                key={ep.id}
                className={`ep-tab ${activeEp === i ? 'active' : ''}`}
                onClick={() => setActiveEp(i)}
              >
                {ep.id} {ep.title}
              </button>
            ))}
          </div>

          {episodes[activeEp] && (
            <div style={{ overflowX: 'auto' }}>
              <StoryboardTable episode={episodes[activeEp]} editable={false} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
