import React, { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Divider
} from '@mui/material';

const CourseSelect = ({ value, onChange, university, degreeType }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState([]);
  const [showCustomInput, setShowCustomInput] = useState(false);

  useEffect(() => {
    if (university && degreeType) {
      const universityCourses = UNIVERSITY_DATA[university]?.courses?.[degreeType] || [];
      setCourses(universityCourses);
    }
  }, [university, degreeType]);

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue === 'custom') {
      setShowCustomInput(true);
    } else {
      setShowCustomInput(false);
      onChange({ target: { value: selectedValue } });
    }
  };

  const filteredCourses = courses.filter(course =>
    course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <FormControl fullWidth required>
        <InputLabel>Course Name</InputLabel>
        <Select
          value={showCustomInput ? 'custom' : value}
          label="Course Name"
          onChange={handleChange}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 400
              }
            }
          }}
        >
          <MenuItem sx={{ p: 0 }}>
            <TextField
              size="small"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => {
                e.stopPropagation();
                setSearchTerm(e.target.value);
              }}
              onClick={(e) => e.stopPropagation()}
              fullWidth
              sx={{ p: 1 }}
            />
          </MenuItem>
          <Divider />
          {filteredCourses.map((course) => (
            <MenuItem key={course} value={course}>
              {course}
            </MenuItem>
          ))}
          <Divider />
          <MenuItem value="custom">Add Custom Course</MenuItem>
        </Select>
      </FormControl>
      {showCustomInput && (
        <TextField
          fullWidth
          label="Enter Course Name"
          value={value}
          onChange={onChange}
          margin="normal"
          size="small"
        />
      )}
    </Box>
  );
};

export default CourseSelect; 