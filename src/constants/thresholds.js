/**
 * Methane concentration thresholds in PPM.
 * These values determine the status shown on bin cards and trigger alerts.
 * Adjust based on your MQ4 sensor calibration.
 */
export const METHANE_THRESHOLDS = {
  SAFE: 300,      // Below this → Normal (green)
  WARNING: 500,   // Above this → Elevated (orange)
  DANGER: 1000,   // Above this → Danger (red)
};

/**
 * Possible sensor connection states.
 * Determined by timestamp age of latest reading.
 */
export const SENSOR_STATUS = {
  ACTIVE: 'active',
  OFFLINE: 'offline',
  ERROR: 'error',
};

/**
 * Hardware bin identifier — must match the key used by ESP32 in Firebase.
 * Firebase path: /sensors/{BIN_ID}/latest
 * TODO: Make this dynamic when supporting multiple bins.
 */
export const BIN_ID = 'bin_001';