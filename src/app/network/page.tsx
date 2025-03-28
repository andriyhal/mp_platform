'use client'


import Clarity from '@microsoft/clarity';
import ProductRecommendations from '@/components/ProductRecommendations';
import {

    SidebarProvider,

} from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Layout from '@/components/app-layout';

import HealthExpertConsultation from '@/components/HealthExpertConsultation';
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
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HealthScore } from '@/components/health-score';


export default function Home() {
    const projectId = "q64g9fnhvi"

    Clarity.init(projectId);

    return (

        <SidebarProvider>

            <Layout>
                <div className="grid grid-cols-12 gap-6 p-6">
                    <div className='col-span-6'>
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
                                        <div className="grid grid-cols-2 items-center">
                                            <div className='col-span-1'><HealthScore /></div>
                                            <div className='col-span-1'><p>your results are much better than last month</p></div>

                                        </div>

                                    </div>


                                </div>
                            </CardContent>
                        </Card>
                        <div className="pt-6">

                            <HealthExpertConsultation />
                        </div>

                    </div>

                    <div className="col-span-6">
                        <div>
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




                        <div className="pt-6">
                            <Card className="p-4 w-full ">
                                <div className="flex justify-between items-center pb-2 border-b">
                                    <h2 className="text-lg font-semibold">Resources</h2>
                                    <a href="#" className="text-blue-500 text-sm">View All</a>
                                </div>
                                <Tabs defaultValue="recipes" className="mt-2">
                                    <TabsList className="gap-4 border-b">
                                        <TabsTrigger value="recipes" className="pb-2">Recipes</TabsTrigger>
                                        <TabsTrigger value="referrals" className="pb-2">Referrals</TabsTrigger>
                                    </TabsList>
                                    <CardContent className="mt-4">
                                        <Card className="p-4 border rounded-lg shadow-sm">
                                            <div className="flex items-center gap-2">
                                                <FileText className="text-blue-500" size={20} />
                                                <h3 className="text-md font-semibold">
                                                    Ischemic Heart Disease (Stable Angina)
                                                </h3>
                                            </div>
                                            <p className="text-sm text-gray-500">Mount Sinai Hospital &middot; Cardiology Department</p>
                                            <div className="flex justify-between text-sm">
                                                <p><span className="font-medium">Doctor:</span> Dr. Emily Johnson</p>
                                                <p><span className="font-medium">Med. Quantity:</span> 3 types</p>
                                            </div>
                                            <p className="text-sm"><span className="font-medium">Date:</span> 11/04/2024</p>
                                            <Button variant="outline" className="mt-2 flex items-center gap-2">
                                                <FileText size={16} /> Export PDF
                                            </Button>
                                        </Card>
                                    </CardContent>
                                </Tabs>
                            </Card>
                        </div>
                    </div>
                </div>


            </Layout>
        </SidebarProvider >


    );
}