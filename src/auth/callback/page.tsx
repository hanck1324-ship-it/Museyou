import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleOAuthCallback } from '../../lib/utils/socialAuth';
import { useAuthStore } from '../../store/useAuthStore';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const processCallback = async () => {
      try {
        const result = await handleOAuthCallback();
        
        if (result) {
          // 사용자 정보를 store에 저장
          setUser({
            id: result.user.id,
            email: result.user.email || '',
            name: result.user.user_metadata?.name || result.user.email?.split('@')[0] || '사용자',
          });
          
          setStatus('success');
          
          // 홈으로 리다이렉트
          setTimeout(() => {
            navigate('/');
          }, 1500);
        } else {
          setStatus('error');
          setErrorMessage('로그인 처리에 실패했습니다.');
        }
      } catch (error: any) {
        console.error('OAuth 콜백 처리 오류:', error);
        setStatus('error');
        setErrorMessage(error.message || '로그인 처리 중 오류가 발생했습니다.');
      }
    };

    processCallback();
  }, [navigate, setUser]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="text-center space-y-4">
          <Loader2 className="size-12 animate-spin text-purple-500 mx-auto" />
          <p className="text-lg font-medium text-gray-700">로그인 처리 중...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800">로그인 실패</h1>
          <p className="text-gray-600">{errorMessage}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="text-center space-y-4">
        <div className="text-green-500 text-6xl">✓</div>
        <h1 className="text-2xl font-bold text-gray-800">로그인 성공!</h1>
        <p className="text-gray-600">잠시 후 홈으로 이동합니다...</p>
      </div>
    </div>
  );
}
