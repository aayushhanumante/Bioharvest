// src/api/endpoints/alerts.api.js - Alerts endpoints
import { apiClient } from '../client';

export async function getAlerts(binId) {
  try {
    const response = await apiClient.get(`/alerts/${binId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function acknowledgeAlert(alertId) {
  try {
    const response = await apiClient.put(`/alerts/${alertId}/acknowledge`);
    return response.data;
  } catch (error) {
    throw error;
  }
}