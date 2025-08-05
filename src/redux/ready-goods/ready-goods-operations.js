import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  axiosCreateReadyGood,
  axiosGetReadyGoods,
  axiosEditReadyGood,
  axiosDeleteReadyGood,
  axiosGetReadyGood,
} from '../../api/ready-goods';
import { toast } from 'react-toastify';

export const createReadyGood = createAsyncThunk(
  '/api/ready-goods/create-ready-good',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await axiosCreateReadyGood(userData);
      if (data) {
        toast.success('Ready good successfully created!');
      }
      return data;
    } catch (error) {
      toast.error('Failed to create ready good.');
      const { data, status } = error.response;
      return rejectWithValue({ data, status });
    }
  }
);

export const getReadyGoods = createAsyncThunk(
  '/api/ready-goods/get-ready-goods',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await axiosGetReadyGoods(userData);
      return data;
    } catch (error) {
      toast.error('Failed to get ready goods.');
      const { data, status } = error.response;
      return rejectWithValue({ data, status });
    }
  }
);

export const getReadyGood = createAsyncThunk(
  '/api/ready-goods/get-ready-good',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await axiosGetReadyGood(userData);
      return data;
    } catch (error) {
      toast.error('Failed to get ready good.');
      const { data, status } = error.response;
      return rejectWithValue({ data, status });
    }
  }
);

export const deleteReadyGood = createAsyncThunk(
  '/api/ready-goods/delete-ready-good',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await axiosDeleteReadyGood(userData);
      if (data) {
        toast.success('Ready good successfully deleted!');
      }
      return data;
    } catch (error) {
      toast.error('Failed to delete ready good.');
      const { data, status } = error.response;
      return rejectWithValue({ data, status });
    }
  }
);

export const editReadyGood = createAsyncThunk(
  '/api/ready-goods/edit-ready-good',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await axiosEditReadyGood(userData);
      if (data) {
        toast.success('Ready good successfully edited!');
      }
      return data;
    } catch (error) {
      toast.error('Failed to edit ready good.');
      const { data, status } = error.response;
      return rejectWithValue({ data, status });
    }
  }
);