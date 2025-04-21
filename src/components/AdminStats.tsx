
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Search, BookOpen } from 'lucide-react';

interface AdminStatsProps {
  userCount: number;
  searchCount: number;
  blogPostCount: number;
  setActiveTab?: (tab: string) => void;
}

const AdminStats: React.FC<AdminStatsProps> = ({
  userCount,
  searchCount,
  blogPostCount,
  setActiveTab
}) => {
  const statsData = [
    {
      title: "Total Users",
      value: userCount,
      icon: <Users className="h-5 w-5" />,
      description: "Registered users on the platform",
      viewTab: "users"
    },
    {
      title: "Total Searches",
      value: searchCount,
      icon: <Search className="h-5 w-5" />,
      description: "Domain authority searches performed",
      viewTab: "searches"
    },
    {
      title: "Blog Posts",
      value: blogPostCount,
      icon: <BookOpen className="h-5 w-5" />,
      description: "Published articles on the blog",
      viewTab: "blog"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3 mb-6">
      {statsData.map((stat, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold">{stat.value}</h3>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
              </div>
              <div className="rounded-full bg-muted p-3">{stat.icon}</div>
            </div>
            {setActiveTab && (
              <Button 
                variant="link" 
                className="mt-4 px-0 h-auto w-full justify-start text-sm text-muted-foreground"
                onClick={() => setActiveTab(stat.viewTab)}
              >
                View details →
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminStats;
