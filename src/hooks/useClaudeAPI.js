import { useState } from 'react';

const extractJson = (text) => {
  // Remove markdown fences
  let clean = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();

  // Try direct parse first
  try { return JSON.parse(clean); } catch {}

  // Find the outermost { ... } or [ ... ] block
  const objMatch = clean.match(/\{[\s\S]*\}/);
  if (objMatch) { try { return JSON.parse(objMatch[0]); } catch {} }

  const arrMatch = clean.match(/\[[\s\S]*\]/);
  if (arrMatch) { try { return JSON.parse(arrMatch[0]); } catch {} }

  throw new Error('응답을 파싱할 수 없습니다. 다시 시도해주세요.');
};

export const useClaudeAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [streamText, setStreamText] = useState('');

  const callClaude = async ({
    system,
    messages,
    maxTokens = 1000,
    isJson = false,
    onStream,        // optional (text) => void callback
  }) => {
    setLoading(true);
    setError(null);
    setStreamText('');

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
          stream: true,
          system,
          messages,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err?.error?.message || `HTTP ${response.status}`);
      }

      const reader  = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText  = '';
      let buf       = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buf += decoder.decode(value, { stream: true });
        const lines = buf.split('\n');
        buf = lines.pop(); // keep incomplete last line

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (raw === '[DONE]') continue;
          try {
            const evt = JSON.parse(raw);
            if (evt.type === 'content_block_delta' && evt.delta?.type === 'text_delta') {
              fullText += evt.delta.text;
              setStreamText(fullText);
              onStream?.(fullText);
            }
          } catch {}
        }
      }

      if (isJson) return extractJson(fullText);
      return fullText;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { callClaude, loading, error, streamText };
};
