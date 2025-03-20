
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const UserProfile = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  // Get initials for avatar fallback
  const getInitials = () => {
    if (user.user_metadata?.name) {
      return user.user_metadata.name.charAt(0).toUpperCase();
    }
    return user.email?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center">
        <Avatar className="mr-2 h-8 w-8 bg-gradient-to-br from-indigo-500 to-purple-500">
          <AvatarFallback>{getInitials()}</AvatarFallback>
        </Avatar>
        <div className="text-sm">
          <p className="font-medium">{user.user_metadata?.name || user.email?.split('@')[0]}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={() => logout()}>
        <LogOut className="h-4 w-4 mr-1" />
        Logout
      </Button>
    </div>
  );
};

export default UserProfile;
