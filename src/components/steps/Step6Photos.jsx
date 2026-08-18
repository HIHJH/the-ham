import { useState } from 'react';
import { useBookingDispatch, useBookingState } from '../../state/BookingContext';
import { boxTotalQty } from '../../utils/pricing';

export default function Step6Photos() {
  const state = useBookingState();
  const dispatch = useBookingDispatch();
  const [scanning, setScanning] = useState(false);

  const totalBoxes = boxTotalQty(state);
  const filledCount = state.photos.filter(Boolean).length;

  const capturePhoto = (index) => {
    if (state.photos[index] || scanning) return;
    setScanning(true);
    // 실제 서비스에서는 이 자리에서 카메라 촬영 + AI 박스 인식 API를 호출한다.
    setTimeout(() => {
      dispatch({ type: 'ADD_PHOTO', index });
      setScanning(false);
    }, 700);
  };

  const slotCount = Math.max(totalBoxes, state.photos.length, 1);
  const slots = Array.from({ length: slotCount }, (_, i) => i);
  const showExtraSlot = totalBoxes > filledCount;

  return (
    <div>
      <div className="eyebrow">STEP 6</div>
      <h1 className="title">박스 외관을 촬영해 주세요</h1>
      <p className="sub">
        촬영하면 AI가 박스를 자동으로 인식해서 번호를 매겨드려요. 총 <b>{totalBoxes}</b>개 박스를 모두 촬영해
        주세요.
      </p>

      <div className="photo-grid">
        {slots.map((i) => {
          const filled = state.photos[i];
          return (
            <div
              key={i}
              className={`photo-slot${filled ? ' filled' : ''}`}
              onClick={() => capturePhoto(i)}
            >
              {filled ? (
                <>
                  <div className="box-chip">📦 No.{filled.num}</div>
                  <div className="icon-cam">🖼️</div>
                </>
              ) : (
                <div className="plus">+</div>
              )}
            </div>
          );
        })}
        {showExtraSlot && (
          <div className="photo-slot" onClick={() => capturePhoto(filledCount)}>
            <div className="plus">+</div>
          </div>
        )}
      </div>

      {scanning && (
        <div className="scan-note">
          <div className="dot-spin" /> AI가 박스를 인식하고 번호를 매핑하는 중이에요...
        </div>
      )}
    </div>
  );
}
