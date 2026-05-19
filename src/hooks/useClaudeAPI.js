import { useState } from 'react';
import {
  MOCK_SCENARIO,
  MOCK_STORYBOARD,
  MOCK_CHARACTER_VISION,
  MOCK_BACKGROUND_VISION,
  MOCK_PROMPT_TEXT,
} from '../data/mockResponses';

const isDemoMode = () => {
  const key = import.meta.env.VITE_ANTHROPIC_API_KEY;
  return !key || key === 'your_api_key_here' || key.trim() === '';
};

const getMockResponse = ({ system = '', isJson }) => {
  if (system.includes('시나리오 작가')) return isJson ? MOCK_SCENARIO : JSON.stringify(MOCK_SCENARIO);
  if (system.includes('스토리보드 전문가')) return isJson ? MOCK_STORYBOARD : JSON.stringify(MOCK_STORYBOARD);
  if (system.includes('캐릭터 레퍼런스 분석')) return isJson ? MOCK_CHARACTER_VISION : JSON.stringify(MOCK_CHARACTER_VISION);
  if (system.includes('배경 레퍼런스 이미지')) return isJson ? MOCK_BACKGROUND_VISION : JSON.stringify(MOCK_BACKGROUND_VISION);
  return isJson ? {} : MOCK_PROMPT_TEXT;
};

export const useClaudeAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callClaude = async ({ system, messages, maxTokens = 1000, isJson = false }) => {
    setLoading(true);
    setError(null);

    if (isDemoMode()) {
      await new Promise(r => setTimeout(r, 900));
      setLoading(false);
      return getMockResponse({ system, isJson });
    }

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: maxTokens,
          system,
          messages,
        }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      const text = data.content.map(b => b.text || '').join('');
      if (isJson) {
        const clean = text.replace(/```json|```/g, '').trim();
        return JSON.parse(clean);
      }
      return text;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { callClaude, loading, error, isDemo: isDemoMode() };
};
