
import { WebsiteMetrics } from './mozApi';

// For demonstration purposes, we're using localStorage as our "database"
// In a real application, this would connect to a proper backend database

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
