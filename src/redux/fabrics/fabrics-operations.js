import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  axiosCreateFabric,
  axiosGetFabrics,
  axiosEditFabric,
  axiosDeleteFabric,
  axiosGetFabric,
} from '../../api/fabrics';
import { toast } from 'react-toastify';

export const createFabric = createAsyncThunk(
  '/api/fabrics/create-fabric',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await axiosCreateFabric(userData);
      if (data) {
        toast.success('Fabric successfully created!');
      }
      return data;
    } catch (error) {
      toast.error('Failed to create fabric.');
      const { data, status } = error.response;
      return rejectWithValue({ data, status });
    }
  }
);

export const getFabrics = createAsyncThunk(
  '/api/fabrics/get-fabrics',
  async (_, { rejectWithValue }) => {
    try {
      const data = await axiosGetFabrics();
      return data;
    } catch (error) {
      toast.error('Failed to get fabrics.');
      const { data, status } = error.response;
      return rejectWithValue({ data, status });
    }
  }
);

export const getFabric = createAsyncThunk(
  '/api/fabrics/get-fabric',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await axiosGetFabric(userData);
      return data;
    } catch (error) {
      toast.error('Failed to get fabric.');
      const { data, status } = error.response;
      return rejectWithValue({ data, status });
    }
  }
);

export const deleteFabric = createAsyncThunk(
  '/api/fabrics/delete-fabric',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await axiosDeleteFabric(userData);
      if (data) {
        toast.success('Fabric successfully deleted!');
      }
      return data;
    } catch (error) {
      toast.error('Failed to delete fabric.');
      const { data, status } = error.response;
      return rejectWithValue({ data, status });
    }
  }
);

export const editFabric = createAsyncThunk(
  '/api/fabrics/edit-fabric',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await axiosEditFabric(userData);
      if (data) {
        toast.success('Fabric successfully edited!');
      }
      return data;
    } catch (error) {
      toast.error('Failed to edit fabric.');
      const { data, status } = error.response;
      return rejectWithValue({ data, status });
    }
  }
);
