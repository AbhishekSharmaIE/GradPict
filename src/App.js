import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import Login from './components/auth/Login';
import MemoryList from './components/memories/MemoryList';
import CreateMemory from './components/memories/CreateMemory';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import Register from './components/auth/Register';
import EditMemory from './components/memories/EditMemory';
import Profile from './components/profile/Profile';
import VerifyEmail from './components/auth/VerifyEmail';
import { getUniversityTheme } from './utils/universityThemes';

const App = () => {
  const [theme, setTheme] = useState(getUniversityTheme());
  const [currentUniversity, setCurrentUniversity] = useState(null);

  useEffect(() => {
    // Update theme when university changes
    if (currentUniversity) {
      setTheme(getUniversityTheme(currentUniversity));
    }
  }, [currentUniversity]);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Navbar onUniversityChange={setCurrentUniversity} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/memories" element={
            <ProtectedRoute>
              <MemoryList />
            </ProtectedRoute>
          } />
          <Route path="/create-memory" element={
            <ProtectedRoute>
              <CreateMemory />
            </ProtectedRoute>
          } />
          <Route path="/memories/:id/edit" element={
            <ProtectedRoute>
              <EditMemory />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/memories" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App; 