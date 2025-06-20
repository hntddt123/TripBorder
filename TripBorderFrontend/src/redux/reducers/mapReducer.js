import { createSlice } from '@reduxjs/toolkit';

const initialMapState = {
  mapStyle: 'mapbox://styles/mapbox/standard',
  mapLightPresetMode: 'Day',
  viewState: {
    longitude: 153.4250000,
    latitude: 22.4250000,
    pitch: 30,
    zoom: 1.5
  },
  gpsLonLat: { longitude: null, latitude: null },
  longPressedLonLat: { longitude: null, latitude: null },
  markers: [],
  selectedPOIIDNumber: '4d4b7105d754a06374d81259', // default to restaurants
  selectedPOI: '',
  selectedPOIIcon: '🍱',
  selectedPOILonLat: { longitude: null, latitude: null },
  selectedPOIRadius: 500, // 100 ~ 1000m
  selectedPOICount: 20, // 5 ~ 50
  randomPOINumber: -1,
  isFullPOIname: true,
  isShowingOnlySelectedPOI: false,
  isShowingAddtionalPopUp: false,
  isShowingSideBar: false,
  isNavigating: false,
  isThrowingDice: false,
  isDarkMode: true
};

const mapSlice = createSlice({
  name: 'map',
  initialState: initialMapState,
  reducers: {
    setMapLightPresetMode: (state, action) => ({ ...state, mapLightPresetMode: action.payload }),
    setViewState: (state, action) => ({ ...state, viewState: action.payload }),
    setMarker: (state, action) => ({ ...state, markers: [action.payload] }),
    setGPSLonLat: (state, action) => ({ ...state, gpsLonLat: action.payload }),
    setLongPressedLonLat: (state, action) => ({ ...state, longPressedLonLat: action.payload }),
    setUserOption: (state, action) => ({ ...state, userOption: { searchCategory: action.payload } }),
    setSelectedPOIIDNumber: (state, action) => ({ ...state, selectedPOIIDNumber: action.payload }),
    setSelectedPOI: (state, action) => ({ ...state, selectedPOI: action.payload }),
    setSelectedPOIIcon: (state, action) => ({ ...state, selectedPOIIcon: action.payload }),
    setSelectedPOILonLat: (state, action) => ({ ...state, selectedPOILonLat: action.payload }),
    setSelectedPOIRadius: (state, action) => ({ ...state, selectedPOIRadius: action.payload }),
    setSelectedPOICount: (state, action) => ({ ...state, selectedPOICount: action.payload }),
    setRandomPOINumber: (state, action) => ({ ...state, randomPOINumber: action.payload }),
    setIsFullPOIname: (state, action) => ({ ...state, isFullPOIname: action.payload }),
    setIsShowingOnlySelectedPOI: (state, action) => ({ ...state, isShowingOnlySelectedPOI: action.payload }),
    setIsShowingAddtionalPopUp: (state, action) => ({ ...state, isShowingAddtionalPopUp: action.payload }),
    setIsNavigating: (state, action) => ({ ...state, isNavigating: action.payload }),
    setIsShowingSideBar: (state, action) => ({ ...state, isShowingSideBar: action.payload }),
    setIsThrowingDice: (state, action) => ({ ...state, isThrowingDice: action.payload }),
    setDarkMode: (state, action) => ({ ...state, isDarkMode: action.payload })
  }
});

export const {
  setMapLightPresetMode,
  setViewState,
  setMarker,
  setGPSLonLat,
  setLongPressedLonLat,
  setSelectedPOIIDNumber,
  setSelectedPOI,
  setSelectedPOIIcon,
  setSelectedPOILonLat,
  setSelectedPOIRadius,
  setSelectedPOICount,
  setRandomPOINumber,
  setIsFullPOIname,
  setIsShowingOnlySelectedPOI,
  setIsShowingAddtionalPopUp,
  setIsNavigating,
  setIsShowingSideBar,
  setIsThrowingDice,
  setDarkMode
} = mapSlice.actions;

export const mapReducer = mapSlice.reducer;
