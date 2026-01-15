import { toast } from 'sonner';

/**
 * 에러 타입 정의
 */
export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTH = 'AUTH',
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN',
}

/**
 * 에러 정보 인터페이스
 */
export interface ErrorInfo {
  type: ErrorType;
  message: string;
  originalError?: Error;
  statusCode?: number;
  userMessage: string;
}

/**
 * 에러 타입 감지
 */
export function detectErrorType(error: any): ErrorType {
  const errorMessage = error?.message?.toLowerCase() || '';
  const errorString = String(error).toLowerCase();

  // 네트워크 에러
  if (
    errorMessage.includes('network') ||
    errorMessage.includes('fetch') ||
    errorMessage.includes('failed to fetch') ||
    errorMessage.includes('networkerror') ||
    error?.code === 'NETWORK_ERROR'
  ) {
    return ErrorType.NETWORK;
  }

  // 인증 에러
  if (
    errorMessage.includes('auth') ||
    errorMessage.includes('login') ||
    errorMessage.includes('unauthorized') ||
    errorMessage.includes('token') ||
    errorMessage.includes('로그인') ||
    error?.status === 401 ||
    error?.statusCode === 401
  ) {
    return ErrorType.AUTH;
  }

  // 404 에러
  if (
    errorMessage.includes('not found') ||
    errorMessage.includes('찾을 수 없') ||
    error?.status === 404 ||
    error?.statusCode === 404
  ) {
    return ErrorType.NOT_FOUND;
  }

  // 서버 에러
  if (
    error?.status >= 500 ||
    error?.statusCode >= 500 ||
    errorMessage.includes('server') ||
    errorMessage.includes('internal server')
  ) {
    return ErrorType.SERVER;
  }

  // 검증 에러
  if (
    errorMessage.includes('validation') ||
    errorMessage.includes('invalid') ||
    errorMessage.includes('검증') ||
    error?.status === 400 ||
    error?.statusCode === 400
  ) {
    return ErrorType.VALIDATION;
  }

  return ErrorType.UNKNOWN;
}

/**
 * 사용자 친화적 에러 메시지 생성
 */
export function getUserFriendlyMessage(errorType: ErrorType, originalMessage?: string): string {
  switch (errorType) {
    case ErrorType.NETWORK:
      return '네트워크 연결을 확인해주세요. 인터넷 연결 상태를 확인하고 다시 시도해주세요.';
    
    case ErrorType.AUTH:
      return '로그인이 필요합니다. 로그인 후 다시 시도해주세요.';
    
    case ErrorType.NOT_FOUND:
      return '요청하신 정보를 찾을 수 없습니다.';
    
    case ErrorType.SERVER:
      return '서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
    
    case ErrorType.VALIDATION:
      return originalMessage || '입력한 정보를 확인해주세요.';
    
    default:
      return originalMessage || '오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
  }
}

/**
 * 에러 처리 및 사용자 알림
 */
export function handleError(error: any, options?: {
  showToast?: boolean;
  logError?: boolean;
  customMessage?: string;
}): ErrorInfo {
  const {
    showToast = true,
    logError = true,
    customMessage,
  } = options || {};

  const errorType = detectErrorType(error);
  const userMessage = customMessage || getUserFriendlyMessage(errorType, error?.message);

  // 에러 로깅
  if (logError) {
    console.error('[Error Handler]', {
      type: errorType,
      message: error?.message,
      error,
      stack: error?.stack,
    });
  }

  // 사용자 알림
  if (showToast) {
    toast.error(userMessage, {
      duration: 5000,
    });
  }

  return {
    type: errorType,
    message: error?.message || 'Unknown error',
    originalError: error instanceof Error ? error : undefined,
    statusCode: error?.status || error?.statusCode,
    userMessage,
  };
}

/**
 * API 에러 처리 래퍼
 */
export async function withErrorHandling<T>(
  apiCall: () => Promise<T>,
  options?: {
    showToast?: boolean;
    logError?: boolean;
    customMessage?: string;
    onError?: (errorInfo: ErrorInfo) => void;
  }
): Promise<T | null> {
  try {
    return await apiCall();
  } catch (error) {
    const errorInfo = handleError(error, options);
    
    if (options?.onError) {
      options.onError(errorInfo);
    }
    
    return null;
  }
}

/**
 * 네트워크 연결 확인
 */
export function checkNetworkConnection(): boolean {
  return navigator.onLine;
}

/**
 * 네트워크 상태 모니터링
 */
export function setupNetworkMonitor(onOnline?: () => void, onOffline?: () => void) {
  if (typeof window === 'undefined') return;

  window.addEventListener('online', () => {
    toast.success('인터넷 연결이 복구되었습니다.');
    onOnline?.();
  });

  window.addEventListener('offline', () => {
    toast.error('인터넷 연결이 끊어졌습니다.');
    onOffline?.();
  });
}

/**
 * 재시도 로직이 포함된 API 호출
 */
export async function retryApiCall<T>(
  apiCall: () => Promise<T>,
  options?: {
    maxRetries?: number;
    retryDelay?: number;
    retryCondition?: (error: any) => boolean;
  }
): Promise<T> {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    retryCondition = (error) => {
      const errorType = detectErrorType(error);
      return errorType === ErrorType.NETWORK || errorType === ErrorType.SERVER;
    },
  } = options || {};

  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;

      // 재시도 조건 확인
      if (attempt < maxRetries && retryCondition(error)) {
        const delay = retryDelay * Math.pow(2, attempt); // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      throw error;
    }
  }

  throw lastError;
}
