
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Search, Globe, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SearchFormProps {
  onSearch: (url: string) => void;
  isLoading: boolean;
}

const SearchForm = ({ onSearch, isLoading }: SearchFormProps) => {
  const [url, setUrl] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a URL",
        variant: "destructive",
      });
      return;
    }

    // Add http:// if not present
    let processedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      processedUrl = `https://${url}`;
    }
    
    // Log for debugging
    console.log("Submitting search for URL:", processedUrl);
    
    onSearch(processedUrl);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
          Check Your Website's Authority Instantly
        </h1>
        <p className="text-xl text-white/80 mb-2">
          Get DA, PA, Spam Score & More for Free
        </p>
        <div className="flex items-center justify-center text-white/70 text-sm">
          <span>3 searches per day</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 ml-1" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>All users are limited to 3 searches per day. Create an account to track your search history.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <form 
        onSubmit={handleSubmit} 
        className="w-full sticky top-4 z-10"
      >
        <div className="flex items-center space-x-2 bg-white/20 p-3 rounded-xl backdrop-blur-md shadow-lg">
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Globe className="w-5 h-5" />
            </div>
            <Input
              type="text"
              placeholder="Enter website URL (e.g., example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="pl-12 pr-4 py-6 text-lg rounded-lg border-2 border-transparent bg-white/95 dark:bg-gray-900/95 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-200/50 dark:focus:ring-indigo-800/50 shadow-lg"
            />
          </div>
          <Button 
            type="submit" 
            size="lg"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-7 px-8 rounded-lg font-medium transition-all duration-300 ease-in-out shadow-md hover:shadow-lg hover:scale-105"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                <span>Analyzing...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Search className="w-5 h-5" />
                <span>Check Now</span>
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
