# Application Routes API Documentation

## Overview
The Application Routes API provides endpoints to manage internship applications, including creating, retrieving, updating, and deleting applications, as well as fetching application lists and statistics. All endpoints require JWT authentication via the `Authorization: Bearer <jwt_token>` header. Admin-only endpoints (`POST /applications`, `PATCH /applications/{id}`, `DELETE /applications/{id}`, `GET /applications`) require the JWT payload to include `role: admin`.

---

## 1. Create Application
Create a new internship application.

- **Method**: POST
- **URI**: `/applications`
- **Authentication**: Requires `Authorization: Bearer <admin_jwt_token>` with `admin` role.
- **Content-Type**: `application/json`
- **Request Body**:
  ```json
  {
    "company_id": 1,
    "user_id": 1,
    "internship_id": 1,
    "status": "pending",
    "resume_url": "https://example.com/resume.pdf",
    "cover_letter": "Dear Hiring Manager, I am excited to apply...",
    "submission_date": "2025-05-01"
  }
  ```
  - `company_id`: Integer, required, ID of the company.
  - `user_id`: Integer, required, ID of the user.
  - `internship_id`: Integer, required, ID of the internship.
  - `status`: String, required, one of `pending`, `accepted`, `rejected`.
  - `resume_url`: String, optional, URL to the resume (max 255 characters).
  - `cover_letter`: String, optional, cover letter text.
  - `submission_date`: String, optional, date of submission (format: `YYYY-MM-DD`, defaults to current date).
- **Responses**:
  - **201 Created**:
    ```json
    {
      "message": "Application created successfully",
      "data": {
        "id": 1,
        "company_id": 1,
        "user_id": 1,
        "internship_id": 1,
        "status": "pending",
        "resume_url": "https://example.com/resume.pdf",
        "cover_letter": "Dear Hiring Manager, I am excited to apply...",
        "additional_documents": null,
        "submission_date": "2025-05-01",
        "created_at": "2025-05-01 12:00:00",
        "updated_at": "2025-05-01 12:00:00"
      }
    }
    ```
  - **400 Bad Request**:
    ```json
    {
      "message": "Failed to create application"
    }
    ```
  - **401 Unauthorized** (missing or invalid token):
    ```json
    {
      "message": "Unauthorized"
    }
    ```
  - **403 Forbidden** (non-admin role):
    ```json
    {
      "message": "Access denied"
    }
    ```

---

## 2. Get Application by ID
Retrieve a specific application by its ID.

- **Method**: GET
- **URI**: `/applications/{id}`
- **Authentication**: Requires `Authorization: Bearer <jwt_token>`.
- **Parameters**:
  - `id`: Integer, required, application ID (in URL path).
- **Responses**:
  - **200 OK**:
    ```json
    {
      "data": {
        "id": 1,
        "company_id": 1,
        "user_id": 1,
        "internship_id": 1,
        "status": "pending",
        "resume_url": "https://example.com/resume.pdf",
        "cover_letter": "Dear Hiring Manager, I am excited to apply...",
        "additional_documents": null,
        "submission_date": "2025-05-01",
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
      "message": "Application not found"
    }
    ```

---

## 3. Update Application
Partially update an existing application.

- **Method**: PATCH
- **URI**: `/applications/{id}`
- **Authentication**: Requires `Authorization: Bearer <admin_jwt_token>` with `admin` role.
- **Content-Type**: `application/json`
- **Parameters**:
  - `id`: Integer, required, application ID (in URL path).
- **Request Body**:
  ```json
  {
    "status": "accepted",
    "resume_url": "https://example.com/updated_resume.pdf"
  }
  ```
  - Any subset of `Application` fields can be provided (e.g., `company_id`, `user_id`, `internship_id`, `status`, `resume_url`, `cover_letter`, `additional_documents`, `submission_date`).
- **Responses**:
  - **200 OK**:
    ```json
    {
      "message": "Application updated successfully",
      "data": {
        "id": 1,
        "company_id": 1,
        "user_id": 1,
        "internship_id": 1,
        "status": "accepted",
        "resume_url": "https://example.com/updated_resume.pdf",
        "cover_letter": "Dear Hiring Manager, I am excited to apply...",
        "additional_documents": null,
        "submission_date": "2025-05-01",
        "created_at": "2025-05-01 12:00:00",
        "updated_at": "2025-05-01 12:30:00"
      }
    }
    ```
  - **400 Bad Request**:
    ```json
    {
      "message": "Failed to update application"
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
      "message": "Unauthorized"
    }
    ```
  - **403 Forbidden**:
    ```json
    {
      "message": "Access denied"
    }
    ```

---

## 4. Delete Application
Delete an existing application.

- **Method**: DELETE
- **URI**: `/applications/{id}`
- **Authentication**: Requires `Authorization: Bearer <admin_jwt_token>` with `admin` role.
- **Parameters**:
  - `id`: Integer, required, application ID (in URL path).
- **Responses**:
  - **200 OK**:
    ```json
    {
      "message": "Application deleted successfully"
    }
    ```
  - **400 Bad Request**:
    ```json
    {
      "message": "Failed to delete application"
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
      "message": "Unauthorized"
    }
    ```
  - **403 Forbidden**:
    ```json
    {
      "message": "Access denied"
    }
    ```

---

## 5. Get All Applications
Retrieve a paginated list of all applications.

- **Method**: GET
- **URI**: `/applications`
- **Authentication**: Requires `Authorization: Bearer <admin_jwt_token>` with `admin` role.
- **Query Parameters**:
  - `page`: Integer, optional, page number (default: 1).
  - `limit`: Integer, optional, number of items per page (default: 10).
- **Responses**:
  - **200 OK**:
    ```json
    {
      "data": [
        {
          "id": 1,
          "company_id": 1,
          "user_id": 1,
          "internship_id": 1,
          "status": "pending",
          "resume_url": "https://example.com/resume.pdf",
          "cover_letter": "Dear Hiring Manager, I am excited to apply...",
          "additional_documents": null,
          "submission_date": "2025-05-01",
          "created_at": "2025-05-01 12:00:00",
          "updated_at": "2025-05-01 12:00:00"
        }
      ]
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
      "message": "Unauthorized"
    }
    ```
  - **403 Forbidden**:
    ```json
    {
      "message": "Access denied"
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "message": "No applications found"
    }
    ```

---

## 6. Get Applications by User ID
Retrieve a paginated list of applications for a specific user.

- **Method**: GET
- **URI**: `/applications/by-user/{user_id}`
- **Authentication**: Requires `Authorization: Bearer <jwt_token>`.
- **Parameters**:
  - `user_id`: Integer, required, user ID (in URL path).
- **Query Parameters**:
  - `page`: Integer, optional, page number (default: 1).
  - `limit`: Integer, optional, number of items per page (default: 10).
- **Responses**:
  - **200 OK**:
    ```json
    {
      "data": [
        {
          "id": 1,
          "company_id": 1,
          "user_id": 1,
          "internship_id": 1,
          "status": "pending",
          "resume_url": "https://example.com/resume.pdf",
          "cover_letter": "Dear Hiring Manager, I am excited to apply...",
          "additional_documents": null,
          "submission_date": "2025-05-01",
          "created_at": "2025-05-01 12:00:00",
          "updated_at": "2025-05-01 12:00:00"
        }
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
      "message": "No applications found"
    }
    ```

---

## 7. Get Applications by Company ID
Retrieve a paginated list of applications for a specific company.

- **Method**: GET
- **URI**: `/applications/by-company/{company_id}`
- **Authentication**: Requires `Authorization: Bearer <jwt_token>`.
- **Parameters**:
  - `company_id`: Integer, required, company ID (in URL path).
- **Query Parameters**:
  - `page`: Integer, optional, page number (default: 1).
  - `limit`: Integer, optional, number of items per page (default: 10).
- **Responses**:
  - **200 OK**:
    ```json
    {
      "data": [
        {
          "id": 1,
          "company_id": 1,
          "user_id": 1,
          "internship_id": 1,
          "status": "pending",
          "resume_url": "https://example.com/resume.pdf",
          "cover_letter": "Dear Hiring Manager, I am excited to apply...",
          "additional_documents": null,
          "submission_date": "2025-05-01",
          "created_at": "2025-05-01 12:00:00",
          "updated_at": "2025-05-01 12:00:00"
        }
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
      "message": "No applications found"
    }
    ```

---

## 8. Get Applications by Internship ID
Retrieve a paginated list of applications for a specific internship.

- **Method**: GET
- **URI**: `/applications/by-internship/{internship_id}`
- **Authentication**: Requires `Authorization: Bearer <jwt_token>`.
- **Parameters**:
  - `internship_id`: Integer, required, internship ID (in URL path).
- **Query Parameters**:
  - `page`: Integer, optional, page number (default: 1).
  - `limit`: Integer, optional, number of items per page (default: 10).
- **Responses**:
  - **200 OK**:
    ```json
    {
      "data": [
        {
          "id": 1,
          "company_id": 1,
          "user_id": 1,
          "internship_id": 1,
          "status": "pending",
          "resume_url": "https://example.com/resume.pdf",
          "cover_letter": "Dear Hiring Manager, I am excited to apply...",
          "additional_documents": null,
          "submission_date": "2025-05-01",
          "created_at": "2025-05-01 12:00:00",
          "updated_at": "2025-05-01 12:00:00"
        }
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
      "message": "No applications found"
    }
    ```

---

## 9. Get Applications by Status
Retrieve a paginated list of applications with a specific status.

- **Method**: GET
- **URI**: `/applications/by-status/{status}`
- **Authentication**: Requires `Authorization: Bearer <jwt_token>`.
- **Parameters**:
  - `status`: String, required, application status (e.g., `pending`, `accepted`, `rejected`) (in URL path).
- **Query Parameters**:
  - `page`: Integer, optional, page number (default: 1).
  - `limit`: Integer, optional, number of items per page (default: 10).
- **Responses**:
  - **200 OK**:
    ```json
    {
      "data": [
        {
          "id": 1,
          "company_id": 1,
          "user_id": 1,
          "internship_id": 1,
          "status": "pending",
          "resume_url": "https://example.com/resume.pdf",
          "cover_letter": "Dear Hiring Manager, I am excited to apply...",
          "additional_documents": null,
          "submission_date": "2025-05-01",
          "created_at": "2025-05-01 12:00:00",
          "updated_at": "2025-05-01 12:00:00"
        }
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
      "message": "No applications found"
    }
    ```

---

## 10. Get Application Statistics by User ID
Retrieve statistics for a user’s applications (e.g., counts by status).

- **Method**: GET
- **URI**: `/applications/stats/{user_id}`
- **Authentication**: Requires `Authorization: Bearer <jwt_token>`.
- **Parameters**:
  - `user_id`: Integer, required, user ID (in URL path).
- **Responses**:
  - **200 OK**:
    ```json
    {
      "data": {
        "total": 3,
        "pending": 2,
        "accepted": 1,
        "rejected": 0
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
      "message": "No application stats found"
    }
    ```

---

## 11. Get Applications Information
Retrieve a paginated list of detailed application information, including company and internship details, for a specific user.

- **Method**: GET
- **URI**: `/applications/information/{user_id}`
- **Authentication**: Requires `Authorization: Bearer <jwt_token>`.
- **Parameters**:
  - `user_id`: Integer, required, user ID (in URL path).
- **Query Parameters**:
  - `page`: Integer, optional, page number (default: 1).
  - `limit`: Integer, optional, number of items per page (default: 10).
- **Responses**:
  - **200 OK**:
    ```json
    {
      "data": [
        {
          "application_id": 1,
          "status": "pending",
          "resume_url": "https://example.com/resume.pdf",
          "cover_letter": "Dear Hiring Manager, I am excited to apply...",
          "additional_documents": null,
          "submission_date": "2025-05-01",
          "application_created_at": "2025-05-01 12:00:00",
          "application_updated_at": "2025-05-01 12:00:00",
          "company_name": "Tech Corp",
          "company_category": "Technology",
          "company_logo_url": "https://techcorp.com/logo.png",
          "company_location": "San Francisco, CA",
          "company_about": "Innovative tech solutions",
          "company_rating": 4.5,
          "internship_title": "Software Intern",
          "internship_location": "San Francisco, CA",
          "internship_type": "Full-time",
          "internship_category": "Engineering",
          "internship_salary_range": null,
          "internship_start_date": "2025-06-01",
          "internship_end_date": "2025-08-31",
          "internship_description": "Work on cutting-edge projects",
          "internship_requirements": "Python, JavaScript",
          "internship_benefits": null,
          "internship_deadline": "2025-05-01",
          "internship_link": "https://apply.com"
        }
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
      "message": "No applications found"
    }
    ```

---

## Authentication
All endpoints require a valid JWT token in the `Authorization` header:
```
Authorization: Bearer <jwt_token>
```
- **Admin Routes** (`POST /applications`, `PATCH /applications/{id}`, `DELETE /applications/{id}`, `GET /applications`): The JWT payload must include `role: admin`. Non-admin users receive a 403 response.
- **Other Routes**: Require a valid JWT but no specific role, unless restricted by user ID (e.g., `user_id` must match the authenticated user’s ID in some implementations).
- **401 Unauthorized**: Returned if the token is missing, invalid, or expired.

## Error Handling
- **400 Bad Request**: Invalid input data (e.g., missing required fields, invalid `status`).
- **401 Unauthorized**: Missing or invalid JWT token.
- **403 Forbidden**: Insufficient permissions (e.g., non-admin accessing admin-only routes).
- **404 Not Found**: Resource not found (e.g., no applications for the given ID or filters).
- **500 Internal Server Error**: Rare, indicates a server-side issue (e.g., database error).

## Notes
- Pagination is supported for list endpoints (`GET /applications`, `GET /applications/by-user/{user_id}`, etc.) via `page` and `limit` query parameters.
- The `status` field must be one of `pending`, `accepted`, or `rejected`.
- The `getApplicationsInformation` endpoint provides a comprehensive view, joining application data with company and internship details.
- Ensure the `companies`, `users`, and `internships` tables are populated, as `applications` references them via foreign keys.