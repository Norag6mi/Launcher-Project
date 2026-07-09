# Lightweight Application Distribution and Patch Management Platform

A desktop application launcher built with Electron, React, FastAPI, and Unity that allows users to authenticate, install games, receive updates, and launch games through a modern desktop application.

Backened built with fastapi, uvicorn, sqlalchemy, pymysql, passlib, bcrypt, python-dotenv, email-validator, python-jose, python-multipart

This project demonstrates full-stack desktop application development, backend API design, Docker containerization, and deployment practices.

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
- Bycript

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
- Password Hashing
- Game Metadata
- Version Checking
- Release Notes API

---

## Project Setup

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

## Launcher Installation

- Download the latest version from github releases.
- Run the installer (Allow administrator permissions).
- Signup / Login (Due to low resource allocations , first time login / signup may take upto 1 minute).
- Use the launcher to download, update, manage my applications.

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
- Cloud Hosting

### In Progress

- Automated Production Deployment
- Nginx Configuration
- GitHub Actions

---

## Future Improvements

- Delta Patch Downloads
- Download Resume
- User Profiles
- Game Statistics
- Cloud Save Support

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
- Password hashing using Bycrypt
- Software Deployment
- Version Management Systems

---

## License

This project is intended for educational and portfolio purposes.
