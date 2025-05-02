# Companies API Documentation

This document describes the API endpoints for managing companies in the InternHub application. All endpoints are prefixed with `/companies`.

## Base URL
```
http://<your-domain>/companies
```

## Authentication
- **Admin-Only Endpoints**: `POST /companies`, `PUT /companies/:id`, `DELETE /companies/:id` require a JWT token with `role: admin` in the `Authorization` header:
  ```
  Authorization: Bearer <admin_jwt_token>
  ```
- **Public Endpoints**: All `GET` endpoints (`/companies`, `/companies/:id`, `/companies/search`, `/companies/by-name`, `/companies/by-category`, `/companies/by-location`, `/companies/by-rating`, `/companies/:id/internships`) are publicly accessible unless otherwise specified.
- **Optional Admin Restriction**: The `GET /companies/:id/internships` endpoint may require admin access (e.g., `role: admin`) if configured in the routes. Check your implementation.

## Response Format
All responses are JSON, with the following structure:
- **Success**: Includes a `message` (optional) and `data` (object or array).
- **Error**: Includes a `message` describing the error.

Example success response:
```json
{
  "message": "Company created successfully",
  "data": { ... }
}
```

Example error response:
```json
{
  "message": "Company not found"
}
```

## Endpoints

### 1. Get All Companies
Retrieve a paginated list of all companies.

- **Method**: `GET`
- **URI**: `/companies`
- **Query Parameters**:
  - `page` (integer, optional, default: 1): Page number for pagination.
  - `limit` (integer, optional, default: 10): Number of companies per page.
- **Authentication**: None (public).
- **Response**:
  - **200 OK**:
    ```json
    {
      "data": [
        {
          "id": 1,
          "name": "Tech Corp",
          "category": "Technology",
          "logoUrl": "https://techcorp.com/logo.png",
          "location": "San Francisco, CA",
          "about": "Innovative tech solutions",
          "currentNumberOfInternships": 5,
          "rating": 4.5,
          "created_at": "2025-05-01 12:00:00",
          "updated_at": "2025-05-01 12:00:00"
        },
        ...
      ]
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "message": "No companies found"
    }
    ```

### 2. Create a Company
Create a new company (admin only).

- **Method**: `POST`
- **URI**: `/companies`
- **Authentication**: Requires `Authorization: Bearer <admin_jwt_token>` with `role: admin`.
- **Request Body** (JSON):
  ```json
  {
    "name": "Tech Corp",
    "category": "Technology",
    "logoUrl": "https://techcorp.com/logo.png",
    "location": "San Francisco, CA",
    "about": "Innovative tech solutions",
    "currentNumberOfInternships": 5,
    "rating": 4.5
  }
  ```
  - **Required Fields**: `name`, `category`, `logoUrl`, `location`, `about`.
  - **Optional Fields**: `currentNumberOfInternships` (integer), `rating` (float, 0 to 5).
- **Response**:
  - **201 Created**:
    ```json
    {
      "message": "Company created successfully",
      "data": {
        "id": 1,
        "name": "Tech Corp",
        "category": "Technology",
        "logoUrl": "https://techcorp.com/logo.png",
        "location": "San Francisco, CA",
        "about": "Innovative tech solutions",
        "currentNumberOfInternships": 5,
        "rating": 4.5,
        "created_at": "2025-05-01 12:00:00",
        "updated_at": "2025-05-01 12:00:00"
      }
    }
    ```
  - **400 Bad Request**:
    ```json
    {
      "message": "Failed to create company"
    }
    ```
  - **403 Forbidden**:
    ```json
    {
      "message": "Access denied"
    }
    ```

### 3. Get Company by ID
Retrieve a company by its ID.

- **Method**: `GET`
- **URI**: `/companies/{id}`
- **Path Parameters**:
  - `id` (integer): The company’s unique ID.
- **Authentication**: None (public).
- **Response**:
  - **200 OK**:
    ```json
    {
      "data": {
        "id": 1,
        "name": "Tech Corp",
        "category": "Technology",
        "logoUrl": "https://techcorp.com/logo.png",
        "location": "San Francisco, CA",
        "about": "Innovative tech solutions",
        "currentNumberOfInternships": 5,
        "rating": 4.5,
        "created_at": "2025-05-01 12:00:00",
        "updated_at": "2025-05-01 12:00:00"
      }
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "message": "Company not found"
    }
    ```

### 4. Update a Company
Update an existing company (admin only).

- **Method**: `PUT`
- **URI**: `/companies/{id}`
- **Path Parameters**:
  - `id` (integer): The company’s unique ID.
- **Authentication**: Requires `Authorization: Bearer <admin_jwt_token>` with `role: admin`.
- **Request Body** (JSON):
  ```json
  {
    "name": "Tech Corp Updated",
    "category": "Technology",
    "logoUrl": "https://techcorp.com/new-logo.png",
    "location": "San Francisco, CA",
    "about": "Updated tech solutions",
    "currentNumberOfInternships": 6,
    "rating": 4.7
  }
  ```
  - All fields are optional; only provided fields are updated.
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "Company updated successfully",
      "data": {
        "id": 1,
        "name": "Tech Corp Updated",
        "category": "Technology",
        "logoUrl": "https://techcorp.com/new-logo.png",
        "location": "San Francisco, CA",
        "about": "Updated tech solutions",
        "currentNumberOfInternships": 6,
        "rating": 4.7,
        "created_at": "2025-05-01 12:00:00",
        "updated_at": "2025-05-01 12:10:00"
      }
    }
    ```
  - **400 Bad Request**:
    ```json
    {
      "message": "Failed to update company"
    }
    ```
  - **403 Forbidden**:
    ```json
    {
      "message": "Access denied"
    }
    ```

### 5. Delete a Company
Delete a company by its ID (admin only).

- **Method**: `DELETE`
- **URI**: `/companies/{id}`
- **Path Parameters**:
  - `id` (integer): The company’s unique ID.
- **Authentication**: Requires `Authorization: Bearer <admin_jwt_token>` with `role: admin`.
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "Company deleted successfully"
    }
    ```
  - **400 Bad Request**:
    ```json
    {
      "message": "Failed to delete company"
    }
    ```
  - **403 Forbidden**:
    ```json
    {
      "message": "Access denied"
    }
    ```

### 6. Search Companies
Search companies based on query parameters.

- **Method**: `GET`
- **URI**: `/companies/search`
- **Query Parameters**:
  - `name` (string, optional): Partial match for company name.
  - `category` (string, optional): Partial match for category.
  - `location` (string, optional): Partial match for location.
  - `about` (string, optional): Partial match for about text.
  - `page` (integer, optional, default: 1): Page number.
  - `limit` (integer, optional, default: 10): Number of companies per page.
- **Authentication**: None (public).
- **Example**: `GET /companies/search?name=Tech&category=Technology&page=1&limit=10`
- **Response**:
  - **200 OK**:
    ```json
    {
      "data": [
        {
          "id": 1,
          "name": "Tech Corp",
          "category": "Technology",
          "logoUrl": "https://techcorp.com/logo.png",
          "location": "San Francisco, CA",
          "about": "Innovative tech solutions",
          "currentNumberOfInternships": 5,
          "rating": 4.5,
          "created_at": "2025-05-01 12:00:00",
          "updated_at": "2025-05-01 12:00:00"
        }
      ]
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "message": "No companies found"
    }
    ```

### 7. Get Companies by Name
Retrieve companies by partial name match.

- **Method**: `GET`
- **URI**: `/companies/by-name`
- **Query Parameters**:
  - `name` (string, required): Partial name to search for.
  - `page` (integer, optional, default: 1): Page number.
  - `limit` (integer, optional, default: 10): Number of companies per page.
- **Authentication**: None (public).
- **Example**: `GET /companies/by-name?name=Tech&page=1&limit=10`
- **Response**:
  - **200 OK**:
    ```json
    {
      "data": [
        {
          "id": 1,
          "name": "Tech Corp",
          "category": "Technology",
          "logoUrl": "https://techcorp.com/logo.png",
          "location": "San Francisco, CA",
          "about": "Innovative tech solutions",
          "currentNumberOfInternships": 5,
          "rating": 4.5,
          "created_at": "2025-05-01 12:00:00",
          "updated_at": "2025-05-01 12:00:00"
        }
      ]
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "message": "No companies found"
    }
    ```

### 8. Get Companies by Category
Retrieve companies by category.

- **Method**: `GET`
- **URI**: `/companies/by-category`
- **Query Parameters**:
  - `category` (string, required): Category to filter by.
  - `page` (integer, optional, default: 1): Page number.
  - `limit` (integer, optional, default: 10): Number of companies per page.
- **Authentication**: None (public).
- **Example**: `GET /companies/by-category?category=Technology&page=1&limit=10`
- **Response**:
  - **200 OK**:
    ```json
    {
      "data": [
        {
          "id": 1,
          "name": "Tech Corp",
          "category": "Technology",
          "logoUrl": "https://techcorp.com/logo.png",
          "location": "San Francisco, CA",
          "about": "Innovative tech solutions",
          "currentNumberOfInternships": 5,
          "rating": 4.5,
          "created_at": "2025-05-01 12:00:00",
          "updated_at": "2025-05-01 12:00:00"
        }
      ]
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "message": "No companies found"
    }
    ```

### 9. Get Companies by Location
Retrieve companies by location.

- **Method**: `GET`
- **URI**: `/companies/by-location`
- **Query Parameters**:
  - `location` (string, required): Location to filter by.
  - `page` (integer, optional, default: 1): Page number.
  - `limit` (integer, optional, default: 10): Number of companies per page.
- **Authentication**: None (public).
- **Example**: `GET /companies/by-location?location=San%20Francisco&page=1&limit=10`
- **Response**:
  - **200 OK**:
    ```json
    {
      "data": [
        {
          "id": 1,
          "name": "Tech Corp",
          "category": "Technology",
          "logoUrl": "https://techcorp.com/logo.png",
          "location": "San Francisco, CA",
          "about": "Innovative tech solutions",
          "currentNumberOfInternships": 5,
          "rating": 4.5,
          "created_at": "2025-05-01 12:00:00",
          "updated_at": "2025-05-01 12:00:00"
        }
      ]
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "message": "No companies found"
    }
    ```

### 10. Get Companies by Rating
Retrieve companies by exact rating.

- **Method**: `GET`
- **URI**: `/companies/by-rating`
- **Query Parameters**:
  - `rating` (float, required): GreaterThan or Equal with given rating to filter by (e.g., `4.5`).
  - `page` (integer, optional, default: 1): Page number.
  - `limit` (integer, optional, default: 10): Number of companies per page.
- **Authentication**: None (public).
- **Example**: `GET /companies/by-rating?rating=4.5&page=1&limit=10`
- **Response**:
  - **200 OK**:
    ```json
    {
      "data": [
        {
          "id": 1,
          "name": "Tech Corp",
          "category": "Technology",
          "logoUrl": "https://techcorp.com/logo.png",
          "location": "San Francisco, CA",
          "about": "Innovative tech solutions",
          "currentNumberOfInternships": 5,
          "rating": 4.5,
          "created_at": "2025-05-01 12:00:00",
          "updated_at": "2025-05-01 12:00:00"
        }
      ]
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "message": "No companies found"
    }
    ```

### 11. Get Company Internships
Retrieve internships associated with a company.

- **Method**: `GET`
- **URI**: `/companies/{id}/internships`
- **Path Parameters**:
  - `id` (integer): The company’s unique ID.
- **Query Parameters**:
  - `page` (integer, optional, default: 1): Page number.
  - `limit` (integer, optional, default: 10): Number of internships per page.
- **Authentication**: None (public). Optionally, may require `Authorization: Bearer <admin_jwt_token>` with `role: admin` if configured.
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
          "type": "Full-time",
          "category": "Engineering",
          "salaryRange": "$20-$30/hour",
          "startDate": "2025-06-01",
          "endDate": "2025-08-31",
          "description": "Work on cutting-edge projects...",
          "requirements": "Knowledge of Python...",
          "benefits": "Mentorship, free lunches",
          "deadline": "2025-05-01",
          "link": "https://techcorp.com/apply",
          "created_at": "2025-05-01 11:08:32",
          "updated_at": "2025-05-01 11:08:32"
        }
      ]
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "message": "No internships found for this company"
    }
    ```
  - **403 Forbidden** (if admin-only):
    ```json
    {
      "message": "Access denied"
    }
    ```

## Notes
- **Company-Internship Relationship**: The `GET /companies/{id}/internships` endpoint retrieves internships where the `company` field (string) matches the company’s `name`. If your `internships` table uses a `company_id` foreign key, ensure the `CompanyRepository` queries by `company_id`.
- **Validation**: The API does not enforce strict validation (e.g., `rating` between 0 and 5). Implement validation in `CompanyUsecase` or `CompanyController` if needed.
- **Pagination**: All list endpoints (`GET /companies`, `/search`, `/by-name`, `/by-category`, `/by-location`, `/by-rating`, `/internships`) support pagination with `page` and `limit`.
- **Error Handling**: Additional error codes (e.g., 400 for invalid input) may be returned if validation is added to the controller or use case.
- **Timestamps**: The `created_at` and `updated_at` fields are set by the application (e.g., `date('Y-m-d H:i:s')`) during creation and update.

## Example Usage
### Create a Company
```bash
curl -X POST http://<your-domain>/companies \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_jwt_token>" \
  -d '{
    "name": "Tech Corp",
    "category": "Technology",
    "logoUrl": "https://techcorp.com/logo.png",
    "location": "San Francisco, CA",
    "about": "Innovative tech solutions",
    "currentNumberOfInternships": 5,
    "rating": 4.5
  }'
```

### Get Companies by Rating
```bash
curl "http://<your-domain>/companies/by-rating?rating=4.5&page=1&limit=10"
```

### Get Company Internships
```bash
curl "http://<your-domain>/companies/1/internships?page=1&limit=10"
```