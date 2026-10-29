# Team RBAC Management — Next.js 16 + PostgreSQL

A application demonstrating role-based access control (RBAC) with four roles:

- **SUPER_ADMIN** — full system access and role assignment, including super-admin accounts.
- **ADMIN** — manage regular users and view administration summaries; cannot manage super-admin accounts.
- **MANAGER** — view the user directory and operational summaries.
- **USER** — standard personal dashboard.

Includes Next.js App Router pages, PostgreSQL via Prisma, bcrypt password hashing, signed JWT sessions in HTTP-only cookies, middleware route protection, server-side role checks, and protected API endpoints.

## Requirements
- Node.js 20.9 or later
- PostgreSQL running locally or a hosted PostgreSQL database
- npm

## 3. Configure environment variables
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/team_rbac?schema=public"
AUTH_SECRET="replace-with-a-random-secret-at-least-32-characters-long"
SUPER_ADMIN_NAME="System Super Admin"
SUPER_ADMIN_EMAIL="superadmin@example.com"
SUPER_ADMIN_PASSWORD="ChangeMe123!"

## 4. Create the database tables
bash
npx prisma generate
npx prisma migrate dev --name init

If Prisma reports it cannot connect, check that PostgreSQL is running and `DATABASE_URL` is correct.
## 5. Create the Super Admin

```bash
npm run db:seed

## 6. Start the app
bash
npm run dev
Open http://localhost:3000.

## Login and test
1. Log in using the Super Admin credentials from `.env`.
2. Open `/super-admin`.
3. Create a normal account through `/signup`; public sign-up **always** creates a `USER`.
4. As Super Admin, use `PATCH /api/admin/users` to assign a role or deactivate an account. This endpoint accepts JSON such as:

json
{
  "userId": "ID_OF_EXISTING_USER",
  "role": "MANAGER"
}


The endpoint requires a signed-in Super Admin or Admin. Only Super Admin can assign `SUPER_ADMIN` or manage an existing Super Admin account. Admin can assign the other roles.

## API endpoints

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/signup` | Public | Create a User account |
| POST | `/api/auth/login` | Public | Sign in and set session cookie |
| POST | `/api/auth/logout` | Signed-in session | Clear session cookie |
| GET | `/api/auth/me` | Signed-in | Get current user |
| GET | `/api/users` | Super Admin, Admin, Manager | List users (no password hashes) |
| GET | `/api/admin` | Super Admin, Admin | Get admin summary |
| PATCH | `/api/admin/users` | Super Admin, Admin | Change allowed roles or active status |

## Dashboard routes
- `/super-admin` — Super Admin only
- `/admin` — Admin and Super Admin
- `/manager` — Manager, Admin, and Super Admin
- `/user` — any signed-in role

These are hierarchical: higher roles may open lower-level dashboards, but not the reverse. The middleware checks the session token; protected pages also verify the current user and role against PostgreSQL.
