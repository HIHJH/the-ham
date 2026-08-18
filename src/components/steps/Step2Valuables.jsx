import { useBookingDispatch, useBookingState } from '../../state/BookingContext';
import { valuationFeePerItem, won } from '../../utils/pricing';

function ValuableCard({ item, onUpdate, onRemove }) {
  const fee = valuationFeePerItem(item.value);

  const handleValueChange = (e) => {
    const digitsOnly = e.target.value.replace(/[^0-9]/g, '');
    onUpdate(item.id, 'value', digitsOnly ? Number(digitsOnly) : 0);
  };

  return (
    <div className="item-card">
      <div className="item-top">
        <div className="item-name">보관 품목</div>
        <button className="item-remove" onClick={() => onRemove(item.id)}>
          삭제
        </button>
      </div>
      <div className="field">
        <label>품목명</label>
        <input
          type="text"
          placeholder="예: 캘빈클라인 코트"
          value={item.name}
          onChange={(e) => onUpdate(item.id, 'name', e.target.value)}
        />
      </div>
      <div className="field" style={{ marginBottom: 6 }}>
        <label>상품 가액 (원)</label>
        <input
          type="text"
          inputMode="numeric"
          placeholder="0"
          value={item.value ? item.value.toLocaleString('ko-KR') : ''}
          onChange={handleValueChange}
        />
      </div>
      {fee === null && <div className="fee-badge err">🚫 300만원 초과 - 접수 불가</div>}
      {fee !== null && fee > 0 && (
        <div className="fee-badge warn">+{won(fee)}/월 특별관리비</div>
      )}
    </div>
  );
}

export default function Step2Valuables() {
  const state = useBookingState();
  const dispatch = useBookingDispatch();

  const addValuable = () => dispatch({ type: 'ADD_VALUABLE' });
  const removeValuable = (id) => dispatch({ type: 'REMOVE_VALUABLE', id });
  const updateValuable = (id, field, value) =>
    dispatch({ type: 'UPDATE_VALUABLE', id, field, value });

  const total = state.valuables.reduce((a, v) => a + v.value, 0);
  const hasBlocked = state.valuables.some((v) => v.value > 3000000);

  return (
    <div>
      <div className="eyebrow">STEP 2</div>
      <h1 className="title">보관 품목의 가치를 알려주세요</h1>
      <p className="sub">
        파손·분실 시 보상 기준이 되는 금액이에요. 50만원 이상 품목은 소정의 특별관리비가 추가돼요.
      </p>

      {state.valuables.map((v) => (
        <ValuableCard key={v.id} item={v} onUpdate={updateValuable} onRemove={removeValuable} />
      ))}

      <button className="btn-line" onClick={addValuable}>
        + 보관 품목 추가
      </button>

      {hasBlocked && (
        <div className="hint-box" style={{ background: 'var(--red-light)', color: 'var(--red)' }}>
          🚫 300만원을 초과하는 품목이 있어요. 금액을 다시 확인해 주세요.
        </div>
      )}

      <div className="summary-total">
        <div className="l">전체 보관 품목 가액 합계</div>
        <div className="v">{won(total)}</div>
      </div>

      <div className="hint-box">
        💰 50만원 이상 100만원 미만 품목: <b>+1,000원/월</b>
        <br />
        💰 100만원 이상 300만원 이하 품목: <b>+2,000원/월</b>
        <br />
        🚫 300만원을 초과하는 품목은 접수가 어려워요.
      </div>
    </div>
  );
}
