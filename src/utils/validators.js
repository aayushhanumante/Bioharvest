// ─────────────────────────────────────────────
// validators.js — Data validation utilities
// Used to validate data coming from Firebase/ESP32
// ─────────────────────────────────────────────

// Sensor Reading
export const validateSensorReading = (data) => {
  const errors = [];
  if (typeof data.ppm !== 'number') errors.push('ppm must be a number');
  if (typeof data.temperature !== 'number') errors.push('temperature must be a number');
  if (typeof data.humidity !== 'number') errors.push('humidity must be a number');
  if (typeof data.timestamp !== 'number') errors.push('timestamp must be a number');
  if (!['offline', 'active', 'error'].includes(data.sensor_status)) {
    errors.push('sensor_status must be offline, active, or error');
  }
  return errors;
};

// Alert
export const validateAlert = (data) => {
  const errors = [];
  if (typeof data.id !== 'string') errors.push('id must be a string');
  if (typeof data.bin_id !== 'string') errors.push('bin_id must be a string');
  if (!['threshold', 'sensor_error', 'maintenance'].includes(data.type)) {
    errors.push('type must be threshold, sensor_error, or maintenance');
  }
  if (typeof data.message !== 'string') errors.push('message must be a string');
  if (typeof data.timestamp !== 'number') errors.push('timestamp must be a number');
  if (typeof data.acknowledged !== 'boolean') errors.push('acknowledged must be a boolean');
  return errors;
};

// Bin
export const validateBin = (data) => {
  const errors = [];
  if (typeof data.id !== 'string') errors.push('id must be a string');
  if (typeof data.name !== 'string') errors.push('name must be a string');
  if (typeof data.location !== 'string') errors.push('location must be a string');
  if (typeof data.capacity !== 'number') errors.push('capacity must be a number');
  if (!['active', 'inactive', 'maintenance'].includes(data.status)) {
    errors.push('status must be active, inactive, or maintenance');
  }
  return errors;
};

// User
export const validateUser = (data) => {
  const errors = [];
  if (typeof data.id !== 'string') errors.push('id must be a string');
  if (typeof data.email !== 'string') errors.push('email must be a string');
  if (typeof data.name !== 'string') errors.push('name must be a string');
  if (!['admin', 'user', 'viewer'].includes(data.role)) {
    errors.push('role must be admin, user, or viewer');
  }
  return errors;
};