import { TOTAL_STEPS, useBookingDispatch, useBookingState } from '../state/BookingContext';
import { getPrevStep } from '../utils/flow';

export default function TopBar() {
  const state = useBookingState();
  const { step } = state;
  const dispatch = useBookingDispatch();
  const displayTotal = TOTAL_STEPS - 1; // 완료 화면은 진행 표시에서 제외

  const goPrev = () => {
    if (step === 1) {
      dispatch({ type: 'GO_TO_STEP', step: 0 });
      return;
    }

    if (step > 1) dispatch({ type: 'GO_TO_STEP', step: getPrevStep(step, state) });
  };

  const progress = Math.min(100, (step / displayTotal) * 100);

  return (
    <div className="topbar">
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="topbar-row">
        <button className="back-btn" onClick={goPrev} aria-label="뒤로가기">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18l-6-6 6-6"
              stroke="#191F28"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="step-label">
          {Math.min(step, displayTotal)} / {displayTotal}
        </div>
        <div style={{ width: 36 }} />
      </div>
    </div>
  );
}
