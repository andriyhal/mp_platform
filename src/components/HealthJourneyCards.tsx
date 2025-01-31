import React from "react";
import { User, TargetIcon ,HomeIcon, PlayIcon, HeartPulseIcon , Code2Icon} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const data = [
  {
    title: "Watch a Video: Managing High Cholesterol",
    description: "Learn how diet and lifestyle changes can help control LDL cholesterol.",
    linkText: "Go",
    icon: PlayIcon ,
    iconColor: "orange"
  },
  {
    title: "Complete Daily Step Goal: 10,000 Steps",
    description: "Staying active helps regulate blood pressure and cholesterol levels.",
    linkText: "Go",
    icon: TargetIcon ,
    iconColor: "purple"
  },
  {
    title: "Watch a Video: Managing High Cholesterol",
    description: "Learn how diet and lifestyle changes can help control LDL cholesterol.",
    linkText: "Go",
    icon: PlayIcon ,
    iconColor: "orange"
  },
  {
    title: "Complete Daily Step Goal: 10,000 Steps",
    description: "Staying active helps regulate blood pressure and cholesterol levels.",
    linkText: "Go",
    icon: TargetIcon ,
    iconColor: "purple"
  },
];

export default function HealthJourneyCards() {
  return (
 <>
    <Card>
    <CardHeader>
      <CardTitle>
        <div className="flex items-center justify-between ">
        Your Personalized Health Journey 
        <a href="#" className="text-primary font-semibold hover:underline">
            View All
          </a> 
          </div>
          </CardTitle>
      <CardDescription>See our recommendations</CardDescription>
    </CardHeader>
    <CardContent>
    <div className="space-y-4">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <div className="flex items-start space-x-4">
                <div className={`flex items-center justify-center pl-2 w-10 h-10 bg-${item.iconColor}-100 text-${item.iconColor}-500 rounded-lg`}>
                  <item.icon className="mr-2 h-4 w-4" />
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
