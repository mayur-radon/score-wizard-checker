
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Database, Calendar, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setPosts(data || []);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        toast({
          title: "Error",
          description: "Failed to load blog posts.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  }, [toast]);

  const filteredPosts = searchTerm 
    ? posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : posts;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 pb-16">
      <header className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 py-6 mb-8 shadow-lg">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Database className="w-10 h-10 text-white mr-3" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                DA PA Checker Blog
              </h1>
            </div>
            <Button asChild variant="outline" className="text-white border-white hover:bg-white/10">
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
          <p className="text-center text-white/80 max-w-3xl mx-auto">
            Insights, tips, and strategies on improving Domain Authority, Page Authority, and search engine rankings.
          </p>
        </div>
      </header>
      
      <main className="container mx-auto px-4">
        <div className="mb-8 max-w-md mx-auto">
          <Input
            type="search"
            placeholder="Search blog posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading blog posts...</p>
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-48 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900">
                  {/* Extract first img from content if exists, otherwise show gradient */}
                  {post.content.includes('<img') ? (
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: post.content.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/)?.[0] || '' 
                      }} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-5xl text-indigo-300 dark:text-indigo-700 font-bold">
                      DA/PA
                    </div>
                  )}
                </div>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-bold mb-2 line-clamp-2">
                    <Link to={`/blog/${post.slug}`} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                      {post.title}
                    </Link>
                  </h2>
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      {new Date(post.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="mx-2">•</span>
                    <Clock className="h-4 w-4 mr-1" />
                    <span>5 min read</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                    {post.excerpt}
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button asChild variant="link" className="p-0 h-auto font-semibold">
                    <Link to={`/blog/${post.slug}`}>
                      Read More →
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            {searchTerm ? (
              <>
                <h2 className="text-xl font-semibold mb-2">No posts found</h2>
                <p className="text-gray-500 mb-4">
                  No blog posts match your search for "{searchTerm}".
                </p>
                <Button onClick={() => setSearchTerm('')} variant="outline">
                  Clear Search
                </Button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-2">No blog posts yet</h2>
                <p className="text-gray-500 mb-4">
                  Check back soon for articles about SEO, DA/PA, and website optimization!
                </p>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Blog;
