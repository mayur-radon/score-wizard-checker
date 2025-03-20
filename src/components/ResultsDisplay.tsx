
import { WebsiteMetrics } from "@/services/mozApi";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Download, FileText, Image } from "lucide-react";
import { useRef } from "react";
import html2canvas from 'html2canvas';

interface ResultsDisplayProps {
  metrics: WebsiteMetrics | null;
}

const ResultsDisplay = ({ metrics }: ResultsDisplayProps) => {
  const { toast } = useToast();
  const resultsRef = useRef<HTMLDivElement>(null);

  if (!metrics) return null;
  
  const downloadAsImage = async () => {
    if (!resultsRef.current) return;
    
    try {
      // Make sure all content is visible
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'visible';
      
      // Increase quality and ensure background color is set
      const canvas = await html2canvas(resultsRef.current, { 
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: true,
        onclone: (clonedDoc) => {
          // This ensures the cloned element is fully rendered before capturing
          const clonedResults = clonedDoc.querySelector('[data-results-container]');
          if (clonedResults) {
            clonedResults.setAttribute('style', 'padding: 20px; background-color: white;');
          }
        }
      });
      
      // Restore overflow
      document.body.style.overflow = originalOverflow;
      
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      const link = document.createElement("a");
      const siteName = metrics.url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      link.download = `${siteName}-metrics.jpg`;
      link.href = dataUrl;
      link.click();
      
      toast({
        title: "Success",
        description: "Results downloaded as JPG",
      });
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Error",
        description: "Failed to download as image",
        variant: "destructive",
      });
    }
  };
  
  const downloadAsCSV = () => {
    try {
      // Create CSV content
      const csvContent = [
        "Metric,Value",
        `URL,${metrics.url}`,
        `Domain Authority,${metrics.domainAuthority}`,
        `Page Authority,${metrics.pageAuthority}`,
        `Spam Score,${metrics.spamScore}`,
        `Backlinks,${metrics.backlinks}`,
        `Domain Age,${metrics.domainAge}`,
        `Check Date,${metrics.checkDate}`
      ].join('\n');
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const siteName = metrics.url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      link.download = `${siteName}-metrics.csv`;
      link.href = url;
      link.click();
      
      toast({
        title: "Success",
        description: "Results downloaded as CSV",
      });
    } catch (error) {
      console.error("Error generating CSV:", error);
      toast({
        title: "Error",
        description: "Failed to download as CSV",
        variant: "destructive",
      });
    }
  };
  
  // Format data for charts
  const authoritiesData = [
    {
      name: "Domain Authority",
      value: metrics.domainAuthority,
      color: "#5A7AFF"
    },
    {
      name: "Page Authority",
      value: metrics.pageAuthority,
      color: "#A347FF"
    },
    {
      name: "Spam Score",
      value: metrics.spamScore,
      color: "#FF5A5A"
    }
  ];
  
  // Format the date for display
  const checkDate = new Date(metrics.checkDate).toLocaleString();
  
  // Format domain for display
  const domain = metrics.url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  
  // Format backlinks with commas
  const formattedBacklinks = metrics.backlinks.toLocaleString();

  return (
    <div data-results-container ref={resultsRef} className="w-full max-w-5xl mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{domain}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Analysis completed: {checkDate}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={downloadAsImage} className="flex items-center space-x-1 border-brand-300 text-brand-700 hover:bg-brand-50">
            <Image className="w-4 h-4" />
            <span>Save as JPG</span>
          </Button>
          <Button variant="outline" onClick={downloadAsCSV} className="flex items-center space-x-1 border-purple-300 text-purple-700 hover:bg-purple-50">
            <FileText className="w-4 h-4" />
            <span>Save as CSV</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="metric-card">
          <div className="metric-label">Domain Authority</div>
          <div className="metric-value">{metrics.domainAuthority}</div>
          <div className="mt-2 text-xs text-gray-500">
            {metrics.domainAuthority > 50 ? 'Excellent' : metrics.domainAuthority > 30 ? 'Good' : 'Needs improvement'}
          </div>
        </Card>
        
        <Card className="metric-card">
          <div className="metric-label">Page Authority</div>
          <div className="metric-value">{metrics.pageAuthority}</div>
          <div className="mt-2 text-xs text-gray-500">
            {metrics.pageAuthority > 50 ? 'Excellent' : metrics.pageAuthority > 30 ? 'Good' : 'Needs improvement'}
          </div>
        </Card>
        
        <Card className="metric-card">
          <div className="metric-label">Spam Score</div>
          <div className="metric-value">{metrics.spamScore}%</div>
          <div className="mt-2 text-xs text-gray-500">
            {metrics.spamScore < 5 ? 'Low risk' : metrics.spamScore < 10 ? 'Medium risk' : 'High risk'}
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card className="metric-card">
          <div className="metric-label">Backlinks</div>
          <div className="metric-value">{formattedBacklinks}</div>
          <div className="mt-2 text-xs text-gray-500">
            {metrics.backlinks > 5000 ? 'Strong backlink profile' : metrics.backlinks > 1000 ? 'Good backlink profile' : 'Building backlinks recommended'}
          </div>
        </Card>
        
        <Card className="metric-card">
          <div className="metric-label">Domain Age</div>
          <div className="metric-value">{metrics.domainAge}</div>
          <div className="mt-2 text-xs text-gray-500">
            {metrics.domainAge.includes('10') || parseInt(metrics.domainAge) > 10 ? 'Established domain' : 'Relatively new domain'}
          </div>
        </Card>
      </div>
      
      <div className="h-80 w-full mb-4">
        <h3 className="text-lg font-semibold mb-2 text-center">Authority Metrics Comparison</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={authoritiesData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 30,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip 
              formatter={(value) => [`${value}`, 'Score']}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {authoritiesData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Note: Domain Authority (DA) and Page Authority (PA) are metrics developed by Moz that predict how well a website will rank on search engines.
          Spam Score reflects the percentage of sites with similar features to this one that were penalized by Google.
        </p>
      </div>
    </div>
  );
};

export default ResultsDisplay;
