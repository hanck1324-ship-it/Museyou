import React, { useState, useMemo } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /**
   * 이미지 크기 타입 (srcset 생성에 사용)
   * - 'small': 300px
   * - 'medium': 600px
   * - 'large': 1200px
   * - 'auto': 모든 크기 포함
   */
  size?: 'small' | 'medium' | 'large' | 'auto'
  /**
   * WebP 형식 사용 여부 (기본: true)
   */
  useWebP?: boolean
  /**
   * Lazy loading 사용 여부 (기본: true)
   */
  lazy?: boolean
}

/**
 * 이미지 최적화가 적용된 이미지 컴포넌트
 * - Lazy Loading
 * - WebP 변환 지원
 * - 반응형 이미지 (srcset)
 * - 에러 처리 (Fallback)
 */
export function ImageWithFallback({
  src,
  alt,
  style,
  className,
  size = 'auto',
  useWebP = true,
  lazy = true,
  ...rest
}: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleError = () => {
    setDidError(true)
    setIsLoading(false)
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  // WebP 형식으로 변환된 URL 생성
  const getWebPUrl = (url: string): string => {
    if (!url || !useWebP) return url
    
    // 이미 data URL이거나 base64인 경우 그대로 반환
    if (url.startsWith('data:') || url.startsWith('blob:')) {
      return url
    }

    // 이미 WebP인 경우 그대로 반환
    if (url.includes('.webp')) {
      return url
    }

    // Supabase Storage나 CDN을 사용하는 경우 쿼리 파라미터로 변환
    // 예: https://example.com/image.jpg -> https://example.com/image.jpg?format=webp
    try {
      const urlObj = new URL(url)
      // 이미 쿼리 파라미터가 있는 경우
      if (urlObj.searchParams.has('format')) {
        return url
      }
      urlObj.searchParams.set('format', 'webp')
      return urlObj.toString()
    } catch {
      // URL 파싱 실패 시 원본 반환
      return url
    }
  }

  // 반응형 이미지 srcset 생성
  const generateSrcSet = (originalUrl: string): string | undefined => {
    if (!originalUrl || originalUrl.startsWith('data:') || originalUrl.startsWith('blob:')) {
      return undefined
    }

    const sizes = {
      small: ['300w'],
      medium: ['600w'],
      large: ['1200w'],
      auto: ['300w', '600w', '1200w'],
    }

    const widths = sizes[size]
    if (!widths || widths.length === 0) return undefined

    try {
      const urlObj = new URL(originalUrl)
      return widths
        .map((width) => {
          const url = new URL(urlObj.toString())
          url.searchParams.set('w', width)
          if (useWebP) {
            url.searchParams.set('format', 'webp')
          }
          return `${url.toString()} ${width}`
        })
        .join(', ')
    } catch {
      return undefined
    }
  }

  // 최적화된 이미지 URL 및 srcset
  const optimizedSrc = useMemo(() => {
    if (!src) return src
    return getWebPUrl(src)
  }, [src, useWebP])

  const srcSet = useMemo(() => {
    if (!src) return undefined
    return generateSrcSet(src)
  }, [src, size, useWebP])

  // 에러 발생 시 Fallback UI
  if (didError) {
    return (
      <div
        className={`inline-block bg-gray-100 dark:bg-gray-800 text-center align-middle ${className ?? ''}`}
        style={style}
      >
        <div className="flex items-center justify-center w-full h-full">
          <img 
            src={ERROR_IMG_SRC} 
            alt={alt || "Error loading image"} 
            {...rest} 
            data-original-url={src}
            loading={lazy ? 'lazy' : 'eager'}
            decoding="async"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="relative" style={style}>
      {isLoading && (
        <div 
          className={`absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse ${className ?? ''}`}
          aria-hidden="true"
        />
      )}
      <img
        src={optimizedSrc}
        srcSet={srcSet}
        sizes={size === 'auto' ? '(max-width: 640px) 300px, (max-width: 1024px) 600px, 1200px' : undefined}
        alt={alt}
        className={`${className ?? ''} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        style={style}
        loading={lazy ? 'lazy' : 'eager'}
        decoding="async"
        onError={handleError}
        onLoad={handleLoad}
        {...rest}
      />
    </div>
  )
}
