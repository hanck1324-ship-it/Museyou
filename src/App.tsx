import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Input } from "./components/ui/forms/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/forms/select";
import { Button } from "./components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./components/ui/sheet";
import { Search, Music, Theater, Palette, Heart, LogIn, LogOut, UserCircle, SlidersHorizontal, X, Users } from "lucide-react";
import { ThemeToggle } from "./components/common/ThemeToggle";
import { PerformanceCard, Performance } from "./components/performances/PerformanceCard";
import { PerformanceDetail } from "./components/performances/PerformanceDetail";
import { PromotionCard, Promotion } from "./components/promotions/PromotionCard";
import { MatchingCard, UserMatch } from "./components/matching/MatchingCard";
import { UserProfile } from "./components/matching/UserProfile";
import { AuthDialog } from "./components/auth/AuthDialog";
import { HomePage } from "./components/home/HomePage";
import { CartButton } from "./components/common/CartButton";
import { CartSheet } from "./components/common/CartSheet";
import { GroupPurchaseList } from "./components/group-purchases/GroupPurchaseList";
import { toast } from "sonner";
import { handleError, ErrorType } from "./lib/utils/errorHandler";
import {
  authApi,
  performanceApi,
  matchingApi,
  promotionApi,
  getAccessToken,
} from "./lib/api/api";

export default function App() {
  const navigate = useNavigate();
  // Page State
  const [showHomePage, setShowHomePage] = useState(true);

  // UI State
  const [selectedPerformance, setSelectedPerformance] = useState<Performance | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserMatch | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [likedPerformances, setLikedPerformances] = useState<Set<string>>(new Set());

  const districts = [
    "all",
    "강남구",
    "강동구",
    "강북구",
    "강서구",
    "관악구",
    "광진구",
    "구로구",
    "금천구",
    "노원구",
    "도봉구",
    "동대문구",
    "동작구",
    "마포구",
    "서대문구",
    "서초구",
    "성동구",
    "성북구",
    "송파구",
    "양천구",
    "영등포구",
    "용산구",
    "은평구",
    "종로구",
    "중구",
    "중랑구"
  ];
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
        
        // 좋아요한 공연 목록 로드
        await loadLikedPerformances();
      }

      // Load data from backend
      await loadData();
    } catch (error) {
      handleError(error, {
        showToast: true,
        logError: true,
        customMessage: '앱 초기화 중 오류가 발생했습니다.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadLikedPerformances = async () => {
    try {
      const likesData = await performanceApi.getLikes();
      if (likesData && likesData.likes) {
        // performance_id 또는 performanceId 모두 지원
        const likedIds = new Set(likesData.likes.map((like: any) => like.performance_id || like.performanceId));
        setLikedPerformances(likedIds);
      }
    } catch (error) {
      console.error('Error loading liked performances:', error);
      // 에러가 발생해도 앱은 계속 동작하도록 함
    }
  };

  const loadData = async () => {
    try {
      // Load performances from API
      const perfData = await performanceApi.getAll();
      if (perfData.performances) {
        setPerformances(perfData.performances);
      }

      // Load promotions from API
      const promoData = await promotionApi.getAll();
      if (promoData.promotions) {
        setPromotions(promoData.promotions);
      }

      // Load matches if logged in
      if (isLoggedIn) {
        const matchData = await matchingApi.getMatches();
        if (matchData.matches) {
          setMatches(matchData.matches);
        }
      }
    } catch (error) {
      handleError(error, {
        showToast: true,
        logError: true,
        customMessage: '데이터를 불러오는 중 오류가 발생했습니다.',
      });
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
      handleError(error, {
        showToast: false, // 조용히 처리 (로그인 성공 메시지가 이미 표시됨)
        logError: true,
      });
    }

    // 좋아요한 공연 목록 로드
    await loadLikedPerformances();
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
      setIsLoggedIn(false);
      setCurrentUser(null);
      setMatches([]); // Clear matches data
      setLikedPerformances(new Set()); // Clear liked performances
      toast.success('로그아웃되었습니다.');
    } catch (error) {
      handleError(error, {
        showToast: true,
        logError: true,
        customMessage: '로그아웃 중 오류가 발생했습니다.',
      });
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
      const result = await matchingApi.sendLike(userId);
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

  const handleToggleLike = async (performanceId: string) => {
    if (!isLoggedIn) {
      toast.error("로그인이 필요합니다.");
      setAuthDialogOpen(true);
      return;
    }

    try {
      const result = await performanceApi.toggleLike(performanceId);
      
      // 좋아요 상태 업데이트
      setLikedPerformances(prev => {
        const newSet = new Set(prev);
        if (newSet.has(performanceId)) {
          newSet.delete(performanceId);
          toast.success('좋아요를 취소했습니다.');
        } else {
          newSet.add(performanceId);
          toast.success('좋아요를 추가했습니다! ❤️');
        }
        return newSet;
      });
    } catch (error: any) {
      const errorInfo = handleError(error, {
        showToast: false, // 직접 처리
        logError: true,
      });

      // 인증 에러인 경우 로그인 다이얼로그 표시
      if (errorInfo.type === 'AUTH' || errorInfo.type === ErrorType.AUTH) {
        toast.error('로그인이 필요합니다.');
        setAuthDialogOpen(true);
      } else {
        toast.error(errorInfo.userMessage);
      }
      
      // 에러 발생 시 상태 롤백은 PerformanceCard에서 처리
      throw error;
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-purple-400 mx-auto"></div>
          <p className="text-muted-foreground dark:text-gray-400">로딩 중...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-b border-purple-100 dark:border-gray-700 shadow-lg">
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
              <ThemeToggle />
              <CartButton />
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/boards")}
                className="hidden sm:inline-flex border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30"
              >
                커뮤니티
              </Button>
              {isLoggedIn && currentUser ? (
                <>
                  <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-50 to-purple-50 dark:from-emerald-900/30 dark:to-purple-900/30 border border-purple-100 dark:border-purple-800">
                    <UserCircle className="size-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm dark:text-gray-200">{currentUser.name}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all"
                  >
                    <LogOut className="size-4 sm:mr-2" />
                    <span className="hidden sm:inline">로그아웃</span>
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  onClick={() => setAuthDialogOpen(true)}
                  className="bg-gradient-to-r from-emerald-500 via-purple-500 to-pink-500 hover:from-emerald-600 hover:via-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all"
                >
                  <LogIn className="size-4 sm:mr-2" />
                  <span className="hidden sm:inline">로그인</span>
                </Button>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-purple-400 dark:text-purple-500" />
            <Input
              placeholder="공연, 전시, 장소 검색..."
              className="pl-10 border-purple-200 dark:border-purple-800 focus:border-purple-400 dark:focus:border-purple-600 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4 lg:py-6">
        <Tabs defaultValue="performances" className="space-y-4 lg:space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border border-purple-100 dark:border-gray-700 shadow-md p-1">
            <TabsTrigger
              value="performances"
              className="flex-col sm:flex-row gap-1 sm:gap-2 py-2 sm:py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
            >
              <Music className="size-4" />
              <span className="text-xs sm:text-sm">공연·전시</span>
            </TabsTrigger>
            <TabsTrigger
              value="group-purchases"
              className="flex-col sm:flex-row gap-1 sm:gap-2 py-2 sm:py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
            >
              <Users className="size-4" />
              <span className="text-xs sm:text-sm">공동구매</span>
            </TabsTrigger>
            <TabsTrigger
              value="matching"
              className="flex-col sm:flex-row gap-1 sm:gap-2 py-2 sm:py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
            >
              <Heart className="size-4" />
              <span className="text-xs sm:text-sm">뮤즈찾기</span>
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
                  isLiked={likedPerformances.has(performance.id)}
                  onToggleLike={handleToggleLike}
                  isLoggedIn={isLoggedIn}
                />
              ))}
            </div>

            {filteredPerformances.length === 0 && (
              <div className="text-center py-12">
                <Palette className="size-12 mx-auto text-muted-foreground dark:text-gray-500 mb-4" />
                <p className="text-muted-foreground dark:text-gray-400">검색 결과가 없습니다.</p>
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
            <div className="backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border border-pink-100 dark:border-pink-900/50 rounded-xl p-4 lg:p-6 shadow-lg">
              <h2 className="text-transparent bg-gradient-to-r from-pink-600 to-rose-600 dark:from-pink-400 dark:to-rose-400 bg-clip-text mb-4">
                당신의 뮤즈를 찾아보세요
              </h2>
              <p className="text-muted-foreground dark:text-gray-400 text-sm">
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

          {/* Group Purchases Tab */}
          <TabsContent value="group-purchases" className="space-y-4">
            <GroupPurchaseList />
          </TabsContent>

          {/* Promotions Tab */}
          <TabsContent value="promotions" className="space-y-4">
            <div className="backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border border-purple-100 dark:border-purple-900/50 rounded-xl p-4 lg:p-6 shadow-lg">
              <h2 className="text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text mb-4">
                서울시 자치구별 문화예술 행사
              </h2>
              <p className="text-muted-foreground dark:text-gray-400 text-sm">
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

      {/* Cart Sheet */}
      <CartSheet />

    </div>
  );
}