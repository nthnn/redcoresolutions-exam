# User-Role-Permission API (Laravel Backend)

This is a comprehensive, RESTful API built with **Laravel 11**, using **SQLite** for data storage and **JWT (JSON Web Tokens)** for secure authentication. 

It provides robust CRUD (Create, Read, Update, Delete) operations for `Users` and `Roles`, along with secure user login, logout, and token refresh capabilities.

---

## Getting Started

### Prerequisites

- PHP >= 8.2
- Composer
- SQLite PHP Extension

### Installation & Setup

1. **Clone or Download the Repository:**
   Ensure you are in the `backend` directory.

2. **Install Dependencies:**
   ```bash
   composer install
   ```

3. **Environment Configuration:**
   Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
   Ensure your database connection is set to `sqlite` in the `.env` file:
   ```env
   DB_CONNECTION=sqlite
   ```

4. **Generate Application Key:**
   ```bash
   php artisan key:generate
   ```

5. **Generate JWT Secret Key:**
   ```bash
   php artisan jwt:secret
   ```

6. **Run Database Migrations:**
   ```bash
   php artisan migrate
   ```

7. **Start the Development Server:**
   ```bash
   php artisan serve
   ```
   The API will be accessible at `http://127.0.0.1:8000`.

---

## Authentication & Security

This API uses **JWT (JSON Web Tokens)**.

For protected routes, you must include the JWT token in the `Authorization` header of your HTTP request:

```
Authorization: Bearer <jwt_token_here>
```

---

## API Endpoints Documentation

### 1. Authentication Endpoints

#### `POST /api/login`

Authenticates a user and returns a JWT token.

- **Auth Required:** No
- **Request Body (JSON):**
  ```json
  {
      "email": "user@example.com",
      "password": "password123"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
      "access_token": "eyJ0eXAi...",
      "token_type": "bearer",
      "expires_in": 3600
  }
  ```
- **Error Response (401 Unauthorized):**
  ```json
  {
      "error": "Unauthorized"
  }
  ```

#### `GET /api/me`

Retrieves the profile information of the currently authenticated user.

- **Auth Required:** Yes (Bearer Token)
- **Success Response (200 OK):**
  ```json
  {
      "id": 1,
      "full_name": "John Doe",
      "email": "john@example.com",
      "role_id": 2,
      "created_at": "...",
      "updated_at": "..."
  }
  ```

#### `POST /api/logout`

Invalidates the current JWT token, effectively logging the user out.

- **Auth Required:** Yes (Bearer Token)
- **Success Response (200 OK):**
  ```json
  {
      "message": "Successfully logged out"
  }
  ```

#### `POST /api/refresh`

Refreshes an expired (or soon-to-expire) JWT token and returns a new one.
- **Auth Required:** Yes (Bearer Token)
- **Success Response (200 OK):** Returns the same token structure as `/api/login`.

---

### 2. Roles Endpoints

Manage user roles. Each role can have a `name` and a `description`.

#### `GET /api/roles`

Retrieves a list of all roles.

- **Auth Required:** Yes
- **Success Response (200 OK):**
  ```json
  [
      {
          "id": 1,
          "name": "Admin",
          "description": "Administrator with full access",
          "created_at": "...",
          "updated_at": "..."
      }
  ]
  ```

#### `POST /api/roles`

Creates a new role.

- **Auth Required:** Yes
- **Request Body (JSON):**
  ```json
  {
      "name": "Manager",
      "description": "Store manager"
  }
  ```
- **Success Response (201 Created):** Returns the created role object.

#### `GET /api/roles/{id}`

Retrieves a specific role by its ID.

- **Auth Required:** Yes
- **Success Response (200 OK):** Returns the requested role object.

#### `PUT /api/roles/{id}`

Updates an existing role.

- **Auth Required:** Yes
- **Request Body (JSON):**
  ```json
  {
      "name": "Super Admin",
      "description": "Updated description"
  }
  ```
- **Success Response (200 OK):** Returns the updated role object.

#### `DELETE /api/roles/{id}`

Deletes a specific role.

- **Auth Required:** Yes
- **Success Response (204 No Content):** (Empty response body upon successful deletion)

---

### 3. Users Endpoints

Manage users. Each user belongs to a role (`1 to 1` relationship from the user's perspective via `role_id`). 

#### `GET /api/users`

Retrieves a list of all users along with their associated role data.

- **Auth Required:** Yes
- **Success Response (200 OK):**
  ```json
  [
      {
          "id": 1,
          "full_name": "Jane Doe",
          "email": "jane@example.com",
          "role_id": 1,
          "role": {
              "id": 1,
              "name": "Admin",
              "description": "Administrator"
          }
      }
  ]
  ```

#### `POST /api/users`

Creates a new user account.

- **Auth Required:** Yes
- **Request Body (JSON):**
  *Note: `password_confirmation` must strictly match `password`.*
  ```json
  {
      "full_name": "Jane Doe",
      "email": "jane@example.com",
      "password": "securepassword123",
      "password_confirmation": "securepassword123",
      "role_id": 1
  }
  ```
- **Success Response (201 Created):** Returns the created user object.
- **Validation Errors (422 Unprocessable Entity):** Will return errors if emails duplicate, passwords do not match, or `role_id` does not exist.

#### `GET /api/users/{id}`

Retrieves a specific user and their role by ID.

- **Auth Required:** Yes
- **Success Response (200 OK):** Returns the user object with the `role` relation.

#### `PUT /api/users/{id}`

Updates an existing user.

- **Auth Required:** Yes
- **Request Body (JSON):**
  *Note: All fields are optional (`sometimes`). If you pass a `password`, you must also pass `password_confirmation`.*
  ```json
  {
      "full_name": "Jane Doe Updated",
      "role_id": 2
  }
  ```
- **Success Response (200 OK):** Returns the updated user object.

#### `DELETE /api/users/{id}`

Deletes a specific user.

- **Auth Required:** Yes
- **Success Response (204 No Content):** (Empty response body upon successful deletion)

---

## Database Schema Summary

**Users Table (`users`)**
- `id` (Primary Key)
- `full_name` (String)
- `email` (String, Unique)
- `password` (String, Hashed)
- `role_id` (Foreign Key -> `roles.id`, Nullable)
- `timestamps`

**Roles Table (`roles`)**
- `id` (Primary Key)
- `name` (String)
- `description` (String, Nullable)
- `timestamps`
