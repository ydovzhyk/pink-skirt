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
  '/api/create-story',
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
  '/api/get-stories',
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
  '/api/get-story',
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
  '/stories/delete',
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
  '/stories/edit',
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
