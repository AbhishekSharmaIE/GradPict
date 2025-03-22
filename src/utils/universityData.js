export const UNIVERSITY_DATA = {
  'Trinity College Dublin (TCD)': {
    domain: 'tcd.ie',
    logo: '/logos/tcd.png',
    primaryColor: '#2A5669',
    courses: {
      'bachelors': [
        'Computer Science',
        'Business Studies',
        'Engineering',
        'Medicine',
        'Law',
        'Arts and Humanities',
        'Psychology',
        'Biochemistry',
        'Physics'
      ],
      'masters': [
        'Computer Science (M.Sc.)',
        'Business Administration (MBA)',
        'Engineering (M.Eng.)',
        'International Politics',
        'Data Science',
        'Artificial Intelligence'
      ]
    }
  },
  'University College Dublin (UCD)': {
    domain: 'ucd.ie',
    logo: '/logos/ucd.png',
    primaryColor: '#004B87',
    courses: {
      'bachelors': [
        'Business and Law',
        'Computer Science',
        'Engineering',
        'Architecture',
        'Medicine',
        'Veterinary Medicine',
        'Social Science'
      ],
      'masters': [
        'Data Analytics',
        'Digital Innovation',
        'Management',
        'Engineering',
        'Computer Science',
        'Finance'
      ]
    }
  },
  'Dublin City University (DCU)': {
    domain: 'dcu.ie',
    logo: '/logos/dcu.png',
    primaryColor: '#004B87',
    courses: {
      'bachelors': [
        'Computing',
        'Business Studies',
        'Communications',
        'Engineering',
        'Science Education'
      ],
      'masters': [
        'Cloud Computing',
        'Digital Marketing',
        'Business Administration',
        'Journalism'
      ]
    }
  }
  // Add more universities...
};

export const validateUniversityEmail = (email, university) => {
  const universityData = UNIVERSITY_DATA[university];
  if (!universityData) return true;
  
  const emailDomain = email.split('@')[1];
  const validDomains = Array.isArray(universityData.domain) 
    ? universityData.domain 
    : [universityData.domain];
  
  return validDomains.includes(emailDomain);
};

export const getUniversityCourses = (university, degreeType, searchTerm = '') => {
  const universityData = UNIVERSITY_DATA[university];
  if (!universityData || !universityData.courses[degreeType]) {
    return [];
  }
  
  const courses = universityData.courses[degreeType];
  if (!searchTerm) return courses;
  
  return courses.filter(course => 
    course.toLowerCase().includes(searchTerm.toLowerCase())
  );
}; 