import { createContext, useContext, useMemo, useReducer } from 'react';

export const TOTAL_STEPS = 8;

const initialState = {
  step: 0,
  mode: null, // 'deposit' | 'pickup'
  category: 'box', // 'box' | 'odd'
  boxQty: { s: 0, m: 0, l: 0 },
  oddItems: [], // { id, name, size, cushion, qty }
  valuables: [], // { id, name, value }
  space: null, // 'normal' | 'cold' | 'climate'
  months: 1,
  customer: { name: '', phone: '', pickup: '', pickupDetail: '', drop: '', date: '', time: '' },
  photos: [], // { num }
};

function reducer(state, action) {
  switch (action.type) {
    case 'START_BOOKING':
      return { ...state, mode: action.mode, step: 1 };

    case 'GO_TO_STEP':
      return { ...state, step: action.step };

    case 'SET_CATEGORY':
      return { ...state, category: action.category };

    case 'SET_BOX_QTY': {
      const qty = Math.max(0, state.boxQty[action.size] + action.delta);
      return { ...state, boxQty: { ...state.boxQty, [action.size]: qty } };
    }

    case 'ADD_ODD_ITEM':
      return { ...state, oddItems: [...state.oddItems, action.item] };

    case 'REMOVE_ODD_ITEM':
      return {
        ...state,
        oddItems: state.oddItems.filter((i) => i.id !== action.id),
      };

    case 'ADD_VALUABLE':
      return {
        ...state,
        valuables: [
          ...state.valuables,
          { id: Date.now(), name: '', value: 0 },
        ],
      };

    case 'UPDATE_VALUABLE':
      return {
        ...state,
        valuables: state.valuables.map((v) =>
          v.id === action.id ? { ...v, [action.field]: action.value } : v
        ),
      };

    case 'REMOVE_VALUABLE':
      return {
        ...state,
        valuables: state.valuables.filter((v) => v.id !== action.id),
      };

    case 'SELECT_SPACE':
      return { ...state, space: action.space };

    case 'SET_MONTHS':
      return { ...state, months: Math.min(12, Math.max(1, action.months)) };

    case 'UPDATE_CUSTOMER':
      return {
        ...state,
        customer: { ...state.customer, [action.field]: action.value },
      };

    case 'ADD_PHOTO': {
      const photos = [...state.photos];
      photos[action.index] = { num: action.index + 1 };
      return { ...state, photos };
    }

    case 'RESET':
      return { ...initialState };

    default:
      return state;
  }
}

const BookingStateContext = createContext(null);
const BookingDispatchContext = createContext(null);

export function BookingProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const stateValue = useMemo(() => state, [state]);

  return (
    <BookingStateContext.Provider value={stateValue}>
      <BookingDispatchContext.Provider value={dispatch}>
        {children}
      </BookingDispatchContext.Provider>
    </BookingStateContext.Provider>
  );
}

export function useBookingState() {
  const ctx = useContext(BookingStateContext);
  if (!ctx) throw new Error('useBookingState must be used within BookingProvider');
  return ctx;
}

export function useBookingDispatch() {
  const ctx = useContext(BookingDispatchContext);
  if (!ctx) throw new Error('useBookingDispatch must be used within BookingProvider');
  return ctx;
}
