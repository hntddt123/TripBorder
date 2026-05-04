import { createSlice } from '@reduxjs/toolkit';
import { getMapboxLanguage } from '../../utility/mapboxLanguage';

const initialUserSettingsSliceState = {
  isDarkMode: true,
  language: getMapboxLanguage().toLocaleLowerCase(),
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
