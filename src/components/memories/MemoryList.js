import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  Fab
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import api from '../../services/api';
import MemoryCard from './MemoryCard';

const MemoryList = () => {
  const navigate = useNavigate();
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMemories = async () => {
    try {
      const response = await api.get('/memories/');
      setMemories(response.data.results);
      setError('');
    } catch (error) {
      setError('Failed to fetch memories. Please try again.');
      console.error('Error fetching memories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  const handleEdit = (memory) => {
    navigate(`/memories/${memory.id}/edit`);
  };

  const handleDelete = async (memoryId) => {
    if (window.confirm('Are you sure you want to delete this memory?')) {
      try {
        await api.delete(`/memories/${memoryId}/delete/`);
        setMemories(memories.filter(memory => memory.id !== memoryId));
      } catch (error) {
        setError('Failed to delete memory. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Memories
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {memories.map((memory) => (
          <Grid item key={memory.id} xs={12} sm={6} md={4}>
            <MemoryCard
              memory={memory}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </Grid>
        ))}
      </Grid>

      <Fab
        color="primary"
        aria-label="add memory"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => navigate('/create-memory')}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
};

export default MemoryList; 