# UI Components Reference

Detailed documentation for all dashboard UI components.

**Related Documentation:**

- [Frontend Implementation](./FRONTEND_IMPLEMENTATION.md) - React patterns and hooks
- [Styling Guide](./STYLING_GUIDE.md) - CSS and styling patterns
- [API Contracts](/docs/dashboards/API_CONTRACTS.md) - API endpoints
- [Enum Mapping](/docs/dashboards/ENUM_MAPPING.md) - Color mappings

---

## Table of Contents

1. [CentralHealthScore](#centralhealthscore)
2. [CurrentStats](#currentstats)
3. [HealthJourneyCards](#healthjourneycards)
4. [ProductRecommendations](#productrecommendations)
5. [HealthExpertConsultation](#healthexpertconsultation)
6. [Supporting Components](#supporting-components)

---

## CentralHealthScore

**Purpose:** Display the user's overall health score with a visual gauge

**File:** `mp_platform/src/components/central-health-score.tsx`

### Component Structure

```tsx
interface HealthScoreProps {
    // No props - fetches own data
}

interface JsonObjType {
    score: number;
    status: string;
    trend?: string;
}
```

### Data Fetching

```typescript
useEffect(() => {
    const fetchHealthScore = async () => {
        try {
            setIsSubmitting(true);
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_ROOT}/user-scores`,
                { headers: { Authorization: `Bearer ${token}` } },
            );

            const data = await response.json();

            // Extract centralHealthScore (0-100)
            const healthScore = data.centralHealthScore ?? 66;

            // Determine status based on score
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
            console.error("Error:", error);
            // Fallback to sample data
        } finally {
            setIsSubmitting(false);
        }
    };

    fetchHealthScore();
}, [toast]);
```

### Status Logic

```typescript
const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
        case "need to improve":
            return "text-red-600";
        case "good":
            return "text-yellow-600";
        case "excellent":
            return "text-green-600";
        default:
            return "text-gray-600";
    }
};

const getGaugeColor = (score: number): string => {
    if (score >= 70) return "#22c55e"; // green
    if (score >= 50) return "#eab308"; // yellow
    return "#ef4444"; // red
};
```

### Visual Structure

```tsx
<Card className="w-full">
    <CardHeader>
        <CardTitle>Your Health Score</CardTitle>
    </CardHeader>
    <CardContent>
        <div className="flex flex-col items-center">
            {/* SegmentedGauge Component */}
            <SegmentedGauge
                value={jsonObj.score}
                color={getGaugeColor(jsonObj.score)}
                size={280}
                strokeWidth={28}
                segments={6}
            />

            {/* Status Badge */}
            <div className={`mt-4 ${getStatusColor(jsonObj.status)}`}>
                <span className="font-semibold">{jsonObj.status}</span>
            </div>

            {/* Optional Trend */}
            {jsonObj.trend && (
                <p className="text-sm text-gray-500 mt-2">
                    Trend: {jsonObj.trend}
                </p>
            )}
        </div>
    </CardContent>
</Card>
```

### Dependencies

- **SegmentedGauge:** Custom circular progress component
- **API Endpoint:** `GET /user-scores`
- **Data Shape:** See [API_CONTRACTS.md](/docs/dashboards/API_CONTRACTS.md#get-user-scores)

---

## CurrentStats

**Purpose:** Display individual biomarker scores with color-coded categories

**File:** `mp_platform/src/components/current-stats.tsx`

### Component Structure

```tsx
interface BiomarkerData {
    biomarker_name: string;
    value: number | null;
    unit: string;
    date: string | null;
    score: number;
}

interface CurrentStatsProps {
    // No props - fetches own data
}
```

### Data Fetching

```typescript
useEffect(() => {
    const fetchHealthData = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_ROOT}/user-scores`,
                { headers: { Authorization: `Bearer ${token}` } },
            );

            const jsonObj = await response.json();

            // Extract biomarkers array
            if (jsonObj.biomarkers && Array.isArray(jsonObj.biomarkers)) {
                setHealthData(jsonObj.biomarkers);
            }
        } catch (error) {
            console.error("Error fetching health data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    fetchHealthData();
}, []);
```

### Category Mapping

**See:** [ENUM_MAPPING.md](/docs/dashboards/ENUM_MAPPING.md) for complete mappings

```typescript
const biomarkerCategories: Record<string, Record<number, string>> = {
    "Waist-to-Height Ratio (WHR)": {
        1: "Normal",
        2: "Increased Risk",
        3: "High Risk",
    },
    "Blood Pressure (Systolic)": {
        1: "Normal",
        2: "Elevated",
        3: "High Blood Pressure (Stage 1)",
        4: "High Blood Pressure (Stage 2)",
        5: "Hypertensive Crisis",
    },
    "HDL Cholesterol": {
        1: "Low (Poor)",
        2: "Normal",
    },
    Triglycerides: {
        1: "Normal",
        2: "Borderline High",
        3: "High",
        4: "Very High",
    },
    "Fasting Blood Glucose": {
        1: "Normal",
        2: "Prediabetes",
        3: "Diabetes",
    },
    "Body Mass Index (BMI)": {
        1: "Underweight",
        2: "Normal Weight",
        3: "Overweight",
        4: "Obese",
    },
};
```

### Category Color Logic

```typescript
const getCategoryColor = (biomarkerName: string, score: number): string => {
    const categoryMap = biomarkerCategories[biomarkerName];
    if (!categoryMap) return "gray";

    const category = categoryMap[score];
    if (!category) return "gray";

    // Color mapping logic
    if (category.includes("Normal") || category === "Normal Weight") {
        return "green";
    }
    if (
        category.includes("High") ||
        category.includes("Crisis") ||
        category === "Diabetes" ||
        category === "Obese"
    ) {
        return "red";
    }
    if (
        category.includes("Elevated") ||
        category.includes("Borderline") ||
        category === "Prediabetes" ||
        category === "Overweight"
    ) {
        return "yellow";
    }
    if (category === "Low (Poor)" || category === "Underweight") {
        return "orange";
    }

    return "gray";
};
```

### Visual Structure

```tsx
<Card className="w-full">
    <CardHeader>
        <CardTitle>Current Stats</CardTitle>
    </CardHeader>
    <CardContent>
        {isLoading ? (
            <p>Loading health data...</p>
        ) : healthData.length === 0 ? (
            <p className="text-gray-500">No health data available</p>
        ) : (
            <ul className="space-y-4">
                {healthData.map((item, index) => {
                    const category =
                        biomarkerCategories[item.biomarker_name]?.[item.score];
                    const colorClass = getCategoryColor(
                        item.biomarker_name,
                        item.score,
                    );

                    return (
                        <li
                            key={index}
                            className="flex items-center justify-between"
                        >
                            <div>
                                <p className="font-semibold">
                                    {item.biomarker_name}
                                </p>
                                {item.value && (
                                    <p className="text-sm text-gray-600">
                                        {item.value} {item.unit}
                                    </p>
                                )}
                            </div>

                            <Badge
                                className={`bg-${colorClass}-100 text-${colorClass}-800`}
                            >
                                {category || "Unknown"}
                            </Badge>
                        </li>
                    );
                })}
            </ul>
        )}
    </CardContent>
</Card>
```

### Biomarker Display Order

Default order from API response:

1. Waist-to-Height Ratio (WHR)
2. Blood Pressure (Systolic)
3. HDL Cholesterol
4. Triglycerides
5. Fasting Blood Glucose
6. Body Mass Index (BMI)

---

## HealthJourneyCards

**Purpose:** Display user's personalized health journey plan items

**File:** `mp_platform/src/components/HealthJourneyCards.tsx`

### Component Structure

```tsx
interface JourneyItem {
    plan_item_id: number;
    title: string;
    description: string;
    image_url?: string;
    link_url?: string;
    scheduled_date?: string;
    is_mandatory?: number;
}

interface HealthJourneyCardsProps {
    // No props - fetches own data
}
```

### Data Fetching

```typescript
useEffect(() => {
    const fetchJourneyData = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_ROOT}/digital-journey`,
                { headers: { Authorization: `Bearer ${token}` } },
            );

            if (!response.ok) {
                throw new Error("Failed to fetch journey data");
            }

            const jsonData = await response.json();
            setData(jsonData.planItems || []);
        } catch (error) {
            console.error("Error fetching journey data:", error);
            toast({
                title: "Error",
                description: "Failed to fetch health journey",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    fetchJourneyData();
}, [toast]);
```

### Visual Structure

```tsx
<Card className="w-full">
    <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Your Health Journey</CardTitle>
        <Button variant="ghost" size="sm" onClick={toggleShowAll}>
            {showAll ? "Show Less" : "View All"}
        </Button>
    </CardHeader>
    <CardContent>
        {isLoading ? (
            <p>Loading journey...</p>
        ) : data.length === 0 ? (
            <p className="text-gray-500">No journey items yet</p>
        ) : (
            <div className="space-y-4">
                {displayItems.map((item) => (
                    <Card key={item.plan_item_id}>
                        <CardContent className="p-4">
                            {/* Image (if available) */}
                            {item.image_url && (
                                <img
                                    src={item.image_url}
                                    alt={item.title}
                                    className="w-full h-32 object-cover rounded-md mb-3"
                                />
                            )}

                            {/* Title with mandatory badge */}
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold">{item.title}</h3>
                                {item.is_mandatory === 1 && (
                                    <Badge
                                        variant="destructive"
                                        className="text-xs"
                                    >
                                        Required
                                    </Badge>
                                )}
                            </div>

                            {/* Description */}
                            <p className="text-sm text-gray-600 mb-3">
                                {item.description}
                            </p>

                            {/* Scheduled date */}
                            {item.scheduled_date && (
                                <p className="text-xs text-gray-500 mb-3">
                                    Scheduled: {formatDate(item.scheduled_date)}
                                </p>
                            )}

                            {/* Action button */}
                            {item.link_url && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        window.open(item.link_url, "_blank")
                                    }
                                >
                                    Learn More
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        )}
    </CardContent>
</Card>
```

### Show More/Less Logic

```typescript
const [showAll, setShowAll] = useState(false);

const toggleShowAll = () => {
    setShowAll(!showAll);
};

const displayItems = showAll ? data : data.slice(0, 3);
```

---

## ProductRecommendations

**Purpose:** Display AI-recommended health products based on biomarker scores

**File:** `mp_platform/src/components/ProductRecommendations.tsx`

### Component Structure

```tsx
interface ProductItem {
    title: string;
    description: string;
    price: string;
    image: string;
    buttonText: string;
}

interface ProductRecommendationsProps {
    // No props - fetches own data
}
```

### Data Fetching

```typescript
useEffect(() => {
    const fetchRecommendations = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_ROOT}/recommendation`,
                { headers: { Authorization: `Bearer ${token}` } },
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
        } catch (error) {
            console.error("Error fetching recommendations:", error);
            toast({
                title: "Error",
                description: "Failed to fetch recommendations",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    fetchRecommendations();
}, [toast]);
```

### Visual Structure

```tsx
<Card className="w-full">
    <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Product Recommendations</CardTitle>
        <Button variant="ghost" size="sm" onClick={toggleShowAll}>
            {showAll ? "Show Less" : "View All"}
        </Button>
    </CardHeader>
    <CardContent>
        {isLoading ? (
            <p>Loading recommendations...</p>
        ) : data.length === 0 ? (
            <div className="text-center py-8">
                <Package className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                <p className="text-gray-500">No recommendations available</p>
            </div>
        ) : (
            <div className="space-y-4">
                {displayItems.map((item, index) => (
                    <Card key={index}>
                        <CardContent className="p-4 flex gap-4">
                            {/* Product Image */}
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-20 h-20 object-cover rounded"
                            />

                            {/* Product Details */}
                            <div className="flex-1">
                                <h3 className="font-semibold mb-1">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-gray-600 mb-2">
                                    {item.description}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-green-600">
                                        {item.price}
                                    </span>
                                    <Button size="sm" variant="default">
                                        {item.buttonText}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )}
    </CardContent>
</Card>
```

---

## HealthExpertConsultation

**Purpose:** Display recommended healthcare providers based on user's health needs

**File:** `mp_platform/src/components/HealthExpertConsultation.tsx`

### Component Structure

```tsx
interface ExpertItem {
    provider_id: number;
    name: string;
    description: string;
    expertise_types: string; // Comma-separated
    specialty?: string;
    price?: string;
    image_url?: string;
    contact_info?: string;
}

interface HealthExpertConsultationProps {
    // No props - fetches own data
}
```

### Data Fetching

```typescript
useEffect(() => {
    const fetchExperts = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_ROOT}/provider-network`,
                { headers: { Authorization: `Bearer ${token}` } },
            );

            if (!response.ok) {
                throw new Error("Failed to fetch providers");
            }

            const jsonData = await response.json();
            setData(jsonData.providers || []);
        } catch (error) {
            console.error("Error fetching experts:", error);
            toast({
                title: "Error",
                description: "Failed to fetch healthcare providers",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    fetchExperts();
}, [toast]);
```

### Visual Structure

```tsx
<Card className="w-full">
    <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Health Expert Consultation</CardTitle>
        <Button variant="ghost" size="sm" onClick={toggleShowAll}>
            {showAll ? "Show Less" : "View All"}
        </Button>
    </CardHeader>
    <CardContent>
        {isLoading ? (
            <p>Loading providers...</p>
        ) : data.length === 0 ? (
            <div className="text-center py-8">
                <Stethoscope className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                <p className="text-gray-500">No providers available</p>
            </div>
        ) : (
            <div className="space-y-4">
                {displayItems.map((expert) => (
                    <Card key={expert.provider_id}>
                        <CardContent className="p-4">
                            {/* Provider Image */}
                            {expert.image_url && (
                                <img
                                    src={expert.image_url}
                                    alt={expert.name}
                                    className="w-full h-32 object-cover rounded-md mb-3"
                                />
                            )}

                            {/* Provider Name */}
                            <h3 className="font-semibold mb-1">
                                {expert.name}
                            </h3>

                            {/* Specialty */}
                            {expert.specialty && (
                                <p className="text-sm text-blue-600 mb-2">
                                    {expert.specialty}
                                </p>
                            )}

                            {/* Description */}
                            <p className="text-sm text-gray-600 mb-3">
                                {expert.description}
                            </p>

                            {/* Expertise Types (Badges) */}
                            {expert.expertise_types && (
                                <div className="flex flex-wrap gap-1 mb-3">
                                    {expert.expertise_types
                                        .split(",")
                                        .map((type, i) => (
                                            <Badge
                                                key={i}
                                                variant="secondary"
                                                className="text-xs"
                                            >
                                                {type.trim()}
                                            </Badge>
                                        ))}
                                </div>
                            )}

                            {/* Price */}
                            {expert.price && (
                                <p className="text-sm font-semibold text-green-600 mb-3">
                                    ${expert.price}
                                </p>
                            )}

                            {/* Contact Button */}
                            <Button
                                variant="default"
                                size="sm"
                                className="w-full"
                            >
                                Book Consultation
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )}
    </CardContent>
</Card>
```

---

## Supporting Components

### SegmentedGauge

**Purpose:** Circular progress indicator with segments

**File:** `mp_platform/src/components/segmented-gauge.tsx`

```tsx
interface SegmentedGaugeProps {
    value: number; // 0-100
    color?: string; // Hex color
    size?: number; // Pixel size
    strokeWidth?: number;
    segments?: number; // Number of segments
}

export function SegmentedGauge({
    value = 66,
    color = "#22c55e",
    size = 280,
    strokeWidth = 28,
    segments = 6,
}: SegmentedGaugeProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = (value / 100) * circumference;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size}>
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth={strokeWidth}
                />

                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${progress} ${circumference}`}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
            </svg>

            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-5xl font-bold">{value}</p>
                    <p className="text-sm text-gray-500">Score</p>
                </div>
            </div>
        </div>
    );
}
```

### ImportFile

**Purpose:** File upload dialog for PDF health data

**File:** `mp_platform/src/components/import-file.tsx`

```tsx
interface ImportFileProps {
    onFileSelect: (file: File) => void;
}

export function ImportFile({ onFileSelect }: ImportFileProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Validate file type
            if (file.type !== "application/pdf") {
                toast({
                    title: "Invalid file type",
                    description: "Please select a PDF file",
                    variant: "destructive",
                });
                return;
            }

            setSelectedFile(file);
            onFileSelect(file);
        }
    };

    return (
        <div>
            <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
            />
            <label htmlFor="file-upload">
                <Button variant="outline" asChild>
                    <span>Choose File</span>
                </Button>
            </label>

            {selectedFile && (
                <p className="mt-2 text-sm text-gray-600">
                    Selected: {selectedFile.name}
                </p>
            )}
        </div>
    );
}
```

### OnboardingForm

**Purpose:** Initial user data collection form

**File:** `mp_platform/src/components/onboarding-form.tsx`

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const onboardingSchema = z.object({
    height: z.number().min(50).max(250),
    weight: z.number().min(20).max(300),
    age: z.number().min(18).max(120),
    sex: z.enum(["male", "female"]),
    waist: z.number().optional(),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

export function OnboardingForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<OnboardingFormData>({
        resolver: zodResolver(onboardingSchema),
    });

    const onSubmit = async (data: OnboardingFormData) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_ROOT}/user-profile`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(data),
                },
            );

            if (!response.ok) {
                throw new Error("Failed to update profile");
            }

            toast({
                title: "Success",
                description: "Profile updated successfully",
            });
        } catch (error) {
            console.error("Error:", error);
            toast({
                title: "Error",
                description: "Failed to update profile",
                variant: "destructive",
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label>Height (cm)</label>
                <input {...register("height", { valueAsNumber: true })} />
                {errors.height && (
                    <p className="text-red-500">{errors.height.message}</p>
                )}
            </div>

            <div>
                <label>Weight (kg)</label>
                <input {...register("weight", { valueAsNumber: true })} />
                {errors.weight && (
                    <p className="text-red-500">{errors.weight.message}</p>
                )}
            </div>

            <div>
                <label>Age</label>
                <input {...register("age", { valueAsNumber: true })} />
                {errors.age && (
                    <p className="text-red-500">{errors.age.message}</p>
                )}
            </div>

            <div>
                <label>Sex</label>
                <select {...register("sex")}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
                {errors.sex && (
                    <p className="text-red-500">{errors.sex.message}</p>
                )}
            </div>

            <Button type="submit">Save Profile</Button>
        </form>
    );
}
```

---

## Related Documentation

- **[Frontend Implementation](./FRONTEND_IMPLEMENTATION.md)** - React patterns and data fetching
- **[Styling Guide](./STYLING_GUIDE.md)** - CSS and Tailwind patterns
- **[API Contracts](/docs/dashboards/API_CONTRACTS.md)** - Complete API schemas
- **[Enum Mapping](/docs/dashboards/ENUM_MAPPING.md)** - Color and category mappings
