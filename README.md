# Custom Employee Portal with Zoho One Integration

A secure web-based Employee Portal that provides role-based access to enterprise applications and integrates with Zoho One services through a backend OAuth-based architecture.

## Project Overview

The Custom Employee Portal is designed to provide employees with a single secure portal for accessing business applications based on their assigned role.

The system implements:

- Custom employee authentication
- JWT-based authentication
- Role-Based Access Control (RBAC)
- Permission-based application access
- Secure backend architecture
- Zoho OAuth integration
- Audit logging
- Admin, HR, Sales, Support, and Finance roles
- React-based user interface
- Node.js and Express backend

Employees authenticate only with the Employee Portal. They do not need to enter individual Zoho OAuth credentials.

---

## Features

### Authentication

- Employee login using email and password
- Passwords are securely hashed using bcrypt
- JWT tokens are generated after successful authentication
- JWT authentication is required for protected API endpoints
- Token expiration is configured for session security

### Role-Based Access Control

The portal supports the following roles:

| Role | Authorized Application |
|------|------------------------|
| Admin | Zoho People, Zoho CRM, Zoho Desk, Zoho Books |
| HR | Zoho People |
| Sales | Zoho CRM |
| Support | Zoho Desk |
| Finance | Zoho Books |

Users only see the applications authorized for their role.

Authorization is enforced on the backend rather than relying only on frontend visibility.

### Permission Management

The application uses a relational permission model containing:

- Users
- Roles
- Permissions
- UserRoles
- RolePermissions
- AuditLogs

This allows permissions to be associated with roles and users to be associated with roles.

### Audit Logging

Important actions are recorded in the `AuditLogs` table, including:

- User login
- Viewing authorized applications
- Zoho service access attempts

This provides traceability for employee activity.

---

## Zoho One Integration

The backend contains a dedicated Zoho service responsible for OAuth token handling and API communication.

The integration uses:

- Zoho Self Client
- OAuth authorization code flow
- Refresh tokens
- Automatic access-token retrieval
- Backend-only OAuth credentials
- Axios for API communication

OAuth credentials are stored in environment variables and are not exposed to employees or committed to the repository.

### Zoho Application Mapping

The portal maps employee roles to Zoho services:

```text
Admin   -> Zoho People + Zoho CRM + Zoho Desk + Zoho Books
HR      -> Zoho People
Sales   -> Zoho CRM
Support -> Zoho Desk
Finance -> Zoho Books


Technology Stack
Frontend
React.js
Vite
JavaScript
HTML
CSS
Backend
Node.js
Express.js
JWT
bcryptjs
Axios
CORS
dotenv
Database
SQLite
better-sqlite3

                    +----------------------+
                    |   Employee Browser   |
                    |      React.js        |
                    +----------+-----------+
                               |
                               | HTTP / JSON
                               v
                    +----------------------+
                    |   Node.js / Express  |
                    |       Backend        |
                    +----------+-----------+
                               |
             +-----------------+-----------------+
             |                 |                 |
             v                 v                 v
      +-------------+   +-------------+   +-------------+
      | JWT Auth    |   | RBAC /      |   | Audit Logs  |
      | Middleware  |   | Permissions |   |             |
      +-------------+   +-------------+   +-------------+
                               |
                               v
                    +----------------------+
                    |       SQLite         |
                    | Users / Roles /      |
                    | Permissions / Logs   |
                    +----------------------+
                               |
                               | OAuth
                               v
                    +----------------------+
                    |      Zoho One        |
                    | People / CRM / Desk  |
                    | Books                |
                    +----------------------+

custom_employee_portal/
│
├── backend/
│   ├── src/
│   │   ├── database/
│   │   │   ├── database.js
│   │   │   ├── initDatabase.js
│   │   │   ├── seedUsers.js
│   │   │   └── seedPermissions.js
│   │   │
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   └── apps.js
│   │   │
│   │   ├── services/
│   │   │   └── zohoService.js
│   │   │
│   │   └── server.js
│   │
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── ...
│   │
│   ├── package.json
│   └── ...
│
└── .gitignore
