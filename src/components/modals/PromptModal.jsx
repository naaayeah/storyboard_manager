import { useState } from 'react';

export default function PromptModal({ prompt, cuts, onClose, onRegenerate, loading }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: '800px' }}>
        <div className="modal-header">
          <div>
            <div style={{ fontWeight: '700', fontSize: '14px' }}>씨댄스 2.0 프롬프트</div>
            {cuts && cuts.length > 0 && (
              <div style={{ fontSize: '11px', color: 'var(--grey-400)', marginTop: '2px' }}>
                {cuts.map(c => c.id).join(', ')}
              </div>
            )}
          </div>
          <button className="btn-ghost" onClick={onClose} style={{ color: 'var(--grey-400)', fontSize: '18px' }}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          <div className="prompt-output">{prompt}</div>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onRegenerate} disabled={loading}>
            {loading ? <><span className="spinner" /> 재생성 중...</> : '↻ 재생성'}
          </button>
          <button className="btn-primary" onClick={handleCopy}>
            {copied ? '✓ 복사됨!' : '클립보드 복사'}
          </button>
        </div>
      </div>
    </div>
  );
}
