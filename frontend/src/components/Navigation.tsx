import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LogoutIcon from '@mui/icons-material/Logout';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navigation: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AppBar 
      position="static" 
      sx={{ 
        background: isDarkMode 
          ? 'linear-gradient(45deg, #000000 30%, #333333 90%)'
          : 'linear-gradient(45deg, #FFFFFF 30%, #F5F5F5 90%)',
        boxShadow: isDarkMode 
          ? '0 3px 5px 2px rgba(0, 0, 0, .3)'
          : '0 3px 5px 2px rgba(0, 0, 0, .1)',
        borderBottom: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'}`,
      }}
    >
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontWeight: 'bold',
            letterSpacing: '0.5px',
            color: isDarkMode ? 'white' : 'black',
          }}
        >
          Task & Expense Manager
        </Typography>
        <Button 
          color="inherit" 
          component={RouterLink} 
          to="/"
          startIcon={<HomeIcon />}
          sx={{ 
            mr: 2,
            color: isDarkMode ? 'white' : 'black',
            '&:hover': {
              backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
            }
          }}
        >
          Home
        </Button>
        <Button 
          color="inherit" 
          component={RouterLink} 
          to="/todo"
          startIcon={<CheckBoxIcon />}
          sx={{ 
            mr: 2,
            color: isDarkMode ? 'white' : 'black',
            '&:hover': {
              backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
            }
          }}
        >
          Todo
        </Button>
        <Button 
          color="inherit" 
          component={RouterLink} 
          to="/expenses"
          startIcon={<AccountBalanceWalletIcon />}
          sx={{ 
            mr: 2,
            color: isDarkMode ? 'white' : 'black',
            '&:hover': {
              backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
            }
          }}
        >
          Expenses
        </Button>
        <ThemeToggle />
        <Button 
          color="inherit" 
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
          sx={{ 
            ml: 2,
            color: isDarkMode ? 'white' : 'black',
            '&:hover': {
              backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
            }
          }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation; 