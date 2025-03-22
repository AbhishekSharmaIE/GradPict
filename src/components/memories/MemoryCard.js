import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  Button,
  Box,
  Chip,
  Divider
} from '@mui/material';
import { Edit, Delete, Public, Lock, School } from '@mui/icons-material';

const MemoryCard = ({ memory, onEdit, onDelete }) => {
  const getPrivacyIcon = () => {
    switch (memory.privacy) {
      case 'public':
        return <Public />;
      case 'university':
        return <School />;
      default:
        return <Lock />;
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {memory.image && (
        <CardMedia
          component="img"
          height="200"
          image={memory.image}
          alt={memory.title}
          sx={{ objectFit: 'cover' }}
        />
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {memory.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {memory.content}
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {memory.university} - Class of {memory.graduation_year}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Chip 
              icon={getPrivacyIcon()}
              label={memory.privacy}
              size="small"
              color={memory.privacy === 'public' ? 'primary' : 'default'}
            />
            <Typography variant="caption" color="text.secondary">
              {new Date(memory.created_at).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
      </CardContent>
      <CardActions>
        <Button 
          size="small" 
          startIcon={<Edit />}
          onClick={() => onEdit(memory)}
        >
          Edit
        </Button>
        <Button 
          size="small" 
          color="error"
          startIcon={<Delete />}
          onClick={() => onDelete(memory.id)}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default MemoryCard; 