import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  Alert,
  Snackbar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useTheme as useCustomTheme } from '../context/ThemeContext';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useAuth } from '../context/AuthContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Expense {
  _id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

interface Salary {
  amount: number;
  month: string;
}

type FilterType = 'all' | 'month' | '3months' | '6months' | 'year';

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [salary, setSalary] = useState<Salary | null>(null);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: '',
  });
  const [newSalary, setNewSalary] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingExpense, setEditingExpense] = useState<Partial<Expense>>({});
  const [filter, setFilter] = useState<FilterType>('all');
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const { isDarkMode } = useCustomTheme();
  const { token, user } = useAuth();

  useEffect(() => {
    fetchExpenses();
    fetchSalary();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch('http://localhost:9999/api/expenses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch expenses');
      }
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setError('Failed to fetch expenses. Please check if the server is running.');
    }
  };

  const fetchSalary = async () => {
    try {
      const response = await fetch('http://localhost:9999/api/salary', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch salary');
      }
      const data = await response.json();
      setSalary(data);
    } catch (error) {
      console.error('Error fetching salary:', error);
      setError('Failed to fetch salary. Please check if the server is running.');
    }
  };

  const addSalary = async () => {
    if (!newSalary) {
      setError('Please enter a salary amount');
      return;
    }

    try {
      const response = await fetch('http://localhost:9999/api/salary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: parseFloat(newSalary),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add salary');
      }

      const newSalaryData = await response.json();
      setSalary(newSalaryData);
      setNewSalary('');
    } catch (error) {
      console.error('Error adding salary:', error);
      setError(error instanceof Error ? error.message : 'Failed to add salary');
    }
  };

  const addExpense = async () => {
    if (!newExpense.description || !newExpense.amount || !newExpense.category) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:9999/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newExpense,
          amount: parseFloat(newExpense.amount),
          date: new Date(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add expense');
      }

      const newExpenseItem = await response.json();
      setExpenses([newExpenseItem, ...expenses]);
      setNewExpense({
        description: '',
        amount: '',
        category: '',
      });
    } catch (error) {
      console.error('Error adding expense:', error);
      setError('Failed to add expense. Please check if the server is running.');
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:9999/api/expenses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete expense');
      }

      setExpenses(expenses.filter((expense) => expense._id !== id));
    } catch (error) {
      console.error('Error deleting expense:', error);
      setError('Failed to delete expense. Please check if the server is running.');
    }
  };

  const startEditing = (expense: Expense) => {
    setEditingId(expense._id);
    setEditingExpense({
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
    });
  };

  const saveEdit = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:9999/api/expenses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingExpense),
      });

      if (!response.ok) {
        throw new Error('Failed to update expense');
      }

      setExpenses(
        expenses.map((expense) =>
          expense._id === id
            ? { ...expense, ...editingExpense }
            : expense
        )
      );
      setEditingId(null);
    } catch (error) {
      console.error('Error updating expense:', error);
      setError('Failed to update expense. Please check if the server is running.');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      addExpense();
    }
  };

  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    const now = new Date();

    switch (filter) {
      case 'month':
        return expenseDate >= startOfMonth(now) && expenseDate <= endOfMonth(now);
      case '3months':
        return expenseDate >= subMonths(now, 3);
      case '6months':
        return expenseDate >= subMonths(now, 6);
      case 'year':
        return expenseDate >= subMonths(now, 12);
      default:
        return true;
    }
  });

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalSalary = salary?.amount || 0;
  const savings = totalSalary - totalExpenses;

  const categoryTotals = filteredExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const chartData = {
    labels: ['Income', 'Expenses', 'Savings'],
    datasets: [
      {
        label: 'Financial Overview',
        data: [totalSalary, totalExpenses, savings],
        backgroundColor: [
          isDarkMode ? 'rgba(75, 192, 192, 0.8)' : 'rgba(75, 192, 192, 0.6)',
          isDarkMode ? 'rgba(255, 99, 132, 0.8)' : 'rgba(255, 99, 132, 0.6)',
          isDarkMode ? 'rgba(54, 162, 235, 0.8)' : 'rgba(54, 162, 235, 0.6)',
        ],
        borderColor: [
          isDarkMode ? 'rgba(75, 192, 192, 1)' : 'rgba(75, 192, 192, 0.8)',
          isDarkMode ? 'rgba(255, 99, 132, 1)' : 'rgba(255, 99, 132, 0.8)',
          isDarkMode ? 'rgba(54, 162, 235, 1)' : 'rgba(54, 162, 235, 0.8)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: isDarkMode ? 'white' : 'black',
        },
      },
      title: {
        display: true,
        text: 'Financial Overview',
        color: isDarkMode ? 'white' : 'black',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: isDarkMode ? 'white' : 'black',
        },
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        ticks: {
          color: isDarkMode ? 'white' : 'black',
        },
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        p: 3,
        background: isDarkMode ? '#121212' : '#FFFFFF',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          p: 3,
          background: isDarkMode ? '#1E1E1E' : '#FFFFFF',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              color: isDarkMode ? 'white' : 'black',
              fontWeight: 'bold',
            }}
          >
            Expense Tracker
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: isDarkMode ? 'white' : 'black',
              fontWeight: 500,
            }}
          >
            Welcome, {user?.name || 'User'}
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ color: isDarkMode ? 'white' : 'black' }}
          >
            Monthly Salary
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Enter Monthly Salary"
              type="number"
              value={newSalary}
              onChange={(e) => setNewSalary(e.target.value)}
              sx={{
                flex: 1,
                maxWidth: 300,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: isDarkMode ? '#2C2C2C' : '#F5F5F5',
                  '& fieldset': {
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: isDarkMode ? '#FFFFFF' : '#000000',
                  },
                  color: isDarkMode ? 'white' : 'black',
                },
              }}
            />
            <Button
              variant="contained"
              onClick={addSalary}
              disabled={!newSalary}
              sx={{
                px: 4,
                background: isDarkMode
                  ? 'linear-gradient(45deg, #FFFFFF 30%, #E0E0E0 90%)'
                  : 'linear-gradient(45deg, #000000 30%, #333333 90%)',
                color: isDarkMode ? 'black' : 'white',
                '&:hover': {
                  background: isDarkMode
                    ? 'linear-gradient(45deg, #E0E0E0 30%, #FFFFFF 90%)'
                    : 'linear-gradient(45deg, #333333 30%, #000000 90%)',
                },
                '&.Mui-disabled': {
                  background: isDarkMode ? '#666666' : '#CCCCCC',
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                },
              }}
            >
              {salary ? 'Update Salary' : 'Set Salary'}
            </Button>
          </Box>
          {salary && (
            <Typography
              variant="body1"
              sx={{
                mt: 1,
                color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
              }}
            >
              Current monthly salary: ${salary.amount.toFixed(2)}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <TextField
            label="Description"
            value={newExpense.description}
            onChange={(e) =>
              setNewExpense({ ...newExpense, description: e.target.value })
            }
            onKeyPress={handleKeyPress}
            sx={{
              flex: 1,
              minWidth: 200,
              '& .MuiOutlinedInput-root': {
                backgroundColor: isDarkMode ? '#2C2C2C' : '#F5F5F5',
                '& fieldset': {
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                },
                '&:hover fieldset': {
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: isDarkMode ? '#FFFFFF' : '#000000',
                },
                color: isDarkMode ? 'white' : 'black',
                '& input::placeholder': {
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                },
              },
            }}
          />
          <TextField
            label="Amount"
            type="number"
            value={newExpense.amount}
            onChange={(e) =>
              setNewExpense({ ...newExpense, amount: e.target.value })
            }
            onKeyPress={handleKeyPress}
            sx={{
              flex: 1,
              minWidth: 150,
              '& .MuiOutlinedInput-root': {
                backgroundColor: isDarkMode ? '#2C2C2C' : '#F5F5F5',
                '& fieldset': {
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                },
                '&:hover fieldset': {
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: isDarkMode ? '#FFFFFF' : '#000000',
                },
                color: isDarkMode ? 'white' : 'black',
                '& input::placeholder': {
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                },
              },
            }}
          />
          <FormControl sx={{ flex: 1, minWidth: 200 }}>
            <InputLabel sx={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' }}>
              Category
            </InputLabel>
            <Select
              value={newExpense.category}
              onChange={(e) =>
                setNewExpense({ ...newExpense, category: e.target.value })
              }
              label="Category"
              onKeyPress={handleKeyPress}
              sx={{
                backgroundColor: isDarkMode ? '#2C2C2C' : '#F5F5F5',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDarkMode ? '#FFFFFF' : '#000000',
                },
                color: isDarkMode ? 'white' : 'black',
              }}
            >
              <MenuItem value="Food & Dining">Food & Dining</MenuItem>
              <MenuItem value="Transportation">Transportation</MenuItem>
              <MenuItem value="Housing">Housing</MenuItem>
              <MenuItem value="Utilities">Utilities</MenuItem>
              <MenuItem value="Insurance">Insurance</MenuItem>
              <MenuItem value="Healthcare">Healthcare</MenuItem>
              <MenuItem value="Entertainment">Entertainment</MenuItem>
              <MenuItem value="Shopping">Shopping</MenuItem>
              <MenuItem value="Education">Education</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={addExpense}
            sx={{
              px: 4,
              background: isDarkMode
                ? 'linear-gradient(45deg, #FFFFFF 30%, #E0E0E0 90%)'
                : 'linear-gradient(45deg, #000000 30%, #333333 90%)',
              color: isDarkMode ? 'black' : 'white',
              '&:hover': {
                background: isDarkMode
                  ? 'linear-gradient(45deg, #E0E0E0 30%, #FFFFFF 90%)'
                  : 'linear-gradient(45deg, #333333 30%, #000000 90%)',
              },
            }}
          >
            Add Expense
          </Button>
        </Box>

        <Box sx={{ mb: 4 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel sx={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' }}>
              Filter
            </InputLabel>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
              label="Filter"
              sx={{
                backgroundColor: isDarkMode ? '#2C2C2C' : '#F5F5F5',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDarkMode ? '#FFFFFF' : '#000000',
                },
                color: isDarkMode ? 'white' : 'black',
              }}
            >
              <MenuItem value="all">All Time</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
              <MenuItem value="3months">Last 3 Months</MenuItem>
              <MenuItem value="6months">Last 6 Months</MenuItem>
              <MenuItem value="year">Last Year</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              background: isDarkMode ? '#2C2C2C' : '#F5F5F5',
            }}
          >
            <Bar data={chartData} options={chartOptions} />
          </Paper>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              flex: 1,
              minWidth: 200,
              background: isDarkMode ? '#2C2C2C' : '#F5F5F5',
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: isDarkMode ? 'white' : 'black' }}
            >
              Total Income
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color: isDarkMode ? '#4CAF50' : '#2E7D32',
                fontWeight: 'bold',
              }}
            >
              ${totalSalary.toFixed(2)}
            </Typography>
          </Paper>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              flex: 1,
              minWidth: 200,
              background: isDarkMode ? '#2C2C2C' : '#F5F5F5',
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: isDarkMode ? 'white' : 'black' }}
            >
              Total Expenses
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color: isDarkMode ? '#F44336' : '#C62828',
                fontWeight: 'bold',
              }}
            >
              ${totalExpenses.toFixed(2)}
            </Typography>
          </Paper>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              flex: 1,
              minWidth: 200,
              background: isDarkMode ? '#2C2C2C' : '#F5F5F5',
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: isDarkMode ? 'white' : 'black' }}
            >
              Savings
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color: savings >= 0 ? (isDarkMode ? '#2196F3' : '#1565C0') : (isDarkMode ? '#F44336' : '#C62828'),
                fontWeight: 'bold',
              }}
            >
              ${savings.toFixed(2)}
            </Typography>
          </Paper>
        </Box>

        <List>
          {filteredExpenses.map((expense) => (
            <ListItem
              key={expense._id}
              sx={{
                mb: 1,
                backgroundColor: isDarkMode ? '#2C2C2C' : '#F5F5F5',
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: isDarkMode ? '#3C3C3C' : '#E0E0E0',
                },
              }}
            >
              {editingId === expense._id ? (
                <>
                  <TextField
                    label="Description"
                    value={editingExpense.description}
                    onChange={(e) =>
                      setEditingExpense({
                        ...editingExpense,
                        description: e.target.value,
                      })
                    }
                    onBlur={() => saveEdit(expense._id)}
                    onKeyPress={(e) => e.key === 'Enter' && saveEdit(expense._id)}
                    autoFocus
                    sx={{
                      flex: 1,
                      mr: 2,
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'transparent',
                        '& fieldset': {
                          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                        },
                        '&:hover fieldset': {
                          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: isDarkMode ? '#FFFFFF' : '#000000',
                        },
                        color: isDarkMode ? 'white' : 'black',
                      },
                    }}
                  />
                  <TextField
                    label="Amount"
                    type="number"
                    value={editingExpense.amount}
                    onChange={(e) =>
                      setEditingExpense({
                        ...editingExpense,
                        amount: parseFloat(e.target.value),
                      })
                    }
                    onBlur={() => saveEdit(expense._id)}
                    onKeyPress={(e) => e.key === 'Enter' && saveEdit(expense._id)}
                    sx={{
                      width: 150,
                      mr: 2,
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'transparent',
                        '& fieldset': {
                          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                        },
                        '&:hover fieldset': {
                          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: isDarkMode ? '#FFFFFF' : '#000000',
                        },
                        color: isDarkMode ? 'white' : 'black',
                      },
                    }}
                  />
                  <FormControl sx={{ width: 150, mr: 2 }}>
                    <InputLabel sx={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' }}>
                      Category
                    </InputLabel>
                    <Select
                      value={editingExpense.category}
                      onChange={(e) =>
                        setEditingExpense({
                          ...editingExpense,
                          category: e.target.value,
                        })
                      }
                      label="Category"
                      onBlur={() => saveEdit(expense._id)}
                      onKeyPress={(e) => e.key === 'Enter' && saveEdit(expense._id)}
                      sx={{
                        backgroundColor: 'transparent',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: isDarkMode ? '#FFFFFF' : '#000000',
                        },
                        color: isDarkMode ? 'white' : 'black',
                      }}
                    >
                      <MenuItem value="Food & Dining">Food & Dining</MenuItem>
                      <MenuItem value="Transportation">Transportation</MenuItem>
                      <MenuItem value="Housing">Housing</MenuItem>
                      <MenuItem value="Utilities">Utilities</MenuItem>
                      <MenuItem value="Insurance">Insurance</MenuItem>
                      <MenuItem value="Healthcare">Healthcare</MenuItem>
                      <MenuItem value="Entertainment">Entertainment</MenuItem>
                      <MenuItem value="Shopping">Shopping</MenuItem>
                      <MenuItem value="Education">Education</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </>
              ) : (
                <>
                  <ListItemText
                    primary={expense.description}
                    secondary={`${expense.category} • ${format(
                      new Date(expense.date),
                      'MMM d, yyyy'
                    )}`}
                    sx={{
                      '& .MuiListItemText-primary': {
                        color: isDarkMode ? 'white' : 'black',
                        fontWeight: 500,
                      },
                      '& .MuiListItemText-secondary': {
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                      },
                    }}
                  />
                  <ListItemSecondaryAction>
                    <Typography
                      variant="h6"
                      sx={{
                        mr: 2,
                        color: isDarkMode ? 'white' : 'black',
                        fontWeight: 'bold',
                      }}
                    >
                      ${expense.amount.toFixed(2)}
                    </Typography>
                    <IconButton
                      edge="end"
                      onClick={() => startEditing(expense)}
                      sx={{ 
                        mr: 1, 
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => deleteExpense(expense._id)}
                      sx={{ 
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </>
              )}
            </ListItem>
          ))}
        </List>
      </Paper>

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setError(null)} 
          severity="error" 
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ExpenseTracker; 