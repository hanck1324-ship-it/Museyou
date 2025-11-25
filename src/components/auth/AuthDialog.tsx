import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/forms/input";
import { Label } from "../ui/forms/label";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/forms/select";
import { Switch } from "../ui/forms/switch";
import { Badge } from "../ui/badge";
import { LogIn, UserPlus, Palette } from "lucide-react";
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
  const [signupType, setSignupType] = useState<"general" | "artist">("general");

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
  const [signupInterests, setSignupInterests] = useState<string[]>([]);
  const [signupMeetingStyle, setSignupMeetingStyle] = useState("");

  // Identity verification fields
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [agreeToVerification, setAgreeToVerification] = useState(false);

  // Artist-specific fields
  const [isArtist, setIsArtist] = useState(false);
  const [artistProfession, setArtistProfession] = useState("");
  const [artistOrganization, setArtistOrganization] = useState("");
  const [artistVerificationMethod, setArtistVerificationMethod] = useState<"email" | "document" | "">("");
  const [artistOrganizationEmail, setArtistOrganizationEmail] = useState("");
  const [artistVerificationDocument, setArtistVerificationDocument] = useState<File | null>(null);

  const availableInterests = ["클래식", "연극", "뮤지컬", "무용", "전통예술", "전시", "재즈", "팝", "힙합"];
  const districts = ["강남구", "강북구", "종로구", "중구", "용산구", "서초구", "마포구", "송파구", "성북구", "영등포구"];
  const artistProfessions = ["배우", "가수", "무용가", "화가", "조각가", "사진작가", "영화감독", "음악가", "작곡가", "안무가", "기타"];
  const meetingStyles = ["조용한 대화", "활발한 토론", "함께 감상", "심도있는 분석", "편안한 분위기", "혼자가 편해요"];

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

  const handleSendVerificationCode = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("올바른 휴대폰 번호를 입력해주세요.");
      return;
    }

    // TODO: 실제 SMS 인증 API 연동
    toast.success("인증번호가 발송되었습니다.");
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      toast.error("인증번호를 입력해주세요.");
      return;
    }

    // TODO: 실제 인증번호 확인 API 연동
    // 임시로 성공 처리
    setIsPhoneVerified(true);
    toast.success("휴대폰 인증이 완료되었습니다.");
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!signupEmail || !signupPassword || !signupName) {
      toast.error("필수 항목을 모두 입력해주세요.");
      return;
    }

    // 일반 회원 필수 항목
    if (!isArtist && (!signupAge || !signupGender)) {
      toast.error("나이와 성별을 입력해주세요.");
      return;
    }

    // 예술종사자 필수 항목
    if (isArtist) {
      if (!artistProfession || !artistOrganization) {
        toast.error("예술 분야와 소속 기관을 입력해주세요.");
        return;
      }
      if (!artistVerificationMethod) {
        toast.error("인증 방법을 선택해주세요.");
        return;
      }
      if (artistVerificationMethod === "email" && !artistOrganizationEmail) {
        toast.error("기관 이메일을 입력해주세요.");
        return;
      }
      if (artistVerificationMethod === "document" && !artistVerificationDocument) {
        toast.error("증빙서류를 업로드해주세요.");
        return;
      }
    }

    if (!phoneNumber || !isPhoneVerified) {
      toast.error("휴대폰 인증을 완료해주세요.");
      return;
    }

    if (!agreeToVerification) {
      toast.error("신원 확인 및 개인정보 처리에 동의해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const signupData: any = {
        email: signupEmail,
        password: signupPassword,
        name: signupName,
        phoneNumber,
        isPhoneVerified,
        isArtist,
      };

      // 일반 회원 데이터
      if (!isArtist) {
        signupData.age = parseInt(signupAge);
        signupData.gender = signupGender;
        signupData.location = signupLocation;
        signupData.bio = signupBio;
        signupData.interests = signupInterests;
        signupData.meetingStyle = signupMeetingStyle;
      }

      // 예술종사자 데이터
      if (isArtist) {
        signupData.artistProfession = artistProfession;
        signupData.artistOrganization = artistOrganization;
        signupData.artistVerificationMethod = artistVerificationMethod;
        if (artistVerificationMethod === "email") {
          signupData.artistOrganizationEmail = artistOrganizationEmail;
        }
        // TODO: document upload 처리
        if (artistVerificationMethod === "document" && artistVerificationDocument) {
          signupData.artistVerificationDocument = artistVerificationDocument.name;
        }
      }

      const result = await authApi.signup(signupData);

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
      setSignupMeetingStyle("");
      setPhoneNumber("");
      setVerificationCode("");
      setIsPhoneVerified(false);
      setAgreeToVerification(false);
      setIsArtist(false);
      setArtistProfession("");
      setArtistOrganization("");
      setArtistVerificationMethod("");
      setArtistOrganizationEmail("");
      setArtistVerificationDocument(null);
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
            {/* Signup Type Selection */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                type="button"
                onClick={() => {
                  setSignupType("general");
                  setIsArtist(false);
                }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  signupType === "general"
                    ? "border-purple-600 bg-purple-50 shadow-md"
                    : "border-gray-200 hover:border-purple-300"
                }`}
              >
                <UserPlus className="size-6 mx-auto mb-2 text-purple-600" />
                <div className="font-medium">일반 회원</div>
                <p className="text-xs text-muted-foreground mt-1">문화 데이트 매칭</p>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSignupType("artist");
                  setIsArtist(true);
                }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  signupType === "artist"
                    ? "border-purple-600 bg-purple-50 shadow-md"
                    : "border-gray-200 hover:border-purple-300"
                }`}
              >
                <Palette className="size-6 mx-auto mb-2 text-purple-600" />
                <div className="font-medium">예술 종사자</div>
                <p className="text-xs text-muted-foreground mt-1">예술가 전용 회원가입</p>
              </button>
            </div>

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

              {/* Identity Verification Section */}
              <div className="space-y-3 p-4 rounded-lg border border-blue-200 bg-blue-50/50">
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-900 mb-1">본인 인증 (필수)</h4>
                    <p className="text-xs text-blue-700">
                      회원님의 안전한 만남을 위해 휴대폰 본인 인증이 필요합니다.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone-number">휴대폰 번호 *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="phone-number"
                      type="tel"
                      placeholder="010-0000-0000"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      disabled={isLoading || isPhoneVerified}
                      required
                      className={isPhoneVerified ? "bg-green-50" : ""}
                    />
                    <Button
                      type="button"
                      onClick={handleSendVerificationCode}
                      disabled={isLoading || isPhoneVerified || !phoneNumber}
                      variant="outline"
                      className="whitespace-nowrap"
                    >
                      {isPhoneVerified ? "인증완료" : "인증번호"}
                    </Button>
                  </div>
                </div>

                {phoneNumber && !isPhoneVerified && (
                  <div className="space-y-2">
                    <Label htmlFor="verification-code">인증번호</Label>
                    <div className="flex gap-2">
                      <Input
                        id="verification-code"
                        type="text"
                        placeholder="인증번호 6자리"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        disabled={isLoading}
                        maxLength={6}
                      />
                      <Button
                        type="button"
                        onClick={handleVerifyCode}
                        disabled={isLoading || !verificationCode}
                        variant="outline"
                        className="whitespace-nowrap"
                      >
                        확인
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="agree-verification"
                    checked={agreeToVerification}
                    onChange={(e) => setAgreeToVerification(e.target.checked)}
                    className="mt-1"
                  />
                  <label htmlFor="agree-verification" className="text-xs text-blue-700 cursor-pointer">
                    신원 확인 및 개인정보 수집·이용에 동의합니다. (필수)
                    <br />
                    <span className="text-blue-600">
                      안전한 만남을 위해 실명과 휴대폰 번호가 확인됩니다.
                    </span>
                  </label>
                </div>
              </div>

              {signupType === "artist" ? (
                <>
                  {/* 예술종사자 전용 필드 */}
                  <div className="space-y-3 p-4 rounded-lg border border-purple-200 bg-purple-50/50">
                    <h4 className="font-medium text-purple-900 mb-2">예술종사자 인증</h4>

                    <div className="space-y-2">
                      <Label htmlFor="artist-profession">예술 분야 *</Label>
                      <Select value={artistProfession} onValueChange={setArtistProfession} disabled={isLoading}>
                        <SelectTrigger id="artist-profession">
                          <SelectValue placeholder="분야를 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          {artistProfessions.map((profession) => (
                            <SelectItem key={profession} value={profession}>
                              {profession}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="artist-organization">소속 기관명 *</Label>
                      <Input
                        id="artist-organization"
                        type="text"
                        placeholder="예: 국립극단, 서울시립교향악단 등"
                        value={artistOrganization}
                        onChange={(e) => setArtistOrganization(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>인증 방법 *</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setArtistVerificationMethod("email")}
                          className={`p-3 rounded-lg border-2 text-sm transition-all ${
                            artistVerificationMethod === "email"
                              ? "border-purple-600 bg-purple-100"
                              : "border-gray-200 hover:border-purple-300"
                          }`}
                        >
                          기관 이메일 인증
                        </button>
                        <button
                          type="button"
                          onClick={() => setArtistVerificationMethod("document")}
                          className={`p-3 rounded-lg border-2 text-sm transition-all ${
                            artistVerificationMethod === "document"
                              ? "border-purple-600 bg-purple-100"
                              : "border-gray-200 hover:border-purple-300"
                          }`}
                        >
                          증빙서류 업로드
                        </button>
                      </div>
                    </div>

                    {artistVerificationMethod === "email" && (
                      <div className="space-y-2">
                        <Label htmlFor="artist-email">기관 이메일 *</Label>
                        <Input
                          id="artist-email"
                          type="email"
                          placeholder="예: name@organization.or.kr"
                          value={artistOrganizationEmail}
                          onChange={(e) => setArtistOrganizationEmail(e.target.value)}
                          disabled={isLoading}
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          소속 기관의 공식 이메일 주소를 입력해주세요.
                        </p>
                      </div>
                    )}

                    {artistVerificationMethod === "document" && (
                      <div className="space-y-2">
                        <Label htmlFor="artist-document">증빙서류 업로드 *</Label>
                        <Input
                          id="artist-document"
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setArtistVerificationDocument(file);
                          }}
                          disabled={isLoading}
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          재직증명서, 작가 등록증, 소속 확인서 등을 업로드해주세요.
                        </p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* 일반 회원 전용 필드 */}
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
                    <Label htmlFor="signup-meetingstyle">선호하는 만남 스타일</Label>
                    <Select value={signupMeetingStyle} onValueChange={setSignupMeetingStyle} disabled={isLoading}>
                      <SelectTrigger id="signup-meetingstyle">
                        <SelectValue placeholder="선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {meetingStyles.map((style) => (
                          <SelectItem key={style} value={style}>
                            {style}
                          </SelectItem>
                        ))}
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
                </>
              )}

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
