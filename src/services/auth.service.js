import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';

GoogleSignin.configure({
  webClientId: '628910961980-m3pm1l38movi1c5uhehf4al82rb4a0t0.apps.googleusercontent.com',
});

export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const signInResult = await GoogleSignin.signIn();
    const idToken = signInResult.data?.idToken ?? signInResult.idToken;
    if (!idToken) throw new Error('No ID token returned');
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    const userCredential = await auth().signInWithCredential(googleCredential);
    await ensureUserDocument(userCredential.user);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const registerWithEmail = async (email, password, displayName) => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    await userCredential.user.updateProfile({ displayName });
    await ensureUserDocument(userCredential.user, displayName);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signOut = async () => {
  try {
    await GoogleSignin.signOut();
  } catch (_) {}
  await auth().signOut();
};

const ensureUserDocument = async (user, displayName) => {
  const ref = firestore().collection('users').doc(user.uid);
  const doc = await ref.get();
  if (!doc.exists) {
    await ref.set({
      displayName: displayName ?? user.displayName ?? '',
      email: user.email,
      thresholdPPM: 500,
      notificationsEnabled: true,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
  }
};
