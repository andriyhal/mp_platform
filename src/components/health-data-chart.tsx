'use client'

import { useState, useEffect } from 'react'
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

import 'chartjs-adapter-moment';
import { CheckCircle, TriangleAlert } from 'lucide-react'
import Image from 'next/image'
import TrendGraph from './trend-graph'
import HealthExpertConsultation from './HealthExpertConsultation';
import ProductRecommendations from './ProductRecommendations';
import HealthJourneyCards from './HealthJourneyCards';

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
    label: 'Height', 
    unit: 'cm',
    about: 'The vertical length of a person measured in centimeters.', 
    why: 'Height is used as a baseline to calculate body proportions and assess growth patterns or abnormalities.',
    averageValue: 175 // Example average value
  },
  { 
    value: 'weight', 
    label: 'Weight', 
    unit: 'kg',
    about: 'The body mass of a person measured in kilograms.', 
    why: 'Weight is a critical factor in determining overall health, body composition, and calculating BMI.',
    averageValue: 70 // Example average value
  },
  { 
    value: 'waistCircumference', 
    label: 'Waist Circumference', 
    unit: 'cm',
    about: 'The measurement of the waistline around the abdomen.', 
    why: 'Waist circumference is an indicator of abdominal fat, which is closely linked to cardiovascular risk and metabolic disorders.',
    averageValue: 32 // Example average value
  },
  { 
    value: 'bloodPressureSystolic', 
    label: 'Blood Pressure (Systolic)', 
    unit: 'mmHg',
    about: 'The top number in a blood pressure reading, indicating the pressure in arteries when the heart beats.', 
    why: 'High systolic blood pressure is a major risk factor for cardiovascular disease and stroke.',
    averageValue: 120 // Example average value
  },
  { 
    value: 'bloodPressureDiastolic', 
    label: 'Blood Pressure (Diastolic)', 
    unit: 'mmHg',
    about: 'The bottom number in a blood pressure reading, showing the pressure in arteries when the heart is at rest.', 
    why: 'Elevated diastolic pressure can indicate poor vascular health and an increased risk of heart disease.',
    averageValue: 80 // Example average value
  },
  { 
    value: 'fastingBloodGlucose', 
    label: 'Fasting Blood Glucose', 
    unit: 'mg/dL',
    about: 'The level of glucose in the blood after a person has not eaten for at least 8 hours.', 
    why: 'Fasting blood glucose helps assess insulin function and detect diabetes or prediabetes.',
    averageValue: 100 // Example average value
  },
  { 
    value: 'hdlCholesterol', 
    label: 'HDL Cholesterol', 
    unit: 'mg/dL',
    about: 'High-density lipoprotein cholesterol, also known as "good cholesterol."', 
    why: 'Higher HDL levels are associated with a reduced risk of heart disease as it helps remove excess cholesterol from the bloodstream.',
    averageValue: 60 // Example average value
  },
  { 
    value: 'triglycerides', 
    label: 'Triglycerides', 
    unit: 'mg/dL',
    about: 'A type of fat found in the blood, derived from consumed calories not immediately used for energy.', 
    why: 'Elevated triglycerides are linked to an increased risk of heart disease and metabolic syndrome.',
    averageValue: 150 // Example average value
  },
  { 
    value: 'vitaminD2', 
    label: '25-Hydroxyvitamin D2', 
    unit: 'nmol/L',
    about: 'A form of vitamin D derived from plant-based sources or supplements.', 
    why: 'Vitamin D2 levels help assess overall vitamin D status and bone health.',
    averageValue: 50 // Example average value
  },
  { 
    value: 'vitaminD3', 
    label: '25-Hydroxyvitamin D3', 
    unit: 'nmol/L',
    about: 'A form of vitamin D synthesized by the skin when exposed to sunlight or obtained from animal-based sources.', 
    why: 'Vitamin D3 plays a crucial role in calcium absorption, bone health, and immune system function.',
    averageValue: 75 // Example average value
  }
];


export function HealthDataChart(props: {parameter : {name : string , value: number , max_range: number , min_range: number, inRange : boolean} }  ) {
  const [selectedParameter, setSelectedParameter] = useState(props.parameter.name || 'weight')
  const [chartData, setChartData] = useState<{dates: Date[], values: number[]}>({
    dates: [],
    values: []
  })
  const [isLoading, setIsLoading] = useState(true)

  //to remove error
  if(0){
    setSelectedParameter('')
  }

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const userId = localStorage.getItem('userEmail') || 'test'
        
        const token = localStorage.getItem('token')
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT}/get-health-history?userId=${userId}&parameter=${selectedParameter}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
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

  useEffect(() => {
    const fetchEstimateHealthData = async () => {
      try {
        const userId = localStorage.getItem('userEmail') || 'test'
       
        //console.log(props)
        const token = localStorage.getItem('token')
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT}/average-health-metrics` , {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
       
        if (!response.ok) {
          throw new Error('Failed to fetch health data')
        }

        const data = await response.json()
        if (data) {
            parameters.forEach((param) => {
              param.averageValue = data[param.value];
            });
        }
      } catch (error) {
        console.error('Error fetching health data:', error)
      
      }
    }

    fetchEstimateHealthData()
  }, [])

  return (
    <div className="space-y-4 overflow-auto h-screen p-6" style={{ height: '80vh'  }} >
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
          <div className="grid grid-cols-1 gap-6 pb-6">
            <Image src="/images/blood_sample.png" alt="Blood Sample" width={100}height={24} style={{ width: '100%' }}/>
            
          </div>

          {/* <div className="grid grid-cols-3 gap-6 pb-6">
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
           
          </div> */}
           <div className={`flex items-center justify-between p-4 rounded-lg shadow-md ${props.parameter.inRange ? 'bg-green-50' : 'bg-red-50'}`}>
            
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-32 h-16 text-2xl font-bold rounded-lg ${props.parameter.inRange ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {props.parameter.value}
                <span className='text-xs'>
                {parameters.find(param => param.value === props.parameter.name)?.unit || ''} 
                </span>
              </div>
              <div className="ml-4">
                <h4 className="text-gray-800 font-semibold">{parameters.find(param => param.value === props.parameter.name)?.label || props.parameter.name} </h4>
                <p className="text-sm text-muted-foreground">Healthy range: {props.parameter.min_range} - {props.parameter.max_range}</p>
              </div>
            </div>

            
            <div className="flex items-center">
              
              {props.parameter.inRange ? (
                  <CheckCircle className="w-5 h-5 text-green-500" /> 
                ) : (
                  <TriangleAlert  className="w-5 h-5 text-red-500" />
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
         
          <div className="w-[400px] h-100">
            {/* <Line data={data} options={options} /> */}
            <TrendGraph chartData={chartData}/>
          </div>
          <div>
            <h2>Average Value</h2>
            <p>The average value for someone with your age, gender and weight is: </p>
            <p>{parameters.find(param => param.value === props.parameter.name)?.averageValue || props.parameter.name} </p>
          </div>
          
        </div>
        <div className="grid grid-cols-1 gap-6">
          <HealthJourneyCards />
        </div>
        <div className="grid grid-cols-1 gap-6">
          <HealthExpertConsultation variant='row'/>
        </div>
        <div className="grid grid-cols-1 gap-6">
          <ProductRecommendations />
        </div>
        </>
        
      )}
    </div>
  )
}