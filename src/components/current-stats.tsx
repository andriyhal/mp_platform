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
  height: { min: 150, max: 200, label: 'Height', unit: 'cm' },
  weight: { min: 45, max: 100, label: 'Weight', unit: 'kg' },
  waistCircumference: { min: 20, max: 94, label: 'Waist Circumference', unit: 'cm' },
  bloodPressureSystolic: { min: 90, max: 120, label: 'Systolic', unit: 'mmHg' },
  bloodPressureDiastolic: { min: 60, max: 80, label: 'Diastolic', unit: 'mmHg' },
  fastingBloodGlucose: { min: 0, max: 85, label: 'Fasting Blood Glucose', unit: 'mg/dL' },
  hdlCholesterol: { min: 60, max: 100, label: 'HDL Cholesterol', unit: 'mg/dL' },
  triglycerides: { min: 0, max: 80, label: 'Triglycerides', unit: 'mg/dL' },
  vitaminD2: { min: 20, max: 50, label: 'Vitamin D2', unit: 'ng/mL' },
  vitaminD3: { min: 20, max: 50, label: 'Vitamin D3', unit: 'ng/mL' }
}

const scoreTables = {

  waistHeightRatio: [  //Waist Height Ratio
    { range: [0.4, 0.49], score: 90, category: 'Optimal', color: 'green' },
    { range: [0.5, 0.54], score: 80, category: 'Borderline', color: 'yellow' },
    { range: [0.55, 0.59], score: 50, category: 'Suboptimal', color: 'orange' },
    { range: [0.6, 0.69], score: 20, category: 'High Risk', color: 'red' },
    { range: '<0.4', score: 100, category: 'Excellent', color: 'blue' },
    { range: '>0.7', score: 0, category: 'Extremely High Risk', color: 'purple' }
  ],
  waistCircumference: [  //Waist Height Ratio
    { range: [60, 94], score: 90, category: 'Optimal', color: 'green' },
    { range: [50, 60], score: 80, category: 'Borderline', color: 'yellow' },
    { range: [30, 40], score: 50, category: 'Suboptimal', color: 'orange' },
    { range: [20, 30], score: 20, category: 'High Risk', color: 'red' },
    { range: '<20', score: 100, category: 'Excellent', color: 'blue' },
    { range: '>94', score: 0, category: 'Extremely High Risk', color: 'purple' }
  ],


  bloodPressureSystolic: [
    { range: [90, 120], score: 100, category: 'Normal', color: 'green' },
    { range: [121, 130], score: 90, category: 'Elevated', color: 'yellow' },
    { range: [131, 140], score: 80, category: 'Hypertension Stage 1', color: 'orange' },
    { range: [141, 160], score: 60, category: 'Hypertension Stage 2', color: 'red' },
    { range: '>160', score: 40, category: 'Hypertensive Crisis', color: 'purple' },
    { range: '<90', score: 70, category: 'Low BP', color: 'blue' }
  ],
  bloodPressureDiastolic: [
    { range: [60, 80], score: 100, category: 'Normal', color: 'green' },
    { range: [81, 85], score: 90, category: 'Elevated', color: 'yellow' },
    { range: [86, 90], score: 80, category: 'Hypertension Stage 1', color: 'orange' },
    { range: [91, 100], score: 60, category: 'Hypertension Stage 2', color: 'red' },
    { range: '>100', score: 40, category: 'Hypertensive Crisis', color: 'purple' },
    { range: '<60', score: 70, category: 'Low BP', color: 'blue' }
  ],
  fastingBloodGlucose: [
    { range: [85, 89], score: 90, category: 'Borderline', color: 'yellow' },
    { range: [90, 99], score: 80, category: 'Suboptimal', color: 'orange' },
    { range: [100, 109], score: 60, category: 'High Risk', color: 'red' },
    { range: [110, 125], score: 40, category: 'Extremely High Risk', color: 'purple' },
    { range: '>126', score: 20, category: 'Diabetic', color: 'purple' },
    { range: '<85', score: 100, category: 'Optimal', color: 'green' }
  ],
  hdlCholesterol_Male: [
    { range: [50, 59], score: 90, category: 'Near Optimal', color: 'yellow' },
    { range: [40, 49], score: 80, category: 'Boarderline Low', color: 'orange' },
    { range: [30, 39], score: 60, category: 'Increased Risk', color: 'red' },
    { range: '>60', score: 100, category: 'Optimal', color: 'green' },
    { range: '<30', score: 40, category: 'High Risk', color: 'purple' }
  ],
  hdlCholesterol_Female: [
    { range: [55, 59], score: 90, category: 'Near Optimal', color: 'yellow' },
    { range: [45, 54], score: 80, category: 'Borderline Low', color: 'orange' },
    { range: [30, 44], score: 60, category: 'Increased Risk', color: 'red' },
    { range: '>60', score: 100, category: 'Optimal', color: 'green' },
    { range: '<30', score: 40, category: 'High Risk', color: 'purple' }
  ],
  triglycerides: [
    { range: [80, 99], score: 90, category: 'Near Optimal', color: 'yellow' },
    { range: [100, 149], score: 80, category: 'Slightly Elevated', color: 'orange' },
    { range: [150, 199], score: 60, category: 'Moderately Elevated', color: 'red' },
    { range: [200, 299], score: 40, category: 'High Risk', color: 'purple' },
    { range: '<80', score: 100, category: 'Optimal', color: 'green' },
    { range: '>300', score: 20, category: 'Very High Risk', color: 'purple' }
  ],
  // '25-Hydroxyvitamin D2 (nmol/L)': [
  //   { range: [50, 150], score: 100, category: 'Optimal' },
  //   { range: '<50', score: 20, category: 'Deficient' },
  //   { range: '>150', score: 20, category: 'Toxic' }
  // ],
  // '25-Hydroxyvitamin D3 (nmol/L)': [
  //   { range: [50, 150], score: 100, category: 'Optimal' },
  //   { range: '<50', score: 20, category: 'Deficient' },
  //   { range: '>150', score: 20, category: 'Toxic' }
  // ]
};


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
    // Special case for waist circumference which uses height ratio
    // if (parameter === 'waistCircumference' && healthData?.height) {
    //   const waistHeightRatio = value / healthData.height;
    //   const table = scoreTables.waistCircumference;

    //   for (const entry of table) {
    //     if (typeof entry.range === 'string') {
    //       if (entry.range.startsWith('>') && waistHeightRatio > parseFloat(entry.range.slice(1))) {
    //         return { inRange: false, category: entry.category, color: entry.color };
    //       }
    //       if (entry.range.startsWith('<') && waistHeightRatio < parseFloat(entry.range.slice(1))) {
    //         return { inRange: true, category: entry.category, color: entry.color };
    //       }
    //     } else if (waistHeightRatio >= entry.range[0] && waistHeightRatio <= entry.range[1]) {
    //       return { inRange: entry.score >= 80, category: entry.category, color: entry.color };
    //     }
    //   }
    // }

    let table;

    // Special case for hdlCholesterol
    if (parameter === 'hdlCholesterol') {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const sex = user.sex;

      table = scoreTables[`hdlCholesterol_${sex}` as keyof typeof scoreTables];
    } else {
      // For other parameters
      table = scoreTables[parameter as keyof typeof scoreTables];
    }



    if (table) {
      for (const entry of table) {
        if (typeof entry.range === 'string') {
          if (entry.range.startsWith('>') && value > parseFloat(entry.range.slice(1))) {
            return { inRange: false, category: entry.category, color: entry.color };
          }
          if (entry.range.startsWith('<') && value < parseFloat(entry.range.slice(1))) {
            return { inRange: true, category: entry.category, color: entry.color };
          }
        } else if (value >= entry.range[0] && value <= entry.range[1]) {
          return { inRange: entry.score >= 80, category: entry.category, color: entry.color };
        }
      }
    }

    // Fallback to original range check if no score table exists
    const range = healthyRanges[parameter];
    return {
      inRange: value >= range.min && value <= range.max,
      category: value >= range.min && value <= range.max ? 'Normal' : 'Out of Range',
      color: value >= range.min && value <= range.max ? 'green' : 'red'
    };
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

          const { inRange, category, color } = isInRange(value, key as keyof typeof healthyRanges)
          const range = healthyRanges[key as keyof typeof healthyRanges]

          return (
            <div key={key} className="grid grid-cols-12 gap-4 p-2 border rounded-lg">
              <div className="col-span-4 flex flex-col gap-1">
                <h4 className="font-medium text-sm">{range.label}</h4>

              </div>

              <div className="col-span-3 flex items-center gap-2">
                <span className={`w-full text-center items-center rounded-md px-2 py-1 text-xs font-medium ring-1 w-fit ring-inset ${getColorClasses(color)}`}>
                  {category}
                </span>
              </div>

              <div className="col-span-2 flex items-center gap-2">
                <span className="font-bold">{value}</span>
                <span className="text-xs">{range.unit}</span>
              </div>

              <div className="col-span-2">
                <p className="text-xs pl-2">Recommended:</p>
                <p className="text-xs pl-2">{range.min} - {range.max}</p>
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

