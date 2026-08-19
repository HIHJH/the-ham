// 가격/정책 설정 — 실제 서비스 정책이 바뀌면 이 객체의 숫자만 수정하면 된다.
export const PRICING_CONFIG = {
  boxSizes: {
    m: {
      label: '중형',
      minSumCm: 80, // 가로+세로+높이 합
      maxSumCm: 120,
      minWeightKg: 2,
      maxWeightKg: 10,
      example: '과일 박스 1개 정도 크기',
      // 보관 개월수별 전체 기간 총액(1개월 보관하면 19,500원 전부, 6개월 보관하면 48,500원 전부인 식)
      totalPriceByMonths: {
        1: 19500, 2: 25500, 3: 31000, 4: 37000, 5: 42500, 6: 48500,
        7: 54000, 8: 60000, 9: 65500, 10: 71000, 11: 77000, 12: 82500,
      },
    },
    l: {
      label: '대형',
      minSumCm: 120,
      maxSumCm: 160,
      minWeightKg: 10,
      maxWeightKg: 20,
      example: '중형(24인치) 캐리어 1개 정도 크기',
      totalPriceByMonths: {
        1: 22000, 2: 27500, 3: 33500, 4: 39000, 5: 45000, 6: 51000,
        7: 56500, 8: 62500, 9: 68000, 10: 74000, 11: 80000, 12: 85500,
      },
    },
    xl: {
      label: '특대형',
      minSumCm: 160,
      maxSumCm: 190,
      minWeightKg: 20,
      maxWeightKg: 25,
      example: '이삿짐 박스 1개 정도 크기',
      totalPriceByMonths: {
        1: 24000, 2: 30000, 3: 36000, 4: 41500, 5: 47500, 6: 53500,
        7: 59500, 8: 65500, 9: 71500, 10: 77500, 11: 83000, 12: 89000,
      },
    },
  },
  odd: {
    sizes: { s: 19900, m: 29900, l: 39900 },
    cushionFee: 3000,
  },
  spaceMult: { normal: 1, cold: 1.2, climate: 1.3 },
  valuation: {
    blockAbove: 3000000, // 이 금액 초과 시 접수 불가
    highTierAt: 1000000,
    highTierFee: 2000,
    midTierAt: 500000,
    midTierFee: 1000,
  },
  // inbound(최초 입고 배송비)는 박스형 기간 총액표(totalPriceByMonths)에 이미 포함되어 있어 0원.
  // 재입고·출고는 최초 입고 이후 별도로 발생하는 배송이라 독립적인 배송비를 유지한다.
  delivery: { inbound: 0, restock: 12000, outbound: 15000 },
  packagingFee: 0,
  overage: { weightSurchargePerKg: 2000, sizeSurchargeFlat: 5000 },
};

export const BOX_SIZE_LABEL = Object.fromEntries(
  Object.entries(PRICING_CONFIG.boxSizes).map(([key, cfg]) => [key, cfg.label])
);

/** 이형 화물 크기 (박스 규격과는 별개 — 소/중/대) */
export const SIZE_LABEL = { s: '소', m: '중', l: '대' };

/** 보관 품목 카테고리 (아이콘, 중복 선택 가능) */
export const VALUABLE_CATEGORIES = [
  { key: 'clothes', label: '의류', icon: '👕' },
  { key: 'camping', label: '캠핑용품', icon: '⛺' },
  { key: 'household', label: '생활용품', icon: '🧺' },
  { key: 'books', label: '도서·문서', icon: '📚' },
  { key: 'appliance', label: '소형가전', icon: '🔌' },
  { key: 'sports', label: '스포츠용품', icon: '⚽' },
  { key: 'hobby', label: '취미용품', icon: '🎨' },
  { key: 'etc', label: '기타', icon: '📦' },
];

export const SPACE_LABEL = {
  normal: '상온 보관',
  cold: '제습존 보관',
  climate: '항온항습 보관',
};

export function won(n) {
  return Math.round(n).toLocaleString('ko-KR') + '원';
}

/** 이형 품목 단가 (사이즈 + 완충포장 여부) */
export function oddUnitPrice(size, cushion) {
  return PRICING_CONFIG.odd.sizes[size] + (cushion ? PRICING_CONFIG.odd.cushionFee : 0);
}

/** 박스형/이형 짐 총 수량 */
export function boxTotalQty(state) {
  if (state.category === 'box') {
    return Object.values(state.boxQty).reduce((a, n) => a + n, 0);
  }
  return state.oddItems.reduce((a, i) => a + i.qty, 0);
}

/** 품목 가액에 따른 월 특별관리비 (품목당) */
export function valuationFeePerItem(value) {
  const { blockAbove, highTierAt, highTierFee, midTierAt, midTierFee } = PRICING_CONFIG.valuation;
  if (value > blockAbove) return null; // 접수 불가
  if (value >= highTierAt) return highTierFee;
  if (value >= midTierAt) return midTierFee;
  return 0;
}

/** 전체 보관 품목 특별관리비 합계 (300만원 초과 품목은 0으로 취급, 별도 에러 처리) */
export function totalValuationFee(valuables) {
  return valuables.reduce((a, v) => {
    const fee = valuationFeePerItem(v.value);
    return a + (fee || 0);
  }, 0);
}

export function hasBlockedValuable(valuables) {
  return valuables.some((v) => v.value > PRICING_CONFIG.valuation.blockAbove);
}

/** 박스 1개를 months개월 보관할 때의 전체 기간 총액 (사이즈별 정가표 조회) */
export function boxPeriodTotal(size, months) {
  return PRICING_CONFIG.boxSizes[size]?.totalPriceByMonths[months] ?? 0;
}

/**
 * 보관 기간 전체의 보관료 총액 (공간 요금 반영).
 * 박스형은 개월수별 정가표를 그대로 조회하고(개월수에 선형 비례하지 않음),
 * 이형 화물은 월 단가 × 개월로 계산한다.
 */
export function storagePeriodTotal(state) {
  let total = 0;
  if (state.category === 'box') {
    total = Object.entries(state.boxQty).reduce(
      (a, [size, qty]) => a + qty * boxPeriodTotal(size, state.months),
      0
    );
  } else {
    total = state.oddItems.reduce(
      (a, i) => a + oddUnitPrice(i.size, i.cushion) * i.qty * state.months,
      0
    );
  }
  const mult = state.space ? PRICING_CONFIG.spaceMult[state.space] : 1;
  return total * mult;
}

/**
 * 전체 가격 요약 계산. 개월수에 따른 "%할인"은 없지만, 박스형은 기간별 정가표를 그대로 따르므로
 * 총액이 개월수에 선형 비례하지는 않는다.
 * deliveryType: 'inbound' | 'restock' | 'outbound' — 신청 유형별 배송비.
 */
export function computePriceSummary(state, deliveryType = 'inbound') {
  const base = storagePeriodTotal(state);
  const valFeeTotal = totalValuationFee(state.valuables) * state.months;
  const total = base + valFeeTotal;
  const monthly = state.months > 0 ? total / state.months : 0; // 표시용 월 평균
  const deliveryFee = PRICING_CONFIG.delivery[deliveryType] ?? 0;
  return { base, valFee: valFeeTotal, monthly, total, deliveryFee, grandTotal: total + deliveryFee };
}

/** date(기본값 오늘)로부터 months개월 후 날짜 */
export function addMonths(months, date = new Date()) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

export function formatDate(date) {
  const d = new Date(date);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

/** 오늘부터 date까지 남은 일수 (지났으면 0) */
export function daysUntil(date) {
  const end = new Date(date);
  const today = new Date();
  end.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((end - today) / (1000 * 60 * 60 * 24)));
}

/** 오늘부터 date까지 남은 개월 수 (올림, 최소 0) — "남은 N개월 동안 다시 보관 가능" 안내용 */
export function monthsUntil(date) {
  return Math.max(0, Math.ceil(daysUntil(date) / 30));
}

/** 보관 품목의 카테고리 키 배열 → 아이콘 문자열 */
export function categoryIcons(categories) {
  return (categories || [])
    .map((key) => VALUABLE_CATEGORIES.find((c) => c.key === key)?.icon)
    .filter(Boolean)
    .join(' ');
}
