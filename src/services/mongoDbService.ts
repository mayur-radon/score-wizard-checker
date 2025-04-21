
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import { WebsiteMetrics } from './mozApi';

// MongoDB connection string
const uri = "mongodb+srv://mayur-radon:mayur%233010@cluster0.vfxldsx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Database and collection names
const DB_NAME = 'dapachecker';
const COLLECTIONS = {
  searchHistory: 'search_history',
  users: 'profiles',
  blogPosts: 'blog_posts'
};

// Connect to MongoDB
export async function connectToMongo() {
  try {
    await client.connect();
    console.log("Successfully connected to MongoDB Atlas");
    return client;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

// Save search result to database
export async function saveSearchToMongo(
  userId: string | undefined,
  domain: string, 
  metrics: WebsiteMetrics
): Promise<void> {
  try {
    await connectToMongo();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTIONS.searchHistory);
    
    await collection.insertOne({
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
    
    console.log("Search saved to MongoDB successfully");
  } catch (error) {
    console.error("Error saving search to MongoDB:", error);
    throw error;
  } finally {
    await client.close();
  }
}

// Get search history for a user
export async function getSearchHistoryFromMongo(userId: string): Promise<WebsiteMetrics[]> {
  try {
    await connectToMongo();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTIONS.searchHistory);
    
    const results = await collection.find({ user_id: userId })
      .sort({ created_at: -1 })
      .toArray();
    
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
    console.error("Error fetching search history from MongoDB:", error);
    return [];
  } finally {
    await client.close();
  }
}

// Get all users
export async function getAllUsersFromMongo() {
  try {
    await connectToMongo();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTIONS.users);
    
    return await collection.find().sort({ created_at: -1 }).toArray();
  } catch (error) {
    console.error("Error fetching users from MongoDB:", error);
    return [];
  } finally {
    await client.close();
  }
}

// Get all searches
export async function getAllSearchesFromMongo() {
  try {
    await connectToMongo();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTIONS.searchHistory);
    
    return await collection.find().sort({ created_at: -1 }).toArray();
  } catch (error) {
    console.error("Error fetching searches from MongoDB:", error);
    return [];
  } finally {
    await client.close();
  }
}

// Save user profile to MongoDB
export async function saveUserToMongo(userId: string, email: string) {
  try {
    await connectToMongo();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTIONS.users);
    
    // Check if user already exists
    const existingUser = await collection.findOne({ id: userId });
    
    if (!existingUser) {
      await collection.insertOne({
        id: userId,
        email: email,
        created_at: new Date().toISOString()
      });
      console.log("User saved to MongoDB successfully");
    }
  } catch (error) {
    console.error("Error saving user to MongoDB:", error);
  } finally {
    await client.close();
  }
}

// Get all blog posts
export async function getBlogPostsFromMongo() {
  try {
    await connectToMongo();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTIONS.blogPosts);
    
    return await collection.find().sort({ created_at: -1 }).toArray();
  } catch (error) {
    console.error("Error fetching blog posts from MongoDB:", error);
    return [];
  } finally {
    await client.close();
  }
}
