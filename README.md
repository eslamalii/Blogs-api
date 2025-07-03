# NestJS Blogs API

## Features

- **User Authentication**:
- **Role-Based Access Control (RBAC)**:
- **Blog Post Management**:
- **Pagination**:
- **Input Validation**:
- **Error Handling**:
- **Database Relationships**:

## Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: class-validator
- **Password Hashing**: bcrypt

## Installation & Setup

### 1. Clone the repository

```bash
git clone git@github.com:eslamalii/Blogs-api.git
cd blogs-api
```

### 2. Install dependencies

```bash
npm i
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

### 4. Database Setup

```bash
# Start PostgreSQL service (macOS with Homebrew)
brew services start postgresql

# Linux/Ubuntu
sudo systemctl start postgresql

# Windows (PowerShell as Administrator)
Start-Service postgresql

# Create database and user
psql -U postgres

# In PostgreSQL console:
CREATE DATABASE blogs_api;
CREATE USER blogs_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE blogs_api TO blogs_user;
\q
```

### 5. Start the application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`

### Postman Collection

URL: https://documenter.getpostman.com/view/19860605/2sB34Zsjcp

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure PostgreSQL is running
   - Check database credentials in `.env`
   - Verify database exists

2. **JWT Secret Error**
   - Ensure `JWT_SECRET` is set in `.env`
   - Make sure the secret is sufficiently long and random

3. **Permission Denied Errors**
   - Check that you're sending the JWT token in the Authorization header
   - Verify the token hasn't expired
   - Ensure the user has the correct role for the operation
