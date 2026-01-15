// 모킹 데이터 - 백엔드 없이 개발할 때 사용

export const mockPerformances = [
  {
    id: "1",
    title: "베토벤 교향곡 9번 '합창'",
    category: "클래식",
    venue: "예술의전당 콘서트홀",
    district: "서초구",
    date: "2025.1.15 - 2025.1.20",
    time: "19:30",
    price: "50,000원",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
    rating: 4.8,
    reviewCount: 127,
    description: "베토벤의 대표작인 교향곡 9번을 서울시립교향악단이 연주합니다.",
    organizer: "서울시립교향악단"
  },
  {
    id: "2",
    title: "햄릿",
    category: "연극",
    venue: "국립극장 해오름극장",
    district: "중구",
    date: "2025.1.10 - 2025.1.25",
    time: "19:00",
    price: "40,000원",
    image: "https://images.unsplash.com/photo-1503095391549-8b8f0e8b9c5e?w=800",
    rating: 4.6,
    reviewCount: 89,
    description: "셰익스피어의 명작 햄릿을 현대적으로 재해석한 작품입니다.",
    organizer: "국립극단"
  },
  {
    id: "3",
    title: "시카고",
    category: "뮤지컬",
    venue: "샤롯데씨어터",
    district: "강남구",
    date: "2025.1.5 - 2025.2.28",
    time: "14:00, 19:30",
    price: "80,000원",
    image: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=800",
    rating: 4.9,
    reviewCount: 234,
    description: "재즈 시대를 배경으로 한 화려한 뮤지컬 시카고.",
    organizer: "EMK뮤지컬컴퍼니"
  },
  {
    id: "4",
    title: "현대무용: 춤추는 몸",
    category: "무용",
    venue: "세종문화회관 대극장",
    district: "종로구",
    date: "2025.1.20 - 2025.1.22",
    time: "20:00",
    price: "30,000원",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800",
    rating: 4.7,
    reviewCount: 56,
    description: "몸의 움직임으로 표현하는 현대무용 작품.",
    organizer: "서울시립무용단"
  },
  {
    id: "5",
    title: "판소리 명창 공연",
    category: "전통예술",
    venue: "국립국악원 우면당",
    district: "서초구",
    date: "2025.1.12 - 2025.1.14",
    time: "19:00",
    price: "무료",
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800",
    rating: 4.5,
    reviewCount: 43,
    description: "전통 판소리의 아름다움을 느낄 수 있는 공연.",
    organizer: "국립국악원"
  },
  {
    id: "6",
    title: "모네와 인상주의",
    category: "전시",
    venue: "국립현대미술관",
    district: "종로구",
    date: "2025.1.1 - 2025.3.31",
    time: "10:00 - 18:00",
    price: "15,000원",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800",
    rating: 4.8,
    reviewCount: 312,
    description: "모네를 비롯한 인상주의 화가들의 작품을 만나보세요.",
    organizer: "국립현대미술관"
  }
];

export const mockPromotions = [
  {
    id: "1",
    title: "강남구 문화의 달",
    description: "강남구에서 진행하는 다양한 문화예술 프로그램",
    district: "강남구",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800",
    startDate: "2025.1.1",
    endDate: "2025.1.31"
  },
  {
    id: "2",
    title: "종로구 전통문화 체험",
    description: "한옥마을에서 즐기는 전통문화 프로그램",
    district: "종로구",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
    startDate: "2025.1.5",
    endDate: "2025.1.20"
  },
  {
    id: "3",
    title: "마포구 거리예술 축제",
    description: "거리에서 만나는 다양한 예술 공연",
    district: "마포구",
    image: "https://images.unsplash.com/photo-1478147427282-58a87a120781?w=800",
    startDate: "2025.1.10",
    endDate: "2025.1.25"
  }
];

export const mockMatches = [
  {
    id: "1",
    name: "지민",
    age: 28,
    gender: "여성",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    bio: "클래식과 연극을 좋아하는 문화 애호가입니다. 함께 공연을 감상하며 이야기 나누는 것을 좋아해요.",
    location: "강남구",
    interests: ["클래식", "연극", "전시"],
    wantToSee: {
      performanceId: "1",
      performanceTitle: "베토벤 교향곡 9번 '합창'",
      date: "2025.1.18"
    },
    matchScore: 92
  },
  {
    id: "2",
    name: "민수",
    age: 32,
    gender: "남성",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    bio: "뮤지컬과 무용을 즐기는 사람입니다. 주말에는 항상 공연을 보러 다녀요.",
    location: "서초구",
    interests: ["뮤지컬", "무용", "연극"],
    wantToSee: {
      performanceId: "3",
      performanceTitle: "시카고",
      date: "2025.1.20"
    },
    matchScore: 88
  },
  {
    id: "3",
    name: "수진",
    age: 26,
    gender: "여성",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    bio: "전시회와 전통예술에 관심이 많습니다. 문화예술을 통해 새로운 사람들을 만나고 싶어요.",
    location: "종로구",
    interests: ["전시", "전통예술", "클래식"],
    wantToSee: {
      performanceId: "6",
      performanceTitle: "모네와 인상주의",
      date: "2025.1.15"
    },
    matchScore: 85
  }
];

// 로컬 스토리지 키
export const STORAGE_KEYS = {
  USERS: 'muse_you_users',
  CURRENT_USER: 'muse_you_current_user',
  PERFORMANCE_LIKES: 'muse_you_performance_likes',
  USER_LIKES: 'muse_you_user_likes',
  MATCHES: 'muse_you_matches'
};

// 초기 사용자 데이터 (테스트용)
export const getInitialUsers = () => [
  {
    id: "user1",
    email: "test@example.com",
    password: "test123", // 실제로는 해시되어야 함
    name: "테스트 사용자",
    age: 25,
    gender: "남성",
    location: "강남구",
    interests: ["클래식", "연극"],
    bio: "테스트 사용자입니다",
    phoneNumber: "010-1234-5678",
    isPhoneVerified: true
  }
];
