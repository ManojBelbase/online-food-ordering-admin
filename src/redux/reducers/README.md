# 🎯 Redux Reducers Guide

## 📁 File Structure
```
src/redux/reducers/
├── index.ts           # Central exports
├── rootReducer.ts     # Combines all reducers
├── _template.ts       # Template for new reducers
└── README.md          # This guide
```

## 🚀 How to Create a New Reducer

### Step 1: Copy Template
```bash
# Copy the template
cp src/redux/reducers/_template.ts src/redux/slices/menuSlice.ts
```

### Step 2: Customize the Slice
```typescript
// In menuSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface MenuState {
  items: MenuItem[];
  loading: boolean;
  error: string | null;
  filters: {
    category: string;
    search: string;
  };
}

const initialState: MenuState = {
  items: [],
  loading: false,
  error: null,
  filters: {
    category: 'all',
    search: '',
  },
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
      state.loading = false;
      state.error = null;
    },
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
    },
    updateOrder: (state, action: PayloadAction<Order>) => {
      const index = state.orders.findIndex(o => o.id === action.payload.id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
    },
    deleteOrder: (state, action: PayloadAction<string>) => {
      state.orders = state.orders.filter(o => o.id !== action.payload);
    },
    setFilters: (state, action: PayloadAction<Partial<OrdersState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    reset: () => initialState,
  },
});

export const {
  setLoading,
  setOrders,
  addOrder,
  updateOrder,
  deleteOrder,
  setFilters,
  setError,
  reset,
} = ordersSlice.actions;

export default ordersSlice.reducer;

// Selectors
export const selectOrders = (state: { orders: OrdersState }) => state.orders.orders;
export const selectOrdersLoading = (state: { orders: OrdersState }) => state.orders.loading;
export const selectOrdersError = (state: { orders: OrdersState }) => state.orders.error;
export const selectOrdersFilters = (state: { orders: OrdersState }) => state.orders.filters;
```

### Step 3: Add to Root Reducer
```typescript
// In rootReducer.ts
import ordersReducer from '../slices/ordersSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  orders: ordersReducer, // ✅ Add your new reducer
  [authApi.reducerPath]: authApi.reducer,
});
```

### Step 4: Use in Components
```typescript
// In your component
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { setOrders, setLoading, selectOrders } from '../redux/slices/ordersSlice';

const OrdersPage = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectOrders);
  const loading = useAppSelector(selectOrdersLoading);

  const loadOrders = async () => {
    dispatch(setLoading(true));
    try {
      const data = await fetchOrders();
      dispatch(setOrders(data));
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

  return (
    <div>
      {loading ? <LoadingSpinner /> : <OrdersList orders={orders} />}
    </div>
  );
};
```

## 🎯 Best Practices

### ✅ Do:
- Use descriptive action names
- Keep state normalized
- Use TypeScript interfaces
- Add proper selectors
- Handle loading/error states
- Use Immer patterns (built into RTK)

### ❌ Don't:
- Mutate state directly (outside RTK)
- Put non-serializable data in state
- Make API calls in reducers
- Create deeply nested state
- Forget to handle error cases

## 🔧 Common Patterns

### Loading States
```typescript
// In your slice
extraReducers: (builder) => {
  builder
    .addCase(fetchDataAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchDataAsync.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
    })
    .addCase(fetchDataAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'An error occurred';
    });
}
```

### Filtering/Searching
```typescript
// In your slice
setFilters: (state, action: PayloadAction<FilterState>) => {
  state.filters = { ...state.filters, ...action.payload };
},

// In your component
const filteredData = useAppSelector(state => {
  const { data, filters } = state.feature;
  return data.filter(item => 
    item.name.toLowerCase().includes(filters.search.toLowerCase()) &&
    (filters.status === 'all' || item.status === filters.status)
  );
});
```

## 📚 Resources
- [Redux Toolkit Docs](https://redux-toolkit.js.org/)
- [RTK Query Guide](https://redux-toolkit.js.org/rtk-query/overview)
- [Redux Best Practices](https://redux.js.org/style-guide/style-guide)
