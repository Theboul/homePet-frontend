import { type AppDispatch } from "../store";
import { logout as logoutAuth } from "./authSlice";
import { clearTenant } from "../tenant/tenantSlice";
import { clearComponents } from "../components/componentSlice";
import { api } from "../api/api";

export const performFullLogout = (dispatch: AppDispatch) => {
  // 1. Limpiar auth (tokens + user)
  dispatch(logoutAuth());

  // 2. Limpiar tenant
  dispatch(clearTenant());

  // 3. Limpiar componentes y permisos
  dispatch(clearComponents());

  // 4. Limpiar caché de RTK Query
  dispatch(api.util.resetApiState());
  
  // Opcional: Limpiar cookies si se usan
};
