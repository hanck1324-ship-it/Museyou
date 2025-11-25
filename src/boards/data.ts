export interface BoardPost {
  id: string;
  title: string;
  summary: string;
  category: string;
  tags: string[];
  author: string;
  organization?: string;
  contactEmail: string;
  contactLink?: string;
  content: string;
  coverImage?: string;
  createdAt: string;
}

const STORAGE_KEY = "muse-you-board-posts";

const seedPosts: BoardPost[] = [
  {
    id: "seoul-music-lab",
    title: "서울시립예술단 뮤지션 인큐베이팅",
    summary: "신규 창작곡을 함께 제작할 싱어송라이터, 연주자를 모집합니다.",
    category: "협업 제안",
    tags: ["음악", "프로젝트", "창작"],
    author: "서울뮤직랩",
    organization: "서울시립예술단",
    contactEmail: "musiclab@museyou.kr",
    contactLink: "https://forms.gle/abcd",
    content:
      "서울시립예술단과 함께 할 콜라보 뮤지션을 찾습니다. 3개월 간의 워크숍과 마스터클래스, 앨범 제작을 지원하며 최종 공연도 함께 준비합니다. 서울에서 활동 중인 신진 뮤지션이라면 누구나 환영해요.",
    coverImage: "https://images.unsplash.com/photo-1461784121038-f088ca1e7714?auto=format&fit=crop&w=900&q=80",
    createdAt: "2025-11-05T09:00:00+09:00",
  },
  {
    id: "hongdae-gallery-call",
    title: "홍대 독립갤러리 12월 전시 작가 모집",
    summary: "12월 'Urban Reflection' 기획전에 함께 할 사진/미디어아트 작가님을 기다립니다.",
    category: "전시 공고",
    tags: ["전시", "사진", "미디어아트"],
    author: "정다은 큐레이터",
    organization: "갤러리 R",
    contactEmail: "curator@rgallery.co.kr",
    content:
      "홍대 갤러리 R에서 12월 기획전을 진행합니다. 도시의 감정과 리듬을 담아낸 작품이라면 매체 제한 없이 환영합니다. 전시비 전액 지원, 작가 토크 및 굿즈 제작도 함께 진행할 예정이에요.",
    coverImage: "https://images.unsplash.com/photo-1465310477141-6fb93167a273?auto=format&fit=crop&w=900&q=80",
    createdAt: "2025-11-03T14:30:00+09:00",
  },
  {
    id: "community-workshop",
    title: "지역 예술인 네트워킹 & 워크숍",
    summary: "공공미술, 공연, 커뮤니티 아트에 관심있는 분들과 아이디어를 나누는 자리입니다.",
    category: "행사 안내",
    tags: ["커뮤니티", "워크숍", "공공미술"],
    author: "문화공장 팀",
    contactEmail: "hello@culturefactory.kr",
    content:
      "문화공장 스튜디오에서 11월 말 네트워킹 워크숍을 엽니다. 프로젝트 소개, 즉석 협업 매칭, 소규모 쇼케이스가 마련되어 있어요. 만든 작업물을 소개하거나 함께할 팀원을 찾고 있다면 꼭 들러주세요!",
    coverImage: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80",
    createdAt: "2025-11-01T11:00:00+09:00",
  },
];

const hasWindow = typeof window !== "undefined";

function readFromStorage(): BoardPost[] | null {
  if (!hasWindow) return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    return null;
  }
  return null;
}

function writeToStorage(posts: BoardPost[]) {
  if (!hasWindow) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

function ensureData(): BoardPost[] {
  const stored = readFromStorage();
  if (stored && stored.length > 0) {
    return stored;
  }
  if (hasWindow) {
    writeToStorage(seedPosts);
  }
  return seedPosts;
}

export function getBoardPosts(): BoardPost[] {
  return ensureData();
}

export function getBoardById(id: string): BoardPost | undefined {
  return ensureData().find((post) => post.id === id);
}

export function addBoardPost(post: BoardPost): BoardPost[] {
  const posts = [post, ...ensureData()];
  writeToStorage(posts);
  return posts;
}


