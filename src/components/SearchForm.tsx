
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Search } from "lucide-react";

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
    
    onSearch(processedUrl);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="w-full max-w-3xl mx-auto"
    >
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Enter website URL (e.g., example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="pl-4 pr-12 py-6 text-lg rounded-lg border-2 border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          />
        </div>
        <Button 
          type="submit" 
          size="lg"
          className="bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-700 hover:to-purple-700 text-white py-6 px-8 rounded-lg font-medium transition-all duration-300 ease-in-out shadow-md hover:shadow-lg"
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
              <span>Analyze</span>
            </div>
          )}
        </Button>
      </div>
    </form>
  );
};

export default SearchForm;
