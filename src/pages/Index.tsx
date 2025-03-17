
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchForm from "@/components/SearchForm";
import ResultsDisplay from "@/components/ResultsDisplay";
import RecentSearches from "@/components/RecentSearches";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import UserProfile from "@/components/UserProfile";
import { WebsiteMetrics, fetchWebsiteMetrics } from "@/services/mozApi";
import { saveResultToDatabase, getRecentResults } from "@/services/dbService";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Database, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [metrics, setMetrics] = useState<WebsiteMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<WebsiteMetrics[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    // Load recent searches on component mount
    setRecentSearches(getRecentResults());
  }, []);

  const handleSearch = async (url: string) => {
    setIsLoading(true);
    setMetrics(null);
    
    try {
      const result = await fetchWebsiteMetrics(url);
      setMetrics(result);
      
      // Save to database
      saveResultToDatabase(result);
      
      // Update recent searches
      setRecentSearches(getRecentResults());
      
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-16">
      <header className="w-full gradient-bg py-6 mb-8">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Database className="w-10 h-10 text-white mr-3" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">Moz DA PA Checker</h1>
            </div>
            <div>
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
                  <Button asChild className="bg-white text-brand-600 hover:bg-white/90">
                    <Link to="/register">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Register
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
          <p className="text-center text-white/80 max-w-3xl mx-auto mb-8">
            Analyze website metrics including Domain Authority, Page Authority, Spam Score, Backlinks, and Domain Age - all in one place.
          </p>
          <SearchForm onSearch={handleSearch} isLoading={isLoading} />
        </div>
      </header>
      
      <main className="container px-4 mx-auto">
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          metrics && <ResultsDisplay metrics={metrics} />
        )}
        
        {!isLoading && !metrics && (
          <div className="text-center py-8">
            <h2 className="text-xl text-gray-600 dark:text-gray-400">
              Enter a website URL above to analyze its SEO metrics
            </h2>
          </div>
        )}
        
        {!isLoading && (
          <RecentSearches 
            searches={recentSearches} 
            onSelect={handleSearch}
            isLoading={isLoading}
          />
        )}
      </main>
      
      <footer className="mt-16 py-6 border-t border-gray-200 dark:border-gray-800">
        <div className="container px-4 mx-auto">
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            Moz DA PA Checker - Analyze website metrics with ease
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
