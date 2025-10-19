# PDMS Client - Next.js Application

## 📋 Overview

This is a **Pharmacy Drug Management System (PDMS)** client application built with Next.js 15, TypeScript, and modern React patterns. The application provides authentication, dashboard functionality, and drug management features.

## 🏗️ Architecture & Structure

### Core Technologies
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **Zustand** for state management
- **SWR** for data fetching
- **Axios** for HTTP requests
- **React Hook Form** for form handling

### Project Structure

```
client/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Authentication routes group
│   │   │   ├── login/         # Login page
│   │   │   └── register/      # Registration page
│   │   ├── (dashboard)/       # Protected dashboard routes
│   │   │   ├── profile/       # User profile page
│   │   │   └── inventory/     # Inventory management
│   │   ├── drugs/            # Drug management pages
│   │   └── layout.tsx        # Root layout
│   ├── api/                   # API service functions
│   │   ├── auth.services.ts   # Authentication API calls
│   │   ├── product.services.ts # Product API calls
│   │   └── health.services.ts # Health check API
│   ├── components/           # Reusable UI components
│   │   ├── ui/               # Base UI components (shadcn/ui)
│   │   ├── auth-provider.tsx # Authentication context
│   │   └── theme-provider.tsx # Theme management
│   ├── features/             # Feature-based organization
│   │   ├── auth/             # Authentication feature
│   │   ├── dashboard/        # Dashboard feature
│   │   └── health/           # Health check feature
│   ├── hooks/                # Custom React hooks
│   ├── lib/                   # Utility libraries
│   ├── store/                 # Zustand stores
│   ├── types/                 # TypeScript type definitions
│   └── utils/                 # Utility functions
```

## 🔧 Key Features & Components

### 1. Authentication System
- **Login/Register Forms**: Complete authentication flow
- **Protected Routes**: Dashboard protection with auth guards
- **Session Management**: SWR-based user session handling
- **Auto-redirect**: Automatic routing based on auth state

### 2. Pages & Routes

#### Authentication Pages
- **`/login`** - User login with email/password
- **`/register`** - User registration with validation
- **`/`** - Landing page with auth redirect logic

#### Dashboard Pages
- **`/profile`** - User dashboard with logout functionality
- **`/inventory`** - Inventory management (placeholder)
- **`/drugs`** - Drug management system (placeholder)

### 3. API Services

#### Auth Services (`src/api/auth.services.ts`)
```typescript
// Key functions:
- register(payload)     // User registration
- login(payload)        // User authentication  
- logout()              // User logout
- me()                  // Get current user data
```

#### Product Services (`src/api/product.services.ts`)
```typescript
// Key functions:
- getProducts()         // Fetch all products
- // Additional CRUD operations (incomplete)
```

### 4. State Management

#### Auth Store (`src/store/authStore.ts`)
- Zustand-based global auth state
- User data management
- Authentication status tracking

#### Custom Hooks
- **`useAuth`** - Authentication state and actions
- **`useDebounce`** - Input debouncing utility
- **`useFetch`** - Generic data fetching
- **`useLocalStorage`** - Local storage management

### 5. UI Components

#### Base Components (`src/components/ui/`)
- **Button** - Styled button with variants
- **Card** - Content containers
- **Input** - Form inputs
- **Label** - Form labels
- **Form** - Form wrapper components

#### Feature Components
- **LoginForm** - Complete login form with validation
- **RegisterForm** - Registration form with error handling
- **StatsCard** - Dashboard statistics display
- **CheckHealth** - API health monitoring

## 🚨 Issues & Bloated Code Identified

### 1. **Duplicate Authentication Logic**
- **Problem**: Two different `useAuth` hooks exist:
  - `src/hooks/useAuth.ts` (SWR-based)
  - `src/features/auth/hooks/useAuth.ts` (Zustand-based)
- **Impact**: Confusion, inconsistent state management
- **Solution**: Choose one approach and remove the other

### 2. **Incomplete API Services**
- **Problem**: `product.services.ts` has incomplete functions
- **Impact**: Broken functionality, unused code
- **Solution**: Complete or remove unused functions

### 3. **Empty/Placeholder Components**
- **Problem**: Several components are empty or incomplete:
  - `ProtectedLayout.tsx` - Just placeholder text
  - `AuthLayout.tsx` - Just placeholder text
  - `drugs/page.tsx` - Empty file
- **Impact**: Dead code, confusion
- **Solution**: Implement or remove these components

### 4. **Inconsistent Error Handling**
- **Problem**: Different error handling patterns across components
- **Impact**: Inconsistent user experience
- **Solution**: Standardize error handling approach

### 5. **Unused Dependencies**
- **Problem**: Several dependencies may be unused:
  - `@tanstack/react-query` (using SWR instead)
  - `motion` (animation library not used)
  - `recharts` (charts not implemented)
- **Impact**: Bundle bloat, maintenance overhead
- **Solution**: Remove unused dependencies

### 6. **Type Definition Duplication**
- **Problem**: User types defined in multiple places:
  - `src/types/user.ts`
  - `src/features/auth/types.ts`
- **Impact**: Type inconsistency
- **Solution**: Consolidate type definitions

## 🛠️ Recommended Improvements

### 1. **Consolidate Authentication**
```typescript
// Choose ONE approach:
// Option A: SWR-based (current in hooks/useAuth.ts)
// Option B: Zustand-based (current in features/auth/hooks/useAuth.ts)
```

### 2. **Complete API Services**
```typescript
// Finish product.services.ts or remove unused functions
export async function getProducts() {
  // Complete implementation
}
```

### 3. **Implement Missing Components**
```typescript
// Either implement or remove:
- ProtectedLayout.tsx
- AuthLayout.tsx  
- drugs/page.tsx
```

### 4. **Standardize Error Handling**
```typescript
// Create a consistent error handling pattern
const handleApiError = (error: unknown) => {
  // Standardized error handling logic
}
```

### 5. **Clean Up Dependencies**
```bash
# Remove unused packages
npm uninstall @tanstack/react-query motion recharts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
cd client
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

## 🔗 API Integration

The client connects to a backend API with the following endpoints:
- **Base URL**: `http://localhost:5000/api/`
- **Auth**: `/auth/login`, `/auth/register`, `/auth/logout`, `/auth/me`
- **Products**: `/products/`, `/products/search`
- **Orders**: `/orders/`
- **Featured Items**: `/featured/`

## 📝 Development Notes

### Current Status
- ✅ Authentication system working
- ✅ Basic routing implemented
- ✅ UI components functional
- ⚠️ Some features incomplete
- ⚠️ Code duplication issues
- ⚠️ Unused dependencies

### Next Steps
1. Choose single authentication approach
2. Complete missing API services
3. Implement or remove placeholder components
4. Clean up unused dependencies
5. Standardize error handling
6. Add proper TypeScript types

## 🎯 Best Practices Applied

- ✅ Feature-based folder structure
- ✅ Custom hooks for reusable logic
- ✅ TypeScript for type safety
- ✅ Component composition
- ✅ Responsive design with Tailwind
- ✅ Accessibility with Radix UI

## 🐛 Known Issues

1. **Duplicate useAuth hooks** - Choose one implementation
2. **Incomplete product services** - Finish or remove
3. **Empty component files** - Implement or remove
4. **Inconsistent error handling** - Standardize approach
5. **Unused dependencies** - Clean up package.json

---

*This README provides a comprehensive overview of your PDMS client application. Focus on consolidating the authentication system and cleaning up unused code for a better developer experience.*