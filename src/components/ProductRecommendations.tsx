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

export default function ProductRecommendations(props: { filter: string }) {

  const [showAll, setShowAll] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

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

        let userId = localStorage.getItem('userEmail') || 'test'

        if (props.filter != 'personal') {
          userId = props.filter
        }

        const token = localStorage.getItem('token')
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT}/recommendation`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (!response.ok) {
          throw new Error('Failed to fetch recommendations')
        }

        const jsonObj = await response.json()
        console.log('New recommendations Data:', jsonObj)

        // Transform the new API response format to match component expectations
        const transformedData: ProductItem[] = []
        if (jsonObj.grouped) {
          Object.keys(jsonObj.grouped).forEach(category => {
            jsonObj.grouped[category].forEach((product: any) => {
              transformedData.push({
                title: product.name,
                description: product.description,
                price: `$${product.price}`,
                image: product.image_url,
                buttonText: "Buy",
              })
            })
          })
        }

        setData(transformedData)
        setIsLoading(false)

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
      {isLoading ? <p>Loading...</p> : data.length === 0 ? (
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
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
              {showAll ? data.map((item, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-150 border border-gray-300 rounded-lg shadow hover:shadow-md hover:bg-gray-200"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={350} height={24}
                    className="mx-auto"
                  />
                  <h2 className="text-sm font-semibold text-black mt-[5px] mb-2 truncate">
                    {item.title}
                  </h2>
                  <p className="text-xs text-gray-600 mb-4 h-[32px] leading-tight line-clamp-2 overflow-hidden">{item.description}</p>
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
                  className="p-4 bg-gray-150 border border-gray-300 rounded-lg shadow hover:shadow-md hover:bg-gray-200"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={350} height={24}
                    className="mx-auto"
                  />
                  <h2 className="text-sm font-semibold text-black mt-[5px] mb-2 truncate">
                    {item.title}
                  </h2>
                  <p className="text-xs text-gray-600 mb-4 h-[32px] leading-tight line-clamp-2 overflow-hidden">{item.description}</p>
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
      )}
    </>
  );
}
