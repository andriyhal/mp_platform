# Dashboard Visualization Documentation

## Purpose

Frontend visualization system that displays health scores, biomarker data, product recommendations, digital journey plans, and provider networks in an interactive dashboard interface.

---

## System Architecture

### Dashboard Layout Structure

**Grid-Based Layout:**

1. **Header Row** - Navigation and actions
2. **Central Section** - Health score and biomarker stats (2 columns)
3. **Recommendations Section** - Journey cards and products (2 columns: 5/7 split)
4. **Documents Section** - Uploaded files list (full width)

### Component Hierarchy

**Dashboard Container:**

- Sidebar navigation
- Content area with multiple cards
- Modal dialogs (import, onboarding, navigation)
- Toast notification system

**Main Content Cards:**

1. Central Health Score (left column)
2. Current Stats/Biomarkers (right column)
3. Health Journey Cards (left, 5 cols)
4. Product Recommendations (right top, 7 cols)
5. Health Expert Consultation (right bottom, 7 cols)
6. User Data Files (full width)

---

## Data Fetching Flow

### Initial Page Load

**Sequential Fetch Pattern:**

1. **Authentication Check**
    - Verify JWT token in localStorage
    - Extract user identity
    - Redirect to login if invalid

2. **Central Health Score Fetch**
    - Endpoint: `GET /user-scores`
    - Returns: centralHealthScore (0-100), biomarkers array, status
    - Updates: CentralHealthScore component state

3. **Biomarker Details Fetch**
    - Same endpoint: `GET /user-scores`
    - Returns: Array of biomarkers with scores and values
    - Updates: CurrentStats component state

4. **Product Recommendations Fetch**
    - Endpoint: `GET /recommendation`
    - Returns: grouped products by type, isAuthenticated, general_health_score
    - Updates: ProductRecommendations component state

5. **Digital Journey Fetch**
    - Endpoint: `GET /digital-journey`
    - Returns: plan info, items array with scheduled_date
    - Updates: HealthJourneyCards component state

6. **Provider Network Fetch**
    - Endpoint: `GET /provider-network`
    - Returns: providers array with expertise types
    - Updates: HealthExpertConsultation component state

### Data Refresh Triggers

**Automatic Refresh:**

- After health data submission
- After file upload completion
- After onboarding form submission
- On component mount (useEffect)

**Manual Refresh:**

- User clicks refresh button
- User navigates back to dashboard
- Tab focus returns to page

---

## Central Health Score Visualization

### Score Display Logic

**Data Structure:**

```
{
  centralHealthScore: 84.5,
  status: "Excellent" | "Good" | "Need to improve",
  description: "Your result is much better...",
  lastUpdate: ISO timestamp
}
```

**Status Determination:**

| Score Range | Status          | Color                  |
| ----------- | --------------- | ---------------------- |
| ≥ 70        | Excellent       | Green (bg-green-500)   |
| 50-69       | Good            | Orange (bg-orange-500) |
| < 50        | Need to improve | Red (bg-red-500)       |

### Gauge Visualization

**SegmentedGauge Component:**

- Circular progress indicator
- Score value displayed in center
- Color changes based on status
- Animated transition on score update

**Visual Elements:**

- Large score number (e.g., "84")
- Status badge with color coding
- Last update timestamp
- Descriptive text below

### Fallback Handling

**No Data Scenario:**

- Display placeholder value: 66
- Show default status: "Good"
- Generic description message
- Toast notification: "Using sample data"

---

## Biomarker Statistics Display

### Biomarker Cards Layout

**Grid Structure:**

- 2-3 columns on desktop
- 1 column on mobile
- Scrollable if many biomarkers
- Consistent card height

### Individual Biomarker Card

**Data Displayed:**

- Biomarker name (e.g., "Waist-Height Ratio")
- Current value with unit (e.g., "0.52")
- Calculated score (0-100)
- Category label (e.g., "Normal", "Elevated")
- Color-coded status indicator
- Last measurement date

**Category Color Mapping:**

| Score Range | Category     | Color       |
| ----------- | ------------ | ----------- |
| 100         | Optimal      | Green       |
| 90-89       | Near Optimal | Light Green |
| 80-79       | Borderline   | Yellow      |
| 70-59       | Elevated     | Orange      |
| 59-39       | High Risk    | Red         |
| < 39        | Critical     | Dark Red    |

### Display Order

**Prioritized Biomarkers:**

1. Waist-Height Ratio (WHR)
2. Fasting Blood Glucose (FBG)
3. Blood Pressure Systolic (BPS)
4. Blood Pressure Diastolic (BPD)
5. HDL Cholesterol
6. Triglycerides

### Interactive Features

**Click to Expand:**

- Modal dialog with detailed chart
- Historical data visualization
- Trend indicators (up/down arrows)
- Reference ranges displayed

**Visual Indicators:**

- Check icon for optimal values
- X icon for critical values
- Ellipsis menu for more options

---

## Product Recommendations Display

### Data Grouping Logic

**Product Types:**

- `digital` - Digital health programs
- `supplement` - Nutritional supplements
- `food` - Food products
- `device` - Health devices

**Grouping Structure:**

```
{
  grouped: {
    digital: [array of products],
    supplement: [array of products],
    food: [array of products],
    device: [array of products]
  },
  isAuthenticated: boolean,
  general_health_score: number
}
```

### Product Card Layout

**Card Elements:**

- Product image (with fallback)
- Product name/title
- Short description
- Price display
- "Buy" or "View Details" button
- Product type badge (optional)

**Visual Design:**

- Image aspect ratio: Square or 16:9
- Consistent card height
- Hover effects for interactivity
- Responsive grid (1-3 columns)

### Empty State

**No Recommendations:**

- Center-aligned message
- Icon illustration
- Text: "Your recommendations will be here once your health score will be calculated"
- Call-to-action: "Submit Health Data"

### View All Toggle

**Functionality:**

- Initially show 3 products per category
- "View All" link expands to show all
- "Show Less" link collapses back
- Maintains scroll position

---

## Digital Journey Visualization

### Timeline Display

**Journey Item Card:**

- Icon based on item type (exercise, article, meditation)
- Item title/name
- Item description
- "Go" button to access content
- Scheduled date indicator
- Completion status (if tracked)

**Icon Mapping:**

- `exercise` → TargetIcon (purple)
- `article` → PlayIcon (blue)
- `meditation` → LeafIcon (green)
- `video` → PlayIcon (blue)
- `assessment` → ClipboardIcon (orange)

### Journey Progress

**Visual Elements:**

- Progress bar showing days completed
- Current day highlighted
- Future items grayed out
- Past items with checkmarks

**Empty State:**

- Message: "No digital journey plan assigned"
- Suggestion: "Complete your health assessment to get personalized plan"
- Icon illustration

---

## Provider Network Display

### Provider Cards

**Card Structure:**

- Provider profile image
- Provider name (e.g., "Dr. Emily Johnson")
- Specialization/expertise type
- Availability status
- Consultation price
- "Consultation" button

**Expertise Type Display:**

- Displayed as badge or subtitle
- Examples: "Cardiologist", "Nutritionist", "Endocrinologist"
- Color-coded by category (optional)

### Consultation Booking Flow

**Steps:**

1. User clicks "Consultation" button
2. Dialog opens with provider details
3. Consent checkbox displayed
4. User agrees to terms
5. Redirect to booking URL or external system
6. Confirmation message displayed

**Empty State:**

- Message: "No recommended providers for your health profile"
- Call-to-action: "Update your health data to get personalized recommendations"

---

## User Data Files Display

### File List Table

**Columns:**

- File name
- Upload date
- File type (PDF, DOC, etc.)
- File size
- Actions (View, Download, Delete)

**Visual Design:**

- Table with alternating row colors
- Icons for file types
- Hover effects on rows
- Responsive collapse to cards on mobile

**Empty State:**

- Icon: FileUp
- Message: "No documents uploaded yet"
- Call-to-action: "Upload your first health document"

---

## Chart Visualizations

### HealthDataChart Component

**Chart Types:**

- Line charts for trends over time
- Bar charts for biomarker comparisons
- Doughnut charts for score breakdowns

**Chart.js Integration:**

**Data Structure:**

```
{
  labels: [dates or biomarker names],
  datasets: [{
    label: "Health Score",
    data: [values],
    borderColor: "color",
    backgroundColor: "color"
  }]
}
```

**Interactive Features:**

- Tooltips on hover
- Zoom and pan capabilities
- Responsive sizing
- Legend toggle

### Color Schemes

**Primary Colors:**

- Score line: Blue (#3B82F6)
- Optimal range: Green (#10B981)
- Warning range: Yellow (#F59E0B)
- Critical range: Red (#EF4444)

**Background Colors:**

- Grid lines: Light gray (rgba(0,0,0,0.1))
- Tooltip background: White with shadow
- Chart background: Transparent

---

## Loading States

### Component-Level Loading

**CentralHealthScore:**

- Skeleton gauge animation
- Placeholder text
- Loading spinner overlay

**CurrentStats:**

- Card skeleton with pulsing animation
- Placeholder biomarker names
- Loading shimmer effect

**ProductRecommendations:**

- Text: "Loading..."
- Spinner icon
- Card skeletons (optional)

**HealthJourneyCards:**

- Similar to products
- Loading text displayed

**HealthExpertConsultation:**

- Provider card skeletons
- Loading spinner

### Global Loading

**Initial Page Load:**

- Full-page loading overlay
- App logo with spinner
- Progress text (optional)

**Data Refresh:**

- Subtle loading indicator at top
- No full-page overlay
- Individual component refresh

---

## Error Handling

### Component-Level Errors

**Fetch Errors:**

- Display error toast notification
- Show fallback/placeholder data
- Retry button option
- Log error to console

**Render Errors:**

- Error boundary fallback UI
- Message: "Something went wrong"
- Reload page button
- Report issue option

### User Feedback

**Toast Notifications:**

- Success: Green with checkmark
- Error: Red with X icon
- Info: Blue with info icon
- Duration: 3-5 seconds

**Error Messages:**

- "Failed to fetch health score"
- "Failed to fetch recommendations"
- "Failed to fetch digital journey"
- "Failed to fetch provider network"

---

## State Management

### Local Component State

**Each Component Maintains:**

- `isLoading` - Boolean for loading state
- `data` - Fetched data object/array
- `error` - Error message or object
- `showAll` - Boolean for expand/collapse (recommendations)

### Shared State (AuthContext)

**Global User State:**

- `user` - User profile object
- `token` - JWT authentication token
- `loading` - Global auth loading state
- `logout` - Logout function

**Usage:**

```
const { user, token, loading, logout } = useAuth();
```

### localStorage Usage

**Stored Data:**

- `token` - JWT token string
- `userEmail` - User identifier
- Accessed on component mount
- Cleared on logout

---

## Responsive Design Patterns

### Breakpoints

**Mobile (< 768px):**

- Single column layout
- Stack all cards vertically
- Full-width components
- Simplified navigation (hamburger menu)

**Tablet (768px - 1024px):**

- Two-column layout for main sections
- Side-by-side central score and stats
- Stacked recommendations
- Collapsible sidebar

**Desktop (> 1024px):**

- Full grid layout as designed
- 5/7 column split for recommendations
- Expanded sidebar always visible
- Multi-column product grids

### Touch Interactions

**Mobile Optimizations:**

- Larger touch targets (min 44x44px)
- Swipe gestures for navigation
- Pull-to-refresh on dashboard
- Bottom navigation for key actions

---

## Performance Optimization

### Data Fetching

**Parallel Requests:**

- Fetch all dashboard data simultaneously
- Use Promise.all for multiple endpoints
- Reduce total loading time

**Caching Strategy:**

- Cache API responses for 5 minutes
- Invalidate on data updates
- Reduce redundant API calls

### Rendering Optimization

**React Optimization:**

- Memoize expensive components
- Use React.memo for static cards
- Debounce scroll handlers
- Lazy load charts and modals

**Image Optimization:**

- Use Next.js Image component
- Lazy load images below fold
- Responsive image sizes
- WebP format with fallback

---

## Accessibility Features

### Keyboard Navigation

**Tab Order:**

- Logical flow through dashboard
- Skip to main content link
- Visible focus indicators
- Escape key closes modals

**Shortcuts:**

- Alt+H for health score
- Alt+R for recommendations
- Alt+P for provider network

### Screen Reader Support

**ARIA Labels:**

- Descriptive labels for all interactive elements
- Status announcements for dynamic content
- Role attributes for custom components

**Semantic HTML:**

- Proper heading hierarchy (h1 → h6)
- List markup for biomarkers
- Table markup for files
- Button vs link distinction

---

## Integration with Backend

### API Endpoint Coordination

**Dashboard Dependencies:**

1. **Score Calculation Backend** (SCORING_LOGIC.md)
    - Frontend fetches: `/user-scores`
    - Backend calculates: biomarker scores, central score
    - Frontend displays: CentralHealthScore, CurrentStats

2. **Recommendations Backend** (RECOMMENDATIONS.md)
    - Frontend fetches: `/recommendation`
    - Backend filters: products by biomarker scores
    - Frontend displays: ProductRecommendations grouped by type

3. **Digital Journey Backend**
    - Frontend fetches: `/digital-journey`
    - Backend assigns: plans based on low scores
    - Frontend displays: HealthJourneyCards timeline

4. **Provider Network Backend**
    - Frontend fetches: `/provider-network`
    - Backend matches: expertise types to user
    - Frontend displays: HealthExpertConsultation cards

### Data Synchronization

**Real-Time Updates:**

- After health data import, all sections refresh
- Score changes trigger recommendation updates
- Journey plan assignments appear immediately
- Provider recommendations update automatically

**Optimistic Updates:**

- Show loading state immediately
- Update UI before API response
- Rollback on error
- Provide feedback quickly

---

## Dialog System

### Modal Types

**1. File Upload Dialog**

- ImportFile component
- Drag-and-drop interface
- Upload progress
- Success/error feedback

**2. Onboarding Dialog**

- Multi-step form
- Progress indicator
- Navigation between steps
- Data validation

**3. Side Navigation Dialog**

- Menu item navigation
- Content switching
- Profile, notifications, settings
- Full-height sidebar

**4. Biomarker Detail Dialog**

- Chart visualization
- Historical data
- Reference ranges
- Close button

### Dialog Behavior

**Open/Close Logic:**

- State-controlled visibility
- Backdrop click to close
- Escape key to close
- Prevent scroll on body

**Accessibility:**

- Focus trap within dialog
- Return focus on close
- ARIA role="dialog"
- Descriptive titles

---

## Navigation System

### Sidebar Menu

**Menu Structure:**

1. **Primary Actions**
    - Dashboard
    - My Health Journey
    - Provider Network
    - Marketplace
    - My Orders

2. **User Settings**
    - View Profile
    - Notifications
    - Password and Security
    - My Documents
    - Submit Health Data

**Active State:**

- Highlight current page
- Underline or background color
- Icon color change
- Bold text

### Mobile Navigation

**Hamburger Menu:**

- Collapse sidebar on mobile
- Overlay navigation drawer
- Swipe to open/close
- Bottom navigation bar alternative

---

## Color System Integration

### Biomarker Category Colors

**Score-Based Coloring:**

| Score | Category     | Color       | Hex     |
| ----- | ------------ | ----------- | ------- |
| 100   | Optimal      | Green       | #10B981 |
| 90-89 | Near Optimal | Light Green | #34D399 |
| 80-79 | Borderline   | Yellow      | #FBBF24 |
| 70-59 | Elevated     | Orange      | #F59E0B |
| 59-39 | High Risk    | Red         | #EF4444 |
| < 39  | Critical     | Dark Red    | #DC2626 |

**Status Badge Colors:**

- Excellent: bg-green-500, text-white
- Good: bg-orange-500, text-white
- Need to improve: bg-red-500, text-white

### Consistent Theme

**Primary Colors:**

- Primary: Blue (#3B82F6)
- Secondary: Gray (#6B7280)
- Accent: Purple (#8B5CF6)

**Background Colors:**

- Page background: White (#FFFFFF)
- Card background: White with shadow
- Hover states: Gray-50 (#F9FAFB)

---

## User Experience Patterns

### Dashboard Loading Sequence

**Optimal UX Flow:**

1. Show skeleton UI immediately
2. Load central health score first (most important)
3. Load biomarker stats second
4. Load recommendations third
5. Load provider network last
6. Stagger animations for polish

### Empty States Strategy

**Guiding Users:**

- Clear explanation of missing data
- Call-to-action button to resolve
- Helpful icon or illustration
- Positive, encouraging tone

**Examples:**

- No scores → "Submit health data to see your score"
- No recommendations → "Complete assessment to get recommendations"
- No journey → "Your personalized plan will appear here"

### Progressive Disclosure

**Information Hierarchy:**

- Show most important data first (central score)
- Collapse detailed information initially
- Expand on user interaction
- Reduce cognitive load

---

## Future Enhancements

### Real-Time Updates

**WebSocket Integration:**

- Live score updates during calculation
- Real-time recommendation changes
- Instant provider availability updates
- Collaborative features

### Advanced Visualizations

**Enhanced Charts:**

- Interactive comparison charts
- Predictive trend lines
- Goal setting and tracking
- Animated transitions

### Personalization

**User Preferences:**

- Customizable dashboard layout
- Preferred metrics display
- Theme customization
- Notification settings
