import { create } from 'zustand';

/**
 * Global app state using Zustand.
 * All Firebase data flows through here via hooks.
 *
 * State shape:
 * - user          → Firebase Auth user object
 * - latestReading → { ppm, timestamp, sensor_status }
 * - sensorStatus  → 'active' | 'offline' | 'error'
 * - alerts        → Firestore alerts array
 * - readingHistory → array of historical RTDB readings
 * - userSettings  → { thresholdPPM, notificationsEnabled }
 */
const useAppStore = create((set) => ({
  // Auth
  user: null,
  setUser: (user) => set({ user }),

  // Live sensor data (from Firebase Realtime Database)
  latestReading: null,
  setLatestReading: (reading) => set({ latestReading: reading }),

  // Sensor connection status
  sensorStatus: 'offline',
  setSensorStatus: (status) => set({ sensorStatus: status }),

  // Alerts (from Firestore)
  alerts: [],
  setAlerts: (alerts) => set({ alerts }),

  // Historical readings (from Realtime Database)
  readingHistory: [],
  setReadingHistory: (history) => set({ readingHistory: history }),

  // User preferences (from Firestore /users/{uid})
  userSettings: {
    thresholdPPM: 500,
    notificationsEnabled: true,
  },
  setUserSettings: (settings) =>
    set((state) => ({
      userSettings: { ...state.userSettings, ...settings },
    })),
}));

export default useAppStore;