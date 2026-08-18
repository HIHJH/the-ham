# THE-HAM — 일상 속에 공간을 더하다

더함(THE-HAM): 일상 속의 공간을 더해주는 짐 보관 서비스 예약 플로우 앱

## 실행 방법

```bash
npm install
npm run dev
```

프로덕션 빌드:

```bash
npm run build
npm run preview
```

## 폴더 구조

```
src/
  main.jsx                 앱 진입점, BookingProvider로 감싸기
  App.jsx                  디바이스 프레임 + 현재 스텝 라우팅
  index.css                전역 디자인 토큰 및 컴포넌트 스타일
  state/
    BookingContext.jsx     예약 플로우 전역 상태(useReducer) + 액션
  utils/
    pricing.js             요금/할인/특별관리비 계산 로직
    validation.js          스텝별 다음 단계 진행 가능 여부 검증
  components/
    TopBar.jsx              상단 진행바 + 뒤로가기
    BottomCta.jsx            하단 고정 CTA 버튼 (실시간 월 보관료 표시)
    PriceTable.jsx           가격 상세 테이블 (STEP4, STEP7 공용)
    steps/
      Step1Size.jsx          사이즈+수량 선택 (박스형/이형)
      Step2Valuables.jsx     보관 품목 가액 등록
      Step3Space.jsx         보관 공간 선택 (상온/저온/항온항습)
      Step4Duration.jsx      보관 기간 설정 (개월 수, 장기 할인)
      Step5Customer.jsx      고객 정보 / 픽업·도착 장소
      Step6Photos.jsx        박스 외관 사진 촬영 (AI 인식 목업)
      Step7Review.jsx        최종 확인
      Step8Complete.jsx      완료 화면
```

## 요금 정책 (예시 — 실제 정책 확정 후 `src/utils/pricing.js` 수정)

| 항목 | 기준 |
|---|---|
| 박스형 | 소 9,900 / 중 14,900 / 대 19,900원 (월/개) |
| 이형 | 소 19,900 / 중 29,900 / 대 39,900원 (월/개) + 완충포장 3,000원 |
| 품목 가액 특별관리비 | 50만원↑ +1,000원 · 100만원↑ +2,000원 · 300만원 초과 접수 불가 |
| 보관 공간 요금 | 상온 기준가 · 저온 +20% · 항온항습 +30% |
| 장기 보관 할인 | 3개월↑ 5% · 6개월↑ 10% · 12개월↑ 20% |

## 참고

- STEP6의 "AI 박스 인식"은 목업(0.7초 대기 후 자동 번호 부여)이며, 실제 촬영·인식 API 연동은 구현 예정
- 디자인은 토스 TDS(Toss Design System) 컴포넌트 톤(ListRow, BottomCTA, Badge, Tab 등)을 참고해 순수 CSS로 재구현
