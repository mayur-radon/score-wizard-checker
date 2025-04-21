
import { saveUserToMongo } from '@/services/mongoDbService';
import { supabase } from '@/integrations/supabase/client';

export const syncAuthToMongo = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    console.log('Syncing Supabase user to mock MongoDB:', user.id);
    await saveUserToMongo(user.id, user.email || '');
  }
};

export const setupAuthListeners = () => {
  // Set up auth state change listener
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth event:', event);
    
    if (event === 'SIGNED_IN' && session?.user) {
      // Use setTimeout to prevent Supabase deadlock
      setTimeout(() => {
        saveUserToMongo(session.user.id, session.user.email || '');
      }, 0);
    }
  });
  
  return subscription;
};
