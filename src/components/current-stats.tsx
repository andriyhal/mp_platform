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
  scores?: {
    [key: string]: {
      score: number
      category: string
      color: string
    }
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
        console.log('Health data with scores:', data)
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
    // Check if the API already provided scores and categories
    if (healthData && healthData.scores && healthData.scores[parameter]) {
      const scoreData = healthData.scores[parameter]
      return {
        inRange: scoreData.score >= 80, // Assuming 80+ is good
        category: scoreData.category,
        color: scoreData.color || getColorFromScore(scoreData.score)
      }
    }

    // Fallback to original range check if no score data from API
    const range = healthyRanges[parameter];
    return {
      inRange: value >= range.min && value <= range.max,
      category: value >= range.min && value <= range.max ? 'Normal' : 'Out of Range',
      color: value >= range.min && value <= range.max ? 'green' : 'red'
    };
  }

  const getColorFromScore = (score: number) => {
    if (score >= 90) return 'green'
    if (score >= 80) return 'yellow'
    if (score >= 60) return 'orange'
    return 'red'
  }

  const getColorClasses = (color: string) => {
    const colorMap = {
      green: 'ring-green-600/20 text-green-700 bg-green-50',
      yellow: 'ring-yellow-600/20 text-yellow-700 bg-yellow-50',
      orange: 'ring-orange-600/20 text-orange-700 bg-orange-50',
      red: 'ring-red-600/20 text-red-700 bg-red-50',
      purple: 'ring-purple-600/20 text-purple-700 bg-purple-50',
      blue: 'ring-blue-600/20 text-blue-700 bg-blue-50'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.red;
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

