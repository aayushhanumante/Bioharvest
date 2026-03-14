// src/repositories/sensor.repository.js - Sensor data access
import { getLatestReading, getReadingHistory, postSensorReading } from '../api/endpoints/sensors.api';
import { subscribeToLatestReading, subscribeToReadingHistory } from '../services/sensor.service';

export class SensorRepository {
  async getLatest(binId) {
    try {
      // Try REST API first
      return await getLatestReading(binId);
    } catch (error) {
      // Fallback to Firebase
      return new Promise((resolve) => {
        subscribeToLatestReading(binId, (data) => {
          resolve(data);
        });
      });
    }
  }

  async getHistory(binId, limit = 50) {
    try {
      return await getReadingHistory(binId, limit);
    } catch (error) {
      return new Promise((resolve) => {
        subscribeToReadingHistory(binId, limit, (data) => {
          resolve(data);
        });
      });
    }
  }

  async saveReading(binId, reading) {
    try {
      return await postSensorReading(binId, reading);
    } catch (error) {
      // Handle Firebase save if needed
      throw error;
    }
  }

  subscribeToUpdates(binId, callback) {
    // Use Firebase for real-time updates
    return subscribeToLatestReading(binId, callback);
  }
}

export const sensorRepository = new SensorRepository();