import { toast } from 'sonner';

export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
}

/**
 * 브라우저 알림 권한 요청
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('이 브라우저는 알림을 지원하지 않습니다.');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    toast.error('알림 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해주세요.');
    return false;
  }

  // 'default' 상태일 때 권한 요청
  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

/**
 * 브라우저 알림 표시
 */
export async function showNotification(options: NotificationOptions): Promise<Notification | null> {
  const hasPermission = await requestNotificationPermission();
  
  if (!hasPermission) {
    // 권한이 없으면 토스트로 대체
    toast.info(`${options.title}: ${options.body}`);
    return null;
  }

  try {
    const notification = new Notification(options.title, {
      body: options.body,
      icon: options.icon || '/favicon.ico',
      badge: options.badge || '/favicon.ico',
      tag: options.tag,
      requireInteraction: options.requireInteraction || false,
    });

    // 알림 클릭 시 포커스
    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    // 자동으로 닫히도록 (5초 후)
    setTimeout(() => {
      notification.close();
    }, 5000);

    return notification;
  } catch (error) {
    console.error('알림 표시 실패:', error);
    toast.error('알림을 표시할 수 없습니다.');
    return null;
  }
}

/**
 * 공동구매 마감 임박 알림
 */
export async function notifyDeadlineNear(groupPurchaseTitle: string, hoursLeft: number): Promise<void> {
  await showNotification({
    title: '공동구매 마감 임박!',
    body: `${groupPurchaseTitle} 공동구매가 ${hoursLeft}시간 후에 마감됩니다.`,
    tag: 'deadline-near',
    requireInteraction: true,
  });
}

/**
 * 공동구매 목표 달성 알림
 */
export async function notifyTargetReached(groupPurchaseTitle: string): Promise<void> {
  await showNotification({
    title: '목표 달성! 🎉',
    body: `${groupPurchaseTitle} 공동구매가 목표 인원에 도달했습니다!`,
    tag: 'target-reached',
    requireInteraction: true,
  });
}

/**
 * 새 참여자 알림 (생성자용)
 */
export async function notifyNewParticipant(groupPurchaseTitle: string, participantName: string): Promise<void> {
  await showNotification({
    title: '새 참여자',
    body: `${participantName}님이 ${groupPurchaseTitle} 공동구매에 참여했습니다.`,
    tag: 'new-participant',
  });
}

/**
 * 참여 취소 알림 (생성자용)
 */
export async function notifyParticipantCancelled(groupPurchaseTitle: string, participantName: string): Promise<void> {
  await showNotification({
    title: '참여 취소',
    body: `${participantName}님이 ${groupPurchaseTitle} 공동구매 참여를 취소했습니다.`,
    tag: 'participant-cancelled',
  });
}
