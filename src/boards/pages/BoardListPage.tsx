import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/forms/input";
import { Calendar, Mail, RefreshCw, Search, Tag } from "lucide-react";
import { BoardPost, getBoardPosts } from "../data";

export default function BoardListPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BoardPost[]>(() => getBoardPosts());
  const [query, setQuery] = useState("");
  const [tagFilter, setTagFilter] = useState("전체");

  useEffect(() => {
    setPosts(getBoardPosts());
  }, []);

  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach((post) => post.tags.forEach((tag) => tagSet.add(tag)));
    return ["전체", ...Array.from(tagSet)];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesQuery =
        query.trim().length === 0 ||
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.summary.toLowerCase().includes(query.toLowerCase()) ||
        post.content.toLowerCase().includes(query.toLowerCase());
      const matchesTag = tagFilter === "전체" || post.tags.includes(tagFilter);
      return matchesQuery && matchesTag;
    });
  }, [posts, query, tagFilter]);

  const handleRefresh = () => {
    setPosts(getBoardPosts());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wide">Boards</p>
            <h1 className="text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-rose-500 to-amber-500">
              문화예술인 커뮤니티 게시판
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              공연/전시 홍보, 협업 제안, 지역 행사 소식을 자유롭게 공유해 주세요. Muse You 회원이라면 누구나 글을 작성할 수 있습니다.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="gap-2" onClick={() => navigate("/")}>
              홈으로
            </Button>
            <Button variant="outline" className="gap-2" onClick={handleRefresh}>
              <RefreshCw className="size-4" />
              새로고침
            </Button>
            <Button className="gap-2" onClick={() => navigate("/boards/new")}>
              <Tag className="size-4" />
              새 글 작성
            </Button>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-purple-400" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="키워드로 게시글 검색..."
              className="pl-10 border-purple-200 bg-white/80"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <Badge
                key={tag}
                variant={tagFilter === tag ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setTagFilter(tag)}
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-purple-200 bg-white/70 p-10 text-center">
            <p className="text-lg font-semibold text-purple-700 mb-2">조건에 맞는 게시글이 없습니다.</p>
            <p className="text-sm text-muted-foreground mb-4">필터를 초기화하거나 다른 검색어를 입력해 보세요.</p>
            <Button variant="outline" onClick={() => setTagFilter("전체")}>
              필터 초기화
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredPosts.map((post) => (
              <Card
                key={post.id}
                className="flex flex-col overflow-hidden border border-purple-100 hover:border-purple-300 transition-all bg-white/90 backdrop-blur"
              >
                {post.coverImage && (
                  <div className="h-40 overflow-hidden">
                    <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" />
                  </div>
                )}
                <CardHeader className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{post.category}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      {new Date(post.createdAt).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                  <button
                    className="text-left text-lg font-semibold hover:text-purple-600 transition-colors line-clamp-2"
                    onClick={() => navigate(`/boards/${post.id}`)}
                  >
                    {post.title}
                  </button>
                  <p className="text-sm text-muted-foreground line-clamp-3">{post.summary}</p>
                </CardHeader>
                <CardContent className="flex-1 space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground gap-2">
                    <Mail className="size-3" />
                    {post.contactEmail}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs bg-purple-50 text-purple-700 border-0">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => navigate(`/boards/${post.id}`)}>
                    자세히 보기
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

