// src/utils/validators.js - Validation utilities
import { validateSensorReading, validateAlert, validateBin, validateUser } from '../models';

export const validateData = (type, data) => {
  switch (type) {
    case 'sensorReading':
      return validateSensorReading(data);
    case 'alert':
      return validateAlert(data);
    case 'bin':
      return validateBin(data);
    case 'user':
      return validateUser(data);
    default:
      return ['Unknown validation type'];
  }
};