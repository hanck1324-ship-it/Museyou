# Matching Module (뮤즈 찾기)

## 개요
사용자 매칭 기능을 담당하는 모듈입니다. 문화예술 취향이 비슷한 사람들을 연결합니다.

## 주요 기능
- 사용자 매칭 추천
- 프로필 조회
- 좋아요 기능
- 매칭 점수 계산
- 메시지 기능 (예정)

## 파일 구조
```
components/matching/
  ├── MatchingCard.tsx      # 매칭 카드 컴포넌트
  └── UserProfile.tsx       # 사용자 프로필 상세
```

## 데이터 모델
```typescript
interface UserMatch {
  id: string;
  name: string;
  age: number;
  gender: string;
  photo: string;
  bio: string;
  location: string;
  interests: string[];
  wantToSee: {
    performanceId: string;
    performanceTitle: string;
    date: string;
  };
  matchScore: number;
  userType: 'single';
}
```

## API 엔드포인트
- `GET /matching/matches` - 추천 매칭 목록
- `POST /matching/like` - 좋아요 보내기
- `GET /matching/likes` - 받은 좋아요 목록
- `POST /matching/message` - 메시지 보내기 (예정)

## 매칭 알고리즘
- 관심 장르 유사도
- 선호하는 만남 스타일
- 지역 근접도
- 보고 싶은 공연 유사도

## 프롬프트 예시

### 매칭 필터 추가
```
매칭 페이지에 필터 기능을 추가해주세요:
- 나이 범위 선택
- 지역 필터
- 관심 장르 필터
- 매칭 점수 최소값 설정
```

### 채팅 기능 구현
```
매칭된 사용자와 실시간 채팅 기능을 구현해주세요:
- 채팅방 생성
- 메시지 전송/수신
- 읽음 표시
- Socket.io 또는 Supabase Realtime 사용
```

### 프로필 상세 정보 추가
```
사용자 프로필에 다음 정보를 추가해주세요:
- 최근 본 공연 목록
- 리뷰 작성 내역
- 관심있는 공연 목록
```
