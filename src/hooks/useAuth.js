// src/hooks/useAuth.js - Auth hook
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import { authRepository } from '../repositories';
import useAppStore from '../store/useAppStore';

export const useAuth = () => {
  const { user, isAuthenticated, isLoadingAuth, authError, setUser, setLoadingAuth, setAuthError } = useAppStore();

  useEffect(() => {
    setLoadingAuth(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoadingAuth]);

  const login = async (credentials) => {
    try {
      setAuthError(null);
      const user = await authRepository.login(credentials);
      setUser(user);
      return user;
    } catch (error) {
      setAuthError(error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authRepository.logout();
      setUser(null);
    } catch (error) {
      setAuthError(error);
      throw error;
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading: isLoadingAuth,
    error: authError,
    login,
    logout,
  };
};