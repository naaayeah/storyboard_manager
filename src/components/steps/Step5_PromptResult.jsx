import { useState, useEffect } from 'react';
import { useClaudeAPI } from '../../hooks/useClaudeAPI';
import { buildSystemPrompt, buildSingleCutPrompt, buildMultiCutPrompt } from '../../utils/promptBuilder';

export default function Step5_PromptResult({ project, goToStep }) {
  const [selectedCuts, setSelectedCuts] = useState([]);
  const [prompts, setPrompts] = useState({}); // cutId -> prompt text
  const [generatingAll, setGeneratingAll] = useState(false);
  const [copied, setCopied] = useState('');
  const { callClaude, loading } = useClaudeAPI();

  const episodes = project.episodes || [];
  const allCuts = episodes.flatMap(ep => ep.cuts || []);

  const toggleCut = (cutId) => {
    setSelectedCuts(prev =>
      prev.includes(cutId) ? prev.filter(id => id !== cutId) : [...prev, cutId]
    );
  };

  const selectAll = () => setSelectedCuts(allCuts.map(c => c.id));
  const clearAll = () => setSelectedCuts([]);

  const generateForCut = async (cut) => {
    const system = buildSystemPrompt(project.fixedValues);
    const userMsg = buildSingleCutPrompt(cut);
    const result = await callClaude({ system, messages: [{ role: 'user', content: userMsg }], maxTokens: 3000 });
    return result;
  };

  const handleGenerateSelected = async () => {
    if (!selectedCuts.length) return;
    setGeneratingAll(true);
    const newPrompts = { ...prompts };
    for (const cutId of selectedCuts) {
      const cut = allCuts.find(c => c.id === cutId);
      if (!cut) continue;
      try {
        newPrompts[cutId] = await generateForCut(cut);
      } catch (e) {
        newPrompts[cutId] = `오류: ${e.message}`;
      }
      setPrompts({ ...newPrompts });
    }
    setGeneratingAll(false);
  };

  const handleGenerateMulti = async () => {
    if (selectedCuts.length < 2) return;
    const cuts = selectedCuts.map(id => allCuts.find(c => c.id === id)).filter(Boolean);
    const system = buildSystemPrompt(project.fixedValues);
    const userMsg = buildMultiCutPrompt(cuts);
    try {
      const result = await callClaude({ system, messages: [{ role: 'user', content: userMsg }], maxTokens: 5000 });
      const key = selectedCuts.join('+');
      setPrompts(prev => ({ ...prev, [key]: result }));
    } catch (e) {
      alert(`오류: ${e.message}`);
    }
  };

  const copyPrompt = (text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(''), 2000);
    });
  };

  const copyAll = () => {
    const allText = Object.values(prompts).filter(Boolean).join('\n\n---\n\n');
    navigator.clipboard.writeText(allText).then(() => {
      setCopied('all');
      setTimeout(() => setCopied(''), 2000);
    });
  };

  const generatedKeys = Object.keys(prompts);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontFamily: 'Noto Serif KR, serif', fontSize: '24px', fontWeight: '700', margin: 0 }}>
            프롬프트 생성
          </h1>
          <p style={{ color: 'var(--grey-600)', fontSize: '13px', marginTop: '4px' }}>
            컷을 선택하고 씨댄스 2.0 프롬프트를 생성하세요.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="btn-secondary" onClick={() => goToStep(4)}>↩ 편집으로</button>
          {generatedKeys.length > 0 && (
            <button className="btn-secondary" onClick={copyAll}>
              {copied === 'all' ? '✓ 복사됨' : '전체 복사'}
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '16px' }}>
        {/* Left: Cut selector */}
        <div>
          <div className="card" style={{ position: 'sticky', top: '96px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--grey-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                컷 선택
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button className="btn-ghost" onClick={selectAll} style={{ fontSize: '11px' }}>전체</button>
                <button className="btn-ghost" onClick={clearAll} style={{ fontSize: '11px' }}>해제</button>
              </div>
            </div>

            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {episodes.map(ep => (
                <div key={ep.id} style={{ marginBottom: '10px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--accent)', marginBottom: '4px', letterSpacing: '0.05em' }}>
                    {ep.id}
                  </div>
                  {(ep.cuts || []).map(cut => (
                    <label
                      key={cut.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 8px',
                        cursor: 'pointer',
                        backgroundColor: selectedCuts.includes(cut.id) ? 'var(--grey-100)' : 'transparent',
                        borderLeft: selectedCuts.includes(cut.id) ? '2px solid var(--accent)' : '2px solid transparent',
                        marginBottom: '2px',
                        fontSize: '12px',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedCuts.includes(cut.id)}
                        onChange={() => toggleCut(cut.id)}
                        style={{ accentColor: 'var(--accent)' }}
                      />
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'var(--grey-600)' }}>
                        {cut.id}
                      </span>
                      {cut.isKey && <span className="key-badge">KEY</span>}
                    </label>
                  ))}
                </div>
              ))}
            </div>

            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--grey-200)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                className="btn-primary"
                onClick={handleGenerateSelected}
                disabled={!selectedCuts.length || generatingAll || loading}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {generatingAll ? <><span className="spinner" /> 생성 중...</> : `⚡ 개별 생성 (${selectedCuts.length}컷)`}
              </button>
              {selectedCuts.length >= 2 && (
                <button
                  className="btn-secondary"
                  onClick={handleGenerateMulti}
                  disabled={loading || generatingAll}
                  style={{ width: '100%', justifyContent: 'center', fontSize: '12px' }}
                >
                  {loading ? <><span className="spinner" /> 생성 중...</> : `멀티컷 통합 생성 (${selectedCuts.length}컷)`}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Generated prompts */}
        <div>
          {generatedKeys.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--grey-400)' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚡</div>
              <div style={{ fontSize: '14px' }}>컷을 선택하고 프롬프트를 생성하세요.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {generatedKeys.map(key => (
                <div key={key} className="card">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', fontWeight: '600', color: 'var(--accent)' }}>
                      {key}
                    </span>
                    <button
                      className="btn-secondary"
                      onClick={() => copyPrompt(prompts[key], key)}
                      style={{ padding: '4px 10px', fontSize: '12px' }}
                    >
                      {copied === key ? '✓ 복사됨' : '복사'}
                    </button>
                  </div>
                  <div className="prompt-output">{prompts[key]}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
