import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';
import api from '../../services/api';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    university: '',
    graduation_year: '',
    degree_type: '',
    course_name: '',
    bio: '',
    profile_photo: null
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profile/');
      setProfile(response.data);
      setFormData(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load profile');
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setFormData({ ...formData, profile_photo: e.target.files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      await api.patch('/profile/', formDataToSend);
      setSuccess('Profile updated successfully');
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            My Profile
          </Typography>
          <Button
            variant="contained"
            startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
            onClick={() => isEditing ? handleSubmit() : setIsEditing(true)}
            disabled={loading}
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} display="flex" justifyContent="center">
            <Box position="relative">
              <Avatar
                src={profile?.profile_photo}
                sx={{ width: 150, height: 150 }}
              />
              {isEditing && (
                <Button
                  component="label"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: 'white',
                    '&:hover': {
                      backgroundColor: 'grey.100'
                    }
                  }}
                >
                  Change Photo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
              )}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Username"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              disabled={!isEditing}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              value={formData.email}
              disabled
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="University"
              value={formData.university}
              disabled={!isEditing}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Graduation Year"
              value={formData.graduation_year}
              disabled={!isEditing}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Degree Type"
              value={formData.degree_type}
              disabled={!isEditing}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Course Name"
              value={formData.course_name}
              disabled={!isEditing}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Bio"
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              disabled={!isEditing}
            />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile; 