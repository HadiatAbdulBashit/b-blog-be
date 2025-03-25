# B-Blog BE Documentation

## Overview

This project is a api application that allows users to manage simple blog like posts and comments with authentication. The application provides features such as search, sorting, pagination, and CRUD operations for posts and comments.

## Technologies Used

- **Backend:** Bun, Hono, Prisma
- **Database:** SQLite
- **Authentication:** JWT

## Features

- User authentication (login, register, and logout)
- Create, update, delete, and view posts
- Commenting system with edit and delete functionality
- Search and filter posts based on title and content
- Pagination for posts

## Installation

### Prerequisites

- Bun installed

### Backend Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/HadiatAbdulBashit/b-blog-be.git
   cd b-blog-be
   ```
2. Install dependencies:
   ```sh
   bun install
   # Or
   bun add
   ```
3. Set up environment variables in `.env`:
   ```sh
   DATABASE_URL=<your_database_url> #ex: "file:./big_blog.db"
   FRONTEND_CORS_URL=<your_frontend_url>
   JWT_SECRET=<your_jwt_secret>
   ```
4. Run database migrations:
   ```sh
   bunx prisma migrate dev
   ```
5. Start the backend server:
   ```sh
   bun run dev
   ```

## API Endpoints

### Authentication

- `POST /register` - Register a new user
- `POST /login` - Authenticate a user
- `POST /logout` - Logout a user

### Posts

- `GET /posts` - Get all posts with search, sorting, and pagination
- `GET /posts/my` - Get all posts only created by user
- `GET /posts/:id` - Get posts with by id
- `POST /posts` - Create a new post
- `PUT /posts/:id` - Update a post
- `DELETE /posts/:id` - Delete a post

### Comments

- `GET /comments/:postId` - Get comments for a post
- `POST /comments` - Add a comment
- `PUT /comments/:id` - Edit a comment
- `DELETE /comments/:id` - Delete a comment

## Usage

- Users can browse and search for posts.
- Registered users can create, edit, and delete posts and comments.
- Comments are linked to posts and can be managed accordingly.

## Info

- This project is already integrated with https://github.com/HadiatAbdulBashit/b-blog-fe
- You can try hit the api whit Thunder client collection on documentation folder
