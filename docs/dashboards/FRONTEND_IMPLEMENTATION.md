# Frontend Implementation Guide

React/Next.js implementation details for MP Platform dashboard components.

**Related Documentation:**

- [UI Components](./UI_COMPONENTS.md) - Component-specific details
- [Styling Guide](./STYLING_GUIDE.md) - CSS and styling patterns
- [API Contracts](/docs/dashboards/API_CONTRACTS.md) - API endpoints and schemas
- [Enum Mapping](/docs/dashboards/ENUM_MAPPING.md) - Value mappings and colors

---

## Table of Contents

1. [Component Hierarchy](#component-hierarchy)
2. [Data Fetching Patterns](#data-fetching-patterns)
3. [Authentication Context](#authentication-context)
4. [State Management](#state-management)
5. [Error Handling](#error-handling)
6. [Toast Notifications](#toast-notifications)

---

## Component Hierarchy

### Dashboard Page Structure

```
/dashboard (page.tsx)
    │
    └─> DashboardPage (app-dashboard-page.tsx)
           │
           ├─> Sidebar (ui/sidebar)
           │    └─> Menu Items Navigation
           │
           ├─> Header with SidebarTrigger
           │
           ├─> Main Content Grid
           │    │
           │    ├─> Card: Health Score Header
           │    │    ├─> Import PDF Button → Dialog
           │    │    ├─> Export PDF Button
           │    │    └─> Start Onboarding Button → Dialog
           │    │
           │    ├─> Row 1: Two Columns
           │    │    ├─> CentralHealthScore (left)
           │    │    └─> CurrentStats (right)
           │    │
           │    ├─> Row 2: Two Columns
           │    │    ├─> HealthJourneyCards (left, 5 cols)
           │    │    └─> Right Column (7 cols)
           │    │         ├─> ProductRecommendations
           │    │         └─> HealthExpertConsultation
           │    │
           │    └─> Row 3: Full Width
           │         └─> UserDataFiles (uploaded files)
           │
           ├─> Dialog: File Upload
           │    └─> ImportFile Component
           │
           ├─> Dialog: Onboarding
           │    └─> OnboardingFormComponent
           │
           ├─> Dialog: Side Navigation
           │    └─> renderContent() switch cases
           │
           └─> Toaster (for notifications)
```

**File:** `mp_platform/src/app/dashboard/page.tsx`

```tsx
"use client";

import { DashboardPage } from "@/components/app-dashboard-page";
import { AuthProvider } from "@/components/AuthContext";
import Clarity from "@microsoft/clarity";

export default function Home() {
    const projectId = "q64g9fnhvi";
    Clarity.init(projectId);

    return (
        <main className="flex-1 overflow-y-auto">
            <AuthProvider>
                <DashboardPage />
            </AuthProvider>
        </main>
    );
}
```

---

## Data Fetching Patterns

### Standard Fetch Pattern with JWT

```typescript
// Pattern used in CentralHealthScore, CurrentStats, etc.

const [data, setData] = useState(null);
const [error, setError] = useState(null);
const [isLoading, setIsLoading] = useState(true);
const { toast } = useToast();

useEffect(() => {
    const fetchData = async () => {
        try {
            setIsLoading(true);

            const token = localStorage.getItem("token");
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_ROOT}/endpoint`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }

            const jsonData = await response.json();
            setData(jsonData);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError(error.message);

            toast({
                title: "Error",
                description: "Failed to fetch data",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    fetchData();
}, [toast]); // Dependencies
```

### Conditional Rendering Based on State

```typescript
if (isLoading) {
    return <div>Loading...</div>;
}

if (error) {
    return <div className="text-red-500">{error}</div>;
}

if (!data || data.length === 0) {
    return (
        <div className="text-center py-8">
            <p className="text-gray-500">No data available</p>
        </div>
    );
}

// Render actual content
return <div>{/* Component content */}</div>;
```

---

## Authentication Context

### AuthContext Implementation

**File:** `mp_platform/src/components/AuthContext.tsx`

```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    UserID: string;
    name: string;
    email: string;
    // ... other fields
}

interface AuthContextType {
    user: User | null;
    token: string | null | 'missing';
    loading: boolean;
    login: (token: string, userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null | 'missing'>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load from localStorage on mount
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        } else {
            setToken('missing');
        }

        setLoading(false);
    }, []);

    const login = (newToken: string, userData: User) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userEmail', userData.UserID);
        setToken(newToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userEmail');
        setToken('missing');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
```

### Usage in Components

```typescript
import { useAuth } from '@/components/AuthContext';

function MyComponent() {
    const { user, token, loading, logout } = useAuth();

    if (loading) {
        return <p>Loading user...</p>;
    }

    if (token === 'missing' || token === undefined) {
        return <p>Please login to continue</p>;
    }

    return (
        <div>
            <h1>Welcome, {user?.name}</h1>
            <button onClick={logout}>Logout</button>
        </div>
    );
}
```

---

## State Management

### Component-Level State

```typescript
// Simple state
const [showDialog, setShowDialog] = useState(false);
const [activeView, setActiveView] = useState("");

// Complex state with objects
const [healthData, setHealthData] = useState<BiomarkerData | null>(null);

// Arrays
const [items, setItems] = useState<JourneyItem[]>([]);
```

### Derived State

```typescript
// Calculate derived values
const isInRange = (value: number, min: number, max: number) => {
    return value >= min && value <= max;
};

// Conditional display
const showAll = false;
const displayItems = showAll ? data : data.slice(0, 3);
```

---

## Error Handling

### Try-Catch Pattern

```typescript
try {
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // Process data
} catch (error) {
    console.error("Error:", error);

    // User-friendly error message
    toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
    });
}
```

### Error Boundary (Future Enhancement)

```typescript
// Wrap components in Error Boundary for graceful degradation
<ErrorBoundary fallback={<ErrorFallback />}>
    <DashboardPage />
</ErrorBoundary>
```

---

## Toast Notifications

### useToast Hook

**File:** `mp_platform/src/hooks/use-toast.ts`

```typescript
import { useToast } from "@/hooks/use-toast";

function MyComponent() {
    const { toast } = useToast();

    const showSuccess = () => {
        toast({
            title: "Success",
            description: "Operation completed successfully",
            variant: "default"  // or omit for default
        });
    };

    const showError = () => {
        toast({
            title: "Error",
            description: "Operation failed",
            variant: "destructive"
        });
    };

    return (
        <div>
            <button onClick={showSuccess}>Success</button>
            <button onClick={showError}>Error</button>
        </div>
    );
}
```

### Toast Variants

```typescript
// Success (default green)
toast({
    title: "Saved!",
    description: "Your changes have been saved.",
});

// Error (red)
toast({
    title: "Error",
    description: "Failed to save changes",
    variant: "destructive",
});

// With custom duration
toast({
    title: "Info",
    description: "This will disappear in 2 seconds",
    duration: 2000,
});
```

### Toaster Component

**Add to layout:**

```tsx
import { Toaster } from "@/components/ui/toaster";

function Layout({ children }) {
    return (
        <div>
            {children}
            <Toaster />
        </div>
    );
}
```

---

## API Integration Examples

### Example 1: Fetch Health Scores

**File:** `mp_platform/src/components/central-health-score.tsx`

```typescript
useEffect(() => {
    const fetchHealthScore = async () => {
        try {
            setIsSubmitting(true);
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_ROOT}/user-scores`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (!response.ok) {
                throw new Error("Failed to fetch health score");
            }

            const data = await response.json();

            // Use centralHealthScore from API
            const healthScore = data.centralHealthScore ?? 66;

            // Determine status
            let status: "Need to improve" | "Good" | "Excellent" = "Good";
            if (healthScore >= 70) status = "Excellent";
            else if (healthScore >= 50) status = "Good";
            else status = "Need to improve";

            setJsonObj({
                ...data,
                score: healthScore,
                status: data.status || status,
            });
        } catch (error) {
            console.error("Error fetching health score:", error);
            toast({
                title: "Using sample data",
                description: "Using placeholder values",
                variant: "default",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    fetchHealthScore();
}, [toast]);
```

### Example 2: Fetch Recommendations

**File:** `mp_platform/src/components/ProductRecommendations.tsx`

```typescript
useEffect(() => {
    const fetchRecommendations = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_ROOT}/recommendation`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (!response.ok) {
                throw new Error("Failed to fetch recommendations");
            }

            const jsonObj = await response.json();

            // Transform grouped products to flat array
            const transformedData: ProductItem[] = [];
            if (jsonObj.grouped) {
                Object.keys(jsonObj.grouped).forEach((category) => {
                    jsonObj.grouped[category].forEach((product: any) => {
                        transformedData.push({
                            title: product.name,
                            description: product.description,
                            price: `$${product.price}`,
                            image: product.image_url,
                            buttonText: "Buy",
                        });
                    });
                });
            }

            setData(transformedData);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching recommendations:", error);
            toast({
                title: "Error",
                description: "Failed to fetch recommendations",
                variant: "destructive",
            });
        }
    };

    fetchRecommendations();
}, [toast]);
```

---

## Dialog Management

### Dialog State Pattern

```typescript
const [showDialog, setShowDialog] = useState(false);
const [selectedItem, setSelectedItem] = useState(null);

// Open dialog with data
const openDialog = (item) => {
    setSelectedItem(item);
    setShowDialog(true);
};

// Close dialog
const closeDialog = () => {
    setShowDialog(false);
    setSelectedItem(null);
};

return (
    <>
        <button onClick={() => openDialog(item)}>View Details</button>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Details</DialogTitle>
                </DialogHeader>
                {selectedItem && (
                    <div>{/* Render selected item */}</div>
                )}
            </DialogContent>
        </Dialog>
    </>
);
```

---

## Performance Optimization

### Memoization

```typescript
import { useMemo, useCallback } from "react";

// Memoize expensive calculations
const calculatedValue = useMemo(() => {
    return expensiveCalculation(data);
}, [data]);

// Memoize callback functions
const handleClick = useCallback(() => {
    console.log("Clicked");
}, []); // No dependencies = function never changes
```

### Lazy Loading

```typescript
import dynamic from 'next/dynamic';

// Lazy load heavy components
const HeavyChart = dynamic(() => import('./HeavyChart'), {
    loading: () => <p>Loading chart...</p>,
    ssr: false
});
```

---

## Environment Variables

### Configuration

**File:** `mp_platform/.env.local`

```env
NEXT_PUBLIC_API_ROOT=http://localhost:4000
```

### Usage

```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_ROOT;
const endpoint = `${apiUrl}/user-scores`;
```

**Note:** Only variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

---

## Related Documentation

- **[UI Components](./UI_COMPONENTS.md)** - Detailed component implementations
- **[Styling Guide](./STYLING_GUIDE.md)** - CSS and Tailwind patterns
- **[API Contracts](/docs/dashboards/API_CONTRACTS.md)** - API schemas
- **[Enum Mapping](/docs/dashboards/ENUM_MAPPING.md)** - Value mappings
