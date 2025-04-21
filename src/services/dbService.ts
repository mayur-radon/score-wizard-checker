
import { WebsiteMetrics } from './mozApi';

// Types
export interface User {
  id: string;
  email: string;
  password: string; // In a real application, this would be hashed
  name?: string;
  createdAt: string;
}

// This file is maintained for backward compatibility
// The app now uses Supabase for authentication and data storage
// These functions are deprecated but kept for reference

// Website Metrics Functions
export const saveResultToDatabase = (metrics: WebsiteMetrics): void => {
  console.warn('saveResultToDatabase is deprecated. Use Supabase instead.');
};

export const getRecentResults = (): WebsiteMetrics[] => {
  console.warn('getRecentResults is deprecated. Use Supabase instead.');
  return [];
};

export const clearDatabase = (): void => {
  console.warn('clearDatabase is deprecated. Use Supabase instead.');
};

// User Authentication Functions - Deprecated
export const registerUser = (email: string, password: string, name?: string): User | null => {
  console.warn('registerUser is deprecated. Use Supabase auth instead.');
  return null;
};

export const loginUser = (email: string, password: string): User | null => {
  console.warn('loginUser is deprecated. Use Supabase auth instead.');
  return null;
};

export const getCurrentUser = (): User | null => {
  console.warn('getCurrentUser is deprecated. Use Supabase auth instead.');
  return null;
};

export const setCurrentUser = (user: User | null): void => {
  console.warn('setCurrentUser is deprecated. Use Supabase auth instead.');
};

export const logoutUser = (): void => {
  console.warn('logoutUser is deprecated. Use Supabase auth instead.');
};
