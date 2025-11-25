import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/navigation/tabs";
import { Input } from "./components/ui/forms/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/forms/select";
import { Button } from "./components/ui/buttons/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./components/ui/overlay/sheet";
import { Search, Music, Theater, Palette, Users, Heart, LogIn, LogOut, UserCircle, SlidersHorizontal, X } from "lucide-react";
import { PerformanceCard, Performance } from "./components/performances/PerformanceCard";
import { PerformanceDetail } from "./components/performances/PerformanceDetail";
import { PromotionCard, Promotion } from "./components/promotions/PromotionCard";
import { MatchingCard, UserMatch } from "./components/matching/MatchingCard";
import { UserProfile } from "./components/matching/UserProfile";
import { DateProposal } from "./components/matching/DateProposal";
import { MuseCompanionCard, MuseCompanion } from "./components/muse-companions/MuseCompanionCard";
import { MuseCompanionDetail } from "./components/muse-companions/MuseCompanionDetail";
import { AuthDialog } from "./components/auth/AuthDialog";
import { HomePage } from "./components/home/HomePage";
import { toast } from "sonner";
import {
  authApi,
  performanceApi,
  matchingApi,
  promotionApi,
  museCompanionApi,
  seedData,
  getAccessToken,
} from "./lib/api/api";

export default function App() {
  // Page State
  const [showHomePage, setShowHomePage] = useState(true);

  // UI State
  const [selectedPerformance, setSelectedPerformance] = useState<Performance | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserMatch | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [proposalPerformance, setProposalPerformance] = useState<Performance | null>(null);
  const [proposalOpen, setProposalOpen] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<MuseCompanion | null>(null);
  const [spotDetailOpen, setSpotDetailOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [selectedDateFilter, setSelectedDateFilter] = useState("all");
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Data State
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [matches, setMatches] = useState<UserMatch[]>([]);
  const [companionSpots, setCompanionSpots] = useState<MuseCompanion[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataSeeded, setIsDataSeeded] = useState(false);

  // Sample data for seeding
  const samplePerformances: Performance[] = [
    {
      id: "1",
      title: "서울시립교향악단 정기연주회",
      category: "클래식",
      venue: "세종문화회관 대극장",
      district: "종로구",
      date: "2025.11.05 - 2025.11.06",
      time: "19:30",
      price: "30,000원 ~ 70,000원",
      image: "https://images.unsplash.com/photo-1519683384663-c9b34271669a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmNoZXN0cmElMjBjbGFzc2ljYWwlMjBtdXNpY3xlbnwxfHx8fDE3NjE0NzgyNDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.8,
      reviewCount: 156,
      description: "베토벤 교향곡 전곡 시리즈의 두 번째 공연으로, 교향곡 3번 '영웅'과 5번 '운명'을 연주합니다. 세계적인 지휘자와 함께하는 특별한 시간이 될 것입니다.",
      organizer: "서울시립교향악단",
    },
    {
      id: "2",
      title: "한여름밤의 꿈 - 연극",
      category: "연극",
      venue: "대학로 예술극장",
      district: "종로구",
      date: "2025.10.28 - 2025.12.15",
      time: "평일 19:30 / 주말 15:00, 19:00",
      price: "40,000원",
      image: "https://images.unsplash.com/photo-1761173084851-1e5302e931fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVhdGVyJTIwcGVyZm9ybWFuY2UlMjBjb25jZXJ0fGVufDF8fHx8MTc2MTUyMTIzN3ww&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.6,
      reviewCount: 89,
      description: "셰익스피어의 명작을 현대적으로 재해석한 작품입니다. 환상적인 무대 연출과 배우들의 열연이 돋보이는 작품입니다.",
      organizer: "서울예술단",
    },
    {
      id: "3",
      title: "전통춤 축제 '우리의 춤'",
      category: "전통예술",
      venue: "국립국악원",
      district: "서초구",
      date: "2025.11.10 - 2025.11.12",
      time: "14:00, 18:00",
      price: "무료",
      image: "https://images.unsplash.com/photo-1758819312143-614e72d4283c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjB0cmFkaXRpb25hbCUyMG11c2ljfGVufDF8fHx8MTc2MTU1MDgxOXww&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.9,
      reviewCount: 234,
      description: "한국의 전통춤을 한자리에서 감상할 수 있는 특별한 축제입니다. 살풀이춤, 승무, 탈춤 등 다양한 전통춤이 공연됩니다.",
      organizer: "국립국악원",
    },
    {
      id: "4",
      title: "현대미술 특별전: 빛과 공간",
      category: "전시",
      venue: "서울시립미술관",
      district: "중구",
      date: "2025.10.15 - 2025.12.31",
      time: "10:00 - 19:00 (월요일 휴관)",
      price: "5,000원",
      image: "https://images.unsplash.com/photo-1719398026703-0d3f3d162e51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBleGhpYml0aW9uJTIwZ2FsbGVyeXxlbnwxfHx8fDE3NjE1Mjk0NjF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.7,
      reviewCount: 178,
      description: "국내외 현대미술 작가들의 작품을 통해 빛과 공간의 관계를 탐구하는 전시입니다. 체험형 작품들이 다수 포함되어 있습니다.",
      organizer: "서울시립미술관",
    },
    {
      id: "5",
      title: "모던 댄스 페스티벌",
      category: "무용",
      venue: "LG아트센터",
      district: "강남구",
      date: "2025.11.15 - 2025.11.20",
      time: "19:30",
      price: "50,000원 ~ 100,000원",
      image: "https://images.unsplash.com/photo-1686435386310-92ee42a3580f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYW5jZSUyMHBlcmZvcm1hbmNlJTIwYmFsbGV0fGVufDF8fHx8MTc2MTUyMDkxOHww&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.5,
      reviewCount: 92,
      description: "세계적인 현대무용단의 최신 레퍼토리를 선보이는 페스티벌입니다. 혁신적인 안무와 몸의 표현이 인상적입니다.",
      organizer: "LG아트센터",
    },
    {
      id: "6",
      title: "뮤지컬 '레미제라블'",
      category: "뮤지컬",
      venue: "블루스퀘어",
      district: "용산구",
      date: "2025.10.01 - 2026.02.28",
      time: "평일 19:30 / 주말 14:00, 18:30",
      price: "80,000원 ~ 150,000원",
      image: "https://images.unsplash.com/photo-1578052411173-87a5ccf18e35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpY2FsJTIwdGhlYXRlciUyMHN0YWdlfGVufDF8fHx8MTc2MTU1MDgyMHww&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.9,
      reviewCount: 456,
      description: "전 세계를 감동시킨 불멸의 뮤지컬. 최고의 배우진과 오케스트라가 선사하는 감동의 무대를 만나보세요.",
      organizer: "서울뮤지컬단",
    },
  ];

  const samplePromotions: Promotion[] = [
    {
      id: "1",
      title: "강남구 문화예술 주간",
      district: "강남구",
      category: "종합축제",
      date: "2025.11.01 - 2025.11.07",
      image: "https://images.unsplash.com/photo-1761173084851-1e5302e931fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVhdGVyJTIwcGVyZm9ybWFuY2UlMjBjb25jZXJ0fGVufDF8fHx8MTc2MTUyMTIzN3ww&ixlib=rb-4.1.0&q=80&w=1080",
      description: "지역 예술가들의 다양한 공연과 전시를 무료로 즐길 수 있는 주간 행사입니다.",
      organizer: "강남구청 문화체육과",
      link: "#",
    },
    {
      id: "2",
      title: "마포구 거리공연 프로젝트",
      district: "마포구",
      category: "거리공연",
      date: "2025.10.28 - 2025.11.30",
      image: "https://images.unsplash.com/photo-1519683384663-c9b34271669a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmNoZXN0cmElMjBjbGFzc2ljYWwlMjBtdXNpY3xlbnwxfHx8fDE3NjE0NzgyNDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      description: "홍대 거리에서 펼쳐지는 다채로운 버스킹 공연. 매주 토요일 오후 3시부터 진행됩니다.",
      organizer: "마포구청 문화관광과",
    },
    {
      id: "3",
      title: "송파구 전통문화체험",
      district: "송파구",
      category: "전통문화",
      date: "2025.11.05",
      image: "https://images.unsplash.com/photo-1758819312143-614e72d4283c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjB0cmFkaXRpb25hbCUyMG11c2ljfGVufDF8fHx8MTc2MTU1MDgxOXww&ixlib=rb-4.1.0&q=80&w=1080",
      description: "한복 입기, 전통악기 체험, 전통춤 배우기 등 다양한 전통문화 체험 프로그램을 제공합니다.",
      organizer: "송파문화원",
    },
    {
      id: "4",
      title: "성북구 예술가 지원 프로그램",
      district: "성북구",
      category: "지원사업",
      date: "신청기간: 2025.11.01 - 2025.11.30",
      image: "https://images.unsplash.com/photo-1719398026703-0d3f3d162e51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBleGhpYml0aW9uJTIwZ2FsbGVyeXxlbnwxfHx8fDE3NjE1Mjk0NjF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      description: "지역 예술가들의 창작 활동을 지원하는 프로그램입니다. 공연장, 전시장 대관료 지원 및 창작 지원금을 제공합니다.",
      organizer: "성북구청 문화체육과",
      link: "#",
    },
  ];

  const sampleCompanionSpots: MuseCompanion[] = [
    {
      id: "1",
      title: "뮤지컬 '레미제라블' - Muse 동행자 패키지",
      category: "뮤지컬",
      location: "블루스퀘어",
      district: "용산구",
      atmosphere: "로맨틱, 감동적",
      image: "https://images.unsplash.com/photo-1578052411173-87a5ccf18e35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpY2FsJTIwdGhlYXRlciUyMHN0YWdlfGVufDF8fHx8MTc2MTU1MDgyMHww&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.9,
      reviewCount: 234,
      description: "감동적인 스토리와 아름다운 음악으로 특별한 날을 더욱 특별하게 만들어줄 뮤지컬입니다. 단체관람객 할인 가능.",
      priceRange: "2인 150,000원~",
      tags: ["기념일추천", "감동", "동행석", "선물포함"],
      companionBenefit: "동행자 할인 20%",
      recommendedDate: "2025.11.09 (토) 19:00",
      weather: { condition: "맑음", temperature: "16°C", icon: "☀️" },
      performanceAvailable: true,
      performanceInfo: "공연 시간: 2시간 30분 (인터미션 15분 포함)",
      nearbyAttractions: ["용산공원 (도보 10분)", "한강공원 이촌한강공원 (도보 15분)", "국립중앙박물관 (차량 5분)"],
      specialFeatures: ["동행석 특별 할인", "공연 후 배우 사진 촬영 이벤트", "기념일 축하 메시지 서비스"],
      address: "서울특별시 용산구 이태원로 294",
      coordinates: { lat: 37.5326, lng: 126.9917 },
      nearbyRestaurants: [
        { name: "더 플레이스 다이닝", category: "양식", distance: "도보 3분", rating: 4.5 },
        { name: "이태원 설렁탕", category: "한식", distance: "도보 5분", rating: 4.7 },
        { name: "페퍼밀 스테이크하우스", category: "스테이크", distance: "도보 7분", rating: 4.6 },
      ],
    },
    {
      id: "2",
      title: "서울시립미술관 - 야간 특별 관람",
      category: "전시",
      location: "서울시립미술관",
      district: "중구",
      atmosphere: "예술적, 조용한",
      image: "https://images.unsplash.com/photo-1719398026703-0d3f3d162e51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBleGhpYml0aW9uJTIwZ2FsbGVyeXxlbnwxfHx8fDE3NjE1Mjk0NjF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.7,
      reviewCount: 156,
      description: "금요일 밤 9시까지 운영하는 야간 특별 관람. 낮보다 한적한 분위기에서 예술 작품을 감상할 수 있습니다. 단체관람객 할인 가능.",
      priceRange: "2인 10,000원",
      tags: ["야경명소", "인생샷", "예술", "조용한"],
      recommendedDate: "2025.11.07 (금) 18:00",
      weather: { condition: "구름 조금", temperature: "14°C", icon: "⛅" },
      performanceAvailable: false,
      performanceInfo: "정적인 전시 관람",
      nearbyAttractions: ["덕수궁 돌담길 (도보 5분)", "정동극장 (도보 7분)", "서울광장 (도보 10분)"],
      specialFeatures: ["야간 특별 조명", "루프탑 뷰포인트", "동행 사진 촬영 서비스"],
      address: "서울특별시 중구 덕수궁길 61",
      coordinates: { lat: 37.5658, lng: 126.9750 },
      nearbyRestaurants: [
        { name: "정동1928", category: "카페", distance: "도보 2분", rating: 4.8 },
        { name: "더 프라임 스테이크", category: "양식", distance: "도보 8분", rating: 4.5 },
        { name: "를르 브뤼", category: "프렌치", distance: "도보 10분", rating: 4.6 },
      ],
    },
    {
      id: "3",
      title: "한강 선셋 클래식 콘서트",
      category: "클래식",
      location: "여의도 한강공원",
      district: "영등포구",
      atmosphere: "낭만적, 야외",
      image: "https://images.unsplash.com/photo-1519683384663-c9b34271669a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmNoZXN0cmElMjBjbGFzc2ljYWwlMjBtdXNpY3xlbnwxfHx8fDE3NjE0NzgyNDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.8,
      reviewCount: 189,
      description: "노을이 지는 한강에서 즐기는 야외 클래식 공연. 돗자리를 깔고 와인과 함께 음악을 즐길 수 있습니다. 단체관람객 할인 가능.",
      priceRange: "무료 (idot자리 대여 5,000원)",
      tags: ["야외", "노을", "피크닉", "무료"],
      companionBenefit: "동행자 돗자리 세트 10% 할인",
      recommendedDate: "2025.11.08 (토) 17:30",
      weather: { condition: "맑음", temperature: "18°C", icon: "☀️" },
      performanceAvailable: true,
      performanceInfo: "야외 오케스트라 공연 (90분)",
      nearbyAttractions: ["여의도 공원 (도보 3분)", "63빌딩 전망대 (도보 15분)", "샛강 자전거길 (도보 5분)"],
      specialFeatures: ["일몰 감상", "피크닉 패키지 제공", "무료 주차 2시간", "와인 판매"],
      address: "서울특별시 영등포구 여의동로 330",
      coordinates: { lat: 37.5269, lng: 126.9343 },
      nearbyRestaurants: [
        { name: "IFC몰 푸드코트", category: "다양", distance: "도보 10분", rating: 4.3 },
        { name: "한강 피크닉 카페", category: "카페", distance: "도보 1분", rating: 4.6 },
        { name: "여의도 맛집거리", category: "다양", distance: "도보 12분", rating: 4.4 },
      ],
    },
    {
      id: "4",
      title: "남산 N서울타워 야경 동행",
      category: "야경명소",
      location: "N서울타워",
      district: "용산구",
      atmosphere: "로맨틱, 야경",
      image: "https://images.unsplash.com/photo-1519683384663-c9b34271669a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmNoZXN0cmElMjBjbGFzc2ljYWwlMjBtdXNpY3xlbnwxfHx8fDE3NjE0NzgyNDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.6,
      reviewCount: 312,
      description: "서울의 야경을 한눈에 볼 수 있는 최고의 전망대. 단체관람객 할인 가능.",
      priceRange: "2인 32,000원 (전망대)",
      tags: ["야경", "사진촬영", "기념일", "인생샷"],
      companionBenefit: "동행자 패키지 15% 할인",
      recommendedDate: "2025.11.06 (목) 18:30",
      weather: { condition: "맑음", temperature: "15°C", icon: "☀️" },
      performanceAvailable: false,
      performanceInfo: "전망대 관람",
      nearbyAttractions: ["남산 케이블카 (도보 5분)", "남산공원 산책로 (도보 3분)", "명동 거리 (도보 15분)"],
      specialFeatures: ["360도 전망", "야경 사진 촬영", "동행 포토존", "사랑의 자물쇠"],
      address: "서울특별시 용산구 남산공원길 105",
      coordinates: { lat: 37.5512, lng: 126.9882 },
      nearbyRestaurants: [
        { name: "N그릴", category: "양식", distance: "타워 내", rating: 4.5 },
        { name: "한쿡", category: "한식", distance: "타워 내", rating: 4.3 },
        { name: "남산골 한옥마을 카페", category: "카페", distance: "도보 10분", rating: 4.7 },
      ],
    },
  ];

  const sampleMatches: UserMatch[] = [
    {
      id: "match1",
      name: "지민",
      age: 27,
      gender: "여성",
      photo: "https://images.unsplash.com/photo-1704054006064-2c5b922e7a1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHdvbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYxNTQxODUyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      bio: "클래식 음악과 미술을 사랑하는 큐레이터입니다. 감성적인 대화를 나눌 수 있는 분을 찾고 있어요.",
      location: "강남구",
      interests: ["클래식", "전시", "뮤지컬", "와인"],
      wantToSee: {
        performanceId: "1",
        performanceTitle: "서울시립교향악단 정기연주회",
        date: "2025.11.05",
      },
      matchScore: 92,
      userType: 'single',
    },
    {
      id: "match2",
      name: "태윤",
      age: 29,
      gender: "남성",
      photo: "https://images.unsplash.com/photo-1611695434398-4f4b330623e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MTQ0NTM4MXww&ixlib=rb-4.1.0&q=80&w=1080",
      bio: "뮤지컬 마니아입니다. 공연 보고 소감을 나누는 걸 좋아해요. 함께 공연 보러 가실 분 찾습니다!",
      location: "마포구",
      interests: ["뮤지컬", "연극", "재즈", "영화"],
      wantToSee: {
        performanceId: "6",
        performanceTitle: "뮤지컬 '레미제라블'",
        date: "2025.11.09",
      },
      matchScore: 88,
      userType: 'single',
    },
    {
      id: "match3",
      name: "서연",
      age: 25,
      gender: "여성",
      photo: "https://images.unsplash.com/photo-1704054006064-2c5b922e7a1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHdvbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYxNTQxODUyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      bio: "현대미술과 전시를 좋아하는 에디터입니다. 예술적인 대화를 나눌 수 있는 분을 찾아요.",
      location: "종로구",
      interests: ["전시", "무용", "독립영화", "사진"],
      wantToSee: {
        performanceId: "4",
        performanceTitle: "현대미술 특별전: 빛과 공간",
        date: "2025.11.08",
      },
      matchScore: 85,
      userType: 'single',
    },
    {
      id: "match4",
      name: "현우",
      age: 29,
      gender: "남성",
      photo: "https://images.unsplash.com/photo-1611695434398-4f4b330623e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MTQ0NTM4MXww&ixlib=rb-4.1.0&q=80&w=1080",
      bio: "전통 문화에 관심이 많은 개발자입니다. 한국의 아름다움을 함께 느끼고 싶어요.",
      location: "서초구",
      interests: ["전통예술", "클래식", "등산", "사찰여행"],
      wantToSee: {
        performanceId: "3",
        performanceTitle: "전통춤 축제 '우리의 춤'",
        date: "2025.11.10",
      },
      matchScore: 79,
      userType: 'single',
    },
  ];

  const districts = ["all", "강남구", "강북구", "종로구", "중구", "용산구", "서초구", "마포구", "송파구", "성북구", "영등포구"];
  const categories = ["all", "클래식", "연극", "뮤지컬", "무용", "전통예술", "전시"];
  const priceRanges = [
    { value: "all", label: "전체 가격" },
    { value: "free", label: "무료" },
    { value: "under10k", label: "1만원 미만" },
    { value: "10k-50k", label: "1만원~5만원" },
    { value: "50k-100k", label: "5만원~10만원" },
    { value: "over100k", label: "10만원 이상" },
  ];
  const dateFilters = [
    { value: "all", label: "전체 기간" },
    { value: "today", label: "오늘" },
    { value: "week", label: "이번 주" },
    { value: "month", label: "이번 달" },
    { value: "upcoming", label: "곧 시작" },
  ];

  // Initialize app
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Check for existing session
      const session = await authApi.getSession();
      if (session) {
        setIsLoggedIn(true);
        const profileData = await authApi.getProfile();
        setCurrentUser(profileData.profile);
      }

      // Load data from backend
      await loadData();
    } catch (error) {
      console.error('Error initializing app:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadData = async () => {
    try {
      // Try to load performances
      const perfData = await performanceApi.getAll();
      if (perfData.performances && perfData.performances.length > 0) {
        setPerformances(perfData.performances);
        setIsDataSeeded(true);
      } else {
        // Seed data if no performances found
        await handleSeedData();
      }

      // Load promotions
      const promoData = await promotionApi.getAll();
      if (promoData.promotions) {
        setPromotions(promoData.promotions);
      }

      // Load Muse companion spots
      const spotData = await museCompanionApi.getAll();
      if (spotData.spots) {
        setCompanionSpots(spotData.spots);
      }

      // Load matches if logged in
      if (isLoggedIn) {
        const matchData = await matchingApi.getMatches();
        if (matchData.matches) {
          setMatches(matchData.matches);
        }
      } else {
        // Use sample data if not logged in
        setMatches(sampleMatches);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      // Fall back to sample data
      setPerformances(samplePerformances);
      setPromotions(samplePromotions);
      setCompanionSpots(sampleCompanionSpots);
      setMatches(sampleMatches);
    }
  };

  const handleSeedData = async () => {
    if (isDataSeeded) return;
    
    try {
      const result = await seedData({
        performances: samplePerformances,
        promotions: samplePromotions,
        companionSpots: sampleCompanionSpots,
      });

      if (result.success) {
        setPerformances(samplePerformances);
        setPromotions(samplePromotions);
        setCompanionSpots(sampleCompanionSpots);
        setIsDataSeeded(true);
        toast.success('데이터가 로드되었습니다!');
      }
    } catch (error) {
      console.error('Error seeding data:', error);
      // Use sample data anyway
      setPerformances(samplePerformances);
      setPromotions(samplePromotions);
      setCompanionSpots(sampleCompanionSpots);
    }
  };

  const handleAuthSuccess = async (user: any) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
    setAuthDialogOpen(false);
    toast.success(`환영합니다, ${user.name}님!`);
    
    // Reload matches after login
    try {
      const matchData = await matchingApi.getMatches();
      if (matchData.matches) {
        setMatches(matchData.matches);
      }
    } catch (error) {
      console.error('Error loading matches:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.signOut();
      setIsLoggedIn(false);
      setCurrentUser(null);
      setMatches(sampleMatches); // Revert to sample data
      toast.success('로그아웃되었습니다.');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('로그아웃 중 오류가 발생했습니다.');
    }
  };

  // Helper functions for filtering
  const getPriceValue = (priceStr: string): number => {
    if (priceStr === "무료") return 0;
    const match = priceStr.match(/(\d+,?\d*)/);
    if (match) {
      return parseInt(match[1].replace(/,/g, ''));
    }
    return 0;
  };

  const isDateInRange = (dateStr: string, filter: string): boolean => {
    if (filter === "all") return true;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Parse date range
    const dates = dateStr.split(' - ').map(d => d.trim());
    const startDate = parseKoreanDate(dates[0]);
    
    if (!startDate) return true;
    
    switch (filter) {
      case "today":
        return startDate.getTime() === today.getTime();
      case "week":
        const weekFromNow = new Date(today);
        weekFromNow.setDate(weekFromNow.getDate() + 7);
        return startDate >= today && startDate <= weekFromNow;
      case "month":
        const monthFromNow = new Date(today);
        monthFromNow.setMonth(monthFromNow.getMonth() + 1);
        return startDate >= today && startDate <= monthFromNow;
      case "upcoming":
        const threeMonthsFromNow = new Date(today);
        threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
        return startDate >= today && startDate <= threeMonthsFromNow;
      default:
        return true;
    }
  };

  const parseKoreanDate = (dateStr: string): Date | null => {
    try {
      const match = dateStr.match(/(\d{4})\.(\d{1,2})\.(\d{1,2})/);
      if (match) {
        const year = parseInt(match[1]);
        const month = parseInt(match[2]) - 1;
        const day = parseInt(match[3]);
        return new Date(year, month, day);
      }
      return null;
    } catch {
      return null;
    }
  };

  const filteredPerformances = performances.filter((perf) => {
    // Search filter
    const matchesSearch = searchQuery === "" ||
      perf.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      perf.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      perf.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    // District filter
    const matchesDistrict = selectedDistrict === "all" || perf.district === selectedDistrict;
    
    // Category filter
    const matchesCategory = selectedCategory === "all" || perf.category === selectedCategory;
    
    // Price filter
    let matchesPrice = true;
    if (selectedPriceRange !== "all") {
      const price = getPriceValue(perf.price);
      switch (selectedPriceRange) {
        case "free":
          matchesPrice = price === 0;
          break;
        case "under10k":
          matchesPrice = price > 0 && price < 10000;
          break;
        case "10k-50k":
          matchesPrice = price >= 10000 && price < 50000;
          break;
        case "50k-100k":
          matchesPrice = price >= 50000 && price < 100000;
          break;
        case "over100k":
          matchesPrice = price >= 100000;
          break;
      }
    }
    
    // Date filter
    const matchesDate = isDateInRange(perf.date, selectedDateFilter);
    
    return matchesSearch && matchesDistrict && matchesCategory && matchesPrice && matchesDate;
  });

  const filteredPromotions = promotions.filter((promo) => {
    const matchesDistrict = selectedDistrict === "all" || promo.district === selectedDistrict;
    return matchesDistrict;
  });

  const handleViewDetails = (performance: Performance) => {
    setSelectedPerformance(performance);
    setDetailOpen(true);
  };

  const handleViewProfile = (user: UserMatch) => {
    setSelectedUser(user);
    setProfileOpen(true);
  };

  const handleLike = async (userId: string) => {
    if (!isLoggedIn) {
      toast.error("로그인이 필요합니다.");
      setAuthDialogOpen(true);
      return;
    }

    try {
      const result = await matchingApi.like(userId);
      if (result.success) {
        if (result.isMatch) {
          toast.success("🎉 매칭되었습니다! 메시지를 보낼 수 있어요.");
        } else {
          toast.success("❤️ 좋아요를 보냈습니다!");
        }
      }
    } catch (error) {
      console.error('Like error:', error);
      toast.error('좋아요 전송 중 오류가 발생했습니다.');
    }
  };

  const handleMessage = (userId: string) => {
    if (!isLoggedIn) {
      toast.error("로그인이 필요합니다.");
      setAuthDialogOpen(true);
      return;
    }
    toast.info("메시지 기능은 곧 출시됩니다!");
  };

  const handlePropose = (performance: Performance) => {
    if (!isLoggedIn) {
      toast.error("로그인이 필요합니다.");
      setAuthDialogOpen(true);
      return;
    }
    setProposalPerformance(performance);
    setProposalOpen(true);
  };

  const handleViewCompanionDetail = (spot: MuseCompanion) => {
    setSelectedSpot(spot);
    setSpotDetailOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (showHomePage) {
    return (
      <HomePage 
        onStart={() => setShowHomePage(false)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-purple-100 shadow-lg">
        <div className="container mx-auto px-4 py-3 lg:py-4 space-y-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <button 
              onClick={() => setShowHomePage(true)}
              className="flex items-center gap-2 min-w-0 group transition-all hover:scale-105"
            >
              <div className="relative">
                <Theater className="size-6 lg:size-8 text-transparent bg-gradient-to-r from-emerald-500 via-purple-500 to-pink-500 bg-clip-text shrink-0 group-hover:animate-pulse" />
                <div className="absolute inset-0 blur-lg bg-gradient-to-r from-emerald-500 via-purple-500 to-pink-500 opacity-20 group-hover:opacity-40 transition-opacity" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg lg:text-2xl truncate bg-gradient-to-r from-emerald-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Muse You</h1>
                <p className="text-xs lg:text-sm text-muted-foreground hidden sm:block">Find Your Cultural Muse</p>
              </div>
            </button>

            {/* Auth buttons */}
            <div className="flex items-center gap-2 shrink-0">
              {isLoggedIn && currentUser ? (
                <>
                  <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-50 to-purple-50 border border-purple-100">
                    <UserCircle className="size-4 text-purple-600" />
                    <span className="text-sm">{currentUser.name}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleLogout}
                    className="border-purple-200 hover:bg-purple-50 transition-all"
                  >
                    <LogOut className="size-4 sm:mr-2" />
                    <span className="hidden sm:inline">로그아웃</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => setShowHomePage(true)}
                    className="border-purple-200 hover:bg-purple-50 transition-all"
                  >
                    <span className="hidden sm:inline">Seoul Vibes</span>
                    <span className="sm:hidden">SV</span>
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => setAuthDialogOpen(true)}
                    className="bg-gradient-to-r from-emerald-500 via-purple-500 to-pink-500 hover:from-emerald-600 hover:via-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all"
                  >
                    <LogIn className="size-4 sm:mr-2" />
                    <span className="hidden sm:inline">로그인</span>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-purple-400" />
            <Input
              placeholder="공연, 전시, 장소 검색..."
              className="pl-10 border-purple-200 focus:border-purple-400 bg-white/50 backdrop-blur-sm transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4 lg:py-6">
        <Tabs defaultValue="performances" className="space-y-4 lg:space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-auto backdrop-blur-sm bg-white/60 border border-purple-100 shadow-md p-1">
            <TabsTrigger 
              value="performances" 
              className="flex-col sm:flex-row gap-1 sm:gap-2 py-2 sm:py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
            >
              <Music className="size-4" />
              <span className="text-xs sm:text-sm">공연·전시</span>
            </TabsTrigger>
            <TabsTrigger 
              value="matching" 
              className="flex-col sm:flex-row gap-1 sm:gap-2 py-2 sm:py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
            >
              <Heart className="size-4" />
              <span className="text-xs sm:text-sm">뮤즈찾기</span>
            </TabsTrigger>
            <TabsTrigger 
              value="companions" 
              className="flex-col sm:flex-row gap-1 sm:gap-2 py-2 sm:py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:via-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
            >
              <Users className="size-4" />
              <span className="text-xs sm:text-sm">Muse 동행자 찾기</span>
            </TabsTrigger>
            <TabsTrigger 
              value="promotions" 
              className="flex-col sm:flex-row gap-1 sm:gap-2 py-2 sm:py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
            >
              <Theater className="size-4" />
              <span className="text-xs sm:text-sm">지자체 홍보</span>
            </TabsTrigger>
          </TabsList>

          {/* Performances Tab */}
          <TabsContent value="performances" className="space-y-4">
            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Mobile Filter Button */}
              <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="sm:hidden border-purple-200">
                    <SlidersHorizontal className="size-4 mr-2" />
                    필터
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[80vh]">
                  <SheetHeader>
                    <SheetTitle>필터</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="text-sm mb-2 block">지역</label>
                      <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                        <SelectTrigger className="border-purple-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">전체 지역</SelectItem>
                          {districts.slice(1).map((district) => (
                            <SelectItem key={district} value={district}>{district}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm mb-2 block">카테고리</label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="border-purple-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">전체 카테고리</SelectItem>
                          {categories.slice(1).map((category) => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm mb-2 block">가격</label>
                      <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
                        <SelectTrigger className="border-purple-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {priceRanges.map((range) => (
                            <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm mb-2 block">기간</label>
                      <Select value={selectedDateFilter} onValueChange={setSelectedDateFilter}>
                        <SelectTrigger className="border-purple-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {dateFilters.map((filter) => (
                            <SelectItem key={filter.value} value={filter.value}>{filter.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      className="w-full bg-gradient-to-r from-emerald-500 to-purple-500"
                      onClick={() => setFiltersOpen(false)}
                    >
                      적용
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Desktop Filters */}
              <div className="hidden sm:flex items-center gap-2 flex-wrap flex-1">
                <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                  <SelectTrigger className="w-[140px] border-purple-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 지역</SelectItem>
                    {districts.slice(1).map((district) => (
                      <SelectItem key={district} value={district}>{district}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[140px] border-purple-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 카테고리</SelectItem>
                    {categories.slice(1).map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
                  <SelectTrigger className="w-[140px] border-purple-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priceRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedDateFilter} onValueChange={setSelectedDateFilter}>
                  <SelectTrigger className="w-[140px] border-purple-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dateFilters.map((filter) => (
                      <SelectItem key={filter.value} value={filter.value}>{filter.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              {(selectedDistrict !== "all" || selectedCategory !== "all" || selectedPriceRange !== "all" || selectedDateFilter !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedDistrict("all");
                    setSelectedCategory("all");
                    setSelectedPriceRange("all");
                    setSelectedDateFilter("all");
                  }}
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                >
                  <X className="size-4 mr-1" />
                  초기화
                </Button>
              )}
            </div>

            {/* Performance Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {filteredPerformances.map((performance) => (
                <PerformanceCard
                  key={performance.id}
                  performance={performance}
                  onViewDetails={handleViewDetails}
                  onPropose={handlePropose}
                />
              ))}
            </div>

            {filteredPerformances.length === 0 && (
              <div className="text-center py-12">
                <Palette className="size-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">검색 결과가 없습니다.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedDistrict("all");
                    setSelectedCategory("all");
                    setSelectedPriceRange("all");
                    setSelectedDateFilter("all");
                  }}
                >
                  필터 초기화
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Matching Tab */}
          <TabsContent value="matching" className="space-y-4">
            <div className="backdrop-blur-sm bg-white/60 border border-pink-100 rounded-xl p-4 lg:p-6 shadow-lg">
              <h2 className="text-transparent bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text mb-4">
                당신의 뮤즈를 찾아보세요
              </h2>
              <p className="text-muted-foreground text-sm">
                비슷한 관심사를 가진 사람들과 문화예술을 함께 즐기며, 영감을 주고받는 특별한 인연을 만나보세요.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {matches.map((user) => (
                <MatchingCard
                  key={user.id}
                  user={user}
                  onViewProfile={handleViewProfile}
                  onLike={handleLike}
                />
              ))}
            </div>
          </TabsContent>

          {/* Muse Companion Tab */}
          <TabsContent value="companions" className="space-y-4">
            <div className="backdrop-blur-sm bg-gradient-to-r from-emerald-50 via-purple-50 to-pink-50 border border-purple-100 rounded-xl p-4 lg:p-6 shadow-lg">
              <h2 className="text-transparent bg-gradient-to-r from-emerald-600 via-purple-600 to-pink-600 bg-clip-text mb-4">
                Muse 동행자 찾기
              </h2>
              <p className="text-muted-foreground text-sm">
                함께 문화예술을 즐길 동행자를 찾고, 특별한 혜택이 있는 프로그램을 확인해 보세요.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {companionSpots.map((spot) => (
                <MuseCompanionCard
                  key={spot.id}
                  spot={spot}
                  onViewDetails={handleViewCompanionDetail}
                />
              ))}
            </div>
          </TabsContent>

          {/* Promotions Tab */}
          <TabsContent value="promotions" className="space-y-4">
            <div className="backdrop-blur-sm bg-white/60 border border-purple-100 rounded-xl p-4 lg:p-6 shadow-lg">
              <h2 className="text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text mb-4">
                서울시 자치구별 문화예술 행사
              </h2>
              <p className="text-muted-foreground text-sm">
                각 자치구에서 진행하는 무료 공연, 축제, 문화 프로그램을 확인하세요.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {filteredPromotions.map((promotion) => (
                <PromotionCard key={promotion.id} promotion={promotion} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Dialogs */}
      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        onAuthSuccess={handleAuthSuccess}
      />

      {selectedPerformance && (
        <PerformanceDetail
          performance={selectedPerformance}
          open={detailOpen}
          onOpenChange={setDetailOpen}
        />
      )}

      {selectedUser && (
        <UserProfile
          user={selectedUser}
          open={profileOpen}
          onOpenChange={setProfileOpen}
          onLike={handleLike}
          onMessage={handleMessage}
        />
      )}

      {proposalPerformance && (
        <DateProposal
          performance={proposalPerformance}
          open={proposalOpen}
          onOpenChange={setProposalOpen}
        />
      )}

      {selectedSpot && (
        <MuseCompanionDetail
          spot={selectedSpot}
          open={spotDetailOpen}
          onOpenChange={setSpotDetailOpen}
        />
      )}
    </div>
  );
}