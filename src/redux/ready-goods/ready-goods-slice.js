import { createSlice } from '@reduxjs/toolkit';
import {
  createReadyGood,
  getReadyGoods,
  deleteReadyGood,
  editReadyGood,
  getReadyGood,
} from './ready-goods-operations';

const initialState = {
  error: null,
  message: null,
  loading: false,
  readyGoods: [],
  allReadyGoods: [],
  newestReadyGoods: [],
  currentReadyGood: null,
  editReadyGood: null,
  totalPagesReadyGoods: 0,
  currentPageReadyGoods: 1,
};

const readyGoods = createSlice({
  name: 'readyGoods',
  initialState,
  reducers: {
    setCurrentPageReadyGoods: (store, action) => {
      store.currentPageReadyGoods = action.payload;
    },
    setCurrentReadyGood: (store, action) => {
      store.currentReadyGood = action.payload;
    },
    clearCurrentReadyGood: store => {
      store.currentReadyGood = null;
    },
    setEditReadyGood: (store, action) => {
      store.editReadyGood = action.payload;
    },
    clearEditReadyGood: store => {
      store.editReadyGood = null;
    },
    clearReadyGoodsError: store => {
      store.error = null;
    },
    clearReadyGoodsMessage: store => {
      store.message = null;
    },
  },
  extraReducers: builder => {
    builder
      // * CREATE Ready Good
      .addCase(createReadyGood.pending, store => {
        store.loading = true;
        store.error = null;
        store.message = null;
      })
      .addCase(createReadyGood.fulfilled, (store, { payload }) => {
        store.loading = false;
        store.message = payload.message;
        store.modalWindowStatus = true;
      })
      .addCase(createReadyGood.rejected, (store, { payload }) => {
        store.loading = false;
        if (payload && payload.data && payload.data.message) {
          store.error = payload.data.message;
        } else if (payload && payload.message) {
          store.error = payload.message;
        } else {
          store.error = 'Oops, something went wrong, try again';
        }
        store.modalWindowStatus = true;
      })
      // * EDIT Ready Good
      .addCase(editReadyGood.pending, store => {
        store.loading = true;
        store.error = null;
        store.message = null;
      })
      .addCase(editReadyGood.fulfilled, (store, { payload }) => {
        store.loading = false;
        store.message = payload.message;
        store.modalWindowStatus = true;
        store.editReadyGood = null;
      })
      .addCase(editReadyGood.rejected, (store, { payload }) => {
        store.loading = false;
        if (payload && payload.data && payload.data.message) {
          store.error = payload.data.message;
        } else if (payload && payload.message) {
          store.error = payload.message;
        } else {
          store.error = 'Oops, something went wrong, try again';
        }
        store.modalWindowStatus = true;
      })
      // * GET Ready Goods
      .addCase(getReadyGoods.pending, store => {
        store.loading = true;
        store.error = null;
      })
      .addCase(getReadyGoods.fulfilled, (store, { payload }) => {
        store.loading = false;
        store.readyGoods = payload.goods;
        store.allReadyGoods = payload.allGoods;
        store.totalPagesReadyGoods = payload.totalPages;
        store.newestReadyGoods = payload.newestReadyGoods;
      })
      .addCase(getReadyGoods.rejected, (store, { payload }) => {
        store.loading = false;
        if (payload && payload.data && payload.data.message) {
          store.error = payload.data.message;
        } else if (payload && payload.message) {
          store.error = payload.message;
        } else {
          store.error = 'Oops, something went wrong, try again';
        }
        store.modalWindowStatus = true;
      })
      // * GET Ready Good
      .addCase(getReadyGood.pending, store => {
        store.loading = true;
        store.error = null;
      })
      .addCase(getReadyGood.fulfilled, (store, { payload }) => {
        store.loading = false;
        store.currentReadyGood = payload;
      })
      .addCase(getReadyGood.rejected, (store, { payload }) => {
        store.loading = false;
        if (payload && payload.data && payload.data.message) {
          store.error = payload.data.message;
        } else if (payload && payload.message) {
          store.error = payload.message;
        } else {
          store.error = 'Oops, something went wrong, try again';
        }
        store.modalWindowStatus = true;
      })
      // * DELETE Ready Good
      .addCase(deleteReadyGood.pending, store => {
        store.loading = true;
        store.error = null;
        store.message = null;
      })
      .addCase(deleteReadyGood.fulfilled, (store, { payload }) => {
        store.loading = false;
        store.message = payload.message;
        store.modalWindowStatus = true;
      })
      .addCase(deleteReadyGood.rejected, (store, { payload }) => {
        store.loading = false;
        if (payload && payload.data && payload.data.message) {
          store.error = payload.data.message;
        } else if (payload && payload.message) {
          store.error = payload.message;
        } else {
          store.error = 'Oops, something went wrong, try again';
        }
        store.modalWindowStatus = true;
      });
  },
});

export default readyGoods.reducer;
export const {
  setModalWindowStatus,
  setCurrentPageReadyGoods,
  setCurrentReadyGood,
  clearCurrentReadyGood,
  clearReadyGoodsError,
  clearReadyGoodsMessage,
  setEditReadyGood,
  clearEditReadyGood,
} = readyGoods.actions;
