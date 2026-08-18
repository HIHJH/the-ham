import { useBookingDispatch } from '../state/BookingContext';

export default function Landing() {
  const dispatch = useBookingDispatch();

  const startBooking = (mode) => {
    if (mode === 'pickup') {
      window.alert('준비 중입니다. 곧 이용하실 수 있어요.');
      return;
    }
    dispatch({ type: 'START_BOOKING', mode });
  };

  return (
    <div className="landing-wrap">
      <div className="landing-logo-box">
        <img
          src="/logo.png"
          alt="더함 로고"
          className="landing-logo-image"
        />
      </div>

      <div className="landing-copy">
        <div className="landing-kicker">THE-HAM · 더함</div>
        <h1>일상 속에 공간을 더하다</h1>
        <p>필요한 만큼만 맡기는 생활형 보관 서비스</p>
      </div>

      <div className="landing-actions">
        <button className="landing-btn primary" onClick={() => startBooking('deposit')}>
          보관 신청하기
        </button>
        <button className="landing-btn secondary" onClick={() => startBooking('pickup')}>
          맡긴 짐 받아보기
        </button>
      </div>
    </div>
  );
}
