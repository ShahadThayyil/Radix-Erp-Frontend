import React, { useState, useEffect } from 'react';

// Public Pages
import LandingPage from './pages/public/LandingPage';

// Auth & Gateway
import AuthGateway from './pages/auth/AuthGateway';

// Dashboards
import AdminHub from "./pages/admin/AdminHub";
import AgentHub from "./pages/agent/AgentHub";
import BusinessHub from "./pages/business/BusinessHub";

const App = () => {
  const [userRole, setUserRole] = useState(null); 
  const [isLoading, setIsLoading] = useState(true);
  // NEW: Controls whether to show the Landing Page or the Login Screen
  const [showAuth, setShowAuth] = useState(false);

  // 1. SESSION & STORAGE SYNC
  useEffect(() => {
    const checkSession = () => {
      const savedUser = localStorage.getItem('vynx_user');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUserRole(parsedUser.role);
        } catch (error) {
          localStorage.removeItem('vynx_user');
        }
      } else {
        setUserRole(null); 
      }
      setIsLoading(false);
    };

    checkSession();

    window.addEventListener('storage', checkSession);
    return () => window.removeEventListener('storage', checkSession);
  }, []);

  // 2. LOGOUT HANDLER
  const handleLogout = () => {
    localStorage.removeItem('vynx_user');
    setUserRole(null);
    setShowAuth(false); // Send them back to Landing Page on logout
  };

  if (isLoading) return null;

  // 3. PUBLIC & AUTH ROUTING
  if (!userRole) {
    // If user clicked a button on Landing Page, show AuthGateway
    if (showAuth) {
      return (
        <AuthGateway onLoginSuccess={(role) => setUserRole(role)} />
      );
    }
    // Default: Show the high-end Landing Page
    return <LandingPage onEnterPortal={() => setShowAuth(true)} />;
  }

  // 4. PRIVATE ROLE-BASED ROUTING (Dashboards)
  switch (userRole) {
    case 'admin':
      return <AdminHub onLogout={handleLogout} />;
    
    case 'business':
      return <BusinessHub onLogout={handleLogout} />;
    
    case 'agent':
      return <AgentHub onLogout={handleLogout} />;
    
    default:
      return <LandingPage onEnterPortal={() => setShowAuth(true)} />;
  }
};

export default App;