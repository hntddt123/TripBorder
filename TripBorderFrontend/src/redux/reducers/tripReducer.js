import { createSlice } from '@reduxjs/toolkit';

const initialTripState = {
  uuid: '', // Let serverside create uuid when POST
  title: 'New Trip',
  owner_email: '',
  start_date: '',
  end_date: '',
  created_at: ''
};

const tripSlice = createSlice({
  name: 'trip',
  initialState: initialTripState,
  reducers: {
    setTripUUID: (state, action) => ({ ...state, uuid: action.payload }),
    setOwnerEmail: (state, action) => ({ ...state, owner_email: action.payload }),
    setTitle: (state, action) => ({ ...state, title: action.payload }),
    setStartDate: (state, action) => ({ ...state, start_date: action.payload }),
    setEndDate: (state, action) => ({ ...state, end_date: action.payload }),
    setCreatedDate: (state, action) => ({ ...state, created_at: action.payload }),
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
  resetTrip
} = tripSlice.actions;

export const tripReducer = tripSlice.reducer;
