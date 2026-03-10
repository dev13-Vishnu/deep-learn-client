import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '../../api/auth.api';
import { tokenStorage } from '../../storage/token.storage';
import { roleContextStorage } from '../../storage/roleContext.storage';
import type { InstructorState } from '../../auth/types';

export type RoleContext = 'student' | 'instructor' | 'admin';

export function toRoleContext(role: any): RoleContext {
  if (role === 1 || role === 'instructor') return 'instructor';
  if (role === 2 || role === 'admin') return 'admin';
  return 'student';
}

export interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  currentRole: RoleContext | null;
  instructorState: InstructorState | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isHydrating: true,
  currentRole: null,
  instructorState: null,
};

export const hydrateAuth = createAsyncThunk(
  'auth/hydrate',
  async (_, { rejectWithValue }) => {
    const token = tokenStorage.get();
    if (!token) return null;

    const storedRole = roleContextStorage.get();

    try {
      const res = await authApi.me();
      const user = res.data;
      return {
        user,
        currentRole: storedRole ?? toRoleContext(user.role),
        instructorState: (user.instructorState as InstructorState) ?? null,
      };
    } catch (err: any) {
      if (err?.response?.status !== 401) {
        console.error(err);
      }
      tokenStorage.clear();
      return rejectWithValue('Session expired');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (
    {
      email,
      password,
      roleContext = 'student',
    }: { email: string; password: string; roleContext?: RoleContext },
    { rejectWithValue }
  ) => {
    try {
      const response = await authApi.login({ email, password });
      const { accessToken, user } = response.data;

      tokenStorage.set(accessToken);
      roleContextStorage.set(roleContext);

      return { user, roleContext };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Login failed');
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  try {
    await authApi.logout();
  } catch {
    // ignore network errors on logout
  }
  tokenStorage.clear();
  roleContextStorage.clear();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ roleContext?: RoleContext }>
    ) {
      state.currentRole = action.payload.roleContext ?? 'student';
      state.isAuthenticated = true;
    },

    setFullAuth(
      state,
      action: PayloadAction<{ user: any; roleContext?: RoleContext }>
    ) {
      state.user            = action.payload.user;
      state.currentRole     = action.payload.roleContext ?? 'student';
      state.instructorState = action.payload.user.instructorState ?? null;
      state.isAuthenticated = true;
      state.isHydrating     = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(hydrateAuth.pending, (state) => {
      state.isHydrating = true;
    });
    builder.addCase(hydrateAuth.fulfilled, (state, action) => {
      if (action.payload) {
        state.user            = action.payload.user;
        state.currentRole     = action.payload.currentRole;
        state.instructorState = action.payload.instructorState;
        state.isAuthenticated = true;
      }
      state.isHydrating = false;
    });
    builder.addCase(hydrateAuth.rejected, (state) => {
      state.user            = null;
      state.isAuthenticated = false;
      state.isHydrating     = false;
      state.currentRole     = null;
      state.instructorState = null;
    });

    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.user            = action.payload.user;
      state.currentRole     = action.payload.roleContext;
      state.instructorState = action.payload.user.instructorState ?? null;
      state.isAuthenticated = true;
    });

    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user            = null;
      state.currentRole     = null;
      state.instructorState = null;
      state.isAuthenticated = false;
    });
  },
});

export const { setCredentials, setFullAuth } = authSlice.actions;
export default authSlice.reducer;