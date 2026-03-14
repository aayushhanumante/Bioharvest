// src/store/slices/sensorSlice.js - Sensor state slice
export const createSensorSlice = (set, get) => ({
  latestReading: null,
  readingHistory: [],
  isLoadingReading: false,
  isLoadingHistory: false,
  readingError: null,
  historyError: null,

  setLatestReading: (reading) => set({ latestReading: reading }),
  setReadingHistory: (history) => set({ readingHistory: history }),
  setLoadingReading: (isLoading) => set({ isLoadingReading: isLoading }),
  setLoadingHistory: (isLoading) => set({ isLoadingHistory: isLoading }),
  setReadingError: (error) => set({ readingError: error }),
  setHistoryError: (error) => set({ historyError: error }),
});