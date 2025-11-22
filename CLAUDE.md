# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DonaAyuda is an animal rescue donation platform for Argentina focused on complete transparency. Users can create fundraising campaigns for animal medical treatments, shelter, food, and rescue operations with real-time updates and verified expense tracking.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm start` - Start production server

## Technology Stack

- **Framework**: Next.js 15.2.4 with App Router
- **Frontend**: React 19 + TypeScript
- **Styling**: TailwindCSS v4 with shadcn/ui components
- **UI Components**: Radix UI primitives + Lucide React icons
- **Data Fetching**: SWR for client-side data fetching
- **Authentication**: JWT-based auth with cookies, role-based permissions

## Architecture

### App Router Structure
- `app/` - Next.js App Router pages
  - `page.tsx` - Landing page
  - `(auth)/` - Authentication pages (login, register, forgot-password, reset-password)
  - `campanas/` - Public campaigns section
  - `admin/campanas/` - Campaign management (protected by auth)
- `components/` - Reusable UI components
  - `ui/` - shadcn/ui base components
  - `auth/` - Authentication components (LoginForm, AuthProvider, ProtectedRoute)
  - `campaign/` - Campaign-specific components
  - `forms/` - Form components
  - `receipts/` - Receipt management components
- `lib/` - Utilities and business logic
  - `auth/` - Authentication utilities, token storage, API calls
  - `data/` - Mock data and API functions (no database yet)
  - `hooks/` - Custom React hooks (useFilters, useCampaigns, useAuthSWR)
- `types/` - TypeScript definitions

### Key Data Models
- `Campaign` - Main fundraising campaigns with organizer and animal details
- `CampaignUpdate` - Timeline updates with expenses and media
- `Receipt` - Financial transparency documents
- `Donation` - Transaction records with payment integration
- `User` - User accounts with roles and permissions
- `AuthTokens` - JWT tokens for authentication

## Important Notes

- **Path Aliases**: `@/*` maps to project root
- **Mock Data**: Currently uses mock data in `lib/data/` - no database integration yet
- **Payment**: MercadoPago integration for donations
- **Recent Refactor**: Code duplication reduced by 70% with generic components
- **No Tests**: No testing framework currently implemented
- **UI Library**: Uses shadcn/ui with New York style and CSS variables

## Component Patterns

The project follows a clean architecture with:
- Generic reusable components (FormBuilder, FilterBar, ReceiptList)
- Custom hooks for state management
- Performance optimizations with useMemo/useCallback
- Consistent TypeScript typing throughout

## Development Workflow

1. Run `npm run dev` to start development
2. Use `npm run lint` to check code quality before commits
3. Components follow shadcn/ui patterns with Radix UI primitives
4. All campaigns and data are currently mock - replace with real API calls when implementing backend

## Authentication System

### JWT Authentication
- **Backend API**: `http://localhost:9999` (configurable via `NEXT_PUBLIC_API_URL`)
- **Token Storage**: Secure HTTP-only cookies with js-cookie
- **Auto-refresh**: Automatic token refresh before expiration
- **Role-based Access**: Admin, user, and custom roles with granular permissions

### Auth Components
- `AuthProvider` - Global authentication context
- `ProtectedRoute` - Route protection wrapper
- `AuthGuard` - Component-level protection
- `LoginForm`, `RegisterForm` - Authentication forms
- `ForgotPasswordForm`, `ResetPasswordForm` - Password reset flow

### SWR Integration
- `authenticatedFetcher` - Automatic JWT token injection
- `useAuthSWR` - Hook for authenticated API calls
- `usePublicSWR` - Hook for public API calls
- Auto-redirect to login on 401 errors
- Elegant 403 error handling for permissions

### Usage Examples
```typescript
// Protect admin routes with automatic redirect
<AdminRoute>
  <AdminCampaignsPage />
</AdminRoute>

// Use authenticated API calls
const { data, error } = useAuthSWR<Campaign[]>('/api/campaigns')

// Check permissions
const { hasRole, hasPermission } = useAuth()
if (hasRole('admin')) {
  // Show admin features
}

// Smart navigation with auth checks
<AdminLink 
  href="/admin/campanas/crear"
  asButton
  fallbackComponent={<PermissionDenied />}
>
  Crear Campaña
</AdminLink>

// Auto-redirect to login with return URL
<AuthenticatedLink href="/perfil">
  Mi Perfil
</AuthenticatedLink>
```

### Redirect Flow
- **Unauthenticated access** → `/login?redirect=/intended/page`
- **Successful login** → Automatic redirect to intended page
- **Insufficient permissions** → Elegant 403 error or fallback component
- **Smart navigation** → `AuthAwareLink` handles all auth checks automatically

### Environment Setup
Create `.env.local` with:
```
NEXT_PUBLIC_API_URL=http://localhost:9999
```