// src/repositories/auth.repository.js - Auth data access
import { login, logout } from '../api/endpoints/auth.api';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

export class AuthRepository {
  async login(credentials) {
    try {
      return await login(credentials);
    } catch (error) {
      // Fallback to Firebase
      const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      return userCredential.user;
    }
  }

  async logout() {
    try {
      return await logout();
    } catch (error) {
      await signOut(auth);
    }
  }
}

export const authRepository = new AuthRepository();