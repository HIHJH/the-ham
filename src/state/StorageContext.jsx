import { createContext, useContext, useMemo, useReducer } from 'react';
import { addMonths } from '../utils/pricing';

const initialState = {
  showHome: false,
  showWithdraw: false,
  ticket: null, // { id, status, startDate, endDate, months, category, boxQty, space, customer }
  items: [], // { id, kind, label, categories, description, value, storedAt }
};

/** 이형 화물은 qty가 묶여 있어 valuables(개별 단위)와 순서를 맞추려면 낱개로 펼쳐야 한다. */
function flattenOddUnits(oddItems) {
  const units = [];
  oddItems.forEach((item) => {
    for (let i = 0; i < item.qty; i++) units.push(item);
  });
  return units;
}

function buildTicketAndItems(booking) {
  const { category, boxQty, oddItems, valuables, space, months, customer } = booking;
  const startDate = new Date();
  const endDate = addMonths(months, startDate);

  const ticket = {
    id: Date.now(),
    status: 'ACTIVE',
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    months,
    category,
    boxQty: category === 'box' ? { ...boxQty } : null,
    space,
    customer: { ...customer },
  };

  const oddUnits = category === 'odd' ? flattenOddUnits(oddItems) : [];
  const items = valuables.map((v, idx) => ({
    id: v.id,
    kind: category,
    label: category === 'box' ? `박스 ${idx + 1}` : oddUnits[idx]?.name || `이형 품목 ${idx + 1}`,
    categories: v.categories,
    description: v.description,
    value: v.value,
    storedAt: ticket.startDate,
  }));

  return { ticket, items };
}

function reducer(state, action) {
  switch (action.type) {
    case 'COMPLETE_BOOKING': {
      const { ticket, items } = buildTicketAndItems(action.booking);
      return { ...state, ticket, items, showHome: true };
    }
    case 'SHOW_HOME':
      return { ...state, showHome: true };
    case 'HIDE_HOME':
      return { ...state, showHome: false };
    case 'START_WITHDRAW':
      return { ...state, showWithdraw: true };
    case 'CANCEL_WITHDRAW':
      return { ...state, showWithdraw: false };
    case 'COMPLETE_WITHDRAW':
      // showWithdraw는 유지 — 출고 완료 화면을 보여준 뒤 사용자가 직접 홈으로 돌아간다.
      return {
        ...state,
        items: state.items.filter((item) => !action.ids.includes(item.id)),
      };
    default:
      return state;
  }
}

const StorageStateContext = createContext(null);
const StorageDispatchContext = createContext(null);

export function StorageProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const stateValue = useMemo(() => state, [state]);

  return (
    <StorageStateContext.Provider value={stateValue}>
      <StorageDispatchContext.Provider value={dispatch}>
        {children}
      </StorageDispatchContext.Provider>
    </StorageStateContext.Provider>
  );
}

export function useStorageState() {
  const ctx = useContext(StorageStateContext);
  if (!ctx) throw new Error('useStorageState must be used within StorageProvider');
  return ctx;
}

export function useStorageDispatch() {
  const ctx = useContext(StorageDispatchContext);
  if (!ctx) throw new Error('useStorageDispatch must be used within StorageProvider');
  return ctx;
}
