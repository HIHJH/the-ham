import { useRef, useState } from 'react';
import { useStorageDispatch, useStorageState } from '../state/StorageContext';
import {
  PRICING_CONFIG,
  categoryIcons,
  daysUntil,
  formatDate,
  monthsUntil,
  won,
} from '../utils/pricing';
import { formatPhoneNumber } from '../utils/format';

const TOTAL_WITHDRAW_STEPS = 4;

const CheckIcon = () => (
  <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
    <path
      d="M1.5 5L4.8 8.3L11.5 1.5"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const initialDelivery = {
  recipientName: '',
  recipientPhone: '',
  address: '',
  addressDetail: '',
  sameAsSender: false,
  date: '',
  note: '',
};

export default function Withdraw() {
  const { ticket, items } = useStorageState();
  const storageDispatch = useStorageDispatch();

  const [step, setStep] = useState(1);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [delivery, setDelivery] = useState(initialDelivery);
  const [done, setDone] = useState(null); // { withdrawnCount, remainingCount } after 신청 완료
  const dateInputRef = useRef(null);

  const openDatePicker = () => {
    const input = dateInputRef.current;
    if (!input) return;
    if (typeof input.showPicker === 'function') {
      input.showPicker();
      return;
    }
    input.focus();
    input.click();
  };

  const toggleItem = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const updateDelivery = (field, value) => setDelivery((prev) => ({ ...prev, [field]: value }));

  const toggleSameAsSender = () => {
    setDelivery((prev) => {
      const same = !prev.sameAsSender;
      if (!same) {
        return { ...prev, sameAsSender: false, recipientName: '', recipientPhone: '', address: '', addressDetail: '' };
      }
      const c = ticket?.customer || {};
      // customer.pickup은 이미 상세 주소까지 합쳐진 전체 주소라 addressDetail은 비워둔다.
      return {
        ...prev,
        sameAsSender: true,
        recipientName: c.name || '',
        recipientPhone: c.phone || '',
        address: c.pickup || '',
        addressDetail: '',
      };
    });
  };

  const exitToHome = () => storageDispatch({ type: 'CANCEL_WITHDRAW' });

  const goBack = () => {
    if (step === 1) {
      exitToHome();
      return;
    }
    setStep((s) => s - 1);
  };

  const goNext = () => {
    if (step === 1) {
      if (selectedIds.size === 0) {
        alert('출고할 물품을 1개 이상 선택해 주세요.');
        return;
      }
      setStep(2);
      return;
    }
    if (step === 2) {
      setStep(3);
      return;
    }
    if (step === 3) {
      if (!delivery.recipientName || !delivery.recipientPhone || !delivery.address) {
        alert('받는 사람 이름, 연락처, 도착 장소를 입력해 주세요.');
        return;
      }
      setStep(4);
      return;
    }
    if (step === 4) {
      const ids = Array.from(selectedIds);
      setDone({ withdrawnCount: ids.length, remainingCount: items.length - ids.length });
      storageDispatch({ type: 'COMPLETE_WITHDRAW', ids });
    }
  };

  if (!ticket) {
    exitToHome();
    return null;
  }

  if (done) {
    return (
      <div className="device">
        <div className="notch" />
        <div className="statusbar" />
        <div className="screens">
          <div className="screen active complete-wrap">
            <div className="complete-icon">📦</div>
            <h1 className="title" style={{ textAlign: 'center' }}>
              출고 신청이 완료됐어요
            </h1>
            <p className="sub" style={{ textAlign: 'center' }}>
              {delivery.date ? `${delivery.date} ` : ''}도착지로 배송해 드려요.
              <br />
              보관 중인 물품 {done.remainingCount}개는 계속 보관되고,
              <br />
              이용권 종료일은 변경되지 않아요.
            </p>
          </div>
        </div>
        <div className="bottomcta">
          <button className="cta-btn" onClick={exitToHome}>
            홈으로
          </button>
        </div>
      </div>
    );
  }

  const selectedCount = selectedIds.size;
  const allSelected = selectedCount === items.length;
  const remainingAfter = items.length - selectedCount;
  const remainMonths = monthsUntil(ticket.endDate);

  return (
    <div className="device">
      <div className="notch" />
      <div className="statusbar" />
      <div className="topbar">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${(step / TOTAL_WITHDRAW_STEPS) * 100}%` }} />
        </div>
        <div className="topbar-row">
          <button className="back-btn" onClick={goBack} aria-label="뒤로가기">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="#191F28" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="step-label">
            물건 빼내기 · {step}/{TOTAL_WITHDRAW_STEPS}
          </div>
          <div style={{ width: 36 }} />
        </div>
      </div>

      <div className="screens">
        <div className="screen active">
          {step === 1 && (
            <div>
              <div className="eyebrow">STEP 1</div>
              <h1 className="title">빼낼 물품을 선택해 주세요</h1>
              <p className="sub">출고하고 싶은 박스 또는 이형 화물을 선택해 주세요.</p>

              {items.map((item) => {
                const checked = selectedIds.has(item.id);
                const icons = categoryIcons(item.categories);
                return (
                  <div
                    key={item.id}
                    className={`item-card withdraw-select-card${checked ? ' on' : ''}`}
                    onClick={() => toggleItem(item.id)}
                  >
                    <div className="item-top">
                      <div className="withdraw-select-head">
                        <div className={`checkbox${checked ? ' on' : ''}`} role="checkbox" aria-checked={checked}>
                          {checked && <CheckIcon />}
                        </div>
                        <div className="item-name">{item.label}</div>
                      </div>
                      <div className="item-stored-at">{formatDate(item.storedAt)} 입고</div>
                    </div>
                    {icons && <div className="item-icons">{icons}</div>}
                    <div className="item-desc">{item.description || '세부 품목 미입력'}</div>
                    <div className="item-value">신고 가액 {won(item.value)}</div>
                  </div>
                );
              })}

              <div className="hint-box">
                📦 박스에 보관된 물건은 박스 단위로 출고돼요. 박스 내부의 개별 물건만 선택해서 출고할 수는 없어요.
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="eyebrow">STEP 2</div>
              <h1 className="title">{allSelected ? '모든 물건을 빼내시겠어요?' : '출고 내용을 확인해 주세요'}</h1>
              <p className="sub">
                {allSelected
                  ? `물건을 모두 빼내도 이용권은 ${formatDate(ticket.endDate)}까지 그대로 유지돼요.`
                  : '선택한 물품만 출고되고, 나머지 물품은 계속 보관돼요.'}
              </p>

              <div className="ticket-card">
                <div className="ticket-status-row">
                  <span className="chip-status">이용 중</span>
                  <span className="ticket-remaining">남은 기간 D-{daysUntil(ticket.endDate)}</span>
                </div>
                <div className="ticket-grid">
                  <div className="ticket-cell">
                    <div className="k">출고할 물품</div>
                    <div className="v">{selectedCount}개</div>
                  </div>
                  <div className="ticket-cell">
                    <div className="k">출고 후 보관 물품</div>
                    <div className="v">{remainingAfter}개</div>
                  </div>
                  <div className="ticket-cell">
                    <div className="k">이용권 종료일</div>
                    <div className="v">{formatDate(ticket.endDate)}</div>
                  </div>
                  <div className="ticket-cell">
                    <div className="k">남은 이용 기간</div>
                    <div className="v">약 {remainMonths}개월</div>
                  </div>
                </div>
              </div>

              <div className="hint-box">
                <div>✅ 물건을 빼내도 이용 기간은 일시정지되지 않고 계속 진행돼요.</div>
                <div>✅ 남은 약 {remainMonths}개월 동안은 이용권 종료일 전까지 언제든 다시 보관할 수 있어요.</div>
                <div>🚫 남은 기간에 대한 환불이나 기간 연장은 제공되지 않아요.</div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="eyebrow">STEP 3</div>
              <h1 className="title">받으실 정보를 입력해 주세요</h1>
              <p className="sub">출고된 물건을 받으실 분의 정보를 알려주세요.</p>

              <div className="policy-check-row" onClick={toggleSameAsSender} style={{ marginTop: 0, marginBottom: 18 }}>
                <div className={`checkbox${delivery.sameAsSender ? ' on' : ''}`} role="checkbox" aria-checked={delivery.sameAsSender}>
                  {delivery.sameAsSender && <CheckIcon />}
                </div>
                <div>
                  <div className="label">보내는 사람과 동일해요</div>
                  <div className="desc">신청 시 입력했던 이름·연락처·주소를 그대로 사용해요</div>
                </div>
              </div>

              <div className="field">
                <label>받는 사람 이름</label>
                <input
                  type="text"
                  placeholder="홍길동"
                  value={delivery.recipientName}
                  onChange={(e) => updateDelivery('recipientName', e.target.value)}
                />
              </div>
              <div className="field">
                <label>받는 사람 연락처</label>
                <input
                  type="tel"
                  placeholder="010-0000-0000"
                  value={delivery.recipientPhone}
                  onChange={(e) => updateDelivery('recipientPhone', formatPhoneNumber(e.target.value))}
                />
              </div>
              <div className="field">
                <label>도착 장소</label>
                <input
                  type="text"
                  placeholder="배송받을 주소를 입력해 주세요"
                  value={delivery.address}
                  onChange={(e) => updateDelivery('address', e.target.value)}
                />
              </div>
              <div className="field">
                <label>상세 주소</label>
                <input
                  type="text"
                  placeholder="예: 101동 302호, 로비 앞"
                  value={delivery.addressDetail}
                  onChange={(e) => updateDelivery('addressDetail', e.target.value)}
                />
              </div>
              <div className="field">
                <label>희망 배송일</label>
                <div className="date-field-wrap" onClick={openDatePicker}>
                  <input
                    className={`date-input${delivery.date ? ' has-value' : ''}`}
                    ref={dateInputRef}
                    type="date"
                    min={new Date().toISOString().slice(0, 10)}
                    value={delivery.date}
                    onFocus={openDatePicker}
                    onChange={(e) => updateDelivery('date', e.target.value)}
                  />
                  {!delivery.date && <span className="native-date-placeholder">날짜를 선택해주세요</span>}
                </div>
              </div>
              <div className="field">
                <label>배송 요청사항</label>
                <input
                  type="text"
                  placeholder="예: 부재 시 경비실에 맡겨주세요"
                  value={delivery.note}
                  onChange={(e) => updateDelivery('note', e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <div className="eyebrow">STEP 4</div>
              <h1 className="title">출고 신청 전 확인해 주세요</h1>
              <p className="sub">아래 내용으로 출고를 신청할게요.</p>

              <div className="review-section">
                <div className="review-row">
                  <div className="l">출고 물품</div>
                  <div className="v">{selectedCount}개</div>
                </div>
                <div className="review-row">
                  <div className="l">받는 사람</div>
                  <div className="v">{delivery.recipientName}</div>
                </div>
                <div className="review-row">
                  <div className="l">연락처</div>
                  <div className="v">{delivery.recipientPhone}</div>
                </div>
                <div className="review-row">
                  <div className="l">도착 장소</div>
                  <div className="v">
                    {delivery.address} {delivery.addressDetail}
                  </div>
                </div>
                <div className="review-row">
                  <div className="l">희망 배송일</div>
                  <div className="v">{delivery.date || '미지정'}</div>
                </div>
              </div>
              <hr className="div" />

              <div className="price-table">
                <div className="price-row">
                  <div className="l">출고 배송비</div>
                  <div className="v">{won(PRICING_CONFIG.delivery.outbound)}</div>
                </div>
                <div className="price-row total">
                  <div className="l">이용권 종료일</div>
                  <div className="v">{formatDate(ticket.endDate)}</div>
                </div>
              </div>

              <div className="hint-box" style={{ marginTop: 14 }}>
                ℹ️ 물건을 중간에 모두 빼내더라도 이용권은 종료일까지 유지되며, 남은 기간에 대한 환불 또는 기간
                연장은 제공되지 않아요.
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bottomcta">
        <button className="cta-btn" onClick={goNext}>
          {step === 4 ? '출고 신청하기' : '다음'}
        </button>
      </div>
    </div>
  );
}
