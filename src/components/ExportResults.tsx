
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Image, FileSpreadsheet } from 'lucide-react';
import html2canvas from 'html2canvas';
import { WebsiteMetrics } from '@/services/mozApi';

interface ExportResultsProps {
  metrics: WebsiteMetrics;
  resultsRef: React.RefObject<HTMLDivElement>;
}

const ExportResults: React.FC<ExportResultsProps> = ({ metrics, resultsRef }) => {
  
  const saveAsJPG = async () => {
    if (!resultsRef.current) return;
    
    try {
      // Add a temporary class to make sure all content is visible for the screenshot
      resultsRef.current.classList.add('export-capture');
      
      // Use html2canvas to create a screenshot
      const canvas = await html2canvas(resultsRef.current, {
        scale: 2, // Higher scale for better quality
        useCORS: true, // To handle cross-origin images
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: resultsRef.current.offsetWidth,
        height: resultsRef.current.offsetHeight
      });
      
      // Convert canvas to data URL
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      
      // Create a link and trigger download
      const link = document.createElement('a');
      link.download = `${metrics.url.replace(/^https?:\/\//, '')}-metrics.jpg`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Remove the temporary class
      resultsRef.current.classList.remove('export-capture');
    } catch (error) {
      console.error('Error saving as JPG:', error);
      // Remove the temporary class in case of error
      if (resultsRef.current) {
        resultsRef.current.classList.remove('export-capture');
      }
    }
  };
  
  const saveAsCSV = () => {
    if (!metrics) return;
    
    // Define CSV header and row
    const csvHeader = [
      'URL',
      'Domain Authority',
      'Page Authority',
      'Spam Score',
      'Backlinks',
      'Domain Age',
      'Check Date'
    ].join(',');
    
    const csvRow = [
      metrics.url,
      metrics.domainAuthority,
      metrics.pageAuthority,
      metrics.spamScore,
      metrics.backlinks,
      metrics.domainAge,
      new Date(metrics.checkDate).toLocaleString()
    ].join(',');
    
    // Combine header and row
    const csvContent = `${csvHeader}\n${csvRow}`;
    
    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create a link and trigger download
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${metrics.url.replace(/^https?:\/\//, '')}-metrics.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={saveAsJPG}
        className="flex items-center"
      >
        <Image className="h-4 w-4 mr-2" />
        Save as JPG
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={saveAsCSV}
        className="flex items-center"
      >
        <FileSpreadsheet className="h-4 w-4 mr-2" />
        Save as CSV
      </Button>
    </div>
  );
};

export default ExportResults;
