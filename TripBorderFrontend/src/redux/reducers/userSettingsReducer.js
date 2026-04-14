import { createSlice } from '@reduxjs/toolkit';

const initialUserSettingsSliceState = {
  isDarkMode: true,
  isLoadTrip: false,
  IsEditingTrip: false,
  isLoadTripPublic: false,
  isLoadTripShared: false,
  isLoadTripOthersShared: false,
};

const userSettingsSlice = createSlice({
  name: 'userSettings',
  initialState: initialUserSettingsSliceState,
  reducers: {
    setIsDarkMode: (state, action) => ({ ...state, isDarkMode: action.payload }),
    setIsLoadTrip: (state, action) => ({ ...state, isLoadTrip: action.payload }),
    setIsLoadTripPublic: (state, action) => ({ ...state, isLoadTripPublic: action.payload }),
    setIsLoadTripShared: (state, action) => ({ ...state, isLoadTripShared: action.payload }),
    setIsLoadTripOthersShared: (state, action) => ({ ...state, isLoadTripOthersShared: action.payload }),
    setIsEditingTrip: (state, action) => ({ ...state, isEditingTrip: action.payload }),
  }
});

export const {
  setIsDarkMode,
  setIsLoadTrip,
  setIsLoadTripPublic,
  setIsLoadTripShared,
  setIsLoadTripOthersShared,
  setIsEditingTrip
} = userSettingsSlice.actions;

export const userSettingsReducer = userSettingsSlice.reducer;
