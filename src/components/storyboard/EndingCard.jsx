export default function EndingCard({ ending }) {
  if (!ending) return null;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        backgroundColor: 'var(--ink)',
        color: 'var(--grey-100)',
        marginTop: '1px',
      }}
    >
      <span
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '11px',
          color: 'var(--grey-400)',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}
      >
        ENDING
      </span>
      <span style={{ fontSize: '14px', fontStyle: 'italic', color: 'var(--grey-100)' }}>
        {ending}
      </span>
    </div>
  );
}
