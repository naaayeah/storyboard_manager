const STEPS = [
  { num: 1, label: '스토리 입력' },
  { num: 2, label: '시나리오' },
  { num: 3, label: '스토리보드 확인' },
  { num: 4, label: '편집' },
  { num: 5, label: '프롬프트 생성' },
];

export default function StepBar({ currentStep, goToStep }) {
  return (
    <div style={{
      backgroundColor: 'var(--tds-surface)',
      borderBottom: '1px solid var(--tds-border)',
      position: 'sticky',
      top: '52px',
      zIndex: 90,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 20px',
        gap: '4px',
        overflowX: 'auto',
      }}>
        {STEPS.map((step, i) => {
          const isActive = step.num === currentStep;
          const isPast   = step.num < currentStep;
          const canClick = isPast;

          return (
            <button
              key={step.num}
              onClick={() => canClick && goToStep(step.num)}
              disabled={!canClick && !isActive}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                padding: '14px 12px',
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '2px solid var(--tds-blue)' : '2px solid transparent',
                cursor: canClick ? 'pointer' : 'default',
                flexShrink: 0,
                transition: 'border-color 0.15s',
              }}
            >
              <span style={{
                width: '20px', height: '20px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '10px', fontWeight: '700', flexShrink: 0,
                backgroundColor: isActive
                  ? 'var(--tds-blue)'
                  : isPast
                  ? '#191919'
                  : 'var(--tds-border)',
                color: isActive || isPast ? 'white' : 'var(--tds-text-4)',
              }}>
                {isPast ? '✓' : step.num}
              </span>
              <span style={{
                fontSize: '13px',
                fontWeight: isActive ? '700' : '500',
                color: isActive
                  ? 'var(--tds-blue)'
                  : isPast
                  ? 'var(--tds-text-1)'
                  : 'var(--tds-text-4)',
                whiteSpace: 'nowrap',
              }}>
                {step.label}
              </span>
              {i < STEPS.length - 1 && (
                <span style={{ color: 'var(--tds-border-dark)', fontSize: '11px', marginLeft: '6px' }}>›</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
