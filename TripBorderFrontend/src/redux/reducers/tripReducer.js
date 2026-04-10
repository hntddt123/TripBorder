import { createSlice } from '@reduxjs/toolkit';

const initialTripState = {
  uuid: '', // Let serverside create uuid when POST
  title: 'New Trip',
  ownerEmail: '',
  startDate: '',
  endDate: '',
  createdAt: '',
  sharedMode: '',
  sharedEmail: []
};

const tripSlice = createSlice({
  name: 'trip',
  initialState: initialTripState,
  reducers: {
    setTripUUID: (state, action) => ({ ...state, uuid: action.payload }),
    setOwnerEmail: (state, action) => ({ ...state, ownerEmail: action.payload }),
    setTitle: (state, action) => ({ ...state, title: action.payload }),
    setStartDate: (state, action) => ({ ...state, startDate: action.payload }),
    setEndDate: (state, action) => ({ ...state, endDate: action.payload }),
    setCreatedDate: (state, action) => ({ ...state, createdAt: action.payload }),
    setSharedMode: (state, action) => ({ ...state, sharedMode: action.payload }),
    setSharedEmail: (state, action) => ({ ...state, sharedEmail: action.payload }),
    resetTrip: () => (initialTripState)
  }
});

export const {
  setTripUUID,
  setOwnerEmail,
  setTitle,
  setStartDate,
  setEndDate,
  setCreatedDate,
  setSharedMode,
  setSharedEmail,
  resetTrip
} = tripSlice.actions;

export const tripReducer = tripSlice.reducer;
