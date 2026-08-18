import { computePriceSummary, won } from '../utils/pricing';

export default function PriceTable({ state }) {
  const { base, valFee, rate, monthlyAfter, total } = computePriceSummary(state);

  return (
    <div className="price-table">
      <div className="price-row">
        <div className="l">보관료 (공간 요금 반영)</div>
        <div className="v">{won(base)}</div>
      </div>
      <div className="price-row">
        <div className="l">품목 가액 특별관리비</div>
        <div className="v">{won(valFee)}</div>
      </div>
      {rate > 0 && (
        <div className="price-row discount">
          <div className="l">장기 보관 할인</div>
          <div className="v">-{Math.round(rate * 100)}%</div>
        </div>
      )}
      <div className="price-row">
        <div className="l">월 보관료</div>
        <div className="v">{won(monthlyAfter)}</div>
      </div>
      <div className="price-row total">
        <div className="l">{state.months}개월 총액</div>
        <div className="v">{won(total)}</div>
      </div>
    </div>
  );
}
