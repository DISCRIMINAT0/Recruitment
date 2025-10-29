# CVHub - Professional CV Builder Platform

A full-stack Next.js application that allows applicants to create professional CVs, companies to browse talent, and admins to manage advertisements.

## Features

### For Applicants
- Create professional CVs with multi-step wizard
- Add personal info, experience, education, skills
- Real-time CV preview
- Download CV as PDF
- Share CV via public link
- View profile analytics

### For Companies
- Browse applicant directory
- Search and filter by skills, location, experience
- Bookmark favorite candidates
- Contact applicants directly

### For Admins
- Manage advertisements
- View analytics (impressions, clicks)
- Manage contact requests

## Tech Stack

- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js Server Actions, Route Handlers
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account
- Vercel account (for deployment)

### Installation

1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd cvhub
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables
\`\`\`bash
cp .env.example .env.local
\`\`\`

4. Add your Supabase credentials to `.env.local`:
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
\`\`\`

5. Run the development server
\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Database Setup

1. Go to your Supabase project
2. Run the SQL migration from `scripts/01-create-schema.sql`
3. The schema includes all tables, indexes, and RLS policies

## Project Structure

\`\`\`
cvhub/
├── app/
│   ├── api/                 # API routes
│   ├── auth/               # Authentication pages
│   ├── dashboard/          # Protected dashboard
│   ├── directory/          # Applicant directory
│   ├── cv/                 # Public CV viewing
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   └── globals.css         # Global styles
├── components/
│   ├── cv-builder/         # CV builder steps
│   ├── dashboard/          # Dashboard components
│   ├── cv/                 # CV display components
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── supabase/          # Supabase clients
│   └── auth/              # Auth utilities
├── scripts/
│   └── 01-create-schema.sql  # Database schema
└── proxy.js               # Middleware configuration
\`\`\`

## Key Pages

### Public Routes
- `/` - Landing page
- `/auth/login` - Login page
- `/auth/signup` - Signup page
- `/directory` - Applicant directory
- `/cv/[id]` - Public CV view

### Protected Routes (Applicant)
- `/dashboard` - CV management dashboard
- `/dashboard/cv-builder` - CV builder wizard
- `/dashboard/cv/[id]` - CV preview and edit

### Protected Routes (Company)
- `/dashboard` - Company dashboard
- `/directory` - Applicant directory with filtering

## Authentication

The app uses Supabase Auth with email/password authentication. Users can sign up as either:
- **Applicant**: Can create and manage CVs
- **Company**: Can browse applicants and post ads

## Database Schema

### Main Tables
- `users` - User accounts with roles
- `applicant_profiles` - Applicant-specific data
- `company_profiles` - Company-specific data
- `cvs` - CV documents
- `cv_sections` - CV content sections
- `advertisements` - Job advertisements
- `bookmarks` - Saved applicants
- `contact_requests` - Contact form submissions

All tables have Row-Level Security (RLS) policies enabled for data protection.

## API Routes

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login (handled by Supabase client)

### CV Management
- `GET /api/cv/list` - List user's CVs
- `POST /api/cv/create` - Create new CV
- `GET /api/cv/[id]` - Get CV details
- `DELETE /api/cv/[id]` - Delete CV
- `GET /api/cv/[id]/pdf` - Download CV as PDF

### Directory
- `GET /api/directory/search` - Search applicants with filters

### Bookmarks
- `POST /api/bookmarks/toggle` - Toggle bookmark

## Security

- Row-Level Security (RLS) policies on all tables
- Server-side authentication checks
- Protected API routes
- Service role key for admin operations
- Middleware for route protection

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add environment variables in Vercel project settings
4. Deploy

\`\`\`bash
vercel deploy
\`\`\`

## Environment Variables

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
\`\`\`

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
