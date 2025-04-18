
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 pb-16">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Terms of Service</h1>
          
          <div className="prose dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p>By accessing and using DA PA Checker, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use or access our services.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
              <p>Permission is granted to temporarily use the DA PA Checker tool for personal, non-commercial purposes. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Modify or copy the materials;</li>
                <li>Use the materials for any commercial purpose or for any public display;</li>
                <li>Attempt to reverse engineer any software contained on DA PA Checker's website;</li>
                <li>Remove any copyright or other proprietary notations from the materials; or</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
              </ul>
              <p>This license shall automatically terminate if you violate any of these restrictions and may be terminated by DA PA Checker at any time.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Disclaimer</h2>
              <p>The materials on DA PA Checker's website are provided on an 'as is' basis. DA PA Checker makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
              <p>Further, DA PA Checker does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Limitations</h2>
              <p>In no event shall DA PA Checker or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on DA PA Checker's website, even if DA PA Checker or a DA PA Checker authorized representative has been notified orally or in writing of the possibility of such damage.</p>
              <p>Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Accuracy of Materials</h2>
              <p>The materials appearing on DA PA Checker's website could include technical, typographical, or photographic errors. DA PA Checker does not warrant that any of the materials on its website are accurate, complete or current. DA PA Checker may make changes to the materials contained on its website at any time without notice. However, DA PA Checker does not make any commitment to update the materials.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Links</h2>
              <p>DA PA Checker has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by DA PA Checker of the site. Use of any such linked website is at the user's own risk.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Modifications</h2>
              <p>DA PA Checker may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Governing Law</h2>
              <p>These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.</p>
            </section>
          </div>

          <div className="mt-8">
            <Link to="/" className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
