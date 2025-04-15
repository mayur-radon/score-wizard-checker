
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, BarChart3, Globe, Search, LinkIcon, AlertTriangle } from "lucide-react";

const HomeContent = () => {
  return (
    <div className="space-y-12 my-12">
      <section>
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          Understanding DA PA Checker Metrics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-indigo-100 to-indigo-50 dark:from-indigo-950 dark:to-indigo-900">
              <div className="flex items-center">
                <div className="mr-4 p-2 rounded-full bg-indigo-600 text-white">
                  <BarChart3 size={24} />
                </div>
                <CardTitle>Domain Authority (DA)</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Domain Authority (DA) is a search engine ranking score developed by Moz that predicts how likely a website is to rank in search engine result pages.
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Score</TableHead>
                    <TableHead>Authority Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>1-20</TableCell>
                    <TableCell>Low</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>21-40</TableCell>
                    <TableCell>Average</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>41-60</TableCell>
                    <TableCell>Good</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>61-80</TableCell>
                    <TableCell>Very Good</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>81-100</TableCell>
                    <TableCell>Excellent</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-purple-100 to-purple-50 dark:from-purple-950 dark:to-purple-900">
              <div className="flex items-center">
                <div className="mr-4 p-2 rounded-full bg-purple-600 text-white">
                  <Search size={24} />
                </div>
                <CardTitle>Page Authority (PA)</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Page Authority (PA) is a score developed by Moz that predicts how well a specific page will rank on search engine result pages (SERPs).
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Higher PA scores correlate with better search rankings</li>
                <li>PA considers link counts, quality, and relevance</li>
                <li>PA is scored on a logarithmic scale (improving from 70 to 80 is harder than from 20 to 30)</li>
                <li>PA is best used as a comparative metric</li>
                <li>PA is frequently updated as Moz collects new data</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-red-100 to-red-50 dark:from-red-950 dark:to-red-900">
              <div className="flex items-center">
                <div className="mr-4 p-2 rounded-full bg-red-600 text-white">
                  <AlertTriangle size={24} />
                </div>
                <CardTitle>Spam Score</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Spam Score is a metric created by Moz that identifies potential spam risks. It flags sites that could be penalized by search engines.
              </p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-1">What It Measures:</h4>
                  <p className="text-gray-700 dark:text-gray-300">Spam Score evaluates 27 different "spam flags" that correlate with penalized or banned websites.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">How To Use It:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                    <li>0-3: Low spam risk</li>
                    <li>4-7: Medium spam risk</li>
                    <li>8+: High spam risk</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8 rounded-xl">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          Why Use Our DA PA Checker Tool?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-start">
            <div className="bg-indigo-600 p-3 rounded-full mr-4 text-white">
              <Globe size={24} />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Comprehensive Domain Analysis</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Our tool provides a complete analysis of any domain, including DA, PA, spam score, backlinks, and domain age - all critical factors for SEO success.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-purple-600 p-3 rounded-full mr-4 text-white">
              <Shield size={24} />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Competitor Research</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Compare your site with competitors to understand your relative strengths and weaknesses in the search landscape.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-pink-600 p-3 rounded-full mr-4 text-white">
              <LinkIcon size={24} />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Backlink Quality Assessment</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Evaluate the quality of potential link building opportunities before investing time and resources.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-green-600 p-3 rounded-full mr-4 text-white">
              <BarChart3 size={24} />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">SEO Progress Tracking</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Monitor your site's authority growth over time with our search history feature. See how your SEO efforts translate to improved metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          How to Improve Your Domain Authority
        </h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <ol className="list-decimal pl-5 space-y-4 text-gray-700 dark:text-gray-300">
            <li className="pl-2">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Build Quality Backlinks</h3>
              <p>Focus on earning links from high-authority, relevant websites in your industry.</p>
            </li>
            <li className="pl-2">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Create Valuable Content</h3>
              <p>Publish comprehensive, original content that naturally attracts links and engagement.</p>
            </li>
            <li className="pl-2">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Optimize On-Page SEO</h3>
              <p>Ensure your site has proper technical SEO foundations including meta tags, structured data, and site speed.</p>
            </li>
            <li className="pl-2">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Improve Internal Linking</h3>
              <p>Create a logical structure that spreads link equity throughout your site.</p>
            </li>
            <li className="pl-2">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Remove Bad Links</h3>
              <p>Regularly audit your backlink profile and disavow toxic links that could harm your authority.</p>
            </li>
            <li className="pl-2">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Be Patient</h3>
              <p>DA improvements take time - often months or even years for significant changes.</p>
            </li>
          </ol>
        </div>
      </section>
    </div>
  );
};

export default HomeContent;
