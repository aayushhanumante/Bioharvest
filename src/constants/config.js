// src/constants/config.js - Configuration constants
export const API_CONFIG = {
  useFirebase: process.env.EXPO_PUBLIC_USE_FIREBASE !== 'false',
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 30000,
  retries: 3,
};

export const SENSOR_CONFIG = {
  default_bin_id: process.env.EXPO_PUBLIC_BIN_ID || 'bin_001',
  max_bins: 10,
};

export const ALERT_CONFIG = {
  auto_acknowledge_threshold: 24 * 60 * 60 * 1000, // 24 hours
};