import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/forms/input";
import { Textarea } from "../../components/ui/forms/textarea";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { addBoardPost, BoardPost } from "../data";
import { toast } from "sonner";

export default function BoardNewPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState("협업 제안");
  const [tags, setTags] = useState("공연,전시");
  const [author, setAuthor] = useState("");
  const [organization, setOrganization] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactLink, setContactLink] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !summary.trim() || !content.trim() || !contactEmail.trim()) {
      toast.error("필수 항목을 모두 입력해 주세요.");
      return;
    }

    const newPost: BoardPost = {
      id: `${title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
      title: title.trim(),
      summary: summary.trim(),
      category,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      author: author || "익명",
      organization: organization || undefined,
      contactEmail: contactEmail.trim(),
      contactLink: contactLink || undefined,
      coverImage: coverImage || undefined,
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    addBoardPost(newPost);
    toast.success("게시글이 저장되었습니다!");
    navigate(`/boards/${newPost.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-purple-50/60">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wide">Create</p>
            <h1 className="text-3xl font-bold text-purple-700">새 게시글 작성</h1>
            <p className="text-muted-foreground">
              함께 공유할 프로젝트/행사 정보를 입력해 주세요. 최소한의 항목만 작성해도 등록할 수 있어요.
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/boards")}>
            게시판으로 돌아가기
          </Button>
        </div>

        <Card className="bg-white/90 shadow-xl border border-purple-100">
          <CardHeader>
            <h2 className="text-xl font-semibold">기본 정보</h2>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">제목 *</label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="글 제목을 입력해 주세요" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">카테고리</label>
                  <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="예: 협업 제안 / 행사 안내" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">요약 *</label>
                <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="한 문장으로 내용을 요약해 주세요" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">본문 *</label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  placeholder="행사 정보나 협업 제안 내용을 자세히 작성해 주세요"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">작성자</label>
                  <Input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="이름 또는 닉네임" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">소속/단체</label>
                  <Input value={organization} onChange={(e) => setOrganization(e.target.value)} placeholder="선택 사항" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">연락 이메일 *</label>
                  <Input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} type="email" placeholder="example@museyou.kr" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">외부 링크</label>
                  <Input value={contactLink} onChange={(e) => setContactLink(e.target.value)} placeholder="지원서/상세 페이지 링크" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">태그</label>
                  <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="쉼표로 구분 (예: 공연,전시,모집)" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">대표 이미지 URL</label>
                  <Input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://images.unsplash.com/..." />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => navigate("/boards")}>
                  취소
                </Button>
                <Button type="submit">등록하기</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


