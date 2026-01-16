# Agent Technical Context - MP Platform

## Repository Overview

This is the frontend web application for the MP (Medical Platform) - a React-based health platform built with Next.js, providing user interfaces for health tracking, provider networks, and health recommendations.

## Technology Stack

-   **Frontend**: Next.js 14.2.18, React 18, TypeScript 5
-   **Styling**: Tailwind CSS 3.4.1, CSS Modules
-   **Package Manager**: npm
-   **UI Components**: Radix UI primitives with shadcn/ui integration
-   **Authentication**: Custom AuthContext implementation

## Key Libraries & Dependencies

### UI & Styling

-   **@radix-ui/\*** - Headless UI components (dialogs, dropdowns, forms)
-   **lucide-react** (0.460.0) - Icon library
-   **tailwindcss-animate** (1.0.7) - Animation utilities
-   **class-variance-authority** (0.7.1) - Component variants
-   **clsx** & **tailwind-merge** - Class name utilities

### Charts & Data Visualization

-   **chart.js** (4.4.7) - Canvas-based charts
-   **react-chartjs-2** (5.3.0) - React Chart.js wrapper
-   **chartjs-adapter-moment** (1.0.1) - Time scale adapter
-   **react-circular-progressbar** (2.1.0) - Circular progress components
-   **moment** (2.30.1) - Date manipulation

### Forms & Validation

-   **react-hook-form** (7.54.2) - Form state management
-   **@hookform/resolvers** (3.9.1) - Validation resolvers
-   **zod** (3.24.1) - Schema validation

### Data & File Processing

-   **xport-js** (0.1.4) - SAS file processing
-   **@microsoft/clarity** (1.0.0) - Analytics integration

### Material UI (Optional/Legacy)

-   **@mui/material** (7.0.0) - Material Design components
-   **@emotion/react** & **@emotion/styled** - CSS-in-JS styling

## Project Structure

-   `src/app/` - Next.js App Router pages
    -   `dashboard/` - Main dashboard interface
    -   `journey/` - Health journey tracking
    -   `market/` - Health product marketplace
    -   `network/` - Provider network interface
    -   `profile/` - User profile management
    -   `login/`, `signup/` - Authentication pages
-   `src/components/` - Reusable React components
    -   `ui/` - Base UI components (shadcn/ui style)
    -   Authentication components
    -   Health data visualization components
    -   Form components
-   `src/hooks/` - Custom React hooks
-   `src/lib/` - Utility functions and configurations
-   `src/types/` - TypeScript type definitions

## Key Features

-   **Health Dashboard**: Central health score tracking and visualization
-   **Health Journey**: Digital health journey management
-   **Provider Network**: Healthcare provider discovery and management
-   **Health Data Import**: File upload and data processing
-   **Product Recommendations**: Personalized health product suggestions
-   **User Profile Management**: Comprehensive profile editing
-   **Health Data Visualization**: Charts, graphs, and trend analysis

## Component Architecture

-   `AuthContext` - Authentication state management
-   `central-health-score` - Main health scoring display
-   `health-data-chart` - Health metrics visualization
-   `ProductRecommendations` - AI-powered product suggestions
-   `HealthJourneyCards` - Journey step management
-   `UserProfileEdit` - Profile management interface

## Styling System

-   **Tailwind CSS** for utility-first styling
-   **CSS Modules** for component-specific styles
-   **Custom fonts** (Nexa Bold)
-   Responsive design with mobile-first approach

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Configuration Files

-   `next.config.mjs` - Next.js configuration
-   `tailwind.config.ts` - Tailwind CSS configuration
-   `tsconfig.json` - TypeScript configuration
-   `components.json` - UI components configuration

## Integration Points

-   API integration with mp_api backend
-   Authentication flow management
-   Health data synchronization
-   Real-time updates and notifications

## UI/UX Features

-   Mobile-responsive design
-   Health data visualization dashboards
-   Interactive forms and onboarding
-   File upload capabilities
-   Toast notifications system

## Code Conventions

-   Use ES6 module imports
-   Use named exports for components and utilities (avoid default exports)
-   TypeScript for all components (.tsx files)
-   Use arrow functions for components and methods
-   Async/await for asynchronous operations
<!-- -   PascalCase for component files and component names -->
-   kebab-case for utility/page components (e.g., `health-data-chart.tsx`)
-   Use `'use client'` directive for client-side components
-   Destructure props and use TypeScript interfaces for type safety
-   Use Radix UI primitives with custom styling via Tailwind CSS
-   Implement proper error boundaries and loading states
-   Use custom hooks for complex state logic
-   Follow shadcn/ui component patterns for consistency
