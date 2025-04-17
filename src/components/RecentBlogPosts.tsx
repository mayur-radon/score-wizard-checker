
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Calendar } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { BlogPost } from '@/lib/types';

const RecentBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3) as { data: BlogPost[] | null; error: any };
          
        if (error) throw error;
        
        console.log('Recent blog posts fetched:', data?.length || 0);
        setPosts(data || []);
      } catch (error) {
        console.error('Error fetching recent blog posts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecentPosts();
  }, []);

  if (posts.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Latest Blog Posts</h2>
        <Button asChild variant="outline">
          <Link to="/blog">View All</Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          Array(3).fill(0).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
              <CardContent className="p-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
              </CardContent>
            </Card>
          ))
        ) : (
          posts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-48 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 overflow-hidden">
                {post.content.includes('<img') ? (
                  <div className="w-full h-full">
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: post.content.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/)?.[0].replace('<img', '<img class="w-full h-full object-cover"') || '' 
                      }} 
                      className="w-full h-full"
                    />
                  </div>
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
                </div>
                <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
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
          ))
        )}
      </div>
    </div>
  );
};

export default RecentBlogPosts;
