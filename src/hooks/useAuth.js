import { useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import useAppStore from '../store/useAppStore';
import { signInWithEmail, signInWithGoogle, signOut } from '../services/auth.service';

/**
 * Auth hook — wraps Firebase auth state and auth service methods.
 * Used by: Login screen, Settings screen, app layout
 */
export const useAuth = () => {
  const user = useAppStore((s) => s.user);
  const setUser = useAppStore((s) => s.setUser);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });
    return unsubscribe;
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    signInWithEmail,
    signInWithGoogle,
    signOut,
  };
};