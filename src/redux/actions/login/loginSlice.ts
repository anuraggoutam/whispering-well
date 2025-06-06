import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RoleType } from '../../../models/User';
import type User from '../../../models/User';

export const ACTION_TYPES = {
  USER_LOGIN_PENDING: 'user/login/pending' as const,
  USER_LOGIN_FULFILLED: 'user/login/fulfilled' as const,
  USER_LOGIN_REJECTED: 'user/login/rejected' as const,
  USER_INFO_PENDING: 'user/user-info/pending' as const,
  USER_INFO_FULFILLED: 'user/user-info/fulfilled' as const,
  USER_INFO_REJECTED: 'user/user-info/rejected' as const,
  USER_UPDATE: 'user/userUpdate' as const,
  UPDATE_MESSAGE: 'user/updateMessage' as const,
} as const;
interface UserState {
  userData: {
    user: User;
    status: 'idle' | 'loading' | 'done' | 'failed';
    error: string | null;
  };
  welcome: { status: boolean };
}

const initialState: UserState = {
  userData: {
    user: { _id: '', username: '' },
    status: 'idle',
    error: null,
  },
  welcome: { status: false },
};

const loginSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userUpdate: (state, action: PayloadAction<User>) => {
      state.userData.user = action.payload;
    },
    updateMessage: (state, action: PayloadAction<any>) => {
      state.welcome = action.payload;
    },
    logout: (state) => {
      state.userData = initialState.userData;
      if (window.location.pathname.includes('admin')) {
        localStorage.removeItem('token-admin');
        localStorage.removeItem('refreshToken-admin');
        localStorage.removeItem('userType-admin');
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userType');
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(ACTION_TYPES.USER_LOGIN_PENDING, (state) => {
        state.userData.status = 'loading';
      })
      .addCase(ACTION_TYPES.USER_LOGIN_FULFILLED, (state, action) => {
        state.userData.error = '';
        state.userData.status = 'done';
      })
      .addCase(ACTION_TYPES.USER_LOGIN_REJECTED, (state, action) => {
        state.userData.error = action.payload;
        state.userData.status = 'failed';
      })
      .addCase(ACTION_TYPES.USER_INFO_FULFILLED, (state, action) => {
        if (action.payload.data.user.role === RoleType.user)
          localStorage.setItem('userType', action.payload.data.user.role);
        else
          localStorage.setItem('userType-admin', action.payload.data.user.role);
        state.userData.user = action.payload.data.user;
        state.userData.error = '';
        state.userData.status = 'done';
      });
  },
});

export const { logout, userUpdate, updateMessage } = loginSlice.actions;

export default loginSlice;
