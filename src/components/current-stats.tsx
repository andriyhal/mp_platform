'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'

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
  height: { min: 150, max: 200 },
  weight: { min: 45, max: 100 },
  waistCircumference: { min: 20, max: 40 },
  bloodPressureSystolic: { min: 90, max: 120 },
  bloodPressureDiastolic: { min: 60, max: 80 },
  fastingBloodGlucose: { min: 70, max: 100 },
  hdlCholesterol: { min: 40, max: 60 },
  triglycerides: { min: 50, max: 150 },
  vitaminD2: { min: 20, max: 50 },
  vitaminD3: { min: 20, max: 50 }
}

export function CurrentStats() {
  const [healthData, setHealthData] = useState<HealthData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLatestHealthData = async () => {
      try {
        const userId = localStorage.getItem('userEmail') || 'test'
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT}/get-health-data?userId=${userId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch health data')
        }

        const data = await response.json()
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
    const range = healthyRanges[parameter]
    return value >= range.min && value <= range.max
  }

  return (
    <div className="space-y-4">
      {healthData.lastUpdate && (
        <p className="text-sm text-muted-foreground mb-4">
          Last updated: {healthData.lastUpdate}
        </p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        {Object.entries(healthData).map(([key, value]) => {
          if (key === 'lastUpdate') return null
          
          const inRange = isInRange(value, key as keyof typeof healthyRanges)
          const range = healthyRanges[key as keyof typeof healthyRanges]
          
          return (
            <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                <p className="text-sm text-muted-foreground">
                  Healthy range: {range.min} - {range.max}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">{value}</span>
                {inRange ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}