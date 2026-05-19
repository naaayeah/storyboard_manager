import { useState, useEffect } from 'react';
import { useClaudeAPI } from '../../hooks/useClaudeAPI';
import { parseStoryboardResponse } from '../../utils/storyParser';

const SB_STAGES = ['시나리오 분석 중', '씬 구성 중', '컷 배분 중', '스토리보드 완성 중'];

function StoryboardOverlay({ streamText }) {
  const [stageIdx, setStageIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStageIdx(i => Math.min(i + 1, SB_STAGES.length - 1));
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const progress = Math.min(8 + (stageIdx / (SB_STAGES.length - 1)) * 82 + (streamText.length > 0 ? 8 : 0), 95);

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(25,25,25,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 200, padding: '24px',
    }}>
      <div style={{
        backgroundColor: 'var(--tds-surface)', borderRadius: 'var(--radius-xl)',
        padding: '32px', width: '100%', maxWidth: '480px',
        boxShadow: 'var(--shadow-lg)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <span className="spinner spinner-blue" style={{ width: '22px', height: '22px', borderWidth: '3px' }} />
          <div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--tds-text-1)' }}>스토리보드 생성 중</div>
            <div style={{ fontSize: '13px', color: 'var(--tds-text-3)', marginTop: '2px' }}>{SB_STAGES[stageIdx]}...</div>
          </div>
        </div>

        <div style={{ height: '6px', backgroundColor: 'var(--tds-border)', borderRadius: '999px', overflow: 'hidden', marginBottom: '16px' }}>
          <div style={{
            height: '100%', backgroundColor: 'var(--tds-blue)',
            borderRadius: '999px', width: `${progress}%`,
            transition: 'width 1.4s ease',
          }} />
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {SB_STAGES.map((s, i) => (
            <div key={s} style={{ flex: 1 }}>
              <div style={{
                height: '3px', borderRadius: '999px',
                backgroundColor: i <= stageIdx ? 'var(--tds-blue)' : 'var(--tds-border)',
                transition: 'background-color 0.4s',
              }} />
              <div style={{
                fontSize: '10px', color: i <= stageIdx ? 'var(--tds-blue)' : 'var(--tds-text-4)',
                marginTop: '5px', fontWeight: i === stageIdx ? '700' : '400',
              }}>{s}</div>
            </div>
          ))}
        </div>

        {streamText.length > 0 && (
          <div style={{
            marginTop: '16px', padding: '12px 14px',
            backgroundColor: 'var(--tds-surface-2)', borderRadius: 'var(--radius-sm)',
            fontSize: '12px', color: 'var(--tds-text-3)',
            fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.6,
            maxHeight: '80px', overflow: 'hidden',
            maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
          }}>
            {streamText.slice(-200)}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Step2_Scenario({ project, updateProject, goToStep }) {
  const { callClaude, loading, error, streamText } = useClaudeAPI();
  const [localError, setLocalError] = useState('');
  const [openEpisodes, setOpenEpisodes] = useState({});

  const scenario = project.scenario || {};

  const updateCharacter = (idx, field, value) => {
    const chars = (scenario.characters || []).map((c, i) => i === idx ? { ...c, [field]: value } : c);
    updateProject({ scenario: { ...scenario, characters: chars } });
  };

  const updateEpisode = (idx, field, value) => {
    const eps = (scenario.episodes || []).map((e, i) => i === idx ? { ...e, [field]: value } : e);
    updateProject({ scenario: { ...scenario, episodes: eps } });
  };

  const toggleEpisode = (id) => setOpenEpisodes(prev => ({ ...prev, [id]: !prev[id] }));

  const handleGenerateStoryboard = async () => {
    setLocalError('');
    const chars = (scenario.characters || [])
      .map(c => `${c.id || 'A'}: ${c.name} (${c.role || ''}) — ${c.description || ''}`)
      .join('\n');

    const scenarioText = (scenario.episodes || [])
      .map(ep => `[${ep.id}] ${ep.title}\n핵심: ${ep.coreConcept || ''}\n시나리오: ${ep.scenario || ''}\n클리프행어: ${ep.cliffhanger || ''}`)
      .join('\n\n');

    const systemPrompt = `당신은 씨댄스 2.0(CiDance 2.0) 숏츠 드라마 스토리보드 전문가입니다.
시나리오를 분석하여 컷별 스토리보드 표를 생성합니다.
9:16 세로 포맷, 컷당 4초 기준.
반드시 JSON 형식으로만 응답하세요.`;

    const userPrompt = `아래 시나리오를 컷별 스토리보드 표로 변환해줘.

【시나리오】
${scenarioText}

【등장인물】
${chars}

각 화별로 8~14컷으로 구성하되, 아래 JSON 형식으로 응답해줘:
{
  "episodes": [
    {
      "id": "EP01",
      "title": "화 제목",
      "cuts": [
        {
          "id": "EP01-C01",
          "scene": 1,
          "situation": "상황 설명",
          "camera": "카메라 무브먼트",
          "lens": "렌즈",
          "composition": "구도 설명",
          "background": "배경 묘사",
          "lighting": "라이팅 설명",
          "dialogue": "대사",
          "emotion": "shock|anger|freeze|panic|null",
          "isKey": true
        }
      ],
      "ending": "엔딩 자막 텍스트"
    }
  ]
}`;

    try {
      const result = await callClaude({
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
        maxTokens: 8192,
        isJson: true,
      });
      const episodes = parseStoryboardResponse(result);
      if (!episodes || episodes.length === 0) throw new Error('스토리보드 파싱 실패');
      updateProject({ episodes, step: 3 });
      goToStep(3);
    } catch (err) {
      setLocalError(`오류: ${err.message}`);
    }
  };

  const charColors = ['var(--tds-blue)', '#7C3AED', '#00B493', '#F59E0B'];

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto' }}>
      {loading && <StoryboardOverlay streamText={streamText} />}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', gap: '12px' }}>
        <div>
          <h1 className="para-title" style={{ marginBottom: '6px' }}>시나리오 검토</h1>
          <p className="para-caption">내용을 확인하고 필요시 수정 후 스토리보드를 생성하세요.</p>
        </div>
        <button className="btn-secondary" onClick={() => goToStep(1)} style={{ flexShrink: 0 }}>↩ 재입력</button>
      </div>

      {(error || localError) && <div className="error-msg">{localError || error}</div>}

      {/* Synopsis */}
      <div className="card" style={{ marginBottom: '12px' }}>
        <label className="label-base">전체 줄거리</label>
        <textarea
          className="input-base"
          value={scenario.synopsis || ''}
          onChange={e => updateProject({ scenario: { ...scenario, synopsis: e.target.value } })}
          rows={3}
          style={{ resize: 'vertical', marginBottom: scenario.emotionArc ? '12px' : '0' }}
        />
        {scenario.emotionArc && (
          <div style={{
            display: 'flex', gap: '10px', alignItems: 'flex-start',
            padding: '12px 14px',
            backgroundColor: 'var(--tds-blue-light)',
            borderRadius: 'var(--radius-sm)',
          }}>
            <span style={{ fontSize: '14px', flexShrink: 0, marginTop: '1px' }}>📈</span>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--tds-blue)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '3px' }}>감정 아크</div>
              <p style={{ fontSize: '13px', color: 'var(--tds-text-2)', lineHeight: 1.55, margin: 0 }}>{scenario.emotionArc}</p>
            </div>
          </div>
        )}
      </div>

      {/* Characters */}
      {(scenario.characters || []).length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <div className="list-header">등장인물</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
            {scenario.characters.map((char, idx) => (
              <div key={char.id || idx} className="card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    backgroundColor: `${charColors[idx]}18`,
                    color: charColors[idx],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: '800', fontSize: '13px', flexShrink: 0,
                  }}>
                    {char.id || String.fromCharCode(65 + idx)}
                  </div>
                  <input
                    className="input-base"
                    type="text"
                    value={char.name || ''}
                    onChange={e => updateCharacter(idx, 'name', e.target.value)}
                    placeholder="이름"
                    style={{ fontSize: '15px', fontWeight: '700', padding: '5px 10px' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div>
                    <label className="label-base">역할 / 나이</label>
                    <input className="input-base" type="text" value={char.role || ''} onChange={e => updateCharacter(idx, 'role', e.target.value)} style={{ fontSize: '13px' }} />
                  </div>
                  <div>
                    <label className="label-base">성격 / 에너지</label>
                    <textarea className="input-base" value={char.description || ''} onChange={e => updateCharacter(idx, 'description', e.target.value)} rows={2} style={{ fontSize: '13px', resize: 'none' }} />
                  </div>
                  <div>
                    <label className="label-base">의상</label>
                    <input className="input-base" type="text" value={char.outfit || ''} onChange={e => updateCharacter(idx, 'outfit', e.target.value)} style={{ fontSize: '13px' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Episodes */}
      {(scenario.episodes || []).length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <div className="list-header">에피소드</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {scenario.episodes.map((ep, idx) => {
              const isOpen = !!openEpisodes[ep.id || idx];
              return (
                <div key={ep.id || idx} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  {/* Episode Header */}
                  <div
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '14px 18px', cursor: 'pointer',
                      borderBottom: isOpen ? '1px solid var(--tds-border)' : 'none',
                    }}
                    onClick={() => toggleEpisode(ep.id || idx)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                      <span className="badge badge-blue" style={{ flexShrink: 0 }}>{ep.id}</span>
                      <input
                        className="input-base"
                        type="text"
                        value={ep.title || ''}
                        onChange={e => { e.stopPropagation(); updateEpisode(idx, 'title', e.target.value); }}
                        onClick={e => e.stopPropagation()}
                        placeholder="화 제목"
                        style={{ fontSize: '15px', fontWeight: '600', flex: 1, background: 'transparent', border: '1.5px solid transparent', padding: '4px 8px' }}
                      />
                    </div>
                    <span style={{ color: 'var(--tds-text-4)', fontSize: '16px', marginLeft: '8px', flexShrink: 0 }}>{isOpen ? '▲' : '▼'}</span>
                  </div>

                  {isOpen && (
                    <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div>
                        <label className="label-base">핵심 사건</label>
                        <input className="input-base" type="text" value={ep.coreConcept || ''} onChange={e => updateEpisode(idx, 'coreConcept', e.target.value)} style={{ fontSize: '14px' }} />
                      </div>
                      <div>
                        <label className="label-base">클리프행어 (끝 장면)</label>
                        <input className="input-base" type="text" value={ep.cliffhanger || ''} onChange={e => updateEpisode(idx, 'cliffhanger', e.target.value)} style={{ fontSize: '14px' }} />
                      </div>
                      <div>
                        <label className="label-base">시나리오 (대화 포함)</label>
                        <textarea className="input-base" value={ep.scenario || ''} onChange={e => updateEpisode(idx, 'scenario', e.target.value)} rows={8} style={{ resize: 'vertical', fontSize: '13px', lineHeight: '1.65' }} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <button className="btn-bottom-cta" onClick={handleGenerateStoryboard} disabled={loading}>
        {loading ? <><span className="spinner" /> 스토리보드 생성 중...</> : '스토리보드 표 생성하기 →'}
      </button>
    </div>
  );
}
