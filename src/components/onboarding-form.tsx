'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { HealthDataForm } from './health-data-form'
import { UserProfileEdit } from './UserProfileEdit'
import { ImportFile } from './import-file'

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
          <div>
            {step === 1 && (
              <UserProfileEdit action='edit' />
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
                      <HealthDataForm group='basic' fetchLast='false' initialData={formData}/>
                    </CardContent>
                  </Card>
                  </div>
                  <div >
<p > OR </p>
                  </div>
                  <div >
<ImportFile />
                  </div>
                  
                  
                 

                  
                
              </div>
            )}
            {step==4 && (
              <div className="py-4">
              <p className="text-sm font-semibold">Based on your information, we're creating a personalized health journey
              just for you. Let's get started on your path to wellness.</p>
              
  
              <p className="text-lg font-semibold text-center">
              <Button onClick={() => handleOnBoardingFinish }>Go to Dashboard</Button>
              </p>
              <img src="/images/all_set.png" alt="All Set" className="w-full my-auto" />
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