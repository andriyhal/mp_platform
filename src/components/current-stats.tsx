'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, EllipsisVertical, XCircle } from 'lucide-react'
import { HealthDataChart } from './health-data-chart'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"


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
  height: { min: 150, max: 200 , label:'Height', unit:'cm'},
  weight: { min: 45, max: 100 , label:'Weight', unit:'kg'},
  waistCircumference: { min: 20, max: 94 , label:'Waist Circumference', unit:'cm'},
  bloodPressureSystolic: { min: 90, max: 120 , label:'Systolic', unit:'mmHg'},
  bloodPressureDiastolic: { min: 60, max: 80 , label:'Diastolic', unit:'mmHg'},
  fastingBloodGlucose: { min: 0, max: 85 , label:'Fasting Blood Glucose', unit:'mg/dL'},
  hdlCholesterol: { min: 60, max: 100 , label:'HDL Cholesterol', unit:'mg/dL'},
  triglycerides: { min: 0, max: 80 , label:'Triglycerides', unit:'mg/dL'},
  vitaminD2: { min: 20, max: 50 , label:'Vitamin D2', unit:'ng/mL'},
  vitaminD3: { min: 20, max: 50 , label:'Vitamin D3', unit:'ng/mL'}
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
    inRange: false
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
          if (key === 'height') return null
          if (key === 'weight') return null
          
          const inRange = isInRange(value, key as keyof typeof healthyRanges)
          const range = healthyRanges[key as keyof typeof healthyRanges]
          
          return (
            <div key={key} className="flex items-center justify-between p-2 border rounded-lg">
              <div className="flex " >
                <h4 className="font-medium min-w-[150px] text-sm">{range.label}</h4>
                
                <span className={`text-center items-center rounded-md   px-2 py-1 text-xs font-medium  ring-1 w-[115px] ring-inset  ${inRange ? 'ring-green-600/20 text-green-700 rounded-md bg-green-50' : 'ring-red-600/20 text-red-700 rounded-md bg-red-50'}`}>{inRange ? 'Healthy range' : 'Unhealthy range'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">{value}</span><span className="text-xs">{range.unit}</span>
                {/* {inRange ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )} */}
              </div>
              <div className=" " >
                
                <p className={`text-xs pl-2 `}>
                  Recommended: 
                </p>
                <p className={`text-xs pl-2 `}>
                   {range.min} - {range.max}
                </p>
              </div>
              <div className="flex items-center gap-2" onClick={() => { setShowChartDialog(true); setSelectedParameter({name : key , value: value , max_range: range.max , min_range: range.min, inRange : inRange}) }}>
                <EllipsisVertical />
              </div>
            </div>
          )
        })}
      </div>

      <Dialog open={showChartDialog} onOpenChange={setShowChartDialog}>
          <DialogContent className="w-3/4 max-w-6xl" >
            <DialogHeader>
              <DialogTitle>Your Stats</DialogTitle>
            </DialogHeader>
            <HealthDataChart parameter={ selectedParameter }/>
          </DialogContent>
        </Dialog>
    </div>
  )
}

