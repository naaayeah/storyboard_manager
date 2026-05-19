import { useState, useCallback } from 'react';

const VERSIONS_KEY = 'cidance_versions';

export const useVersions = (project) => {
  const [versions, setVersions] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(VERSIONS_KEY)) || [];
    } catch { return []; }
  });

  const saveVersion = useCallback((name) => {
    const newVersion = {
      id: `v${Date.now()}`,
      name: name || `버전 ${new Date().toLocaleString('ko-KR')}`,
      createdAt: new Date().toISOString(),
      cutCount: project.episodes.reduce((acc, ep) => acc + (ep.cuts ? ep.cuts.length : 0), 0),
      fixedValues: JSON.parse(JSON.stringify(project.fixedValues)),
      episodes: JSON.parse(JSON.stringify(project.episodes)),
    };
    setVersions(prev => {
      const updated = [newVersion, ...prev];
      localStorage.setItem(VERSIONS_KEY, JSON.stringify(updated));
      return updated;
    });
    return newVersion;
  }, [project]);

  const loadVersion = useCallback((versionId) => {
    return versions.find(v => v.id === versionId);
  }, [versions]);

  const deleteVersion = useCallback((versionId) => {
    setVersions(prev => {
      const updated = prev.filter(v => v.id !== versionId);
      localStorage.setItem(VERSIONS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const exportVersionsJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify({ versions, project }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title || 'project'}_versions.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [versions, project]);

  const importVersionsJSON = useCallback((file, onSuccess) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.versions) {
          setVersions(data.versions);
          localStorage.setItem(VERSIONS_KEY, JSON.stringify(data.versions));
          onSuccess && onSuccess(data);
        }
      } catch (err) {
        console.error('Import failed:', err);
      }
    };
    reader.readAsText(file);
  }, []);

  return { versions, saveVersion, loadVersion, deleteVersion, exportVersionsJSON, importVersionsJSON };
};
