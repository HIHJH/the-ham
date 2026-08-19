import { useRef, useState } from 'react';
import { useBookingDispatch, useBookingState } from '../../state/BookingContext';
import { boxTotalQty, categoryIcons } from '../../utils/pricing';

const boxInfoSummary = (valuable) => {
  if (!valuable) return null;
  return { icons: categoryIcons(valuable.categories), description: valuable.description };
};

const buildMockBoxes = (count) => {
  const safeCount = Math.max(1, count);
  const cols = safeCount <= 2 ? safeCount : 3;
  const rows = Math.ceil(safeCount / cols);
  const cellW = 100 / cols;
  const cellH = 100 / rows;

  return Array.from({ length: safeCount }, (_, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    const width = Math.max(20, cellW - 12);
    const height = Math.max(16, cellH - 14);
    const x = col * cellW + 6;
    const y = row * cellH + 7;

    return {
      id: `${Date.now()}-${index}`,
      num: index + 1,
      x,
      y,
      w: width,
      h: height,
    };
  });
};

export default function Step6Photos() {
  const state = useBookingState();
  const dispatch = useBookingDispatch();
  const fileInputRef = useRef(null);
  const [scanning, setScanning] = useState(false);

  const totalBoxes = boxTotalQty(state);
  const boxCount = state.photos.length;

  const triggerUpload = () => {
    if (!fileInputRef.current || scanning) return;
    fileInputRef.current.click();
  };

  const uploadPhoto = (file) => {
    if (!file || scanning) return;
    setScanning(true);

    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = typeof reader.result === 'string' ? reader.result : '';

      // 실제 서비스에서는 object detection API 결과를 이 단계에서 반영한다.
      setTimeout(() => {
        const boxes = buildMockBoxes(totalBoxes);
        dispatch({ type: 'SET_DETECTED_PHOTO', imageUrl, boxes });
        setScanning(false);
      }, 700);
    };

    reader.onerror = () => {
      setScanning(false);
    };

    reader.readAsDataURL(file);
  };

  const onFileChange = (event) => {
    const [file] = event.target.files || [];
    uploadPhoto(file);
    event.target.value = '';
  };

  const updateBoxNum = (id, num) => {
    dispatch({ type: 'UPDATE_BOX_NUMBER', id, num: Number(num) });
  };

  const rerunDetection = () => {
    if (!state.photoImage || scanning) return;
    setScanning(true);
    setTimeout(() => {
      dispatch({ type: 'SET_DETECTED_PHOTO', imageUrl: state.photoImage, boxes: buildMockBoxes(totalBoxes) });
      setScanning(false);
    }, 500);
  };

  return (
    <div>
      <div className="eyebrow">STEP 7</div>
      <h1 className="title">박스 사진 한 장을 올려주세요</h1>
      <p className="sub">
        사진을 업로드하면 AI가 박스를 자동 인식해요. 고객님이 번호를 확정하면 기사님이 같은 번호 기준으로
        바코드를 부착해요.
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onFileChange}
        hidden
      />

      <div className="photo-upload-card" onClick={triggerUpload}>
        {state.photoImage ? (
          <div className="detected-photo-wrap">
            <img src={state.photoImage} alt="업로드한 박스 사진" className="detected-photo-image" />
            {state.photos.map((box) => (
              <div
                key={box.id}
                className="detected-box"
                style={{
                  left: `${box.x}%`,
                  top: `${box.y}%`,
                  width: `${box.w}%`,
                  height: `${box.h}%`,
                }}
              >
                <span className="detected-box-chip">No.{box.num}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="upload-placeholder">
            <div className="plus">+</div>
            <p>박스가 보이도록 사진을 1장 업로드해 주세요</p>
          </div>
        )}
      </div>

      {state.photoImage && (
        <div className="scan-actions">
          <button type="button" className="ghost-btn" onClick={triggerUpload}>
            사진 다시 올리기
          </button>
          <button type="button" className="ghost-btn" onClick={rerunDetection}>
            AI 재인식
          </button>
        </div>
      )}

      {state.photos.length > 0 && (
        <div className="box-number-editor">
          <div className="box-number-head">
            감지된 박스를 입력했던 박스 정보와 직접 매핑해 주세요 ({boxCount}/{totalBoxes})
          </div>
          {state.photos.map((box, idx) => {
            const summary = boxInfoSummary(state.valuables[box.num - 1]);
            return (
              <div className="box-map-card" key={box.id}>
                <div className="box-map-head">
                  감지 박스 {idx + 1} → <b>No.{box.num}</b>
                </div>
                <div className="box-map-chips">
                  {Array.from({ length: totalBoxes }, (_, i) => i + 1).map((num) => (
                    <button
                      type="button"
                      key={num}
                      className={`box-map-chip${box.num === num ? ' on' : ''}`}
                      onClick={() => updateBoxNum(box.id, num)}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <div className="box-map-preview">
                  {summary?.icons && <span className="box-map-icons">{summary.icons}</span>}
                  <span className="box-map-desc">
                    {summary?.description ? summary.description : '세부 품목 미입력'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {scanning && (
        <div className="scan-note">
          <div className="dot-spin" /> AI가 박스를 인식하고 번호 후보를 생성하는 중이에요...
        </div>
      )}
    </div>
  );
}
