#!/bin/bash

# MuseYou 폴더 구조 재편성 스크립트
# 코드캠프 스타일 적용

set -e  # 에러 발생 시 중단

echo "🚀 MuseYou 폴더 구조 재편성 시작..."
echo ""

# 현재 위치 확인
if [ ! -f "package.json" ]; then
  echo "❌ 에러: Museyou 프로젝트 루트에서 실행해주세요"
  exit 1
fi

echo "📁 1. 폴더 생성 중..."

# commons 폴더 (코드캠프 스타일)
mkdir -p commons/api
mkdir -p commons/hooks
mkdir -p commons/stores/prompts
mkdir -p commons/types
mkdir -p commons/utils

# components 재구성
echo "   - auth 컴포넌트 폴더"
mkdir -p components/auth/login/prompts
mkdir -p components/auth/signup/prompts

echo "   - performances 컴포넌트 폴더"
mkdir -p components/performances/performance-detail/prompts
mkdir -p components/performances/performance-list/prompts
mkdir -p components/performances/performance-card/prompts

echo "   - matching 컴포넌트 폴더"
mkdir -p components/matching/matching-card/prompts
mkdir -p components/matching/user-profile/prompts
mkdir -p components/matching/date-proposal/prompts

echo "   - muse-companions 컴포넌트 폴더"
mkdir -p components/muse-companions/companion-card/prompts
mkdir -p components/muse-companions/companion-detail/prompts

echo "   - boards 컴포넌트 폴더"
mkdir -p components/boards/board-detail/prompts
mkdir -p components/boards/board-list/prompts
mkdir -p components/boards/board-new/prompts

echo "   - common 컴포넌트 폴더"
mkdir -p components/common/navigation-bar/prompts
mkdir -p components/common/layout-wrapper
mkdir -p components/common/bottom-nav/prompts
mkdir -p components/common/header
mkdir -p components/common/footer

# app 페이지 구조
echo "   - app 페이지 폴더"
mkdir -p app/performances/[id]
mkdir -p app/matching
mkdir -p app/muse-companions/[id]
mkdir -p app/boards/[id]
mkdir -p app/login
mkdir -p app/signup
mkdir -p app/profile

# docs 폴더
mkdir -p docs

# assets 폴더
mkdir -p assets/icons
mkdir -p assets/images
mkdir -p assets/fonts

echo "✅ 폴더 생성 완료"
echo ""

echo "📦 2. 기존 파일 복사 중..."

# store → commons/stores
if [ -d "app/src/store" ]; then
  echo "   - store 파일 복사"
  cp -r app/src/store/* commons/stores/ 2>/dev/null || true
fi

# types → commons/types (있다면)
if [ -d "app/src/types" ]; then
  echo "   - types 파일 복사"
  cp -r app/src/types/* commons/types/ 2>/dev/null || true
fi

# lib/api → commons/api
if [ -d "app/src/lib/api" ]; then
  echo "   - api 파일 복사"
  cp -r app/src/lib/api/* commons/api/ 2>/dev/null || true
fi

echo "✅ 파일 복사 완료"
echo ""

echo "📝 3. README 파일 생성 중..."

# commons/README.md
cat > commons/README.md << 'EOF'
# Commons

공통으로 사용되는 유틸리티, 훅, 타입, 상태 관리 등을 모아놓은 폴더입니다.

## 폴더 구조

- `api/` - API 클라이언트 및 쿼리
- `hooks/` - 커스텀 훅
- `stores/` - Zustand 스토어
- `types/` - TypeScript 타입 정의
- `utils/` - 유틸리티 함수
EOF

# components/common/README.md
cat > components/common/README.md << 'EOF'
# Common Components

모든 페이지에서 공통으로 사용되는 컴포넌트입니다.

## 컴포넌트 목록

- `navigation-bar/` - 상단 네비게이션
- `bottom-nav/` - 하단 네비게이션 (모바일)
- `header/` - 헤더
- `footer/` - 푸터
- `layout-wrapper/` - 레이아웃 래퍼

## 사용법

```tsx
import { NavigationBar } from '@components/common/navigation-bar';
```
EOF

echo "✅ README 파일 생성 완료"
echo ""

echo "📋 4. prompts 템플릿 생성 중..."

# prompts 템플릿 생성 함수
create_prompts() {
  local dir=$1
  if [ -d "$dir" ]; then
    cat > "$dir/01.wireframe.txt" << 'EOF'
# 와이어프레임

## 개요
이 컴포넌트의 구조와 레이아웃을 설명합니다.

## 레이아웃 구조
(여기에 레이아웃 설명)

## 구성 요소
(여기에 구성 요소 설명)
EOF

    cat > "$dir/02.ui.txt" << 'EOF'
# UI 디자인

## 디자인 시스템
(여기에 디자인 시스템 설명)

## 색상
(여기에 색상 팔레트)

## 타이포그래피
(여기에 폰트 스타일)
EOF

    cat > "$dir/03.func.txt" << 'EOF'
# 기능 명세

## 주요 기능
(여기에 주요 기능 설명)

## API 연동
(여기에 API 설명)

## 상태 관리
(여기에 상태 관리 설명)
EOF
  fi
}

# auth
create_prompts "components/auth/login/prompts"
create_prompts "components/auth/signup/prompts"

# performances
create_prompts "components/performances/performance-detail/prompts"
create_prompts "components/performances/performance-list/prompts"
create_prompts "components/performances/performance-card/prompts"

# matching
create_prompts "components/matching/matching-card/prompts"
create_prompts "components/matching/user-profile/prompts"

# common
create_prompts "components/common/navigation-bar/prompts"
create_prompts "components/common/bottom-nav/prompts"

echo "✅ prompts 템플릿 생성 완료"
echo ""

echo "⚙️  5. 설정 파일 템플릿 생성 중..."

# .gitignore 업데이트 (있다면)
if [ ! -f ".gitignore" ]; then
  cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Production
dist/
build/

# Misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Editor
.vscode/
.idea/
*.swp
*.swo
*~

# Temporary
*.tmp
.cache/
EOF
fi

echo "✅ 설정 파일 생성 완료"
echo ""

echo "✨ 폴더 구조 재편성 완료!"
echo ""
echo "📌 생성된 폴더 구조:"
echo ""
echo "commons/"
echo "├── api/"
echo "├── hooks/"
echo "├── stores/"
echo "├── types/"
echo "└── utils/"
echo ""
echo "components/"
echo "├── auth/"
echo "│   ├── login/"
echo "│   └── signup/"
echo "├── performances/"
echo "│   ├── performance-detail/"
echo "│   ├── performance-list/"
echo "│   └── performance-card/"
echo "├── matching/"
echo "├── boards/"
echo "└── common/"
echo ""
echo "📋 다음 단계:"
echo ""
echo "1. 기존 컴포넌트 파일들을 새 구조로 이동"
echo "   예: app/src/components/performances/PerformanceDetail.tsx"
echo "   → components/performances/performance-detail/index.tsx"
echo ""
echo "2. import 경로 업데이트"
echo "   예: import { Performance } from '@/types/performance'"
echo "   → import { Performance } from '@commons/types/performance'"
echo ""
echo "3. vite.config.ts 별칭 설정"
echo "   @commons, @components 별칭 추가"
echo ""
echo "4. 각 컴포넌트에 hook.ts, queries.ts 파일 생성"
echo ""
echo "5. prompts 파일 내용 작성"
echo ""
echo "🚀 준비가 되었습니다!"

