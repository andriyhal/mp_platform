'use client'

import { useState, useEffect } from 'react'
import { CircularProgressbar } from 'react-circular-progressbar'
import { useToast } from "@/hooks/use-toast"

interface HealthScoreData {
  score: number;
  description: string;
  lastUpdate: string;
  waistCircumference: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  fastingBloodGlucose: number;
  hdlCholesterol: number;
  triglycerides: number;
}

export function HealthScore() {
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bmi, setBMI] = useState(0)
  const [lastUpdateDate, setLastUpdateDate] = useState<string | null>(null)
  const [jsonObj, setJsonObj] = useState<HealthScoreData>({
    score: 0,
    description: '',
    lastUpdate: '',
    waistCircumference: 0,
    bloodPressureSystolic: 0,
    bloodPressureDiastolic: 0,
    fastingBloodGlucose: 0,
    hdlCholesterol: 0,
    triglycerides: 0
  })
  const [scoreDetails, setScoreDetails] = useState<string | null>(null)
  const { toast } = useToast()


    

  useEffect(() => {
    const fetchHealthScore = async () => {
      try {
        setIsSubmitting(true)
        const userId = localStorage.getItem('userEmail') || 'test'
        
        const token = localStorage.getItem('token')
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT}/calc-health-score?userId=${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (!response.ok) {
          throw new Error('Failed to fetch health score')
        }

        const data = await response.json()
        
        // if (typeof data !== 'string') {
        //   throw new Error('Data is not in the correct format');
        // }
        // const parsedData = JSON.parse(data);

        //console.log('Health Score Data:', parsedData)
        setBMI(data.bmi || null)
        setLastUpdateDate(data.lastUpdate || null)
        setScoreDetails(data.description || null)
        setJsonObj(data)
        
      } catch (error) {
        console.error('Error fetching health score:', error)
        toast({
          title: "Error",
          description: "Failed to fetch latest health score",
          variant: "destructive",
        })
      } finally {
        setIsSubmitting(false)
      }
    }

    fetchHealthScore()
  }, [toast])

  //sample jsonObj = {"height":100,"weight":100,"waistCircumference":0,"bloodPressureSystolic":100,"bloodPressureDiastolic":100,"fastingBloodGlucose":80,"hdlCholesterol":80,"triglycerides":80,"vitaminD2":20,"vitaminD3":100,"score":76}

  return (
    <div>
        <div className="grid grid-cols-2 gap-6 items-center">
        
        {!isSubmitting && (
        <div className="w-3/4 p-6">
        <CircularProgressbar 
            value={jsonObj.score || 0} 
            text={`${jsonObj.score}%`}
            circleRatio={0.5}
            styles={{
            path: { 
                stroke: `rgb(${255 - (jsonObj.score * 2.55)}, ${jsonObj.score * 2.55}, 0)` ,
                transform: 'rotate(-0.25turn)',
                transformOrigin: 'center center',
            },
            trail: {
              
              // Rotate the trail
              transform: 'rotate(-0.25turn)',
              transformOrigin: 'center center',
            },
            text: { 
                fill: `rgb(${255 - (jsonObj.score * 2.55)}, ${jsonObj.score * 2.55}, 0)`,
                fontSize: '16px' 
            }
            }}
        />
        </div>
        )}

        {!isSubmitting && (
          <div>
              <p className="text-lg font-semibold text-center">Your BMI is: <span className={`${
                bmi < 18.5 ? 'text-yellow-500' :
                bmi >= 18.5 && bmi < 25 ? 'text-green-500' :
                bmi >= 25 && bmi < 30 ? 'text-orange-500' :
                'text-red-500'
              }`}>{bmi}</span></p>
              <p className="text-sm text-gray-500 mt-2 text-center">
                BMI Categories:<br />
                Underweight: &lt;18.5<br />
                Normal weight: 18.5-24.9<br />
                Overweight: 25-29.9<br />
                Obesity: ≥30
              </p>
          </div>
        )}

        </div>

        {lastUpdateDate && (
            <p className="text-sm text-muted-foreground mb-4">
            Last updated: {lastUpdateDate}
            </p>
        )}

        {/* {scoreDetails && (
            <p className="text-sm text-muted-foreground mb-4">
            {scoreDetails}
            </p>
        )} */}
        
        {!isSubmitting && (
          <div className="p-6">
          
          {/* 
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Activity Recommendations</h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">Name</th>
                  <th className="border border-gray-300 px-4 py-2">Description</th>
                  <th className="border border-gray-300 px-4 py-2">Frequency</th>
                </tr>
              </thead>
              <tbody>
                {jsonObj.activity_recommendations.map((activity, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">{activity.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{activity.description}</td>
                    <td className="border border-gray-300 px-4 py-2">{activity.frequency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          */}

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Score Breakdown</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Metric</th>
                <th className="border border-gray-300 px-4 py-2">Score</th>
              </tr>
            </thead>
            <tbody>
             
              <tr>
                <td className="border border-gray-300 px-4 py-2">Waist Heigth Ratio </td>
                <td className="border border-gray-300 px-4 py-2">{jsonObj.waistCircumference}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Blood Pressure (Systolic)</td>
                <td className="border border-gray-300 px-4 py-2">{jsonObj.bloodPressureSystolic}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Blood Pressure (Diastolic)</td>
                <td className="border border-gray-300 px-4 py-2">{jsonObj.bloodPressureDiastolic}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Fasting Blood Glucose (mg/dL)</td>
                <td className="border border-gray-300 px-4 py-2">{jsonObj.fastingBloodGlucose}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">HDL Cholesterol (mg/dL)</td>
                <td className="border border-gray-300 px-4 py-2">{jsonObj.hdlCholesterol}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Triglycerides (mg/dL)</td>
                <td className="border border-gray-300 px-4 py-2">{jsonObj.triglycerides}</td>
              </tr>
            

            </tbody>
          </table>
        </div>
    
          
        </div>
        )}
        {/* <Toaster /> */}
    </div>
  )
}
