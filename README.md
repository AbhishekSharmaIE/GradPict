# GradPict - Irish University Yearbook Platform

GradPict is a modern web platform designed to help Irish university students create and share their graduation memories. The platform allows students to upload photos, share memories, and connect with fellow graduates from their university.

## Features

- User registration and authentication
- Profile management with university and course information
- Memory creation with multiple photo uploads
- Privacy settings for memories
- University-specific content filtering
- Modern, responsive UI
- Support for all major Irish universities

## Tech Stack

- Backend: Django 5.1.7
- Frontend: React with Material UI
- Database: SQLite (development)
- File Storage: Local storage (development)

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/yourusername/gradpict.git
cd gradpict
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run migrations:
```bash
python manage.py migrate
```

5. Create a superuser (optional):
```bash
python manage.py createsuperuser
```

6. Run the development server:
```bash
python manage.py runserver
```

7. In a new terminal, start the frontend development server:
```bash
cd frontend
npm install
npm start
```

## Accessing the Application

- Frontend: http://localhost:3003
- Backend API: http://127.0.0.1:8000/api/
- Django Admin: http://127.0.0.1:8000/admin/

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Irish Universities list provided by the Higher Education Authority
- Material UI for the frontend components
- Django REST framework for the API