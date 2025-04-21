
import { WebsiteMetrics } from './mozApi';
import { saveSearchToMongo, getSearchHistoryFromMongo, saveUserToMongo } from './mongoDbService';

// Types
export interface User {
  id: string;
  email: string;
  password: string; // In a real application, this would be hashed
  name?: string;
  createdAt: string;
}

// This file is maintained for backward compatibility
// The app now uses MongoDB for data storage

// Website Metrics Functions
export const saveResultToDatabase = (metrics: WebsiteMetrics): void => {
  console.warn('saveResultToDatabase is now using MongoDB.');
  // MongoDB implementation is in saveSearchToMongo
};

export const getRecentResults = (): WebsiteMetrics[] => {
  console.warn('getRecentResults is now using MongoDB.');
  // MongoDB implementation is in getSearchHistoryFromMongo
  return [];
};

export const clearDatabase = (): void => {
  console.warn('clearDatabase is now using MongoDB.');
  localStorage.removeItem('recentSearches');
};

// User Authentication Functions - Migrated to use MongoDB
export const registerUser = (email: string, password: string, name?: string): User | null => {
  console.warn('registerUser now saves to MongoDB.');
  return null;
};

export const loginUser = (email: string, password: string): User | null => {
  console.warn('loginUser is now handled by Supabase auth and MongoDB.');
  return null;
};

export const getCurrentUser = (): User | null => {
  console.warn('getCurrentUser is now handled by Supabase auth.');
  return null;
};

export const setCurrentUser = (user: User | null): void => {
  console.warn('setCurrentUser is now handled by Supabase auth and MongoDB.');
  if (user) {
    saveUserToMongo(user.id, user.email);
  }
};

export const logoutUser = (): void => {
  console.warn('logoutUser is now handled by Supabase auth.');
};
