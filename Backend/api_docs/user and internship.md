# API Documentation

This document describes the API endpoints for User and Internship functionalities. All endpoints return JSON responses and use standard HTTP status codes to indicate success or failure.

## Base URL
`https://your-api-base-url/`

## Authentication
- **JWT Authentication**: Required for certain endpoints. Include the JWT in the `Authorization` header as `Bearer <token>`.
- **Admin Role**: Some endpoints require the user to have an `admin` role, validated via JWT.
- **User Role**: Some endpoints require an authenticated user, with the user ID or email extracted from the JWT.

## User Routes

### 1. Get All Users
- **Endpoint**: `GET /users`
- **Description**: Retrieves a paginated list of all users.
- **Authentication**: Requires JWT with `admin` role.
- **Query Parameters**:
  - `page` (optional, integer, default: 1): Page number for pagination.
  - `limit` (optional, integer, default: 10): Number of users per page.
- **Request Example**:
  ```
  GET /users?page=1&limit=10
  Authorization: Bearer <jwt_token>
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "data": [
        {
          "id": 1,
          "first_name": "John",
          "last_name": "Doe",
          "email": "john.doe@example.com",
          "role": "user",
          "field": "Engineering",
          "avatar_url": "https://example.com/avatar.jpg",
          "gender": "male",
          "phone_number": "+1234567890",
          "address": "123 Main St",
          "city": "New York",
          "state": "NY",
          "country": "USA",
          "postal_code": "10001",
          "date_of_birth": "1990-01-01",
          "website": "https://johndoe.com",
          "social_links": {"linkedin": "https://linkedin.com/in/johndoe"},
          "created_at": "2025-01-01 10:00:00",
          "updated_at": "2025-01-01 10:00:00"
        },
        ...
      ]
    }
    ```
  - **403 Forbidden**:
    ```json
    { "message": "Access denied" }
    ```
  - **404 Not Found**:
    ```json
    { "message": "No users found" }
    ```

### 2. Create User
- **Endpoint**: `POST /users`
- **Description**: Creates a new user.
- **Authentication**: None required.
- **Request Body**:
  ```json
  {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "password": "securepassword123",
    "role": "user",
    "field": "Engineering",
    "avatar_url": "https://example.com/avatar.jpg",
    "gender": "male",
    "phone_number": "+1234567890",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "postal_code": "10001",
    "date_of_birth": "1990-01-01",
    "website": "https://johndoe.com",
    "social_links": {"linkedin": "https://linkedin.com/in/johndoe"}
  }
  ```
- **Response**:
  - **201 Created**:
    ```json
    {
      "message": "User created successfully",
      "data": {
        "id": 1,
        "first_name": "John",
        ...
      }
    }
    ```
  - **400 Bad Request**:
    ```json
    { "message": "Failed to create user" }
    ```
  - **409 Conflict**:
    ```json
    { "message": "User already exists" }
    ```

### 3. Get User by ID
- **Endpoint**: `GET /users/:id`
- **Description**: Retrieves a user by their ID.
- **Authentication**: None required.
- **Path Parameters**:
  - `id` (integer): User ID.
- **Request Example**:
  ```
  GET /users/1
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "data": {
        "id": 1,
        "first_name": "John",
        "last_name": "Doe",
        ...
      }
    }
    ```
  - **404 Not Found**:
    ```json
    { "message": "User not found" }
    ```

### 4. Update User
- **Endpoint**: `PUT /users/:id`
- **Description**: Updates a user's details.
- **Authentication**: Requires JWT; only the user themselves can update their data (ID in JWT must match `:id`).
- **Path Parameters**:
  - `id` (integer): User ID.
- **Request Body**:
  ```json
  {
    "first_name": "John",
    "last_name": "Smith",
    ...
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "User updated successfully",
      "data": {
        "id": 1,
        "first_name": "John",
        ...
      }
    }
    ```
  - **400 Bad Request**:
    ```json
    { "message": "Failed to update user" }
    ```
  - **403 Forbidden**:
    ```json
    { "message": "Access denied" }
    ```

### 5. Delete User
- **Endpoint**: `DELETE /users/:id`
- **Description**: Deletes a user by ID.
- **Authentication**: Requires JWT; only the user themselves can delete their account.
- **Path Parameters**:
  - `id` (integer): User ID.
- **Request Example**:
  ```
  DELETE /users/1
  Authorization: Bearer <jwt_token>
  ```
- **Response**:
  - **200 OK**:
    ```json
    { "message": "User deleted successfully" }
    ```
  - **400 Bad Request**:
    ```json
    { "message": "Failed to delete user" }
    ```
  - **403 Forbidden**:
    ```json
    { "message": "Access denied" }
    ```

### 6. Login
- **Endpoint**: `POST /users/login`
- **Description**: Authenticates a user and returns JWT tokens.
- **Authentication**: None required.
- **Request Body**:
  ```json
  {
    "email": "john.doe@example.com",
    "password": "securepassword123"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "Login successful",
      "data": {
        "access_token": "<jwt_access_token>",
        "refresh_token": "<jwt_refresh_token>",
        "user": {
          "id": 1,
          "email": "john.doe@example.com",
          ...
        }
      }
    }
    ```
  - **401 Unauthorized**:
    ```json
    { "message": "Invalid email or password" }
    ```

### 7. Logout
- **Endpoint**: `POST /users/logout`
- **Description**: Logs out a user by clearing JWT cookies.
- **Authentication**: None required.
- **Request Example**:
  ```
  POST /users/logout
  ```
- **Response**:
  - **200 OK**:
    ```json
    { "message": "Logout successful" }
    ```

### 8. Delete User by Email
- **Endpoint**: `DELETE /users/delete-by-email`
- **Description**: Deletes a user by their email address.
- **Authentication**: Requires JWT with `admin` role.
- **Request Body**:
  ```json
  {
    "email": "john.doe@example.com"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    { "message": "User deleted successfully" }
    ```
  - **400 Bad Request**:
    ```json
    { "message": "Failed to delete user" }
    ```
  - **403 Forbidden**:
    ```json
    { "message": "Access denied" }
    ```

### 9. Get User by Email
- **Endpoint**: `GET /users/get-by-email`
- **Description**: Retrieves a user by their email address.
- **Authentication**: Requires JWT with `admin` role.
- **Request Body**:
  ```json
  {
    "email": "john.doe@example.com"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "data": {
        "id": 1,
        "email": "john.doe@example.com",
        ...
      }
    }
    ```
  - **404 Not Found**:
    ```json
    { "message": "User not found" }
    ```
  - **403 Forbidden**:
    ```json
    { "message": "Access denied" }
    ```

### 10. Change Password
- **Endpoint**: `PUT /users/reset-password`
- **Description**: Changes the password for the authenticated user.
- **Authentication**: Requires JWT; email in JWT must match the user.
- **Request Body**:
  ```json
  {
    "old_password": "oldpassword123",
    "new_password": "newpassword123"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    { "message": "Password changed successfully" }
    ```
  - **400 Bad Request**:
    ```json
    { "message": "Failed to change password" }
    ```
  - **403 Forbidden**:
    ```json
    { "message": "Access denied" }
    ```

## Internship Routes

### 1. Get All Internships
- **Endpoint**: `GET /internships`
- **Description**: Retrieves a paginated list of all internships.
- **Authentication**: None required.
- **Query Parameters**:
  - `page` (optional, integer, default: 1): Page number for pagination.
  - `limit` (optional, integer, default: 10): Number of internships per page.
- **Request Example**:
  ```
  GET /internships?page=1&limit=10
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "data": [
        {
          "id": 1,
          "title": "Software Engineering Intern",
          "company": "Tech Corp",
          "location": "San Francisco, CA",
          "category": "Engineering",
          "type": "Full-time",
          "start_date": "2025-06-01",
          "end_date": "2025-08-31",
          "description": "Work on cutting-edge projects...",
          "requirements": "Knowledge of Python...",
          "salary_range": "$20-$30/hour",
          "benefits": "Mentorship, free lunches",
          "deadline": "2025-05-01",
          "link": "https://techcorp.com/apply",
          "created_at": "2025-01-01 10:00:00",
          "updated_at": "2025-01-01 10:00:00"
        },
        ...
      ]
    }
    ```
  - **404 Not Found**:
    ```json
    { "message": "No internships found" }
    ```

### 2. Create Internship
- **Endpoint**: `POST /internships`
- **Description**: Creates a new internship.
- **Authentication**: Requires JWT with `admin` role.
- **Request Body**:
  ```json
  {
    "title": "Software Engineering Intern",
    "company": "Tech Corp",
    "location": "San Francisco, CA",
    "category": "Engineering",
    "type": "Full-time",
    "start_date": "2025-06-01",
    "end_date": "2025-08-31",
    "description": "Work on cutting-edge projects...",
    "requirements": "Knowledge of Python...",
    "salary_range": "$20-$30/hour",
    "benefits": "Mentorship, free lunches",
    "deadline": "2025-05-01",
    "link": "https://techcorp.com/apply"
  }
  ```
- **Response**:
  - **201 Created**:
    ```json
    {
      "message": "Internship created successfully",
      "data": {
        "id": 1,
        "title": "Software Engineering Intern",
        ...
      }
    }
    ```
  - **400 Bad Request**:
    ```json
    { "message": "Failed to create internship" }
    ```
  - **403 Forbidden**:
    ```json
    { "message": "Access denied" }
    ```

### 3. Get Internship by ID
- **Endpoint**: `GET /internships/:id`
- **Description**: Retrieves an internship by its ID.
- **Authentication**: None required.
- **Path Parameters**:
  - `id` (integer): Internship ID.
- **Request Example**:
  ```
  GET /internships/1
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "data": {
        "id": 1,
        "title": "Software Engineering Intern",
        "company": "Tech Corp",
        ...
      }
    }
    ```
  - **404 Not Found**:
    ```json
    { "message": "Internship not found" }
    ```

### 4. Update Internship
- **Endpoint**: `PUT /internships/:id`
- **Description**: Updates an internship's details.
- **Authentication**: Requires JWT with `admin` role.
- **Path Parameters**:
  - `id` (integer): Internship ID.
- **Request Body**:
  ```json
  {
    "title": "Updated Software Engineering Intern",
    "company": "Tech Corp",
    ...
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "Internship updated successfully",
      "data": {
        "id": 1,
        "title": "Updated Software Engineering Intern",
        ...
      }
    }
    ```
  - **400 Bad Request**:
    ```json
    { "message": "Failed to update internship" }
    ```
  - **403 Forbidden**:
    ```json
    { "message": "Access denied" }
    ```

### 5. Delete Internship
- **Endpoint**: `DELETE /internships/:id`
- **Description**: Deletes an internship by ID.
- **Authentication**: Requires JWT with `admin` role.
- **Path Parameters**:
  - `id` (integer): Internship ID.
- **Request Example**:
  ```
  DELETE /internships/1
  Authorization: Bearer <jwt_token>
  ```
- **Response**:
  - **200 OK**:
    ```json
    { "message": "Internship deleted successfully" }
    ```
  - **400 Bad Request**:
    ```json
    { "message": "Failed to delete internship" }
    ```
  - **403 Forbidden**:
    ```json
    { "message": "Access denied" }
    ```

### 6. Search Internships
- **Endpoint**: `GET /internships/search`
- **Description**: Searches internships based on query parameters.
- **Authentication**: None required.
- **Query Parameters**:
  - `title` (optional, string): Filter by internship title.
  - `company` (optional, string): Filter by company name.
  - `location` (optional, string): Filter by location.
  - `category` (optional, string): Filter by category.
  - `type` (optional, string): Filter by internship type.
  - `page` (optional, integer, default: 1): Page number for pagination.
  - `limit` (optional, integer, default: 10): Number of internships per page.
- **Request Example**:
  ```
  GET /internships/search?title=Software&location=San%20Francisco&category=Engineering&page=1&limit=10
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "data": [
        {
          "id": 1,
          "title": "Software Engineering Intern",
          "company": "Tech Corp",
          "location": "San Francisco, CA",
          ...
        },
        ...
      ]
    }
    ```
  - **404 Not Found**:
    ```json
    { "message": "No matching internships found" }
    ```

### 7. Apply to Internship
- **Endpoint**: `POST /internships/:id/apply`
- **Description**: Allows a user to apply to an internship.
- **Authentication**: Requires JWT; user ID is extracted from the token.
- **Path Parameters**:
  - `id` (integer): Internship ID.
- **Request Example**:
  ```
  POST /internships/1/apply
  Authorization: Bearer <jwt_token>
  ```
- **Response**:
  - **200 OK**:
    ```json
    { "message": "Successfully applied to internship" }
    ```
  - **400 Bad Request**:
    ```json
    { "message": "Failed to apply to internship" }
    ```

### 8. Get Internship Applications
- **Endpoint**: `GET /internships/:id/applications`
- **Description**: Retrieves all applications for a specific internship.
- **Authentication**: Requires JWT with `admin` role.
- **Path Parameters**:
  - `id` (integer): Internship ID.
- **Request Example**:
  ```
  GET /internships/1/applications
  Authorization: Bearer <jwt_token>
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "data": [
        {
          "user_id": 1,
          "internship_id": 1,
          "application_date": "2025-01-02 12:00:00",
          ...
        },
        ...
      ]
    }
    ```
  - **404 Not Found**:
    ```json
    { "message": "No applications found for this internship" }
    ```
  - **403 Forbidden**:
    ```json
    { "message": "Access denied" }
    ```

### 9. Get Internships by Title
- **Endpoint**: `GET /internships/by-title`
- **Description**: Retrieves internships by title (partial match).
- **Authentication**: None required.
- **Query Parameters**:
  - `title` (required, string): Internship title to search for.
  - `page` (optional, integer, default: 1): Page number for pagination.
  - `limit` (optional, integer, default: 10): Number of internships per page.
- **Request Example**:
  ```
  GET /internships/by-title?title=Software%20Engineering&page=1&limit=10
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "data": [
        {
          "id": 1,
          "title": "Software Engineering Intern",
          ...
        },
        ...
      ]
    }
    ```
  - **404 Not Found**:
    ```json
    { "message": "Internship not found" }
    ```

### 10. Get Internships by Company
- **Endpoint**: `GET /internships/by-company`
- **Description**: Retrieves internships by company name (partial match).
- **Authentication**: None required.
- **Query Parameters**:
  - `company` (required, string): Company name to search for.
  - `page` (optional, integer, default: 1): Page number for pagination.
  - `limit` (optional, integer, default: 10): Number of internships per page.
- **Request Example**:
  ```
  GET /internships/by-company?company=Tech%20Corp&page=1&limit=10
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "data": [
        {
          "id": 1,
          "company": "Tech Corp",
          ...
        },
        ...
      ]
    }
    ```
  - **404 Not Found**:
    ```json
    { "message": "Internship not found" }
    ```

### 11. Get Internships by Location
- **Endpoint**: `GET /internships/by-location`
- **Description**: Retrieves internships by location (partial match).
- **Authentication**: None required.
- **Query Parameters**:
  - `location` (required, string): Location to search for.
  - `page` (optional, integer, default: 1): Page number for pagination.
  - `limit` (optional, integer, default: 10): Number of internships per page.
- **Request Example**:
  ```
  GET /internships/by-location?location=San%20Francisco&page=1&limit=10
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "data": [
        {
          "id": 1,
          "location": "San Francisco, CA",
          ...
        },
        ...
      ]
    }
    ```
  - **404 Not Found**:
    ```json
    { "message": "Internship not found" }
    ```

### 12. Get Internships by Category
- **Endpoint**: `GET /internships/by-category`
- **Description**: Retrieves internships by category (partial match).
- **Authentication**: None required.
- **Query Parameters**:
  - `category` (required, string): Category to search for.
  - `page` (optional, integer, default: 1): Page number for pagination.
  - `limit` (optional, integer, default: 10): Number of internships per page.
- **Request Example**:
  ```
  GET /internships/by-category?category=Engineering&page=1&limit=10
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "data": [
        {
          "id": 1,
          "category": "Engineering",
          ...
        },
        ...
      ]
    }
    ```
  - **404 Not Found**:
    ```json
    { "message": "Internship not found" }
    ```

### 13. Get Internships by Type
- **Endpoint**: `GET /internships/by-type`
- **Description**: Retrieves internships by type (partial match).
- **Authentication**: None required.
- **Query Parameters**:
  - `type` (required, string): Internship type to search for.
  - `page` (optional, integer, default: 1): Page number for pagination.
  - `limit` (optional, integer, default: 10): Number of internships per page.
- **Request Example**:
  ```
  GET /internships/by-type?type=Full-time&page=1&limit=10
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "data": [
        {
          "id": 1,
          "type": "Full-time",
          ...
        },
        ...
      ]
    }
    ```
  - **404 Not Found**:
    ```json
    { "message": "Internship not found" }
    ```

## Error Handling
- **404 Not Found**: Returned when the requested resource or route is not found.
  ```json
  { "message": "Route not found" }
  ```
- **400 Bad Request**: Returned when the request is invalid or the operation fails.
- **403 Forbidden**: Returned when the user lacks the necessary permissions.
- **401 Unauthorized**: Returned for invalid credentials during login.

## Notes
- All timestamps (`created_at`, `updated_at`) are in `YYYY-MM-DD HH:MM:SS` format.
- Pagination is supported for list endpoints with `page` and `limit` query parameters.
- The `social_links` field in user responses and requests is a JSON object.
- The `applyToInternship` endpoint does not require a request body as the user ID is extracted from the JWT.
- The `getInternshipApplications` response structure assumes an application record with fields like `user_id`, `internship_id`, and `application_date`, but this may vary based on the actual implementation of the `InternshipUsecase`.