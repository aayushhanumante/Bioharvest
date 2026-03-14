// src/utils/transformers.js - Data transformation utilities
export const transformSensorReading = (apiData) => {
  return {
    ppm: apiData.ppm,
    temperature: apiData.temperature,
    humidity: apiData.humidity,
    timestamp: apiData.timestamp,
    sensor_status: apiData.sensor_status || 'active',
  };
};

export const transformAlert = (apiData) => {
  return {
    id: apiData.id,
    bin_id: apiData.bin_id,
    type: apiData.type,
    message: apiData.message,
    timestamp: apiData.timestamp,
    acknowledged: apiData.acknowledged || false,
  };
};