/**
 * 이미지 최적화 유틸리티
 */

/**
 * 이미지 URL에 최적화 파라미터 추가
 * @param url 원본 이미지 URL
 * @param options 최적화 옵션
 * @returns 최적화된 이미지 URL
 */
export function getOptimizedImageUrl(
  url: string,
  options: {
    width?: number
    height?: number
    quality?: number
    format?: 'webp' | 'jpg' | 'png'
  } = {}
): string {
  if (!url) return url

  // data URL이나 blob URL은 그대로 반환
  if (url.startsWith('data:') || url.startsWith('blob:')) {
    return url
  }

  try {
    const urlObj = new URL(url)
    const { width, height, quality = 80, format = 'webp' } = options

    // 이미 최적화 파라미터가 있는 경우 기존 파라미터 유지
    if (width) urlObj.searchParams.set('w', width.toString())
    if (height) urlObj.searchParams.set('h', height.toString())
    if (quality) urlObj.searchParams.set('q', quality.toString())
    if (format) urlObj.searchParams.set('format', format)

    return urlObj.toString()
  } catch {
    // URL 파싱 실패 시 원본 반환
    return url
  }
}

/**
 * 반응형 이미지 srcset 생성
 * @param url 원본 이미지 URL
 * @param widths 이미지 너비 배열
 * @param format 이미지 포맷
 * @returns srcset 문자열
 */
export function generateSrcSet(
  url: string,
  widths: number[] = [300, 600, 1200],
  format: 'webp' | 'jpg' | 'png' = 'webp'
): string {
  if (!url || url.startsWith('data:') || url.startsWith('blob:')) {
    return ''
  }

  try {
    return widths
      .map((width) => {
        const optimizedUrl = getOptimizedImageUrl(url, { width, format })
        return `${optimizedUrl} ${width}w`
      })
      .join(', ')
  } catch {
    return ''
  }
}

/**
 * 이미지 크기별 URL 생성
 */
export const IMAGE_SIZES = {
  thumbnail: { width: 150, height: 150 },
  small: { width: 300, height: 200 },
  medium: { width: 600, height: 400 },
  large: { width: 1200, height: 800 },
} as const

/**
 * 이미지 크기 타입
 */
export type ImageSize = keyof typeof IMAGE_SIZES

/**
 * 크기별 최적화된 이미지 URL 생성
 * @param url 원본 이미지 URL
 * @param size 이미지 크기
 * @param format 이미지 포맷
 * @returns 최적화된 이미지 URL
 */
export function getImageBySize(
  url: string,
  size: ImageSize = 'medium',
  format: 'webp' | 'jpg' | 'png' = 'webp'
): string {
  const dimensions = IMAGE_SIZES[size]
  return getOptimizedImageUrl(url, {
    ...dimensions,
    format,
  })
}

/**
 * 이미지 캐싱 전략
 * - 브라우저 캐싱: Cache-Control 헤더 활용
 * - Service Worker: 필요시 구현
 * - Preload: 중요한 이미지에만 적용
 */
export const IMAGE_CACHE_STRATEGY = {
  // 정적 이미지: 1년 캐싱
  static: 'public, max-age=31536000, immutable',
  // 동적 이미지: 1시간 캐싱
  dynamic: 'public, max-age=3600',
  // 사용자 업로드 이미지: 1일 캐싱
  userUpload: 'public, max-age=86400',
} as const

/**
 * 이미지가 캐시 가능한지 확인
 * @param url 이미지 URL
 * @returns 캐시 가능 여부
 */
export function isCacheable(url: string): boolean {
  if (!url) return false
  // data URL이나 blob URL은 캐시 불가
  if (url.startsWith('data:') || url.startsWith('blob:')) {
    return false
  }
  return true
}

/**
 * 이미지 프리로드 (중요한 이미지에만 사용)
 * @param url 이미지 URL
 * @param as 이미지 타입
 */
export function preloadImage(url: string, as: 'image' = 'image'): void {
  if (typeof window === 'undefined' || !url) return

  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = as
  link.href = url
  document.head.appendChild(link)
}
