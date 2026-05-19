/**
 * Build system prompt for single/multi cut generation
 */
export const buildSystemPrompt = (fixedValues) => {
  const { characters, style, background, lighting } = fixedValues;
  const charA = characters?.A || {};
  const charB = characters?.B || {};

  return `당신은 씨댄스 2.0(CiDance 2.0)용 숏츠 드라마 영상 프롬프트 전문가입니다.
아래 고정값(캐릭터/배경/스타일/라이팅)을 항상 그대로 사용하여
각 컷의 완성형 씨댄스 프롬프트를 생성하세요.

【CHARACTER A — ${charA.name || 'A'} (${charA.role || ''})】
외모: ${charA.face || '미설정'}
Hair: ${charA.hair || '미설정'}
Eyes: ${charA.eyes || '미설정'}
의상: ${charA.outfit || '미설정'}
에너지: ${charA.energy || '미설정'}

【CHARACTER B — ${charB.name || 'B'} (${charB.role || ''})】
외모: ${charB.face || '미설정'}
Hair: ${charB.hair || '미설정'}
Eyes: ${charB.eyes || '미설정'}
의상: ${charB.outfit || '미설정'}
에너지: ${charB.energy || '미설정'}

【FIXED STYLE】
${style?.quality || ''}
${style?.prohibit || ''}
${style?.motion || ''}
Aspect Ratio: ${style?.ratio || '9:16 vertical · 4s per cut'}

【FIXED BACKGROUND】
Location: ${background?.location || '미설정'}
Ground: ${background?.ground || '미설정'}
Props: ${background?.props || '미설정'}
Kids: ${background?.kids || '미설정'}
Time: ${background?.time || '미설정'}

【FIXED LIGHTING】
Outdoor: ${lighting?.outdoor || '미설정'}
${charA.name || 'A'}: ${lighting?.charA || '미설정'}
${charB.name || 'B'}: ${lighting?.charB || '미설정'}`;
};

/**
 * Build user prompt for a single cut
 */
export const buildSingleCutPrompt = (cut) => {
  return `아래 컷 정보로 씨댄스 2.0 완성형 프롬프트를 생성해줘.

컷 ID: ${cut.id}
상황: ${cut.situation || ''}
카메라: ${cut.camera || ''} / 렌즈: ${cut.lens || ''}
구도: ${cut.composition || ''}
배경: ${cut.background || ''}
라이팅: ${cut.lighting || ''}
대사: ${cut.dialogue || '없음'}

출력 형식:
## ${cut.id}
### [씬명] — [내용 한 줄 요약]

【Character Reference】(고정값 전체)
【Style】(고정 스타일 전체)
【Fixed Setting & Lighting】(고정 배경/라이팅 전체)
【Aspect Ratio】9:16 【Duration】4s

[타임코드 — 4초]
0-1s    → 오프닝 샷
1-2.5s  → 메인 샷
2.5-3.5s → 반응 샷
3.5-4s  → 엔딩 처리

각 타임코드: [시작s-끝s]: 샷 종류 — 장소/상황. Lens: XXmm. 앵글.
인물 행동 묘사. 신체 반응 디테일. ${cut.dialogue ? '[DIALOGUE] 블록 포함.' : ''}

【Lighting】씬 특화 조명
엔딩: 블랙아웃 / 홀드 / 연결 중 선택`;
};

/**
 * Build user prompt for multiple cuts
 */
export const buildMultiCutPrompt = (cuts) => {
  const cutDetails = cuts.map((cut, i) => {
    return `[CUT ${String(i + 1).padStart(2, '0')} — ${cut.id}]
상황: ${cut.situation || ''}
카메라: ${cut.camera || ''} / 렌즈: ${cut.lens || ''}
구도: ${cut.composition || ''}
배경: ${cut.background || ''}
라이팅: ${cut.lighting || ''}
대사: ${cut.dialogue || '없음'}`;
  }).join('\n\n');

  return `아래 ${cuts.length}개 컷을 하나의 씬으로 통합한 씨댄스 2.0 완성형 프롬프트를 생성해줘.

포함 컷: ${cuts.map(c => c.id).join(', ')}

${cutDetails}

출력 규칙:
- 씬 전체를 하나의 프롬프트 블록으로 작성
- Character Reference / Style / Fixed Setting은 맨 처음 한 번만
- 이후 ## CUT 01, ## CUT 02... 로 구분하여 타임코드 구조만 반복`;
};
