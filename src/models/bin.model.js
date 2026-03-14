// src/models/bin.model.js - Bin models
export const BinSchema = {
  id: 'string',
  name: 'string',
  location: 'string',
  capacity: 'number',
  status: ['active', 'inactive', 'maintenance']
};

export const validateBin = (data) => {
  const errors = [];
  if (typeof data.id !== 'string') errors.push('id must be a string');
  if (typeof data.name !== 'string') errors.push('name must be a string');
  if (typeof data.location !== 'string') errors.push('location must be a string');
  if (typeof data.capacity !== 'number') errors.push('capacity must be a number');
  if (!BinSchema.status.includes(data.status)) {
    errors.push('status must be active, inactive, or maintenance');
  }
  return errors;
};

export class Bin {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.location = data.location;
    this.capacity = data.capacity;
    this.status = data.status;
  }
}