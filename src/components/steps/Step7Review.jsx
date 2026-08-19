import { useBookingDispatch, useBookingState } from '../../state/BookingContext';
import { BOX_SIZE_LABEL, PRICING_CONFIG, SIZE_LABEL, SPACE_LABEL, won } from '../../utils/pricing';
import PriceTable from '../PriceTable';

function SectionHead({ title, onEdit }) {
  return (
    <div className="review-head">
      <div className="t">{title}</div>
      <button className="e" onClick={onEdit}>
        수정
      </button>
    </div>
  );
}

export default function Step7Review() {
  const state = useBookingState();
  const dispatch = useBookingDispatch();
  const jumpTo = (step) => dispatch({ type: 'GO_TO_STEP', step });

  const valuationTotal = state.valuables.reduce((a, v) => a + v.value, 0);

  return (
    <div>
      <div className="eyebrow">STEP 8</div>
      <h1 className="title">예약 내용을 확인해 주세요</h1>
      <p className="sub">결제 전 마지막으로 확인할게요.</p>

      <div className="review-section">
        <SectionHead title="📦 짐 정보" onEdit={() => jumpTo(1)} />
        {state.category === 'box'
          ? Object.keys(PRICING_CONFIG.boxSizes)
              .filter((s) => state.boxQty[s] > 0)
              .map((s) => (
                <div className="review-row" key={s}>
                  <div className="l">박스형 · {BOX_SIZE_LABEL[s]}</div>
                  <div className="v">{state.boxQty[s]}개</div>
                </div>
              ))
          : state.oddItems.map((i) => (
              <div className="review-row" key={i.id}>
                <div className="l">
                  {i.name} · {SIZE_LABEL[i.size]}
                  {i.cushion ? ' · 완충포장' : ''}
                </div>
                <div className="v">{i.qty}개</div>
              </div>
            ))}
        {state.category === 'box' && Object.values(state.boxQty).every((v) => v === 0) && (
          <div className="review-row">
            <div className="l">선택된 짐이 없어요</div>
          </div>
        )}
      </div>
      <hr className="div" />

      <div className="review-section">
        <SectionHead title="💰 보관 품목 가액" onEdit={() => jumpTo(2)} />
        <div className="review-row">
          <div className="l">등록 품목 수</div>
          <div className="v">{state.valuables.length}개</div>
        </div>
        <div className="review-row">
          <div className="l">가액 합계</div>
          <div className="v">{won(valuationTotal)}</div>
        </div>
      </div>
      <hr className="div" />

      <div className="review-section">
        <SectionHead title="🌡️ 보관 공간" onEdit={() => jumpTo(3)} />
        <div className="review-row">
          <div className="l">선택 공간</div>
          <div className="v">{state.space ? SPACE_LABEL[state.space] : '미선택'}</div>
        </div>
      </div>
      <hr className="div" />

      <div className="review-section">
        <SectionHead title="🗓️ 보관 기간" onEdit={() => jumpTo(4)} />
        <div className="review-row">
          <div className="l">기간</div>
          <div className="v">{state.months}개월</div>
        </div>
      </div>
      <hr className="div" />

      <div className="review-section">
        <SectionHead title="🚚 픽업 정보" onEdit={() => jumpTo(6)} />
        <div className="review-row">
          <div className="l">이름</div>
          <div className="v">{state.customer.name || '-'}</div>
        </div>
        <div className="review-row">
          <div className="l">연락처</div>
          <div className="v">{state.customer.phone || '-'}</div>
        </div>
        <div className="review-row">
          <div className="l">픽업지</div>
          <div className="v">{state.customer.pickup || '-'}</div>
        </div>
      </div>
      <hr className="div" />

      <PriceTable state={state} />

      <div className="hint-box" style={{ marginTop: 14 }}>
        ℹ️ 물건을 중간에 모두 빼내더라도 이용권은 종료일까지 유지되며, 남은 기간에 대한 환불 또는 기간 연장은
        제공되지 않아요.
      </div>
    </div>
  );
}
