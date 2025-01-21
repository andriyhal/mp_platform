'use client'

import * as React from 'react'
import { User, BarChart2, FileUp, Menu, Clipboard , Medal, Mail, FileText, Lock , ChartLine } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
import Image from 'next/image'
import { CurrentStats } from './current-stats'
import { ImportFile } from './import-file'
import { UserDataFiles } from './user-data-files'

export function DashboardPage() {
  const router = useRouter()
  const [activeView, setActiveView] = React.useState('onboarding')

  const [showDialog, setShowDialog] = React.useState(false)  //shows upload dialog
  const [showOnboardingDialog, setShowOnboardingDialog] = React.useState(false)
  

  const menuItems = [
    { id: 'profile', label: 'View Profile', icon: User },
    { id: 'healthData', label: 'Health Data', icon: BarChart2 },
    { id: 'uploadFile', label: 'Upload File', icon: FileUp },
    // { id: 'onboarding', label: 'Onboarding', icon: Clipboard },
    { id: 'healthScore', label: 'Health Score', icon: Medal },
    { id: 'currentStats', label: 'Current Health Data', icon: ChartLine  },
    { id: 'notifications', label: 'Notifications', icon: Mail },
    { id: 'security', label: 'Password and Security', icon: Lock },
    { id: 'documents', label: 'My Documents', icon: FileText },
  ]

  const handleOnBoardingFinish = () => {
    setShowOnboardingDialog(false)
  }

  const renderContent = () => {
    switch (activeView) {
      case 'profile':
        return <ProfileView />
      case 'healthData':
        return <HealthDataView />
      case 'healthScore':
        return <HealthScoreView />
      case 'currentStats':
        return <CurrentStats />
      case 'uploadFile':
        return <FileUploadView />
      case 'onboarding':
        return (
          <Dialog open={showOnboardingDialog} onOpenChange={setShowOnboardingDialog}>
          <DialogContent className="w-3/4 max-w-6xl" >
            <DialogHeader>
              <DialogTitle>Onboarding</DialogTitle>
              <DialogDescription>Enter some health data to get started</DialogDescription>
            </DialogHeader>
            <OnboardingFormComponent handleOnBoardingFinish={handleOnBoardingFinish} />
          </DialogContent>
        </Dialog>
        
      )

      case 'documents':
        return (
          <Card>
          <CardHeader>
            <CardTitle>Uploaded Files</CardTitle>
            <CardDescription>See your health files</CardDescription>
          </CardHeader>
          <CardContent>
            <UserDataFiles UserID={localStorage.getItem('userEmail') || 'User'} />
          </CardContent>
        </Card>
        )
      default:
        return <FileUploadView />
    }
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-100">
        <Sidebar>
          <SidebarHeader>
            <div className="p-4 flex items-center gap-2">
              <Image
                src="/images/logo.svg"
                alt="Metabolic-Point Logo"
                width={24}
                height={24}
              />
              <h2 className="text-md font-bold">METABOLIC-POINT</h2>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => setActiveView(item.id)} 
                    isActive={activeView === item.id}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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

            <div className="grid grid-cols-1 gap-6 pb-6">
            <Card>
                <CardHeader>
                  <CardTitle>Your Current Health Score</CardTitle>
                  <CardDescription>A snapshot of your overall wellness, updated in real-time. The higher the score, the closer you are to optimal health!</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Button className="p-3" disabled>Connect Device</Button>
                    <Button className="p-3" onClick={() => setShowDialog(true)}>Import PDF</Button>
                    <Button className="p-3">Export PDF</Button>
                    <Button className="p-3" onClick={() => setShowOnboardingDialog(true)}>Start Onboarding</Button>
                  </div>
                </CardContent>
              </Card>
              <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="w-full">
                  <DialogHeader>
                    <DialogTitle>Upload Health Document</DialogTitle>
                    <DialogDescription>Upload your health-related documents securely</DialogDescription>
                  </DialogHeader>
                   <FileUploadView />
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid grid-cols-2 gap-6">
              
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
                  <CardTitle>Your Health Data</CardTitle>
                  <CardDescription>Keep your health metrics current</CardDescription>
                </CardHeader>
                <CardContent>
                  <CurrentStats />
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

              {/* Sidebar Content */}
              {renderContent()} 

              {/* <Card>
                <CardHeader>
                  <CardTitle>Health Data History</CardTitle>
                  <CardDescription>See your health history</CardDescription>
                </CardHeader>
                <CardContent>
                  <HealthDataChart />
                </CardContent>
              </Card> */}


              
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

function HealthDataView() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Score Calculator</CardTitle>
        <CardDescription>Calculate your health score based on various factors</CardDescription>
      </CardHeader>
      <CardContent>
        <HealthDataForm group='all' fetchLast='true' initialData={{name: '', email: '', dateOfBirth: '', gender: '', weight: 0, height: 0, waist: 0}}/>

        
      </CardContent>
      <CardFooter>
        <Button>Calculate Score</Button>
        
      </CardFooter>
    </Card>
  )
}

function HealthScoreView() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Health Score</CardTitle>
        <CardDescription>
          Current health assessment for {localStorage.getItem('userEmail') || 'User'}

          
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* <HealthScore /> */}
        <CurrentStats />

        
      </CardContent>
      <CardFooter>
        
        
      </CardFooter>
    </Card>
  )
}

function FileUploadView() {
  return (
    <ImportFile />
  )
}

