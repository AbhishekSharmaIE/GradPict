import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Grid
} from '@mui/material';
import api from '../../services/api';
import { IRISH_UNIVERSITIES, GRADUATION_YEARS } from '../../utils/constants';

const CreateMemory = () => {
  const navigate = useNavigate();
  const [memory, setMemory] = useState({
    title: '',
    content: '',
    privacy: 'university',
    image: null,
    university: '',
    graduation_year: ''
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setMemory({ ...memory, image: file });
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Cleanup preview URL when component unmounts
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!memory.university || !memory.graduation_year) {
      setError('Please select both university and graduation year');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', memory.title);
    formData.append('content', memory.content);
    formData.append('privacy', memory.privacy);
    formData.append('university', memory.university);
    formData.append('graduation_year', memory.graduation_year);
    if (memory.image) {
      formData.append('image', memory.image);
    }

    try {
      await api.post('/memories/create/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/memories');
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to create memory');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Memory
        </Typography>
        <Paper elevation={3} sx={{ p: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>University</InputLabel>
                  <Select
                    value={memory.university}
                    label="University"
                    onChange={(e) => setMemory({ ...memory, university: e.target.value })}
                    required
                  >
                    {IRISH_UNIVERSITIES.map((uni) => (
                      <MenuItem key={uni} value={uni}>
                        {uni}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Graduation Year</InputLabel>
                  <Select
                    value={memory.graduation_year}
                    label="Graduation Year"
                    onChange={(e) => setMemory({ ...memory, graduation_year: e.target.value })}
                    required
                  >
                    {GRADUATION_YEARS.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

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
                <MenuItem value="public">Public (All Users)</MenuItem>
                <MenuItem value="university">University Only</MenuItem>
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
              {memory.image ? 'Change Image' : 'Upload Image'}
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
                {loading ? 'Creating...' : 'Create Memory'}
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

export default CreateMemory; 