import { computePriceSummary, won } from '../utils/pricing';

const DELIVERY_LABEL = {
  inbound: '최초 입고 배송비',
  restock: '재입고 배송비',
  outbound: '출고 배송비',
};

export default function PriceTable({ state, deliveryType = 'inbound' }) {
  const { base, valFee, monthly, total, deliveryFee, grandTotal } = computePriceSummary(
    state,
    deliveryType
  );

  return (
    <div className="price-table">
      <div className="price-row">
        <div className="l">{state.months}개월 보관료 (공간 요금 반영)</div>
        <div className="v">{won(base)}</div>
      </div>
      <div className="price-row">
        <div className="l">품목 가액 특별관리비 ({state.months}개월 합계)</div>
        <div className="v">{won(valFee)}</div>
      </div>
      <div className="price-row">
        <div className="l">월 평균 보관료</div>
        <div className="v">{won(monthly)}</div>
      </div>
      <div className="price-row">
        <div className="l">{state.months}개월 총액</div>
        <div className="v">{won(total)}</div>
      </div>
      <div className="price-row">
        <div className="l">{DELIVERY_LABEL[deliveryType]}</div>
        <div className="v">{deliveryFee > 0 ? won(deliveryFee) : '보관료에 포함'}</div>
      </div>
      <div className="price-row total">
        <div className="l">총 결제 금액</div>
        <div className="v">{won(grandTotal)}</div>
      </div>
    </div>
  );
}
