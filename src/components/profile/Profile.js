import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Grid,
  Chip,
  Divider,
  Button,
  CircularProgress
} from '@mui/material';
import { School, CalendarToday, Class } from '@mui/icons-material';
import api from '../../services/api';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile/');
        setProfile(response.data);
      } catch (error) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Avatar
                  src={profile?.profile_photo}
                  sx={{ width: 200, height: 200, mb: 2 }}
                />
                <Typography variant="h5" gutterBottom>
                  {profile?.username}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {profile?.email}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Academic Information
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip icon={<School />} label={profile?.university} sx={{ mr: 1 }} />
                  <Chip icon={<CalendarToday />} label={`Class of ${profile?.graduation_year}`} sx={{ mr: 1 }} />
                  <Chip icon={<Class />} label={`${profile?.degree_type} - ${profile?.course_name}`} />
                </Box>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Bio
                </Typography>
                <Typography variant="body1" paragraph>
                  {profile?.bio || 'No bio provided'}
                </Typography>
                <Button variant="contained" color="primary">
                  Edit Profile
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default Profile; 