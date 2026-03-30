import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from './auth.types';
import Cookies from 'js-cookie';

const ACCESS_TOKEN_KEY = 'homePet_access_token';
// El refresh token suele guardarse en httpOnly cookie por seguridad del backend,
// pero si necesitas manejarlo, puedes usar otra key.

const getInitialToken = () => {
  return Cookies.get(ACCESS_TOKEN_KEY) || null;
};

// Intento leer token al inicio
// La decodificación JWT podría ir aquí si se guarda estado inicial en base al token
const initialToken = getInitialToken();

const initialState: AuthState = {
  user: null,
  accessToken: initialToken,
  isAuthenticated: !!initialToken,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string }>
    ) => {
      const { user, accessToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.isAuthenticated = true;
      state.error = null;
      // Persistir token en cookie
      Cookies.set(ACCESS_TOKEN_KEY, accessToken, { secure: true, sameSite: 'strict' });
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.error = null;
      // Limpiar cookies
      Cookies.remove(ACCESS_TOKEN_KEY);
    },
  },
});

export const { setCredentials, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;
