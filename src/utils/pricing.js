// 가격 정책 (예시 값 — 실제 서비스 정책 확정 후 교체 필요)
export const PRICE = {
  box: { s: 9900, m: 14900, l: 19900 },
  odd: { s: 19900, m: 29900, l: 39900 },
  cushion: 3000,
  spaceMult: { normal: 1, cold: 1.2, climate: 1.3 },
};

export const SIZE_LABEL = { s: '소', m: '중', l: '대' };

export const SPACE_LABEL = {
  normal: '상온 보관',
  cold: '저온 보관',
  climate: '항온항습 보관',
};

export function won(n) {
  return Math.round(n).toLocaleString('ko-KR') + '원';
}

/** 이형 품목 단가 (사이즈 + 완충포장 여부) */
export function oddUnitPrice(size, cushion) {
  return PRICE.odd[size] + (cushion ? PRICE.cushion : 0);
}

/** 박스형/이형 짐 총 수량 */
export function boxTotalQty(state) {
  if (state.category === 'box') {
    return state.boxQty.s + state.boxQty.m + state.boxQty.l;
  }
  return state.oddItems.reduce((a, i) => a + i.qty, 0);
}

/** 품목 가액에 따른 월 특별관리비 (품목당) */
export function valuationFeePerItem(value) {
  if (value > 3000000) return null; // 접수 불가
  if (value >= 1000000) return 2000;
  if (value >= 500000) return 1000;
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
  return valuables.some((v) => v.value > 3000000);
}

/** 보관 기간에 따른 할인율 */
export function discountRate(months) {
  if (months >= 12) return 0.2;
  if (months >= 6) return 0.1;
  if (months >= 3) return 0.05;
  return 0;
}

/** 공간 요금이 반영된 월 기본 보관료 */
export function baseMonthly(state) {
  let base = 0;
  if (state.category === 'box') {
    base =
      state.boxQty.s * PRICE.box.s +
      state.boxQty.m * PRICE.box.m +
      state.boxQty.l * PRICE.box.l;
  } else {
    base = state.oddItems.reduce(
      (a, i) => a + oddUnitPrice(i.size, i.cushion) * i.qty,
      0
    );
  }
  const mult = state.space ? PRICE.spaceMult[state.space] : 1;
  return base * mult;
}

/** 전체 가격 요약 계산 */
export function computePriceSummary(state) {
  const base = baseMonthly(state);
  const valFee = totalValuationFee(state.valuables);
  const rate = discountRate(state.months);
  const monthlyAfter = (base + valFee) * (1 - rate);
  const total = monthlyAfter * state.months;
  return { base, valFee, rate, monthlyAfter, total };
}
