import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AuthPage from './pages/AuthPage';
import WelcomePage from './pages/WelcomePage';
import Dashboard from './pages/Dashboard';

import Background3D from './components/Background3D';

import MyTrips from './pages/MyTrips';
import TripDetails from './pages/TripDetails';

const Protected = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/" replace />;
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Background3D />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/welcome" element={<Protected><WelcomePage /></Protected>} />
            <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
            <Route path="/my-trips" element={<Protected><MyTrips /></Protected>} />
            <Route path="/trips/:id" element={<Protected><TripDetails /></Protected>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
