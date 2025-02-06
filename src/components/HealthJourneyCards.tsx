'use client'

import React from "react";
import { useState, useEffect } from 'react'
import { TargetIcon , PlayIcon,PillBottle, UtensilsCrossed , Sprout } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,

  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

// dummy data
// const data = [
//   {
//     title: "Watch a Video: Managing High Cholesterol",
//     description: "Learn how diet and lifestyle changes can help control LDL cholesterol.",
//     linkText: "Go",
//     icon: PlayIcon ,
//     iconColor: "orange"
//   },
//   {
//     title: "Complete Daily Step Goal: 10,000 Steps",
//     description: "Staying active helps regulate blood pressure and cholesterol levels.",
//     linkText: "Go",
//     icon: TargetIcon ,
//     iconColor: "purple"
//   },
//   {
//     title: "Watch a Video: Managing High Cholesterol",
//     description: "Learn how diet and lifestyle changes can help control LDL cholesterol.",
//     linkText: "Go",
//     icon: PlayIcon ,
//     iconColor: "orange"
//   },
//   {
//     title: "Complete Daily Step Goal: 10,000 Steps",
//     description: "Staying active helps regulate blood pressure and cholesterol levels.",
//     linkText: "Go",
//     icon: TargetIcon ,
//     iconColor: "purple"
//   },
// ];

interface JourneyItem {
  title: string;
  description: string;
  linkText: string;
  icon: 'PlayIcon' | 'TargetIcon' | 'PillIcon' | 'MeatIcon' | 'LeafIcon';
  iconColor: string;
}

export default function HealthJourneyCards() {

  
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
        
        const userId = localStorage.getItem('userEmail') || 'test'
        
        const token = localStorage.getItem('token')
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT}/get-reco-actions?userId=${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (!response.ok) {
          throw new Error('Failed to fetch recommendations')
        }

        const jsonObj = await response.json()
        // console.log('recommendations Data:', jsonObj)
        // if (typeof jsonObj !== 'string') {
        //   throw new Error('Data is not in the correct format');
        // }
        // const parsedData = JSON.parse(jsonObj);
        // console.log('recommendations Data:', parsedData)
       
        setData(jsonObj)
        
      } catch (error) {
        console.error('Error fetching recommendation:', error)
        toast({
          title: "Error",
          description: "Failed to fetch recommendations",
          variant: "destructive",
        })
      } finally {
        
      }
    }

    fetchRecommendations()
  }, [toast])


  return (
 <>
    <Card>
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
    <div className="space-y-4">
          {showAll ? data.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <div className="flex items-start space-x-4">
                <div className={`flex items-center justify-center pl-2 w-10 h-10 bg-${item.iconColor}-100 text-${item.iconColor}-500 rounded-lg`}>
                  {item.icon === 'PlayIcon' && <PlayIcon className="mr-2 h-4 w-4" />}
                  {item.icon === 'TargetIcon' && <TargetIcon className="mr-2 h-4 w-4" />}
                  {item.icon === 'PillIcon' && <PillBottle className="mr-2 h-4 w-4" />}
                  {item.icon === 'MeatIcon' && <UtensilsCrossed className="mr-2 h-4 w-4" />}
                  {item.icon === 'LeafIcon' && <Sprout className="mr-2 h-4 w-4" />}
                  
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-800">{item.title}</h2>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
              <a href="#" className="text-primary font-semibold hover:underline">
                {item.linkText}
              </a>
            </div>
          )) : data.slice(0, 5).map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <div className="flex items-start space-x-4">
                <div className={`flex items-center justify-center pl-2 w-10 h-10 bg-${item.iconColor}-100 text-${item.iconColor}-500 rounded-lg`}>
                  {item.icon === 'PlayIcon' && <PlayIcon className="mr-2 h-4 w-4" />}
                  {item.icon === 'TargetIcon' && <TargetIcon className="mr-2 h-4 w-4" />}
                  {item.icon === 'PillIcon' && <PillBottle className="mr-2 h-4 w-4" />}
                  {item.icon === 'MeatIcon' && <UtensilsCrossed className="mr-2 h-4 w-4" />}
                  {item.icon === 'LeafIcon' && <Sprout className="mr-2 h-4 w-4" />}
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-800">{item.title}</h2>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
              <a href="#" className="text-primary font-semibold hover:underline">
                {item.linkText}
              </a>
            </div>
          ))}
        </div>
    </CardContent>
  </Card>
    
    </>
  );
}
