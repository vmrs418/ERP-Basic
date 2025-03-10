# ERP System

A full-featured Enterprise Resource Planning system with employee management, attendance tracking, and leave management.

## Features

- **Employee Management**: Track employee data, departments, designations
- **Attendance Tracking**: Check-in/out system with reporting
- **Leave Management**: Apply for and manage leave requests
- **Authentication**: Secure login with Supabase Auth

## Tech Stack

- **Frontend**: React, Next.js, Tailwind CSS, SWR for data fetching
- **Backend**: NestJS, TypeORM
- **Database**: PostgreSQL with Supabase
- **Authentication**: Supabase Auth

## Project Structure

This is a monorepo containing both frontend and backend applications:

```
├── apps
│   ├── api           # NestJS backend
│   └── web           # Next.js frontend
└── libs
    └── shared
        ├── models    # Shared model definitions
        └── utils     # Shared utility functions
```

## Getting Started

### Prerequisites

- Node.js 16+
- npm 8+
- PostgreSQL database (or a Supabase account)

### Environment Setup

1. Create a `.env` file in the root directory with the following variables:

```
# API Environment variables
DATABASE_URL=postgresql://username:password@localhost:5432/erp_db
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
JWT_SECRET=your_jwt_secret

# Web Environment variables
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

1. Install dependencies:

```bash
npm install
```

2. Build all packages:

```bash
npm run build
```

### Development

To run both frontend and backend in development mode:

```bash
npm run dev
```

Or run them separately:

```bash
# Backend only
npm run dev:api

# Frontend only
npm run dev:web
```

### Production

To build and start for production:

```bash
npm run build
npm run start
```

## License

This project is licensed under the MIT License.
