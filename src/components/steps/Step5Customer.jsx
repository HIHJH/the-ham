import { useEffect, useRef } from 'react';
import { useBookingDispatch, useBookingState } from '../../state/BookingContext';

const DEFAULT_PICKUP_TIME = '09:00';

const formatPhoneNumber = (value) => {
  const digits = (value || '').replace(/\D/g, '').slice(0, 11);

  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};

const formatDisplayDateTime = (date, time) => {
  if (!date) return '';
  return `${date} ${time || DEFAULT_PICKUP_TIME}`;
};

export default function Step5Customer() {
  const { customer } = useBookingState();
  const dispatch = useBookingDispatch();
  const postcodeWrapperRef = useRef(null);
  const dateInputRef = useRef(null);

  const update = (field, value) => dispatch({ type: 'UPDATE_CUSTOMER', field, value });
  const pickupDate = customer.date || '';
  const pickupTime = customer.time || DEFAULT_PICKUP_TIME;
  const selectedPickupTime = formatDisplayDateTime(pickupDate, pickupTime);

  useEffect(() => {
    return () => {
      if (postcodeWrapperRef.current) {
        postcodeWrapperRef.current.remove();
      }
    };
  }, []);

  const loadKakaoPostcode = () => {
    return new Promise((resolve, reject) => {
      if (window.daum?.Postcode) {
        resolve();
        return;
      }

      const existingScript = document.getElementById('kakao-postcode-script');
      if (existingScript) {
        existingScript.addEventListener('load', resolve, { once: true });
        existingScript.addEventListener('error', reject, { once: true });
        return;
      }

      const script = document.createElement('script');
      script.id = 'kakao-postcode-script';
      script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };

  const searchAddress = async () => {
    try {
      await loadKakaoPostcode();
      if (!window.daum?.Postcode) {
        throw new Error('Kakao Postcode not available');
      }

      const container = document.createElement('div');
      container.id = 'kakao-postcode-layer';
      Object.assign(container.style, {
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(15, 23, 42, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      });

      const panel = document.createElement('div');
      Object.assign(panel.style, {
        width: 'min(78vw, 340px)',
        maxWidth: '340px',
        height: 'min(62vh, 560px)',
        background: '#fff',
        borderRadius: '18px',
        overflow: 'hidden',
        boxShadow: '0 24px 60px rgba(15, 23, 42, 0.2)',
      });

      container.appendChild(panel);
      document.body.appendChild(container);
      postcodeWrapperRef.current = container;

      new window.daum.Postcode({
        oncomplete: (data) => {
          const baseAddress = data.roadAddress || data.jibunAddress || data.address || '';
          const detail = customer.pickupDetail || '';
          update('pickup', `${baseAddress}${detail ? ` ${detail}` : ''}`.trim());
          if (postcodeWrapperRef.current) {
            postcodeWrapperRef.current.remove();
            postcodeWrapperRef.current = null;
          }
        },
        onclose: () => {
          if (postcodeWrapperRef.current) {
            postcodeWrapperRef.current.remove();
            postcodeWrapperRef.current = null;
          }
        },
      }).embed(panel);
    } catch (error) {
      const val = window.prompt('픽업 주소를 직접 입력해 주세요');
      if (val === null) return;
      update('pickup', val.trim());
    }
  };

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

  return (
    <div>
      <div className="eyebrow">STEP 5</div>
      <h1 className="title">
        보내는 분 정보와
        <br />
        픽업 장소를 알려주세요
      </h1>
      <p className="sub">입력하신 정보로 픽업 일정을 안내해 드려요.</p>

      <div className="field">
        <label>이름</label>
        <input
          type="text"
          placeholder="홍길동"
          value={customer.name}
          onChange={(e) => update('name', e.target.value)}
        />
      </div>
      <div className="field">
        <label>전화번호</label>
        <input
          type="tel"
          placeholder="010-0000-0000"
          value={customer.phone}
          onChange={(e) => update('phone', formatPhoneNumber(e.target.value))}
        />
      </div>

      <div className="field">
        <label>픽업 장소</label>
        <input
          type="text"
          placeholder="주소 검색"
          value={customer.pickup}
          readOnly
          onClick={searchAddress}
          style={{ cursor: 'pointer', background: '#fff' }}
        />
      </div>

      <div className="field">
        <label>상세 주소</label>
        <input
          type="text"
          placeholder="예: 101동 302호, 로비 앞"
          value={customer.pickupDetail || ''}
          onChange={(e) => {
            const nextDetail = e.target.value;
            const base = customer.pickup || '';
            const cleanBase = base.replace(/\s+\S+$/, '');
            update('pickup', `${cleanBase}${nextDetail ? ` ${nextDetail}` : ''}`.trim());
            update('pickupDetail', nextDetail);
          }}
        />
      </div>

      <div className="field">
        <label>희망 픽업 날짜</label>
        <div className="date-field-wrap" onClick={openDatePicker}>
          <input
            className={`date-input${pickupDate ? ' has-value' : ''}`}
            ref={dateInputRef}
            type="date"
            value={pickupDate}
            min={new Date().toISOString().slice(0, 10)}
            max={new Date(Date.now() + 1000 * 60 * 60 * 24 * 180).toISOString().slice(0, 10)}
            onFocus={openDatePicker}
            onChange={(e) => {
              update('date', e.target.value);
              if (!customer.time) update('time', DEFAULT_PICKUP_TIME);
            }}
          />
          {!pickupDate && <span className="native-date-placeholder">날짜를 선택해주세요</span>}
        </div>
      </div>
    </div>
  );
}
