
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { PlusCircle, FileText, Users, Search, Database } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminStats from '@/components/AdminStats';
import { toast } from '@/components/ui/use-toast';
import { getAllUsersFromMongo, getAllSearchesFromMongo, getBlogPostsFromMongo } from '@/services/mongoDbService';

interface RecentSearch {
  id?: string;
  domain: string;
  domain_authority: number;
  created_at: string;
  _id?: string;
}

interface UserProfile {
  id: string;
  email: string;
  created_at: string;
  _id?: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  created_at: string;
  _id?: string;
}

const AdminDashboard: React.FC = () => {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }

    const fetchAdminData = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching admin dashboard data from MongoDB...");
        
        // Fetch users from MongoDB
        const profileData = await getAllUsersFromMongo();
        
        // Fetch searches from MongoDB
        const searchData = await getAllSearchesFromMongo();
        
        // Fetch blog posts from MongoDB (if implemented)
        const blogData = await getBlogPostsFromMongo();
        
        // Update state with fetched data
        setRegisteredUsers(profileData || []);
        setRecentSearches(searchData || []);
        setBlogPosts(blogData || []);
        
        console.log("Admin data fetched successfully:", {
          users: profileData?.length || 0,
          searches: searchData?.length || 0,
          blogs: blogData?.length || 0
        });
        
      } catch (error) {
        console.error('Error fetching admin data:', error);
        toast({
          title: "Error",
          description: "Failed to load admin dashboard data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link to="/blog">
              <FileText className="w-4 h-4 mr-2" />
              View Blog
            </Link>
          </Button>
          <Button asChild>
            <Link to="/admin/blog/new">
              <PlusCircle className="w-4 h-4 mr-2" />
              New Blog Post
            </Link>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="blog">Blog Posts</TabsTrigger>
          <TabsTrigger value="searches">Searches</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AdminStats 
              title="Total Users" 
              value={registeredUsers.length} 
              icon={<Users className="h-6 w-6 text-indigo-600" />}
              description="Registered users"
              viewTab="users"
              setActiveTab={setActiveTab}
            />
            <AdminStats 
              title="Blog Posts" 
              value={blogPosts.length} 
              icon={<FileText className="h-6 w-6 text-indigo-600" />}
              description="Published articles"
              viewTab="blog"
              setActiveTab={setActiveTab}
            />
            <AdminStats 
              title="DA/PA Searches" 
              value={recentSearches.length} 
              icon={<Search className="h-6 w-6 text-indigo-600" />}
              description="Recent search queries"
              viewTab="searches"
              setActiveTab={setActiveTab}
            />
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Recent Users</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p>Loading user data...</p>
                ) : registeredUsers.length === 0 ? (
                  <p>No registered users found.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Registered Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {registeredUsers.slice(0, 5).map((user) => (
                        <TableRow key={user.id || user._id}>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            {new Date(user.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
                {registeredUsers.length > 5 && (
                  <Button 
                    variant="link" 
                    onClick={() => setActiveTab('users')} 
                    className="mt-2 p-0 h-auto"
                  >
                    View all users
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Recent Searches</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p>Loading search data...</p>
                ) : recentSearches.length === 0 ? (
                  <p>No recent searches found.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Domain</TableHead>
                        <TableHead>Domain Authority</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentSearches.slice(0, 5).map((search) => (
                        <TableRow key={search.id || search._id}>
                          <TableCell>{search.domain}</TableCell>
                          <TableCell>{search.domain_authority}</TableCell>
                          <TableCell>
                            {new Date(search.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
                {recentSearches.length > 5 && (
                  <Button 
                    variant="link" 
                    onClick={() => setActiveTab('searches')} 
                    className="mt-2 p-0 h-auto"
                  >
                    View all searches
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Registered Users</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Loading registered users...</p>
              ) : registeredUsers.length === 0 ? (
                <p>No registered users found.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Registered Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registeredUsers.map((user) => (
                      <TableRow key={user.id || user._id}>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="blog">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Blog Posts</CardTitle>
              <Button asChild>
                <Link to="/admin/blog/new">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  New Post
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Loading blog posts...</p>
              ) : blogPosts.length === 0 ? (
                <p>No blog posts found.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blogPosts.map((post) => (
                      <TableRow key={post.id || post._id}>
                        <TableCell>{post.title}</TableCell>
                        <TableCell>{post.slug}</TableCell>
                        <TableCell>
                          {new Date(post.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button asChild variant="ghost" size="sm">
                            <Link to={`/admin/blog/${post.id || post._id}`}>
                              Edit
                            </Link>
                          </Button>
                          <Button asChild variant="ghost" size="sm">
                            <Link to={`/blog/${post.slug}`} target="_blank">
                              View
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="searches">
          <Card>
            <CardHeader>
              <CardTitle>Recent Searches</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Loading recent searches...</p>
              ) : recentSearches.length === 0 ? (
                <p>No recent searches found.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Domain</TableHead>
                      <TableHead>Domain Authority</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentSearches.map((search) => (
                      <TableRow key={search.id || search._id}>
                        <TableCell>{search.domain}</TableCell>
                        <TableCell>{search.domain_authority}</TableCell>
                        <TableCell>
                          {new Date(search.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
