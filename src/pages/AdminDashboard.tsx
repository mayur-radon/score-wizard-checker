
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

interface RecentSearch {
  id: string;
  domain: string;
  domain_authority: number;
  created_at: string;
}

interface UserProfile {
  id: string;
  email: string;
  created_at: string;
}

const AdminDashboard: React.FC = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }

    const fetchAdminData = async () => {
      setIsLoading(true);
      try {
        // Fetch recent searches
        const { data: searchData, error: searchError } = await supabase
          .from('search_history')
          .select('id, domain, domain_authority, created_at')
          .order('created_at', { ascending: false })
          .limit(10);

        // Fetch registered users
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('id, email, created_at')
          .order('created_at', { ascending: false })
          .limit(10);

        if (searchError) throw searchError;
        if (userError) throw userError;

        setRecentSearches(searchData || []);
        setRegisteredUsers(userData || []);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <TableRow key={search.id}>
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
                    <TableRow key={user.id}>
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
      </div>
    </div>
  );
};

export default AdminDashboard;
