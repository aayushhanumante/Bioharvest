import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// ─── CONFIG ───────────────────────────────────────
const WEB_CLIENT_ID = '628910961980-m3pm1l38movi1c5uhehf4al82rb4a0t0.apps.googleusercontent.com';
const BIN_ID = 'bin_001'; // Must match ESP32 Firebase path

GoogleSignin.configure({ webClientId: WEB_CLIENT_ID });

// ─── THRESHOLDS ───────────────────────────────────
export const THRESHOLDS = {
  SAFE: 300,      // Below this -> Normal (green)
  WARNING: 500,   // Above this -> Elevated (orange)
  DANGER: 1000,   // Above this -> Danger (red)
};

// ─── AUTH ─────────────────────────────────────────

export const signInWithGoogle = async () => {
  await GoogleSignin.hasPlayServices();
  const signInResult = await GoogleSignin.signIn();
  const idToken = signInResult.data?.idToken ?? signInResult.idToken;
  if (!idToken) throw new Error('No ID token returned');
  const credential = auth.GoogleAuthProvider.credential(idToken);
  const { user } = await auth().signInWithCredential(credential);
  await ensureUserDocument(user);
  return user;
};

export const signInWithEmail = async (email, password) => {
  const { user } = await auth().signInWithEmailAndPassword(email, password);
  return user;
};

export const registerWithEmail = async (email, password, displayName) => {
  const { user } = await auth().createUserWithEmailAndPassword(email, password);
  await user.updateProfile({ displayName });
  await ensureUserDocument(user, displayName);
  return user;
};

export const signOut = async () => {
  try { await GoogleSignin.signOut(); } catch (_) {}
  await auth().signOut();
};

const ensureUserDocument = async (user, displayName) => {
  const ref = firestore().collection('users').doc(user.uid);
  const doc = await ref.get();
  if (!doc.exists) {
    await ref.set({
      displayName: displayName ?? user.displayName ?? '',
      email: user.email,
      thresholdPPM: THRESHOLDS.WARNING,
      notificationsEnabled: true,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
  }
};

// ─── REALTIME DATABASE ────────────────────────────
// ESP32 writes to: /sensors/bin_001/latest
// Expected shape: { ppm, temperature, humidity, timestamp, sensor_status }

export const subscribeToLatestReading = (callback) => {
  const ref = database().ref(`/sensors/${BIN_ID}/latest`);
  ref.on('value', (snap) => callback(snap.val()));
  return () => ref.off('value');
};

export const fetchReadingHistory = async (limit = 50) => {
  const snap = await database()
    .ref(`/sensors/${BIN_ID}/readings`)
    .orderByKey()
    .limitToLast(limit)
    .once('value');
  const raw = snap.val();
  if (!raw) return [];
  return Object.entries(raw)
    .map(([key, value]) => ({ id: key, ...value }))
    .sort((a, b) => a.timestamp - b.timestamp);
};

// ─── FIRESTORE ────────────────────────────────────
// ESP32 or Cloud Function writes to: /alerts/{alertId}
// Expected shape: { binId, ppm, triggeredAt, resolved, resolvedAt }

export const subscribeToAlerts = (callback) => {
  return firestore()
    .collection('alerts')
    .orderBy('triggeredAt', 'desc')
    .limit(20)
    .onSnapshot((snap) => {
      callback(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
};

export const resolveAlert = async (alertId) => {
  await firestore().collection('alerts').doc(alertId).update({
    resolved: true,
    resolvedAt: firestore.FieldValue.serverTimestamp(),
  });
};

export const updateUserSettings = async (uid, settings) => {
  await firestore().collection('users').doc(uid).update(settings);
};