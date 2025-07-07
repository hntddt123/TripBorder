import { createSlice } from '@reduxjs/toolkit';

const initialTripState = {
  uuid: '', // Let serverside create uuid when POST
  owner_email: '',
  title: 'New Trip',
  start_date: Date.now(),
  end_date: Date.now(),
  created_at: Date.now(),
  updated_at: Date.now(),
};

const tripSlice = createSlice({
  name: 'trip',
  initialState: initialTripState,
  reducers: {
    setTrip: (state, action) => ({ ...state, title: action.payload }),
    setStartDate: (state, action) => ({ ...state, start_date: action.payload }),
    setEndDate: (state, action) => ({ ...state, end_date: action.payload }),
    setUpdatedDate: (state, action) => ({ ...state, updated_at: action.payload })
  }
});

export const {
  setTrip,
  setStartDate,
  setEndDate,
  setUpdatedDate
} = tripSlice.actions;

export const tripReducer = tripSlice.reducer;
