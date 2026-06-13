# Bondly Social Media Web App

<p align="center">
  <img src="docs/readme/bondly-landing-page.png" alt="Bondly landing page preview" width="900">
</p>

<p align="center">
  <strong>Connect, share, and grow together with a full-stack social media experience.</strong>
</p>

<p align="center">
  <a href="docs/readme/bondly-project-report-and-screenshots.pdf"><strong>Full View Screenshots and Project Report</strong></a>
</p>

Bondly is my individual full-stack social media web application. I built it as a practical project to bring together the main parts of a real social platform: account registration, email OTP verification, login, profile management, posts, reactions, comments, shares, friends, following, notifications, reviews, and support handling.

The project is split into a Spring Boot backend and a React frontend. The backend handles the REST API, authentication, database work, file uploads, email/OTP flows, and real-time updates. The frontend gives the user-facing screens for signing up, logging in, posting, browsing the feed, managing profiles, and using admin/user support pages.

## Tech Stack

### Backend

- Java 25
- Spring Boot 4.0.2
- Spring Web MVC
- Spring Security
- Spring Data JPA
- PostgreSQL
- JWT authentication with `jjwt`
- BCrypt password hashing
- Java Mail Sender for OTP and email verification
- Server-Sent Events for real-time notifications and support updates
- Lombok
- Maven

### Frontend

- React 19
- Vite
- React Router
- Axios
- Material UI
- MUI Icons
- Lucide React
- Framer Motion
- Styled Components
- CSS files for page styling

## Main Features

- User registration with email OTP verification
- Login with JWT-based authentication
- HTTP-only cookie support for auth tokens
- Password hashing with BCrypt
- Forgot password flow with OTP verification
- Password update from settings
- Email update with OTP verification
- Profile update with first name, last name, profile image, and cover image
- Account deletion with password or OTP confirmation
- Create posts with text and optional images
- View personal posts and feed posts
- Delete own posts
- React to posts with multiple reaction types
- Remove reactions
- View reaction counts
- Add comments to posts
- Reply to comments
- Delete own comments
- Share posts with optional captions
- View shared-post feed
- Follow and unfollow users
- View followers and following lists
- Search users
- Send, accept, reject, and remove friend requests
- Real-time notifications using Server-Sent Events
- Review/rating section
- User support question flow
- Admin support response flow
- Simple chatbot endpoint using fixed responses and fuzzy concept matching
- Admin dashboard route with role-based access

## Project Structure

```text
.
+-- README.md
+-- docs/
|   +-- readme/
|       +-- bondly-landing-page.png
|       +-- bondly-project-report-and-screenshots.pdf
|
+-- bondly Social media web app/
|   +-- pom.xml
|   +-- Lisharebackend/
|   |   +-- Lishare/
|   |       +-- pom.xml
|   |       +-- src/main/java/com/socialApp/Lishare/
|   |       |   +-- config/          # Web configuration and upload resource handling
|   |       |   +-- controller/      # REST API controllers
|   |       |   +-- dtos/            # Request and response DTOs
|   |       |   +-- entities/        # JPA entities
|   |       |   +-- Exceptions/      # Custom exceptions
|   |       |   +-- repos/           # Spring Data repositories
|   |       |   +-- security/        # Spring Security, JWT filter, auth config
|   |       |   +-- Service/         # Business logic
|   |       |   +-- utils/           # JWT and email helper classes
|   |       +-- src/main/resources/
|   |           +-- application.example.yaml  # Safe example config
|   |
|   +-- LishareFrontend/
|       +-- frontend/ui/
|           +-- package.json
|           +-- vite.config.js
|           +-- src/
|               +-- api.js           # Axios backend client
|               +-- live.js          # EventSource helper for SSE
|               +-- App.jsx          # Frontend route map
|               +-- components/      # Pages and reusable UI components
```

## Backend Modules

The backend follows a controller-service-repository structure.

- `controller` exposes the REST endpoints for auth, users, posts, comments, reactions, shares, friends, follows, notifications, reviews, support, and chatbot.
- `Service` contains the main business logic, including OTP handling, profile updates, post creation, reactions, friends/follows, support replies, and real-time event sending.
- `repos` contains the Spring Data JPA repositories.
- `entities` contains the database models such as `User`, `Post`, `Comment`, `Reaction`, `Share`, `Friend`, `Follow`, `Notification`, `Review`, and `SupportQuestion`.
- `security` contains Spring Security setup, JWT filtering, authentication provider setup, and password encoding.
- `utils` contains helper logic for JWT and email sending.

## Frontend Pages

The frontend routes are managed from `src/App.jsx`.

```text
/                 Landing page
/signup           Create account
/verify           OTP verification
/login            Login
/forgot-password  Forgot password
/dashboard        Admin dashboard
/home             Main user home/feed
/profile          User profile
/settings         Account settings
/review           Reviews
/supportAdmin     Admin support panel
/supportUser      User support panel
/searchUsers      User search
/notifications    Notifications
/friend           Friends
/post             Post/share page
```

## API Overview

Some of the main backend endpoint groups are:

```text
/auth             Register, login, verify account OTP, resend OTP
/forgotpass       Forgot password OTP and password reset
/user             Profile, settings, password/email update, account deletion, uploads
/posts            Create posts, delete posts, user posts, feed
/comments         Add comments, replies, delete comments, comment counts
/reactions        Add/remove reactions and get reaction counts
/shares           Share posts and view shared feed
/follow           Follow/unfollow, followers, following, user search
/api/friends      Friend requests and friend list
/notifications    Notification list, delete, and SSE stream
/support          User support questions, admin responses, SSE stream
/reviews          Review CRUD
/api/chat         Simple chatbot response endpoint
```

## Local Setup

### Prerequisites

- Java 25
- Maven
- Node.js and npm
- PostgreSQL
- An email account/app password for SMTP testing

### 1. Database

Create a PostgreSQL database for the project.

```sql
CREATE DATABASE bondly;
```

### 2. Backend Configuration

Copy the example config and create your own local config:

```bash
cd "bondly Social media web app"
cp Lisharebackend/Lishare/src/main/resources/application.example.yaml Lisharebackend/Lishare/src/main/resources/application.yaml
```

Then update the database, email, and JWT values in `application.yaml`.

Do not commit real passwords, app passwords, database URLs, or JWT secrets.

### 3. Run Backend

```bash
cd "bondly Social media web app/Lisharebackend/Lishare"
./mvnw spring-boot:run
```

On Windows:

```bash
cd "bondly Social media web app/Lisharebackend/Lishare"
mvnw.cmd spring-boot:run
```

The backend is configured to run on:

```text
http://localhost:4041
```

### 4. Run Frontend

```bash
cd "bondly Social media web app/LishareFrontend/frontend/ui"
npm install
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

The frontend API client currently points to the backend at `http://localhost:4041`.

## Security Notes

I keep the real `application.yaml` as a local configuration file because it contains values like database credentials, mail credentials, and JWT secrets. The repository includes `application.example.yaml` so another developer can understand the required config without seeing private values.

The current repository also ignores runtime uploads, logs, build output, node modules, and local environment files.

Important: if a secret file was committed before it was removed, the latest repo can be clean while the old value still exists in Git history. In that case, rotate the exposed database password, mail app password, and JWT secret.

## Runtime Files

Uploaded images are stored in `uploads/` locally and served through `/uploads/**`. These files are runtime data, so they should stay out of Git unless I intentionally add public demo assets.

## Notes

This is an individual project, so the code shows my learning path and the features I wanted to build step by step. The main goal was to make a working social media-style application with a proper backend structure, real authentication, database relationships, user interactions, and a React interface that connects to the API.
