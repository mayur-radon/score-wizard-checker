
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
    // ... Add all other FAQs
  ]
};

const HomeFAQ = () => {
  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        
        <script type="application/ld+json">
          {JSON.stringify(FAQSchema)}
        </script>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>What does this DA & PA tool do?</AccordionTrigger>
              <AccordionContent>
                This tool provides valuable insights about various SEO metrics, including Domain Authority (DA), Page Authority (PA), domain age, backlinks, and Google indexing status, all in one place.
              </AccordionContent>
            </AccordionItem>
            {/* Add all other FAQ items */}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default HomeFAQ;
