
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Define the structure of website metrics
export interface WebsiteMetrics {
  url: string;
  domainAuthority: number;
  pageAuthority: number;
  spamScore: number;
  backlinks: number;
  domainAge: string;
  checkDate: string;
}

// WhoisXML API key
const WHOISXML_API_KEY = "at_hbwlV7bh0JlEzBBNU3NePAEMvFu7k";

export const fetchWebsiteMetrics = async (url: string): Promise<WebsiteMetrics> => {
  // Validate URL format
  if (!url.match(/^(http|https):\/\/[a-zA-Z0-9][-a-zA-Z0-9.]*\.[a-zA-Z]{2,}(\/.*)?$/)) {
    throw new Error("Invalid URL format. Please enter a valid URL (e.g., https://example.com)");
  }

  try {
    // Extract domain from URL
    const domain = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    
    // Fetch domain age using WhoisXML API
    const domainAge = await fetchDomainAge(domain);
    
    // In a real implementation, we would make an API call to Moz's API
    // For demonstration, we're simulating a response
    
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate realistic but random metrics
    const domainAuthority = Math.floor(Math.random() * 100);
    const pageAuthority = Math.floor(Math.random() * 100);
    const spamScore = Math.floor(Math.random() * 15);
    const backlinks = Math.floor(Math.random() * 10000) + 1;
    
    // Current date for the check
    const checkDate = new Date().toISOString();
    
    const result = {
      url,
      domainAuthority,
      pageAuthority,
      spamScore,
      backlinks,
      domainAge,
      checkDate
    };
    
    // Save to Supabase if user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      await supabase.from('search_history').insert({
        user_id: user.id,
        domain: domain,
        domain_authority: domainAuthority,
        page_authority: pageAuthority,
        spam_score: spamScore,
        backlinks_count: backlinks,
        domain_age: domainAge
      });
    }
    
    return result;
  } catch (error) {
    console.error("Error fetching website metrics:", error);
    toast({
      title: "Error",
      description: "Failed to fetch website metrics. Please try again.",
      variant: "destructive",
    });
    throw new Error("Failed to fetch website metrics");
  }
};

const fetchDomainAge = async (domain: string): Promise<string> => {
  try {
    const response = await fetch(`https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${WHOISXML_API_KEY}&domainName=${domain}&outputFormat=JSON`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch domain information');
    }
    
    const data = await response.json();
    
    // Extract creation date from WhoisXML API response
    const creationDate = data.WhoisRecord?.createdDate || data.WhoisRecord?.registryData?.createdDate;
    
    if (creationDate) {
      const domainCreationDate = new Date(creationDate);
      const currentDate = new Date();
      
      // Calculate years difference
      const yearsDiff = currentDate.getFullYear() - domainCreationDate.getFullYear();
      
      // Calculate months difference if less than a year
      if (yearsDiff < 1) {
        const monthsDiff = currentDate.getMonth() - domainCreationDate.getMonth() + 
                           (12 * (currentDate.getFullYear() - domainCreationDate.getFullYear()));
        return `${monthsDiff} months`;
      }
      
      return `${yearsDiff} years`;
    }
    
    return "Unknown";
  } catch (error) {
    console.error("Error fetching domain age:", error);
    return "Unknown";
  }
};

// Function to get search history from Supabase
export const getSearchHistory = async (): Promise<WebsiteMetrics[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('search_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
      
    if (error) {
      console.error("Error fetching search history:", error);
      return [];
    }
    
    return data.map(item => ({
      url: `https://${item.domain}`,
      domainAuthority: Number(item.domain_authority),
      pageAuthority: Number(item.page_authority),
      spamScore: Number(item.spam_score),
      backlinks: Number(item.backlinks_count),
      domainAge: item.domain_age,
      checkDate: item.created_at
    }));
  } catch (error) {
    console.error("Error fetching search history:", error);
    return [];
  }
};
