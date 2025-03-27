import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';
import { ThemeProvider as CustomThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Todo from './components/Todo';
import ExpenseTracker from './components/ExpenseTracker';
import Login from './components/Login';
import Register from './components/Register';

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const { login } = useAuth();

  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={login} />} />
        <Route path="/register" element={<Register onRegister={login} />} />
        <Route
          path="/todo"
          element={
            <ProtectedRoute>
              <Todo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/expenses"
          element={
            <ProtectedRoute>
              <ExpenseTracker />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <CustomThemeProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppRoutes />
        </ThemeProvider>
      </CustomThemeProvider>
    </AuthProvider>
  );
};

export default App;
