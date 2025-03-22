export const validateCourse = (course, university, degreeType) => {
  if (!course) return 'Course is required';
  if (course.length < 2) return 'Course name is too short';
  if (course.length > 100) return 'Course name is too long';
  return '';
}; 