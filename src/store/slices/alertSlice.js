// src/store/slices/alertSlice.js - Alert state slice
export const createAlertSlice = (set, get) => ({
  alerts: [],
  isLoadingAlerts: false,
  alertError: null,

  setAlerts: (alerts) => set({ alerts }),
  setLoadingAlerts: (isLoading) => set({ isLoadingAlerts: isLoading }),
  setAlertError: (error) => set({ alertError: error }),
  addAlert: (alert) => set((state) => ({ alerts: [...state.alerts, alert] })),
  updateAlert: (alertId, updates) => set((state) => ({
    alerts: state.alerts.map(alert => 
      alert.id === alertId ? { ...alert, ...updates } : alert
    )
  })),
});