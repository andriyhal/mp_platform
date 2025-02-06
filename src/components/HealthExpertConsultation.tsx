import React from "react";
import { User } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from 'next/image';

const data = [
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

export default function HealthExpertConsultation() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center justify-between ">
              Consult with a Health Expert
              <a href="#" className="text-primary font-semibold hover:underline">
                View All
              </a>
            </div>
          </CardTitle>
          <CardDescription>Find the right expert for your needs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.map((item, index) => (
              <div
                key={index}
                className="p-4 bg-gray-100 rounded-lg shadow hover:shadow-md hover:bg-gray-200"
              >
                {item.image !== '' ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    
                    width={100}
                    height={100}
                  />
                ) : (
                  <div className="rounded-lg bg-gray-300" style={{ height: '100px' }}>
                    <User className="h-full w-full rounded-lg mb-4" />
                  </div>
                )}
                <div className="text-center">
                  <h2 className="text-sm font-semibold text-gray-800">
                    {item.name}
                  </h2>
                  <p className="text-sm text-gray-600">{item.specialization}</p>
                  <span className={`inline-block mt-2 px-3 py-1 text-xs font-small rounded-full ${item.availability === 'Available' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
                    {item.availability}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm font-bold text-gray-800">
                    {item.price}
                  </span>
                  <button className={`px-2 py-2  text-white text-xs bg-primary font-semibold rounded-lg hover:bg-primary-500 ${item.availability === 'Available' ? '' : 'opacity-50'}`} >
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
