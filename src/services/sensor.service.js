import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import { BIN_ID } from '../constants/thresholds';

export const subscribeToLatestReading = (callback) => {
  const ref = database().ref(`/sensors/${BIN_ID}/latest`);
  ref.on('value', (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
  return () => ref.off('value');
};

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

export const subscribeToAlerts = (callback) => {
  const unsubscribe = firestore()
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
  return unsubscribe;
};

export const resolveAlert = async (alertId) => {
  await firestore().collection('alerts').doc(alertId).update({
    resolved: true,
    resolvedAt: firestore.FieldValue.serverTimestamp(),
  });
};
