import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '@/services/api';

// localStorage'dan başlangıç verilerini güvenli bir şekilde alalım
const localUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null;
const localToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

// Async Thunk: Giriş (Login) İşlemi
export const loginUser = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
  try {
    const response = await API.post('/auth/login', userData);
    // Backend'den gelen token ve user bilgilerini localStorage'a kaydediyoruz
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || 'Giriş yapılamadı');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: localUser,
    token: localToken,
    isLoading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;