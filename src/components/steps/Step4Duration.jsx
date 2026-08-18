import { useBookingDispatch, useBookingState } from '../../state/BookingContext';
import { discountRate } from '../../utils/pricing';
import PriceTable from '../PriceTable';

export default function Step4Duration() {
  const state = useBookingState();
  const dispatch = useBookingDispatch();
  const { months } = state;

  const stepMonth = (delta) => dispatch({ type: 'SET_MONTHS', months: months + delta });
  const rate = discountRate(months);

  return (
    <div>
      <div className="eyebrow">STEP 4</div>
      <h1 className="title">얼마나 보관하시겠어요?</h1>
      <p className="sub">
        1개월 단위로 설정할 수 있어요. 3개월 이상부터 5% 할인, 6개월 이상 10%, 12개월 이상 20% 할인 혜택이 제공돼요.
      </p>

      <div className="month-box">
        <div style={{ fontSize: 13, color: 'var(--ink-3)', fontWeight: 600 }}>보관 기간</div>
        <div className="month-value">
          <span>{months}</span>개월
        </div>
        {rate > 0 && (
          <div className="discount-badge">{Math.round(rate * 100)}% 장기 보관 할인 적용</div>
        )}
        <div className="month-stepper">
          <button onClick={() => stepMonth(-1)} disabled={months <= 1}>
            −
          </button>
          <button onClick={() => stepMonth(1)} disabled={months >= 12}>
            +
          </button>
        </div>
        <div className="month-track">
          <div className="month-fill" style={{ width: `${(months / 12) * 100}%` }} />
        </div>
        <div className="month-marks">
          <span>1개월</span>
          <span>3개월 할인</span>
          <span>6개월 할인</span>
          <span>12개월</span>
        </div>
      </div>

      <PriceTable state={state} />
    </div>
  );
}
