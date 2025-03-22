export const IRISH_UNIVERSITIES = [
  // Universities
  'Trinity College Dublin (TCD)',
  'University College Dublin (UCD)',
  'University College Cork (UCC)',
  'National University of Ireland Galway (NUI Galway)',
  'University of Limerick (UL)',
  'Dublin City University (DCU)',
  'Maynooth University',
  'Technological University Dublin (TU Dublin)',
  'Royal College of Surgeons in Ireland (RCSI)',
  'University of Dublin',
  'National College of Art and Design (NCAD)',

  // Institutes of Technology
  'Dublin Institute of Technology (DIT)',
  'Cork Institute of Technology (CIT)',
  'Limerick Institute of Technology (LIT)',
  'Waterford Institute of Technology (WIT)',
  'Athlone Institute of Technology (AIT)',
  'Galway-Mayo Institute of Technology (GMIT)',
  'Institute of Technology Carlow (IT Carlow)',
  'Institute of Technology Tralee (IT Tralee)',
  'Letterkenny Institute of Technology (LYIT)',
  'Dundalk Institute of Technology (DkIT)',
  'Technological University of the Shannon (TUS)',
  'Institute of Art, Design, and Technology (IADT)',

  // Other Institutions
  'Royal Irish Academy of Music (RIAM)',
  'Dublin Business School (DBS)',
  'Griffith College Dublin',
  'Shannon College of Hotel Management',
  'Carysfort College',
  'The College of Insurance',
  'The Conservatory of Music and Drama, Dublin',
  'National College of Ireland (NCI)',
  "St. Angela's College, Sligo (University of Galway)",
  'Marino Institute of Education',
  'The Lir National Academy of Dramatic Art'
];

export const GRADUATION_YEARS = Array.from({ length: 10 }, (_, i) => {
  const year = new Date().getFullYear() + i - 4;
  return year.toString();
});

export const DEGREE_TYPES = [
  { value: 'bachelors', label: "Bachelor's Degree" },
  { value: 'masters', label: "Master's Degree" },
  { value: 'phd', label: 'PhD' },
  { value: 'diploma', label: 'Diploma' },
  { value: 'certificate', label: 'Certificate' },
  { value: 'higher_diploma', label: 'Higher Diploma' },
  { value: 'foundation', label: 'Foundation Degree' }
];

export const UNIVERSITY_DATA = {
  'Trinity College Dublin (TCD)': {
    domain: 'tcd.ie',
    logo: '/logos/tcd.png',
    primaryColor: '#2A5669',
    secondaryColor: '#E4B429',
    courses: {
      'bachelors': [
        'Computer Science',
        'Business Studies',
        'Engineering',
        'Medicine',
        'Law',
        'Arts and Humanities',
        'Psychology',
        'Mathematics',
        'Physics',
        'Chemistry',
        'Biology',
        'History',
        'English Literature',
        'Modern Languages',
        'Philosophy'
      ],
      'masters': [
        'Computer Science (M.Sc.)',
        'Business Administration (MBA)',
        'Engineering (M.Eng.)',
        'International Politics',
        'Data Science',
        'Artificial Intelligence',
        'Digital Innovation',
        'Financial Technology',
        'Biomedical Engineering',
        'Environmental Science'
      ],
      'phd': [
        'Computer Science',
        'Engineering',
        'Business',
        'Sciences',
        'Humanities'
      ]
    }
  },
  'University College Dublin (UCD)': {
    domain: 'ucd.ie',
    logo: '/logos/ucd.png',
    primaryColor: '#004B87',
    secondaryColor: '#00B9E4',
    courses: {
      'bachelors': [
        'Business and Law',
        'Computer Science',
        'Engineering',
        'Architecture',
        'Medicine'
      ],
      'masters': [
        'Data Analytics',
        'Digital Innovation',
        'Management',
        'Engineering'
      ]
    }
  },
  'Dublin City University (DCU)': {
    domain: 'dcu.ie',
    logo: '/logos/dcu.png',
    primaryColor: '#CF2030',
    secondaryColor: '#8C1D40',
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
  // Add more universities with their data...
};

// Add a helper function to get courses
export const getUniversityCourses = (university, degreeType) => {
  return UNIVERSITY_DATA[university]?.courses?.[degreeType] || [];
}; 