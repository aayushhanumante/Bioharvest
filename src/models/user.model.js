// src/models/user.model.js - User models
export const UserSchema = {
  id: 'string',
  email: 'string',
  name: 'string',
  role: ['admin', 'user', 'viewer']
};

export const validateUser = (data) => {
  const errors = [];
  if (typeof data.id !== 'string') errors.push('id must be a string');
  if (typeof data.email !== 'string') errors.push('email must be a string');
  if (typeof data.name !== 'string') errors.push('name must be a string');
  if (!UserSchema.role.includes(data.role)) {
    errors.push('role must be admin, user, or viewer');
  }
  return errors;
};

export class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.name = data.name;
    this.role = data.role;
  }
}