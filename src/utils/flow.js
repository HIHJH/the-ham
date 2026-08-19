import { boxTotalQty } from './pricing';

/**
 * 박스 사진 인식(매핑) 단계는 박스가 2개 이상일 때만 의미가 있다 — 기사님이 박스를 구분하고
 * 고객이 나중에 개별 짐을 찾을 때 참고하기 위한 단계라, 박스 1개(또는 이형 화물)뿐이면 건너뛴다.
 */
export function shouldShowPhotosStep(state) {
  return state.category === 'box' && boxTotalQty(state) >= 2;
}

const PHOTOS_STEP = 7;

export function getNextStep(step, state) {
  let next = step + 1;
  if (next === PHOTOS_STEP && !shouldShowPhotosStep(state)) next += 1;
  return next;
}

export function getPrevStep(step, state) {
  let prev = step - 1;
  if (prev === PHOTOS_STEP && !shouldShowPhotosStep(state)) prev -= 1;
  return prev;
}
