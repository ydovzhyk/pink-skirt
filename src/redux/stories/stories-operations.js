import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  axiosCreateStory,
  axiosGetStories,
  axiosEditStory,
  axiosDeleteStory,
  axiosGetStory,
} from '../../api/stories';
import { toast } from 'react-toastify';

export const createStory = createAsyncThunk(
  '/api/stories/create-story',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await axiosCreateStory(userData);
      if (data) {
        toast.success('Story successfully created!');
      }
      return data;
    } catch (error) {
      toast.error('Failed to create story.');
      const { data, status } = error.response;
      return rejectWithValue({ data, status });
    }
  }
);

export const getStories = createAsyncThunk(
  '/api/stories/get-stories',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await axiosGetStories(userData);
      return data;
    } catch (error) {
      toast.error('Failed to get stories.');
      const { data, status } = error.response;
      return rejectWithValue({ data, status });
    }
  }
);

export const getStory = createAsyncThunk(
  '/api/stories/get-story',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await axiosGetStory(userData);
      return data;
    } catch (error) {
      toast.error('Failed to get story.');
      const { data, status } = error.response;
      return rejectWithValue({ data, status });
    }
  }
);

export const deleteStory = createAsyncThunk(
  '/api/stories/delete-story',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await axiosDeleteStory(userData);
      if (data) {
        toast.success('Story successfully deleted!');
      }
      return data;
    } catch (error) {
      toast.error('Failed to delete story.');
      const { data, status } = error.response;
      return rejectWithValue({ data, status });
    }
  }
);

export const editStory = createAsyncThunk(
  '/api/stories/edit-story',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await axiosEditStory(userData);
      if (data) {
        toast.success('Story successfully edited!');
      }
      return data;
    } catch (error) {
      toast.error('Failed to edit story.');
      const { data, status } = error.response;
      return rejectWithValue({ data, status });
    }
  }
);
