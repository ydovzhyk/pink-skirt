import { createSlice } from '@reduxjs/toolkit';
import {
  createFabric,
  getFabrics,
  deleteFabric,
  editFabric,
  getFabric,
} from './fabrics-operations';

const initialState = {
  error: null,
  message: null,
  loading: false,
  allFabrics: [],
  currentFabric: null,
  editFabric: null,
};

const fabrics = createSlice({
  name: 'fabrics',
  initialState,
  reducers: {
    setCurrentFabric: (store, action) => {
      store.currentFabric = action.payload;
    },
    clearCurrentFabric: store => {
      store.currentFabric = null;
    },
    setEditFabric: (store, action) => {
      store.editFabric = action.payload;
    },
    clearEditFabric: store => {
      store.editFabric = null;
    },
    clearFabricsError: store => {
      store.error = null;
    },
    clearFabricsMessage: store => {
      store.message = null;
    },
  },
  extraReducers: builder => {
    builder
      // * CREATE FABRIC
      .addCase(createFabric.pending, store => {
        store.loading = true;
        store.error = null;
        store.message = null;
      })
      .addCase(createFabric.fulfilled, (store, { payload }) => {
        store.loading = false;
        store.message = payload.message;
      })
      .addCase(createFabric.rejected, (store, { payload }) => {
        store.loading = false;
        if (payload && payload.data && payload.data.message) {
          store.error = payload.data.message;
        } else if (payload && payload.message) {
          store.error = payload.message;
        } else {
          store.error = 'Oops, something went wrong, try again';
        }
      })
      // * EDIT FABRIC
      .addCase(editFabric.pending, store => {
        store.loading = true;
        store.error = null;
        store.message = null;
      })
      .addCase(editFabric.fulfilled, (store, { payload }) => {
        store.loading = false;
        store.message = payload.message;
        store.editFabric = null;
      })
      .addCase(editFabric.rejected, (store, { payload }) => {
        store.loading = false;
        if (payload && payload.data && payload.data.message) {
          store.error = payload.data.message;
        } else if (payload && payload.message) {
          store.error = payload.message;
        } else {
          store.error = 'Oops, something went wrong, try again';
        }
      })
      // * GET FABRICS
      .addCase(getFabrics.pending, store => {
        store.loading = true;
        store.error = null;
      })
      .addCase(getFabrics.fulfilled, (store, { payload }) => {
        store.loading = false;
        store.allFabrics = payload.allFabrics;
      })
      .addCase(getFabrics.rejected, (store, { payload }) => {
        store.loading = false;
        if (payload && payload.data && payload.data.message) {
          store.error = payload.data.message;
        } else if (payload && payload.message) {
          store.error = payload.message;
        } else {
          store.error = 'Oops, something went wrong, try again';
        }
      })
      // * GET FABRIC
      .addCase(getFabric.pending, store => {
        store.loading = true;
        store.error = null;
      })
      .addCase(getFabric.fulfilled, (store, { payload }) => {
        store.loading = false;
        store.currentFabric = payload;
      })
      .addCase(getFabric.rejected, (store, { payload }) => {
        store.loading = false;
        if (payload && payload.data && payload.data.message) {
          store.error = payload.data.message;
        } else if (payload && payload.message) {
          store.error = payload.message;
        } else {
          store.error = 'Oops, something went wrong, try again';
        }
      })
      // * DELETE FABRIC
      .addCase(deleteFabric.pending, store => {
        store.loading = true;
        store.error = null;
        store.message = null;
      })
      .addCase(deleteFabric.fulfilled, (store, { payload }) => {
        store.loading = false;
        store.message = payload.message;
      })
      .addCase(deleteFabric.rejected, (store, { payload }) => {
        store.loading = false;
        if (payload && payload.data && payload.data.message) {
          store.error = payload.data.message;
        } else if (payload && payload.message) {
          store.error = payload.message;
        } else {
          store.error = 'Oops, something went wrong, try again';
        }
      });
  },
});

export default fabrics.reducer;
export const {
  setCurrentFabric,
  clearCurrentFabric,
  clearFabricsError,
  clearFabricsMessage,
  setEditFabric,
  clearEditFabric,
} = fabrics.actions;
