import { useState } from 'react';

const extractJson = (text) => {
  if (!text || !text.trim()) throw new Error('빈 응답을 받았습니다.');

  // Remove markdown fences
  let clean = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();

  // Try direct parse
  try { return JSON.parse(clean); } catch {}

  // Find the outermost { ... } block (greedy — gets the largest match)
  const objStart = clean.indexOf('{');
  const objEnd   = clean.lastIndexOf('}');
  if (objStart !== -1 && objEnd > objStart) {
    try { return JSON.parse(clean.slice(objStart, objEnd + 1)); } catch {}
  }

  // Find the outermost [ ... ] block
  const arrStart = clean.indexOf('[');
  const arrEnd   = clean.lastIndexOf(']');
  if (arrStart !== -1 && arrEnd > arrStart) {
    try { return JSON.parse(clean.slice(arrStart, arrEnd + 1)); } catch {}
  }

  console.error('[useClaudeAPI] JSON 파싱 실패. 수신 텍스트 (첫 500자):', clean.slice(0, 500));
  throw new Error('응답을 파싱할 수 없습니다. 콘솔을 확인해주세요.');
};

export const useClaudeAPI = () => {
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [streamText, setStreamText] = useState('');

  const callClaude = async ({
    system,
    messages,
    maxTokens = 1000,
    isJson = false,
    onStream,
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

      // Non-2xx: read body as JSON error
      if (!response.ok) {
        let msg = `HTTP ${response.status}`;
        try { const e = await response.json(); msg = e?.error?.message || msg; } catch {}
        throw new Error(msg);
      }

      const reader  = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText  = '';
      let buf       = '';
      let lastEvent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Handle both \n and \r\n line endings
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split(/\r?\n/);
        buf = lines.pop();

        for (const line of lines) {
          // Track event type
          if (line.startsWith('event: ')) {
            lastEvent = line.slice(7).trim();
            continue;
          }

          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (!raw || raw === '[DONE]') continue;

          let evt;
          try { evt = JSON.parse(raw); } catch { continue; }

          // SSE-level error from Anthropic
          if (evt.type === 'error') {
            throw new Error(evt.error?.message || '스트리밍 오류가 발생했습니다.');
          }

          if (evt.type === 'content_block_delta' && evt.delta?.type === 'text_delta') {
            fullText += evt.delta.text;
            setStreamText(fullText);
            onStream?.(fullText);
          }
        }
      }

      // Flush any remaining buffer
      if (buf.trim().startsWith('data: ')) {
        const raw = buf.trim().slice(6).trim();
        try {
          const evt = JSON.parse(raw);
          if (evt.type === 'content_block_delta' && evt.delta?.type === 'text_delta') {
            fullText += evt.delta.text;
          }
        } catch {}
      }

      console.log('[useClaudeAPI] 수신 완료. 길이:', fullText.length, '/ isJson:', isJson);

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
