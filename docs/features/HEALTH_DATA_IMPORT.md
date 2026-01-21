# Health Data Import Documentation

## Purpose

Frontend system for importing user health data through file uploads (PDF, images) and manual form entry with validation and API integration.

---

## System Architecture

### Import Methods

1. **File Upload** - PDF documents and images with OCR extraction
2. **Manual Form Entry** - Onboarding form with manual data input
3. **Health Data Form** - Direct health metrics submission
4. **Estimated Values** - AI-suggested values based on age/gender

### Data Flow Layers

1. **User Input Layer** - File selection, drag-and-drop, form fields
2. **Validation Layer** - Client-side validation before submission
3. **Upload Layer** - FormData construction and API transmission
4. **Response Layer** - Success/error handling and user feedback

---

## File Upload System

### File Selection Methods

**Drag and Drop Interface:**

- Visual dropzone with border-dashed styling
- File type validation on drop
- Real-time filename display
- Supported formats: PDF, DOC, DOCX

**Click to Upload:**

- Standard file input dialog
- File type filtering in browser
- Maximum file size: 10MB

### Upload Flow

**Step 1: File Selection**

1. User selects or drops file
2. Browser validates file type
3. Display filename confirmation
4. Enable upload button

**Step 2: Validation**

1. Check file exists
2. Verify file size < 10MB
3. Validate file format (PDF, DOC, DOCX)
4. Display error toast if invalid

**Step 3: FormData Construction**

```
FormData structure:
- file: Selected file blob
- UserID: User identifier from localStorage
```

**Step 4: API Submission**

- Endpoint: `POST /import-file`
- Headers: Authorization Bearer token
- Content-Type: multipart/form-data
- Body: FormData with file and UserID

**Step 5: Response Handling**

Success scenario:

- Receive extracted OCR data
- Display success dialog with results
- Trigger callback for next step (onboarding flow)
- Update UI state

Error scenario:

- Display error toast notification
- Keep file selected for retry
- Log error details to console

### Loading States

**During Upload:**

- Button text changes: "Upload Data" → "Submitting..."
- Button disabled state
- Visual progress indicator (optional)

**Post Upload:**

- Re-enable form controls
- Clear file input (optional)
- Reset button state

---

## Manual Form Entry

### Onboarding Form Flow

**Multi-Step Process:**

1. **Step 1: Profile Data**
    - Date of birth (required)
    - Gender selection (male, female, other)
    - Height slider (50-300 cm)
    - Weight slider (20-500 kg)
    - Waist circumference (20-200 cm)

2. **Step 2: Health Metrics**
    - Blood Pressure Systolic (70-250 mmHg)
    - Blood Pressure Diastolic (40-150 mmHg)
    - Fasting Blood Glucose (50-500 mg/dL)
    - HDL Cholesterol (20-100 mg/dL)
    - Triglycerides (50-1000 mg/dL)

3. **Step 3: Optional File Upload**
    - Use ImportFile component
    - Extract data from uploaded file
    - Merge with manual entries

4. **Step 4: Review and Submit**
    - Display all collected data
    - Final validation
    - Submit to API

### Form Validation Schema

**Field Constraints:**

| Field               | Min      | Max        | Required |
| ------------------- | -------- | ---------- | -------- |
| Date of Birth       | -        | -          | Yes      |
| Gender              | -        | -          | Yes      |
| Height              | 50 cm    | 300 cm     | Yes      |
| Weight              | 20 kg    | 500 kg     | Yes      |
| Waist Circumference | 20 cm    | 200 cm     | Yes      |
| BP Systolic         | 70 mmHg  | 250 mmHg   | Yes      |
| BP Diastolic        | 40 mmHg  | 150 mmHg   | Yes      |
| Fasting Glucose     | 50 mg/dL | 500 mg/dL  | Yes      |
| HDL Cholesterol     | 20 mg/dL | 100 mg/dL  | Yes      |
| Triglycerides       | 50 mg/dL | 1000 mg/dL | Yes      |

**Validation Triggers:**

- On field blur
- On form submission
- Real-time for critical fields

### Estimated Values Feature

**Purpose:** Provide AI-suggested health metrics based on user profile

**Trigger:** User completes profile fields (age, gender, height, weight, waist)

**Flow:**

1. Calculate age from date of birth
2. API call: `GET /average-health-metrics?age={age}&sex={gender}`
3. Receive estimated values for:
    - Blood Pressure Systolic
    - Blood Pressure Diastolic
    - Fasting Blood Glucose
    - HDL Cholesterol
    - Triglycerides

4. Highlight estimated fields (light blue/cyan color)
5. Display notification: "Based on your profile, we have estimated..."
6. User can accept or modify values

**Visual Indicators:**

- Estimated fields: Cyan background
- User-entered fields: White background
- Helps distinguish pre-filled vs manual data

---

## API Integration

### Endpoints Used

**1. File Upload**

- **Endpoint:** `POST /data-ingestion/upload` or `/import-file`
- **Method:** POST
- **Content-Type:** multipart/form-data
- **Headers:** Authorization: Bearer {token}
- **Body:** FormData with file and UserID
- **Response:** { ocrText: string, extractedData: object }

**2. Health Data Submission**

- **Endpoint:** `POST /health-data`
- **Method:** POST
- **Content-Type:** application/json
- **Headers:** Authorization: Bearer {token}
- **Body:** Complete health data object
- **Response:** { success: boolean, message: string }

**3. Estimated Metrics**

- **Endpoint:** `GET /average-health-metrics?age={age}&sex={gender}`
- **Method:** GET
- **Headers:** Authorization: Bearer {token}
- **Response:** { bloodPressureSystolic, bloodPressureDiastolic, fastingBloodGlucose, hdlCholesterol, triglycerides }

### Authentication

**Token Management:**

- JWT token stored in localStorage
- Key: 'token'
- Included in Authorization header: `Bearer {token}`
- Required for all API calls

**User Identification:**

- UserID from localStorage key: 'userEmail'
- Fallback to 'test' if not found
- Sent with all data submissions

---

## User Feedback System

### Toast Notifications

**Success Messages:**

- "File selected: {filename}"
- "File uploaded successfully"
- "Data imported"
- "Estimation Complete: Based on your profile..."
- "Health data submitted successfully"

**Error Messages:**

- "Please select a file to upload"
- "Failed to upload file"
- "Failed to fetch health data"
- "Error uploading file"
- "Failed to submit health data"

**Toast Variants:**

- `default` - Informational (blue)
- `destructive` - Errors (red)

### Dialog Windows

**File Upload Success Dialog:**

- Title: "Your Report data"
- Content: Extracted data preview or confirmation
- User can close to continue

**Onboarding Completion Dialog:**

- Displayed after all steps complete
- Shows summary of submitted data
- Option to view dashboard or edit data

---

## State Management

### Local Component State

**File Upload Component:**

- `isSubmitting` - Boolean for upload in progress
- `showDialog` - Boolean for result dialog visibility
- `results` - String for OCR/extracted data
- `fileInput` - Reference to file input element

**Onboarding Form:**

- `step` - Current step number (1-4)
- `fileUploaded` - Boolean if file was uploaded
- `isComplete` - Boolean if all steps finished
- `form` - React Hook Form instance with validation

### Form Default Values

**Onboarding Form Defaults:**

```
{
  UserID: localStorage 'userEmail' or 'test',
  dateOfBirth: '2000-01-01',
  gender: 'male',
  height: 170,
  weight: 70,
  waistCircumference: 80,
  bloodPressureSystolic: 120,
  bloodPressureDiastolic: 80,
  fastingBloodGlucose: 100,
  hdlCholesterol: 50,
  triglycerides: 150
}
```

### Field Styling State

**Color Coding Logic:**

- Default fields: White background
- Estimated fields: Cyan/light blue background
- Updated when estimation completes
- Helps user distinguish pre-filled vs manual

---

## Error Handling

### Client-Side Validation

**Pre-Submit Checks:**

1. All required fields filled
2. Values within allowed ranges
3. File size under limit
4. Valid file format
5. Token exists in localStorage

**Validation Errors:**

- Display field-level error messages
- Prevent form submission until fixed
- Highlight invalid fields in red
- Show error summary at top

### API Error Handling

**Network Errors:**

- Catch fetch exceptions
- Display user-friendly error toast
- Log detailed error to console
- Maintain form state for retry

**Server Errors:**

- Check response.ok status
- Parse error message from response
- Display specific error details
- Offer retry option

**Timeout Handling:**

- Large file uploads may timeout
- Display progress indicator
- Allow user to cancel
- Implement retry logic

---

## Integration with Backend

### Data Mapping

**Frontend → Backend:**

Frontend form fields map to backend database fields:

- `dateOfBirth` → users.DateOfBirth
- `gender` → users.Sex
- `height` → health_data.height
- `weight` → health_data.Weight
- `waistCircumference` → health_data.waistCircumference
- `bloodPressureSystolic` → health_data.BloodPressureSystolic
- `bloodPressureDiastolic` → health_data.BloodPressureDiastolic
- `fastingBloodGlucose` → health_data.FastingBloodGlucose
- `hdlCholesterol` → health_data.HDLCholesterol
- `triglycerides` → health_data.Triglycerides

### Backend Processing Flow

After frontend submits data:

1. **Backend receives file or form data**
2. **FILE_PARSING.md logic executes** (if file upload)
    - OCR extraction (Tesseract.js)
    - AI data extraction (OpenAI)
    - Biomarker value parsing
3. **Data stored in health_data table**
4. **SCORING_LOGIC.md executes**
    - Calculate biomarker scores
    - Calculate central health score
    - Store in user_scores table
5. **RECOMMENDATIONS.md logic executes**
    - Assign expertise types
    - Assign digital journey plans
    - Match products
6. **Frontend receives success response**
7. **Dashboard refreshes with new data**

### Synchronization Points

**Trigger Points:**

1. Form submission → `/health-data` endpoint
2. File upload → `/import-file` endpoint
3. Estimation request → `/average-health-metrics` endpoint

**Response Handling:**

- Wait for backend score calculation
- Refresh dashboard components
- Display success confirmation
- Navigate to next step

---

## User Experience Flow

### Complete Import Journey

**Scenario 1: New User Onboarding**

1. User clicks "Start Onboarding" button
2. Onboarding dialog opens
3. Step 1: Enter profile data (age, gender, height, weight, waist)
4. Click "Estimate Health Metrics" button
5. System fetches suggested values based on profile
6. Estimated fields highlighted in cyan
7. User reviews and adjusts values if needed
8. Optional: Upload health report file
9. System extracts data from file
10. Merge extracted data with manual entries
11. Review all data
12. Submit to API
13. Show success confirmation
14. Close dialog, navigate to dashboard
15. Dashboard displays calculated scores

**Scenario 2: Quick File Upload**

1. User clicks "Import PDF" button
2. File upload dialog opens
3. User drags PDF into dropzone or clicks to browse
4. File name displays
5. User clicks "Upload Data for data extraction"
6. Button shows "Submitting..."
7. Backend processes file (OCR + AI extraction)
8. Success dialog displays extracted data
9. User confirms or edits extracted values
10. Submit to save
11. Dashboard refreshes with new scores

**Scenario 3: Manual Health Data Update**

1. User navigates to "Submit Health Data" menu
2. Health data form displays current values
3. User updates one or more fields
4. Client-side validation on blur
5. Click "Submit" button
6. API saves updated values
7. Backend recalculates scores
8. Toast notification: "Health data updated"
9. Dashboard components refresh

---

## Performance Considerations

### File Upload Optimization

**Chunked Uploads:**

- For files > 5MB, consider chunking
- Reduce timeout risk
- Provide progress feedback

**Compression:**

- Compress images before upload
- Reduce network bandwidth
- Faster upload times

### Form Performance

**Debounced Validation:**

- Delay validation on keystroke
- Reduce re-render frequency
- Improve responsiveness

**Lazy Loading:**

- Load form steps on demand
- Reduce initial bundle size
- Faster page load

### API Call Optimization

**Request Batching:**

- Combine multiple updates into one call
- Reduce API round trips
- Improve perceived performance

**Caching:**

- Cache estimated metrics by age/gender
- Reduce repeated API calls
- Faster form pre-fill

---

## Security Considerations

### Client-Side Security

**Input Sanitization:**

- Validate all user input before sending
- Prevent injection attacks
- Escape special characters

**File Validation:**

- Check file type and size on client
- Prevent malicious file uploads
- Additional server-side validation required

**Token Protection:**

- Store JWT in localStorage (not cookies for XSS protection)
- Clear token on logout
- Validate token expiry

### Privacy

**Sensitive Data Handling:**

- Health data transmitted over HTTPS only
- No logging of health values to console in production
- Clear temporary data after submission

**User Consent:**

- Display privacy notice on onboarding
- Require explicit consent for data collection
- Allow data deletion

---

## Mobile Responsiveness

### Touch Interactions

**File Upload:**

- Large dropzone for easy tapping
- Native file picker on mobile
- Responsive drag-and-drop (desktop only)

**Form Fields:**

- Large input fields for touch
- Slider controls for numeric inputs
- Date picker optimized for mobile

### Layout Adaptation

**Small Screens:**

- Stack form fields vertically
- Full-width buttons
- Simplified navigation

**Medium Screens:**

- Two-column layout for efficiency
- Inline validation messages
- Collapsible sections

---

## Accessibility

### Keyboard Navigation

**Tab Order:**

- Logical tab sequence through form
- Skip to main content option
- Visible focus indicators

**Form Controls:**

- Label associations for all inputs
- ARIA labels for screen readers
- Error announcements

### Visual Accessibility

**Color Contrast:**

- High contrast for error messages
- Sufficient text size for readability
- Color not sole indicator (icons + text)

**Screen Readers:**

- Form field descriptions
- Error message announcements
- Progress indicators
