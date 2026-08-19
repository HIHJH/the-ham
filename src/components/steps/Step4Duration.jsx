import { useBookingDispatch, useBookingState } from '../../state/BookingContext';
import { addMonths, formatDate } from '../../utils/pricing';
import PriceTable from '../PriceTable';

export default function Step4Duration() {
  const state = useBookingState();
  const dispatch = useBookingDispatch();
  const { months } = state;

  const stepMonth = (delta) => dispatch({ type: 'SET_MONTHS', months: months + delta });
  const estimatedEndDate = formatDate(addMonths(months));

  return (
    <div>
      <div className="eyebrow">STEP 4</div>
      <h1 className="title">얼마나 보관하시겠어요?</h1>
      <p className="sub">
        보관 기간은 1개월부터 12개월까지 자유롭게 선택할 수 있어요. 월 보관료는 선택한 기간과 관계없이 동일한
        기준으로 계산됩니다.
      </p>

      <div className="month-box">
        <div style={{ fontSize: 13, color: 'var(--ink-3)', fontWeight: 600 }}>보관 기간</div>
        <div className="month-value">
          <span>{months}</span>개월
        </div>
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
          <span>6개월</span>
          <span>12개월</span>
        </div>
      </div>

      <div className="summary-total" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className="l">이용 시작 기준</div>
          <div className="v" style={{ fontSize: 13.5 }}>
            물건 입고 완료일
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className="l">오늘 접수 시 예상 종료일</div>
          <div className="v" style={{ fontSize: 13.5 }}>
            {estimatedEndDate}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className="l">최초 입고 배송비</div>
          <div className="v" style={{ fontSize: 13.5 }}>
            보관료에 포함
          </div>
        </div>
      </div>

      <PriceTable state={state} />
    </div>
  );
}
