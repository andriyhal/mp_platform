'use client'

import { useState, useEffect } from 'react'
import { useToast } from "@/hooks/use-toast"
import { SegmentedGauge } from './segmented-gauge'

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
  general_health_score?: number;
  status?: 'Good' | 'Excellent' | 'Need to improve';
}

interface CentralHealthScoreProps {
  variant?: "default" | "extra" | "debug";
}

export function CentralHealthScore({ variant = "default" }: CentralHealthScoreProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [jsonObj, setJsonObj] = useState<HealthScoreData>({
    score: 66, // Placeholder value
    description: 'Your result is much better compared to last month! Recommended health score: more than 70%',
    lastUpdate: new Date().toISOString(),
    waistCircumference: 0,
    bloodPressureSystolic: 0,
    bloodPressureDiastolic: 0,
    fastingBloodGlucose: 0,
    hdlCholesterol: 0,
    triglycerides: 0,
    status: 'Good' // Placeholder status
  })
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
        
        // Use general_health_score if available, otherwise use the calculated score
        const healthScore = data.general_health_score || data.score || 66
        
        // Determine status based on score
        let status: 'Need to improve' | 'Good' | 'Excellent' = 'Good'
        if (healthScore >= 70) status = 'Excellent'
        else if (healthScore >= 50) status = 'Good'
        else status = 'Need to improve'
        
        setJsonObj({
          ...data,
          score: healthScore,
          status: data.status || status,
          description: data.description || 'Your result is much better compared to last month! Recommended health score: more than 70%'
        })

      } catch (error) {
        console.error('Error fetching health score:', error)
        // Keep placeholder values on error
        toast({
          title: "Using sample data",
          description: "Using placeholder values for demonstration",
          variant: "default",
        })
      } finally {
        setIsSubmitting(false)
      }
    }

    fetchHealthScore()
  }, [toast])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Excellent': return 'bg-green-500'
      case 'Good': return 'bg-orange-500'
      case 'Need to improve': return 'bg-red-500'
      default: return 'bg-green-500'
    }
  }

  const getGaugeColor = (score: number) => {
    if (score >= 70) return '#22c55e' // green
    if (score >= 50) return '#f97316' // orange
    return '#ef4444' // red
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (isSubmitting) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="relative p-6 flex flex-col h-full">
      {/* Header with title and status indicator */}
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold text-gray-700">Central Health Score</h2>
        <div className="flex items-center gap-2">
          <span className={`inline-block w-3 h-3 rounded-full ${getStatusColor(jsonObj.status || 'Good')}`}></span>
          <span className="text-sm font-medium text-gray-700">{jsonObj.status || 'Good'}</span>
        </div>
      </div>

      {/* Middle section - grows to fill space */}
      <div className="flex-1 flex flex-col justify-center">
        {/* Segmented Gauge */}
        <div className="flex justify-center mb-3">
          <SegmentedGauge
            value={jsonObj.score}
            totalSegments={30}
            startAngle={-180}
            endAngle={0}
            radius={160}
            thickness={24}
            gapAngle={3}
            activeColor={getGaugeColor(jsonObj.score)}
            inactiveColor="#e5e7eb"
            animate={true}
            animationDurationMs={1200}
            showLabel={true}
            labelFormatter={(value) => `${value}%`}
            className="mb-2"
          />
        </div>
      </div>

      {/* Bottom content - 3 sections */}
      <div className="flex items-center gap-4 mt-auto">
        {/* Left section - percentage (15%) */}
        <div className="w-[15%] flex justify-center">
          <div className="text-xl font-bold text-black">
            {jsonObj.score}%
          </div>
        </div>

        {/* Middle section - description text (70%) */}
        <div className="w-[70%]">
          <div className="text-sm text-gray-500 leading-relaxed">
            {jsonObj.description}
          </div>
        </div>

        {/* Right section - user entered date (15%) */}
        <div className="w-[15%] flex justify-center">
          <div className="text-sm text-gray-500">
            User-entered on {formatDate(jsonObj.lastUpdate)}
          </div>
        </div>
      </div>
    </div>
  )
}
