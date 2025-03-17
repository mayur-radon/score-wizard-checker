
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

const UserProfile = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center">
        <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 mr-2">
          <User className="h-4 w-4" />
        </div>
        <div className="text-sm">
          <p className="font-medium">{user.name || user.email.split('@')[0]}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={logout}>
        <LogOut className="h-4 w-4 mr-1" />
        Logout
      </Button>
    </div>
  );
};

export default UserProfile;
