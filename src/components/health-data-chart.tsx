'use client'

import { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

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
]

export function HealthDataChart() {
  const [selectedParameter, setSelectedParameter] = useState('weight')
  const [chartData, setChartData] = useState<{dates: string[], values: number[]}>({
    dates: [],
    values: []
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const userId = localStorage.getItem('userEmail') || 'test'
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT}/get-health-history?userId=${userId}&parameter=${selectedParameter}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch health data')
        }

        const data = await response.json()
        
        // Sort data by date
        const sortedData = data.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
        console.log(sortedData)
        setChartData({
          dates: sortedData.map((item: any) => new Date(item.date)),
          values: sortedData.map((item: any) => item[selectedParameter])
        })
      } catch (error) {
        console.error('Error fetching health data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHealthData()
  }, [selectedParameter])

  const data = {
    labels: chartData.dates,
    datasets: [
      {
        label: parameters.find(p => p.value === selectedParameter)?.label || selectedParameter,
        data: chartData.values,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Health Data Over Time'
      }
    },
    scales: {
      y: {
        beginAtZero: false
      }
    }
  }

  return (
    <div className="space-y-4">
      <Select
        value={selectedParameter}
        onValueChange={setSelectedParameter}
      >
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder="Select parameter to view" />
        </SelectTrigger>
        <SelectContent>
          {parameters.map((param) => (
            <SelectItem key={param.value} value={param.value}>
              {param.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isLoading ? (
        <div className="h-[400px] flex items-center justify-center">
          Loading...
        </div>
      ) : chartData.dates.length === 0 ? (
        <div className="h-[400px] flex items-center justify-center">
          No data available
        </div>
      ) : (
        <div className="h-[400px]">
          <Line data={data} options={options} />
        </div>
      )}
    </div>
  )
}