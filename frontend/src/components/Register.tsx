import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  Snackbar,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

interface RegisterProps {
  onRegister: (token: string, user: any) => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:9999/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      onRegister(data.token, data.user);
      navigate('/expenses');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.palette.mode === 'dark' ? '#121212' : '#f5f5f5',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          background: theme.palette.mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            color: theme.palette.mode === 'dark' ? 'white' : 'black',
            textAlign: 'center',
          }}
        >
          Register
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: theme.palette.mode === 'dark' ? '#2C2C2C' : '#F5F5F5',
                '& fieldset': {
                  borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
                },
                color: theme.palette.mode === 'dark' ? 'white' : 'black',
              },
            }}
          />

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: theme.palette.mode === 'dark' ? '#2C2C2C' : '#F5F5F5',
                '& fieldset': {
                  borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
                },
                color: theme.palette.mode === 'dark' ? 'white' : 'black',
              },
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: theme.palette.mode === 'dark' ? '#2C2C2C' : '#F5F5F5',
                '& fieldset': {
                  borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
                },
                color: theme.palette.mode === 'dark' ? 'white' : 'black',
              },
            }}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: theme.palette.mode === 'dark' ? '#2C2C2C' : '#F5F5F5',
                '& fieldset': {
                  borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
                },
                color: theme.palette.mode === 'dark' ? 'white' : 'black',
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(45deg, #FFFFFF 30%, #E0E0E0 90%)'
                : 'linear-gradient(45deg, #000000 30%, #333333 90%)',
              color: theme.palette.mode === 'dark' ? 'black' : 'white',
              '&:hover': {
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(45deg, #E0E0E0 30%, #FFFFFF 90%)'
                  : 'linear-gradient(45deg, #333333 30%, #000000 90%)',
              },
            }}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Link
              href="/login"
              sx={{
                color: theme.palette.mode === 'dark' ? 'white' : 'black',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Already have an account? Login
            </Link>
          </Box>
        </form>

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default Register; 