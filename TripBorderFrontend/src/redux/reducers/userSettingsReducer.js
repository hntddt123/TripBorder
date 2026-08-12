import { createSlice } from '@reduxjs/toolkit';
import { getMapboxLanguage } from '../../utility/mapboxLanguage';

const initialUserSettingsSliceState = {
  isDarkMode: true,
  language: getMapboxLanguage().toLocaleLowerCase(),
  searchCountry: 'EARTH',
  selectedMenu: 'trip'
};

const userSettingsSlice = createSlice({
  name: 'userSettings',
  initialState: initialUserSettingsSliceState,
  reducers: {
    setIsDarkMode: (state, action) => ({ ...state, isDarkMode: action.payload }),
    setLanguage: (state, action) => ({ ...state, language: action.payload }),
    setSearchCountry: (state, action) => ({ ...state, searchCountry: action.payload }),
    setSelectedMenu: (state, action) => ({ ...state, selectedMenu: action.payload })
  }
});

export const {
  setIsDarkMode,
  setLanguage,
  setSearchCountry,
  setSelectedMenu
} = userSettingsSlice.actions;

export const userSettingsReducer = userSettingsSlice.reducer;
