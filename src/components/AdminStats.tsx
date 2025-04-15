
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AdminStatsProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  viewTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminStats: React.FC<AdminStatsProps> = ({
  title,
  value,
  icon,
  description,
  viewTab,
  setActiveTab
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold">{value}</h3>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          </div>
          <div className="rounded-full bg-muted p-3">{icon}</div>
        </div>
        <Button 
          variant="link" 
          className="mt-4 px-0 h-auto w-full justify-start text-sm text-muted-foreground"
          onClick={() => setActiveTab(viewTab)}
        >
          View details →
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdminStats;
