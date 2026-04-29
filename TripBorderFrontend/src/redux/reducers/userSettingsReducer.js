import { createSlice } from '@reduxjs/toolkit';

const initialUserSettingsSliceState = {
  isDarkMode: true,
  language: 'en',
};

const userSettingsSlice = createSlice({
  name: 'userSettings',
  initialState: initialUserSettingsSliceState,
  reducers: {
    setIsDarkMode: (state, action) => ({ ...state, isDarkMode: action.payload }),
    setLanguage: (state, action) => ({ ...state, language: action.payload })
  }
});

export const {
  setIsDarkMode,
  setLanguage
} = userSettingsSlice.actions;

export const userSettingsReducer = userSettingsSlice.reducer;
