import { toast } from 'sonner';

export interface ShareData {
  title: string;
  text: string;
  url: string;
}

/**
 * Web Share API를 사용하여 공유
 */
export async function shareContent(data: ShareData): Promise<boolean> {
  if (!navigator.share) {
    // Web Share API를 지원하지 않는 경우 링크 복사로 대체
    return copyToClipboard(data.url);
  }

  try {
    await navigator.share({
      title: data.title,
      text: data.text,
      url: data.url,
    });
    toast.success('공유되었습니다!');
    return true;
  } catch (error: unknown) {
    // 사용자가 공유를 취소한 경우는 에러로 처리하지 않음
    if (error instanceof Error && error.name === 'AbortError') {
      return false;
    }
    // 다른 에러는 링크 복사로 대체
    console.error('공유 실패:', error);
    return copyToClipboard(data.url);
  }
}

/**
 * 클립보드에 텍스트 복사
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    toast.success('링크가 복사되었습니다!');
    return true;
  } catch (error) {
    console.error('복사 실패:', error);
    toast.error('링크 복사에 실패했습니다.');
    return false;
  }
}

/**
 * 카카오톡 공유 (카카오 SDK 사용 시)
 */
export function shareToKakao(data: ShareData): void {
  // 카카오 SDK가 설정되어 있는 경우
  if (window.Kakao && window.Kakao.isInitialized()) {
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: data.title,
        description: data.text,
        imageUrl: '', // 이미지 URL 추가 가능
        link: {
          mobileWebUrl: data.url,
          webUrl: data.url,
        },
      },
    });
  } else {
    // 카카오 SDK가 없는 경우 일반 공유로 대체
    shareContent(data);
  }
}

/**
 * 페이스북 공유
 */
export function shareToFacebook(url: string): void {
  const encodedUrl = encodeURIComponent(url);
  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    '_blank',
    'width=600,height=400'
  );
}

/**
 * 트위터 공유
 */
export function shareToTwitter(data: ShareData): void {
  const text = encodeURIComponent(`${data.title} - ${data.text}`);
  const url = encodeURIComponent(data.url);
  window.open(
    `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
    '_blank',
    'width=600,height=400'
  );
}

// Kakao 타입 선언 (선택사항)
declare global {
  interface Window {
    Kakao?: {
      isInitialized: () => boolean;
      Share: {
        sendDefault: (options: unknown) => void;
      };
    };
  }
}
