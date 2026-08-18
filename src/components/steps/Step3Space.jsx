import { useBookingDispatch, useBookingState } from '../../state/BookingContext';

const SPACE_OPTIONS = [
  {
    key: 'normal',
    icon: '🏠',
    name: '상온 보관',
    tag: '기본',
    mult: '기본 요금',
    chips: ['일반적인 보관환경', '일반 짐 적합'],
  },
  {
    key: 'cold',
    icon: '❄️',
    name: '제습존 보관',
    tag: '습기존',
    mult: '+20%',
    chips: ['습기 감소', '의류·가죽류 추천'],
  },
];

export default function Step3Space() {
  const { space } = useBookingState();
  const dispatch = useBookingDispatch();
  const selectSpace = (key) => dispatch({ type: 'SELECT_SPACE', space: key });

  return (
    <div>
      <div className="eyebrow">STEP 3</div>
      <h1 className="title">더함의 보관 공간을 선택해 주세요</h1>
      <p className="sub">짐의 특성에 맞는 보관 환경을 선택해 주세요. 제습존은 습기 관리에 초점을 둔 보관 공간입니다.</p>

      <div className="space-options">
        {SPACE_OPTIONS.map((opt) => (
          <div
            key={opt.key}
            className={`space-card${space === opt.key ? ' on' : ''}`}
            onClick={() => selectSpace(opt.key)}
          >
            <div className="space-head">
              <div className="space-name-wrap">
                <div className="space-label">{opt.tag}</div>
                <div className="space-name">{opt.icon} {opt.name}</div>
              </div>
              <div className="space-mult">{opt.mult}</div>
            </div>
            <div className="chip-row">
              {opt.chips.map((c) => (
                <div className="chip" key={c}>
                  {c}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="hint-box">🌱 보관 공간은 각기 다른 환경을 제공하며, 보관 상태와 품목 특성에 맞춰 안내해 드려요.</div>
    </div>
  );
}
