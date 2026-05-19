import { useState } from 'react';

export const useClaudeAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callClaude = async ({ system, messages, maxTokens = 1000, isJson = false }) => {
    setLoading(true);
    setError(null);

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
          model: 'claude-sonnet-4-6',
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

  return { callClaude, loading, error };
};
