// src/models/sensor.model.js - Sensor data models
export const SensorReadingSchema = {
  ppm: 'number',
  temperature: 'number',
  humidity: 'number',
  timestamp: 'number',
  sensor_status: ['offline', 'active', 'error']
};

export const validateSensorReading = (data) => {
  const errors = [];
  if (typeof data.ppm !== 'number') errors.push('ppm must be a number');
  if (typeof data.temperature !== 'number') errors.push('temperature must be a number');
  if (typeof data.humidity !== 'number') errors.push('humidity must be a number');
  if (typeof data.timestamp !== 'number') errors.push('timestamp must be a number');
  if (!SensorReadingSchema.sensor_status.includes(data.sensor_status)) {
    errors.push('sensor_status must be offline, active, or error');
  }
  return errors;
};

export class SensorReading {
  constructor(data) {
    this.ppm = data.ppm;
    this.temperature = data.temperature;
    this.humidity = data.humidity;
    this.timestamp = data.timestamp;
    this.sensor_status = data.sensor_status;
  }
}