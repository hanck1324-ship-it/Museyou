import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Calendar, ArrowLeft, Mail, Link as LinkIcon } from "lucide-react";
import { BoardPost, getBoardById } from "../data";

export default function BoardDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BoardPost | null>(null);

  useEffect(() => {
    if (!id) return;
    const data = getBoardById(id);
    setPost(data ?? null);
  }, [id]);

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 flex items-center justify-center px-4">
        <Card className="max-w-lg w-full text-center space-y-4 p-6">
          <CardHeader>
            <h1 className="text-2xl font-semibold text-purple-700">게시글을 찾을 수 없습니다.</h1>
            <p className="text-muted-foreground text-sm">
              링크가 만료되었거나 삭제된 게시글일 수 있습니다. 게시판 목록으로 돌아가 다시 확인해 주세요.
            </p>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/boards")} className="w-full">
              게시판으로 돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50/30">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <Button variant="outline" className="gap-2" onClick={() => navigate(-1)}>
            <ArrowLeft className="size-4" />
            뒤로 가기
          </Button>
          <Button variant="outline" onClick={() => navigate("/boards")}>
            목록 보기
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[3fr_1fr]">
          <article className="space-y-6">
            {post.coverImage && (
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full rounded-3xl shadow-lg border border-purple-100"
              />
            )}

            <div className="space-y-3">
              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary">{post.category}</Badge>
                <span className="flex items-center gap-1">
                  <Calendar className="size-4" />
                  {new Date(post.createdAt).toLocaleString("ko-KR", {
                    dateStyle: "long",
                    timeStyle: "short",
                  })}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900">{post.title}</h1>
              <p className="text-lg text-slate-600">{post.summary}</p>

              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-0">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="bg-white/90 rounded-3xl border border-purple-100 p-6 shadow-sm space-y-4 leading-relaxed text-slate-700">
              {post.content.split("\n").map((paragraph, index) => (
                <p key={index} className="whitespace-pre-wrap">
                  {paragraph}
                </p>
              ))}
            </div>
          </article>

            <aside className="space-y-4">
              <Card className="border-purple-100 bg-white/90">
                <CardHeader>
                  <h2 className="text-lg font-semibold">작성자 정보</h2>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">작성자</p>
                    <p className="font-medium">{post.author}</p>
                  </div>
                  {post.organization && (
                    <div>
                      <p className="text-muted-foreground">소속/단체</p>
                      <p className="font-medium">{post.organization}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Mail className="size-4 text-purple-500" />
                    <a href={`mailto:${post.contactEmail}`} className="text-purple-600 hover:underline">
                      {post.contactEmail}
                    </a>
                  </div>
                  {post.contactLink && (
                    <div className="flex items-center gap-2">
                      <LinkIcon className="size-4 text-purple-500" />
                      <a href={post.contactLink} target="_blank" rel="noreferrer" className="text-purple-600 hover:underline">
                        신청/자세히 보기
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            </aside>
        </div>
      </div>
    </div>
  );
}


