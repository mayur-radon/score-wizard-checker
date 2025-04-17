
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  BarChart3, 
  AlertTriangle, 
  Link2, 
  Calendar, 
  Globe,
  Info, 
  TrendingUp,
  ExternalLink
} from "lucide-react";
import ExportResults from './ExportResults';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ResultsDisplayProps {
  metrics: WebsiteMetrics;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ metrics }) => {
  const resultsRef = useRef<HTMLDivElement>(null);
  
  // Determine color classes based on metric values
  const getDaClass = (score: number) => {
    if (score >= 60) return "text-emerald-600 dark:text-emerald-400";
    if (score >= 30) return "text-amber-600 dark:text-amber-400";
    return "text-rose-600 dark:text-rose-400";
  };
  
  const getPaClass = (score: number) => {
    if (score >= 60) return "text-emerald-600 dark:text-emerald-400";
    if (score >= 30) return "text-amber-600 dark:text-amber-400";
    return "text-rose-600 dark:text-rose-400";
  };
  
  const getSpamClass = (score: number) => {
    if (score <= 3) return "text-emerald-600 dark:text-emerald-400";
    if (score <= 7) return "text-amber-600 dark:text-amber-400";
    return "text-rose-600 dark:text-rose-400";
  };
  
  const getProgressColor = (type: string, value: number) => {
    if (type === 'da' || type === 'pa') {
      if (value >= 60) return "bg-emerald-600";
      if (value >= 30) return "bg-amber-600";
      return "bg-rose-600";
    } else if (type === 'spam') {
      const normalized = (value / 15) * 100;
      if (normalized <= 20) return "bg-emerald-600";
      if (normalized <= 50) return "bg-amber-600";
      return "bg-rose-600";
    }
    return "bg-blue-600";
  };
  
  return (
    <TooltipProvider>
      <div ref={resultsRef} className="mb-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <div className="flex items-center mb-1">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mr-2">
                {metrics.url.replace(/^https?:\/\//, '')}
              </h2>
              <a href={metrics.url} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:text-indigo-600 transition-colors">
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              Analyzed on {new Date(metrics.checkDate).toLocaleString()}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <ExportResults metrics={metrics} resultsRef={resultsRef} />
            
            <Link to="/register">
              <Button variant="outline" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Track Changes
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="shadow-sm hover:shadow-md transition-shadow border-t-4 border-t-indigo-500">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-3 p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-full">
                    <BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg flex items-center">
                      Domain Authority
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 ml-1 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Domain Authority (DA) is a search engine ranking score that predicts how likely a website is to rank in search results. Scores range from 1 to 100, with higher scores indicating better ranking potential.</p>
                        </TooltipContent>
                      </Tooltip>
                    </CardTitle>
                    <CardDescription>Moz DA Score</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-4xl font-bold mb-2 ${getDaClass(metrics.domainAuthority)}`}>{metrics.domainAuthority}</div>
              <Progress value={metrics.domainAuthority} className={`h-2 mb-1 ${getProgressColor('da', metrics.domainAuthority)}`} />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {metrics.domainAuthority < 30 && "Low domain authority. Focus on quality backlinks to improve."}
                {metrics.domainAuthority >= 30 && metrics.domainAuthority < 60 && "Medium domain authority. Your site has good potential."}
                {metrics.domainAuthority >= 60 && "High domain authority. Your site has excellent SEO potential."}
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm hover:shadow-md transition-shadow border-t-4 border-t-blue-500">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-3 p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                    <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg flex items-center">
                      Page Authority
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 ml-1 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Page Authority (PA) is a score that predicts how well a specific page will rank in search results. Like DA, it ranges from 1 to 100, with higher scores being better.</p>
                        </TooltipContent>
                      </Tooltip>
                    </CardTitle>
                    <CardDescription>Moz PA Score</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-4xl font-bold mb-2 ${getPaClass(metrics.pageAuthority)}`}>{metrics.pageAuthority}</div>
              <Progress value={metrics.pageAuthority} className={`h-2 mb-1 ${getProgressColor('pa', metrics.pageAuthority)}`} />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {metrics.pageAuthority < 30 && "Low page authority. Improve on-page SEO and internal linking."}
                {metrics.pageAuthority >= 30 && metrics.pageAuthority < 60 && "Medium page authority. Your page is doing well."}
                {metrics.pageAuthority >= 60 && "High page authority. Your page has strong ranking potential."}
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm hover:shadow-md transition-shadow border-t-4 border-t-red-500">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-3 p-2 bg-red-100 dark:bg-red-900/50 rounded-full">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg flex items-center">
                      Spam Score
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 ml-1 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Spam Score indicates how likely a site is to be penalized or banned by search engines. Lower is better, with scores ranging from 0 to 15.</p>
                        </TooltipContent>
                      </Tooltip>
                    </CardTitle>
                    <CardDescription>Risk Assessment</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-4xl font-bold mb-2 ${getSpamClass(metrics.spamScore)}`}>{metrics.spamScore}/15</div>
              <Progress 
                value={(metrics.spamScore / 15) * 100} 
                className={`h-2 mb-1 ${getProgressColor('spam', metrics.spamScore)}`}
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {metrics.spamScore <= 3 && "Low spam risk. Your site follows good practices."}
                {metrics.spamScore > 3 && metrics.spamScore <= 7 && "Medium spam risk. Consider reviewing your SEO practices."}
                {metrics.spamScore > 7 && "High spam risk. Your site may be at risk of penalties."}
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm hover:shadow-md transition-shadow border-t-4 border-t-green-500">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-3 p-2 bg-green-100 dark:bg-green-900/50 rounded-full">
                    <Link2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg flex items-center">
                      Backlinks
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 ml-1 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Backlinks are links from other websites to your site. They act as "votes of confidence" and can significantly impact search engine rankings.</p>
                        </TooltipContent>
                      </Tooltip>
                    </CardTitle>
                    <CardDescription>External Links</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-2 text-green-600 dark:text-green-400">
                {metrics.backlinks.toLocaleString()}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {metrics.backlinks < 100 && "Your site has few backlinks. Focus on link building strategies."}
                {metrics.backlinks >= 100 && metrics.backlinks < 1000 && "Your site has a good number of backlinks."}
                {metrics.backlinks >= 1000 && "Your site has an excellent backlink profile."}
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm hover:shadow-md transition-shadow border-t-4 border-t-purple-500">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-3 p-2 bg-purple-100 dark:bg-purple-900/50 rounded-full">
                    <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg flex items-center">
                      Domain Age
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 ml-1 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Domain age is how long a website has existed. Older domains tend to be more trusted by search engines and may have SEO advantages.</p>
                        </TooltipContent>
                      </Tooltip>
                    </CardTitle>
                    <CardDescription>Website Age</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-2 text-purple-600 dark:text-purple-400">{metrics.domainAge}</div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {typeof metrics.domainAge === 'string' && metrics.domainAge.includes("year") && parseInt(metrics.domainAge) > 2 
                  ? "Established domain. Age is a positive ranking factor."
                  : "Newer domain. Build trust over time with quality content."}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <CardFooter className="flex justify-between items-center pt-6 mt-6 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
          <div>
            Data sourced from WhoisXML API and internal algorithms for demonstration purposes.
          </div>
          <Link to="/register" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
            Sign up for Weekly Updates →
          </Link>
        </CardFooter>
        
        {/* Sign up CTA Banner */}
        <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">Want weekly DA updates?</h3>
              <p className="text-gray-600 dark:text-gray-300">Create a free account to track your domain metrics over time.</p>
            </div>
            <Link to="/register">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6">
                Sign Up Free
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ResultsDisplay;
