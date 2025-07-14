import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  error: '',
  message: '',
  loading: false,
  modalWindowStatus: false,
  screenType: 'isDesctop',
};

const technical = createSlice({
  name: 'technical',
  initialState,
  reducers: {
    setMessage: (store, action) => {
      store.message = action.payload;
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
    setModalWindowStatus: (store, action) => {
      store.modalWindowStatus = action.payload;
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
  setTechnicalError,
  setMessage,
  setModalWindowStatus,
  setScreenType,
} = technical.actions;
