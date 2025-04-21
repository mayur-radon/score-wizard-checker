
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AdminStats from '@/components/AdminStats';
import { useToast } from '@/components/ui/use-toast';
import { 
  getAllUsersFromMongo, 
  getAllSearchesFromMongo, 
  getBlogPostsFromMongo,
  UserProfile,
  SearchHistory,
  BlogPost
} from '@/services/mongoDbService';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searches, setSearches] = useState<SearchHistory[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch users - now returns UserProfile[] directly
        const usersData = await getAllUsersFromMongo();
        setUsers(usersData);
        
        // Fetch searches - now returns SearchHistory[] directly
        const searchesData = await getAllSearchesFromMongo();
        setSearches(searchesData);
        
        // Fetch blog posts - now returns BlogPost[] directly
        const blogData = await getBlogPostsFromMongo();
        setBlogPosts(blogData);
      } catch (error) {
        console.error('Error fetching admin data:', error);
        toast({
          title: "Error",
          description: "Failed to load admin data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isAdmin, navigate, toast]);

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <p>Loading data...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <AdminStats 
        userCount={users.length} 
        searchCount={searches.length} 
        blogPostCount={blogPosts.length}
        setActiveTab={setActiveTab} 
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
        <TabsList className="mb-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="searches">Recent Searches</TabsTrigger>
          <TabsTrigger value="blog">Blog Posts</TabsTrigger>
        </TabsList>
        
        {/* Users Tab */}
        <TabsContent value="users">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Registered Users</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 text-left">User ID</th>
                    <th className="py-2 px-4 text-left">Email</th>
                    <th className="py-2 px-4 text-left">Registration Date</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user.id} className="border-t">
                        <td className="py-2 px-4">{user.id.substring(0, 8)}...</td>
                        <td className="py-2 px-4">{user.email}</td>
                        <td className="py-2 px-4">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-4 px-4 text-center">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
        
        {/* Searches Tab */}
        <TabsContent value="searches">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Recent Searches</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 text-left">Domain</th>
                    <th className="py-2 px-4 text-left">DA Score</th>
                    <th className="py-2 px-4 text-left">PA Score</th>
                    <th className="py-2 px-4 text-left">User</th>
                    <th className="py-2 px-4 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {searches.length > 0 ? (
                    searches.map((search, index) => (
                      <tr key={index} className="border-t">
                        <td className="py-2 px-4">{search.domain}</td>
                        <td className="py-2 px-4">{search.domain_authority}</td>
                        <td className="py-2 px-4">{search.page_authority}</td>
                        <td className="py-2 px-4">{search.user_id.substring(0, 8)}...</td>
                        <td className="py-2 px-4">
                          {new Date(search.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-4 px-4 text-center">
                        No searches found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
        
        {/* Blog Posts Tab */}
        <TabsContent value="blog">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Blog Posts</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 text-left">Title</th>
                    <th className="py-2 px-4 text-left">Slug</th>
                    <th className="py-2 px-4 text-left">Author</th>
                    <th className="py-2 px-4 text-left">Created</th>
                    <th className="py-2 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogPosts.length > 0 ? (
                    blogPosts.map((post) => (
                      <tr key={post.id} className="border-t">
                        <td className="py-2 px-4">{post.title}</td>
                        <td className="py-2 px-4">{post.slug}</td>
                        <td className="py-2 px-4">{post.author}</td>
                        <td className="py-2 px-4">
                          {new Date(post.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-2 px-4">
                          <Dialog>
                            <DialogTrigger className="text-blue-500 hover:underline">
                              View
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>{post.title}</DialogTitle>
                              </DialogHeader>
                              <div className="mt-4" dangerouslySetInnerHTML={{ __html: post.content }} />
                            </DialogContent>
                          </Dialog>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-4 px-4 text-center">
                        No blog posts found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
