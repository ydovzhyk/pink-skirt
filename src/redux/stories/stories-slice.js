import { createSlice } from '@reduxjs/toolkit';
import {
  createStory,
  getStories,
  deleteStory,
  editStory,
  getStory,
} from './stories-operations';

const initialState = {
  modalWindowStatus: false,
  error: null,
  message: null,
  loading: false,
  stories: [],
  allStories: [],
  currentStory: null,
  editStory: null,
  totalPages: 0,
  currentPage: 1,
};

const stories = createSlice({
  name: 'stories',
  initialState,
  reducers: {
    setModalWindowStatus: (store, action) => {
      store.modalWindowStatus = action.payload;
    },
    setCurrentPage: (store, action) => {
      store.currentPage = action.payload;
    },
    setCurrentStory: (store, action) => {
      store.currentStory = action.payload;
    },
    clearCurrentStory: store => {
      store.currentStory = null;
    },
    setEditStory: (store, action) => {
      store.editStory = action.payload;
    },
    clearEditStory: store => {
      store.editStory = null;
    },
    clearStoriesError: store => {
      store.error = null;
    },
    clearStoriesMessage: store => {
      store.message = null;
    },
  },
  extraReducers: builder => {
    builder
      // * CREATE STORY
      .addCase(createStory.pending, store => {
        store.loading = true;
        store.error = null;
        store.message = null;
      })
      .addCase(createStory.fulfilled, (store, { payload }) => {
        store.loading = false;
        store.message = payload.message;
        store.modalWindowStatus = true;
      })
      .addCase(createStory.rejected, (store, { payload }) => {
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
      // * EDIT STORY
      .addCase(editStory.pending, store => {
        store.loading = true;
        store.error = null;
        store.message = null;
      })
      .addCase(editStory.fulfilled, (store, { payload }) => {
        store.loading = false;
        store.message = payload.message;
        store.modalWindowStatus = true;
        store.editStory = null;
      })
      .addCase(editStory.rejected, (store, { payload }) => {
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
      // * GET STORIES
      .addCase(getStories.pending, store => {
        store.loading = true;
        store.error = null;
      })
      .addCase(getStories.fulfilled, (store, { payload }) => {
        store.loading = false;
        store.stories = payload.stories;
        store.allStories = payload.allStories;
        store.totalPages = payload.totalPages;
      })
      .addCase(getStories.rejected, (store, { payload }) => {
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
      // * GET STORY
      .addCase(getStory.pending, store => {
        store.loading = true;
        store.error = null;
      })
      .addCase(getStory.fulfilled, (store, { payload }) => {
        store.loading = false;
        store.currentStory = payload;
      })
      .addCase(getStory.rejected, (store, { payload }) => {
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
      // * DELETE STORY
      .addCase(deleteStory.pending, store => {
        store.loading = true;
        store.error = null;
        store.message = null;
      })
      .addCase(deleteStory.fulfilled, (store, { payload }) => {
        store.loading = false;
        store.message = payload.message;
        store.modalWindowStatus = true;
      })
      .addCase(deleteStory.rejected, (store, { payload }) => {
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

export default stories.reducer;
export const {
  setModalWindowStatus,
  setCurrentPage,
  setCurrentStory,
  clearCurrentStory,
  clearStoriesError,
  clearStoriesMessage,
  setEditStory,
  clearEditStory,
} = stories.actions;
