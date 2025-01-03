'use client'

import * as React from 'react'
import { User, BarChart2, FileUp, Menu, Clipboard } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
} from "@/components/ui/sidebar"
import { OnboardingFormComponent } from './onboarding-form'
import { HealthDataForm } from './health-data-form'
import { HealthDataChart } from './health-data-chart'
import { UserProfileEdit } from './UserProfileEdit'
import 'react-circular-progressbar/dist/styles.css'
import { HealthScore } from './health-score'

export function DashboardPage() {
  const router = useRouter()
  const [activeView, setActiveView] = React.useState('uploadFile')

  const renderContent = () => {
    switch (activeView) {
      case 'profile':
        return <ProfileView />
      case 'healthScore':
        return <HealthScoreView />
      case 'uploadFile':
        return <FileUploadView />
      case 'onboarding':
        return <OnboardingView />
      default:
        return <FileUploadView />
    }
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-100">
        <Sidebar>
          <SidebarHeader>
            <div className="p-4">
              <h2 className="text-xl font-bold">HealthTrack</h2>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveView('profile')} isActive={activeView === 'profile'}>
                  <User className="mr-2 h-4 w-4" />
                  <span>View Profile</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveView('healthScore')} isActive={activeView === 'healthScore'}>
                  <BarChart2 className="mr-2 h-4 w-4" />
                  <span>Health Score</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveView('uploadFile')} isActive={activeView === 'uploadFile'}>
                  <FileUp className="mr-2 h-4 w-4" />
                  <span>Upload File</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveView('onboarding')} isActive={activeView === 'onboarding'}>
                  <Clipboard className="mr-2 h-4 w-4" />
                  <span>Onboarding</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <div className="p-4">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => {
                  localStorage.removeItem('email');
                  router.push('/');
                }}
              >
                Log Out
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 overflow-auto">
          <header className="bg-white shadow">
            <div className="flex items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <SidebarTrigger>
                <Button variant="outline" size="icon" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Sidebar</span>
                </Button>
              </SidebarTrigger>
            </div>
          </header>
          <main className="p-6">
            <div className="grid grid-cols-3 gap-6">
              {/* Sidebar Content */}
              {renderContent()} 
              {/* Top Left: Health Score Meter */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Health Score</CardTitle>
                  <CardDescription>
                    Current health assessment for {localStorage.getItem('userEmail') || 'User'}

                    
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center p-6">
                  <div >
                    <div>
                      <HealthScore />
                    </div>
                    
                    {/* <div style={{ padding: '20px 0px' }}>
                    <Card>
                          <CardHeader>
                            <CardTitle>Welcome to HealthTrack</CardTitle>
                            <CardDescription>Complete your onboarding to get started</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <form>
                              <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                  <Label htmlFor="goals">Health Goals</Label>
                                  <Input id="goals" placeholder="What are your health goals?" />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                  <Label htmlFor="conditions">Medical Conditions</Label>
                                  <Input id="conditions" placeholder="List any medical conditions" />
                                </div>
                              </div>
                            </form>
                          </CardContent>
                          <CardFooter>
                            <Button>Complete Onboarding</Button>
                          </CardFooter>
                          
                        </Card>
                        </div> */}
                  </div>
                </CardContent>
              </Card>

              {/* Top Right: Update Health Data */}
              <Card>
                <CardHeader>
                  <CardTitle>Update Health Data</CardTitle>
                  <CardDescription>Keep your health metrics current</CardDescription>
                </CardHeader>
                <CardContent>
                  <HealthDataForm />
                </CardContent>
              </Card>

              {/* Bottom Left: Profile Edit */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Manage your personal details</CardDescription>
                </CardHeader>
                <CardContent>
                  <UserProfileEdit action="edit" />
                </CardContent>
              </Card>

              {/* Bottom Right: Recommendations */}
              <Card>
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

              <Card>
                <CardHeader>
                  <CardTitle>Health Data History</CardTitle>
                  <CardDescription>See your health history</CardDescription>
                </CardHeader>
                <CardContent>
                  <HealthDataChart />
                </CardContent>
              </Card>
              
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

function ProfileView() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
        <CardDescription>View and edit your personal information</CardDescription>
      </CardHeader>
      <CardContent>
        <UserProfileEdit action="edit" />
      </CardContent>
      
    </Card>
  )
}

function HealthScoreView() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Score Calculator</CardTitle>
        <CardDescription>Calculate your health score based on various factors</CardDescription>
      </CardHeader>
      <CardContent>
        <HealthDataForm />

        
      </CardContent>
      <CardFooter>
        <Button>Calculate Score</Button>
        
      </CardFooter>
    </Card>
  )
}

function FileUploadView() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Health Document</CardTitle>
        <CardDescription>Upload your health-related documents securely</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center w-full">
          <Label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FileUp className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">PDF, DOC, DOCX (MAX. 10MB)</p>
            </div>
            <Input id="dropzone-file" type="file" className="hidden" />
          </Label>
        </div>
      </CardContent>
      <CardFooter>
        <Button>Upload File</Button>
      </CardFooter>
    </Card>
  )
}

function OnboardingView() {
  return (
    
    <OnboardingFormComponent />
    
  )
}