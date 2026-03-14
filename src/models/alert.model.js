// src/models/alert.model.js - Alert models
export const AlertSchema = {
  id: 'string',
  bin_id: 'string',
  type: ['threshold', 'sensor_error', 'maintenance'],
  message: 'string',
  timestamp: 'number',
  acknowledged: 'boolean'
};

export const validateAlert = (data) => {
  const errors = [];
  if (typeof data.id !== 'string') errors.push('id must be a string');
  if (typeof data.bin_id !== 'string') errors.push('bin_id must be a string');
  if (!AlertSchema.type.includes(data.type)) {
    errors.push('type must be threshold, sensor_error, or maintenance');
  }
  if (typeof data.message !== 'string') errors.push('message must be a string');
  if (typeof data.timestamp !== 'number') errors.push('timestamp must be a number');
  if (typeof data.acknowledged !== 'boolean') errors.push('acknowledged must be a boolean');
  return errors;
};

export class Alert {
  constructor(data) {
    this.id = data.id;
    this.bin_id = data.bin_id;
    this.type = data.type;
    this.message = data.message;
    this.timestamp = data.timestamp;
    this.acknowledged = data.acknowledged;
  }
}