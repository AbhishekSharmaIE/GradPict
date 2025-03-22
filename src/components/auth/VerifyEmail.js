import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Button
} from '@mui/material';
import { CheckCircle, Error } from '@mui/icons-material';
import api from '../../services/api';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await api.get(`/verify-email/${token}/`);
        setStatus('success');
      } catch (error) {
        setStatus('error');
      }
    };

    verifyEmail();
  }, [token]);

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <Box display="flex" flexDirection="column" alignItems="center">
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Verifying your email...
            </Typography>
          </Box>
        );
      case 'success':
        return (
          <Box display="flex" flexDirection="column" alignItems="center">
            <CheckCircle color="success" sx={{ fontSize: 60 }} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Email verified successfully!
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/login')}
              sx={{ mt: 2 }}
            >
              Proceed to Login
            </Button>
          </Box>
        );
      case 'error':
        return (
          <Box display="flex" flexDirection="column" alignItems="center">
            <Error color="error" sx={{ fontSize: 60 }} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Verification failed. Please try again.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/register')}
              sx={{ mt: 2 }}
            >
              Back to Registration
            </Button>
          </Box>
        );
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Email Verification
          </Typography>
          {renderContent()}
        </Paper>
      </Box>
    </Container>
  );
};

export default VerifyEmail; 