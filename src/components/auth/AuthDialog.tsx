import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { LogIn, UserPlus } from "lucide-react";
import { authApi } from "../../lib/api/api";
import { toast } from "sonner@2.0.3";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthSuccess: () => void;
}

export function AuthDialog({ open, onOpenChange, onAuthSuccess }: AuthDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup form
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupAge, setSignupAge] = useState("");
  const [signupGender, setSignupGender] = useState("");
  const [signupLocation, setSignupLocation] = useState("");
  const [signupBio, setSignupBio] = useState("");
  const [signupUserType, setSignupUserType] = useState<"single" | "couple">("single");
  const [signupInterests, setSignupInterests] = useState<string[]>([]);

  const availableInterests = ["클래식", "연극", "뮤지컬", "무용", "전통예술", "전시", "재즈", "팝", "힙합"];
  const districts = ["강남구", "강북구", "종로구", "중구", "용산구", "서초구", "마포구", "송파구", "성북구", "영등포구"];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail || !loginPassword) {
      toast.error("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      await authApi.login(loginEmail, loginPassword);
      toast.success("로그인 성공!");
      onAuthSuccess();
      onOpenChange(false);
      
      // Reset form
      setLoginEmail("");
      setLoginPassword("");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "로그인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!signupEmail || !signupPassword || !signupName || !signupAge || !signupGender) {
      toast.error("필수 항목을 모두 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await authApi.signup({
        email: signupEmail,
        password: signupPassword,
        name: signupName,
        age: parseInt(signupAge),
        gender: signupGender,
        location: signupLocation,
        bio: signupBio,
        interests: signupInterests,
        userType: signupUserType,
      });

      toast.success("회원가입 성공! 자동으로 로그인됩니다.");
      
      // Auto login after signup
      await authApi.login(signupEmail, signupPassword);
      onAuthSuccess();
      onOpenChange(false);

      // Reset form
      setSignupEmail("");
      setSignupPassword("");
      setSignupName("");
      setSignupAge("");
      setSignupGender("");
      setSignupLocation("");
      setSignupBio("");
      setSignupInterests([]);
      setSignupUserType("single");
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "회원가입에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleInterest = (interest: string) => {
    if (signupInterests.includes(interest)) {
      setSignupInterests(signupInterests.filter(i => i !== interest));
    } else {
      setSignupInterests([...signupInterests, interest]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>서울 문화예술 로그인</DialogTitle>
          <DialogDescription>
            문화 데이트 매칭과 커플 추천을 이용하려면 로그인하세요
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "signup")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">
              <LogIn className="size-4 mr-2" />
              로그인
            </TabsTrigger>
            <TabsTrigger value="signup">
              <UserPlus className="size-4 mr-2" />
              회원가입
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">이메일</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="이메일을 입력하세요"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">비밀번호</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "로그인 중..." : "로그인"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">이메일 *</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="이메일을 입력하세요"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">비밀번호 *</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="비밀번호를 입력하세요 (최소 6자)"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  minLength={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-name">이름 *</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="이름을 입력하세요"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="signup-age">나이 *</Label>
                  <Input
                    id="signup-age"
                    type="number"
                    placeholder="나이"
                    value={signupAge}
                    onChange={(e) => setSignupAge(e.target.value)}
                    disabled={isLoading}
                    required
                    min={18}
                    max={100}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-gender">성별 *</Label>
                  <Select value={signupGender} onValueChange={setSignupGender} disabled={isLoading} required>
                    <SelectTrigger id="signup-gender">
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="남성">남성</SelectItem>
                      <SelectItem value="여성">여성</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-usertype">회원 유형</Label>
                <Select value={signupUserType} onValueChange={(v) => setSignupUserType(v as "single" | "couple")} disabled={isLoading}>
                  <SelectTrigger id="signup-usertype">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">싱글 (매칭 찾기)</SelectItem>
                    <SelectItem value="couple">커플 (데이트 추천)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-location">지역</Label>
                <Select value={signupLocation} onValueChange={setSignupLocation} disabled={isLoading}>
                  <SelectTrigger id="signup-location">
                    <SelectValue placeholder="선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map((district) => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>관심 장르</Label>
                <div className="flex flex-wrap gap-2">
                  {availableInterests.map((interest) => (
                    <Badge
                      key={interest}
                      variant={signupInterests.includes(interest) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleInterest(interest)}
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-bio">자기소개</Label>
                <Input
                  id="signup-bio"
                  type="text"
                  placeholder="간단한 자기소개를 입력하세요"
                  value={signupBio}
                  onChange={(e) => setSignupBio(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "회원가입 중..." : "회원가입"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
