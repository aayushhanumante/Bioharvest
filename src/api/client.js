// src/api/client.js - Base HTTP client for API abstraction
import axios from 'axios';

export class ApiClient {
  constructor(config = {}) {
    this.client = axios.create({
      baseURL: config.baseURL || process.env.EXPO_PUBLIC_API_URL,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request/response interceptors
    this.client.interceptors.request.use(
      (config) => {
        // Add auth headers if needed
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle errors globally
        return Promise.reject(error);
      }
    );
  }

  async get(path, params = {}) {
    return this.client.get(path, { params });
  }

  async post(path, data = {}) {
    return this.client.post(path, data);
  }

  async put(path, data = {}) {
    return this.client.put(path, data);
  }

  async delete(path) {
    return this.client.delete(path);
  }
}

export const apiClient = new ApiClient();