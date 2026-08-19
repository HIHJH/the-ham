import { useBookingDispatch, useBookingState } from '../../state/BookingContext';

const POLICY_SUMMARY = [
  '물건의 입고가 완료된 날부터 이용 기간이 시작돼요',
  '물건을 모두 빼내도 이용 기간은 일시정지되지 않아요',
  '이용권 종료일 전까지는 언제든 다시 맡길 수 있어요',
];

const POLICY_DETAILS = [
  '이용 기간 중 물건을 일부 또는 전부 빼낼 수 있어요.',
  '보관 중인 물건이 없는 기간에도 이용권의 남은 기간은 계속 차감돼요.',
  '남은 이용 기간에 대한 환불, 크레딧 전환 및 기간 연장은 제공하지 않아요.',
  '이용권 종료일까지 다시 맡긴 물건도 동일한 종료일까지만 보관할 수 있어요.',
  '최초 입고 배송비는 보관료에 포함되어 있어 별도로 부과되지 않아요.',
  '다시 맡기거나(재입고) 물건을 뺄 때(출고)는 별도의 배송비가 발생할 수 있어요.',
];

export default function Step5Policy() {
  const { policyAcknowledged } = useBookingState();
  const dispatch = useBookingDispatch();

  const setAck = (value) => dispatch({ type: 'SET_POLICY_ACK', value });

  return (
    <div>
      <div className="eyebrow">STEP 5</div>
      <h1 className="title">이용 기간 및 정책 안내</h1>
      <p className="sub">
        이용 기간은 물건의 입고가 완료된 날부터 시작돼요. 이용 기간 중 물건을 빼거나 다시 맡길 수 있지만, 모든
        물건을 빼내더라도 이용 기간은 일시정지되지 않습니다.
      </p>

      <div className="hint-box">
        {POLICY_SUMMARY.map((line) => (
          <div key={line}>✅ {line}</div>
        ))}
      </div>

      <details className="policy-detail">
        <summary>정책 자세히 보기</summary>
        <ul className="policy-detail-list">
          {POLICY_DETAILS.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </details>

      <div className="policy-check-row" onClick={() => setAck(!policyAcknowledged)}>
        <div
          className={`checkbox${policyAcknowledged ? ' on' : ''}`}
          role="checkbox"
          aria-checked={policyAcknowledged}
        >
          {policyAcknowledged && (
            <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
              <path d="M1.5 5L4.8 8.3L11.5 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <div>
          <div className="label">위 이용 기간 정책을 모두 확인했어요</div>
          <div className="desc">체크해야 다음 단계로 진행할 수 있어요</div>
        </div>
      </div>
    </div>
  );
}
