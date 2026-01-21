# Styling Guide

CSS, Tailwind CSS, and design patterns for MP Platform dashboard.

**Related Documentation:**

- [UI Components](./UI_COMPONENTS.md) - Component implementations
- [Frontend Implementation](./FRONTEND_IMPLEMENTATION.md) - React patterns
- [Enum Mapping](/docs/ENUM_MAPPING.md) - Color mappings

---

## Table of Contents

1. [Tailwind CSS Configuration](#tailwind-css-configuration)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Layout Patterns](#layout-patterns)
5. [Responsive Design](#responsive-design)
6. [Component Styling](#component-styling)
7. [Chart.js Styling](#chartjs-styling)

---

## Tailwind CSS Configuration

### Configuration File

**File:** `mp_platform/tailwind.config.ts`

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};

export default config;
```

### Global Styles

**File:** `mp_platform/src/app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
    :root {
        --background: 0 0% 100%;
        --foreground: 222.2 84% 4.9%;
        --card: 0 0% 100%;
        --card-foreground: 222.2 84% 4.9%;
        --popover: 0 0% 100%;
        --popover-foreground: 222.2 84% 4.9%;
        --primary: 222.2 47.4% 11.2%;
        --primary-foreground: 210 40% 98%;
        --secondary: 210 40% 96.1%;
        --secondary-foreground: 222.2 47.4% 11.2%;
        --muted: 210 40% 96.1%;
        --muted-foreground: 215.4 16.3% 46.9%;
        --accent: 210 40% 96.1%;
        --accent-foreground: 222.2 47.4% 11.2%;
        --destructive: 0 84.2% 60.2%;
        --destructive-foreground: 210 40% 98%;
        --border: 214.3 31.8% 91.4%;
        --input: 214.3 31.8% 91.4%;
        --ring: 222.2 84% 4.9%;
        --radius: 0.5rem;
    }

    .dark {
        --background: 222.2 84% 4.9%;
        --foreground: 210 40% 98%;
        --card: 222.2 84% 4.9%;
        --card-foreground: 210 40% 98%;
        --popover: 222.2 84% 4.9%;
        --popover-foreground: 210 40% 98%;
        --primary: 210 40% 98%;
        --primary-foreground: 222.2 47.4% 11.2%;
        --secondary: 217.2 32.6% 17.5%;
        --secondary-foreground: 210 40% 98%;
        --muted: 217.2 32.6% 17.5%;
        --muted-foreground: 215 20.2% 65.1%;
        --accent: 217.2 32.6% 17.5%;
        --accent-foreground: 210 40% 98%;
        --destructive: 0 62.8% 30.6%;
        --destructive-foreground: 210 40% 98%;
        --border: 217.2 32.6% 17.5%;
        --input: 217.2 32.6% 17.5%;
        --ring: 212.7 26.8% 83.9%;
    }
}

@layer base {
    * {
        @apply border-border;
    }
    body {
        @apply bg-background text-foreground;
    }
}
```

---

## Color System

### Health Score Colors

**Used in:** CentralHealthScore, CurrentStats

```typescript
// Score-based colors (0-100 scale)
const getScoreColor = (score: number): string => {
    if (score >= 70) return "#22c55e"; // green-500
    if (score >= 50) return "#eab308"; // yellow-500
    return "#ef4444"; // red-500
};

// Text color classes
const getTextColor = (status: string): string => {
    switch (status.toLowerCase()) {
        case "excellent":
            return "text-green-600";
        case "good":
            return "text-yellow-600";
        case "need to improve":
            return "text-red-600";
        default:
            return "text-gray-600";
    }
};
```

### Category Colors

**See:** [ENUM_MAPPING.md](/docs/ENUM_MAPPING.md) for complete mappings

```typescript
// Category-based colors
const categoryColorMap: Record<string, string> = {
    Normal: "green",
    "Normal Weight": "green",
    Good: "green",

    Elevated: "yellow",
    "Borderline High": "yellow",
    "Increased Risk": "yellow",
    Prediabetes: "yellow",
    Overweight: "yellow",

    High: "red",
    "High Blood Pressure (Stage 1)": "red",
    "High Blood Pressure (Stage 2)": "red",
    "Hypertensive Crisis": "red",
    "Very High": "red",
    "High Risk": "red",
    Diabetes: "red",
    Obese: "red",

    "Low (Poor)": "orange",
    Underweight: "orange",
};

// Apply to Tailwind classes
const colorClasses: Record<string, string> = {
    green: "bg-green-100 text-green-800 border-green-200",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
    red: "bg-red-100 text-red-800 border-red-200",
    orange: "bg-orange-100 text-orange-800 border-orange-200",
    gray: "bg-gray-100 text-gray-800 border-gray-200",
};
```

### Utility Function

**File:** `mp_platform/src/lib/utils.ts`

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Usage: Merge Tailwind classes safely
<div className={cn(
    "base-class",
    isActive && "active-class",
    "another-class"
)}>
```

---

## Typography

### Font Configuration

**File:** `mp_platform/src/app/layout.tsx`

```tsx
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html>
    );
}
```

### Typography Scale

```tsx
// Heading sizes
<h1 className="text-4xl font-bold">Main Title</h1>
<h2 className="text-3xl font-semibold">Section Title</h2>
<h3 className="text-2xl font-semibold">Card Title</h3>
<h4 className="text-xl font-medium">Subsection</h4>

// Body text
<p className="text-base">Normal body text</p>
<p className="text-sm">Small text</p>
<p className="text-xs">Extra small text</p>

// Special text
<span className="font-bold">Bold emphasis</span>
<span className="font-semibold">Semi-bold</span>
<span className="text-gray-600">Muted text</span>
<span className="text-gray-500">Secondary text</span>
```

---

## Layout Patterns

### Dashboard Grid Layout

**File:** `mp_platform/src/components/app-dashboard-page.tsx`

```tsx
<div className="flex-1 overflow-y-auto p-8">
    {/* Header Section */}
    <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Health Score</CardTitle>
            <div className="flex gap-2">
                <Button onClick={handleImport}>Import PDF</Button>
                <Button onClick={handleExport}>Export PDF</Button>
            </div>
        </CardHeader>
    </Card>

    {/* Two-column layout */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <CentralHealthScore />
        <CurrentStats />
    </div>

    {/* Asymmetric two-column layout */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        <div className="lg:col-span-5">
            <HealthJourneyCards />
        </div>
        <div className="lg:col-span-7 space-y-6">
            <ProductRecommendations />
            <HealthExpertConsultation />
        </div>
    </div>

    {/* Full-width section */}
    <UserDataFiles />
</div>
```

### Card Pattern

```tsx
<Card className="w-full">
    <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Optional description</CardDescription>
    </CardHeader>
    <CardContent>{/* Card content */}</CardContent>
    <CardFooter>{/* Optional footer */}</CardFooter>
</Card>
```

### Sidebar Layout

```tsx
<SidebarProvider>
    <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1">
            <header className="sticky top-0 z-10 bg-background border-b">
                <div className="flex items-center gap-4 p-4">
                    <SidebarTrigger />
                    <h1>Dashboard</h1>
                </div>
            </header>
            <div className="p-8">{/* Page content */}</div>
        </main>
    </div>
</SidebarProvider>
```

---

## Responsive Design

### Breakpoints

```typescript
// Tailwind default breakpoints
sm: '640px'   // Small devices
md: '768px'   // Medium devices (tablets)
lg: '1024px'  // Large devices (desktops)
xl: '1280px'  // Extra large devices
2xl: '1536px' // 2X large devices
```

### Responsive Grid

```tsx
{
    /* Stack on mobile, 2 columns on tablet, 3 on desktop */
}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <Card>Item 1</Card>
    <Card>Item 2</Card>
    <Card>Item 3</Card>
</div>;

{
    /* Full width on mobile, sidebar on desktop */
}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
    <div className="lg:col-span-8">Main content</div>
    <div className="lg:col-span-4">Sidebar</div>
</div>;
```

### Responsive Typography

```tsx
{
    /* Scale text size with viewport */
}
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
    Responsive Heading
</h1>;

{
    /* Hide on mobile, show on desktop */
}
<div className="hidden lg:block">Desktop only content</div>;

{
    /* Show on mobile, hide on desktop */
}
<div className="block lg:hidden">Mobile only content</div>;
```

### Responsive Padding/Margin

```tsx
{
    /* Small padding on mobile, larger on desktop */
}
<div className="p-4 md:p-6 lg:p-8">Content with responsive padding</div>;

{
    /* Responsive gaps */
}
<div className="space-y-2 md:space-y-4 lg:space-y-6">
    <div>Item 1</div>
    <div>Item 2</div>
</div>;
```

---

## Component Styling

### Button Variants

```tsx
import { Button } from "@/components/ui/button";

// Default (primary)
<Button>Click Me</Button>

// Secondary
<Button variant="secondary">Secondary</Button>

// Destructive (danger)
<Button variant="destructive">Delete</Button>

// Outline
<Button variant="outline">Outline</Button>

// Ghost (minimal)
<Button variant="ghost">Ghost</Button>

// Link style
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">
    <IconComponent />
</Button>
```

### Badge Variants

```tsx
import { Badge } from "@/components/ui/badge";

// Default
<Badge>Default</Badge>

// Secondary
<Badge variant="secondary">Secondary</Badge>

// Destructive
<Badge variant="destructive">Error</Badge>

// Outline
<Badge variant="outline">Outline</Badge>

// Custom colors
<Badge className="bg-green-100 text-green-800">Normal</Badge>
<Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
<Badge className="bg-red-100 text-red-800">High Risk</Badge>
```

### Card States

```tsx
// Loading state
<Card className="animate-pulse">
    <CardContent className="h-32 bg-gray-200 rounded" />
</Card>

// Error state
<Card className="border-red-300 bg-red-50">
    <CardContent>
        <p className="text-red-600">Error loading data</p>
    </CardContent>
</Card>

// Empty state
<Card>
    <CardContent className="text-center py-12">
        <IconComponent className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-gray-500">No data available</p>
    </CardContent>
</Card>

// Hover effect
<Card className="hover:shadow-lg transition-shadow cursor-pointer">
    <CardContent>Interactive card</CardContent>
</Card>
```

### Input Styling

```tsx
import { Input } from "@/components/ui/input";

// Basic input
<Input type="text" placeholder="Enter text" />

// With label
<div className="space-y-2">
    <label className="text-sm font-medium">Email</label>
    <Input type="email" placeholder="email@example.com" />
</div>

// Error state
<div className="space-y-2">
    <Input type="text" className="border-red-500" />
    <p className="text-sm text-red-500">Error message</p>
</div>

// Disabled
<Input type="text" disabled placeholder="Disabled" />
```

---

## Chart.js Styling

### Chart Configuration

**File:** `mp_platform/src/components/health-data-chart.tsx`

```typescript
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top' as const,
            labels: {
                font: {
                    family: 'Inter, sans-serif',
                    size: 12
                },
                color: '#6b7280' // gray-500
            }
        },
        title: {
            display: true,
            text: 'Health Trends',
            font: {
                family: 'Inter, sans-serif',
                size: 16,
                weight: 'bold'
            },
            color: '#111827' // gray-900
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleFont: {
                family: 'Inter, sans-serif',
                size: 14
            },
            bodyFont: {
                family: 'Inter, sans-serif',
                size: 12
            },
            padding: 12,
            cornerRadius: 8
        }
    },
    scales: {
        y: {
            beginAtZero: true,
            ticks: {
                font: {
                    family: 'Inter, sans-serif',
                    size: 11
                },
                color: '#9ca3af' // gray-400
            },
            grid: {
                color: '#f3f4f6' // gray-100
            }
        },
        x: {
            ticks: {
                font: {
                    family: 'Inter, sans-serif',
                    size: 11
                },
                color: '#9ca3af' // gray-400
            },
            grid: {
                color: '#f3f4f6' // gray-100
            }
        }
    }
};

const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
        {
            label: 'Health Score',
            data: [65, 70, 68, 72, 75, 78],
            borderColor: '#3b82f6', // blue-500
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: '#3b82f6',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2
        }
    ]
};

export function HealthDataChart() {
    return (
        <div className="h-[300px]">
            <Line options={chartOptions} data={chartData} />
        </div>
    );
}
```

### Multiple Datasets

```typescript
const multiDatasetChart = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
        {
            label: "Blood Pressure",
            data: [120, 118, 115, 117],
            borderColor: "#ef4444", // red-500
            backgroundColor: "rgba(239, 68, 68, 0.1)",
        },
        {
            label: "Heart Rate",
            data: [75, 72, 70, 73],
            borderColor: "#10b981", // green-500
            backgroundColor: "rgba(16, 185, 129, 0.1)",
        },
        {
            label: "Weight",
            data: [80, 79.5, 79, 78.5],
            borderColor: "#3b82f6", // blue-500
            backgroundColor: "rgba(59, 130, 246, 0.1)",
        },
    ],
};
```

---

## Animation & Transitions

### Tailwind Animations

```tsx
// Fade in
<div className="animate-in fade-in duration-500">
    Content
</div>

// Slide up
<div className="animate-in slide-in-from-bottom duration-300">
    Content
</div>

// Spin (loading)
<div className="animate-spin">
    <LoaderIcon />
</div>

// Pulse (loading)
<div className="animate-pulse bg-gray-200 h-8 w-32 rounded" />
```

### Hover Transitions

```tsx
// Smooth transitions
<button className="transition-all duration-200 hover:scale-105 hover:shadow-lg">
    Hover me
</button>

// Color transition
<div className="transition-colors duration-300 hover:bg-blue-500 hover:text-white">
    Hover for color change
</div>

// Opacity transition
<div className="transition-opacity duration-200 opacity-50 hover:opacity-100">
    Fade on hover
</div>
```

---

## Icons

### Lucide React

```tsx
import {
    FileText,
    Upload,
    Download,
    Settings,
    User,
    Heart,
    Activity,
    TrendingUp,
    Package,
    Stethoscope
} from 'lucide-react';

// Usage
<Button>
    <Upload className="mr-2 h-4 w-4" />
    Upload File
</Button>

// Icon sizes
<Heart className="h-4 w-4" />   // Small
<Heart className="h-6 w-6" />   // Medium
<Heart className="h-8 w-8" />   // Large
<Heart className="h-12 w-12" /> // Extra large

// Icon colors
<Heart className="text-red-500" />
<Activity className="text-green-500" />
<TrendingUp className="text-blue-500" />
```

---

## Best Practices

### 1. Consistent Spacing

```tsx
// Use consistent gap/space utilities
<div className="space-y-4"> {/* Consistent vertical spacing */}
    <Card />
    <Card />
</div>

<div className="flex gap-2"> {/* Consistent horizontal gap */}
    <Button />
    <Button />
</div>
```

### 2. Semantic Class Names

```tsx
// Good: Descriptive class combinations
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">

// Avoid: Cryptic abbreviations
<div className="flx itc jcb p4 bgw rndlg shd">
```

### 3. Component Composition

```tsx
// Extract reusable patterns
const StatCard = ({ title, value, icon, color }) => (
    <Card>
        <CardContent className="flex items-center gap-4 p-6">
            <div className={`p-3 rounded-full bg-${color}-100`}>{icon}</div>
            <div>
                <p className="text-sm text-gray-600">{title}</p>
                <p className="text-2xl font-bold">{value}</p>
            </div>
        </CardContent>
    </Card>
);
```

### 4. Accessibility

```tsx
// Always include aria-labels for icons
<Button aria-label="Upload file">
    <Upload className="h-4 w-4" />
</Button>

// Proper focus states
<button className="focus:outline-none focus:ring-2 focus:ring-blue-500">
    Focus me
</button>

// Sufficient color contrast
<p className="text-gray-900"> {/* Good contrast */}
    Important text
</p>
```

---

## Related Documentation

- **[UI Components](./UI_COMPONENTS.md)** - Component implementations
- **[Frontend Implementation](./FRONTEND_IMPLEMENTATION.md)** - React patterns
- **[Enum Mapping](/docs/ENUM_MAPPING.md)** - Color and category mappings
