
import { WebsiteMetrics } from "@/services/mozApi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Clock, Activity, Globe, BarChart3, ExternalLink } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { useEffect } from "react";

interface RecentSearchesProps {
  searches: WebsiteMetrics[];
  onSelect: (url: string) => void;
  isLoading: boolean;
}

const RecentSearches = ({ searches, onSelect, isLoading }: RecentSearchesProps) => {
  const { user } = useAuth();
  
  useEffect(() => {
    // Log for debugging
    console.log("RecentSearches component - User logged in:", !!user);
    console.log("RecentSearches component - Searches count:", searches.length);
  }, [user, searches]);
  
  if (searches.length === 0) {
    if (!user) return null;
    
    return (
      <div className="w-full max-w-3xl mx-auto mt-12 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <div className="text-center">
          <Clock className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">No Recent Searches</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Your search history will appear here after you analyze websites</p>
          <p className="text-sm text-gray-500">Free users are limited to 3 searches per day</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Activity className="w-5 h-5 text-indigo-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Recent Searches</h2>
        </div>
        {!user && (
          <div className="text-sm">
            <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Register to save your search history
            </Link>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {searches.map((search, index) => {
          // Format domain for display
          const domain = search.url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
          
          // Format the date for display
          const checkDate = new Date(search.checkDate).toLocaleDateString();
          
          return (
            <Card 
              key={index} 
              className="p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 animate-fade-in"
              onClick={() => !isLoading && onSelect(search.url)}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="flex items-center mb-3 md:mb-0">
                  <div className="bg-indigo-100 dark:bg-indigo-900/40 p-2 rounded-full mr-3">
                    <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-medium text-gray-900 dark:text-white">{domain}</h3>
                      <a href={search.url} target="_blank" rel="noopener noreferrer" className="ml-1 text-gray-400 hover:text-indigo-600 transition-colors">
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <p className="text-sm text-gray-500">{checkDate}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 ml-9 md:ml-0">
                  <div className="flex items-center space-x-2">
                    <span className="flex items-center bg-indigo-100 dark:bg-indigo-900/40 px-3 py-1 rounded-full">
                      <BarChart3 className="w-3 h-3 text-indigo-600 dark:text-indigo-400 mr-1" />
                      <span className="text-sm font-medium text-indigo-800 dark:text-indigo-200">
                        DA: {search.domainAuthority}
                      </span>
                    </span>
                    <span className="flex items-center bg-blue-100 dark:bg-blue-900/40 px-3 py-1 rounded-full">
                      <BarChart3 className="w-3 h-3 text-blue-600 dark:text-blue-400 mr-1" />
                      <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        PA: {search.pageAuthority}
                      </span>
                    </span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950"
                    disabled={isLoading}
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      
      {/* Lead generation for non-logged in users */}
      {!user && searches.length > 0 && (
        <div className="mt-8 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-lg border border-indigo-100 dark:border-indigo-700/30 text-center">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Want to save your search history?</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-3">Create a free account to unlock additional features.</p>
          <Link to="/register">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Sign Up Free
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default RecentSearches;
