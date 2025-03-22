import React, { useState, useEffect } from 'react';
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
  Grid,
  CardMedia
} from '@mui/material';
import api from '../../services/api';
import { 
  IRISH_UNIVERSITIES, 
  GRADUATION_YEARS, 
  DEGREE_TYPES,
  UNIVERSITY_DATA 
} from '../../utils/constants';
import { validateUniversityEmail, getUniversityCourses } from '../../utils/universityData';
import UniversityLogo from '../common/UniversityLogo';
import { CloudUploadIcon } from '@mui/icons-material';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    university: '',
    college_name: '',
    graduation_year: '',
    degree_type: '',
    course_name: '',
    profile_photo: null,
    bio: ''
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestedCourses, setSuggestedCourses] = useState([]);
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    if (formData.university && formData.degree_type) {
      const courses = getUniversityCourses(formData.university, formData.degree_type);
      setSuggestedCourses(courses);
    }
  }, [formData.university, formData.degree_type]);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, profile_photo: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setFormData({ ...formData, email: email });
    
    if (email && formData.university) {
      const isValid = validateUniversityEmail(email, formData.university);
      setEmailError(isValid ? '' : `Please use your ${formData.university} email address`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate course
    if (!formData.course_name) {
      setError('Please select or enter a course name');
      setLoading(false);
      return;
    }

    if (emailError) {
      setError('Please use your university email address');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const userData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== 'confirmPassword' && formData[key]) {
          userData.append(key, formData[key]);
        }
      });

      const response = await api.post('/register/', userData);
      
      // Login after successful registration
      const loginResponse = await api.post('/token/', {
        username: formData.username,
        password: formData.password
      });

      localStorage.setItem('access_token', loginResponse.data.access);
      localStorage.setItem('refresh_token', loginResponse.data.refresh);
      api.defaults.headers.common['Authorization'] = `Bearer ${loginResponse.data.access}`;
      
      navigate('/memories');
    } catch (error) {
      setError(error.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const getUniversityColor = (university) => {
    return UNIVERSITY_DATA[university]?.primaryColor || '#1976d2';
  };

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ 
        mt: 4, 
        mb: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center' 
      }}>
        {formData.university && (
          <UniversityLogo 
            university={formData.university} 
            size={80} 
          />
        )}
        <Typography 
          component="h1" 
          variant="h4" 
          align="center" 
          gutterBottom
          sx={{ 
            color: formData.university ? 
              getUniversityColor(formData.university) : 
              'text.primary',
            mt: 2
          }}
        >
          Create Your Account
          {formData.university && (
            <Typography variant="subtitle1" align="center">
              at {formData.university}
            </Typography>
          )}
        </Typography>
      </Box>
      <Paper elevation={3} sx={{ p: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Username"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                error={!!error}
                helperText={error}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleEmailChange}
                error={!!emailError}
                helperText={emailError}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                error={!!error}
                helperText={error}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                error={!!error}
                helperText={error}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="University"
                value={formData.university}
                onChange={(e) => setFormData({...formData, university: e.target.value})}
                error={!!error}
                helperText={error}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="College Name"
                value={formData.college_name}
                onChange={(e) => setFormData({...formData, college_name: e.target.value})}
                error={!!error}
                helperText={error}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Graduation Year"
                type="number"
                value={formData.graduation_year}
                onChange={(e) => setFormData({...formData, graduation_year: e.target.value})}
                error={!!error}
                helperText={error}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Degree Type"
                value={formData.degree_type}
                onChange={(e) => setFormData({...formData, degree_type: e.target.value})}
                error={!!error}
                helperText={error}
              >
                <MenuItem value="Bachelor's">Bachelor's</MenuItem>
                <MenuItem value="Master's">Master's</MenuItem>
                <MenuItem value="PhD">PhD</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Course Name"
                value={formData.course_name}
                onChange={(e) => setFormData({...formData, course_name: e.target.value})}
                error={!!error}
                helperText={error}
              />
            </Grid>
            <Grid item xs={12}>
              {previewUrl && (
                <Box sx={{ mb: 2 }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={previewUrl}
                    alt="Profile Preview"
                    sx={{ 
                      objectFit: 'cover',
                      borderRadius: '50%',
                      width: 200,
                      margin: '0 auto'
                    }}
                  />
                </Box>
              )}
              <Button
                component="label"
                variant="outlined"
                fullWidth
                startIcon={<CloudUploadIcon />}
              >
                Upload Profile Photo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Bio"
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Register; 