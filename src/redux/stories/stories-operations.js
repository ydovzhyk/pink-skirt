import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  axiosCreateStory,
  axiosGetStories,
  axiosEditStory,
  axiosDeleteStory,
} from '../../api/stories';

export const createStory = createAsyncThunk(
  '/stories/create',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await axiosCreateStory(userData);
      return data;
    } catch (error) {
      const { data, status } = error.response;
      return rejectWithValue({ data, status });
    }
  }
);

export const getStories = createAsyncThunk(
  '/stories',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await axiosGetStories(userData);
      return data;
    } catch (error) {
      const { data, status } = error.response;
      return rejectWithValue({ data, status });
    }
  }
);

export const deleteStory = createAsyncThunk(
  '/stories/delete',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await axiosDeleteStory(userData);
      return data;
    } catch (error) {
      const { data, status } = error.response;
      return rejectWithValue({ data, status });
    }
  }
);

export const editStory = createAsyncThunk(
  '/stories/edit',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await axiosEditStory(userData);
      return data;
    } catch (error) {
      const { data, status } = error.response;
      return rejectWithValue({ data, status });
    }
  }
);