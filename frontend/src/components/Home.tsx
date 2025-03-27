import React from 'react';
import { Box, Paper, Typography, Container, Button, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import { useNavigate } from 'react-router-dom';
import { useTheme as useCustomTheme } from '../context/ThemeContext';

const MotionBox = motion(Box);

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { isDarkMode } = useCustomTheme();

  const handleGetStarted = () => {
    navigate('/todo');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box
        sx={{
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          background: isDarkMode
            ? 'linear-gradient(135deg, #121212 0%, #1E1E1E 100%)'
            : 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)',
        }}
      >
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
            fontWeight: 700,
            mb: 3,
            textAlign: 'center',
            color: isDarkMode ? 'white' : 'black',
            textShadow: isDarkMode
              ? '2px 2px 4px rgba(0, 0, 0, 0.3)'
              : '2px 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          Welcome to Your
          <br />
          Task & Expense Manager
        </Typography>
        <Typography
          variant="h5"
          sx={{
            mb: 4,
            textAlign: 'center',
            color: isDarkMode ? '#B0B0B0' : '#666666',
            maxWidth: '600px',
          }}
        >
          Stay organized and track your expenses with our intuitive and elegant interface
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={handleGetStarted}
          sx={{
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            borderRadius: '30px',
            textTransform: 'none',
            background: isDarkMode
              ? 'linear-gradient(45deg, #FFFFFF 30%, #E0E0E0 90%)'
              : 'linear-gradient(45deg, #000000 30%, #333333 90%)',
            color: isDarkMode ? 'black' : 'white',
            '&:hover': {
              background: isDarkMode
                ? 'linear-gradient(45deg, #E0E0E0 30%, #FFFFFF 90%)'
                : 'linear-gradient(45deg, #333333 30%, #000000 90%)',
              transform: 'translateY(-2px)',
              boxShadow: isDarkMode
                ? '0 4px 8px rgba(255, 255, 255, 0.2)'
                : '0 4px 8px rgba(0, 0, 0, 0.2)',
            },
            transition: 'all 0.3s ease-in-out',
          }}
        >
          Get Started
        </Button>
      </Box>

      {/* Features Section */}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 4,
        '& > *': { flex: { xs: '100%', md: '1 1 30%' } }
      }}>
        <MotionBox
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Paper
            elevation={2}
            sx={{
              p: 3,
              height: '100%',
              textAlign: 'center',
              backgroundColor: isDarkMode ? '#2C2C2C' : '#FFFFFF',
              borderRadius: 2,
              border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'}`,
              '&:hover': {
                transform: 'translateY(-5px)',
                transition: 'transform 0.3s ease-in-out',
                boxShadow: isDarkMode 
                  ? '0 5px 15px rgba(255, 255, 255, 0.1)'
                  : '0 5px 15px rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 40, color: isDarkMode ? '#FFFFFF' : '#000000', mb: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ color: isDarkMode ? 'white' : 'black' }}>
              Simple & Intuitive
            </Typography>
            <Typography sx={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' }}>
              Easy-to-use interface for managing your tasks efficiently
            </Typography>
          </Paper>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Paper
            elevation={2}
            sx={{
              p: 3,
              height: '100%',
              textAlign: 'center',
              backgroundColor: isDarkMode ? '#2C2C2C' : '#FFFFFF',
              borderRadius: 2,
              border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'}`,
              '&:hover': {
                transform: 'translateY(-5px)',
                transition: 'transform 0.3s ease-in-out',
                boxShadow: isDarkMode 
                  ? '0 5px 15px rgba(255, 255, 255, 0.1)'
                  : '0 5px 15px rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            <SpeedIcon sx={{ fontSize: 40, color: isDarkMode ? '#FFFFFF' : '#000000', mb: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ color: isDarkMode ? 'white' : 'black' }}>
              Fast & Reliable
            </Typography>
            <Typography sx={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' }}>
              Lightning-fast performance with real-time updates
            </Typography>
          </Paper>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Paper
            elevation={2}
            sx={{
              p: 3,
              height: '100%',
              textAlign: 'center',
              backgroundColor: isDarkMode ? '#2C2C2C' : '#FFFFFF',
              borderRadius: 2,
              border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'}`,
              '&:hover': {
                transform: 'translateY(-5px)',
                transition: 'transform 0.3s ease-in-out',
                boxShadow: isDarkMode 
                  ? '0 5px 15px rgba(255, 255, 255, 0.1)'
                  : '0 5px 15px rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            <SecurityIcon sx={{ fontSize: 40, color: isDarkMode ? '#FFFFFF' : '#000000', mb: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ color: isDarkMode ? 'white' : 'black' }}>
              Secure & Private
            </Typography>
            <Typography sx={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' }}>
              Your data is protected with enterprise-grade security
            </Typography>
          </Paper>
        </MotionBox>
      </Box>
    </Container>
  );
};

export default Home; 