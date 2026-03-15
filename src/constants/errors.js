export const ERROR_CODES = {
  AUTH_ERROR: 'AUTH_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SENSOR_ERROR: 'SENSOR_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
};

export const ERROR_MESSAGES = {
  [ERROR_CODES.AUTH_ERROR]: 'Authentication failed. Please check your credentials.',
  [ERROR_CODES.VALIDATION_ERROR]: 'Invalid data provided.',
  [ERROR_CODES.SENSOR_ERROR]: 'Sensor data unavailable.',
  [ERROR_CODES.NETWORK_ERROR]: 'Network connection failed. Please check your internet connection.',
};