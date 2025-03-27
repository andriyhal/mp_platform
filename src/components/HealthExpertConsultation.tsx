import React from "react";
import { useState, useEffect } from 'react'
import { User } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from 'next/image';

const defaultData = [
  {
    name: "Dr. Emily Johnson",
    specialization: "Cardiologist",
    availability: "Available",
    price: "$100",
    image: "/images/demo_doctor.png",
    buttonText: "Book",
  },
  {
    name: "Dr. Emily Johnson",
    specialization: "Cardiologist",
    availability: "Unavailable",
    price: "$100",
    image: "",
    buttonText: "Book",
  },
  {
    name: "Dr. Emily Johnson",
    specialization: "Cardiologist",
    availability: "Available",
    price: "$100",
    image: "/images/demo_doctor.png",
    buttonText: "Book",
  },
  {
    name: "Dr. Emily Johnson",
    specialization: "Cardiologist",
    availability: "Available",
    price: "$100",
    image: "/images/demo_doctor.png",
    buttonText: "Book",
  },
];

export default function HealthExpertConsultation({ variant = "default", experts = defaultData }) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      {isLoading ? <p>Loading...</p> : (
        <Card className={variant === "compact" ? "p-4" : "p-6"}>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center justify-between">
                Consult with a Health Expert
                <a href="#" className="text-primary font-semibold hover:underline">
                  View All
                </a>
              </div>
            </CardTitle>
            <CardDescription>Find the right expert for your needs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={
              variant === "row"
                ? "flex flex-col space-y-4"
                : `grid ${variant === "compact" ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"} gap-6`
            }>
              {experts.map((item, index) => (
                <div key={index} className={variant === "row" ? "flex items-center p-4 bg-gray-100 rounded-lg shadow hover:shadow-md hover:bg-gray-200" : "p-4 bg-gray-100 rounded-lg shadow hover:shadow-md hover:bg-gray-200 max-w-[250px]"}>
                  {item.image !== '' ? (
                    <Image src={item.image} alt={item.name} className="w-20 h-20 rounded-full" width={80} height={80} />
                  ) : (
                    <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gray-300">
                      <User className="h-12 w-12 text-gray-500" />
                    </div>
                  )}
                  <div className={variant === "row" ? "flex space-x-4"  : "flex-1 pb-2"   }>
                    <h2 className="text-sm font-semibold text-gray-800">{item.name}</h2>
                    <p className="text-sm text-gray-600">{item.specialization}</p>
                    <span className={`inline-block mt-2 px-1 py-1 text-xs font-small rounded-full ${item.availability === 'Available' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
                      {item.availability}
                    </span>
                  </div>
                  <button className={`ml-auto px-4 py-2 text-white text-xs bg-primary font-semibold rounded-lg hover:bg-primary-500 ${item.availability === 'Available' ? '' : 'opacity-50'}`}>
                    {item.buttonText}
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}