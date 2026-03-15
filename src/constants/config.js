// Sensor configuration
export const SENSOR_CONFIG = {
  DEFAULT_BIN_ID: 'bin_001',
  MAX_BINS: 10,
  OFFLINE_TIMEOUT_MS: 30000, // ms before sensor considered offline
};

// Alert configuration
export const ALERT_CONFIG = {
  AUTO_ACKNOWLEDGE_AFTER_MS: 24 * 60 * 60 * 1000, // 24 hours
  MAX_ALERTS_DISPLAYED: 20,
};