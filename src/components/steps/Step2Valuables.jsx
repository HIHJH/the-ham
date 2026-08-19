import { useBookingDispatch, useBookingState } from '../../state/BookingContext';
import { VALUABLE_CATEGORIES, boxTotalQty, valuationFeePerItem, won } from '../../utils/pricing';

function ValuableCard({ item, index, isBox, onUpdateField, onToggleCategory, onRemove }) {
  const fee = valuationFeePerItem(item.value);

  const handleValueChange = (e) => {
    const digitsOnly = e.target.value.replace(/[^0-9]/g, '');
    onUpdateField(item.id, 'value', digitsOnly ? Number(digitsOnly) : 0);
  };

  return (
    <div className="item-card">
      <div className="item-top">
        <div className="item-name">{isBox ? `박스 ${index + 1}` : `이형 품목 ${index + 1}`}</div>
        <button className="item-remove" onClick={() => onRemove(item.id)}>
          삭제
        </button>
      </div>

      {isBox && (
        <div className="field">
          <label>보관 카테고리 (중복 선택 가능)</label>
          <div className="category-grid">
            {VALUABLE_CATEGORIES.map((c) => (
              <button
                type="button"
                key={c.key}
                className={`category-chip${item.categories.includes(c.key) ? ' on' : ''}`}
                onClick={() => onToggleCategory(item.id, c.key)}
              >
                <span className="ico">{c.icon}</span>
                <span className="lb">{c.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {isBox && (
        <div className="field">
          <label>세부 품목</label>
          <textarea
            rows={3}
            placeholder="예: 캘빈클라인 코트, 니트 3벌, 운동화 2켤레..."
            value={item.description}
            onChange={(e) => onUpdateField(item.id, 'description', e.target.value)}
          />
        </div>
      )}

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

  const isBox = state.category === 'box';
  const unitLabel = isBox ? '박스' : '이형 품목';
  const totalBoxes = boxTotalQty(state);
  const canAddMore = state.valuables.length < totalBoxes;

  const addValuable = () => dispatch({ type: 'ADD_VALUABLE' });
  const removeValuable = (id) => dispatch({ type: 'REMOVE_VALUABLE', id });
  const updateValuableField = (id, field, value) =>
    dispatch({ type: 'UPDATE_VALUABLE', id, field, value });
  const toggleCategory = (id, category) =>
    dispatch({ type: 'TOGGLE_VALUABLE_CATEGORY', id, category });

  const total = state.valuables.reduce((a, v) => a + v.value, 0);
  const hasBlocked = state.valuables.some((v) => v.value > 3000000);

  return (
    <div>
      <div className="eyebrow">STEP 2</div>
      <h1 className="title">보관 품목을 알려주세요</h1>
      <p className="sub">
        {isBox
          ? `박스 ${totalBoxes}개마다 카테고리, 세부 품목, 가액을 입력해 주세요.`
          : `이형 품목 ${totalBoxes}개마다 상품 가액을 입력해 주세요.`}{' '}
        파손·분실 시 보상 기준이 되는 금액이에요. 50만원 이상 품목은 소정의 특별관리비가 추가돼요.
      </p>

      <div className="box-count-badge">
        입력 완료 {state.valuables.length} / {totalBoxes}개
      </div>

      {state.valuables.map((v, idx) => (
        <ValuableCard
          key={v.id}
          item={v}
          index={idx}
          isBox={isBox}
          onUpdateField={updateValuableField}
          onToggleCategory={toggleCategory}
          onRemove={removeValuable}
        />
      ))}

      {canAddMore && (
        <button className="btn-line" onClick={addValuable}>
          + {unitLabel} {state.valuables.length + 1} 정보 추가
        </button>
      )}

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
