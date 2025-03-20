
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User, Edit, Save, X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const UserProfile = () => {
  const { user, logout, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.user_metadata?.name || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!user) return null;

  // Get initials for avatar fallback
  const getInitials = () => {
    if (user.user_metadata?.name) {
      return user.user_metadata.name.charAt(0).toUpperCase();
    }
    return user.email?.charAt(0).toUpperCase() || 'U';
  };

  const handleSave = async () => {
    // Validate passwords if attempting to change
    if (password && password !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Update name
      if (name !== user.user_metadata?.name) {
        await updateUserProfile({ name });
        toast({
          title: "Profile updated",
          description: "Your name has been updated successfully."
        });
      }

      // Update password if provided
      if (password) {
        const { error } = await supabase.auth.updateUser({
          password: password
        });

        if (error) throw error;

        toast({
          title: "Password updated",
          description: "Your password has been changed successfully."
        });
        
        // Clear password fields
        setPassword('');
        setConfirmPassword('');
      }

      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      });
    }
  };

  if (isEditing) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="mb-4 flex items-center">
          <Avatar className="mr-3 h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-500">
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
          <h3 className="text-lg font-semibold">Edit Profile</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Display Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Display Name"
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              value={user.email || ''} 
              disabled 
              className="bg-gray-100 dark:bg-gray-700"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <Label htmlFor="password">New Password</Label>
            <Input 
              id="password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Leave blank to keep current password"
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input 
              id="confirmPassword" 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              placeholder="Confirm new password"
            />
          </div>

          <div className="flex space-x-2 pt-2">
            <Button onClick={handleSave} className="flex items-center">
              <Save className="h-4 w-4 mr-1" />
              Save Changes
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsEditing(false);
                setName(user.user_metadata?.name || '');
                setPassword('');
                setConfirmPassword('');
              }}
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button variant="ghost" size="sm" onClick={() => logout()}>
          <LogOut className="h-4 w-4 mr-1" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default UserProfile;
