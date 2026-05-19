import { createSlice } from '@reduxjs/toolkit';
import { getMapboxLanguage } from '../../utility/mapboxLanguage';

const initialUserSettingsSliceState = {
  isDarkMode: true,
  language: getMapboxLanguage().toLocaleLowerCase(),
  selectedMenu: 'trip'
};

const userSettingsSlice = createSlice({
  name: 'userSettings',
  initialState: initialUserSettingsSliceState,
  reducers: {
    setIsDarkMode: (state, action) => ({ ...state, isDarkMode: action.payload }),
    setLanguage: (state, action) => ({ ...state, language: action.payload }),
    setSelectedMenu: (state, action) => ({ ...state, selectedMenu: action.payload })
  }
});

export const {
  setIsDarkMode,
  setLanguage,
  setSelectedMenu
} = userSettingsSlice.actions;

export const userSettingsReducer = userSettingsSlice.reducer;
