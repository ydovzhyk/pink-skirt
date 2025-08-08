import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  axiosRegister,
  axiosLogin,
  axiosLogout,
  axiosGetCurrentUser,
} from '../../api/auth';
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const data = await axiosRegister(userData);
      const { accessToken, refreshToken, sid } = data;
      const authData = { accessToken, refreshToken, sid };
      localStorage.setItem('pink-skirt.authData', JSON.stringify(authData));
      return data;
    } catch (error) {
      const { data, status } = error.response;
      dispatch(setModalWindowStatus(true));
      return rejectWithValue({ data, status });
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const data = await axiosLogin(userData);
      const { accessToken, refreshToken, sid } = data;
      const authData = { accessToken, refreshToken, sid };
      localStorage.setItem('pink-skirt..authData', JSON.stringify(authData));
      return data;
    } catch (error) {
      const { data, status } = error.response;
      dispatch(setModalWindowStatus(true));
      return rejectWithValue({ data, status });
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const data = await axiosLogout();
      localStorage.removeItem('pink-skirt.authData');
      return data;
    } catch (error) {
      const { data, status } = error.response;
      dispatch(setModalWindowStatus(true));
      return rejectWithValue({ data, status });
    }
  }
);

export const updateUser = createAsyncThunk(
  'auth/current',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const authDataJSON = localStorage.getItem('pink-skirt.authData');
      const authData = JSON.parse(authDataJSON);
      const userData = authData;
      const data = await axiosGetCurrentUser(userData);
      return data;
    } catch (error) {
      const { data, status } = error.response;
      dispatch(setModalWindowStatus(true));
      return rejectWithValue({ data, status });
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/current',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const authDataJSON = localStorage.getItem('pink-skirt.authData');
      const authData = JSON.parse(authDataJSON);
      const userData = authData;
      const data = await axiosGetCurrentUser(userData);
      return data;
    } catch (error) {
      const { data, status } = error.response;
      dispatch(setModalWindowStatus(true));
      return rejectWithValue({ data, status });
    }
  }
);
