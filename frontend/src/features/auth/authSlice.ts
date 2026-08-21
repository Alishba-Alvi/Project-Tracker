import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  email: string;
  systemRole: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  authChecked: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  authChecked: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ accessToken: string; user?: User }>,
    ) => {
      state.accessToken = action.payload.accessToken;
      if (action.payload.user) {
        state.user = action.payload.user;
      }
      state.authChecked = true;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.authChecked = true;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;