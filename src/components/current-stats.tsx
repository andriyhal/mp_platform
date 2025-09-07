'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, EllipsisVertical, XCircle } from 'lucide-react'
import { HealthDataChart } from './health-data-chart'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { formatToUSDateTime } from "@/lib/dateUtils"


interface HealthData {
  height: number
  weight: number
  waistCircumference: number
  bloodPressureSystolic: number
  bloodPressureDiastolic: number
  fastingBloodGlucose: number
  hdlCholesterol: number
  triglycerides: number
  vitaminD2: number
  vitaminD3: number
  lastUpdate?: string
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
  bloodPressureSystolic: 4,
  bloodPressureDiastolic: 5,
  hdlCholesterol: 7,
  triglycerides: 8,
  fastingBloodGlucose: 6,
  waistCircumference: 3
}

const biomarkerCategories: { [key: number]: { [key: number]: string } } = {
  4: { // systolic BP
    100: 'Normal',
    90: 'Elevated',
    80: 'Hypertension Stage 1',
    70: 'Low BP',
    60: 'Hypertension Stage 2',
    40: 'Hypertensive Crisis'
  },
  5: { // diastolic BP
    100: 'Normal',
    90: 'Elevated',
    80: 'Hypertension Stage 1',
    70: 'Low BP',
    60: 'Hypertension Stage 2',
    40: 'Hypertensive Crisis'
  },
  7: { // HDL
    100: 'Optimal',
    90: 'Near Optimal',
    80: 'Borderline Low',
    60: 'Low (Increased Risk)',
    40: 'Very Low (High Risk)'
  },
  8: { // triglycerides
    100: 'Optimal',
    90: 'Near Optimal',
    80: 'Slightly Elevated',
    60: 'Moderately Elevated',
    40: 'High',
    20: 'Very High'
  },
  6: { // fasting glucose
    100: 'Optimal',
    90: 'Near Optimal',
    80: 'Borderline Elevated',
    60: 'Pre-Diabetes (Early Risk)',
    40: 'Pre-Diabetes (High Risk)',
    20: 'Diabetes (Very High Risk)'
  },
  3: { // waist height ratio
    100: 'Optimal',
    90: 'Healthy',
    80: 'Healthy',
    70: 'Moderate Risk',
    60: 'Moderate Risk',
    50: 'High Risk',
    40: 'High Risk',
    30: 'Very High Risk',
    20: 'Very High Risk',
    10: 'Very High Risk',
    0: 'Severe Risk'
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
  const [healthData, setHealthData] = useState<HealthData | null>(null)
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT}/get-health-data?userId=${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch health data')
        }

        const data = await response.json()
        console.log('Health data:', data)
        setHealthData(data)


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

  const isInRange = (value: number, parameter: keyof typeof healthyRanges) => {
    // Use the biomarker value as the score for categorization
    const score = value
    const biomarkerId = biomarkerIds[parameter]
    if (biomarkerId && biomarkerCategories[biomarkerId]) {
      const thresholds = Object.keys(biomarkerCategories[biomarkerId]).map(Number).sort((a, b) => a - b) // ascending
      let category = 'Unknown'
      let color = 'red'
      // Find the smallest threshold greater than the score
      for (const thresh of thresholds) {
        if (score < thresh) {
          category = biomarkerCategories[biomarkerId][thresh]
          if (thresh === 100) color = 'green'
          else if (thresh === 90) color = 'lightgreen'
          else if (thresh === 80) color = 'yellow'
          else if (thresh === 70) color = 'orange'
          else if (thresh === 60) color = 'red'
          else if (thresh === 40 || thresh === 20 || thresh === 10 || thresh === 0) color = 'darkred'
          break
        }
      }
      // If score is >= highest threshold, use the highest threshold's category
      if (score >= thresholds[thresholds.length - 1]) {
        const highestThresh = thresholds[thresholds.length - 1]
        category = biomarkerCategories[biomarkerId][highestThresh]
        color = highestThresh === 100 ? 'green' : 'lightgreen'
      }
      return {
        inRange: score >= 80,
        category,
        color
      }
    }

    // Fallback to original range check if no biomarker mapping
    const range = healthyRanges[parameter];
    return {
      inRange: value >= range.min && value <= range.max,
      category: value >= range.min && value <= range.max ? 'Normal' : 'Out of Range',
      color: value >= range.min && value <= range.max ? 'green' : 'red'
    };
  }

  const getColorClasses = (color: string) => {
    return colorClasses[color as keyof typeof colorClasses] || colorClasses.red;
  };

  return (
    <div className="space-y-4">
      <div className="divide-y divide-gray-200">
        {Object.entries(healthData).map(([key, value]) => {
          if (key === 'lastUpdate') return null
          if (key === 'height') return null
          if (key === 'weight') return null

          const { inRange, category, color } = isInRange(value, key as keyof typeof healthyRanges)
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
                <span className="font-bold text-gray-600">{value}</span>
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
                  value: value,
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

