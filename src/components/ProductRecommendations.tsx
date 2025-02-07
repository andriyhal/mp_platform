import React from "react";
import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from 'next/image'
import { useToast } from "@/hooks/use-toast"

// const data = [
//     {
//       title: "Omega-3 Supplements",
//       description: "Supports healthy cholesterol levels.",
//       price: "$25",
//       image: "/images/demo_product.png",
//       buttonText: "Buy",
//     },
//     {
//       title: "Omega-3 Supplements",
//       description: "Supports healthy cholesterol levels.",
//       price: "$25",
//       image: "/images/demo_product.png",
//       buttonText: "Buy",
//     },
//     {
//       title: "Omega-3 Supplements",
//       description: "Supports healthy cholesterol levels.",
//       price: "$25",
//       image: "/images/demo_product.png",
//       buttonText: "Buy",
//     },
//   ];

export default function ProductRecommendations() {

  const [showAll, setShowAll] = useState(false)

  interface ProductItem {
    title: string;
    description: string;
    price: string;
    image: string;
    buttonText: string;
  }

  const [data, setData] = useState<ProductItem[]>([
    {
      title: "Omega-3 Supplements",
      description: "Supports healthy cholesterol levels.",
      price: "$25",
      image: "/images/demo_product.png",
      buttonText: "Buy",
    }
  ])
  const { toast } = useToast()
  
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        
        const userId = localStorage.getItem('userEmail') || 'test'
        
        const token = localStorage.getItem('token')
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT}/get-reco-products?userId=${userId}`, {
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
        Recommended Products for You 
        <a href="#" onClick={() => setShowAll(!showAll)} className="text-primary font-semibold hover:underline">
            {showAll ? 'Show Less' : 'View All'}
          </a> 
          </div>
          </CardTitle>
      <CardDescription>See our recommendations</CardDescription>
    </CardHeader>
    <CardContent>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
           {showAll ? data.map((item, index) => (
            <div
            key={index}
            className="p-4 bg-gray-100 rounded-lg shadow hover:shadow-md hover:bg-gray-200"
          >
            <Image 
              src={item.image}
              alt={item.title}
              
              width={300}  height={24}
            />
            <h2 className="text-sm font-semibold text-gray-800 mb-2">
              {item.title}
            </h2>
            <p className="text-sm text-gray-600 mb-4 h-[150px]">{item.description}</p>
            <div className="flex justify-between items-center ">
              <span className="text-lg font-bold text-gray-800">{item.price}</span>
              <button className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-500">
                {item.buttonText}
              </button>
            </div>
          </div>
          
        )) : data.slice(0, 3).map((item, index) => (

          <div
              key={index}
              className="p-4 bg-gray-100 rounded-lg shadow hover:shadow-md hover:bg-gray-200"
            >
              <Image 
                src={item.image}
                alt={item.title}
                
                width={300}  height={24}
              />
              <h2 className="text-sm font-semibold text-gray-800 mb-2">
                {item.title}
              </h2>
              <p className="text-sm text-gray-600 mb-4 h-[150px]">{item.description}</p>
              <div className="flex justify-between items-center ">
                <span className="text-lg font-bold text-gray-800">{item.price}</span>
                <button className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-500">
                  {item.buttonText}
                </button>
              </div>
            </div>
        ))
        }
        
        </div>
    </CardContent>
  </Card>
    
    </>
  );
}
