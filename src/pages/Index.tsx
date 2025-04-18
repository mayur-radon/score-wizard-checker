import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchForm from "@/components/SearchForm";
import ResultsDisplay from "@/components/ResultsDisplay";
import RecentSearches from "@/components/RecentSearches";
import RecentBlogPosts from "@/components/RecentBlogPosts";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import UserProfile from "@/components/UserProfile";
import HomeContent from "@/components/HomeContent";
import { WebsiteMetrics, fetchWebsiteMetrics, getSearchHistory } from "@/services/mozApi";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Database, LogIn, UserPlus, Zap, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "next-themes";
import HomeFAQ from "@/components/HomeFAQ";

const Index = () => {
  const [metrics, setMetrics] = useState<WebsiteMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<WebsiteMetrics[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const createProfileIfNeeded = async () => {
      if (user) {
        console.log("Checking profile for user:", user.id);
        
        const { data: existingProfile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError && profileError.code !== 'PGRST116') {
          console.error("Error checking profile:", profileError);
        }
        
        if (!existingProfile) {
          console.log("Creating profile for user:", user.id);
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email
            });
            
          if (insertError) {
            console.error("Error creating profile:", insertError);
          } else {
            console.log("Profile created successfully");
          }
        } else {
          console.log("Profile already exists");
        }
      }
    };
    
    createProfileIfNeeded();
  }, [user]);

  useEffect(() => {
    const loadSearchHistory = async () => {
      if (user) {
        console.log("Loading search history for user:", user.id);
        const history = await getSearchHistory();
        console.log("Retrieved search history:", history);
        setRecentSearches(history);
      } else {
        console.log("No user logged in, not loading search history");
        setRecentSearches([]);
      }
    };
    
    loadSearchHistory();
  }, [user]);

  const handleSearch = async (url: string) => {
    setIsLoading(true);
    setMetrics(null);
    
    try {
      console.log("Initiating search for URL:", url);
      const result = await fetchWebsiteMetrics(url);
      console.log("Search results:", result);
      setMetrics(result);
      
      if (user) {
        console.log("Refreshing search history after new search");
        const history = await getSearchHistory();
        setRecentSearches(history);
      }
      
      toast({
        title: "Analysis Complete",
        description: `We've analyzed ${url.replace(/^https?:\/\//, '')}`,
      });
    } catch (error) {
      console.error("Error during search:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze website",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 pb-16">
      <header className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 py-6 mb-8 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-10 -top-10 w-64 h-64 rounded-full bg-white"></div>
          <div className="absolute right-0 bottom-0 w-96 h-96 rounded-full bg-white"></div>
        </div>
        
        <div className="container px-4 mx-auto relative z-10">
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center group">
              <Database className="w-10 h-10 text-white mr-3 group-hover:scale-110 transition-transform" />
              <h1 className="text-3xl md:text-4xl font-bold text-white group-hover:text-gray-100">DA PA Checker</h1>
            </Link>
            <div className="flex items-center gap-4">
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Toggle dark mode"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              {user ? (
                <UserProfile />
              ) : (
                <div className="flex gap-2">
                  <Button asChild variant="outline" className="text-white border-white hover:bg-white/90 hover:text-indigo-600 dark:hover:bg-white/10 dark:hover:text-white">
                    <Link to="/login">
                      <LogIn className="w-4 h-4 mr-2" />
                      Login
                    </Link>
                  </Button>
                  <Button asChild className="bg-white text-indigo-600 hover:bg-white/90">
                    <Link to="/register">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Register
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <SearchForm onSearch={handleSearch} isLoading={isLoading} />
        </div>
      </header>
      
      <main>
        {!isLoading && !metrics && (
          <div className="container mx-auto px-4 py-8">
            <HomeContent />
            
            {!user && (
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 p-8 rounded-2xl shadow-inner mb-12">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                      Create an Account for Free
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      Sign up to save your search history, track website performance over time, and get access to premium features.
                    </p>
                    <Button asChild className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:translate-y-[-2px]">
                      <Link to="/register">
                        <Zap className="w-5 h-5 mr-2" />
                        Get Started Now
                      </Link>
                    </Button>
                  </div>
                  <div className="md:w-1/3">
                    <img 
                      src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                      alt="Analytics dashboard" 
                      className="rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          metrics && <ResultsDisplay metrics={metrics} />
        )}
        
        {!isLoading && (
          <RecentSearches 
            searches={recentSearches} 
            onSelect={handleSearch}
            isLoading={isLoading}
          />
        )}
        
        <div className="container mx-auto px-4">
          <article className="prose dark:prose-invert max-w-none mb-12">
            <h2 className="text-3xl font-bold mb-4">Domain Authority & Page Authority Checker Overview</h2>
            <p>Domain Authority checker tools play a very important role in today's digital marketing world, as they help businesses understand how well their website will perform beforehand. While many such tools are available online, the DA PA Checker stands out as a premium platform for understanding your DA scores and insights related to your website's domain authority.</p>
            <p>DA PA Checker domain authority tool collects data and provides detailed reports of the website, which is a simple breakdown of complex insights, making you understand the strengths and weaknesses of the website in question. It is good choice with easy interface for SEO professionals seeking to improvise the strategies for their websites or business owners looking out to boost their online presence by comparing their DA scores with other competitors in the market.</p>
            <p>The DA PA Checker offers insights to enhance your domain authority, Page authority, Spam score, total backlinks, domain age, and Google indexing status. These features can help you increase the ranking of not just your overall website but also each page of your website, which can lead to more traffic and a higher conversion rate.</p>
            <p>Before conducting any Domain Authority analysis of the website, a few steps to initiate are to check your content, the relationship between words and phrases, and the relevancy of the content. This helps search engines understand the domain or category of your business and reach the correct audiences. Factors that make your content good involve understanding the phrases directly related to your main keywords, terms connected to your primary keywords, and synonyms of the keywords.</p>
            
            <h2 className="text-2xl font-bold mb-3 mt-8">Domain Authority Checker</h2>
            <h3 className="text-xl font-bold mb-2">What is Domain Authority (DA) or Website Authority?</h3>
            <p>Let's understand in detail what domain authority actually is. Domain Authority (DA) score is an overview of your website's quality measured in numbers ranging from 1-100. The Domain Authority Checker tool predicts your website rank on search engine page results after analyzing factors like quality and quantity of backlinks, content relevance, uniqueness, and overall SEO performance.</p>
            <p>The calculation of Domain Authority scores is driven by a machine-learning algorithm; the result is useful in analyzing numerous factors, like high-quality backlinks, if they are genuine and relevant websites, internal linking, relevant content, and user engagement.</p>
            
            <h3 className="text-xl font-bold mb-2 mt-6">What is the use of Domain Authority Score?</h3>
            <p>This DA metric was developed by Moz to help business owners predict their ranking by comparing their scores with well-established competitor's websites on search engine results pages (SERPs) before going live. Domain Authority metric is popularly used in the SEO industry to compare a website's competitiveness, but it is not used by search engines like Google in their ranking algorithms. DA score only helps you understand the metrics used by Google for top rankings and makes your website achieve all those metrics.</p>
            <p>The data received can be used to improve the quality and quantity of backlinks, SEO strategies, and website performance.</p>
            <p>For some extra brownie points, keep your content relevant to your target audience, engage them by collaborating with niche influencers on your social media accounts, and smartly share your website links through these collaborations.</p>
            
            <h2 className="text-2xl font-bold mb-3 mt-8">Page Authority Checker</h2>
            <h3 className="text-xl font-bold mb-2">What is Page Authority (PA)?</h3>
            <p>There are businesses that opt for minimalistic home pages for their websites and choose separate pages dedicated to each specific service or product they offer. If you are one of those and wondering whether you can individually improve the SERPs rank of each page using the DA checker tool, the answer is a "yes". This can be analyzed with the help of Page Authority Checker, which is available on the DA PA Checker.</p>
            
            <h3 className="text-xl font-bold mb-2 mt-6">What is the use of Page Authority?</h3>
            <p>Page Authority (PA) is a trusted metric developed by Moz, that focuses on the strengths and weaknesses of a specific webpage and predicts its position on search engine results pages (SERPs). PA is calculated in the same way as DA, with scores ranging from 1 to 100, and provides similar detailed insights specifically for the chosen webpage.</p>
            <p>This helps, you to improve your website's ranking, as each page will be optimized using Page Authority data insights. The relevancy can be increased by adding quality and quantity of backlinks on each webpage.</p>
            <p>To achieve the best Page Authority (PA) scores, marketers and business owners should focus on developing content that connects with their target audience while implementing appropriate keywords and providing valuable insights. Including on-page SEO elements, such as meta tags, header tags, and keyword placement, can result in a good PA score.</p>
            
            <h3 className="text-xl font-bold mb-2 mt-6">Why is a Page Authority Checker tool required?</h3>
            <p>With this Page Authority Checker tool one can easily get access to the score, and thus to all the data related to the page's performance. With a well-developed PA checker tool, one can gain insights on the quality of the content, relevant backlinks, and the further step in search engine optimization.</p>
            
            <h2 className="text-2xl font-bold mb-3 mt-8">Understanding the Key Metrics Calculated by Domain Authority Checkers and Their Importance</h2>
            <p>Let's understand the metrics in detail and their importance. This additional information will help you effectively utilize the data and scores provided by the DA PA Checker Domain Authority tool.</p>
            
            <h3 className="text-xl font-bold mb-2 mt-6">Backlinks</h3>
            <p>One of the vital metrics is backlinks, which are also known as inbound or incoming links. Backlinks, in simple terms, means collaboration with popular websites. For example, if you are a fashion house, post guest blogs on websites that are popular on search engines for fashion or lifestyle and smartly place a link to your website or webpage. This not only drives traffic on your website but also signals to search engines that your brand is reputed, eventually increasing your DA PA score.</p>
            
            <h3 className="text-xl font-bold mb-2 mt-6">Linking Root Domains</h3>
            <p>Another key metric is linking root domain, which refers to the unique domains that link to your website. To put it in simple words, it is the number of times people tagging or referring your website's link on popular websites. This number of different websites linking to your site is one of the units that decide your Domain Authority or Page Authority score. The more linked root domains, the better the Domain Authority score of your website.</p>
            
            <h3 className="text-xl font-bold mb-2 mt-6">Spam Score</h3>
            <p>The spam score is like a warning signal that predicts if a website will get penalized or banned by search engines. If a website has a high spam score, there is more chance that your Domain Aurhority score will be low. For example, if a website has a high spam score due to engaging in untrusted link-building practices or publishing links on untrusted websites. Low-quality content on the website can also result in getting penalized by search engines or even getting removed from search results altogether. To stay updated on your spam score, you should regularly check your website's spam score using the DA PA Checker tool.</p>
            
            <h3 className="text-xl font-bold mb-2 mt-6">MozRank and MozTrust</h3>
            <p>Key metrics like MozRank offer insights into evaluating a webpage's popularity on the Internet. MozTrust measures a website's originality, determined by the quality of links from trustworthy sites.</p>
            <p>A higher score determines that your website is linked to more original and genuine websites. For example, if you have posted guest blogs or other kinds of collaborations with well-established and credible sources, your website will get a higher MozTrust score.</p>
            
            <h3 className="text-xl font-bold mb-2 mt-6">Few Other Key Metrics</h3>
            <p>Domain age, content quality, social signals, and user experience are a few other important factors that get evaluated by Domain Authority or Page Authority checker tools. Older domains are likely to be more trustworthy by search engines as they have had more time to build backlinks and increase traffic on their website. High-quality content is important to gain trust and attract visitors, which naturally helps in earning more backlinks. Social signal, is not a direct ranking factor but helps in driving traffic to gain quality and quantity backlinks.</p>
            <p>Last but not least, providing a good user experience (UX) by maintaining the website's speed, mobile-friendliness, and easy navigation encourages consistency in user visits and drives more users, which results in lower bounce rates.</p>
            
            <h2 className="text-2xl font-bold mb-3 mt-8">How is Domain Authority or Page Authority Calculated?</h2>
            <p>As the section above explains the key factors that are taken into consideration let's now see how it is calculated. Firstly, the DA & PA checker gathers backlink data from web crawlers, which scan the web for all your web links. This data forms the foundation of your DA score.</p>
            <p>Secondly, the quality of backlinks is calculated and analyzed by checking each backlink's authority, relevance, and spam potential then both the quality and quantity of backlinks are thoroughly analyzed to prevent any spam score, and finally, the individual factors get combined to calculate the overall DA score which ranges from 1-100.</p>
            <p>It is very important to regularly calculate the Domain Authority score to evaluate changes in the website's backlinks and performance. This helps to stay consistently relevant and trustworthy for users.</p>
            
            <h2 className="text-2xl font-bold mb-3 mt-8">Introducing the DA PA Checker Tool</h2>
            <p>The Domain Authority Checker is a comprehensive SEO tool that is designed to provide in-detail insights into your website's performance and predict the benchmark for the website on search engine results pages. DA PA Checker analyzes not only the Domain authority but also the Page Authority score. By analyzing both Domain Authority and Page Authority, DA PA Checker provides accurate and in-detail understanding of the website you wish to analyze. DA PA Checker has a very easy and user-friendly interface; just enter the URL in the input field and hit submit to get your DA or PA score. Not just the Domain Authority or Page Authority score, but it also offers additional SEO metrics evaluation of total backlinks, spam score, domain age, and Google indexing status.</p>
            
            <h2 className="text-2xl font-bold mb-3 mt-8">Using the Tool</h2>
            <p>Utilizing the DA PA Checker is straightforward and efficient, requiring just three simple steps:</p>
            <ol className="list-decimal list-inside mb-4 pl-4">
              <li className="mb-2">Enter the URL of your website or specific page for analysis.</li>
              <li className="mb-2">Click "Check Authority" to initiate the analysis with a single click.</li>
              <li className="mb-2">Review the detailed scores and insights provided.</li>
            </ol>
            
            <h3 className="text-xl font-bold mb-2 mt-6">How much Domain authority & Page Authority is good?</h3>
            <p>Ideal DA & PA scores given by free DA checker are anywhere between 50 and 60.</p>
            <ul className="list-disc list-inside mb-4 pl-4">
              <li className="mb-1">40-50 : Average Score</li>
              <li className="mb-1">50-60 : Good Score</li>
              <li className="mb-1">60+ : Excellent</li>
            </ul>
            
            <h2 className="text-2xl font-bold mb-3 mt-8">How to Achieve a Good Domain Authority or Page Authority Score</h2>
            <p>To achieve a good DA or PA score, you will need to take a strategic approach surrounding several key aspects, like,</p>
            
            <h3 className="text-xl font-bold mb-2 mt-6">Quality Content Creation</h3>
            <p>Content on your website is the most important aspect of any successful strategy. To improve your DA score, make sure to be consistent in maintaining high-quality content that will address the needs and interests of your users. This not only attracts the audience but also helps to build trust, as your content will feel genuine and customized.</p>
            
            <h3 className="text-xl font-bold mb-2 mt-6">Effective Link Building</h3>
            <p>Backlinks are most important for obtaining a good Domain Authority score; focus on acquiring high-quality backlinks by collaborating with trusted websites and posting informative guest blogs related to your business. You can also achieve this by networking with industry influencers and pushing your website links through them. Make sure not to engage in spammy link-building tactics, which can penalize your website or ban it.</p>
            
            <h3 className="text-xl font-bold mb-2 mt-6">On-Page SEO Optimisation</h3>
            <p>Make sure that your website is well-optimized as per the search engine algorithm. You can achieve this by using relevant keywords in your content, optimizing meta tags and image alt texts, and maintaining a clean and user-friendly site structure. For search engines to understand your content better, utilize internal link-building strategies, which also improve user navigation.</p>
            
            <h3 className="text-xl font-bold mb-2 mt-6">Improving User Experience</h3>
            <p>The most important thing to keep in mind to improve user experience is to ensure your website is mobile friendly as most of the users access websites through their phones in this fast-paced life, and make sure it loads fast and is easy to navigate. People tend to get irritated with complex websites, which can lead to losing your users. A positive experience increases the traffic on your site and the time they spend, which is a good sign to increase your Domain Authority score.</p>
          </article>
          
          <RecentBlogPosts />
          
          <HomeFAQ />
        </div>
      </main>
      
      {!user && !isLoading && metrics && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700 p-3 z-20 animate-fade-in">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <p className="text-gray-700 dark:text-gray-300 mb-3 sm:mb-0">
                <span className="font-semibold">Unlock Premium Features:</span> Weekly monitoring, bulk checks, and more!
              </p>
              <Link to="/register">
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto">
                  Sign Up Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
      
      <footer className="mt-16 py-6 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Link to="/" className="flex items-center mb-4 md:mb-0">
              <Database className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mr-2" />
              <span className="font-semibold text-gray-700 dark:text-gray-300">DA PA Checker</span>
            </Link>
            <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} DA PA Checker - Analyze website metrics with ease
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link to="/terms" className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Terms
              </Link>
              <Link to="/privacy" className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Privacy
              </Link>
              <Link to="/contact" className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
