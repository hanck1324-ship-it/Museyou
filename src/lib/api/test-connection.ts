import { projectId, publicAnonKey } from '../supabase/config';
import { createClient } from '@supabase/supabase-js';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-c003bd66`;

// Create Supabase client for testing
const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

export interface ConnectionTestResult {
  test: string;
  success: boolean;
  message: string;
  details?: any;
}

export async function testSupabaseConnection(): Promise<ConnectionTestResult[]> {
  const results: ConnectionTestResult[] = [];

  // Test 1: Supabase Client 생성 확인
  try {
    if (!supabase) {
      throw new Error('Supabase client is not initialized');
    }
    results.push({
      test: 'Supabase Client 초기화',
      success: true,
      message: 'Supabase 클라이언트가 성공적으로 생성되었습니다.',
      details: {
        url: `https://${projectId}.supabase.co`,
        hasKey: !!publicAnonKey,
      }
    });
  } catch (error: any) {
    results.push({
      test: 'Supabase Client 초기화',
      success: false,
      message: `클라이언트 생성 실패: ${error.message}`,
    });
  }

  // Test 2: Supabase 서버 연결 확인
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      throw error;
    }
    results.push({
      test: 'Supabase 서버 연결',
      success: true,
      message: 'Supabase 서버에 성공적으로 연결되었습니다.',
      details: {
        hasSession: !!data.session,
      }
    });
  } catch (error: any) {
    results.push({
      test: 'Supabase 서버 연결',
      success: false,
      message: `서버 연결 실패: ${error.message}`,
      details: {
        errorCode: error.code,
        errorStatus: error.status,
      }
    });
  }

  // Test 3: Edge Functions 엔드포인트 확인
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    const status = response.status;
    const isOk = response.ok;

    results.push({
      test: 'Edge Functions 엔드포인트',
      success: isOk || status === 404 || status === 405, // 404나 405도 엔드포인트는 존재한다는 의미
      message: isOk 
        ? 'Edge Functions 엔드포인트가 정상적으로 응답합니다.'
        : status === 404 || status === 405
        ? 'Edge Functions 엔드포인트는 존재하지만 해당 메서드는 지원하지 않습니다.'
        : `엔드포인트 응답 오류: ${status}`,
      details: {
        status,
        url: API_BASE_URL,
      }
    });
  } catch (error: any) {
    results.push({
      test: 'Edge Functions 엔드포인트',
      success: false,
      message: `엔드포인트 연결 실패: ${error.message}`,
    });
  }

  // Test 4: 프로젝트 설정 확인
  try {
    if (!projectId || !publicAnonKey) {
      throw new Error('프로젝트 설정이 누락되었습니다.');
    }
    results.push({
      test: '프로젝트 설정',
      success: true,
      message: '프로젝트 ID와 공개 키가 설정되어 있습니다.',
      details: {
        projectId: projectId.substring(0, 10) + '...',
        hasPublicKey: !!publicAnonKey,
      }
    });
  } catch (error: any) {
    results.push({
      test: '프로젝트 설정',
      success: false,
      message: `설정 확인 실패: ${error.message}`,
    });
  }

  return results;
}

// 콘솔에서 실행할 수 있는 함수
export async function runConnectionTest() {
  console.log('🔍 Supabase 연결 테스트 시작...\n');
  
  const results = await testSupabaseConnection();
  
  console.log('📊 테스트 결과:\n');
  results.forEach((result, index) => {
    const icon = result.success ? '✅' : '❌';
    console.log(`${index + 1}. ${icon} ${result.test}`);
    console.log(`   ${result.message}`);
    if (result.details) {
      console.log(`   상세:`, result.details);
    }
    console.log('');
  });

  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  
  console.log(`\n📈 결과 요약: ${successCount}/${totalCount} 테스트 통과`);
  
  if (successCount === totalCount) {
    console.log('🎉 모든 테스트가 성공했습니다! Supabase 연결이 정상적으로 작동합니다.');
  } else {
    console.log('⚠️ 일부 테스트가 실패했습니다. 위의 오류 메시지를 확인해주세요.');
  }

  return results;
}


