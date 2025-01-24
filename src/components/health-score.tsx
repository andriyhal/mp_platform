'use client'

import { useState, useEffect } from 'react'
import { CircularProgressbar } from 'react-circular-progressbar'
import { useToast } from "@/hooks/use-toast"
import { Toaster } from './ui/toaster'


export function HealthScore() {
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastUpdateDate, setLastUpdateDate] = useState<string | null>(null)
  const [healthScore, setHealthScore] = useState(0)
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
        
        const jsonObj = JSON.parse(data);
        //console.log('Health Score Data:', jsonObj)
        setHealthScore(jsonObj.score || 0)
        setLastUpdateDate(jsonObj.lastUpdate || null)
        setScoreDetails(jsonObj.description || null)
        
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
        <div style={{ width: '200px', margin: '0 auto' }}>
        <CircularProgressbar 
            value={healthScore} 
            text={`${healthScore}%`}
            styles={{
            path: { 
                stroke: `rgb(${255 - (healthScore * 2.55)}, ${healthScore * 2.55}, 0)` 
            },
            text: { 
                fill: `rgb(${255 - (healthScore * 2.55)}, ${healthScore * 2.55}, 0)`,
                fontSize: '16px' 
            }
            }}
        />
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
        <Toaster />
    </div>
  )
}
