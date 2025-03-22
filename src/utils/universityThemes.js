import { createTheme } from '@mui/material';
import { UNIVERSITY_DATA } from './constants';

export const getUniversityTheme = (university) => {
  const universityData = UNIVERSITY_DATA[university] || {
    primaryColor: '#1976d2',
    secondaryColor: '#dc004e',
    background: '#FFFFFF'
  };

  return createTheme({
    palette: {
      primary: {
        main: universityData.primaryColor,
      },
      secondary: {
        main: universityData.secondaryColor,
      },
      background: {
        default: '#FFFFFF',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
    },
  });
}; 