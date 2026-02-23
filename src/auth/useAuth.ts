import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  loginUser,
  logoutUser,
  setCredentials,
  type RoleContext,
} from '../store/auth/authSlice';
import { tokenStorage } from '../storage/token.storage';
import { roleContextStorage } from '../storage/roleContext.storage';

export const useAuth = () => {
  const dispatch = useAppDispatch();

  const user             = useAppSelector((s) => s.auth.user);
  const isAuthenticated  = useAppSelector((s) => s.auth.isAuthenticated);
  const isHydrating      = useAppSelector((s) => s.auth.isHydrating);
  const currentRole      = useAppSelector((s) => s.auth.currentRole);
  const instructorState  = useAppSelector((s) => s.auth.instructorState);

  const login = useCallback(
    async (
      email: string,
      password: string,
      roleContext: RoleContext = 'student'
    ) => {
      const result = await dispatch(loginUser({ email, password, roleContext }));

      if (loginUser.rejected.match(result)) {
        throw new Error(result.payload as string);
      }

      return result.payload.user;
    },
    [dispatch]
  );


  const authenticateWithToken = useCallback(
    (token: string, roleContext: RoleContext = 'student') => {
      tokenStorage.set(token);
      roleContextStorage.set(roleContext);
      dispatch(setCredentials({ roleContext }));
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    await dispatch(logoutUser());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    isHydrating,
    currentRole,
    instructorState,
    login,
    authenticateWithToken,
    logout,
  };
};