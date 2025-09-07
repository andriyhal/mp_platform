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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast"

interface ExpertItem {
  name: string;
  specialization: string;
  availability: string;
  price: string;
  image: string;
  buttonText: string;
  booking_url?: string;
}

const defaultData: ExpertItem[] = [
  {
    name: "Dr. Emily Johnson",
    specialization: "Cardiologist",
    availability: "Available",
    price: "$100",
    image: "/images/demo_doctor.png",
    buttonText: "Consultation",
    booking_url: "#",
  },
];

export default function HealthExpertConsultation({ variant = "default", experts = defaultData }) {
  const [isLoading, setIsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [data, setData] = useState<ExpertItem[]>(defaultData);
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<ExpertItem | null>(null);
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    const fetchProviderNetwork = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT}/provider-network`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (!response.ok) {
          throw new Error('Failed to fetch provider network')
        }

        const jsonObj = await response.json()
        console.log('Provider network Data:', jsonObj)

        // Transform the new API response format to match component expectations
        const transformedData: ExpertItem[] = []
        if (jsonObj.providers) {
          jsonObj.providers.forEach((provider: any) => {
            transformedData.push({
              name: provider.name,
              specialization: provider.expertise_type,
              availability: "Available for Consultation", // Updated text
              price: provider.price ? `$${provider.price}` : "$100",
              image: provider.image_url || "",
              buttonText: "Consultation",
              booking_url: provider.booking_url || "#",
            })
          })
        }

        setData(transformedData)
        setIsLoading(false)

      } catch (error) {
        console.error('Error fetching provider network:', error)
        toast({
          title: "Error",
          description: "Failed to fetch provider network",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchProviderNetwork()
  }, [toast])

  return (
    <>
      {isLoading ? <p>Loading...</p> : data.length === 0 ? (
        <Card className={variant === "compact" ? "p-2" : "p-4"}>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center justify-between">
                Consult with a Health Expert
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
        <Card className={variant === "compact" ? "p-2" : "p-4"}>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center justify-between">
                Consult with a Health Expert
                <a href="#" onClick={() => setShowAll(!showAll)} className="text-primary font-semibold hover:underline">
                  {showAll ? 'Show Less' : 'View All'}
                </a>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(showAll ? data : data.slice(0, 3)).map((item, index) => (
                <div key={index} className="flex flex-col items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow min-w-[195px]">
                  <div className="mb-4">
                    {item.image !== '' ? (
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        className="w-16 h-16 rounded-full object-cover mx-auto" 
                        width={64} 
                        height={64} 
                      />
                    ) : (
                      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-200 mx-auto">
                        <User className="h-8 w-8 text-gray-500" />
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center mb-4">
                    <span className="inline-block px-2 py-0.5 text-xs font-medium text-green-700 bg-green-100 rounded-full mb-2 whitespace-nowrap">
                      Available for Consultation
                    </span>
                    <h3 className="text-base font-semibold text-gray-900 mb-0">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{item.specialization}</p>
                  </div>
                  
                  <div className="flex items-center justify-between w-full">
                    <div className="flex-shrink-0">
                      <span className="text-base font-bold text-gray-900">{item.price}</span>
                    </div>
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => {
                          setSelectedExpert(item);
                          setConsent(true);
                          setDialogOpen(true);
                        }}
                        className="px-4 py-2 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: 'rgb(0, 168, 224)' }}
                      >
                        Consultation
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[575px]">
          <DialogHeader>
            <DialogTitle>Schedule your consultation</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            <Image
              src="/images/calendar-image.png"
              alt="Calendar"
              width={575}
              height={300}
              className="rounded-lg w-full"
            />
          </div>
          <DialogFooter className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="consent"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="consent" className="text-xs text-gray-500">
                I consent the processing of my personal and medical data
              </label>
            </div>
            <div className="text-sm">
              <span className="font-bold text-black">{selectedExpert?.price}</span>
              <span className="text-xs text-gray-500"> per session</span>
            </div>
            <button
              onClick={() => {
                if (consent && selectedExpert?.booking_url) {
                  window.open(selectedExpert.booking_url, '_blank');
                  setDialogOpen(false);
                }
              }}
              disabled={!consent}
              className="px-4 py-2 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{ backgroundColor: 'rgb(0, 168, 224)' }}
            >
              Schedule
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}