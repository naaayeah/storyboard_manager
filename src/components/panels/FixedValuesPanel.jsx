import { useState } from 'react';
import { useClaudeAPI } from '../../hooks/useClaudeAPI';
import ImageUploadPanel from './ImageUploadPanel';

const CHARACTER_VISION_SYSTEM = `당신은 씨댄스 2.0 드라마용 캐릭터 레퍼런스 분석 전문가입니다.
이미지를 보고 영상 프롬프트에 사용할 정확한 외모/의상 묘사를 작성하세요.
반드시 JSON 형식으로만 응답하세요. 마크다운 없이 순수 JSON.`;

const BG_VISION_SYSTEM = `당신은 배경 레퍼런스 분석 전문가입니다.
이미지를 보고 영상 프롬프트에 사용할 정확한 배경 묘사를 작성하세요.
반드시 JSON 형식으로만 응답하세요. 마크다운 없이 순수 JSON.`;

function FieldRow({ label, value, onChange, multiline = false }) {
  return (
    <div style={{ marginBottom: '8px' }}>
      <label className="label-base">{label}</label>
      {multiline ? (
        <textarea
          className="input-base"
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          rows={3}
          style={{ resize: 'vertical', fontSize: '12px' }}
        />
      ) : (
        <input
          className="input-base"
          type="text"
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          style={{ fontSize: '12px' }}
        />
      )}
    </div>
  );
}

function CharacterSection({ charKey, char, onUpdate, callClaude, loading }) {
  const [analyzing, setAnalyzing] = useState(false);

  const updateField = (field, value) => {
    onUpdate({ [field]: value });
  };

  const handleImageAnalyze = async () => {
    if (!char.imageBase64) return;
    setAnalyzing(true);
    try {
      const result = await callClaude({
        system: CHARACTER_VISION_SYSTEM,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: char.mediaType || 'image/jpeg', data: char.imageBase64 },
            },
            {
              type: 'text',
              text: `이 캐릭터 레퍼런스 이미지를 분석해서 아래 JSON 형식으로만 응답해줘:
{
  "face": "얼굴형/피부/특징 상세 묘사 (영문)",
  "hair": "헤어스타일 길이/컬러/스타일 상세 (영문)",
  "eyes": "#헥스코드 · East Asian eye shape 묘사 (영문)",
  "outfit": "의상 소재/컬러/핏/악세서리 상세 (영문)",
  "energy": "전체 인상과 에너지 한 줄 (한글)"
}`,
            },
          ],
        }],
        maxTokens: 800,
        isJson: true,
      });
      onUpdate({ face: result.face, hair: result.hair, eyes: result.eyes, outfit: result.outfit, energy: result.energy });
    } catch (e) {
      alert(`분석 오류: ${e.message}`);
    }
    setAnalyzing(false);
  };

  return (
    <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: 'var(--grey-100)', border: '1px solid var(--grey-200)' }}>
      <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent)', letterSpacing: '0.05em', marginBottom: '10px', textTransform: 'uppercase' }}>
        캐릭터 {charKey}
      </div>
      <ImageUploadPanel
        label="레퍼런스 이미지"
        imageUrl={char.imageUrl}
        imageBase64={char.imageBase64}
        onImage={(imgData) => onUpdate(imgData)}
        onAnalyze={char.imageBase64 ? handleImageAnalyze : null}
        analyzing={analyzing}
      />
      <div style={{ marginTop: '10px' }}>
        <FieldRow label="이름" value={char.name} onChange={v => updateField('name', v)} />
        <FieldRow label="역할" value={char.role} onChange={v => updateField('role', v)} />
        <FieldRow label="Face" value={char.face} onChange={v => updateField('face', v)} multiline />
        <FieldRow label="Hair" value={char.hair} onChange={v => updateField('hair', v)} />
        <FieldRow label="Eyes" value={char.eyes} onChange={v => updateField('eyes', v)} />
        <FieldRow label="Outfit" value={char.outfit} onChange={v => updateField('outfit', v)} multiline />
        <FieldRow label="에너지" value={char.energy} onChange={v => updateField('energy', v)} />
      </div>
    </div>
  );
}

export default function FixedValuesPanel({ fixedValues, updateFixedValues }) {
  const { callClaude, loading } = useClaudeAPI();
  const [bgAnalyzing, setBgAnalyzing] = useState(false);

  const updateChar = (key, updates) => {
    updateFixedValues({
      characters: {
        ...fixedValues.characters,
        [key]: { ...fixedValues.characters[key], ...updates },
      },
    });
  };

  const updateStyle = (field, value) => {
    updateFixedValues({ style: { ...fixedValues.style, [field]: value } });
  };

  const updateBg = (updates) => {
    updateFixedValues({ background: { ...fixedValues.background, ...updates } });
  };

  const updateLighting = (field, value) => {
    updateFixedValues({ lighting: { ...fixedValues.lighting, [field]: value } });
  };

  const handleBgAnalyze = async () => {
    const bg = fixedValues.background;
    if (!bg?.imageBase64) return;
    setBgAnalyzing(true);
    try {
      const result = await callClaude({
        system: BG_VISION_SYSTEM,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: bg.mediaType || 'image/jpeg', data: bg.imageBase64 },
            },
            {
              type: 'text',
              text: `이 배경 레퍼런스 이미지를 분석해서 아래 JSON 형식으로만 응답해줘:
{
  "location": "장소 전체 설명 (영문)",
  "ground": "지면/바닥 재질/색상 (영문)",
  "props": "소품/가구/표지판 등 (영문)",
  "kids": "배경 인물 묘사 (영문, 해당 없으면 빈 문자열)",
  "time": "시간대/조명 상황 (영문)"
}`,
            },
          ],
        }],
        maxTokens: 600,
        isJson: true,
      });
      updateBg({
        location: result.location,
        ground: result.ground,
        props: result.props,
        kids: result.kids,
        time: result.time,
      });
    } catch (e) {
      alert(`분석 오류: ${e.message}`);
    }
    setBgAnalyzing(false);
  };

  const fv = fixedValues;
  const bg = fv.background || {};
  const style = fv.style || {};
  const lighting = fv.lighting || {};

  return (
    <div style={{ padding: '12px' }}>
      {/* Characters */}
      <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--grey-600)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
        캐릭터
      </div>
      {['A', 'B'].map(key => (
        <CharacterSection
          key={key}
          charKey={key}
          char={(fv.characters || {})[key] || {}}
          onUpdate={(updates) => updateChar(key, updates)}
          callClaude={callClaude}
          loading={loading}
        />
      ))}

      {/* Background */}
      <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--grey-600)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', marginTop: '4px' }}>
        배경
      </div>
      <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: 'var(--grey-100)', border: '1px solid var(--grey-200)' }}>
        <ImageUploadPanel
          label="배경 이미지"
          imageUrl={bg.imageUrl}
          imageBase64={bg.imageBase64}
          onImage={(imgData) => updateBg(imgData)}
          onAnalyze={bg.imageBase64 ? handleBgAnalyze : null}
          analyzing={bgAnalyzing}
        />
        <div style={{ marginTop: '10px' }}>
          <FieldRow label="Location" value={bg.location} onChange={v => updateBg({ location: v })} multiline />
          <FieldRow label="Ground" value={bg.ground} onChange={v => updateBg({ ground: v })} />
          <FieldRow label="Props" value={bg.props} onChange={v => updateBg({ props: v })} multiline />
          <FieldRow label="Kids/BGCharacters" value={bg.kids} onChange={v => updateBg({ kids: v })} />
          <FieldRow label="Time" value={bg.time} onChange={v => updateBg({ time: v })} />
        </div>
      </div>

      {/* Fixed Style */}
      <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--grey-600)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
        Fixed Style
      </div>
      <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: 'var(--grey-100)', border: '1px solid var(--grey-200)' }}>
        <FieldRow label="Quality" value={style.quality} onChange={v => updateStyle('quality', v)} multiline />
        <FieldRow label="Prohibit" value={style.prohibit} onChange={v => updateStyle('prohibit', v)} multiline />
        <FieldRow label="Motion" value={style.motion} onChange={v => updateStyle('motion', v)} multiline />
        <FieldRow label="Ratio" value={style.ratio} onChange={v => updateStyle('ratio', v)} />
      </div>

      {/* Lighting */}
      <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--grey-600)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
        고정 라이팅
      </div>
      <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: 'var(--grey-100)', border: '1px solid var(--grey-200)' }}>
        <FieldRow label="Outdoor" value={lighting.outdoor} onChange={v => updateLighting('outdoor', v)} multiline />
        <FieldRow label={`캐릭터 A (${(fv.characters?.A?.name) || 'A'})`} value={lighting.charA} onChange={v => updateLighting('charA', v)} multiline />
        <FieldRow label={`캐릭터 B (${(fv.characters?.B?.name) || 'B'})`} value={lighting.charB} onChange={v => updateLighting('charB', v)} multiline />
      </div>
    </div>
  );
}
