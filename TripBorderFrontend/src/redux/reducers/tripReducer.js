import { createSlice } from '@reduxjs/toolkit';

const initialTripState = {
  uuid: '', // Let serverside create uuid when POST
  owner_email: '',
  title: 'New Trip',
  start_date: '',
  end_date: '',
  created_at: '',
  updated_at: '',
};

const tripSlice = createSlice({
  name: 'trip',
  initialState: initialTripState,
  reducers: {
    setTripUUID: (state, action) => ({ ...state, uuid: action.payload }),
    setOwnerEmail: (state, action) => ({ ...state, owner_email: action.payload }),
    setTrip: (state, action) => ({ ...state, title: action.payload }),
    setStartDate: (state, action) => ({ ...state, start_date: action.payload }),
    setEndDate: (state, action) => ({ ...state, end_date: action.payload }),
    setUpdatedDate: (state, action) => ({ ...state, updated_at: action.payload }),
    setCreatedDate: (state, action) => ({ ...state, created_at: action.payload })
  }
});

export const {
  setTripUUID,
  setOwnerEmail,
  setTrip,
  setStartDate,
  setEndDate,
  setUpdatedDate,
  setCreatedDate
} = tripSlice.actions;

export const tripReducer = tripSlice.reducer;
