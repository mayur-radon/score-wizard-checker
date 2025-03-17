
import { WebsiteMetrics } from "@/services/mozApi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface RecentSearchesProps {
  searches: WebsiteMetrics[];
  onSelect: (url: string) => void;
  isLoading: boolean;
}

const RecentSearches = ({ searches, onSelect, isLoading }: RecentSearchesProps) => {
  if (searches.length === 0) return null;

  return (
    <div className="w-full max-w-3xl mx-auto mt-8">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Recent Searches</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {searches.map((search, index) => {
          // Format domain for display
          const domain = search.url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
          
          // Format the date for display
          const checkDate = new Date(search.checkDate).toLocaleDateString();
          
          return (
            <Card 
              key={index} 
              className="p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer border border-gray-200 dark:border-gray-700"
              onClick={() => !isLoading && onSelect(search.url)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{domain}</h3>
                  <p className="text-sm text-gray-500">{checkDate}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-sm font-medium text-brand-600">DA: {search.domainAuthority}</div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-gray-500 hover:text-brand-600"
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
