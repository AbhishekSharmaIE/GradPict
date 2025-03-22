import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CardMedia,
  CircularProgress
} from '@mui/material';
import api from '../../services/api';

const EditMemory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [memory, setMemory] = useState({
    title: '',
    content: '',
    privacy: 'public',
    image: null
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchMemory = async () => {
      try {
        const response = await api.get(`/memories/${id}/`);
        const memoryData = response.data;
        setMemory(memoryData);
        if (memoryData.image) {
          setPreviewUrl(memoryData.image);
        }
      } catch (error) {
        setError('Failed to fetch memory details');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchMemory();
  }, [id]);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setMemory({ ...memory, image: file });
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('title', memory.title);
    formData.append('content', memory.content);
    formData.append('privacy', memory.privacy);
    if (memory.image instanceof File) {
      formData.append('image', memory.image);
    }

    try {
      await api.patch(`/memories/${id}/update/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/memories');
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to update memory');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Memory
        </Typography>
        <Paper elevation={3} sx={{ p: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Title"
              value={memory.title}
              onChange={(e) => setMemory({ ...memory, title: e.target.value })}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              multiline
              rows={4}
              label="Content"
              value={memory.content}
              onChange={(e) => setMemory({ ...memory, content: e.target.value })}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Privacy</InputLabel>
              <Select
                value={memory.privacy}
                label="Privacy"
                onChange={(e) => setMemory({ ...memory, privacy: e.target.value })}
              >
                <MenuItem value="public">Public</MenuItem>
                <MenuItem value="private">Private</MenuItem>
              </Select>
            </FormControl>

            {previewUrl && (
              <Box sx={{ mt: 2, mb: 2 }}>
                <CardMedia
                  component="img"
                  height="300"
                  image={previewUrl}
                  alt="Preview"
                  sx={{ 
                    objectFit: 'cover',
                    borderRadius: 1,
                    boxShadow: 1
                  }}
                />
              </Box>
            )}

            <Button
              variant="contained"
              component="label"
              sx={{ mt: 2 }}
            >
              {previewUrl ? 'Change Image' : 'Upload Image'}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                fullWidth
              >
                {loading ? 'Updating...' : 'Update Memory'}
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/memories')}
              >
                Cancel
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default EditMemory; 