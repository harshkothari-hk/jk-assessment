# **NestJS Role-Based Authorization API with Upload Document**

A scalable and secure API built with NestJS, implementing role-based access control (RBAC), authentication, and authorization. It uses TypeORM for database management, JWT for authentication, and supports integration with AWS S3 for file storage.

---

## **Table of Contents**
1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Setup and Installation](#setup-and-installation)
4. [Environment Variables](#environment-variables)
5. [Endpoints](#endpoints)
6. [Usage](#usage)

---

## **Features**
- **Authentication & Authorization:**
  - JWT-based user authentication.
  - Role-based access control (RBAC) with roles like Admin, Editor, Viewer.
- **User Management:**
  - Create, update, fetch, and delete users.
  - Password encryption with `bcrypt`.
- **Role Management:**
  - Role and permission handling.
- **AWS S3 Integration:**
  - File upload and management.
- **TypeORM Support:**
  - Seamless database integration with migrations.
- **Swagger API Documentation:**
  - Interactive API documentation with `@nestjs/swagger`.

---

## **Technologies Used**
- **Framework:** [NestJS](https://nestjs.com/)
- **Database:** PostgreSQL with [TypeORM](https://typeorm.io/)
- **Authentication:** JWT
- **File Storage:** AWS S3
- **Validation:** [class-validator](https://github.com/typestack/class-validator)
- **API Documentation:** Swagger
- **Middleware:** Custom Guards and Interceptors

---

## **Setup and Installation**

### **Prerequisites**
1. Node.js (>=16.x)
2. PostgreSQL
3. AWS account (for S3 integration)

### **Installation**
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
2. Install dependencies:
   ```bash
   npm install
3. Start the server:
    ```bash
    npm run start:dev

## **Environment Variables**
    #server
    PORT=9001
    
    #DB
    DB_HOST=localhost
    DB_PORT=5432
    DB_USERNAME=postgres
    DB_PASSWORD=root
    DB_NAME=jk-assessment
    
    #jwt
    SALT=10
    SECRET_KEY=***
    JWT_EXPIRYIN=60m
    
    #aws
    AWS_REGION=ap-south-1
    AWS_ACCESS_KEY=***
    AWS_SECRET_ACCESS_KEY=***
    AWS_BUCKET=jk-assessment
    

## **Endpoints**

### Users
| **Method** | **Endpoint**       | **Description**              |
|------------|--------------------|------------------------------|
| POST       | `/users`           | Register a new user          |
| PUT        | `/users/:id`       | Update User                  |
| GET        | `/users`           | Get all users                |
| GET        | `/users/:id`       | Get user by ID               |
| POST       | `/users/login`     | User Login                   |
| PUT        | `/users/change-password/:id` | Password Update     |

### Roles
| **Method** | **Endpoint**       | **Description**              |
|------------|--------------------|------------------------------|
| POST       | `/roles`           | Create a new role            |
| GET        | `/roles/:id`       | Get role by ID               |
| GET        | `/roles`           | Get all roles                |
| PUT        | `/roles/:id`       | Update Role                  |

### Role Permission
| **Method** | **Endpoint**       | **Description**              |
|------------|--------------------|------------------------------|
| POST       | `/role-permission` | Add Permission               |
| GET        | `/role-permission/:roleId`| Get role permission by ID     |

### Documents
| **Method** | **Endpoint**       | **Description**              |
|------------|--------------------|------------------------------|
| POST       | `/documents`       | Add new Document             |
| GET        | `/documents`       | Get all Documents            |
| DELETE     | `/documents/:id`   | Delete Document by id        |

### Notes:
- Replace `:id` with the specific resource ID you want to access.
- Ensure that authentication tokens are provided in the request headers where required.

## **Usage**
1. **Swagger Documentation**: After starting the server, access the Swagger UI at:
    ```
    http://localhost:9001/api/swagger
2. **File Uploads:** Configure AWS S3 credentials in `.env` and integrate the provided S3 service to handle file uploads.
