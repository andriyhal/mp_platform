import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
 
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from 'next/image'

const data = [
    {
      title: "Omega-3 Supplements",
      description: "Supports healthy cholesterol levels.",
      price: "$25",
      image: "/images/demo_product.png",
      buttonText: "Buy",
    },
    {
      title: "Omega-3 Supplements",
      description: "Supports healthy cholesterol levels.",
      price: "$25",
      image: "/images/demo_product.png",
      buttonText: "Buy",
    },
    {
      title: "Omega-3 Supplements",
      description: "Supports healthy cholesterol levels.",
      price: "$25",
      image: "/images/demo_product.png",
      buttonText: "Buy",
    },
  ];

export default function ProductRecommendations() {
  return (
 <>
    <Card>
    <CardHeader>
      <CardTitle>
        <div className="flex items-center justify-between ">
        Recommended Products for You 
        <a href="#" className="text-primary font-semibold hover:underline">
            View All
          </a> 
          </div>
          </CardTitle>
      <CardDescription>See our recommendations</CardDescription>
    </CardHeader>
    <CardContent>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item, index) => (
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
              <p className="text-sm text-gray-600 mb-4">{item.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-800">{item.price}</span>
                <button className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-500">
                  {item.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
    </CardContent>
  </Card>
    
    </>
  );
}
