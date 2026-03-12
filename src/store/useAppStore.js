import { create } from 'zustand';

const useAppStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  latestReading: null,
  setLatestReading: (reading) => set({ latestReading: reading }),
  sensorStatus: 'offline',
  setSensorStatus: (status) => set({ sensorStatus: status }),
  alerts: [],
  setAlerts: (alerts) => set({ alerts }),
  readingHistory: [],
  setReadingHistory: (history) => set({ readingHistory: history }),
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
