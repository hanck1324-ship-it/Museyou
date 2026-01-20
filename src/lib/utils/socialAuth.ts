import { projectId, publicAnonKey } from '../supabase/config';
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Supabase 클라이언트 생성
const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

export type SocialProvider = 'google' | 'kakao' | 'naver';

export interface SocialAuthOptions {
  redirectTo?: string;
}

/**
 * 소셜 로그인 시작
 */
export async function signInWithSocial(
  provider: SocialProvider,
  options?: SocialAuthOptions
): Promise<void> {
  try {
    const redirectTo = options?.redirectTo || `${window.location.origin}/auth/callback`;
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error(`${provider} 로그인 오류:`, error);
      toast.error(`${provider} 로그인에 실패했습니다: ${error.message}`);
      throw error;
    }

    // OAuth는 리다이렉트되므로 여기서는 성공 메시지만 표시
    toast.info(`${provider} 로그인 페이지로 이동합니다...`);
  } catch (error) {
    console.error('소셜 로그인 오류:', error);
    throw error;
  }
}

/**
 * 구글 로그인
 */
export async function signInWithGoogle(options?: SocialAuthOptions): Promise<void> {
  return signInWithSocial('google', options);
}

/**
 * 카카오 로그인
 */
export async function signInWithKakao(options?: SocialAuthOptions): Promise<void> {
  return signInWithSocial('kakao', options);
}

/**
 * 네이버 로그인
 */
export async function signInWithNaver(options?: SocialAuthOptions): Promise<void> {
  return signInWithSocial('naver', options);
}

/**
 * OAuth 콜백 처리 (리다이렉트 후)
 */
export async function handleOAuthCallback(): Promise<{
  user: any;
  session: any;
} | null> {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('세션 가져오기 오류:', error);
      toast.error('로그인 처리 중 오류가 발생했습니다.');
      return null;
    }

    if (data.session) {
      // 세션 저장
      localStorage.setItem('access_token', data.session.access_token);
      
      toast.success('로그인 성공!');
      return {
        user: data.session.user,
        session: data.session,
      };
    }

    return null;
  } catch (error) {
    console.error('OAuth 콜백 처리 오류:', error);
    toast.error('로그인 처리 중 오류가 발생했습니다.');
    return null;
  }
}

/**
 * 현재 세션 확인
 */
export async function getCurrentSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('세션 확인 오류:', error);
      return null;
    }

    return data.session;
  } catch (error) {
    console.error('세션 확인 오류:', error);
    return null;
  }
}

/**
 * 로그아웃
 */
export async function signOut(): Promise<void> {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('로그아웃 오류:', error);
      toast.error('로그아웃에 실패했습니다.');
      throw error;
    }

    localStorage.removeItem('access_token');
    toast.success('로그아웃되었습니다.');
  } catch (error) {
    console.error('로그아웃 오류:', error);
    throw error;
  }
}
