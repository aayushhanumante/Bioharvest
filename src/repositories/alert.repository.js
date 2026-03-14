// src/repositories/alert.repository.js - Alert data access
import { getAlerts, acknowledgeAlert } from '../api/endpoints/alerts.api';
import { subscribeToAlerts } from '../services/sensor.service';

export class AlertRepository {
  async getAll(binId) {
    try {
      return await getAlerts(binId);
    } catch (error) {
      return new Promise((resolve) => {
        subscribeToAlerts((data) => {
          resolve(data.filter(alert => alert.bin_id === binId));
        });
      });
    }
  }

  async acknowledge(alertId) {
    try {
      return await acknowledgeAlert(alertId);
    } catch (error) {
      // Handle Firebase update
      throw error;
    }
  }

  subscribeToUpdates(callback) {
    return subscribeToAlerts(callback);
  }
}

export const alertRepository = new AlertRepository();