import { useState } from 'react';
import FixedValuesPanel from '../panels/FixedValuesPanel';
import VersionPanel from '../panels/VersionPanel';

const TABS = [
  { key: 'fixed',    label: '고정값', icon: '⚙️' },
  { key: 'episodes', label: '에피소드', icon: '🎬' },
  { key: 'versions', label: '버전',   icon: '🕐' },
];

export default function Sidebar({
  project, setProject, updateFixedValues,
  versions, saveVersion, loadVersion, deleteVersion, exportVersionsJSON, importVersionsJSON,
}) {
  const [activeSection, setActiveSection] = useState('fixed');

  return (
    <div style={{
      width: '252px',
      flexShrink: 0,
      borderRight: '1px solid var(--tds-border)',
      backgroundColor: 'var(--tds-surface)',
      display: 'flex',
      flexDirection: 'column',
      minHeight: 'calc(100vh - 104px)',
      position: 'sticky',
      top: '104px',
      height: 'calc(100vh - 104px)',
      overflowY: 'auto',
    }}>
      {/* Sidebar tab bar */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--tds-border)',
        padding: '0 4px',
        gap: '2px',
      }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveSection(tab.key)}
            style={{
              flex: 1,
              padding: '11px 4px',
              background: 'none',
              border: 'none',
              borderBottom: activeSection === tab.key
                ? '2px solid var(--tds-blue)'
                : '2px solid transparent',
              fontSize: '11px',
              fontWeight: activeSection === tab.key ? '700' : '500',
              color: activeSection === tab.key ? 'var(--tds-blue)' : 'var(--tds-text-3)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.15s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
            }}
          >
            <span style={{ fontSize: '14px' }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {activeSection === 'fixed' && (
          <FixedValuesPanel fixedValues={project.fixedValues} updateFixedValues={updateFixedValues} />
        )}
        {activeSection === 'episodes' && (
          <EpisodeList episodes={project.episodes} />
        )}
        {activeSection === 'versions' && (
          <VersionPanel
            project={project}
            versions={versions}
            saveVersion={saveVersion}
            loadVersion={loadVersion}
            deleteVersion={deleteVersion}
            exportVersionsJSON={exportVersionsJSON}
            importVersionsJSON={importVersionsJSON}
            setProject={setProject}
          />
        )}
      </div>
    </div>
  );
}

function EpisodeList({ episodes }) {
  if (!episodes || episodes.length === 0) {
    return (
      <div style={{ padding: '20px 16px', color: 'var(--tds-text-3)', fontSize: '14px', textAlign: 'center' }}>
        에피소드 없음
      </div>
    );
  }
  return (
    <div style={{ padding: '8px 0' }}>
      <div className="list-header" style={{ padding: '8px 16px 4px' }}>에피소드 목록</div>
      {episodes.map(ep => (
        <div key={ep.id} className="list-row" style={{ cursor: 'default' }}>
          <div>
            <div className="list-row-title" style={{ fontSize: '14px' }}>{ep.id} {ep.title}</div>
            <div className="list-row-desc">{(ep.cuts || []).length}컷</div>
          </div>
          <span className="badge badge-grey">{(ep.cuts || []).length}</span>
        </div>
      ))}
    </div>
  );
}
