// src/store/slices/authSlice.js - Auth state slice
export const createAuthSlice = (set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoadingAuth: false,
  authError: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLoadingAuth: (isLoading) => set({ isLoadingAuth: isLoading }),
  setAuthError: (error) => set({ authError: error }),
  clearAuthError: () => set({ authError: null }),
});