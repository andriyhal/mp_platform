'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import { HealthDataChart } from './health-data-chart'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CircularProgressbar } from 'react-circular-progressbar'


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


const scoreTables = {
  'Height (cm)': [
    { range: [150, 200], score: 100 }, // Normal height range
    { range: '<150', score: 70 },
    { range: '>200', score: 80 }
  ],
  'Weight (kg)': [
    { range: [50, 90], score: 100 },
    { range: [91, 120], score: 70 },
    { range: '>120', score: 40 }
  ],
  'Waist Circumference (inches)': [  //Waist Height Ratio
    { range: [0.4, 0.49], score: 90 },
    { range: [0.5, 0.54], score: 80 },
    { range: [0.55, 0.59], score: 50 },
    { range: [0.6, 0.69], score:  20},
    { range: '<0.4', score: 100 },
    { range: '>0.7', score: 0 }
  ],


  'Blood Pressure (Systolic)': [
    { range: [90, 120], score: 100 },
    { range: [121, 130], score: 90 },
    { range: [131, 140], score: 80 },
    { range: [141, 160], score: 60 },
    { range: '>160', score: 40 },
    { range: '<90', score: 70 }
  ],
  'Blood Pressure (Diastolic)': [
    { range: [60, 80], score: 100 },
    { range: [81, 85], score: 90 },
    { range: [86, 90], score: 80 },
    { range: [91, 100], score: 60 },
    { range: '>100', score: 40 },
    { range: '<60', score: 70 }
  ],
  'Fasting Blood Glucose (mg/dL)': [
    { range: [85, 89], score: 90 },
    { range: [90, 99], score: 80 },
    { range: [100, 109], score: 60 },
    { range: [110, 125], score: 40 },
    { range: '>126', score: 20 },
    { range: '<85', score: 100 }
  ],
  'HDL Cholesterol (mg/dL)': [
    { range: [50, 59], score: 90 },
    { range: [40, 49], score: 80 },
    { range: [30, 39], score: 60 },
    { range: '>60', score: 100 },
    { range: '<30', score: 40 }
  ],
  'Triglycerides (mg/dL)': [
    { range: [80, 99], score: 90 },
    { range: [100, 149], score: 80 },
    { range: [150, 199], score: 60 },
    { range: [200, 299], score: 40 },
    { range: '<80', score: 100 },
    { range: '>300', score: 20 }
  ],
  '25-Hydroxyvitamin D2 (nmol/L)': [
    { range: [50, 150], score: 100 },
    { range: '<50', score: 20 },
    { range: '>150', score: 20 }
  ],
  '25-Hydroxyvitamin D3 (nmol/L)': [
    { range: [50, 150], score: 100 },
    { range: '<50', score: 20 },
    { range: '>150', score: 20 }
  ]
};

const parameters = [
  { value: 'height', label: 'Height (cm)' },
  { value: 'weight', label: 'Weight (kg)' },
  { value: 'waistCircumference', label: 'Waist Circumference (inches)' },
  { value: 'bloodPressureSystolic', label: 'Blood Pressure (Systolic)' },
  { value: 'bloodPressureDiastolic', label: 'Blood Pressure (Diastolic)' },
  { value: 'fastingBloodGlucose', label: 'Fasting Blood Glucose (mg/dL)' },
  { value: 'hdlCholesterol', label: 'HDL Cholesterol (mg/dL)' },
  { value: 'triglycerides', label: 'Triglycerides (mg/dL)' },
  { value: 'vitaminD2', label: '25-Hydroxyvitamin D2 (nmol/L)' },
  { value: 'vitaminD3', label: '25-Hydroxyvitamin D3 (nmol/L)' }
];



function calcScore(value, table) {
  for (const row of table) {
    const { range, score } = row;

    if (typeof range === 'string') {
      if (range.startsWith('<') && value < parseFloat(range.slice(1))) {
        return score;
      }
      if (range.startsWith('>') && value > parseFloat(range.slice(1))) {
        return score;
      }
    } else if (Array.isArray(range) && value >= range[0] && value <= range[1]) {
      return score;
    }
  }
  return 0; // Return 0 if no range matched
}

function calculateTotalScore(parameterValues) {
  let totalScore = 0;

  for (const parameter of parameters) {
    const label = parameter.label;
    const value = parameterValues[label]; // Get the value for this parameter
    const table = scoreTables[label]; // Get the corresponding score table

    if (value !== undefined && table) {
      totalScore += calcScore(value, table);
    }
  }

  return totalScore/parameters.length;
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

  const [totalScore, setTotalScore] = useState(null);

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

        const parameterValues = {
          'Height (cm)':                    Number(data.height),
          'Weight (kg)':                    data.weight,
          'Waist Circumference (inches)':   data.waistCircumference/Number(data.height),
          'Blood Pressure (Systolic)':      data.bloodPressureSystolic,
          'Blood Pressure (Diastolic)':     data.bloodPressureDiastolic,
          'Fasting Blood Glucose (mg/dL)':  data.fastingBloodGlucose,
          'HDL Cholesterol (mg/dL)':        data.hdlCholesterol,
          'Triglycerides (mg/dL)':          data.triglycerides,
          '25-Hydroxyvitamin D2 (nmol/L)':  data.vitaminD2,
          '25-Hydroxyvitamin D3 (nmol/L)':  data.vitaminD3
        };


        setTotalScore( calculateTotalScore(parameterValues) );
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

      <div>Your calculated health score via excel matrix : {totalScore}</div>

      <div className="w-1/2 p-6">
        <CircularProgressbar 
            value={totalScore || 0} 
            text={`${totalScore}%`}
            styles={{
            path: { 
                stroke: `rgb(${255 - (totalScore * 2.55)}, ${totalScore * 2.55}, 0)` ,
                transform: 'rotate(-0.25turn)',
                transformOrigin: 'center center',
            },
            trail: {
              
              // Rotate the trail
              transform: 'rotate(-0.25turn)',
              transformOrigin: 'center center',
            },
            text: { 
                fill: `rgb(${255 - (totalScore * 2.55)}, ${totalScore * 2.55}, 0)`,
                fontSize: '16px' ,
                
            },
            
            
            }}
            

            circleRatio={0.5}
            
        />
        </div>
      
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        {Object.entries(healthData).map(([key, value]) => {
          if (key === 'lastUpdate') return null
          
          const inRange = isInRange(value, key as keyof typeof healthyRanges)
          const range = healthyRanges[key as keyof typeof healthyRanges]
          
          return (
            <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
              <div onClick={() => { setShowChartDialog(true); setSelectedParameter({name : key , value: value , max_range: range.max , min_range: range.min, inRange : inRange}) }}>
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

