import { useState, useRef } from 'react';
import CutRow from './CutRow';
import EpisodeHeader from './EpisodeHeader';
import EndingCard from './EndingCard';

const TH_STYLE = {};

export default function StoryboardTable({
  episode,
  epIdx = 0,
  editable = false,
  onCutChange,
  onCutDelete,
  onCutReorder,
  selectedCuts = [],
  onSelectCut,
  onGeneratePrompt,
}) {
  const dragIdx = useRef(null);

  const handleDragStart = (e, idx) => {
    dragIdx.current = idx;
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, idx) => {
    e.preventDefault();
  };

  const handleDrop = (e, toIdx) => {
    e.preventDefault();
    if (dragIdx.current === null || dragIdx.current === toIdx) return;
    onCutReorder && onCutReorder(epIdx, dragIdx.current, toIdx);
    dragIdx.current = null;
  };

  const cuts = episode?.cuts || [];

  return (
    <div>
      <EpisodeHeader episode={episode} />
      <div style={{ overflowX: 'auto', backgroundColor: 'white' }}>
        <table className="storyboard-table">
          <thead>
            <tr>
              {editable && <th style={{ width: '40px' }}></th>}
              <th style={{ width: '36px' }}>씬</th>
              <th style={{ width: '80px' }}>Cut</th>
              <th>상황</th>
              <th style={{ minWidth: '100px' }}>카메라 / 렌즈</th>
              <th>구도</th>
              <th>배경</th>
              <th style={{ minWidth: '80px' }}>라이팅</th>
              <th style={{ minWidth: '100px' }}>대사</th>
              {editable && <th style={{ width: '100px' }}>감정 / KEY</th>}
              {editable && <th style={{ width: '70px' }}>액션</th>}
            </tr>
          </thead>
          <tbody>
            {cuts.length === 0 ? (
              <tr>
                <td colSpan={editable ? 11 : 9} style={{ textAlign: 'center', padding: '32px', color: 'var(--grey-400)' }}>
                  컷 없음
                </td>
              </tr>
            ) : (
              cuts.map((cut, cutIdx) => (
                <CutRow
                  key={cut.id}
                  cut={cut}
                  cutIdx={cutIdx}
                  epIdx={epIdx}
                  editable={editable}
                  onCutChange={onCutChange}
                  onCutDelete={onCutDelete}
                  onGeneratePrompt={onGeneratePrompt}
                  selected={selectedCuts.includes(cut.id)}
                  onSelectCut={onSelectCut}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
      <EndingCard ending={episode?.ending} />
    </div>
  );
}
