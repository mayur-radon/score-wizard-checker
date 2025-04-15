
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import RichTextEditor from '@/components/RichTextEditor';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Save, Calendar, FileText } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

const BlogEditor = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();
  const isNewPost = id === 'new';
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [slug, setSlug] = useState('');

  useEffect(() => {
    // Redirect if not admin
    if (!isAdmin && !isLoading) {
      navigate('/');
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive"
      });
    }
    
    if (!isNewPost && isAdmin) {
      // Load existing post
      const fetchPost = async () => {
        try {
          const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('id', id)
            .single();
            
          if (error) throw error;
          
          if (data) {
            setTitle(data.title);
            setContent(data.content);
            setExcerpt(data.excerpt);
            setSlug(data.slug);
          }
        } catch (error) {
          console.error('Error fetching post:', error);
          toast({
            title: "Error",
            description: "Failed to load blog post.",
            variant: "destructive"
          });
          navigate('/admin');
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchPost();
    } else {
      setIsLoading(false);
    }
  }, [isAdmin, navigate, toast, id, isNewPost]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    
    // Auto-generate slug if it's a new post and slug is empty
    if (isNewPost && !slug) {
      setSlug(e.target.value
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '-')
      );
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
    );
  };

  const handleSave = async () => {
    if (!title || !content) {
      toast({
        title: "Missing Information",
        description: "Please provide both a title and content for your post.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      const currentTime = new Date().toISOString();
      
      if (isNewPost) {
        // Create new post
        const { error } = await supabase
          .from('blog_posts')
          .insert({
            title,
            content,
            excerpt: excerpt || title.substring(0, 150) + '...',
            slug: slug || title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-'),
            created_at: currentTime,
            updated_at: currentTime
          });
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Blog post created successfully!"
        });
      } else {
        // Update existing post
        const { error } = await supabase
          .from('blog_posts')
          .update({
            title,
            content,
            excerpt: excerpt || title.substring(0, 150) + '...',
            slug,
            updated_at: currentTime
          })
          .eq('id', id);
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Blog post updated successfully!"
        });
      }
      
      // Redirect to admin dashboard
      navigate('/admin');
    } catch (error) {
      console.error('Error saving post:', error);
      toast({
        title: "Error",
        description: "Failed to save blog post.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading blog editor...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // User will be redirected
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            {isNewPost ? 'Create New Blog Post' : 'Edit Blog Post'}
          </h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Post Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    value={title} 
                    onChange={handleTitleChange} 
                    placeholder="Enter post title" 
                    className="text-lg"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <RichTextEditor 
                    value={content} 
                    onChange={setContent} 
                  />
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <Button variant="outline" onClick={() => navigate('/admin')}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Post
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Post Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">/blog/</span>
                    <Input 
                      id="slug" 
                      value={slug} 
                      onChange={handleSlugChange} 
                      placeholder="post-url-slug" 
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    The URL-friendly version of the title. Automatically generated from the title.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Input 
                    id="excerpt" 
                    value={excerpt} 
                    onChange={(e) => setExcerpt(e.target.value)} 
                    placeholder="Brief summary of the post"
                  />
                  <p className="text-xs text-gray-500">
                    A short summary of the post. If empty, it will be generated from the beginning of the content.
                  </p>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex items-start text-sm text-gray-500 mb-3">
                    <Calendar className="h-4 w-4 mr-2 mt-0.5" />
                    <div>
                      <p>Created: {isNewPost ? 'Not yet created' : new Date(id || '').toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start text-sm text-gray-500">
                    <FileText className="h-4 w-4 mr-2 mt-0.5" />
                    <div>
                      <p>Status: {isNewPost ? 'Draft' : 'Published'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>SEO Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border p-4 rounded bg-white dark:bg-gray-950">
                  <div className="text-blue-600 text-lg font-medium line-clamp-1">
                    {title || 'Post Title'}
                  </div>
                  <div className="text-green-600 text-sm mb-1 line-clamp-1">
                    www.yoursite.com/blog/{slug || 'post-url'}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                    {excerpt || title || 'Your post excerpt will appear here...'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;
