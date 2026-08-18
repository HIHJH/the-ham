import { boxTotalQty, hasBlockedValuable } from './pricing';

/**
 * 각 스텝의 다음 단계 진행 가능 여부를 검사한다.
 * 실패 시 { ok: false, message } 를, 성공 시 { ok: true } 를 반환한다.
 */
export function validateStep(step, state) {
  switch (step) {
    case 1: {
      if (boxTotalQty(state) === 0) {
        return { ok: false, message: '짐을 1개 이상 선택해 주세요.' };
      }
      return { ok: true };
    }
    case 2: {
      if (hasBlockedValuable(state.valuables)) {
        return {
          ok: false,
          message: '300만원을 초과하는 품목은 접수가 어려워요. 금액을 확인해 주세요.',
        };
      }
      return { ok: true };
    }
    case 3: {
      if (!state.space) {
        return { ok: false, message: '보관 공간을 선택해 주세요.' };
      }
      return { ok: true };
    }
    case 5: {
      const { name, phone, pickup, date, time } = state.customer;
      if (!name || !phone || !pickup || !date || !time) {
        return {
          ok: false,
          message: '이름, 전화번호, 픽업 장소, 희망 일시를 입력해 주세요.',
        };
      }
      return { ok: true };
    }
    case 6: {
      const needed = boxTotalQty(state);
      if (state.photos.filter(Boolean).length < needed) {
        return {
          ok: false,
          message: `모든 박스를 촬영해 주세요. (${state.photos.filter(Boolean).length}/${needed})`,
        };
      }
      return { ok: true };
    }
    default:
      return { ok: true };
  }
}
