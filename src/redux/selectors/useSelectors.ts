import type { RootState } from '../store';

export const selectSinglePost = (state: RootState) =>
  state.userReducer.userData;

export const selectUserData = (state: RootState) => state.userReducer.userData;

export const selectWelcomeMessage = (state: RootState) =>
  state.userReducer.welcome;
