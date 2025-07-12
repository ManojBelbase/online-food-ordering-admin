// 🎯 Redux Slice Template
//
// HOW TO USE:
// 1. Copy this file: cp _template.ts ordersSlice.ts
// 2. Replace 'feature' with your feature name (e.g., 'orders')
// 3. Update the interface and actions
// 4. Add to rootReducer.ts
//
// EXAMPLE:
// const ordersSlice = createSlice({ name: 'orders', ... });

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// 🔧 Define your feature state interface
interface FeatureState {
  data: any[];
  loading: boolean;
  error: string | null;
  // Add more state properties as needed
}

// 🔧 Define initial state
const initialState: FeatureState = {
  data: [],
  loading: false,
  error: null,
};

// 🔧 Create the slice
const featureSlice = createSlice({
  name: 'feature', // Change this to your feature name
  initialState,
  reducers: {
    // Synchronous actions
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setData: (state, action: PayloadAction<any[]>) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    reset: () => initialState,
  },
  // Add extraReducers for async thunks if needed
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(fetchDataAsync.pending, (state) => {
  //       state.loading = true;
  //       state.error = null;
  //     })
  //     .addCase(fetchDataAsync.fulfilled, (state, action) => {
  //       state.data = action.payload;
  //       state.loading = false;
  //     })
  //     .addCase(fetchDataAsync.rejected, (state, action) => {
  //       state.loading = false;
  //       state.error = action.payload || 'An error occurred';
  //     });
  // },
});

// 🔧 Export actions
export const {
  setLoading,
  setError,
  setData,
  clearError,
  reset,
} = featureSlice.actions;

// 🔧 Export reducer
export default featureSlice.reducer;

// 🔧 Export selectors
export const selectFeatureData = (state: { feature: FeatureState }) => state.feature.data;
export const selectFeatureLoading = (state: { feature: FeatureState }) => state.feature.loading;
export const selectFeatureError = (state: { feature: FeatureState }) => state.feature.error;
