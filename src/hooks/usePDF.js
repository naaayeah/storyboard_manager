import { useCallback } from 'react';
import { exportToPDF } from '../utils/pdfExporter';

export const usePDF = (project) => {
  const generatePDF = useCallback(async (options = {}) => {
    await exportToPDF(project, options);
  }, [project]);

  return { generatePDF };
};
