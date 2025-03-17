
import { Card } from "@/components/ui/card";

const LoadingSkeleton = () => {
  return (
    <div className="w-full max-w-5xl mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <div className="h-7 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse-slow"></div>
          <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded mt-2 animate-pulse-slow"></div>
        </div>
        <div className="flex space-x-2">
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse-slow"></div>
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse-slow"></div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map(index => (
          <Card key={index} className="metric-card">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse-slow"></div>
            <div className="h-10 w-16 bg-gray-200 dark:bg-gray-700 rounded mt-2 animate-pulse-slow"></div>
            <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded mt-2 animate-pulse-slow"></div>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {[1, 2].map(index => (
          <Card key={index} className="metric-card">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse-slow"></div>
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded mt-2 animate-pulse-slow"></div>
            <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded mt-2 animate-pulse-slow"></div>
          </Card>
        ))}
      </div>
      
      <div className="h-80 w-full bg-gray-100 dark:bg-gray-700 rounded animate-pulse-slow mb-4"></div>
      
      <div className="h-px w-full bg-gray-200 dark:bg-gray-700 my-4"></div>
      <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse-slow"></div>
    </div>
  );
};

export default LoadingSkeleton;
