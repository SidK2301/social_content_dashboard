## Live Demo
The project is deployed here:  
https://SidK2301.github.io/social_content_dashboard/




# Social Content Dashboard

A demo full-stack web application built with Django + PostgreSQL (backend) and React (frontend).  
Developed as part of a Full Stack Data Engineer assessment.

---

## Features

- CRUD (Create, Read, Update, Delete) for posts via REST APIs.
- PostgreSQL database for persistent storage.
- External API integration:
  - Fetches demo posts from JSONPlaceholder and stores them in the database.
- Data visualization:
  - Bar charts showing posts per platform and posts per keyword.
- Clean responsive frontend with React.

---

## Tech Stack

- Backend: Django, Django REST Framework
- Database: PostgreSQL
- Frontend: React, Chart.js, React-Select
- External API: JSONPlaceholder (https://jsonplaceholder.typicode.com/)

---

## Setup Instructions

### Backend (Django + PostgreSQL)

Navigate to the project root:

```powershell
cd C:\Users\Siddhi\social_content_dashboard
```

Create and activate the virtual environment:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

Apply migrations:

```powershell
python manage.py makemigrations
python manage.py migrate
```

Run the server:

```powershell
python manage.py runserver 0.0.0.0:8000
```

The backend will be available at:  
`http://localhost:8000/api/`

---

### Frontend (React)

Navigate to the frontend folder:

```powershell
cd C:\Users\Siddhi\social_content_dashboard\frontend
```

Install dependencies:

```powershell
npm install
```

Run the frontend server:

```powershell
npm start
```

The frontend will be available at:  
`http://localhost:3000`

---

## Usage

### From the Frontend
- Add a new post by filling out the form and submitting.
- Edit or delete posts directly from the grid.
- Click **Import External Posts** to fetch 5 demo posts from JSONPlaceholder.  
  These posts will appear in the grid with platform = `ExternalAPI` and keyword = `sample`.
- Charts automatically update to show:
  - Posts per Platform
  - Posts per Keyword

### From the API
- `GET /api/posts/` - list posts
- `POST /api/posts/` - create a new post
- `PUT /api/posts/<id>/` - update an existing post
- `DELETE /api/posts/<id>/` - delete a post
- `GET /api/keywords/` - list keywords
- `POST /api/fetch-external-posts/` - import 5 demo posts from JSONPlaceholder

**Note:** JSONPlaceholder returns dummy text (sometimes lorem-style or non-English).  
This is expected and demonstrates real API integration.

---

## Author

Siddhi Kore
