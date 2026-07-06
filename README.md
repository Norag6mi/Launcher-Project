# Lightweight Game Distribution and Patch Management Platform

A desktop game launcher built with Electron, React, FastAPI, and Unity that allows users to authenticate, install games, receive updates, and launch games through a modern desktop application.

This project was developed as a Final Year Engineering Project while also serving as a portfolio project demonstrating full-stack desktop application development, backend API design, Docker containerization, and deployment practices.

---

## Features

- User Registration & Login
- JWT Authentication
- Secure Backend API
- Browse Available Games
- One-Click Installation
- Download Progress Tracking
- Automatic Update Detection
- Release Notes Viewer
- Launch Installed Games
- Uninstall Games
- Persistent Installation Metadata
- Dockerized Backend
- MySQL Database
- Direct Game Downloads from GitHub Releases

---

## Screenshots

(Add screenshots here later)

Example:

- Login Screen
- Library Page
- Installation Progress
- Release Notes
- Update Available Dialog

---

## Project Architecture

```
                +----------------+
                | Electron App   |
                | React + Vite   |
                +-------+--------+
                        |
                  HTTPS Requests
                        |
                +-------v--------+
                | FastAPI Server |
                +-------+--------+
                        |
                 SQLAlchemy ORM
                        |
                +-------v--------+
                | MySQL Database |
                +----------------+

                        |

            GitHub Releases (Game Files)
```

Unlike many game launchers, the backend **does not serve large game files**.

Instead:

- The backend manages authentication and metadata.
- Game binaries are hosted on GitHub Releases.
- The launcher downloads game files directly from GitHub Releases.

This greatly reduces backend bandwidth requirements.

---

## Tech Stack

### Frontend

- React
- Electron
- Vite

### Backend

- FastAPI
- SQLAlchemy
- JWT Authentication
- Pydantic

### Database

- MySQL

### Desktop

- Electron IPC
- electron-store

### Game

- Unity

### DevOps

- Docker
- Docker Compose

### Planned

- Nginx
- HTTPS
- Oracle Cloud Deployment
- GitHub Actions CI/CD

---

## Project Structure

```
Project/

├── Backend/
│   ├── app/
│   ├── Dockerfile
│   └── requirements.txt
│
├── Docker/
│   └── docker-compose.yml
│
├── Launcher/
│   ├── electron/
│   └── src/
│
└── UnityGame/
```

---

## Current Features

### Authentication

- Register
- Login
- JWT Tokens
- Protected Routes

### Game Management

- Install Games
- Launch Games
- Update Games
- Uninstall Games
- Release Notes

### Launcher

- Persistent Installation State
- Download Progress
- ZIP Extraction
- Executable Detection

### Backend

- User Management
- Game Metadata
- Version Checking
- Release Notes API

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/yourusername/Launcher-Project.git
```

### Backend

Create a `.env` file inside the `Backend` directory:

```env
DB_USER=root
DB_PASSWORD=yourpassword
DB_HOST=mysql
DB_PORT=3306
DB_NAME=game_launcher

SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

Start Docker:

```bash
docker compose up
```

Backend will be available at:

```
http://localhost:8000
```

---

## API Overview

| Endpoint | Description |
|-----------|-------------|
| POST /register | Register a user |
| POST /login | Login |
| GET /profile | User profile |
| GET /games | List available games |
| GET /versions | Game versions |
| GET /check-update | Check for updates |

---

## Development Status

### Completed

- Desktop Launcher
- Authentication
- Game Installation
- Automatic Updates
- Persistent Installations
- Dockerized Backend
- MySQL Integration

### In Progress

- Production Deployment
- Nginx Configuration
- HTTPS
- Oracle Cloud Hosting
- GitHub Actions

---

## Future Improvements

- Multiple Game Support
- Delta Patch Downloads
- Download Resume
- User Profiles
- Game Statistics
- Cloud Save Support
- Admin Dashboard

---

## Learning Outcomes

This project demonstrates practical experience with:

- Full-Stack Development
- REST API Design
- Desktop Application Development
- Docker Containerization
- SQL Database Design
- Authentication using JWT
- IPC Communication in Electron
- Software Deployment
- Version Management Systems

---

## License

This project is intended for educational and portfolio purposes.
