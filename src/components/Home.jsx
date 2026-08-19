import { useBookingDispatch } from '../state/BookingContext';
import { useStorageDispatch, useStorageState } from '../state/StorageContext';
import { BOX_SIZE_LABEL, SPACE_LABEL, categoryIcons, daysUntil, formatDate, won } from '../utils/pricing';

const TICKET_STATUS_LABEL = { ACTIVE: '이용 중' };

function boxBreakdownLabel(boxQty) {
  return Object.entries(boxQty)
    .filter(([, qty]) => qty > 0)
    .map(([size, qty]) => `${BOX_SIZE_LABEL[size]} ${qty}개`)
    .join(' · ');
}

function ItemCard({ item }) {
  const icons = categoryIcons(item.categories);

  return (
    <div className="item-card">
      <div className="item-top">
        <div className="item-name">{item.label}</div>
        <div className="item-stored-at">{formatDate(item.storedAt)} 입고</div>
      </div>
      {icons && <div className="item-icons">{icons}</div>}
      <div className="item-desc">{item.description || '세부 품목 미입력'}</div>
      <div className="item-value">신고 가액 {won(item.value)}</div>
    </div>
  );
}

export default function Home() {
  const { ticket, items } = useStorageState();
  const storageDispatch = useStorageDispatch();
  const bookingDispatch = useBookingDispatch();

  const goBooking = () => {
    storageDispatch({ type: 'HIDE_HOME' });
    bookingDispatch({ type: 'START_BOOKING', mode: 'deposit' });
  };

  const goWithdraw = () => {
    storageDispatch({ type: 'START_WITHDRAW' });
  };

  return (
    <div className="device">
      <div className="notch" />
      <div className="statusbar" />
      <div className="home-header">더함</div>
      <div className="screens">
        <div className="screen active home-wrap">
          <div className="eyebrow">내 보관함</div>
          <h1 className="title">{ticket ? '이용 중인 보관함' : '아직 맡긴 물건이 없어요'}</h1>

          {!ticket && (
            <>
              <p className="sub">첫 보관을 신청하면 여기서 이용권과 보관 물품을 확인할 수 있어요.</p>
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <p>
                  보관 이용권이 없어요.
                  <br />
                  지금 첫 보관을 시작해 보세요.
                </p>
              </div>
              <button className="btn-line btn-line-solid" onClick={goBooking}>
                보관 신청하기
              </button>
            </>
          )}

          {ticket && (
            <>
              <p className="sub">이용권과 보관 중인 물품을 한눈에 확인하세요.</p>

              <div className="ticket-card">
                <div className="ticket-status-row">
                  <span className="chip-status">{TICKET_STATUS_LABEL[ticket.status]}</span>
                  <span className="ticket-remaining">남은 기간 D-{daysUntil(ticket.endDate)}</span>
                </div>
                <div className="ticket-grid">
                  <div className="ticket-cell">
                    <div className="k">시작일</div>
                    <div className="v">{formatDate(ticket.startDate)}</div>
                  </div>
                  <div className="ticket-cell">
                    <div className="k">종료일</div>
                    <div className="v">{formatDate(ticket.endDate)}</div>
                  </div>
                  <div className="ticket-cell">
                    <div className="k">보관 물품</div>
                    <div className="v">{items.length}개</div>
                  </div>
                  <div className="ticket-cell">
                    <div className="k">보관 공간</div>
                    <div className="v">{SPACE_LABEL[ticket.space] || '-'}</div>
                  </div>
                </div>
                {ticket.category === 'box' && (
                  <div className="ticket-box-breakdown">{boxBreakdownLabel(ticket.boxQty)}</div>
                )}
              </div>

              {items.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <p>
                    현재 보관 중인 물건이 없어요.
                    <br/>
                    보관 이용권은 {formatDate(ticket.endDate)}까지 이용할 수 있어요.
                    <br />
                    남은 기간 동안 언제든 다시 맡길 수 있습니다.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="section-label">보관 중인 물품 ({items.length}개)</div>
                  {items.map((item) => (
                    <ItemCard key={item.id} item={item} />
                  ))}
                </div>
              )}

              <div className="home-actions">
                <button className="btn-line" onClick={goBooking}>
                  {items.length === 0 ? '다시 보관하기' : '물건 추가 보관'}
                </button>
                {items.length > 0 && (
                  <button className="btn-line btn-line-solid" onClick={goWithdraw}>
                    물건 빼내기
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
