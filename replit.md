# Bwari Exchange

## Overview

Bwari Exchange is a currency exchange platform for converting between Mobile Money (XOF/Franc CFA) and cryptocurrencies (USDT, BTC). The application is built as a full-stack TypeScript project with a React frontend and Express backend, using PostgreSQL for data persistence. The platform targets French-speaking users in West Africa and provides real-time exchange rates, transaction management, and an admin dashboard.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Animations**: Framer Motion for page transitions and UI animations
- **Build Tool**: Vite with path aliases (@/ for client/src, @shared for shared code)

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Pattern**: RESTful endpoints defined in shared/routes.ts with Zod validation
- **Authentication**: Replit Auth (OpenID Connect) with Passport.js
- **Session Management**: express-session with PostgreSQL store (connect-pg-simple)
- **Development**: tsx for TypeScript execution, Vite middleware for HMR

### Data Layer
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with drizzle-zod for schema validation
- **Schema Location**: shared/schema.ts (shared between frontend and backend)
- **Migrations**: drizzle-kit with migrations output to /migrations folder

### Key Design Patterns
- **Shared Types**: TypeScript types and Zod schemas in /shared directory used by both client and server
- **API Contract**: Routes defined with input/output schemas in shared/routes.ts
- **Storage Abstraction**: IStorage interface in server/storage.ts for database operations
- **Auth Isolation**: Replit Auth integration isolated in server/replit_integrations/auth/

### Database Schema
- **users**: User profiles (required for Replit Auth)
- **sessions**: Session storage (required for Replit Auth)
- **exchange_rates**: Currency pair rates with fees and limits
- **transactions**: Exchange transaction records with status tracking

## External Dependencies

### Database
- PostgreSQL via DATABASE_URL environment variable
- Drizzle ORM for type-safe queries
- connect-pg-simple for session storage

### Authentication
- Replit Auth (OpenID Connect)
- Requires REPL_ID and SESSION_SECRET environment variables
- ISSUER_URL defaults to https://replit.com/oidc

### UI Components
- shadcn/ui (Radix UI primitives with Tailwind styling)
- Full component library in client/src/components/ui/
- Uses "new-york" style variant with neutral base color

### Key NPM Packages
- @tanstack/react-query: Server state management
- framer-motion: Animations
- date-fns: Date formatting (French locale)
- zod: Runtime validation
- drizzle-orm + drizzle-zod: Database ORM and schema validation