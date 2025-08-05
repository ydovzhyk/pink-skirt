import { createSlice } from '@reduxjs/toolkit';
import {
  createModel,
  getModels,
  deleteModel,
  editModel,
  getModel,
} from './models-operations';

const initialState = {
  error: null,
  message: null,
  loading: false,
  models: [],
  currentModel: null,
  editModel: null,
};

const models = createSlice({
  name: 'models',
  initialState,
  reducers: {
    setCurrentModel: (store, action) => {
      store.currentModel = action.payload;
    },
    clearCurrentModel: store => {
      store.currentModel = null;
    },
    setEditModel: (store, action) => {
      store.editModel = action.payload;
    },
    clearEditModel: store => {
      store.editModel = null;
    },
    clearModelsError: store => {
      store.error = null;
    },
    clearModelsMessage: store => {
      store.message = null;
    },
  },
  extraReducers: builder => {
    builder
      // * CREATE Model
      .addCase(createModel.pending, store => {
        store.loading = true;
        store.error = null;
        store.message = null;
      })
      .addCase(createModel.fulfilled, (store, { payload }) => {
        store.loading = false;
        store.message = payload.message;
      })
      .addCase(createModel.rejected, (store, { payload }) => {
        store.loading = false;
        if (payload && payload.data && payload.data.message) {
          store.error = payload.data.message;
        } else if (payload && payload.message) {
          store.error = payload.message;
        } else {
          store.error = 'Oops, something went wrong, try again';
        }
      })
      // * EDIT Model
      .addCase(editModel.pending, store => {
        store.loading = true;
        store.error = null;
        store.message = null;
      })
      .addCase(editModel.fulfilled, (store, { payload }) => {
        store.loading = false;
        store.message = payload.message;
        store.editModel = null;
      })
      .addCase(editModel.rejected, (store, { payload }) => {
        store.loading = false;
        if (payload && payload.data && payload.data.message) {
          store.error = payload.data.message;
        } else if (payload && payload.message) {
          store.error = payload.message;
        } else {
          store.error = 'Oops, something went wrong, try again';
        }
      })
      // * GET Models
      .addCase(getModels.pending, store => {
        store.loading = true;
        store.error = null;
      })
      .addCase(getModels.fulfilled, (store, { payload }) => {
        store.loading = false;
        store.models = payload.allModels;
      })
      .addCase(getModels.rejected, (store, { payload }) => {
        store.loading = false;
        if (payload && payload.data && payload.data.message) {
          store.error = payload.data.message;
        } else if (payload && payload.message) {
          store.error = payload.message;
        } else {
          store.error = 'Oops, something went wrong, try again';
        }
      })
      // * GET Model
      .addCase(getModel.pending, store => {
        store.loading = true;
        store.error = null;
      })
      .addCase(getModel.fulfilled, (store, { payload }) => {
        store.loading = false;
        store.currentModel = payload;
      })
      .addCase(getModel.rejected, (store, { payload }) => {
        store.loading = false;
        if (payload && payload.data && payload.data.message) {
          store.error = payload.data.message;
        } else if (payload && payload.message) {
          store.error = payload.message;
        } else {
          store.error = 'Oops, something went wrong, try again';
        }
      })
      // * DELETE Model
      .addCase(deleteModel.pending, store => {
        store.loading = true;
        store.error = null;
        store.message = null;
      })
      .addCase(deleteModel.fulfilled, (store, { payload }) => {
        store.loading = false;
        store.message = payload.message;
      })
      .addCase(deleteModel.rejected, (store, { payload }) => {
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

export default models.reducer;
export const {
  setCurrentPageModels,
  setCurrentModel,
  clearCurrentModel,
  clearModelsError,
  clearModelsMessage,
  setEditModel,
  clearEditModel,
} = models.actions;
