import { useRef } from 'react';

const EMOTION_MAP = {
  shock: '쇼크',
  anger: '분노',
  freeze: '프리즈',
  panic: '패닉',
  null: '-',
  '': '-',
};

function EmotionBadge({ emotion }) {
  const val = emotion || 'null';
  const label = EMOTION_MAP[val] || val;
  return (
    <span className={`emotion-badge emotion-${val}`}>{label}</span>
  );
}

function EditableCell({ value, onChange, multiline = false, style = {} }) {
  if (multiline) {
    return (
      <div
        contentEditable
        suppressContentEditableWarning
        className="editable-cell"
        onBlur={e => onChange(e.target.innerText)}
        style={{ minWidth: '60px', ...style }}
        dangerouslySetInnerHTML={{ __html: value || '' }}
      />
    );
  }
  return (
    <div
      contentEditable
      suppressContentEditableWarning
      className="editable-cell"
      onBlur={e => onChange(e.target.innerText)}
      style={{ minWidth: '40px', whiteSpace: 'nowrap', ...style }}
      dangerouslySetInnerHTML={{ __html: value || '' }}
    />
  );
}

export default function CutRow({
  cut,
  cutIdx,
  epIdx,
  editable,
  onCutChange,
  onCutDelete,
  onGeneratePrompt,
  selected,
  onSelectCut,
  onDragStart,
  onDragOver,
  onDrop,
}) {
  const rowRef = useRef(null);

  const handleChange = (field, value) => {
    if (onCutChange) onCutChange(epIdx, cutIdx, field, value);
  };

  const handleEmotionChange = (e) => {
    handleChange('emotion', e.target.value);
  };

  const isKey = Boolean(cut.isKey);

  return (
    <tr
      ref={rowRef}
      draggable={editable}
      onDragStart={e => onDragStart && onDragStart(e, cutIdx)}
      onDragOver={e => { e.preventDefault(); onDragOver && onDragOver(e, cutIdx); }}
      onDrop={e => onDrop && onDrop(e, cutIdx)}
      style={{
        backgroundColor: selected ? '#fff8f7' : isKey ? '#fffdf5' : undefined,
        opacity: 1,
      }}
    >
      {/* Drag + checkbox */}
      {editable && (
        <td style={{ width: '40px', padding: '6px 4px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <span className="drag-handle" title="드래그하여 순서 변경">⠿</span>
            <input
              type="checkbox"
              checked={selected}
              onChange={() => onSelectCut && onSelectCut(cut.id)}
              style={{ accentColor: 'var(--accent)', cursor: 'pointer' }}
            />
          </div>
        </td>
      )}

      {/* Scene # */}
      <td style={{ width: '36px', textAlign: 'center' }}>
        <span className="mono" style={{ fontSize: '11px', color: 'var(--grey-400)' }}>{cut.scene}</span>
      </td>

      {/* Cut ID */}
      <td style={{ width: '80px' }}>
        <span className="mono" style={{ fontSize: '11px', color: 'var(--grey-600)' }}>{cut.id}</span>
        <div style={{ display: 'flex', gap: '2px', marginTop: '3px', flexWrap: 'wrap' }}>
          {isKey && <span className="key-badge">KEY</span>}
          <EmotionBadge emotion={cut.emotion} />
        </div>
      </td>

      {/* Situation */}
      <td>
        {editable ? (
          <EditableCell value={cut.situation} onChange={v => handleChange('situation', v)} multiline />
        ) : (
          <span style={{ lineHeight: 1.5 }}>{cut.situation}</span>
        )}
      </td>

      {/* Camera */}
      <td style={{ minWidth: '100px' }}>
        {editable ? (
          <>
            <EditableCell value={cut.camera} onChange={v => handleChange('camera', v)} />
            <EditableCell value={cut.lens} onChange={v => handleChange('lens', v)} style={{ fontSize: '11px', color: 'var(--grey-400)', marginTop: '2px' }} />
          </>
        ) : (
          <>
            <div>{cut.camera}</div>
            <div style={{ fontSize: '11px', color: 'var(--grey-400)' }}>{cut.lens}</div>
          </>
        )}
      </td>

      {/* Composition */}
      <td>
        {editable ? (
          <EditableCell value={cut.composition} onChange={v => handleChange('composition', v)} multiline />
        ) : (
          <span>{cut.composition}</span>
        )}
      </td>

      {/* Background */}
      <td>
        {editable ? (
          <EditableCell value={cut.background} onChange={v => handleChange('background', v)} multiline />
        ) : (
          <span>{cut.background}</span>
        )}
      </td>

      {/* Lighting */}
      <td style={{ minWidth: '80px' }}>
        {editable ? (
          <EditableCell value={cut.lighting} onChange={v => handleChange('lighting', v)} multiline />
        ) : (
          <span>{cut.lighting}</span>
        )}
      </td>

      {/* Dialogue */}
      <td style={{ minWidth: '100px' }}>
        {editable ? (
          <EditableCell value={cut.dialogue} onChange={v => handleChange('dialogue', v)} multiline />
        ) : (
          <span style={{ fontStyle: cut.dialogue ? 'italic' : 'normal', color: cut.dialogue ? 'var(--ink)' : 'var(--grey-400)' }}>
            {cut.dialogue || '—'}
          </span>
        )}
      </td>

      {/* Emotion (editable select) / isKey toggle */}
      {editable && (
        <td style={{ width: '100px' }}>
          <select
            value={cut.emotion || 'null'}
            onChange={handleEmotionChange}
            style={{ fontSize: '11px', padding: '2px 4px', backgroundColor: 'var(--grey-100)', border: '1px solid var(--grey-200)', cursor: 'pointer', width: '100%', fontFamily: 'Noto Sans KR, sans-serif' }}
          >
            <option value="null">-</option>
            <option value="shock">쇼크</option>
            <option value="anger">분노</option>
            <option value="freeze">프리즈</option>
            <option value="panic">패닉</option>
          </select>
          <label style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', cursor: 'pointer', fontSize: '11px', color: 'var(--grey-600)' }}>
            <input
              type="checkbox"
              checked={isKey}
              onChange={e => handleChange('isKey', e.target.checked)}
              style={{ accentColor: 'var(--accent)' }}
            />
            KEY
          </label>
        </td>
      )}

      {/* Actions */}
      {editable && (
        <td style={{ width: '70px', textAlign: 'center' }}>
          <button
            className="btn-ghost"
            onClick={() => onGeneratePrompt && onGeneratePrompt(cut)}
            title="이 컷 프롬프트 생성"
            style={{ fontSize: '16px', padding: '2px 6px' }}
          >
            ⚡
          </button>
          <button
            className="btn-ghost"
            onClick={() => onCutDelete && onCutDelete(epIdx, cutIdx)}
            title="삭제"
            style={{ color: 'var(--accent)', fontSize: '13px', padding: '2px 6px' }}
          >
            ✕
          </button>
        </td>
      )}
    </tr>
  );
}
