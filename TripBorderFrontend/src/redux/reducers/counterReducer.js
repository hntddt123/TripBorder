import { createSlice } from '@reduxjs/toolkit';

const initialCounterState = {
  count: 3,
};

const counterSlice = createSlice({
  name: 'counter',
  initialState: initialCounterState,
  reducers: {
    incrementCount: (state) => ({ ...state, count: state.count + 1 }),
    decrementCount: (state) => ({ ...state, count: state.count - 1 })
  }
});

export const { incrementCount, decrementCount } = counterSlice.actions;
export const counterReducer = counterSlice.reducer;
