import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import authService from './authService';
import { extractErrorMessage } from '../../utils';

// Get user from local storage if he is already there and use it in initial state
const user = JSON.parse(localStorage.getItem('user'));
const initialState = {
  user: user ? user : null,
  isLoading: false,
};

export const register = createAsyncThunk(
  'auth/register',
  async (user, thunkAPI) => {
    //console.log(user);
    try {
      return await authService.register(user);
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
      //console.log(extractErrorMessage(error));
    }
  }
);

export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
  //console.log(user);
  try {
    return await authService.login(user);
  } catch (error) {
    return thunkAPI.rejectWithValue(extractErrorMessage(error));
  }
});

export const logout = createAction('auth/logout', () => {
  authService.logout();
  return {};
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default authSlice.reducer;
