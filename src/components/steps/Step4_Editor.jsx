import { useState } from 'react';
import StoryboardTable from '../storyboard/StoryboardTable';
import PromptModal from '../modals/PromptModal';
import AddCutModal from '../modals/AddCutModal';
import { useClaudeAPI } from '../../hooks/useClaudeAPI';
import { buildSystemPrompt, buildSingleCutPrompt, buildMultiCutPrompt } from '../../utils/promptBuilder';

export default function Step4_Editor({ project, setProject, goToStep }) {
  const [activeEp, setActiveEp] = useState(0);
  const [selectedCuts, setSelectedCuts] = useState([]);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [showAddCutModal, setShowAddCutModal] = useState(false);
  const [promptResult, setPromptResult] = useState('');
  const [promptCuts, setPromptCuts] = useState([]);
  const { callClaude, loading } = useClaudeAPI();

  const episodes = project.episodes || [];

  const updateEpisodes = (newEps) => {
    setProject(prev => ({ ...prev, episodes: newEps }));
  };

  const handleCutChange = (epIdx, cutIdx, field, value) => {
    const newEps = episodes.map((ep, ei) => {
      if (ei !== epIdx) return ep;
      return {
        ...ep,
        cuts: ep.cuts.map((c, ci) => ci !== cutIdx ? c : { ...c, [field]: value }),
      };
    });
    updateEpisodes(newEps);
  };

  const handleCutDelete = (epIdx, cutIdx) => {
    const newEps = episodes.map((ep, ei) => {
      if (ei !== epIdx) return ep;
      return { ...ep, cuts: ep.cuts.filter((_, ci) => ci !== cutIdx) };
    });
    updateEpisodes(newEps);
    setSelectedCuts([]);
  };

  const handleCutAdd = (epIdx, cutData) => {
    const ep = episodes[epIdx];
    const newCut = {
      id: `${ep.id}-C${String((ep.cuts || []).length + 1).padStart(2, '0')}`,
      scene: (ep.cuts || []).length + 1,
      ...cutData,
    };
    const newEps = episodes.map((e, ei) => {
      if (ei !== epIdx) return e;
      return { ...e, cuts: [...(e.cuts || []), newCut] };
    });
    updateEpisodes(newEps);
  };

  const handleCutReorder = (epIdx, fromIdx, toIdx) => {
    const newEps = episodes.map((ep, ei) => {
      if (ei !== epIdx) return ep;
      const cuts = [...ep.cuts];
      const [removed] = cuts.splice(fromIdx, 1);
      cuts.splice(toIdx, 0, removed);
      return { ...ep, cuts: cuts.map((c, i) => ({ ...c, scene: i + 1 })) };
    });
    updateEpisodes(newEps);
  };

  const handleSelectCut = (cutId) => {
    setSelectedCuts(prev =>
      prev.includes(cutId) ? prev.filter(id => id !== cutId) : [...prev, cutId]
    );
  };

  const handleGeneratePrompt = async (cuts) => {
    const ep = episodes[activeEp];
    const allCuts = ep?.cuts || [];
    const targetCuts = cuts
      ? (Array.isArray(cuts) ? cuts : [cuts])
      : allCuts.filter(c => selectedCuts.includes(c.id));

    if (!targetCuts.length) return;

    setPromptCuts(targetCuts);
    const system = buildSystemPrompt(project.fixedValues);
    const userMsg = targetCuts.length === 1
      ? buildSingleCutPrompt(targetCuts[0])
      : buildMultiCutPrompt(targetCuts);

    try {
      const result = await callClaude({
        system,
        messages: [{ role: 'user', content: userMsg }],
        maxTokens: 4000,
      });
      setPromptResult(result);
      setShowPromptModal(true);
    } catch (err) {
      alert(`프롬프트 생성 오류: ${err.message}`);
    }
  };

  const handleGoToStep5 = () => {
    if (selectedCuts.length === 0) {
      alert('프롬프트를 생성할 컷을 선택해주세요.');
      return;
    }
    goToStep(5);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontFamily: 'Noto Serif KR, serif', fontSize: '24px', fontWeight: '700', margin: 0 }}>
            스토리보드 편집
          </h1>
          <p style={{ color: 'var(--grey-600)', fontSize: '13px', marginTop: '4px' }}>
            컷을 클릭하여 인라인 편집 · 드래그로 순서 변경 · {selectedCuts.length > 0 && `${selectedCuts.length}컷 선택됨`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {selectedCuts.length > 0 && (
            <button
              className="btn-primary"
              onClick={() => handleGeneratePrompt(null)}
              disabled={loading}
            >
              {loading ? <><span className="spinner" /> 생성 중...</> : `⚡ 선택 컷 프롬프트 (${selectedCuts.length})`}
            </button>
          )}
          <button className="btn-secondary" onClick={() => setShowAddCutModal(true)}>
            + 컷 추가
          </button>
          <button className="btn-secondary" onClick={() => goToStep(5)}>
            프롬프트 생성 →
          </button>
        </div>
      </div>

      {episodes.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--grey-400)' }}>
          스토리보드 데이터가 없습니다. 먼저 스토리보드를 생성하세요.
        </div>
      ) : (
        <>
          {/* Episode Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--grey-200)', overflowX: 'auto', backgroundColor: 'white' }}>
            {episodes.map((ep, i) => (
              <button
                key={ep.id}
                className={`ep-tab ${activeEp === i ? 'active' : ''}`}
                onClick={() => setActiveEp(i)}
              >
                {ep.id} {ep.title}
                <span style={{ marginLeft: '6px', fontSize: '11px', color: 'var(--grey-400)' }}>
                  ({(ep.cuts || []).length})
                </span>
              </button>
            ))}
          </div>

          {episodes[activeEp] && (
            <StoryboardTable
              episode={episodes[activeEp]}
              epIdx={activeEp}
              editable={true}
              onCutChange={handleCutChange}
              onCutDelete={handleCutDelete}
              onCutReorder={handleCutReorder}
              selectedCuts={selectedCuts}
              onSelectCut={handleSelectCut}
              onGeneratePrompt={handleGeneratePrompt}
            />
          )}
        </>
      )}

      {/* Modals */}
      {showPromptModal && (
        <PromptModal
          prompt={promptResult}
          cuts={promptCuts}
          onClose={() => setShowPromptModal(false)}
          onRegenerate={() => handleGeneratePrompt(promptCuts)}
          loading={loading}
        />
      )}

      {showAddCutModal && episodes[activeEp] && (
        <AddCutModal
          onAdd={(data) => { handleCutAdd(activeEp, data); setShowAddCutModal(false); }}
          onClose={() => setShowAddCutModal(false)}
        />
      )}
    </div>
  );
}
