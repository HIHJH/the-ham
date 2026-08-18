import { TOTAL_STEPS, useBookingDispatch, useBookingState } from '../state/BookingContext';
import { computePriceSummary, won } from '../utils/pricing';
import { validateStep } from '../utils/validation';

const LABELS = {
  1: '다음',
  2: '다음',
  3: '다음',
  4: '다음',
  5: '다음',
  6: '다음',
  7: '결제하기',
  8: '홈으로',
};

export default function BottomCta() {
  const state = useBookingState();
  const dispatch = useBookingDispatch();
  const { step } = state;

  const showSubline = step >= 2 && step <= 7;
  const { monthlyAfter } = computePriceSummary(state);

  const handleClick = () => {
    if (step === 8) {
      dispatch({ type: 'RESET' });
      return;
    }
    const result = validateStep(step, state);
    if (!result.ok) {
      alert(result.message);
      return;
    }
    dispatch({ type: 'GO_TO_STEP', step: Math.min(TOTAL_STEPS, step + 1) });
  };

  return (
    <div className="bottomcta">
      {showSubline && (
        <div className="cta-subline">
          <span>월 보관료</span>
          <b>{won(monthlyAfter)}</b>
        </div>
      )}
      <button className="cta-btn" onClick={handleClick}>
        {LABELS[step]}
      </button>
    </div>
  );
}
