import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  axiosCreateModel,
  axiosGetModels,
  axiosEditModel,
  axiosDeleteModel,
  axiosGetModel,
} from '../../api/models';
import { toast } from 'react-toastify';

export const createModel = createAsyncThunk(
  '/api/models/create-model',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await axiosCreateModel(userData);
      if(data) {toast.success('Model successfully created!');}
      return data;
    } catch (error) {
      toast.error('Failed to create model.');
      const { data, status } = error.response;
      return rejectWithValue({ data, status });
    }
  }
);

export const getModels = createAsyncThunk(
  '/api/models/get-models',
  async (_, { rejectWithValue }) => {
    try {
      const data = await axiosGetModels();
      return data;
    } catch (error) {
      toast.error('Failed to get models.');
      const { data, status } = error.response;
      return rejectWithValue({ data, status });
    }
  }
);

export const getModel = createAsyncThunk(
  '/api/models/get-model',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await axiosGetModel(userData);
      return data;
    } catch (error) {
      toast.error('Failed to get model.');
      const { data, status } = error.response;
      return rejectWithValue({ data, status });
    }
  }
);

export const deleteModel = createAsyncThunk(
  '/api/models/delete-model',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await axiosDeleteModel(userData);
      if(data) {toast.success('Model successfully deleted!');}
      return data;
    } catch (error) {
      toast.error('Failed to delete model.');
      const { data, status } = error.response;
      return rejectWithValue({ data, status });
    }
  }
);

export const editModel = createAsyncThunk(
  '/api/models/edit-model',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await axiosEditModel(userData);
      if(data) {toast.success('Model successfully edited!');}
      return data;
    } catch (error) {
      toast.error('Failed to edit model.');
      const { data, status } = error.response;
      return rejectWithValue({ data, status });
    }
  }
);