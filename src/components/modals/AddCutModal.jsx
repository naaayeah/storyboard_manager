import { useState } from 'react';

const EMPTY_CUT = {
  situation: '',
  camera: '',
  lens: '',
  composition: '',
  background: '',
  lighting: '',
  dialogue: '',
  emotion: 'null',
  isKey: false,
};

export default function AddCutModal({ onAdd, onClose }) {
  const [form, setForm] = useState({ ...EMPTY_CUT });

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    onAdd(form);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <span style={{ fontWeight: '700', fontSize: '14px' }}>새 컷 추가</span>
          <button className="btn-ghost" onClick={onClose} style={{ color: 'var(--grey-400)', fontSize: '18px' }}>✕</button>
        </div>
        <div className="modal-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="label-base">카메라</label>
              <input className="input-base" type="text" value={form.camera} onChange={e => update('camera', e.target.value)} placeholder="예: Static shot" />
            </div>
            <div>
              <label className="label-base">렌즈</label>
              <input className="input-base" type="text" value={form.lens} onChange={e => update('lens', e.target.value)} placeholder="예: 85mm f/1.4" />
            </div>
          </div>
          <div style={{ marginTop: '12px' }}>
            <label className="label-base">상황</label>
            <textarea className="input-base" value={form.situation} onChange={e => update('situation', e.target.value)} rows={3} placeholder="씬 상황 설명..." style={{ resize: 'vertical' }} />
          </div>
          <div style={{ marginTop: '12px' }}>
            <label className="label-base">구도</label>
            <input className="input-base" type="text" value={form.composition} onChange={e => update('composition', e.target.value)} />
          </div>
          <div style={{ marginTop: '12px' }}>
            <label className="label-base">배경</label>
            <input className="input-base" type="text" value={form.background} onChange={e => update('background', e.target.value)} />
          </div>
          <div style={{ marginTop: '12px' }}>
            <label className="label-base">라이팅</label>
            <input className="input-base" type="text" value={form.lighting} onChange={e => update('lighting', e.target.value)} />
          </div>
          <div style={{ marginTop: '12px' }}>
            <label className="label-base">대사</label>
            <input className="input-base" type="text" value={form.dialogue} onChange={e => update('dialogue', e.target.value)} placeholder="없으면 비워두세요" />
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '12px', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <label className="label-base">감정</label>
              <select className="input-base" value={form.emotion} onChange={e => update('emotion', e.target.value)} style={{ cursor: 'pointer' }}>
                <option value="null">없음</option>
                <option value="shock">쇼크</option>
                <option value="anger">분노</option>
                <option value="freeze">프리즈</option>
                <option value="panic">패닉</option>
              </select>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', paddingTop: '20px' }}>
              <input
                type="checkbox"
                checked={form.isKey}
                onChange={e => update('isKey', e.target.checked)}
                style={{ accentColor: 'var(--accent)' }}
              />
              <span style={{ fontSize: '13px', fontWeight: '600' }}>KEY 컷</span>
            </label>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>취소</button>
          <button className="btn-primary" onClick={handleSubmit}>추가</button>
        </div>
      </div>
    </div>
  );
}
