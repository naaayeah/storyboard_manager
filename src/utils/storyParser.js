/**
 * Parse scenario JSON from Claude response and normalize to app format
 */
export const parseScenarioResponse = (data) => {
  if (!data) return null;
  return {
    synopsis: data.synopsis || '',
    characters: Array.isArray(data.characters) ? data.characters : [],
    episodes: Array.isArray(data.episodes) ? data.episodes : [],
    emotionArc: data.emotionArc || '',
    projectTitle: data.projectTitle || '',
    genre: data.genre || '',
  };
};

/**
 * Parse storyboard JSON from Claude response and normalize episodes/cuts
 */
export const parseStoryboardResponse = (data) => {
  if (!data || !Array.isArray(data.episodes)) return [];
  return data.episodes.map(ep => ({
    id: ep.id || `EP${Math.random().toString(36).substring(2, 6)}`,
    title: ep.title || '',
    cuts: Array.isArray(ep.cuts) ? ep.cuts.map(cut => normalizeCut(cut)) : [],
    ending: ep.ending || '',
  }));
};

export const normalizeCut = (cut) => ({
  id: cut.id || `CUT-${Math.random().toString(36).substring(2, 6)}`,
  scene: cut.scene || 1,
  situation: cut.situation || '',
  camera: cut.camera || '',
  lens: cut.lens || '',
  composition: cut.composition || '',
  background: cut.background || '',
  lighting: cut.lighting || '',
  dialogue: cut.dialogue || '',
  emotion: cut.emotion || 'null',
  isKey: Boolean(cut.isKey),
});

/**
 * Build scenario prompt components
 */
export const buildScenarioPromptComponents = (project) => {
  const { storyInput, title, genre, platform } = project;
  const characters = storyInput.characters
    .filter(c => c.name)
    .map(c => `${c.name} (${c.role || '역할 미정'})`)
    .join(', ') || '미정';
  const keywords = storyInput.keywords.join(', ') || '없음';
  const episodeCount = storyInput.episodeCount === 'auto' ? '자동 결정' : `${storyInput.episodeCount}화`;

  return { characters, keywords, episodeCount, title: title || '제목 없음', genre, platform, storyText: storyInput.text };
};
