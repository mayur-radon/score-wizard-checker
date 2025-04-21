
// Mock MongoDB service for client-side use
import { WebsiteMetrics } from './mozApi';

// Define interfaces for data types
interface UserProfile {
  id: string;
  email: string;
  created_at: string;
}

interface SearchHistory {
  user_id: string;
  domain: string;
  domain_authority: number;
  page_authority: number;
  spam_score: number;
  backlinks_count: number;
  domain_age: string;
  url: string;
  check_date: string;
  created_at: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  author: string;
  created_at: string;
}

// In-memory storage for mock data
const mockDb = {
  users: [] as UserProfile[],
  searches: [] as SearchHistory[],
  blogPosts: [] as BlogPost[]
};

// Save search result to mock database
export async function saveSearchToMongo(
  userId: string | undefined,
  domain: string, 
  metrics: WebsiteMetrics
): Promise<void> {
  try {
    console.log("Saving search to mock MongoDB:", domain);
    
    mockDb.searches.push({
      user_id: userId || 'anonymous',
      domain: domain,
      domain_authority: metrics.domainAuthority,
      page_authority: metrics.pageAuthority,
      spam_score: metrics.spamScore,
      backlinks_count: metrics.backlinks,
      domain_age: metrics.domainAge,
      url: metrics.url,
      check_date: metrics.checkDate,
      created_at: new Date().toISOString()
    });
    
    console.log("Search saved to mock MongoDB successfully", mockDb.searches);
  } catch (error) {
    console.error("Error saving search to mock MongoDB:", error);
    throw error;
  }
}

// Get search history for a user
export async function getSearchHistoryFromMongo(userId: string): Promise<WebsiteMetrics[]> {
  try {
    console.log("Fetching search history from mock MongoDB for user:", userId);
    
    const results = mockDb.searches
      .filter(search => search.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    return results.map(item => ({
      url: item.url || `https://${item.domain}`,
      domainAuthority: item.domain_authority,
      pageAuthority: item.page_authority,
      spamScore: item.spam_score,
      backlinks: item.backlinks_count,
      domainAge: item.domain_age,
      checkDate: item.created_at
    }));
  } catch (error) {
    console.error("Error fetching search history from mock MongoDB:", error);
    return [];
  }
}

// Save user profile to mock MongoDB
export async function saveUserToMongo(userId: string, email: string) {
  try {
    console.log("Saving user to mock MongoDB:", userId);
    
    // Check if user already exists
    const existingUserIndex = mockDb.users.findIndex(user => user.id === userId);
    
    if (existingUserIndex === -1) {
      mockDb.users.push({
        id: userId,
        email: email,
        created_at: new Date().toISOString()
      });
      console.log("User saved to mock MongoDB successfully", mockDb.users);
    }
  } catch (error) {
    console.error("Error saving user to mock MongoDB:", error);
  }
}

// Get all users
export async function getAllUsersFromMongo() {
  try {
    console.log("Fetching all users from mock MongoDB");
    return [...mockDb.users].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  } catch (error) {
    console.error("Error fetching users from mock MongoDB:", error);
    return [];
  }
}

// Get all searches
export async function getAllSearchesFromMongo() {
  try {
    console.log("Fetching all searches from mock MongoDB");
    return [...mockDb.searches].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  } catch (error) {
    console.error("Error fetching searches from mock MongoDB:", error);
    return [];
  }
}

// Get all blog posts
export async function getBlogPostsFromMongo() {
  try {
    console.log("Fetching blog posts from mock MongoDB");
    
    // If no blog posts exist yet, create some sample ones
    if (mockDb.blogPosts.length === 0) {
      mockDb.blogPosts = [
        {
          id: '1',
          title: 'Understanding Domain Authority',
          slug: 'understanding-domain-authority',
          content: '<p>Domain Authority (DA) is a search engine ranking score that predicts how likely a website is to rank in search engine result pages (SERPs).</p>',
          author: 'Admin',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'How to Improve Your Website\'s SEO',
          slug: 'how-to-improve-your-websites-seo',
          content: '<p>Improving your website\'s SEO involves multiple strategies including quality content, good technical structure, and backlink building.</p>',
          author: 'Admin',
          created_at: new Date(Date.now() - 86400000).toISOString() // 1 day ago
        },
        {
          id: '3',
          title: 'The Importance of Backlinks',
          slug: 'the-importance-of-backlinks',
          content: '<p>Backlinks are a crucial factor in determining a website\'s authority and ranking in search results.</p>',
          author: 'Admin',
          created_at: new Date(Date.now() - 172800000).toISOString() // 2 days ago
        }
      ];
    }
    
    return [...mockDb.blogPosts].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  } catch (error) {
    console.error("Error fetching blog posts from mock MongoDB:", error);
    return [];
  }
}

// For compatibility with functions that expect the MongoDB client
export async function connectToMongo() {
  console.log("Mock connection to MongoDB established");
  return { close: () => console.log("Mock MongoDB connection closed") };
}
