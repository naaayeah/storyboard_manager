import { useRef, useState } from 'react';

export default function ImageUploadPanel({ label, imageUrl, imageBase64, onImage, onAnalyze, analyzing }) {
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef(null);

  const processFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => {
      const dataUrl = e.target.result;
      const base64 = dataUrl.split(',')[1];
      onImage({ imageUrl: dataUrl, imageBase64: base64, mediaType: file.type });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  return (
    <div>
      {label && <label className="label-base" style={{ marginBottom: '6px' }}>{label}</label>}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        style={{
          border: `2px dashed ${dragging ? 'var(--accent)' : 'var(--grey-200)'}`,
          backgroundColor: dragging ? '#fff8f7' : 'var(--grey-100)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80px',
          position: 'relative',
          overflow: 'hidden',
          transition: 'border-color 0.15s',
        }}
      >
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt="uploaded"
              style={{ width: '100%', maxHeight: '120px', objectFit: 'cover', display: 'block' }}
            />
            <div style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', padding: '2px 6px', fontSize: '10px', color: 'white' }}>
              클릭하여 변경
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--grey-400)', fontSize: '12px', padding: '12px' }}>
            <div style={{ fontSize: '20px', marginBottom: '4px' }}>↑</div>
            이미지를 드래그하거나 클릭하여 업로드
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={e => processFile(e.target.files[0])}
        />
      </div>
      {imageUrl && onAnalyze && (
        <button
          className="btn-secondary"
          onClick={onAnalyze}
          disabled={analyzing}
          style={{ width: '100%', marginTop: '6px', justifyContent: 'center', fontSize: '12px' }}
        >
          {analyzing ? <><span className="spinner" /> 분석 중...</> : '이미지로 자동 생성'}
        </button>
      )}
    </div>
  );
}
