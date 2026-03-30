import { fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';
import { logout, setCredentials } from '../auth/authSlice';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
// Usa tu ruta de endpoint real para el refresh token
const REFRESH_TOKEN_URL = '/auth/refresh'; 

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, { getState, endpoint }) => {
    // Excluir endpoints de auth donde no se requiere / no se debe mandar el token para evitar problemas
    if (!['login', 'register'].includes(endpoint)) {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Guardar si ya estamos intentando hacer refresh para evitar loops
    // (Por simplicidad lo haremos de manera secuencial aquí)
    const refreshToken = Cookies.get('homePet_refresh_token'); // o desde donde leas el refresh

    if (refreshToken) {
      if (import.meta.env.DEV) {
        console.warn('Token expirado, intentando refrescar...');
      }

      // Intentar refrescar token
      const refreshResult = await baseQuery(
        {
          url: REFRESH_TOKEN_URL,
          method: 'POST',
          body: { refresh: refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        // Asume que la respuesta trae token de acceso nuevo (y quizás refresh nuevo)
        // Adaptarlo según la respuesta exacta de Django
        const user = (api.getState() as RootState).auth.user;
        const newAccessToken = (refreshResult.data as any).access;
        
        if (user) {
          api.dispatch(
            setCredentials({
              user,
              accessToken: newAccessToken,
            })
          );
        }

        // Reintentar la query original
        result = await baseQuery(args, api, extraOptions);
      } else {
        if (import.meta.env.DEV) {
          console.error('Fallo el refresh token. Haciendo logout.');
        }
        api.dispatch(logout());
      }
    } else {
      // No hay refresh token disponible, forzar deslogueo
      api.dispatch(logout());
    }
  }

  // Manejo global de errores HTTP (para logs en desarrollo u otras integraciones como Toast)
  if (result.error && import.meta.env.DEV) {
    const errorStatus = result.error.status;
    switch (errorStatus) {
      case 400:
        console.error('Bad Request (400):', result.error.data);
        break;
      case 403:
        console.error('Forbidden (403): Permisos insuficientes.');
        break;
      case 404:
        console.error('Not Found (404)');
        break;
      case 500:
        console.error('Internal Server Error (500)');
        break;
      case 'FETCH_ERROR':
        console.error('Fetch Error: Problemas de Red / Timeout', result.error);
        break;
      default:
        console.error('Error HTTP no manejado:', result.error);
    }
  }

  return result;
};
