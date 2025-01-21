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
  TimeScale,
  Legend
} from 'chart.js'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import 'chartjs-adapter-moment';
import { CheckCircle, XCircle } from 'lucide-react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const parameters = [
  { 
    value: 'height', 
    label: 'Height (cm)', 
    about: 'The vertical length of a person measured in centimeters.', 
    why: 'Height is used as a baseline to calculate body proportions and assess growth patterns or abnormalities.'
  },
  { 
    value: 'weight', 
    label: 'Weight (kg)', 
    about: 'The body mass of a person measured in kilograms.', 
    why: 'Weight is a critical factor in determining overall health, body composition, and calculating BMI.'
  },
  { 
    value: 'waistCircumference', 
    label: 'Waist Circumference (inches)', 
    about: 'The measurement of the waistline around the abdomen.', 
    why: 'Waist circumference is an indicator of abdominal fat, which is closely linked to cardiovascular risk and metabolic disorders.'
  },
  { 
    value: 'bloodPressureSystolic', 
    label: 'Blood Pressure (Systolic)', 
    about: 'The top number in a blood pressure reading, indicating the pressure in arteries when the heart beats.', 
    why: 'High systolic blood pressure is a major risk factor for cardiovascular disease and stroke.'
  },
  { 
    value: 'bloodPressureDiastolic', 
    label: 'Blood Pressure (Diastolic)', 
    about: 'The bottom number in a blood pressure reading, showing the pressure in arteries when the heart is at rest.', 
    why: 'Elevated diastolic pressure can indicate poor vascular health and an increased risk of heart disease.'
  },
  { 
    value: 'fastingBloodGlucose', 
    label: 'Fasting Blood Glucose (mg/dL)', 
    about: 'The level of glucose in the blood after a person has not eaten for at least 8 hours.', 
    why: 'Fasting blood glucose helps assess insulin function and detect diabetes or prediabetes.'
  },
  { 
    value: 'hdlCholesterol', 
    label: 'HDL Cholesterol (mg/dL)', 
    about: 'High-density lipoprotein cholesterol, also known as "good cholesterol."', 
    why: 'Higher HDL levels are associated with a reduced risk of heart disease as it helps remove excess cholesterol from the bloodstream.'
  },
  { 
    value: 'triglycerides', 
    label: 'Triglycerides (mg/dL)', 
    about: 'A type of fat found in the blood, derived from consumed calories not immediately used for energy.', 
    why: 'Elevated triglycerides are linked to an increased risk of heart disease and metabolic syndrome.'
  },
  { 
    value: 'vitaminD2', 
    label: '25-Hydroxyvitamin D2 (nmol/L)', 
    about: 'A form of vitamin D derived from plant-based sources or supplements.', 
    why: 'Vitamin D2 levels help assess overall vitamin D status and bone health.'
  },
  { 
    value: 'vitaminD3', 
    label: '25-Hydroxyvitamin D3 (nmol/L)', 
    about: 'A form of vitamin D synthesized by the skin when exposed to sunlight or obtained from animal-based sources.', 
    why: 'Vitamin D3 plays a crucial role in calcium absorption, bone health, and immune system function.'
  }
];


export function HealthDataChart(props: {parameter : {name : string , value: number , max_range: number , min_range: number, inRange : boolean} }  ) {
  const [selectedParameter, setSelectedParameter] = useState(props.parameter.name || 'weight')
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
        //console.log(sortedData)
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
    maintainAspectRatio: false,
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
      x: {
        ticks: {
            maxRotation: 90,
            minRotation: 90
        },
      
        type: 'time',
        time: {
            unit: 'day',
            displayFormats: {
              day: 'YYYY-MM-DD HH:mm:ss'
            },
          }
        },
      y: {
        beginAtZero: false
      }
    }
  }

  return (
    <div className="space-y-4">
      {/* <Select
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
      </Select> */}

      {isLoading ? (
        <div className="h-[400px] flex items-center justify-center">
          Loading...
        </div>
      ) : chartData.dates.length === 0 ? (
        <div className="h-[400px] flex items-center justify-center">
          No data available
        </div>
      ) : (
        <>
        <div className="grid grid-cols-1 gap-6 pb-6">
          <div className="grid grid-cols-3 gap-6 pb-6">
            <div>
            <span className="font-bold">{props.parameter.value} </span>
                
            </div>
            <div>
            <p className='font-large text-bold '>{parameters.find(param => param.value === props.parameter.name)?.label || props.parameter.name} </p>
            <p className="text-sm text-muted-foreground">Healthy range: {props.parameter.min_range} - {props.parameter.max_range}</p>
            </div>
            <div>
              {props.parameter.inRange ? (
                  <CheckCircle className="w-5 h-5 text-green-500" /> 
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
            </div>
           
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 pb-6">
          <div className="flex justify-between space-x-4">
            {/* Card 1 */}
            <div className="flex items-start bg-purple-50 p-4 rounded-lg w-1/2 border border-purple-200">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-purple-100 text-purple-500 flex items-center justify-center rounded-full text-lg font-bold">
                  ?
                </div>
              </div>
              <div className="ml-4">
                <h2 className="font-bold text-purple-600">What is {parameters.find(param => param.value === props.parameter.name)?.label || props.parameter.name} ?</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {parameters.find(param => param.value === props.parameter.name)?.about || props.parameter.name} 
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex items-start bg-red-50 p-4 rounded-lg w-1/2 border border-red-200">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-red-100 text-red-500 flex items-center justify-center rounded-full text-lg font-bold">
                  !
                </div>
              </div>
              <div className="ml-4">
                <h2 className="font-bold text-red-600">Importance</h2>
                <p className="text-sm text-gray-600 mt-1">
                {parameters.find(param => param.value === props.parameter.name)?.why || props.parameter.name} 
                </p>

              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 pb-6">
          <p>This is where you add your warning text</p>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="w-[300px] h-[300px]">
            <Line data={data} options={options} />
          </div>
          
          <div>
            <h2>Average Value</h2>
            <p>The average value is this </p>
          </div>
          
        </div>
        </>
        
      )}
    </div>
  )
}