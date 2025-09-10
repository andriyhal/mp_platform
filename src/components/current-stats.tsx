'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, EllipsisVertical, XCircle } from 'lucide-react'
import { HealthDataChart } from './health-data-chart'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { formatToUSDateTime } from "@/lib/dateUtils"


interface HealthData {
  centralHealthScore: number
  biomarkers: Array<{
    id: number
    score: number
    measure_value: string | number
    lastMeasureDate: string
  }>
}

interface BiomarkerData {
  [key: string]: {
    value: number
    score: number
    lastUpdate: string
  }
}

const healthyRanges = {
  height: { min: 150, max: 200, label: 'Height', unit: 'cm' },
  weight: { min: 45, max: 100, label: 'Weight', unit: 'kg' },
  waistCircumference: { min: 0, max: 0.4, label: 'Waist Height Ratio', unit: '' },
  bloodPressureSystolic: { min: 90, max: 120, label: 'Blood Pressure Systolic', unit: 'mmHg' },
  bloodPressureDiastolic: { min: 60, max: 80, label: 'Blood Pressure Diastolic', unit: 'mmHg' },
  fastingBloodGlucose: { min: 0, max: 85, label: 'Fasting Blood Glucose', unit: 'mg/dL' },
  hdlCholesterol: { min: 60, max: 100, label: 'HDL Cholesterol', unit: 'mg/dL' },
  triglycerides: { min: 0, max: 80, label: 'Triglycerides', unit: 'mg/dL' },
  vitaminD2: { min: 20, max: 50, label: 'Vitamin D2', unit: 'ng/mL' },
  vitaminD3: { min: 20, max: 50, label: 'Vitamin D3', unit: 'ng/mL' }
}

const biomarkerIds: { [key: string]: number } = {
  waistCircumference: 3,
  bloodPressureSystolic: 4,
  bloodPressureDiastolic: 5,
  fastingBloodGlucose: 6,
  hdlCholesterol: 7,
  triglycerides: 8
}

// Create reverse mapping from ID to parameter name
const biomarkerIdToParam: { [key: number]: string } = {}
Object.entries(biomarkerIds).forEach(([param, id]) => {
  biomarkerIdToParam[id] = param
})

// Define the display order for biomarkers
const biomarkerDisplayOrder = [
  'waistCircumference',   // WHR
  'fastingBloodGlucose',  // FBC
  'bloodPressureSystolic', // BPS
  'bloodPressureDiastolic', // BPD
  'hdlCholesterol',       // HDL
  'triglycerides'         // Triglycerides
]

const biomarkerCategories: { [key: number]: { [key: number]: string } } = {
  4: { // systolic BP
    100: 'Normal',
    89: 'Elevated',
    79: 'Hypertension Stage 1',
    69: 'Low BP',
    59: 'Hypertension Stage 2',
    39: 'Hypertensive Crisis'
  },
  5: { // diastolic BP
    100: 'Normal',
    89: 'Elevated',
    79: 'Hypertension Stage 1',
    69: 'Low BP',
    59: 'Hypertension Stage 2',
    39: 'Hypertensive Crisis'
  },
  7: { // HDL
    100: 'Optimal',
    89: 'Near Optimal',
    79: 'Borderline Low',
    59: 'Low (Increased Risk)',
    39: 'Very Low (High Risk)'
  },
  8: { // triglycerides
    100: 'Optimal',
    89: 'Near Optimal',
    79: 'Slightly Elevated',
    59: 'Moderately Elevated',
    39: 'High',
    19: 'Very High'
  },
  6: { // fasting glucose
    100: 'Optimal',
    89: 'Near Optimal',
    79: 'Borderline Elevated',
    59: 'Pre-Diabetes (Early Risk)',
    39: 'Pre-Diabetes (High Risk)',
    19: 'Diabetes (Very High Risk)'
  },
  3: { // waist height ratio
    100: 'Optimal',
    89: 'Healthy',
    79: 'Moderate Risk',
    59: 'High Risk',
    39: 'Very High Risk',
    9: 'Severe Risk'
  }
}

const colorClasses: { [key: string]: string } = {
  green: 'ring-green-600/20 text-green-700 bg-green-50',
  lightgreen: 'ring-green-400/20 text-green-600 bg-green-100',
  yellow: 'ring-yellow-600/20 text-yellow-700 bg-yellow-50',
  orange: 'ring-orange-600/20 text-orange-700 bg-orange-50',
  red: 'ring-red-600/20 text-red-700 bg-red-50',
  darkred: 'ring-red-800/20 text-red-800 bg-red-100',
  purple: 'ring-purple-600/20 text-purple-700 bg-purple-50',
  blue: 'ring-blue-600/20 text-blue-700 bg-blue-50'
}


export function CurrentStats() {
  const [healthData, setHealthData] = useState<BiomarkerData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [showChartDialog, setShowChartDialog] = useState(false)
  const [selectedParameter, setSelectedParameter] = useState({
    name: '',
    value: 0,
    max_range: 0,
    min_range: 0,
    inRange: false,
    category: '',
    color: ''
  })


  useEffect(() => {
    const fetchLatestHealthData = async () => {
      try {
        const userId = localStorage.getItem('userEmail') || 'test'
        const token = localStorage.getItem('token')
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT}/user-scores`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch health data')
        }

        const data = await response.json()
        console.log('User scores data:', data)

        // Transform the API response to match component expectations
        const transformedData: BiomarkerData = {}

        data.biomarkers.forEach((biomarker: any) => {
          const paramName = biomarkerIdToParam[biomarker.id]
          if (paramName) {
            transformedData[paramName] = {
              value: typeof biomarker.measure_value === 'string' ? parseFloat(biomarker.measure_value) : biomarker.measure_value,
              score: biomarker.score,
              lastUpdate: biomarker.lastMeasureDate
            }
          }
        })

        setHealthData(transformedData)


      } catch (error) {
        console.error('Error fetching health data:', error)
        setError('Failed to fetch latest health data')
      }
    }

    fetchLatestHealthData()
  }, [])

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  if (!healthData) {
    return <div>Loading...</div>
  }

  const isInRange = (biomarkerData: { value: number; score: number; lastUpdate: string }, parameter: keyof typeof healthyRanges) => {
    // Use the score from the API for categorization
    const score = biomarkerData.score
    const biomarkerId = biomarkerIds[parameter]
    if (biomarkerId && biomarkerCategories[biomarkerId]) {
      const thresholds = Object.keys(biomarkerCategories[biomarkerId]).map(Number).sort((a, b) => a - b) // ascending
      let category = 'Unknown'
      let color = 'red'
      let targetThreshold = thresholds[0] // default to lowest

      // Find the appropriate threshold by rounding up
      for (let i = thresholds.length - 1; i >= 0; i--) {
        if (score >= thresholds[i]) {
          targetThreshold = thresholds[i]
          break
        }
      }

      // If score is not exactly on a threshold, round up to the next one
      const currentIndex = thresholds.indexOf(targetThreshold)
      if (currentIndex < thresholds.length - 1 && score > targetThreshold) {
        targetThreshold = thresholds[currentIndex + 1]
      }

      category = biomarkerCategories[biomarkerId][targetThreshold]
      if (targetThreshold === 100) color = 'green'
      else if (targetThreshold === 89) color = 'lightgreen'
      else if (targetThreshold === 79) color = 'yellow'
      else if (targetThreshold === 69) color = 'orange'
      else if (targetThreshold === 59) color = 'red'
      else if (targetThreshold === 39 || targetThreshold === 19 || targetThreshold === 9) color = 'darkred'

      return {
        inRange: score >= 79,
        category,
        color
      }
    }

    // Fallback to original range check if no biomarker mapping
    const range = healthyRanges[parameter];
    return {
      inRange: biomarkerData.value >= range.min && biomarkerData.value <= range.max,
      category: biomarkerData.value >= range.min && biomarkerData.value <= range.max ? 'Normal' : 'Out of Range',
      color: biomarkerData.value >= range.min && biomarkerData.value <= range.max ? 'green' : 'red'
    };
  }

  const getColorClasses = (color: string) => {
    return colorClasses[color as keyof typeof colorClasses] || colorClasses.red;
  };

  return (
    <div className="space-y-4">
      <div className="divide-y divide-gray-200">
        {biomarkerDisplayOrder
          .filter(key => healthData[key]) // Only show biomarkers that exist in the data
          .map(key => {
            const biomarkerData = healthData[key]
            const { inRange, category, color } = isInRange(biomarkerData, key as keyof typeof healthyRanges)
            const range = healthyRanges[key as keyof typeof healthyRanges]

            return (
              <div key={key} className="grid grid-cols-12 gap-4 p-[10px] hover:bg-gray-50 transition-colors items-center">
                <div className="col-span-4 flex flex-col gap-1">
                  <h4 className="font-medium text-sm text-gray-600">{range.label}</h4>
                </div>

                <div className="col-span-3 flex items-center gap-2">
                  <span className={`w-full text-center items-center rounded-md px-1 py-0.5 text-xs font-medium ring-1 w-fit ring-inset ${getColorClasses(color)}`}>
                    {category}
                  </span>
                </div>

                <div className="col-span-2 flex items-center gap-2">
                  <span className="font-bold text-gray-600">{biomarkerData.value}</span>
                  <span className="text-xs text-gray-500">{range.unit}</span>
                </div>

                <div className="col-span-2">
                  <p className="text-xs pl-2 text-gray-500">Recommended:</p>
                  <p className="text-xs pl-2 text-gray-500">{range.min} - {range.max}</p>
                </div>

                <div className="col-span-1 flex items-center gap-2 justify-end" onClick={() => {
                  setShowChartDialog(true);
                  setSelectedParameter({
                    name: key,
                    value: biomarkerData.value,
                    max_range: range.max,
                    min_range: range.min,
                    inRange: inRange,
                    category: category,
                    color: color
                  })
                }}>
                  <EllipsisVertical />
                </div>
              </div>
            )
          })}
      </div>

      <Dialog open={showChartDialog} onOpenChange={setShowChartDialog}>
        <DialogContent className="w-3/4 max-w-6xl">
          <DialogHeader>
            <DialogTitle>Your Stats</DialogTitle>
          </DialogHeader>
          <HealthDataChart parameter={selectedParameter} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

