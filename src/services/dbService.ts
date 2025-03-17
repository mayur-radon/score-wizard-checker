
import { WebsiteMetrics } from './mozApi';

// Types
export interface User {
  id: string;
  email: string;
  password: string; // In a real application, this would be hashed
  name?: string;
  createdAt: string;
}

// For demonstration purposes, we're using localStorage as our "database"
// In a real application, this would connect to a proper backend database

// Website Metrics Functions
export const saveResultToDatabase = (metrics: WebsiteMetrics): void => {
  try {
    // Get existing results
    const existingResults = localStorage.getItem('website_metrics');
    let resultsArray: WebsiteMetrics[] = [];
    
    if (existingResults) {
      resultsArray = JSON.parse(existingResults);
    }
    
    // Add new result
    resultsArray.push(metrics);
    
    // Save back to localStorage
    localStorage.setItem('website_metrics', JSON.stringify(resultsArray));
    
    console.log('Metrics saved to database:', metrics);
  } catch (error) {
    console.error('Error saving to database:', error);
  }
};

export const getRecentResults = (): WebsiteMetrics[] => {
  try {
    const existingResults = localStorage.getItem('website_metrics');
    if (!existingResults) return [];
    
    const resultsArray: WebsiteMetrics[] = JSON.parse(existingResults);
    
    // Sort by most recent first
    return resultsArray.sort((a, b) => {
      return new Date(b.checkDate).getTime() - new Date(a.checkDate).getTime();
    }).slice(0, 10); // Get most recent 10 results
  } catch (error) {
    console.error('Error retrieving from database:', error);
    return [];
  }
};

export const clearDatabase = (): void => {
  localStorage.removeItem('website_metrics');
};

// User Authentication Functions
export const registerUser = (email: string, password: string, name?: string): User | null => {
  try {
    // Check if user already exists
    const existingUsers = localStorage.getItem('users');
    let users: User[] = [];
    
    if (existingUsers) {
      users = JSON.parse(existingUsers);
      const existingUser = users.find(user => user.email.toLowerCase() === email.toLowerCase());
      
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
    }
    
    // Create new user
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      password, // In a real app, you would hash this password
      name,
      createdAt: new Date().toISOString()
    };
    
    // Add to users array
    users.push(newUser);
    
    // Save back to localStorage
    localStorage.setItem('users', JSON.stringify(users));
    
    // Return the new user (without password in a real app)
    return newUser;
  } catch (error) {
    console.error('Error registering user:', error);
    return null;
  }
};

export const loginUser = (email: string, password: string): User | null => {
  try {
    const existingUsers = localStorage.getItem('users');
    
    if (!existingUsers) return null;
    
    const users: User[] = JSON.parse(existingUsers);
    const user = users.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.password === password
    );
    
    return user || null;
  } catch (error) {
    console.error('Error logging in:', error);
    return null;
  }
};

export const getCurrentUser = (): User | null => {
  try {
    const currentUserJson = localStorage.getItem('current_user');
    
    if (!currentUserJson) return null;
    
    return JSON.parse(currentUserJson);
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const setCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem('current_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('current_user');
  }
};

export const logoutUser = (): void => {
  localStorage.removeItem('current_user');
};
