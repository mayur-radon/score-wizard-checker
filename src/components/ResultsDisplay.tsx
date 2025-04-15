
import React, { useRef } from 'react';
import { WebsiteMetrics } from "@/services/mozApi";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  AlertTriangle, 
  Link2, 
  Calendar, 
  Globe 
} from "lucide-react";
import ExportResults from './ExportResults';

interface ResultsDisplayProps {
  metrics: WebsiteMetrics;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ metrics }) => {
  const resultsRef = useRef<HTMLDivElement>(null);
  
  return (
    <div ref={resultsRef} className="mb-12 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h2 className="text-2xl font-bold mb-1 text-gray-800 dark:text-white">
            {metrics.url.replace(/^https?:\/\//, '')}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Analyzed on {new Date(metrics.checkDate).toLocaleString()}
          </p>
        </div>
        
        <ExportResults metrics={metrics} resultsRef={resultsRef} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <div className="mr-3 p-2 bg-indigo-100 dark:bg-indigo-900 rounded-full">
                <BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <CardTitle className="text-lg">Domain Authority</CardTitle>
                <CardDescription>Moz DA Score</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{metrics.domainAuthority}</div>
            <Progress value={metrics.domainAuthority} className="h-2 mb-1" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {metrics.domainAuthority < 30 && "Low domain authority. Focus on quality backlinks to improve."}
              {metrics.domainAuthority >= 30 && metrics.domainAuthority < 60 && "Medium domain authority. Your site has good potential."}
              {metrics.domainAuthority >= 60 && "High domain authority. Your site has excellent SEO potential."}
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <div className="mr-3 p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-lg">Page Authority</CardTitle>
                <CardDescription>Moz PA Score</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{metrics.pageAuthority}</div>
            <Progress value={metrics.pageAuthority} className="h-2 mb-1" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {metrics.pageAuthority < 30 && "Low page authority. Improve on-page SEO and internal linking."}
              {metrics.pageAuthority >= 30 && metrics.pageAuthority < 60 && "Medium page authority. Your page is doing well."}
              {metrics.pageAuthority >= 60 && "High page authority. Your page has strong ranking potential."}
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <div className="mr-3 p-2 bg-red-100 dark:bg-red-900 rounded-full">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <CardTitle className="text-lg">Spam Score</CardTitle>
                <CardDescription>Risk Assessment</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{metrics.spamScore}/15</div>
            <Progress 
              value={(metrics.spamScore / 15) * 100} 
              className={`h-2 mb-1 ${
                metrics.spamScore <= 3 
                  ? 'bg-green-600' 
                  : metrics.spamScore <= 7 
                    ? 'bg-yellow-600' 
                    : 'bg-red-600'
              }`}
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {metrics.spamScore <= 3 && "Low spam risk. Your site follows good practices."}
              {metrics.spamScore > 3 && metrics.spamScore <= 7 && "Medium spam risk. Consider reviewing your SEO practices."}
              {metrics.spamScore > 7 && "High spam risk. Your site may be at risk of penalties."}
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <div className="mr-3 p-2 bg-green-100 dark:bg-green-900 rounded-full">
                <Link2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle className="text-lg">Backlinks</CardTitle>
                <CardDescription>External Links</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {metrics.backlinks.toLocaleString()}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {metrics.backlinks < 100 && "Your site has few backlinks. Focus on link building strategies."}
              {metrics.backlinks >= 100 && metrics.backlinks < 1000 && "Your site has a good number of backlinks."}
              {metrics.backlinks >= 1000 && "Your site has an excellent backlink profile."}
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <div className="mr-3 p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
                <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-lg">Domain Age</CardTitle>
                <CardDescription>Website Age</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{metrics.domainAge}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {metrics.domainAge.includes("year") && parseInt(metrics.domainAge) > 2 
                ? "Established domain. Age is a positive ranking factor."
                : "Newer domain. Build trust over time with quality content."}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <CardFooter className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
        <div>
          Data sourced from WhoisXML API and internal algorithms for demonstration purposes. Actual metrics may vary.
        </div>
      </CardFooter>
    </div>
  );
};

export default ResultsDisplay;
