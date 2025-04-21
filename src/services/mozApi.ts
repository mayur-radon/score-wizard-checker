
import { supabase } from '@/integrations/supabase/client';

// Types
export interface WebsiteMetrics {
  url: string;
  domainAuthority: number;
  pageAuthority: number;
  spamScore: number;
  backlinks: number;  // Changed from backlinksCount to backlinks
  domainAge: string;  // Changed from number to string
  checkDate: string;
}

// Add a function to check user's daily search limit
export const checkDailySearchLimit = async (userId: string): Promise<boolean> => {
  if (!userId) return true; // Allow non-logged in users to search

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { data, error, count } = await supabase
      .from('search_history')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .gte('created_at', today.toISOString());
    
    if (error) {
      console.error('Error checking search limit:', error);
      return false;
    }
    
    console.log(`User ${userId} has made ${count} searches today`);
    return count !== null && count < 3; // Allow if less than 3 searches today
  } catch (error) {
    console.error('Error in checkDailySearchLimit:', error);
    return false;
  }
};

// Function to fetch website metrics
export const fetchWebsiteMetrics = async (url: string): Promise<WebsiteMetrics> => {
  const user = supabase.auth.getUser();
  const userId = (await user).data.user?.id;
  
  if (userId) {
    const canSearch = await checkDailySearchLimit(userId);
    if (!canSearch) {
      throw new Error("Daily search limit reached (3 searches per day). Please try again tomorrow.");
    }
  }
  
  // Basic validation of URL format
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    throw new Error("Invalid URL format. Please include 'http://' or 'https://'.");
  }

  // Extract domain from URL
  const domain = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');

  // Mock data generation (replace with actual API call later)
  const mockData = {
    domainAuthority: Math.floor(Math.random() * 100) + 1, // 1-100
    pageAuthority: Math.floor(Math.random() * 100) + 1, // 1-100
    spamScore: Math.floor(Math.random() * 10), // 0-10
    backlinks: Math.floor(Math.random() * 10000), // Changed from backlinksCount to backlinks
    domainAge: Math.floor(Math.random() * 20) + 1 + " years" // Changed to return a string
  };
  
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Save search to history if user is logged in
    if (userId) {
      console.log("Saving search to history for user:", userId);
      await supabase.from('search_history').insert({
        user_id: userId,
        domain: domain,
        domain_authority: mockData.domainAuthority,
        page_authority: mockData.pageAuthority,
        spam_score: mockData.spamScore,
        backlinks_count: mockData.backlinks,
        domain_age: mockData.domainAge
      });
    }

    // Return mock data
    return {
      url: url,
      domainAuthority: mockData.domainAuthority,
      pageAuthority: mockData.pageAuthority,
      spamScore: mockData.spamScore,
      backlinks: mockData.backlinks,
      domainAge: mockData.domainAge,
      checkDate: new Date().toISOString()
    };
  } catch (error: any) {
    console.error("Error fetching website metrics:", error);
    throw new Error(error.message || "Failed to fetch website metrics");
  }
};

// Function to get recent results from local storage
export const getSearchHistory = async (): Promise<WebsiteMetrics[]> => {
  const user = supabase.auth.getUser();
  const userId = (await user).data.user?.id;
  
  if (!userId) {
    console.log("No user logged in, returning empty search history");
    return [];
  }
  
  try {
    console.log("Fetching search history for user:", userId);
    const { data, error } = await supabase
      .from('search_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching search history:", error);
      return [];
    }
    
    console.log("Retrieved search history:", data?.length || 0, "items");
    
    // Convert the database records to WebsiteMetrics format
    return (data || []).map(item => ({
      url: `https://${item.domain}`,
      domainAuthority: item.domain_authority,
      pageAuthority: item.page_authority,
      spamScore: item.spam_score,
      backlinks: item.backlinks_count,  // Changed to match the new interface
      domainAge: item.domain_age,
      checkDate: item.created_at
    }));
  } catch (error) {
    console.error("Error in getSearchHistory:", error);
    return [];
  }
};

// Function to clear local storage
export const clearSearchHistory = (): void => {
  localStorage.removeItem('recentSearches');
};
