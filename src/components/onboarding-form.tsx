'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function OnboardingFormComponent() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
    weight: 70,
    height: 170,
    waist: 80, // Added waist circumference with default value
  })
  const [showBMIDialog, setShowBMIDialog] = useState(false)
  const [bmi, setBMI] = useState<number | null>(null)

  const updateFormData = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1)
  }

  const calculateBMI = (weight: number, height: number): number => {
    const heightInMeters = height / 100
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(1))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const calculatedBMI = calculateBMI(formData.weight, formData.height)
    setBMI(calculatedBMI)
    setShowBMIDialog(true)
    console.log('Form submitted:', formData, 'BMI:', calculatedBMI)
    // Here you would typically send the data to your backend
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Health SaaS Onboarding</CardTitle>
          <CardDescription>Step {step} of 3</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => updateFormData('age', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select onValueChange={(value) => updateFormData('gender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {step === 3 && (
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
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          {step > 1 && (
            <Button variant="outline" onClick={handlePrevious}>
              Previous
            </Button>
          )}
          {step < 3 ? (
            <Button onClick={handleNext} className="ml-auto">
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="ml-auto">
              Submit
            </Button>
          )}
        </CardFooter>
      </Card>

      <Dialog open={showBMIDialog} onOpenChange={setShowBMIDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your BMI Result</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-lg font-semibold text-center">Your BMI is: {bmi}</p>
            <p className="text-sm text-gray-500 mt-2 text-center">
              BMI Categories:<br />
              Underweight: &lt;18.5<br />
              Normal weight: 18.5-24.9<br />
              Overweight: 25-29.9<br />
              Obesity: ≥30
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}