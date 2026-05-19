export default function EpisodeHeader({ episode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        backgroundColor: 'var(--ink)',
        color: 'var(--grey-100)',
      }}
    >
      <span
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '11px',
          fontWeight: '600',
          color: 'var(--accent)',
          letterSpacing: '0.05em',
        }}
      >
        {episode.id}
      </span>
      <span style={{ fontSize: '15px', fontWeight: '600' }}>{episode.title}</span>
      <span style={{ fontSize: '12px', color: 'var(--grey-400)', marginLeft: 'auto' }}>
        {(episode.cuts || []).length}컷
      </span>
    </div>
  );
}
