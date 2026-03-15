import { create } from 'zustand';

const useAppStore = create((set) => ({
  // Auth - Firebase Auth user object
  user: null,
  setUser: (user) => set({ user }),

  // Live sensor data - { ppm, timestamp, sensor_status }
  // Updated by firebase.js subscribeToLatestReading()
  latestReading: null,
  setLatestReading: (reading) => set({ latestReading: reading }),

  // Sensor connection status - 'active' | 'offline' | 'error'
  sensorStatus: 'offline',
  setSensorStatus: (status) => set({ sensorStatus: status }),

  // Alerts from Firestore /alerts collection
  alerts: [],
  setAlerts: (alerts) => set({ alerts }),

  // Historical readings from Realtime Database
  readingHistory: [],
  setReadingHistory: (history) => set({ readingHistory: history }),

  // User preferences from Firestore /users/{uid}
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