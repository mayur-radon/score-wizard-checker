
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What does this DA & PA tool do?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "This tool provides valuable insights about various SEO metrics, including Domain Authority (DA), Page Authority (PA), domain age, backlinks, and Google indexing status, all in one place."
      }
    },
    {
      "@type": "Question",
      "name": "How does the DA PA tool calculate Domain Authority and Page Authority?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The SEO tool utilizes algorithms to calculate Domain Authority and Page Authority based on factors such as link profile, domain age, and content quality."
      }
    },
    {
      "@type": "Question",
      "name": "Can I check multiple websites or pages at once?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. At a time you will be able to check just one website, which URL you will place in the provided box. After you get report for one website, you can move further with the next one."
      }
    },
    {
      "@type": "Question",
      "name": "Why should I use this Domain Authority tool?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Instead of using different tools for different metrics, this tool provides all the information in one go. This is both, time-saving and effort-reducing tool, which is why you should give it a try."
      }
    },
    {
      "@type": "Question",
      "name": "Is the information provided by the domain authority tool accurate?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. The domain authority and page authority tool aims to provide accurate and reliable data. However, it should be noted that, being a complex process, you might find minute discrepancies between the results provided by this tool and other tools."
      }
    },
    {
      "@type": "Question",
      "name": "How often should I check my website's domain authority & page Authority metrics?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "It's a good practice to regularly monitor your website's SEO metrics to track performance, backlinks, and make informed decisions about your SEO strategy. You can choose to check them monthly, quarterly, or as needed."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use this domain authority tool to analyze my competitors' websites?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, you can use the tool to analyze the SEO metrics of competitors' websites, understanding their strengths and weaknesses and planning your own SEO strategy accordingly."
      }
    },
    {
      "@type": "Question",
      "name": "Are there any limitations to what the tool can analyze?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The tool analyzes Domain Authority/DA, Page Authority/PA, Backlinks, Google Indexing, and Domain Age."
      }
    },
    {
      "@type": "Question",
      "name": "Does the DA PA tool provide recommendations for improving SEO?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The tool provides key insights into areas for improvement based on the analyzed metrics. However, to understand the SEO performance of your website, it's essential to conduct further research and analysis to develop a comprehensive SEO strategy for your specific goals and audience."
      }
    },
    {
      "@type": "Question",
      "name": "Is there a cost associated with using the tool?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. The tool is completely free to use."
      }
    }
  ]
};

const WebsiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "DA PA Checker",
  "url": "https://dapachecker.ai/",
  "description": "Free Domain Authority (DA) and Page Authority (PA) checker tool with backlinks, spam score and domain age information.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://dapachecker.ai/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

const HomeFAQ = () => {
  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900" id="faq">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WebsiteSchema) }} />
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="border rounded-lg overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800">
                What does this DA & PA tool do?
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3 pt-1">
                This tool provides valuable insights about various SEO metrics, including Domain Authority (DA), Page Authority (PA), domain age, backlinks, and Google indexing status, all in one place.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="border rounded-lg overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800">
                How does the DA PA tool calculate Domain Authority and Page Authority?
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3 pt-1">
                The SEO tool utilizes algorithms to calculate Domain Authority and Page Authority based on factors such as link profile, domain age, and content quality.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3" className="border rounded-lg overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800">
                Can I check multiple websites or pages at once?
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3 pt-1">
                No. At a time you will be able to check just one website, which URL you will place in the provided box. After you get report for one website, you can move further with the next one.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4" className="border rounded-lg overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800">
                Why should I use this Domain Authority tool?
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3 pt-1">
                Instead of using different tools for different metrics, this tool provides all the information in one go. This is both, time-saving and effort-reducing tool, which is why you should give it a try.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5" className="border rounded-lg overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800">
                Is the information provided by the domain authority tool accurate?
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3 pt-1">
                Yes. The domain authority and page authority tool aims to provide accurate and reliable data. However, it should be noted that, being a complex process, you might find minute discrepancies between the results provided by this tool and other tools.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6" className="border rounded-lg overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800">
                How often should I check my website's domain authority & page Authority metrics?
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3 pt-1">
                It's a good practice to regularly monitor your website's SEO metrics to track performance, backlinks, and make informed decisions about your SEO strategy. You can choose to check them monthly, quarterly, or as needed.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-7" className="border rounded-lg overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800">
                Can I use this domain authority tool to analyze my competitors' websites?
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3 pt-1">
                Yes, you can use the tool to analyze the SEO metrics of competitors' websites, understanding their strengths and weaknesses and planning your own SEO strategy accordingly.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-8" className="border rounded-lg overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800">
                Are there any limitations to what the tool can analyze?
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3 pt-1">
                The tool analyzes Domain Authority/DA, Page Authority/PA, Backlinks, Google Indexing, and Domain Age.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-9" className="border rounded-lg overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800">
                Does the DA PA tool provide recommendations for improving SEO?
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3 pt-1">
                The tool provides key insights into areas for improvement based on the analyzed metrics. However, to understand the SEO performance of your website, it's essential to conduct further research and analysis to develop a comprehensive SEO strategy for your specific goals and audience.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-10" className="border rounded-lg overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800">
                Is there a cost associated with using the tool?
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3 pt-1">
                No. The tool is completely free to use.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default HomeFAQ;
