import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  error: '',
  message: '',
  loading: false,
  screenType: 'isDesctop',
  activeSection: null,
  link: '/?action=authorize&password=0503562938',
};

const technical = createSlice({
  name: 'technical',
  initialState,
  reducers: {
    setActiveSection: (store, action) => {
      store.activeSection = action.payload;
    },
    clearTechnicalError: store => {
      store.error = '';
    },
    clearTechnicalMessage: store => {
      store.message = '';
    },
    setTechnicalError: (store, action) => {
      store.error = action.payload;
    },
    setScreenType: (store, action) => {
      store.screenType = action.payload;
    },
  },

  // extraReducers: (builder) => {
  // }
});

export default technical.reducer;

export const {
  clearTechnicalError,
  clearTechnicalMessage,
  setActiveSection,
  setTechnicalError,
  setScreenType,
} = technical.actions;
