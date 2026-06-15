# Mogazoa — Copilot Instructions

## 📌 프로젝트 개요

**Mogazoa**는 음악, 식당, 영화, 강의, 여행지, 전자기기, 호텔, 와인, 옷, 앱 등 다양한 분야의 상품 두 가지를 선택해 **A/B 테스트 방식으로 비교**하는 웹 애플리케이션입니다.

- 사용자는 후기·별점·찜 데이터를 종합한 상품 랭킹을 확인하고 공유할 수 있습니다.
- Next.js SSR / CSR / SSG 렌더링 방식을 비교 적용하며, 무한 스크롤·SEO 최적화·카카오톡 공유·검색·정렬 등 다양한 기능을 구현합니다.
- **이번 프로젝트의 목표**: AI 활용 능력을 키우며 기획 · 디자인 · 개발을 혼자 처음부터 끝까지 완주하기

### 관련 링크

| 구분                | 링크                                                                  |
| ------------------- | --------------------------------------------------------------------- |
| 프로젝트 요구사항   | https://codeit.notion.site/_-Mogazoa-631abba6780048859d73d74eabf0070f |
| API 명세 (Swagger)  | https://mogazoa-api.vercel.app/docs/#                                 |
| 디자인 시안 (Figma) | https://figma.com/design/mo37KmYpd3ZsJ6Ojay2u83/%5BCCC%5DMogazoa      |

---

## 🛠️ 기술 스택

| 항목                     | 기술                                       |
| ------------------------ | ------------------------------------------ |
| 언어                     | TypeScript                                 |
| 프레임워크               | Next.js (App Router)                       |
| 데이터 페칭 — 서버       | Next.js 확장 `fetch`                       |
| 데이터 페칭 — 클라이언트 | `axios`                                    |
| 서버 상태 관리           | TanStack Query                             |
| 클라이언트 상태 관리     | Context API (필요 시 Zustand 전환)         |
| 인증                     | JWT + httpOnly Cookie + Next.js Middleware |
| 스타일링                 | Tailwind CSS v4                            |
| 폼 관리                  | React Hook Form + Zod                      |
| 코드 품질                | ESLint + Prettier                          |
| 커밋 관리                | Husky + commitlint + lint-staged           |

---

## 📁 폴더 구조

경량 FSD(Feature-Sliced Design) 아키텍처를 기반으로 합니다.

```
src/
├── app/                    # 앱 전역 설정
│   ├── layout.tsx
│   ├── providers.tsx       # QueryClient, Context 등 Provider 묶음
│   └── globals.css         # 디자인 시스템 (CSS 변수, 토큰 정의)
│
├── app/(auth)/             # Next.js App Router 라우팅
│   ├── signin/
│   └── signup/
├── app/product/[id]/
├── app/compare/
├── app/mypage/
└── app/user/[id]/
│
├── features/               # 기능 단위 모듈
│   ├── auth/               # 로그인, 회원가입
│   ├── product/            # 상품 추가/수정/조회
│   ├── review/             # 리뷰 작성/수정/삭제
│   ├── compare/            # 비교하기
│   └── user/               # 프로필, 팔로우
│
├── shared/                 # 공통 자원
│   ├── api/                # axios 인스턴스, fetch 헬퍼
│   ├── components/         # Button, Input, Modal 등 공용 UI
│   ├── hooks/              # useDebounce, useIntersection 등
│   ├── lib/                # 유틸 함수
│   └── types/              # 공통 타입
│
└── middleware.ts            # JWT 인증 처리
```

각 feature 내부 구조:

```
features/[feature]/
├── components/     # 해당 기능 전용 컴포넌트
├── hooks/          # 해당 기능 전용 커스텀 훅
├── api/            # 해당 기능 API 호출 함수
└── types/          # 해당 기능 타입 정의
```

---

## 📐 코드 작성 규칙

### 1. TypeScript

- **`any` 타입 사용을 절대 금지합니다.** 올바른 `interface`, `type`, Generic을 사용하세요.
- `interface`와 `type` 사용 기준을 반드시 준수하세요.

| 구분        | 사용 기준                                        | 예시                                           |
| ----------- | ------------------------------------------------ | ---------------------------------------------- |
| `interface` | 컴포넌트 Props, 확장 가능성이 있는 객체 형태     | `interface ButtonProps { ... }`                |
| `type`      | 유니온 타입, 튜플, 원시 타입 조합, API 응답 타입 | `type Status = 'idle' \| 'loading' \| 'error'` |

### 2. 컴포넌트 작성 방식

- **named export를 사용합니다.** `export default` 사용을 지양합니다.

```typescript
// ✅ Good
export function ProductCard({ name }: ProductCardProps) {}

// ❌ Bad
export default function ProductCard({ name }: ProductCardProps) {}
```

- **Server Component / Client Component 구분 기준**을 명확히 지킵니다.
  - `'use client'`는 상태(`useState`, `useEffect`), 이벤트 핸들러, 브라우저 API가 필요한 경우에만 사용합니다.
  - 데이터 페칭만 하는 컴포넌트는 Server Component로 유지합니다.

```typescript
// ✅ Client Component가 필요한 경우에만 선언
"use client";

import { useState } from "react";
```

### 3. 스타일링

- **Tailwind CSS v4 유틸리티 클래스**를 사용합니다.
- 조건부 클래스 결합 시 반드시 `clsx`와 `tailwind-merge`를 함께 사용합니다.

```typescript
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// cn 유틸 함수를 shared/lib/cn.ts에 정의해 사용합니다.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- `global.css`에 디자인 시스템(색상 토큰, 타이포그래피 등)이 정의되어 있습니다. **컴포넌트 스타일링 시 반드시 참고하세요.**

### 4. 데이터 페칭 레이어

데이터 페칭 방식은 **레이어에 따라 명확히 구분합니다.** 혼용하지 않습니다.

| 레이어               | 방식                 | 비고                                     |
| -------------------- | -------------------- | ---------------------------------------- |
| Server Component     | Next.js 확장 `fetch` | `next: { revalidate }` 등 캐싱 옵션 활용 |
| Client Component     | `axios` 인스턴스     | `shared/api/`에서 import                 |
| 클라이언트 서버 상태 | TanStack Query       | Client Component에서만 사용              |

```typescript
// ✅ Server Component — Next.js fetch 사용
const data = await fetch(`${process.env.API_URL}/products`, {
  next: { revalidate: 60 },
});

// ✅ Client Component — axios 인스턴스 사용
import { axiosInstance } from "@/shared/api/axiosInstance";
const { data } = await axiosInstance.get("/products");
```

### 5. 경로 alias

- `@/`는 `src/`를 가리킵니다.
- **상대 경로(`../../`) 사용을 금지합니다.** 항상 `@/`로 시작하는 절대 경로를 사용하세요.

```typescript
// ✅ Good
import { Button } from "@/shared/components/Button";

// ❌ Bad
import { Button } from "../../../shared/components/Button";
```

### 6. 에러 처리

- **API 에러는 axios 인터셉터에서 공통 처리합니다.** 각 컴포넌트에서 개별 처리하지 않습니다.
- 페이지 레벨 에러는 Next.js의 `error.tsx`를 활용합니다.
- 컴포넌트 트리 내 에러는 `ErrorBoundary`를 활용합니다.

```typescript
// shared/api/axiosInstance.ts
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // 공통 에러 핸들링 (401 → 로그인 페이지 리다이렉트 등)
    return Promise.reject(error);
  },
);
```

### 7. 접근성 (a11y)

- **이미지에는 항상 `alt` 속성을 명시합니다.** 장식용 이미지는 `alt=""`로 처리합니다.
- **버튼에는 항상 `type` 속성을 명시합니다.**

```typescript
// ✅ Good
<img src={product.image} alt={product.name} />
<img src={decorative.png} alt="" />
<button type="button" onClick={handleClick}>클릭</button>
<button type="submit">제출</button>

// ❌ Bad
<img src={product.image} />
<button onClick={handleClick}>클릭</button>
```

---

## 🌿 Git & 브랜치 전략

### 브랜치 구조

| 브랜치         | 용도                                                   |
| -------------- | ------------------------------------------------------ |
| `main`         | 실제 배포용 브랜치. 직접 푸시 금지. 검증된 코드만 병합 |
| `타입: 기능명` | 개별 작업 브랜치. 반드시 `main`에서 분기               |

브랜치명 예시: `feat: login-ui`, `fix: compare-modal`

### 작업 흐름

```bash
git checkout main && git pull origin main   # 최신화
git checkout -b feat: 기능명                # 브랜치 생성
# 작업 후
git add . && git commit -m "feat: 설명"    # 커밋
git push origin feat: 기능명               # push
# GitHub에서 PR 생성 → 승인 후 main에 merge
git checkout main && git pull origin main   # 최신화
```

---

## ✍️ 커밋 컨벤션

### 형식

```
[타입]: [설명]
```

### commitlint 허용 타입

| 타입       | 설명                                                       |
| ---------- | ---------------------------------------------------------- |
| `feat`     | 새로운 기능 추가                                           |
| `fix`      | 버그 수정                                                  |
| `docs`     | 문서 수정 (README 등)                                      |
| `style`    | 코드 포맷팅, 세미콜론 누락 등 (로직 변경 없음)             |
| `refactor` | 기능 변경 없는 코드 리팩토링                               |
| `perf`     | 성능 개선                                                  |
| `test`     | 테스트 코드 추가 및 수정                                   |
| `build`    | 빌드 시스템 또는 외부 의존성 변경                          |
| `ci`       | CI 설정 파일 및 스크립트 변경                              |
| `chore`    | 그 외 코드와 관련 없는 작업 (.gitignore, 빌드 스크립트 등) |
| `revert`   | 이전 커밋 되돌리기                                         |

---

## 🏷️ 네이밍 규칙

| 항목                       | 규칙                 | 예시                         |
| -------------------------- | -------------------- | ---------------------------- |
| 컴포넌트                   | `PascalCase`         | `LoginForm`, `ProductCard`   |
| 함수 / 변수                | `camelCase`          | `getUserData`, `isLoading`   |
| 상수                       | `CONSTANT_VALUE`     | `MAX_RETRY_COUNT`            |
| 이벤트 핸들러 (내부 정의)  | `handle` 접두사      | `handleSubmit`               |
| 이벤트 핸들러 (props 수신) | `on` 접두사          | `onSubmit`                   |
| 폴더                       | `camelCase`          | `components`, `hooks`        |
| 이미지 파일                | `snake_case`         | `product_thumbnail.png`      |
| 타입 / 인터페이스          | `PascalCase`         | `ProductItem`, `UserProfile` |
| Props 타입                 | 컴포넌트명 + `Props` | `ButtonProps`, `InputProps`  |
