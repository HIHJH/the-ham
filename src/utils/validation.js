import { shouldShowPhotosStep } from './flow';
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
      const totalBoxes = boxTotalQty(state);
      if (state.valuables.length < totalBoxes) {
        return {
          ok: false,
          message: `보관 품목 정보를 박스 개수(${totalBoxes}개)만큼 모두 입력해 주세요.`,
        };
      }
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
      if (!state.policyAcknowledged) {
        return { ok: false, message: '이용 기간 정책을 확인했다는 체크가 필요해요.' };
      }
      return { ok: true };
    }
    case 6: {
      const { name, phone, pickup, date, time } = state.customer;
      if (!name || !phone || !pickup || !date || !time) {
        return {
          ok: false,
          message: '이름, 전화번호, 픽업 장소, 희망 일시를 입력해 주세요.',
        };
      }
      return { ok: true };
    }
    case 7: {
      if (!shouldShowPhotosStep(state)) return { ok: true };
      const needed = boxTotalQty(state);
      if (!state.photoImage) {
        return {
          ok: false,
          message: '박스 사진을 1장 업로드해 주세요.',
        };
      }

      if (state.photos.length < needed) {
        return {
          ok: false,
          message: `감지된 박스 수를 확인해 주세요. (${state.photos.length}/${needed})`,
        };
      }

      const assignedNums = state.photos.map((box) => Number(box.num));
      const hasAllNumbers = Array.from({ length: needed }, (_, i) => i + 1).every((num) =>
        assignedNums.includes(num)
      );
      if (!hasAllNumbers) {
        return {
          ok: false,
          message: `박스 번호를 1번부터 ${needed}번까지 빠짐없이 지정해 주세요.`,
        };
      }

      return { ok: true };
    }
    default:
      return { ok: true };
  }
}
