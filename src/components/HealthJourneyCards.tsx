'use client'

import React from "react";
import { useState, useEffect } from 'react'
import { TargetIcon, PlayIcon, PillBottle, UtensilsCrossed, Sprout } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,

  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"



interface JourneyItem {
  title: string;
  description: string;
  linkText: string;
  icon: 'PlayIcon' | 'TargetIcon' | 'PillIcon' | 'MeatIcon' | 'LeafIcon';
  iconColor: string;
  image_url?: string;
  content_url?: string;
}

export default function HealthJourneyCards(props: { filter: string }) {

  const [isLoading, setIsLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const [data, setData] = useState<JourneyItem[]>([{
    title: "Complete Daily Step Goal: 10,000 Steps",
    description: "Staying active helps regulate blood pressure and cholesterol levels.",
    linkText: "Go",
    icon: 'TargetIcon',
    iconColor: "purple"
  }])
  const { toast } = useToast()

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {

        let userId = localStorage.getItem('userEmail') || 'test'

        if (props.filter != 'personal') {
          userId = props.filter
        }

        const token = localStorage.getItem('token')
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT}/digital-journey`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (!response.ok) {
          throw new Error('Failed to fetch recommendations')
        }

        const jsonObj = await response.json()
        console.log('New digital journey Data:', jsonObj)

        // Transform the new API response format to match component expectations
        const transformedData: JourneyItem[] = []
        if (jsonObj.items) {
          jsonObj.items.forEach((item: any) => {
            transformedData.push({
              title: item.name,
              description: item.description,
              linkText: "Go",
              icon: item.type === 'exercise' ? 'TargetIcon' : item.type === 'article' ? 'PlayIcon' : 'LeafIcon',
              iconColor: "purple",
              image_url: item.image_url,
              content_url: item.content_url
            })
          })
        }

        setData(transformedData)
        setIsLoading(false)

      } catch (error) {
        console.error('Error fetching digital journey:', error)
        toast({
          title: "Error",
          description: "Failed to fetch digital journey",
          variant: "destructive",
        })
      } finally {

      }
    }

    fetchRecommendations()
  }, [toast])


  return (
    <>
      {isLoading ? <p>Loading...</p> : data.length === 0 ? (
        <Card className="h-full px-0">
          <CardHeader>
            <CardTitle>
              <div className="flex items-center justify-between ">
                Your Personalized Health Journey
                <a href="#" onClick={() => setShowAll(!showAll)} className="text-primary font-semibold hover:underline">
                  {showAll ? 'Show Less' : 'View All'}
                </a>
              </div>
            </CardTitle>
            <CardDescription>See our recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">
                Your recommendations will be here once your health score will be calculated
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="h-full px-0">
          <CardHeader>
            <CardTitle>
              <div className="flex items-center justify-between ">
                Your Personalized Health Journey
                <a href="#" onClick={() => setShowAll(!showAll)} className="text-primary font-semibold hover:underline">
                  {showAll ? 'Show Less' : 'View All'}
                </a>
              </div>
            </CardTitle>
            <CardDescription>See our recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {showAll ? data.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between pt-4 pr-4 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-10 h-10 rounded-full object-cover border border-gray-300"
                      />
                    )}
                    <div>
                      <h2 className="text-sm font-semibold text-gray-800">{item.title}</h2>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  <a
                    href={item.content_url || '#'}
                    className="text-primary font-semibold hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.linkText}
                  </a>
                </div>
              )) : data.slice(0, 5).map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between pt-4 pr-4 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-10 h-10 rounded-full object-cover border border-gray-300"
                      />
                    )}
                    <div>
                      <h2 className="text-sm font-semibold text-gray-800">{item.title}</h2>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  <a
                    href={item.content_url || '#'}
                    className="text-primary font-semibold hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.linkText}
                  </a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
