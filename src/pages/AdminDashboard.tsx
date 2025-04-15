
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Users, 
  FileText, 
  Plus, 
  Database, 
  BarChart2,
  Search
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
}

const AdminDashboard = () => {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [searchesPerDay, setSearchesPerDay] = useState<{date: string, count: number}[]>([]);
  const [usersCount, setUsersCount] = useState(0);
  const [totalSearches, setTotalSearches] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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
  }, [isAdmin, navigate, toast, isLoading]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch users
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('*');
        
        if (userError) throw userError;
        
        // Fetch all users from auth.users using admin function (this would be via a serverless function)
        // For now, we'll use the profiles data
        setUsers(userData.map(profile => ({
          id: profile.id,
          email: profile.email,
          created_at: profile.created_at,
          last_sign_in_at: null
        })));
        
        setUsersCount(userData.length);
        
        // Fetch search history stats
        const { data: searchData, error: searchError } = await supabase
          .from('search_history')
          .select('created_at');
          
        if (searchError) throw searchError;
        
        setTotalSearches(searchData.length);
        
        // Process searches per day
        const searchesByDay = searchData.reduce((acc: Record<string, number>, item) => {
          const date = new Date(item.created_at).toISOString().split('T')[0];
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});
        
        const searchesPerDayArray = Object.entries(searchesByDay).map(([date, count]) => ({
          date,
          count: count as number
        }));
        
        // Sort by date
        searchesPerDayArray.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        setSearchesPerDay(searchesPerDayArray);
        
      } catch (error) {
        console.error('Error fetching admin data:', error);
        toast({
          title: "Error",
          description: "Failed to load admin data.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isAdmin) {
      fetchUserData();
    } else {
      setIsLoading(false);
    }
  }, [isAdmin, toast]);

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // User will be redirected
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <header className="bg-white dark:bg-gray-800 shadow-sm py-4 px-6 mb-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Database className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>
          </div>
          <Button onClick={() => navigate('/')} variant="outline">
            Back to Site
          </Button>
        </div>
      </header>
      
      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                <div className="text-2xl font-bold">{usersCount}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Searches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Search className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                <div className="text-2xl font-bold">{totalSearches}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Blog Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                <div className="text-2xl font-bold">0</div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-auto" 
                  onClick={() => navigate('/admin/blog/new')}
                >
                  <Plus className="h-4 w-4 mr-1" /> New
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="users" className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Blog Posts
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center">
              <BarChart2 className="mr-2 h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Registered Users</h2>
              <Input
                type="search"
                placeholder="Search users..."
                className="max-w-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Last Sign In</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.email}</TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {user.last_sign_in_at 
                            ? new Date(user.last_sign_in_at).toLocaleDateString() 
                            : 'Never'}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                        No users found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="blog" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Blog Posts</h2>
              <Button onClick={() => navigate('/admin/blog/new')}>
                <Plus className="mr-2 h-4 w-4" />
                New Post
              </Button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No blog posts yet</h3>
              <p className="text-gray-500 mb-4">Start creating blog posts to share SEO tips and DA improvement strategies.</p>
              <Button onClick={() => navigate('/admin/blog/new')}>
                Create Your First Post
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Search Analytics</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Searches Per Day</CardTitle>
              </CardHeader>
              <CardContent>
                {searchesPerDay.length > 0 ? (
                  <div className="h-80">
                    <div className="h-full flex items-end">
                      {searchesPerDay.map((day, index) => (
                        <div 
                          key={index} 
                          className="flex flex-col items-center mx-1"
                          style={{ width: `${100 / searchesPerDay.length}%` }}
                        >
                          <div 
                            className="bg-indigo-500 rounded-t w-full"
                            style={{ 
                              height: `${(day.count / Math.max(...searchesPerDay.map(d => d.count))) * 80}%`,
                              minHeight: '10px'
                            }}
                          ></div>
                          <div className="text-xs mt-2 rotate-45 origin-left whitespace-nowrap text-gray-500">
                            {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    No search data available yet.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
