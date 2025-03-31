'use client'

import { useState, useEffect } from 'react'
import { CircularProgressbar } from 'react-circular-progressbar'
import "react-circular-progressbar/dist/styles.css";
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

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

export function HealthScore({ variant = "default" }) {

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
  const [showScoreBreakdown, setShowScoreBreakdown] = useState(false)




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
      <div className={variant === "extra" ? "grid grid-cols-2 gap-6 items-center max-h-[400px]" : "grid grid-cols-1 gap-6 items-center max-h-[400px]"}>
        <div>
          {!isSubmitting && (

            <div className="w-3/4 p-6">
              <CircularProgressbar
                value={jsonObj.score || 0}
                text={`${jsonObj.score}%`}
                circleRatio={0.5}
                styles={{
                  path: {
                    stroke: `rgb(${255 - (jsonObj.score * 2.55)}, ${jsonObj.score * 2.55}, 0)`,
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
                    fontSize: '16px',

                  }
                }}
              />
            </div>
          )}





          <div style={{ top: '-100px', position: 'relative' }}>

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
          </div>
        </div>

        {!isSubmitting && variant === "extra" && (
          <div className=''><p>Your results are much better than last month</p></div>
        )}

        {!isSubmitting && variant === "debug" && (
          <div className="p-6">



            <Button className="m-2" onClick={() => setShowScoreBreakdown(!showScoreBreakdown)}>{showScoreBreakdown ? 'Hide Breakdown' : 'Show Breakdown'}</Button>

            {showScoreBreakdown && (
              <div className="mb-8">

                <table className="w-full border-collapse border border-gray-300 text-xs">
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
            )}

          </div>

        )}

      </div>
      {/* <Toaster /> */}
    </div>
  )
}
