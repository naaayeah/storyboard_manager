import { useState, useEffect } from 'react';
import { useClaudeAPI } from '../../hooks/useClaudeAPI';
import { parseScenarioResponse, buildScenarioPromptComponents } from '../../utils/storyParser';

const STAGES = [
  '스토리 분석 중',
  '인물 구성 중',
  '시나리오 집필 중',
  '마무리 검토 중',
];

function GeneratingOverlay({ streamText }) {
  const [stageIdx, setStageIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStageIdx(i => Math.min(i + 1, STAGES.length - 1));
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const progress = Math.min(10 + (stageIdx / (STAGES.length - 1)) * 80 + (streamText.length > 0 ? 10 : 0), 95);

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
            <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--tds-text-1)' }}>시나리오 생성 중</div>
            <div style={{ fontSize: '13px', color: 'var(--tds-text-3)', marginTop: '2px' }}>{STAGES[stageIdx]}...</div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: '6px', backgroundColor: 'var(--tds-border)', borderRadius: '999px', overflow: 'hidden', marginBottom: '16px' }}>
          <div style={{
            height: '100%', backgroundColor: 'var(--tds-blue)',
            borderRadius: '999px',
            width: `${progress}%`,
            transition: 'width 1.2s ease',
          }} />
        </div>

        {/* Stage dots */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {STAGES.map((s, i) => (
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

const GENRES = ['숏츠 드라마', '로맨스', '스릴러', '일상', '기타'];
const PLATFORMS = ['유튜브 숏츠', '인스타 릴스', '틱톡'];
const EPISODE_COUNTS = [
  { value: 1, label: '1화' },
  { value: 2, label: '2화' },
  { value: 3, label: '3화' },
  { value: 'auto', label: '자동 결정' },
];

export default function Step1_StoryInput({ project, updateProject, goToStep }) {
  const { callClaude, loading, error, streamText } = useClaudeAPI();
  const [localError, setLocalError] = useState('');
  const [keywordInput, setKeywordInput] = useState('');

  const si = project.storyInput;

  const updateStoryInput = (updates) => {
    updateProject({ storyInput: { ...si, ...updates } });
  };

  const addCharacter = () => {
    if (si.characters.length >= 4) return;
    updateStoryInput({ characters: [...si.characters, { id: `char_${Date.now()}`, name: '', role: '' }] });
  };

  const updateCharacter = (idx, field, value) => {
    const chars = si.characters.map((c, i) => i === idx ? { ...c, [field]: value } : c);
    updateStoryInput({ characters: chars });
  };

  const removeCharacter = (idx) => {
    updateStoryInput({ characters: si.characters.filter((_, i) => i !== idx) });
  };

  const addKeyword = () => {
    const kw = keywordInput.trim();
    if (!kw || si.keywords.includes(kw)) return;
    updateStoryInput({ keywords: [...si.keywords, kw] });
    setKeywordInput('');
  };

  const removeKeyword = (kw) => {
    updateStoryInput({ keywords: si.keywords.filter(k => k !== kw) });
  };

  const handleGenerate = async () => {
    setLocalError('');
    if (!si.text.trim()) {
      setLocalError('스토리를 입력해주세요.');
      return;
    }
    const { characters, keywords, episodeCount, title, genre, platform, storyText } =
      buildScenarioPromptComponents(project);

    const systemPrompt = `당신은 씨댄스 2.0(CiDance 2.0) 숏츠 드라마 전문 시나리오 작가입니다.
사용자가 입력한 스토리를 분석하여 숏츠 드라마 시나리오로 각색합니다.
반드시 JSON 형식으로만 응답하세요. 마크다운 코드블록 없이 순수 JSON만.`;

    const userPrompt = `아래 스토리를 분석하고 ${episodeCount} 분량의 숏츠 드라마 시나리오를 작성해줘.

【프로젝트 정보】
제목: ${title}
장르: ${genre}
플랫폼: ${platform}
등장인물: ${characters}
분위기/키워드: ${keywords}

【원본 스토리】
${storyText}

아래 JSON 형식으로 응답해줘:
{
  "projectTitle": "제목",
  "genre": "장르",
  "synopsis": "전체 줄거리 2-3줄",
  "characters": [
    { "id": "A", "name": "이름", "role": "역할/나이", "description": "성격과 에너지 설명", "outfit": "의상 설명" }
  ],
  "episodes": [
    { "id": "EP01", "title": "화 제목", "coreConcept": "이 화의 핵심 사건 한 줄", "cliffhanger": "끝 장면 묘사", "scenario": "이 화 전체 시나리오 (등장인물 대화 포함, 상세하게)" }
  ],
  "emotionArc": "전체 감정 흐름 설명"
}`;

    try {
      const result = await callClaude({
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
        maxTokens: 4000,
        isJson: true,
      });
      const scenario = parseScenarioResponse(result);
      if (!scenario) throw new Error('시나리오 파싱 실패');
      updateProject({ title: scenario.projectTitle || project.title, scenario, step: 2 });
      goToStep(2);
    } catch (err) {
      setLocalError(`오류: ${err.message}`);
    }
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      {loading && <GeneratingOverlay streamText={streamText} />}

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 className="para-title" style={{ marginBottom: '6px' }}>스토리 입력</h1>
        <p className="para-caption">스토리를 입력하면 AI가 숏츠 드라마 시나리오로 분석합니다.</p>
      </div>

      {(error || localError) && <div className="error-msg">{localError || error}</div>}

      {/* Form sections as TDS ListRow-style cards */}
      {/* Project Title */}
      <div className="card" style={{ marginBottom: '12px' }}>
        <label className="label-base">프로젝트 제목</label>
        <input
          className="input-base"
          type="text"
          value={project.title}
          onChange={e => updateProject({ title: e.target.value })}
          placeholder="예: 사랑의 온도차"
        />
      </div>

      {/* Genre / Platform / Episode row */}
      <div className="card" style={{ marginBottom: '12px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div>
            <label className="label-base">장르</label>
            <select className="input-base" value={project.genre} onChange={e => updateProject({ genre: e.target.value })}>
              {GENRES.map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="label-base">플랫폼</label>
            <select className="input-base" value={project.platform} onChange={e => updateProject({ platform: e.target.value })}>
              {PLATFORMS.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="label-base">에피소드 수</label>
            <select
              className="input-base"
              value={si.episodeCount}
              onChange={e => {
                const val = e.target.value;
                updateStoryInput({ episodeCount: val === 'auto' ? 'auto' : parseInt(val) });
              }}
            >
              {EPISODE_COUNTS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Story Text */}
      <div className="card" style={{ marginBottom: '12px' }}>
        <label className="label-base">스토리 원문</label>
        <textarea
          className="input-base"
          value={si.text}
          onChange={e => updateStoryInput({ text: e.target.value })}
          rows={9}
          placeholder="원본 스토리, 줄거리, 또는 다음카페 글 등을 자유롭게 입력하세요..."
          style={{ resize: 'vertical' }}
        />
      </div>

      {/* Characters */}
      <div className="card" style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <label className="label-base" style={{ marginBottom: 0 }}>등장인물 <span style={{ fontWeight: 400, color: 'var(--tds-text-4)' }}>(최대 4명)</span></label>
          {si.characters.length < 4 && (
            <button className="btn-ghost" onClick={addCharacter} style={{ fontSize: '13px', color: 'var(--tds-blue)', fontWeight: '600' }}>
              + 추가
            </button>
          )}
        </div>
        {si.characters.length === 0 && (
          <p className="para-caption" style={{ paddingBottom: '4px' }}>등장인물을 추가하면 AI가 더 정확한 시나리오를 생성합니다.</p>
        )}
        {si.characters.map((char, idx) => (
          <div key={char.id} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              backgroundColor: 'var(--tds-blue-light)', color: 'var(--tds-blue)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: '700', fontSize: '12px', flexShrink: 0,
            }}>
              {String.fromCharCode(65 + idx)}
            </div>
            <input
              className="input-base"
              type="text"
              value={char.name}
              onChange={e => updateCharacter(idx, 'name', e.target.value)}
              placeholder="이름"
              style={{ flex: 1 }}
            />
            <input
              className="input-base"
              type="text"
              value={char.role}
              onChange={e => updateCharacter(idx, 'role', e.target.value)}
              placeholder="역할/나이"
              style={{ flex: 2 }}
            />
            <button
              className="btn-ghost"
              onClick={() => removeCharacter(idx)}
              style={{ color: 'var(--tds-text-4)', padding: '6px', flexShrink: 0 }}
            >✕</button>
          </div>
        ))}
      </div>

      {/* Keywords */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <label className="label-base">분위기 / 키워드 태그</label>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
          <input
            className="input-base"
            type="text"
            value={keywordInput}
            onChange={e => setKeywordInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addKeyword()}
            placeholder="예: 설렘, 클리프행어, 반전..."
            style={{ flex: 1 }}
          />
          <button className="btn-secondary" onClick={addKeyword} style={{ flexShrink: 0 }}>추가</button>
        </div>
        {si.keywords.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {si.keywords.map(kw => (
              <span key={kw} className="tag">
                {kw}
                <button
                  onClick={() => removeKeyword(kw)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--tds-blue)', fontSize: '12px', padding: '0 0 0 2px', lineHeight: 1 }}
                >✕</button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <button
        className="btn-bottom-cta"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? <><span className="spinner" /> 시나리오 생성 중...</> : '시나리오 생성하기 →'}
      </button>
    </div>
  );
}
