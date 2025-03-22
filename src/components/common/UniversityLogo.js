import React from 'react';
import { Avatar } from '@mui/material';
import { UNIVERSITY_DATA } from '../../utils/constants';

const UniversityLogo = ({ university, size = 40 }) => {
  const universityData = UNIVERSITY_DATA[university] || {};
  
  return (
    <Avatar
      src={universityData.logo}
      alt={university}
      sx={{ 
        width: size, 
        height: size,
        border: '1px solid #eee'
      }}
    >
      {university?.charAt(0)}
    </Avatar>
  );
};

export default UniversityLogo; 