export const MOCK_SCENARIO = {
  projectTitle: "사랑의 온도차",
  genre: "로맨스",
  synopsis: "냉철한 외과의사 차준혁과 밝고 엉뚱한 간호사 오해린. 병원 옥상에서 벌어진 우연한 만남이 두 사람의 삶을 뒤흔든다. 서로를 밀어내면서도 결국 마음을 열어가는 사랑 이야기.",
  characters: [
    {
      id: "A",
      name: "차준혁",
      role: "외과의사 / 32세",
      description: "냉철하고 완벽주의적. 감정 표현에 서툴지만 속으로는 따뜻한 사람. 시선 하나로 상대를 압도하는 카리스마.",
      outfit: "흰 가운 / 남색 수술복. 항상 단정하게 정돈된 외모."
    },
    {
      id: "B",
      name: "오해린",
      role: "간호사 / 27세",
      description: "밝고 긍정적이지만 엉뚱한 매력이 있음. 힘든 상황에서도 웃음을 잃지 않는다. 준혁의 차가운 태도에 주눅 들지 않는 유일한 사람.",
      outfit: "하늘색 간호복. 머리핀으로 단발머리를 단정하게 정리."
    }
  ],
  episodes: [
    {
      id: "EP01",
      title: "옥상에서 생긴 일",
      coreConcept: "비 오는 옥상에서 충돌한 두 사람의 첫 만남",
      cliffhanger: "준혁이 해린의 손을 잡고 비를 피해 계단실로 끌고 들어가는 장면에서 컷",
      scenario: `[병원 옥상 - 비 오는 저녁]
준혁: (혼자 서서 빗속에 멍하니 서 있다)
해린: (우산을 들고 옥상 문을 열고 나온다) 어? 여기 계셨어요?
준혁: (차갑게) 보면 모르오.
해린: (움츠러들지 않고) 선생님, 빗속에 그냥 서 계시면 감기 걸려요.
준혁: 당신이 상관할 일 아니오.
해린: (갑자기 준혁 머리 위로 우산을 씌워준다) 저야 그렇지만... 선생님 내일 수술 있잖아요.
준혁: (당황해서 해린을 바라본다)
(바람에 우산이 뒤집히고, 두 사람 모두 비를 맞는다)
해린: 아... 죄송해요!
준혁: (한숨) 이리 와요. (해린 손을 잡고 계단실로 이동)`
    },
    {
      id: "EP02",
      title: "닫힌 문 안에서",
      coreConcept: "엘리베이터에 갇힌 두 사람이 서로의 속마음을 알게 되다",
      cliffhanger: "엘리베이터 불이 꺼지고 해린이 무서워서 준혁의 팔을 꽉 잡는 순간",
      scenario: `[병원 엘리베이터 - 낮]
(준혁과 해린, 엘리베이터에 함께 탄다. 어색한 침묵.)
해린: (조용히) 어제... 감사했어요.
준혁: (눈도 안 마주치고) 됐어요.
해린: 그래도요. (작게 웃는다)
(갑자기 엘리베이터 멈춤)
해린: 네?
준혁: (버튼 눌러봄) 고장이오.
해린: (목소리 떨림) 혹시... 오래 걸려요?
준혁: (해린 표정 보고) 폐소공포증이오?
해린: (억지로 웃음) 아니, 그냥... 조금.
준혁: (가방에서 물 꺼내 건넨다) 마셔요.
(조명이 깜빡이다 꺼진다)
해린: (반사적으로 준혁 팔을 꽉 잡는다)`
    }
  ],
  emotionArc: "EP01 설렘과 충돌 → EP02 취약함과 신뢰 형성 → 감정이 서서히 열리는 구조"
};

export const MOCK_STORYBOARD = {
  episodes: [
    {
      id: "EP01",
      title: "옥상에서 생긴 일",
      cuts: [
        {
          id: "EP01-C01",
          scene: 1,
          situation: "비 오는 병원 옥상. 준혁이 혼자 빗속에 서서 도시를 내려다보고 있다. 표정은 공허하고 지쳐 있다.",
          camera: "Slow tracking shot — 뒤에서 앞으로 천천히 접근",
          lens: "85mm",
          composition: "피사체 중앙, 배경 도시 불빛 보케",
          background: "병원 옥상 난간, 야경, 빗줄기",
          lighting: "자연 우천 / 도시 불빛 리플렉션",
          dialogue: "",
          emotion: "null",
          isKey: false
        },
        {
          id: "EP01-C02",
          scene: 1,
          situation: "옥상 문이 삐걱 열리며 해린이 우산을 들고 나온다. 준혁을 발견하고 멈칫한다.",
          camera: "미디엄 샷 — 문에서 나오는 해린 정면",
          lens: "35mm",
          composition: "문을 중심으로 해린, 배경에 준혁 실루엣",
          background: "병원 옥상 문, 빗속 배경",
          lighting: "내부 복도 빛 역광 + 빗속 자연광",
          dialogue: "오해린: 어? 여기 계셨어요?",
          emotion: "null",
          isKey: false
        },
        {
          id: "EP01-C03",
          scene: 1,
          situation: "준혁이 차갑게 해린을 돌아본다. 눈빛에 '왜 왔어'라는 감정이 역력하다.",
          camera: "클로즈업 — 준혁 얼굴",
          lens: "85mm",
          composition: "얼굴 2/3 프레임, 빗물이 흐르는 뺨",
          background: "빗속 블러 처리된 야경",
          lighting: "차가운 블루 톤 자연광",
          dialogue: "차준혁: 보면 모르오.",
          emotion: "null",
          isKey: false
        },
        {
          id: "EP01-C04",
          scene: 1,
          situation: "해린이 준혁 앞으로 다가가 우산을 씌워준다. 준혁이 당황한 표정을 짓는다.",
          camera: "투 샷 — 사이드에서",
          lens: "50mm",
          composition: "두 사람 프레임 중앙, 우산 아래 작은 공간",
          background: "빗속 옥상, 도시 야경",
          lighting: "우산 아래 따뜻한 스킨 라이팅",
          dialogue: "오해린: 선생님 내일 수술 있잖아요.",
          emotion: "null",
          isKey: true
        },
        {
          id: "EP01-C05",
          scene: 1,
          situation: "바람에 우산이 뒤집히고 두 사람 동시에 비를 맞는다. 해린이 놀라 소리를 지른다.",
          camera: "와이드 샷 — 위에서",
          lens: "35mm",
          composition: "두 사람 대각선, 뒤집힌 우산",
          background: "빗속 옥상 전체",
          lighting: "비 내리는 자연광, 플래시 없음",
          dialogue: "오해린: 아... 죄송해요!",
          emotion: "panic",
          isKey: false
        },
        {
          id: "EP01-C06",
          scene: 1,
          situation: "준혁이 한숨을 내쉬며 해린의 손을 잡고 계단실 쪽으로 걸어간다. 해린은 끌려가며 놀란 눈을 한다.",
          camera: "트래킹 샷 — 옆면 따라가기",
          lens: "50mm",
          composition: "두 사람 걸어가는 방향으로 프레임 이동",
          background: "비 내리는 옥상 바닥, 계단실 문",
          lighting: "빗속 차가운 자연광",
          dialogue: "차준혁: 이리 와요.",
          emotion: "shock",
          isKey: true
        }
      ],
      ending: "TO BE CONTINUED..."
    },
    {
      id: "EP02",
      title: "닫힌 문 안에서",
      cuts: [
        {
          id: "EP02-C01",
          scene: 2,
          situation: "병원 엘리베이터 내부. 준혁과 해린이 각자 문 쪽을 바라보며 서 있다. 어색한 침묵.",
          camera: "미디엄 투 샷 — 엘리베이터 내부 정면",
          lens: "35mm",
          composition: "두 사람 사이 공간 강조, 대칭 구도",
          background: "엘리베이터 내부, 스테인리스 벽",
          lighting: "엘리베이터 형광등 / 차가운 화이트",
          dialogue: "",
          emotion: "null",
          isKey: false
        },
        {
          id: "EP02-C02",
          scene: 2,
          situation: "해린이 작은 목소리로 어제 일을 꺼낸다. 준혁은 앞만 보며 짧게 대꾸한다.",
          camera: "클로즈업 교차 편집 — 해린 → 준혁 순서",
          lens: "85mm",
          composition: "얼굴 클로즈업, 눈 맞춤 없음",
          background: "엘리베이터 내부 블러",
          lighting: "형광등 직광, 스킨 섀도우 선명",
          dialogue: "오해린: 어제... 감사했어요. / 차준혁: 됐어요.",
          emotion: "null",
          isKey: false
        },
        {
          id: "EP02-C03",
          scene: 2,
          situation: "갑자기 엘리베이터가 멈추는 진동. 두 사람 동시에 균형을 잡는다.",
          camera: "미디엄 샷 — 두 사람",
          lens: "35mm",
          composition: "두 사람 반응 동시에 담기",
          background: "엘리베이터 내부",
          lighting: "형광등 깜빡임 시작",
          dialogue: "",
          emotion: "freeze",
          isKey: false
        },
        {
          id: "EP02-C04",
          scene: 2,
          situation: "해린의 표정이 굳어간다. 폐소공포증 증세가 시작된다. 준혁이 눈치채고 물을 꺼낸다.",
          camera: "클로즈업 — 해린 얼굴",
          lens: "85mm",
          composition: "해린 얼굴 클로즈업, 준혁 손 프레임 인",
          background: "엘리베이터 내부 블러",
          lighting: "형광등 깜빡임",
          dialogue: "차준혁: 폐소공포증이오? / 오해린: 조금...",
          emotion: "panic",
          isKey: true
        },
        {
          id: "EP02-C05",
          scene: 2,
          situation: "조명이 완전히 꺼지며 암흑. 해린이 반사적으로 준혁의 팔을 양손으로 꽉 잡는다.",
          camera: "클로즈업 — 두 손이 팔을 잡는 장면",
          lens: "85mm",
          composition: "손의 연결 포인트, 극적 클로즈업",
          background: "어둠",
          lighting: "암흑 → 비상구 초록빛 리플렉션 미세하게",
          dialogue: "",
          emotion: "shock",
          isKey: true
        }
      ],
      ending: "2화 끝 — 다음 화에 계속"
    }
  ]
};

export const MOCK_CHARACTER_VISION = {
  face: "Oval face shape, fair porcelain skin with natural glow, high cheekbones, defined jawline, full lips",
  hair: "Straight jet-black hair, blunt cut at collarbone length, no layers, glossy finish",
  eyes: "#3D2B1F · Almond-shaped East Asian eyes with double eyelid, long natural lashes, deep warm-brown iris",
  outfit: "Crisp white medical coat over navy blue scrubs, stethoscope around neck, ID badge clipped to lapel",
  energy: "차갑고 절제된 카리스마. 완벽주의자의 긴장감이 느껴지는 인물."
};

export const MOCK_BACKGROUND_VISION = {
  location: "Modern hospital rooftop terrace, urban skyline visible in background, wet concrete floor from rain",
  ground: "Dark grey concrete tiles, reflective puddles forming from rainfall",
  props: "Metal railing along the perimeter, a single bench partially sheltered by overhang, drainage pipes",
  kids: "",
  time: "Evening, overcast sky, city lights beginning to glow through rain and low clouds"
};

export const MOCK_PROMPT_TEXT = `## EP01-C04
### [옥상 우산 신] — 해린이 차준혁에게 우산을 씌워주는 첫 접촉 장면

【Character Reference】
CHARACTER A — 차준혁 (외과의사 / 32세)
Face: Oval face shape, fair porcelain skin, high cheekbones, defined jawline
Hair: Straight jet-black hair, side-parted, neat and polished
Eyes: #1A1A2E · Sharp East Asian eyes, intense gaze, minimal expression
Outfit: Crisp white medical coat, navy blue scrubs underneath, stethoscope
Energy: 냉철하고 완벽주의적, 감정 억제된 카리스마

CHARACTER B — 오해린 (간호사 / 27세)
Face: Round soft face, warm ivory skin, natural blush on cheeks
Hair: Straight dark brown bob, secured with pale blue hairpin
Eyes: #3D2B1F · Warm almond eyes, expressive, gentle double eyelid
Outfit: Light blue nurse uniform, white nurse shoes, ID badge
Energy: 밝고 엉뚱하지만 진심이 느껴지는 따뜻함

【Style】
Ultra-realistic quality, realistic contemporary setting, clean sharp cinematography, natural color grade, slight soap opera sheen.
No fantasy elements. No subtitles. No text overlays. No watermarks. Clean frame only.
Real subtle chest rise and fall synchronized with breathing. Extremely natural subtle movements, micro-expressions, eye tension throughout.
Aspect Ratio: 9:16 vertical · 4s per cut

【Fixed Setting & Lighting】
Location: Modern hospital rooftop terrace, urban skyline visible in background
Ground: Dark grey concrete tiles, reflective puddles from rain
Props: Metal railing, single bench, drainage pipes
Time: Evening, overcast sky, city lights glowing through rain
Outdoor: Overcast evening, cold blue-grey ambient light, rain diffusion
차준혁: Cold key light from above-left, deep shadows under cheekbones
오해린: Soft warm fill from right, natural skin warmth preserved

【Aspect Ratio】9:16  【Duration】4s

[타임코드 — 4초]
0–1s → Two-shot from side, 50mm — Hospital rooftop in rain. CHAR_A stands rigid, looking away. CHAR_B approaches with open umbrella, hesitant. Body language: CHAR_A stiff, CHAR_B leaning slightly forward with care.

1–2.5s → Medium close-up, 50mm — CHAR_B raises umbrella above CHAR_A's head. CHAR_A turns slowly, eyes dropping to register the gesture. Micro-expression shift: surprise softening jaw tension. Rain patters on umbrella canopy. [DIALOGUE] "선생님 내일 수술 있잖아요." — CHAR_B, soft low voice, lips barely moving, sincere.

2.5–3.5s → Reaction close-up, 85mm — CHAR_A's face fills frame. Water droplets on cheek. Eyes reading CHAR_B with unreadable calculation. First genuine moment of hesitation in his composure.

3.5–4s → Wide shot, 35mm — Wind inverts the umbrella suddenly. Both figures simultaneously soaked. CHAR_B gasps, CHAR_A's expression flickers. Freeze frame → Blackout.

【Lighting】씬 특화 조명 — Cold blue ambient rain diffusion for CHAR_A, warm practical glow from umbrella interior for intimate micro-moment
엔딩: 블랙아웃`;
