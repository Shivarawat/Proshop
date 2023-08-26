import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const USERS_URL = '/api/users';

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : '';

const initialState = {
  loading: false,
  error: null,
  cart: [],
  userInfo: userInfoFromStorage,
  loadingUsers: false,
  errorUsers: null,
  users: [],
  successDelete: false,
  targetUserInfo: {},
  successUpdate: false,
  errorUpdate: null
};

export const login = createAsyncThunk(
  'users/login',
  async ({ email, password }, thunkAPI) => {
    try {
      const config = {
        headers: { 'Content-Type': 'application/json' },
      };
      const { data } = await axios.post(
        `${USERS_URL}/login`,
        {
          email,
          password,
        },
        config
      );
      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id, thunkAPI) => {
    try {
      const { userInfo } = thunkAPI.getState().user;
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.delete(`/api/users/${id}`, config);
    } catch (error) {
      return thunkAPI.rejectWithValue('Delete User Request is Rejected');
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async (user, thunkAPI) => {
    try {
      const { userInfo } = thunkAPI.getState().user;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.put(`/api/users/${user._id}`, user, config);

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Delete User Request is Rejected');
    }
  }
);

export const listUsers = createAsyncThunk(
  'users/listAllUsers',
  async (_, thunkAPI) => {
    try {
      const userInfo = thunkAPI.getState().user.userInfo;
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get('/api/users', config);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const logout = createAsyncThunk('users/logout', () => {
  localStorage.removeItem('userInfo');
});

export const register = createAsyncThunk(
  'users/register',
  async ({ name, email, password }, thunkAPI) => {
    try {
      const config = { headers: { 'Content-type': 'application/json' } };
      const { data } = await axios.post(
        USERS_URL,
        { name, email, password },
        config
      );
      localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
      thunkAPI.rejectWithValue('Registration Error');
    }
  }
);

export const getUserDetails = createAsyncThunk(
  'user/getDetails',
  async (id, thunkAPI) => {
    try {
      const userInfo = thunkAPI.getState().user.userInfo;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get(`/api/users/${id}`, config);
      return data;
    } catch (error) {}
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateDetails',
  async ({ user }, thunkAPI) => {
    try {
      const userInfo = thunkAPI.getState().user.userInfo;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.put(`${USERS_URL}/profile`, user, config);
      return data;
    } catch (error) {}
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    updateUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(login.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        // console.log(state.error);
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.userInfo = null;
        state.users = [];
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        localStorage.setItem('userInfo', JSON.stringify(action.payload));
        state.userInfo = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        // console.log('TASK FAILED');
      })
      .addCase(getUserDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        // console.log('GET USER DETAILS SUCCESS', action.payload);
        state.loading = false;
        state.targetUserInfo = action.payload;
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        // console.log('GET USER DETAILS SUCCESS', action.payload);
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(listUsers.pending, (state, action) => {
        state.loadingUsers = true;
      })
      .addCase(listUsers.fulfilled, (state, action) => {
        state.loadingUsers = false;
        state.users = [];
        state.users.push(...action.payload);
      })
      .addCase(listUsers.rejected, (state, action) => {
        state.loadingUsers = false;
        state.errorUsers = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.successDelete = true;
      })
      .addCase(updateUser.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.targetUserInfo = action.payload;
        state.successUpdate = true;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.successUpdate = false;
        state.errorUpdate = action.payload;
      });
  },
});

export const { updateUserInfo } = userSlice.actions;
export default userSlice.reducer;
