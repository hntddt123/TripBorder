import { createSlice } from '@reduxjs/toolkit';

const initialTripState = {
  uuid: '', // Let serverside create uuid when POST
  title: 'New Trip',
  ownerEmail: '',
  startDate: '',
  endDate: '',
  createdAt: '',
  sharedMode: '',
  sharedEmailInput: '',
  isLoadTrip: false,
  IsEditingTrip: false,
  isLoadTripPublic: false,
  isLoadTripShared: false,
  isLoadTripOthersShared: false
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
    setSharedEmailInput: (state, action) => ({ ...state, sharedEmailInput: action.payload }),
    resetTrip: () => (initialTripState),
    setIsLoadTrip: (state, action) => ({ ...state, isLoadTrip: action.payload }),
    setIsLoadTripPublic: (state, action) => ({ ...state, isLoadTripPublic: action.payload }),
    setIsLoadTripShared: (state, action) => ({ ...state, isLoadTripShared: action.payload }),
    setIsLoadTripOthersShared: (state, action) => ({ ...state, isLoadTripOthersShared: action.payload }),
    setIsEditingTrip: (state, action) => ({ ...state, isEditingTrip: action.payload })
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
  setSharedEmailInput,
  resetTrip,
  setIsLoadTrip,
  setIsLoadTripPublic,
  setIsLoadTripShared,
  setIsLoadTripOthersShared,
  setIsEditingTrip
} = tripSlice.actions;

export const tripReducer = tripSlice.reducer;
