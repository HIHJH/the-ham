import { TOTAL_STEPS, useBookingDispatch, useBookingState } from '../state/BookingContext';
import { useStorageDispatch } from '../state/StorageContext';
import { getNextStep } from '../utils/flow';
import { computePriceSummary, won } from '../utils/pricing';
import { validateStep } from '../utils/validation';

const LABELS = {
  1: '다음',
  2: '다음',
  3: '다음',
  4: '다음',
  5: '다음',
  6: '다음',
  7: '다음',
  8: '결제하기',
  9: '홈으로',
};

export default function BottomCta() {
  const state = useBookingState();
  const dispatch = useBookingDispatch();
  const storageDispatch = useStorageDispatch();
  const { step } = state;

  const showSubline = step >= 2 && step <= 8;
  const { monthly } = computePriceSummary(state);

  const handleClick = () => {
    if (step === TOTAL_STEPS) {
      storageDispatch({ type: 'COMPLETE_BOOKING', booking: state });
      dispatch({ type: 'RESET' });
      return;
    }
    const result = validateStep(step, state);
    if (!result.ok) {
      alert(result.message);
      return;
    }
    dispatch({ type: 'GO_TO_STEP', step: Math.min(TOTAL_STEPS, getNextStep(step, state)) });
  };

  return (
    <div className="bottomcta">
      {showSubline && (
        <div className="cta-subline">
          <span>{state.months}개월 · 월 평균 보관료</span>
          <b>{won(monthly)}</b>
        </div>
      )}
      <button className="cta-btn" onClick={handleClick}>
        {LABELS[step]}
      </button>
    </div>
  );
}
