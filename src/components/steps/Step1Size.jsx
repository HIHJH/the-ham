import { useState } from 'react';
import { useBookingDispatch, useBookingState } from '../../state/BookingContext';
import { PRICING_CONFIG, SIZE_LABEL, oddUnitPrice, won } from '../../utils/pricing';

const ODD_SIZE_HINTS = {
  s: '소: 한 변 100cm 이하 (예: 접이식 의자, 소형 협탁)',
  m: '중: 한 변 100~160cm (예: 2인용 소파, 러닝머신)',
  l: '대: 한 변 160cm 초과 (예: 3인용 소파, 매트리스)',
};

function OddItemForm({ onAdd, onCancel }) {
  const [name, setName] = useState('');
  const [size, setSize] = useState('s');
  const [cushion, setCushion] = useState(false);
  const [qty, setQty] = useState(1);

  const submit = () => {
    onAdd({
      id: Date.now(),
      name: name.trim() || '이형 품목',
      size,
      cushion,
      qty: Math.max(1, Number(qty) || 1),
    });
    setName('');
    setSize('s');
    setCushion(false);
    setQty(1);
    onCancel();
  };

  return (
    <div style={{ marginTop: 16, border: '1.5px solid var(--line)', borderRadius: 14, padding: 16 }}>
      <div className="field">
        <label>품목명</label>
        <input
          type="text"
          placeholder="예: 2인용 쇼파, 골프채"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="field">
        <label>사이즈</label>
        <select className="odd-size-select" value={size} onChange={(e) => setSize(e.target.value)}>
          <option value="s">소 · 100cm 이하 · 월 {won(PRICING_CONFIG.odd.sizes.s)}</option>
          <option value="m">중 · 100~160cm · 월 {won(PRICING_CONFIG.odd.sizes.m)}</option>
          <option value="l">대 · 160cm 초과 · 월 {won(PRICING_CONFIG.odd.sizes.l)}</option>
        </select>
      </div>
      <div className="odd-size-inline-hint">{ODD_SIZE_HINTS[size]}</div>
      <div className="toggle-row" style={{ marginTop: 0 }}>
        <div>
          <div className="label">완충 포장 신청</div>
          <div className="desc">파손 위험이 있는 품목에 권장 (+{won(PRICING_CONFIG.odd.cushionFee)}/월)</div>
        </div>
        <div
          className={`switch${cushion ? ' on' : ''}`}
          onClick={() => setCushion((v) => !v)}
          role="switch"
          aria-checked={cushion}
        >
          <div className="knob" />
        </div>
      </div>
      <div className="field" style={{ marginTop: 10 }}>
        <label>수량</label>
        <input type="number" min={1} value={qty} onChange={(e) => setQty(e.target.value)} />
      </div>
      <button
        className="btn-line"
        style={{ borderStyle: 'solid', background: 'var(--blue)', color: '#fff', borderColor: 'var(--blue)' }}
        onClick={submit}
      >
        품목 추가하기
      </button>
    </div>
  );
}

export default function Step1Size() {
  const state = useBookingState();
  const dispatch = useBookingDispatch();
  const [formOpen, setFormOpen] = useState(false);

  const setCategory = (category) => dispatch({ type: 'SET_CATEGORY', category });
  const stepQty = (size, delta) => dispatch({ type: 'SET_BOX_QTY', size, delta });
  const addOddItem = (item) => dispatch({ type: 'ADD_ODD_ITEM', item });
  const removeOddItem = (id) => dispatch({ type: 'REMOVE_ODD_ITEM', id });

  return (
    <div>
      <div className="eyebrow">STEP 1</div>
      <h1 className="title">어떤 짐을 맡기실 건가요?</h1>
      <p className="sub">
        더함과 함께 일상 속 공간을 정리해 보세요. 박스형은 소형 품목, 이형은 소파·운동기구처럼 큰 짐에 적합해요.
      </p>

      <div className="tabs">
        <div
          className={`tab${state.category === 'box' ? ' active' : ''}`}
          onClick={() => setCategory('box')}
        >
          박스형
        </div>
        <div
          className={`tab${state.category === 'odd' ? ' active' : ''}`}
          onClick={() => setCategory('odd')}
        >
          이형 (소파·운동기구 등)
        </div>
      </div>

      {state.category === 'box' && (
        <div>
          {Object.entries(PRICING_CONFIG.boxSizes).map(([key, cfg]) => (
            <div key={key} className={`size-card${state.boxQty[key] > 0 ? ' on' : ''}`}>
              <div className="size-icon">📦</div>
              <div className="size-info">
                <div className="size-name">{cfg.label} 박스</div>
                <div className="size-desc">
                  가로+세로+높이 합 {cfg.minSumCm}~{cfg.maxSumCm}cm · 무게 {cfg.minWeightKg}~{cfg.maxWeightKg}kg
                </div>
                {/* <div className="size-examples-label">예시</div> */}
                <div className="size-example-text">{cfg.example}</div>
                <div className="size-price">1개월 {won(cfg.totalPriceByMonths[1])} / 개</div>
              </div>
              <div className="stepper">
                <button onClick={() => stepQty(key, -1)} disabled={state.boxQty[key] === 0} aria-label="수량 감소">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6H10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </button>
                <div className="qty">{state.boxQty[key]}</div>
                <button onClick={() => stepQty(key, 1)} aria-label="수량 증가">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 2V10M2 6H10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
          <div className="hint-box">
            <div>💰 표시된 금액은 1개월 기준이에요. 보관 기간을 정하면 전체 총액을 다음 단계에서 보여드려요.</div>
            <div>⚖️ 선택하신 규격·중량을 초과하면 추가 비용이 발생하거나 접수가 제한될 수 있어요.</div>
          </div>
        </div>
      )}

      {state.category === 'odd' && (
        <div>
          {state.oddItems.map((i) => (
            <div key={i.id} className="item-card">
              <div className="item-top">
                <div className="item-name">
                  {i.name} · {SIZE_LABEL[i.size]} · {i.qty}개
                  {i.cushion ? ' · 완충포장' : ''}
                </div>
                <button className="item-remove" onClick={() => removeOddItem(i.id)}>
                  삭제
                </button>
              </div>
              <div className="size-price">월 {won(oddUnitPrice(i.size, i.cushion))} / 개</div>
            </div>
          ))}

          {!formOpen && (
            <button className="btn-line" onClick={() => setFormOpen(true)}>
              + 이형 품목 추가
            </button>
          )}
          {formOpen && <OddItemForm onAdd={addOddItem} onCancel={() => setFormOpen(false)} />}
        </div>
      )}

      <div className="hint-box">
        💡 사이즈가 애매하다면 큰 사이즈를 선택해 주세요. 방문 실측 후 사이즈는 조정될 수 있어요.
      </div>
    </div>
  );
}
