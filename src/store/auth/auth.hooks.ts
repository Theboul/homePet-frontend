import { useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAppDispatch, useAppSelector } from '../hooks';
import { logout } from './authSlice';
import { useLogoutSessionMutation } from './authApi';

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const refreshToken = useAppSelector((state) => state.auth.refreshToken);
  const [logoutSession, { isLoading }] = useLogoutSessionMutation();

  const handleLogout = useCallback(async () => {
    try {
      // Llamar al endpoint de logout del backend si hay refreshToken
      if (refreshToken) {
        await logoutSession({ refresh: refreshToken }).unwrap();
      }
    } catch (error) {
      console.error('Error en logout del backend:', error);
    } finally {
      // Limpiar estado local independientemente si la llamada falla
      dispatch(logout());

      // Redirigir a login
      navigate({ to: '/login', search: { register: false } });
    }
  }, [refreshToken, logoutSession, dispatch, navigate]);

  return {
    handleLogout,
    isLoading,
  };
};