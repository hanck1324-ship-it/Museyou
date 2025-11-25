import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { CheckCircle2, XCircle, Loader2, RefreshCw } from "lucide-react";
import { testSupabaseConnection, ConnectionTestResult } from "../../lib/api/test-connection";

export default function ConnectionTestPage() {
  const [results, setResults] = useState<ConnectionTestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastTestTime, setLastTestTime] = useState<Date | null>(null);

  const runTest = async () => {
    setIsLoading(true);
    try {
      const testResults = await testSupabaseConnection();
      setResults(testResults);
      setLastTestTime(new Date());
    } catch (error) {
      console.error('테스트 실행 중 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 페이지 로드 시 자동으로 테스트 실행
    runTest();
  }, []);

  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  const allPassed = successCount === totalCount && totalCount > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-emerald-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 헤더 */}
        <div className="backdrop-blur-sm bg-white/60 border border-purple-100 rounded-xl p-4 lg:p-6 shadow-lg">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text mb-2">
            Supabase 연결 테스트
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Supabase 서버 연결 상태를 확인합니다.
          </p>
        </div>

        {/* 테스트 버튼 */}
        <Card className="backdrop-blur-sm bg-white/60 border border-purple-100">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>연결 테스트</CardTitle>
              <Button 
                onClick={runTest} 
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    테스트 중...
                  </>
                ) : (
                  <>
                    <RefreshCw className="size-4 mr-2" />
                    다시 테스트
                  </>
                )}
              </Button>
            </div>
            {lastTestTime && (
              <p className="text-xs text-muted-foreground">
                마지막 테스트: {lastTestTime.toLocaleString('ko-KR')}
              </p>
            )}
          </CardHeader>
        </Card>

        {/* 결과 요약 */}
        {results.length > 0 && (
          <Card className="backdrop-blur-sm bg-white/60 border border-purple-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                테스트 결과 요약
                {allPassed ? (
                  <Badge className="bg-green-500 text-white">
                    <CheckCircle2 className="size-3 mr-1" />
                    모든 테스트 통과
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <XCircle className="size-3 mr-1" />
                    {successCount}/{totalCount} 통과
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 ${
                      result.success
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {result.success ? (
                          <CheckCircle2 className="size-5 text-green-600" />
                        ) : (
                          <XCircle className="size-5 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm sm:text-base mb-1">
                          {index + 1}. {result.test}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {result.message}
                        </p>
                        {result.details && (
                          <div className="mt-2 p-2 bg-white/60 rounded text-xs font-mono">
                            <pre className="whitespace-pre-wrap">
                              {JSON.stringify(result.details, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 안내 */}
        <Card className="backdrop-blur-sm bg-white/60 border border-purple-100">
          <CardHeader>
            <CardTitle>테스트 항목</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• <strong>Supabase Client 초기화:</strong> 클라이언트가 올바르게 생성되었는지 확인</li>
              <li>• <strong>Supabase 서버 연결:</strong> Supabase 서버에 연결할 수 있는지 확인</li>
              <li>• <strong>Edge Functions 엔드포인트:</strong> API 엔드포인트가 응답하는지 확인</li>
              <li>• <strong>프로젝트 설정:</strong> 프로젝트 ID와 공개 키가 설정되어 있는지 확인</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


