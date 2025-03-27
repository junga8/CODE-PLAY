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
  Checkbox,
  useTheme,
  Alert,
  Snackbar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useTheme as useCustomTheme } from '../context/ThemeContext';

interface Todo {
  _id: string;
  text: string;
  completed: boolean;
}

const Todo = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const { isDarkMode } = useCustomTheme();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch('http://localhost:9999/api/todos');
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
      setError('Failed to fetch todos. Please check if the server is running.');
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;

    try {
      const response = await fetch('http://localhost:9999/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newTodo, completed: false }),
      });

      if (!response.ok) {
        throw new Error('Failed to add todo');
      }

      const newTodoItem = await response.json();
      setTodos([newTodoItem, ...todos]);
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error);
      setError('Failed to add todo. Please check if the server is running.');
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      const response = await fetch(`http://localhost:9999/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !completed }),
      });

      if (!response.ok) {
        throw new Error('Failed to update todo');
      }

      setTodos(
        todos.map((todo) =>
          todo._id === id ? { ...todo, completed: !completed } : todo
        )
      );
    } catch (error) {
      console.error('Error toggling todo:', error);
      setError('Failed to update todo. Please check if the server is running.');
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:9999/api/todos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }

      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
      setError('Failed to delete todo. Please check if the server is running.');
    }
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo._id);
    setEditingText(todo.text);
  };

  const saveEdit = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:9999/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: editingText }),
      });

      if (!response.ok) {
        throw new Error('Failed to update todo');
      }

      setTodos(
        todos.map((todo) =>
          todo._id === id ? { ...todo, text: editingText } : todo
        )
      );
      setEditingId(null);
    } catch (error) {
      console.error('Error updating todo:', error);
      setError('Failed to update todo. Please check if the server is running.');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      addTodo();
    }
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
          maxWidth: 800,
          mx: 'auto',
          p: 3,
          background: isDarkMode ? '#1E1E1E' : '#FFFFFF',
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            color: isDarkMode ? 'white' : 'black',
            fontWeight: 'bold',
            mb: 3,
          }}
        >
          Todo List
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Add a new todo..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{
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
          <Button
            variant="contained"
            onClick={addTodo}
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
            Add
          </Button>
        </Box>

        <List>
          {todos.map((todo) => (
            <ListItem
              key={todo._id}
              sx={{
                mb: 1,
                backgroundColor: isDarkMode ? '#2C2C2C' : '#F5F5F5',
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: isDarkMode ? '#3C3C3C' : '#E0E0E0',
                },
              }}
            >
              <Checkbox
                checked={todo.completed}
                onChange={() => toggleTodo(todo._id, todo.completed)}
                sx={{
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                  '&.Mui-checked': {
                    color: isDarkMode ? '#FFFFFF' : '#000000',
                  },
                }}
              />
              {editingId === todo._id ? (
                <TextField
                  fullWidth
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onBlur={() => saveEdit(todo._id)}
                  onKeyPress={(e) => e.key === 'Enter' && saveEdit(todo._id)}
                  autoFocus
                  sx={{
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
              ) : (
                <ListItemText
                  primary={todo.text}
                  sx={{
                    '& .MuiListItemText-primary': {
                      color: isDarkMode ? 'white' : 'black',
                      textDecoration: todo.completed ? 'line-through' : 'none',
                      opacity: todo.completed ? 0.7 : 1,
                      fontWeight: 500,
                    },
                  }}
                />
              )}
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => startEditing(todo)}
                  sx={{ 
                    mr: 1, 
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={() => deleteTodo(todo._id)}
                  sx={{ 
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
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

export default Todo; 