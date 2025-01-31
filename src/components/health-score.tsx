'use client'

import { useState, useEffect } from 'react'
import { CircularProgressbar } from 'react-circular-progressbar'
import { useToast } from "@/hooks/use-toast"
import { Toaster } from './ui/toaster'


export function HealthScore() {
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bmi, setBMI] = useState(0)
  const [lastUpdateDate, setLastUpdateDate] = useState<string | null>(null)
  const [jsonObj, setJsonObj] = useState<{score: number, description: string, lastUpdate: string, activity_recommendations: Array<any>, health_supplements: Array<any>}>({score: 0, description: '', lastUpdate: '', activity_recommendations: [], health_supplements: []})
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
        
        if (typeof data !== 'string') {
          throw new Error('Data is not in the correct format');
        }
        const parsedData = JSON.parse(data);
        console.log('Health Score Data:', parsedData)
        setBMI(parsedData.bmi || null)
        setLastUpdateDate(parsedData.lastUpdate || null)
        setScoreDetails(parsedData.description || null)
        setJsonObj(parsedData)
        
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

  

  return (
    <div>
        <div className="grid grid-cols-2 gap-6 items-center">
        <div className="w-3/4 p-6">
        <CircularProgressbar 
            value={jsonObj.score || 0} 
            text={`${jsonObj.score}%`}
            styles={{
            path: { 
                stroke: `rgb(${255 - (jsonObj.score * 2.55)}, ${jsonObj.score * 2.55}, 0)` 
            },
            text: { 
                fill: `rgb(${255 - (jsonObj.score * 2.55)}, ${jsonObj.score * 2.55}, 0)`,
                fontSize: '16px' 
            }
            }}
        />
        </div>

        {bmi && (
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
        {scoreDetails && (
            <p className="text-sm text-muted-foreground mb-4">
            {scoreDetails}
            </p>
        )}
        
        {jsonObj && (
          <div className="p-6">
          
    
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
    
          {/* <div>
            <h2 className="text-xl font-semibold mb-2">Health Supplements</h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">Name</th>
                  <th className="border border-gray-300 px-4 py-2">Benefits</th>
                  <th className="border border-gray-300 px-4 py-2">Recommended Dosage</th>
                </tr>
              </thead>
              <tbody>
                {jsonObj.health_supplements.map((supplement, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">{supplement.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{supplement.benefits}</td>
                    <td className="border border-gray-300 px-4 py-2">{supplement.recommendedDosage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div> */}
        </div>
        )}
        {/* <Toaster /> */}
    </div>
  )
}
