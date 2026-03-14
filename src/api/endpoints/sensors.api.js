// src/api/endpoints/sensors.api.js - Sensor data endpoints
import { apiClient } from '../client';

export async function getLatestReading(binId) {
  try {
    const response = await apiClient.get(`/sensors/${binId}/latest`);
    return response.data;
  } catch (error) {
    // Fallback to Firebase if REST fails
    throw error;
  }
}

export async function getReadingHistory(binId, limit = 50) {
  try {
    const response = await apiClient.get(`/sensors/${binId}/history`, { limit });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function postSensorReading(binId, reading) {
  try {
    const response = await apiClient.post(`/sensors/${binId}/reading`, reading);
    return response.data;
  } catch (error) {
    throw error;
  }
}