const generateId = () => Math.random().toString(36).substring(2, 10);

export const createEmptyProject = () => ({
  id: generateId(),
  title: '',
  genre: '숏츠 드라마',
  platform: '유튜브 숏츠',
  createdAt: new Date().toISOString(),
  step: 1,
  storyInput: {
    text: '',
    characters: [],
    keywords: [],
    episodeCount: 2,
  },
  scenario: {
    synopsis: '',
    characters: [],
    episodes: [],
    emotionArc: '',
  },
  fixedValues: {
    characters: {
      A: { name: '', role: '', imageUrl: null, imageBase64: null, face: '', hair: '', eyes: '', outfit: '', energy: '' },
      B: { name: '', role: '', imageUrl: null, imageBase64: null, face: '', hair: '', eyes: '', outfit: '', energy: '' },
    },
    style: {
      quality: 'Ultra-realistic quality, realistic contemporary setting, clean sharp cinematography, natural color grade, slight soap opera sheen.',
      prohibit: 'No fantasy elements. No subtitles. No text overlays. No watermarks. Clean frame only.',
      motion: 'Real subtle chest rise and fall synchronized with breathing. Extremely natural subtle movements, micro-expressions, eye tension throughout.',
      ratio: '9:16 vertical · 4s per cut',
    },
    background: {
      imageUrl: null, imageBase64: null,
      location: '', ground: '', props: '', kids: '', grass: '', time: '',
    },
    lighting: { outdoor: '', charA: '', charB: '' },
  },
  episodes: [],
});
