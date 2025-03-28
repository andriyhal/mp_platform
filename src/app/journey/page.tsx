'use client'


import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { HealthScore } from '@/components/health-score';

import HealthJourneyCards from '@/components/HealthJourneyCards';
import {
  User,
  BarChart2,
  FileUp,
  Menu,
  Medal,
  Mail,
  FileText,
  Lock,
  ChartLine,
  HomeIcon,
  ShoppingCartIcon,
  HeartPulseIcon,
  Code2Icon,
} from "lucide-react";

import Clarity from '@microsoft/clarity';
import ProductRecommendations from '@/components/ProductRecommendations';
import {
  Sidebar,
  SidebarContent,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import Layout from '@/components/app-layout';


export default function Home() {
  const projectId = "q64g9fnhvi"

  Clarity.init(projectId);

  return (

    <SidebarProvider>

      <Layout>
        <div className="grid grid-cols-12 gap-6 p-6">
          <div className='col-span-8'>
            <Card>
              <CardHeader>
                <CardTitle>Central Health Score</CardTitle>
                <CardDescription>
                  {/* Current health assessment for {user ? user.name : "User"} */}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center p-6">
                <div>
                  <div>
                    <div className="grid grid-cols-3 items-center">
                      <div className='col-span-1'><HealthScore /></div>
                      <div className='col-span-2'><p>your results are much better than last month</p></div>

                    </div>

                  </div>


                </div>
              </CardContent>
            </Card>
            <div className="pt-6"> <ProductRecommendations filter='all' /> </div>

          </div>
          <div className="col-span-4">
            <div><HealthJourneyCards filter='all' /></div>

            <div className="pt-6">
              <Card className=''>
                <CardHeader>
                  <CardTitle>Health Recommendations</CardTitle>
                  <CardDescription>Personalized health insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="bg-green-100 p-2 rounded-full">
                        <BarChart2 className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Increase Physical Activity</h4>
                        <p className="text-sm text-gray-500">Try to achieve 8,000 steps daily</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Sleep Schedule</h4>
                        <p className="text-sm text-gray-500">Maintain 7-8 hours of sleep</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>


        </div>

      </Layout>
    </SidebarProvider >


  );
}