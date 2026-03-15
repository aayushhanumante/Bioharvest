import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import { BIN_ID } from '../constants/thresholds';

// REALTIME DATABASE - Live sensor readings
// ESP32 writes to: /sensors/{BIN_ID}/latest

/**
 * Subscribes to the latest sensor reading from Firebase Realtime Database.
 * Called by useSensorData hook. Returns unsubscribe function.
 * @param {function} callback - receives { ppm, timestamp, sensor_status }
 */
export const subscribeToLatestReading = (callback) => {
  const ref = database().ref(`/sensors/${BIN_ID}/latest`);
  ref.on('value', (snapshot) => {
    callback(snapshot.val());
  });
  return () => ref.off('value');
};

/**
 * Fetches historical readings from Realtime Database.
 * Used by Analytics screen.
 * @param {number} limitCount - number of readings to fetch (default 50)
 */
export const fetchReadingHistory = async (limitCount = 50) => {
  const ref = database()
    .ref(`/sensors/${BIN_ID}/readings`)
    .orderByKey()
    .limitToLast(limitCount);
  const snapshot = await ref.once('value');
  const raw = snapshot.val();
  if (!raw) return [];
  return Object.entries(raw)
    .map(([key, value]) => ({ id: key, ...value }))
    .sort((a, b) => a.timestamp - b.timestamp);
};

// FIRESTORE - Alerts
// ESP32 or Cloud Function writes to: /alerts/{alertId}

/**
 * Subscribes to real-time alerts from Firestore.
 * Called by useAlerts hook. Returns unsubscribe function.
 * @param {function} callback - receives array of alert objects
 */
export const subscribeToAlerts = (callback) => {
  return firestore()
    .collection('alerts')
    .orderBy('triggeredAt', 'desc')
    .limit(20)
    .onSnapshot((snapshot) => {
      const alerts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(alerts);
    });
};

/**
 * Marks an alert as resolved in Firestore.
 * Called from Alerts screen resolve button.
 * @param {string} alertId - Firestore document ID
 */
export const resolveAlert = async (alertId) => {
  await firestore().collection('alerts').doc(alertId).update({
    resolved: true,
    resolvedAt: firestore.FieldValue.serverTimestamp(),
  });
};