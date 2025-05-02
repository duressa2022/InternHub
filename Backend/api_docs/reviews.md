# Review Routes API Documentation

This document outlines the API endpoints for managing reviews in the InternHub application. All endpoints require authentication via a JWT token in the `Authorization` header. Admin role is required for specific endpoints.

## Base URL
`http://api.internhub.com`

## Authentication
All requests must include:
```
Authorization: Bearer <jwt_token>
```

## Endpoints

### 1. Create a Review
- **Method**: POST
- **URI**: `/reviews`
- **Content-Type**: `application/json`
- **Description**: Creates a new review for a company.
- **Request Body**:
  ```json
  {
    "profile_url": "string",
    "full_name": "string",
    "occupation": "string",
    "company": "string",
    "posts": "string",
    "rating": number|null,
    "created_at": "string (YYYY-MM-DD HH:MM:SS)",
    "updated_at": "string (YYYY-MM-DD HH:MM:SS)"
  }
  ```
  - `profile_url`: Unique URL of the reviewer’s profile (e.g., `https://internhub.com/users/123`).
  - `full_name`: Reviewer’s full name (max 100 characters).
  - `occupation`: Reviewer’s job title (max 100 characters).
  - `company`: Company name (max 100 characters).
  - `posts`: Review content (required).
  - `rating`: Optional rating (0.0 to 5.0).
  - `created_at`: Creation timestamp.
  - `updated_at`: Update timestamp.
- **Responses**:
  - **201 Created**:
    ```json
    {
      "message": "Review created successfully",
      "data": {
        "id": 1,
        "profile_url": "https://internhub.com/users/123",
        "full_name": "John Doe",
        "occupation": "Software Engineer",
        "company": "Tech Corp",
        "posts": "Great experience!",
        "rating": 4.5,
        "created_at": "2025-05-01 12:00:00",
        "updated_at": "2025-05-01 12:00:00"
      }
    }
    ```
  - **400 Bad Request** (e.g., invalid `profile_url`, `rating` out of range):
    ```json
    {
      "message": "Invalid profile URL"
    }
    ```
  - **401 Unauthorized** (missing or invalid token):
    ```json
    {
      "message": "Unauthorized"
    }
    ```
  - **409 Conflict** (duplicate `profile_url`):
    ```json
    {
      "message": "Review with this profile URL already exists"
    }
    ```
- **Example Request**:
  ```bash
  curl -X POST http://api.internhub.com/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{
    "profile_url": "https://internhub.com/users/123",
    "full_name": "John Doe",
    "occupation": "Software Engineer",
    "company": "Tech Corp",
    "posts": "Great experience!",
    "rating": 4.5,
    "created_at": "2025-05-01 12:00:00",
    "updated_at": "2025-05-01 12:00:00"
  }'
  ```

### 2. Get a Review by ID
- **Method**: GET
- **URI**: `/reviews/{id}`
- **Description**: Retrieves a review by its ID.
- **Path Parameters**:
  - `id`: Integer, the review ID.
- **Responses**:
  - **200 OK**:
    ```json
    {
      "data": {
        "id": 1,
        "profile_url": "https://internhub.com/users/123",
        "full_name": "John Doe",
        "occupation": "Software Engineer",
        "company": "Tech Corp",
        "posts": "Great experience!",
        "rating": 4.5,
        "created_at": "2025-05-01 12:00:00",
        "updated_at": "2025-05-01 12:00:00"
      }
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
      "message": "Unauthorized"
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "message": "Review not found"
    }
    ```
- **Example Request**:
  ```bash
  curl -X GET http://api.internhub.com/reviews/1 \
  -H "Authorization: Bearer <jwt_token>"
  ```

### 3. Update a Review
- **Method**: PATCH
- **URI**: `/reviews/{id}`
- **Content-Type**: `application/json`
- **Description**: Updates an existing review with partial data.
- **Path Parameters**:
  - `id`: Integer, the review ID.
- **Request Body** (partial):
  ```json
  {
    "full_name": "string",
    "occupation": "string",
    "company": "string",
    "posts": "string",
    "rating": number|null
  }
  ```
  - Any subset of fields can be provided.
- **Responses**:
  - **200 OK**:
    ```json
    {
      "message": "Review updated successfully",
      "data": {
        "id": 1,
        "profile_url": "https://internhub.com/users/123",
        "full_name": "Jane Doe",
        "occupation": "Senior Engineer",
        "company": "Tech Corp",
        "posts": "Updated review!",
        "rating": 4.8,
        "created_at": "2025-05-01 12:00:00",
        "updated_at": "2025-05-02 14:00:00"
      }
    }
    ```
  - **400 Bad Request** (e.g., invalid `rating`):
    ```json
    {
      "message": "Rating must be between 0 and 5"
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
      "message": "Unauthorized"
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "message": "Failed to update review"
    }
    ```
- **Example Request**:
  ```bash
  curl -X PATCH http://api.internhub.com/reviews/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{
    "full_name": "Jane Doe",
    "occupation": "Senior Engineer",
    "rating": 4.8
  }'
  ```

### 4. Delete a Review
- **Method**: DELETE
- **URI**: `/reviews/{id}`
- **Description**: Deletes a review by its ID.
- **Path Parameters**:
  - `id`: Integer, the review ID.
- **Responses**:
  - **200 OK**:
    ```json
    {
      "message": "Review deleted successfully"
    }
    ```
  - **400 Bad Request**:
    ```json
    {
      "message": "Failed to delete review"
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
      "message": "Unauthorized"
    }
    ```
- **Example Request**:
  ```bash
  curl -X DELETE http://api.internhub.com/reviews/1 \
  -H "Authorization: Bearer <jwt_token>"
  ```

### 5. Get All Reviews
- **Method**: GET
- **URI**: `/reviews?page={page}&limit={limit}`
- **Description**: Retrieves a paginated list of all reviews. Requires admin role.
- **Query Parameters**:
  - `page`: Integer, page number (default: 1).
  - `limit`: Integer, number of reviews per page (default: 10).
- **Responses**:
  - **200 OK**:
    ```json
    {
      "data": [
        {
          "id": 1,
          "profile_url": "https://internhub.com/users/123",
          "full_name": "John Doe",
          "occupation": "Software Engineer",
          "company": "Tech Corp",
          "posts": "Great experience!",
          "rating": 4.5,
          "created_at": "2025-05-01 12:00:00",
          "updated_at": "2025-05-01 12:00:00"
        },
        {...}
      ]
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
      "message": "Unauthorized"
    }
    ```
  - **403 Forbidden** (non-admin user):
    ```json
    {
      "message": "Access denied"
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "message": "No reviews found"
    }
    ```
- **Example Request**:
  ```bash
  curl -X GET http://api.internhub.com/reviews?page=1&limit=10 \
  -H "Authorization: Bearer <admin_jwt_token>"
  ```

### 6. Get Reviews by Company
- **Method**: GET
- **URI**: `/reviews/by-company/{company}`
- **Description**: Retrieves all reviews for a specific company.
- **Path Parameters**:
  - `company`: String, the company name (URL-encoded, e.g., `Tech%20Corp`).
- **Responses**:
  - **200 OK**:
    ```json
    {
      "data": [
        {
          "id": 1,
          "profile_url": "https://internhub.com/users/123",
          "full_name": "John Doe",
          "occupation": "Software Engineer",
          "company": "Tech Corp",
          "posts": "Great experience!",
          "rating": 4.5,
          "created_at": "2025-05-01 12:00:00",
          "updated_at": "2025-05-01 12:00:00"
        },
        {...}
      ]
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
      "message": "Unauthorized"
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "message": "No reviews found"
    }
    ```
- **Example Request**:
  ```bash
  curl -X GET http://api.internhub.com/reviews/by-company/Tech%20Corp \
  -H "Authorization: Bearer <jwt_token>"
  ```

### 7. Get Reviews by Rating
- **Method**: GET
- **URI**: `/reviews/by-rating/{rating}`
- **Description**: Retrieves all reviews with a specific rating.
- **Path Parameters**:
  - `rating`: Float, the rating value (e.g., `4.5`).
- **Responses**:
  - **200 OK**:
    ```json
    {
      "data": [
        {
          "id": 1,
          "profile_url": "https://internhub.com/users/123",
          "full_name": "John Doe",
          "occupation": "Software Engineer",
          "company": "Tech Corp",
          "posts": "Great experience!",
          "rating": 4.5,
          "created_at": "2025-05-01 12:00:00",
          "updated_at": "2025-05-01 12:00:00"
        },
        {...}
      ]
    }
    ```
  - **400 Bad Request** (invalid rating):
    ```json
    {
      "message": "Rating must be between 0 and 5"
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
      "message": "Unauthorized"
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "message": "No reviews found"
    }
    ```
- **Example Request**:
  ```bash
  curl -X GET http://api.internhub.com/reviews/by-rating/4.5 \
  -H "Authorization: Bearer <jwt_token>"
  ```

### 8. Delete Reviews by Company
- **Method**: DELETE
- **URI**: `/reviews/by-company/{company}`
- **Description**: Deletes all reviews for a specific company. Requires admin role.
- **Path Parameters**:
  - `company`: String, the company name (URL-encoded, e.g., `Tech%20Corp`).
- **Responses**:
  - **200 OK**:
    ```json
    {
      "message": "Reviews deleted successfully"
    }
    ```
  - **400 Bad Request**:
    ```json
    {
      "message": "Failed to delete reviews"
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
      "message": "Unauthorized"
    }
    ```
  - **403 Forbidden** (non-admin user):
    ```json
    {
      "message": "Access denied"
    }
    ```
- **Example Request**:
  ```bash
  curl -X DELETE http://api.internhub.com/reviews/by-company/Tech%20Corp \
  -H "Authorization: Bearer <admin_jwt_token>"
  ```

## Notes
- All timestamps (`created_at`, `updated_at`) are in `YYYY-MM-DD HH:MM:SS` format.
- The `rating` field is optional and must be between 0.0 and 5.0 if provided.
- The `profile_url` must be a valid URL and unique across reviews.
- Admin role is required for `GET /reviews` and `DELETE /reviews/by-company/{company}`.
- Ensure the JWT token is valid and includes the necessary claims (e.g., `role` for admin checks).