import { useEffect, useRef } from 'react';
import { projectId, publicAnonKey } from '../supabase/config';
import { createClient } from '@supabase/supabase-js';
import { useGroupPurchaseStore } from '../../store/useGroupPurchaseStore';

// 모킹 모드 활성화 (백엔드 연결 시 false로 변경)
const USE_MOCK_MODE = true;

// Supabase 클라이언트 생성
const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

/**
 * 공동구매 실시간 업데이트 훅
 * 참여자 추가/제거 시 진행률을 실시간으로 업데이트합니다.
 */
export function useGroupPurchaseRealtime(groupPurchaseId: string | null) {
  const { fetchGroupPurchaseDetail, fetchGroupPurchases } = useGroupPurchaseStore();
  const channelRef = useRef<any>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!groupPurchaseId) return;

    if (USE_MOCK_MODE) {
      // 모킹 모드: 폴링으로 업데이트 (5초마다)
      pollingIntervalRef.current = setInterval(() => {
        fetchGroupPurchaseDetail(groupPurchaseId);
        // 목록도 함께 업데이트 (선택사항)
        fetchGroupPurchases();
      }, 5000);

      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
      };
    }

    // 실제 Supabase Realtime 구독
    const channel = supabase
      .channel(`group-purchase-${groupPurchaseId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'group_purchase_participants',
          filter: `group_purchase_id=eq.${groupPurchaseId}`
        },
        (payload) => {
          console.log('Realtime update:', payload);
          // 참여자 변경 시 상세 정보 새로고침
          fetchGroupPurchaseDetail(groupPurchaseId);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'group_purchases',
          filter: `id=eq.${groupPurchaseId}`
        },
        (payload) => {
          console.log('Group purchase updated:', payload);
          // 공동구매 정보 변경 시 새로고침
          fetchGroupPurchaseDetail(groupPurchaseId);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to realtime updates for group purchase:', groupPurchaseId);
        }
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [groupPurchaseId, fetchGroupPurchaseDetail, fetchGroupPurchases]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);
}

/**
 * 공동구매 목록 실시간 업데이트 훅
 * 새로운 공동구매 생성 시 목록을 자동으로 업데이트합니다.
 */
export function useGroupPurchaseListRealtime() {
  const { fetchGroupPurchases } = useGroupPurchaseStore();
  const channelRef = useRef<any>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (USE_MOCK_MODE) {
      // 모킹 모드: 폴링으로 업데이트 (10초마다)
      pollingIntervalRef.current = setInterval(() => {
        fetchGroupPurchases();
      }, 10000);

      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
      };
    }

    // 실제 Supabase Realtime 구독
    const channel = supabase
      .channel('group-purchases-list')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'group_purchases'
        },
        (payload) => {
          console.log('Group purchase list updated:', payload);
          // 목록 새로고침
          fetchGroupPurchases();
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to group purchase list updates');
        }
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [fetchGroupPurchases]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);
}
