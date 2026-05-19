import { useState, useEffect, useCallback } from 'react';
import { createEmptyProject } from '../data/emptyProject';

const PROJECT_KEY = 'cidance_project';

export const useProject = () => {
  const [project, setProject] = useState(() => {
    try {
      const saved = localStorage.getItem(PROJECT_KEY);
      return saved ? JSON.parse(saved) : createEmptyProject();
    } catch {
      return createEmptyProject();
    }
  });

  useEffect(() => {
    localStorage.setItem(PROJECT_KEY, JSON.stringify(project));
  }, [project]);

  const updateProject = useCallback((updates) => {
    setProject(prev => ({ ...prev, ...updates }));
  }, []);

  const updateFixedValues = useCallback((updates) => {
    setProject(prev => ({
      ...prev,
      fixedValues: { ...prev.fixedValues, ...updates },
    }));
  }, []);

  const goToStep = useCallback((step) => {
    setProject(prev => ({ ...prev, step }));
  }, []);

  const resetProject = useCallback(() => {
    const fresh = createEmptyProject();
    setProject(fresh);
  }, []);

  return { project, setProject, updateProject, updateFixedValues, goToStep, resetProject };
};
