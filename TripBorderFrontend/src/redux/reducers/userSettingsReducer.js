import { createSlice } from '@reduxjs/toolkit';

const initialUserSettingsSliceState = {
  isPageDarkMode: true,
  isLoadTrip: false
};

const userSettingsSlice = createSlice({
  name: 'trip',
  initialState: initialUserSettingsSliceState,
  reducers: {
    setIsPageDarkMode: (state, action) => ({ ...state, isPageDarkMode: action.payload }),
    setIsLoadTrip: (state, action) => ({ ...state, isLoadTrip: action.payload }),
  }
});

export const {
  setIsLoadTrip,
} = userSettingsSlice.actions;

export const userSettingsReducer = userSettingsSlice.reducer;
