
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchForm from "@/components/SearchForm";
import ResultsDisplay from "@/components/ResultsDisplay";
import RecentSearches from "@/components/RecentSearches";
import RecentBlogPosts from "@/components/RecentBlogPosts";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import UserProfile from "@/components/UserProfile";
import HomeContent from "@/components/HomeContent";
import { WebsiteMetrics, fetchWebsiteMetrics, getSearchHistory } from "@/services/mozApi";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Database, LogIn, UserPlus, Zap, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "next-themes";

const Index = () => {
  const [metrics, setMetrics] = useState<WebsiteMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<WebsiteMetrics[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  // Create profile for user if it doesn't exist
  useEffect(() => {
    const createProfileIfNeeded = async () => {
      if (user) {
        console.log("Checking profile for user:", user.id);
        
        // Check if profile exists
        const { data: existingProfile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError && profileError.code !== 'PGRST116') {
          console.error("Error checking profile:", profileError);
        }
        
        // If profile doesn't exist, create it
        if (!existingProfile) {
          console.log("Creating profile for user:", user.id);
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email
            });
            
          if (insertError) {
            console.error("Error creating profile:", insertError);
          } else {
            console.log("Profile created successfully");
          }
        } else {
          console.log("Profile already exists");
        }
      }
    };
    
    createProfileIfNeeded();
  }, [user]);

  useEffect(() => {
    // Load search history on component mount and when user changes
    const loadSearchHistory = async () => {
      if (user) {
        console.log("Loading search history for user:", user.id);
        const history = await getSearchHistory();
        console.log("Retrieved search history:", history);
        setRecentSearches(history);
      } else {
        console.log("No user logged in, not loading search history");
        setRecentSearches([]);
      }
    };
    
    loadSearchHistory();
  }, [user]);

  const handleSearch = async (url: string) => {
    setIsLoading(true);
    setMetrics(null);
    
    try {
      console.log("Initiating search for URL:", url);
      const result = await fetchWebsiteMetrics(url);
      console.log("Search results:", result);
      setMetrics(result);
      
      // Update recent searches
      if (user) {
        console.log("Refreshing search history after new search");
        const history = await getSearchHistory();
        setRecentSearches(history);
      }
      
      toast({
        title: "Analysis Complete",
        description: `We've analyzed ${url.replace(/^https?:\/\//, '')}`,
      });
    } catch (error) {
      console.error("Error during search:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze website",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 pb-16">
      <header className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 py-6 mb-8 shadow-lg relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-10 -top-10 w-64 h-64 rounded-full bg-white"></div>
          <div className="absolute right-0 bottom-0 w-96 h-96 rounded-full bg-white"></div>
        </div>
        
        <div className="container px-4 mx-auto relative z-10">
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center group">
              <Database className="w-10 h-10 text-white mr-3 group-hover:scale-110 transition-transform" />
              <h1 className="text-3xl md:text-4xl font-bold text-white group-hover:text-gray-100">Moz DA PA Checker</h1>
            </Link>
            <div className="flex items-center gap-4">
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Toggle dark mode"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              {user ? (
                <UserProfile />
              ) : (
                <div className="flex gap-2">
                  <Button asChild variant="outline" className="text-white border-white hover:bg-white/10">
                    <Link to="/login">
                      <LogIn className="w-4 h-4 mr-2" />
                      Login
                    </Link>
                  </Button>
                  <Button asChild className="bg-white text-indigo-600 hover:bg-white/90">
                    <Link to="/register">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Register
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <SearchForm onSearch={handleSearch} isLoading={isLoading} />
        </div>
      </header>
      
      {!isLoading && !metrics && (
        <div className="container mx-auto px-4 py-8">
          {/* Recent Blog Posts Section */}
          <RecentBlogPosts />
          
          <HomeContent />
          
          {/* Only show "Get Started" banner for non-logged in users */}
          {!user && (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 p-8 rounded-2xl shadow-inner mb-12">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    Create an Account for Free
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Sign up to save your search history, track website performance over time, and get access to premium features.
                  </p>
                  <Button asChild className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:translate-y-[-2px]">
                    <Link to="/register">
                      <Zap className="w-5 h-5 mr-2" />
                      Get Started Now
                    </Link>
                  </Button>
                </div>
                <div className="md:w-1/3">
                  <img 
                    src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="Analytics dashboard" 
                    className="rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      <main className="container px-4 mx-auto">
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          metrics && <ResultsDisplay metrics={metrics} />
        )}
        
        {!isLoading && (
          <RecentSearches 
            searches={recentSearches} 
            onSelect={handleSearch}
            isLoading={isLoading}
          />
        )}
      </main>
      
      {/* Sticky Lead Generation Banner for non-logged in users */}
      {!user && !isLoading && metrics && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700 p-3 z-20 animate-fade-in">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <p className="text-gray-700 dark:text-gray-300 mb-3 sm:mb-0">
                <span className="font-semibold">Unlock Premium Features:</span> Weekly monitoring, bulk checks, and more!
              </p>
              <Link to="/register">
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto">
                  Sign Up Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
      
      <footer className="mt-16 py-6 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Link to="/" className="flex items-center">
                <Database className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mr-2" />
                <span className="font-semibold text-gray-700 dark:text-gray-300">Moz DA PA Checker</span>
              </Link>
            </div>
            <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} Moz DA PA Checker - Analyze website metrics with ease
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Terms
              </a>
              <a href="#" className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Privacy
              </a>
              <a href="#" className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
