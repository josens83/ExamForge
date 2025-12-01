# ExamForge - AI 기반 시험 준비 플랫폼

<p align="center">
  <strong>AI와 함께하는 스마트한 시험 준비</strong>
</p>

ExamForge는 粉笔教育(Fenbi Education)을 벤치마킹한 AI 기반 시험 준비 플랫폼입니다. "무료 문제은행 -> 유료 강의 -> 합격보장반" 퍼널 전략으로 저비용 사용자 획득 후 고가 전환을 유도합니다.

## 주요 기능

- **10만+ 무료 문제은행**: 공무원, 자격증 시험 대비 방대한 문제 제공
- **AI 맞춤 학습**: 취약 영역 분석 및 최적화된 학습 경로 제안
- **AI 논술 채점**: Claude AI를 활용한 즉각적인 논술 채점 및 피드백
- **실시간 성적 분석**: 학습 데이터 기반 예상 점수 및 합격 가능성 분석
- **강의 시스템**: 영상 강의, 라이브 강의, OMO(Online-Merge-Offline) 지원
- **모의고사**: 실전과 동일한 환경의 모의고사 및 순위 제공
- **게이미피케이션**: 연속 학습, 레벨 시스템, 랭킹으로 학습 동기 부여
- **합격보장반**: 조건 충족 시 100% 환불 보장

## 기술 스택

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Zustand + TanStack Query
- **Charts**: Recharts

### Backend
- **Runtime**: Node.js
- **Database**: PostgreSQL (Prisma ORM)
- **Authentication**: NextAuth.js

### AI Integration
- **논술 채점**: Claude API (Anthropic)

## 시작하기

### 사전 요구사항
- Node.js 18+
- PostgreSQL
- npm 또는 yarn

### 설치

1. 저장소 클론
```bash
git clone https://github.com/josens83/ExamForge.git
cd ExamForge
```

2. 의존성 설치
```bash
npm install
```

3. 환경 변수 설정
```bash
cp .env.example .env
# .env 파일을 편집하여 필요한 값을 설정하세요
```

4. 데이터베이스 설정
```bash
npm run db:push
npm run db:seed
```

5. 개발 서버 실행
```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

## 환경 변수

| 변수 | 설명 |
|------|------|
| `DATABASE_URL` | PostgreSQL 연결 URL |
| `NEXTAUTH_SECRET` | NextAuth 시크릿 키 |
| `NEXTAUTH_URL` | 앱 URL |
| `GOOGLE_CLIENT_ID` | Google OAuth 클라이언트 ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 시크릿 |
| `KAKAO_CLIENT_ID` | 카카오 OAuth 클라이언트 ID |
| `KAKAO_CLIENT_SECRET` | 카카오 OAuth 시크릿 |
| `ANTHROPIC_API_KEY` | Claude API 키 |

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── (auth)/            # 인증 관련 페이지 (로그인, 회원가입)
│   ├── (main)/            # 메인 애플리케이션 페이지
│   └── api/               # API 라우트
├── components/            # React 컴포넌트
│   ├── ui/               # shadcn/ui 기반 UI 컴포넌트
│   ├── layout/           # 레이아웃 컴포넌트
│   └── ...               # 기능별 컴포넌트
├── hooks/                # 커스텀 React 훅
├── lib/                  # 유틸리티 및 라이브러리
├── stores/               # Zustand 스토어
└── types/                # TypeScript 타입 정의
```

## 수익 모델

### 멤버십
| 플랜 | 월 가격 | 포함 내용 |
|------|---------|----------|
| Free | 무료 | 일 30문제, 월 1회 모의고사 |
| Basic | ₩9,900 | 일 100문제, 월 5회 모의고사, AI 채점 10회 |
| Premium | ₩29,900 | 무제한 문제, 무제한 모의고사, AI 채점 50회 |
| VIP | ₩99,900 | Premium + 무제한 AI 채점, 1:1 멘토링 |

### 강의 & 합격보장반
- 단과 강의: ₩50,000 ~ ₩200,000
- 종합반: ₩300,000 ~ ₩800,000
- 합격보장반: ₩1,500,000 ~ ₩3,000,000

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 기여

기여는 언제나 환영합니다! Issue나 Pull Request를 통해 참여해주세요.
