'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { HealthDataForm } from './health-data-form'
import { UserProfileEdit } from './UserProfileEdit'
import { ImportFile } from './import-file'
import { CircularProgressbar } from 'react-circular-progressbar'

export function OnboardingFormComponent({ handleOnBoardingFinish }: { handleOnBoardingFinish: () => void }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dateOfBirth: '2000-01-01',
    gender: 'male',
    weight: 70,
    height: 170,
    waist: 80, // Added waist circumference with default value
  })
  

  
  const updateFormData = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
    
  }

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1)
  }

  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    setStep(step + 1)
    // setShowBMIDialog(true)
    //console.log('Form submitted:', formData, 'BMI:', calculatedBMI)
    // Here you would typically send the data to your backend
  }

  return (
    <div className="flex items-center justify-center  overflow-auto h-screen" style={{ height: '80vh'  }}>
      <Card className="w-full " >
        <CardHeader>
          <CardTitle>Metabolic-Point Onboarding</CardTitle>
          <CardDescription>Step {step} of 4</CardDescription>
        </CardHeader>
        <CardContent>
        <div className={`grid ${step < 3 ? 'grid-cols-2' : 'grid-cols-1'} gap-6 pb-6`} >
          <div className="">
            {step === 1 && (
              <UserProfileEdit 
                action='edit' 
                onSuccess={(dateOfBirth, sex) => {
                  setFormData(prev => ({ 
                    ...prev, 
                    dateOfBirth: dateOfBirth,
                    gender: sex 
                  }));
                  setStep(step + 1);
                }} 
              />
            )}

            

            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Slider
                    id="weight"
                    min={30}
                    max={200}
                    step={1}
                    value={[formData.weight]}
                    onValueChange={(value) => updateFormData('weight', value[0])}
                  />
                  <div className="text-center">{formData.weight} kg</div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Slider
                    id="height"
                    min={100}
                    max={250}
                    step={1}
                    value={[formData.height]}
                    onValueChange={(value) => updateFormData('height', value[0])}
                  />
                  <div className="text-center">{formData.height} cm</div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waist">Waist Circumference (cm)</Label>
                  <Slider
                    id="waist"
                    min={50}
                    max={200}
                    step={1}
                    value={[formData.waist]}
                    onValueChange={(value) => updateFormData('waist', value[0])}
                  />
                  <div className="text-center">{formData.waist} cm</div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex items-center gap-6"  >
                  <div>
<Card>
                    <CardHeader>
                      <CardTitle>Upload Health Document</CardTitle>
                      <CardDescription>Upload your health-related documents securely</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <HealthDataForm group='basic' fetchLast='false' initialData={formData} onSuccess={ () => {setStep(step + 1)}} />
                    </CardContent>
                  </Card>
                  </div>
                  <div >
<p > OR </p>
                  </div>
                  <div >
<ImportFile onSuccess={ () => {setStep(step + 1)}} />
                  </div>
                  
                  
                 

                  
                
              </div>
            )}
            {step==4 && (
              <div className="py-4">
              <p className="text-sm font-semibold">Based on your information, we&apos;re creating a personalized health journey
              just for you. Let&apos;s get started on your path to wellness.</p>
              
  
              <p className="text-lg font-semibold text-center">
              <Button onClick={ handleOnBoardingFinish }>Go to Dashboard</Button>
              </p>
              <img src="/images/all_set.png" alt="All Set" className="w-full my-auto" />
            </div>
            )}
            </div>

{/* Right pane as image */}
{step < 3 && (
            <img src="/images/onboarding.png" alt="All Set" className="w-full my-auto" />
)}

{/* Right pane as components */}
{step < 3 && false && (
    <div className="bg-primary min-h-100% flex flex-col items-top justify-center p-6 space-y-6">
      
      {/* Main Content Container */}
      <div className="relative w-[400px] max-w-3xl bg-white py-6 px-12 rounded-2xl shadow-lg">
        
        {/* Waist Circumference Card */}
        <div className="absolute w-[150px] top-[-20px] left-[-20px] bg-white p-4 rounded-lg shadow-md">
          <p className="text-sm text-gray-600">Waist Circumference</p>
          <p className="text-2xl font-bold">88 cm</p>
          <p className="text-xs text-gray-500">Recommended: &lt;150 mg/dL</p>
          <span className="text-green-500 text-sm font-semibold">Healthy Range</span>
        </div>

        {/* Progress Indicator */}
        <div className="flex flex-col items-center justify-center py-1">
        <div className='w-[150px] h-[150px] pt-8'>
        <CircularProgressbar 
            
            value={66} 
            text={`66%`}
            circleRatio={0.5}
            styles={{
            path: { 
                stroke: `rgb(${255 - (66 * 2.55)}, ${66 * 2.55}, 0)` ,
                transform: 'rotate(-0.25turn)',
                transformOrigin: 'center center',
            },
            trail: {
              
              // Rotate the trail
              transform: 'rotate(-0.25turn)',
              transformOrigin: 'center center',
            },
            text: { 
                fill: `rgb(${255 - (66 * 2.55)}, ${66 * 2.55}, 0)`,
                fontSize: '16px' 
            }
            }}
        />
        
        </div>
        <p className="text-sm text-gray-600 mt-2">
            Your result is much better compared to last month!
          </p>
          
        </div>
        
        {/* Exercise Suggestion Card */}
        <Card className="absolute w-[150px] bottom-[-40px] right-[-30px] bg-white p-4 rounded-lg shadow-md ">
          <p className="text-xs font-bold text-blue-500">Exercise</p>
          <p className="text-sm font-semibold">10 minutes of stretching in the morning - start now!</p>
          <p className="text-xs text-gray-500 mt-1">
            Lorem ipsum dolor sit amet consectetur...
          </p>
          <p className="text-xs text-gray-500 mt-2">🕒 3 min.</p>
        </Card>
      </div>

      {/* Bottom Text */}
      <div className="text-center text-white pt-8">
        <h2 className="text-xl font-bold">Lorem ipsum dolor</h2>
        <p className="text-sm max-w-md">
          Lorem ipsum dolor sit amet consectetur. Fringilla pellentesque sed at neque donec est
          dictumst. Aenean mauris vel purus odio.
        </p>
      </div>
    </div>
)}


          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          
          {step == 1 &&  (
            <Button onClick={handleNext} className="ml-auto">
            Next
          </Button>
          )}
          {step == 2 &&  (
            <>
            <Button variant="outline" onClick={handlePrevious}>
              Previous
            </Button>
            <Button onClick={handleNext} className="ml-auto">
            Next
          </Button>
          </>
          )}
          {step == 3 && (
            <>
            <Button variant="outline" onClick={handlePrevious}>
              Previous
            </Button>
            <Button onClick={handleSubmit} className="ml-auto">
            Finish
          </Button>
          </>
          )}
          {step == 4 && (
            <Button variant="outline" onClick={ handleOnBoardingFinish }>
              Close
            </Button>
          )}
        </CardFooter>
      </Card>

      
    </div>
  )
}