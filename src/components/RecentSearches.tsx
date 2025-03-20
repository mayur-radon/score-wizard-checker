
import { WebsiteMetrics } from "@/services/mozApi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Clock, Activity } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

interface RecentSearchesProps {
  searches: WebsiteMetrics[];
  onSelect: (url: string) => void;
  isLoading: boolean;
}

const RecentSearches = ({ searches, onSelect, isLoading }: RecentSearchesProps) => {
  const { user } = useAuth();
  
  if (searches.length === 0) {
    if (!user) return null;
    
    return (
      <div className="w-full max-w-3xl mx-auto mt-12 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <div className="text-center">
          <Clock className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">No Recent Searches</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Your search history will appear here after you analyze websites</p>
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
            <Link to="/register" className="text-indigo-600 hover:text-indigo-700">
              Register to save your search history
            </Link>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {searches.map((search, index) => {
          // Format domain for display
          const domain = search.url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
          
          // Format the date for display
          const checkDate = new Date(search.checkDate).toLocaleDateString();
          
          return (
            <Card 
              key={index} 
              className="p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700"
              onClick={() => !isLoading && onSelect(search.url)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{domain}</h3>
                  <p className="text-sm text-gray-500">{checkDate}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mr-1">DA:</span>
                    <span className="text-sm font-semibold bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded-md">
                      {search.domainAuthority}
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
    </div>
  );
};

export default RecentSearches;
