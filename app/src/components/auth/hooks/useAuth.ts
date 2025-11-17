import { useState, useEffect } from 'react';
import { authApi } from '../../../../lib/api/api';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  // Check session on mount
  const checkSession = async () => {
    try {
      const session = await authApi.getSession();
      if (session) {
        setIsLoggedIn(true);
        const profileData = await authApi.getProfile();
        setCurrentUser(profileData.profile);
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
  };

  // Handle auth success
  const handleAuthSuccess = async (user: any) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
    setAuthDialogOpen(false);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await authApi.signOut();
      setIsLoggedIn(false);
      setCurrentUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return {
    // State
    isLoggedIn,
    currentUser,
    authDialogOpen,
    
    // Actions
    setIsLoggedIn,
    setCurrentUser,
    setAuthDialogOpen,
    checkSession,
    handleAuthSuccess,
    handleLogout,
  };
}


