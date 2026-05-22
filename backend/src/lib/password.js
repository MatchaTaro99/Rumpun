import bcrypt from 'bcryptjs';
import { HttpError } from './errors.js';

export function validatePassword(password) {
  if (typeof password !== 'string' || password.trim().length < 8) {
    throw new HttpError(400, 'Password harus memiliki minimal 8 karakter.');
  }
}

export async function hashPassword(password) {
  validatePassword(password);
  return bcrypt.hash(password, 10);
}

export function comparePassword(password, passwordHash) {
  if (typeof password !== 'string' || typeof passwordHash !== 'string') {
    return false;
  }

  return bcrypt.compare(password, passwordHash);
}

