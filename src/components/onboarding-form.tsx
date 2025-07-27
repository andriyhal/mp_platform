'use client'

import { useState  } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { HealthDataForm } from './health-data-form'
import { UserProfileEdit } from './UserProfileEdit'
import { ImportFile } from './import-file'
import { CircularProgressbar } from 'react-circular-progressbar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
 
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from "@/hooks/use-toast"
import Container from './Container'

const formSchema = z.object({
  UserID: z.string(),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(['male', 'female', 'other'], {
    required_error: "Please select a gender",
  }),
  height: z.number().min(50).max(300),
  weight: z.number().min(20).max(500),
  waistCircumference: z.number().min(20).max(200),
  bloodPressureSystolic: z.number().min(70).max(250),
  bloodPressureDiastolic: z.number().min(40).max(150),
  fastingBloodGlucose: z.number().min(50).max(500),
  hdlCholesterol: z.number().min(20).max(100),
  triglycerides: z.number().min(50).max(1000),
})

export function OnboardingFormComponent({ handleOnBoardingFinish }: { handleOnBoardingFinish: () => void }) {
  const [step, setStep] = useState(1)
  const [fileUploaded, setFileUploaded] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const { toast } = useToast()
  
const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    UserID: localStorage.getItem('userEmail') || 'test',
    dateOfBirth: '2000-01-01',
    gender: 'male' as const,
    height: 170,
    weight: 70,
    waistCircumference: 80,
    bloodPressureSystolic: 120,
    bloodPressureDiastolic: 80,
    fastingBloodGlucose: 100,
    hdlCholesterol: 50,
    triglycerides: 150,
  },
})
  
let fieldStyles = {
  dateOfBirth: '',
  gender: '',          
  height: '',
  weight: '',
  waistCircumference:     '',
  bloodPressureSystolic:  isComplete  ? 'white' : 'cyan',
  bloodPressureDiastolic: isComplete  ? 'white' : 'cyan',
  fastingBloodGlucose:    isComplete  ? 'white' : 'cyan',
  hdlCholesterol:         isComplete  ? 'white' : 'cyan',
  triglycerides:          isComplete  ? 'white' : 'cyan',
  vitaminD2:              isComplete  ? 'white' : 'cyan',
  vitaminD3:              isComplete  ? 'white' : 'cyan',
}

function calculateAge(dateOfBirth : string) {
  const birthDate = new Date(dateOfBirth); // Parse the date string into a Date object
  const today = new Date(); // Get the current date
  
  let age = today.getFullYear() - birthDate.getFullYear(); // Calculate the year difference
  const monthDifference = today.getMonth() - birthDate.getMonth();
  const dayDifference = today.getDate() - birthDate.getDate();

  // Adjust age if the birth date hasn't occurred yet this year
  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      age--;
  }

  return age;
}

const fetchEstimateHealthData = async () => {
  try {
    const userId = localStorage.getItem('userEmail') || 'test'
    const age =  calculateAge(form.getValues().dateOfBirth);
    //console.log(props)
    const token = localStorage.getItem('token')
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT}/average-health-metrics?age=${age}&sex=${form.getValues().gender}` , {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
   
    if (!response.ok) {
      throw new Error('Failed to fetch health data')
    }

    const data = await response.json()
    if (data) {
      
      form.reset({
        UserID: userId,
        dateOfBirth: form.getValues().dateOfBirth,
        gender: form.getValues().gender,
        height: Number(form.getValues().height) ?? 170,
        weight: Number(form.getValues().weight) ?? 70,
        waistCircumference: Number(form.getValues().waistCircumference) ?? 32,
        bloodPressureSystolic:  Number(data.bloodPressureSystolic ) ?? 120,
        bloodPressureDiastolic: Number(data.bloodPressureDiastolic ) ?? 80,
        fastingBloodGlucose:    Number(data.fastingBloodGlucose   ) ?? 100,
        hdlCholesterol:         Number(data.hdlCholesterol        ) ?? 50,
        triglycerides:          Number(data.triglycerides         ) ?? 150,
        // vitaminD2:              Number(data.vitaminD2             ) ?? 50,
        // vitaminD3:              Number(data.vitaminD3             ) ?? 50,

      })

    toast({
      title: "Estimation Complete",
      description: "Based on your profile, we have estimated some parameters which are highlighted in light blue.",
      variant: "default",
    })
    }
  } catch (error) {
    console.error('Error fetching health data:', error)
    toast({
      title: "Error",
      description: "Failed to fetch latest health data",
      variant: "destructive",
    })
  }
}
  
  const handleNext = async () => {
    const isValid = await form.trigger()
    if (!isValid) {
      toast({
        title: "Error",
        description: "Form is not set correctly",
        variant: "destructive",
      })
      return
    }

    if (step === 1) {
      await onFinishStep1()
      await fetchEstimateHealthData()
    }

    if (step < 3) setStep(step + 1)
  }

  const handlePrevious = () => {
    if (step > 1) {
      const currentValues = form.getValues();
      
      setStep(step - 1);
      
      form.reset(currentValues);
    }
  }

  async function onFinishStep1() {
    try {
      const values = form.getValues()
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT}/edit-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: localStorage.getItem('userEmail') || "",
          sex: values.gender,
          dateOfBirth: values.dateOfBirth,
          action: 'edit'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update user profile')
      }
    } catch (error) {
      console.error('Error updating user profile:', error)
    }
  }

  
  


  const renderStep1 = () => {
    // Watch all relevant form values for reactivity
    const { weight, height, waistCircumference, dateOfBirth, gender } = form.watch();

    return (
      <div className="grid grid-cols-2 gap-6 pb-6">
      <div className="space-y-4  items-center justify-center">
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sex</FormLabel>
              <Select 
                value={gender} // Use watched value
                onValueChange={(value) => {
                  field.onChange(value);
                  form.setValue('gender', value as 'male' | 'female' | 'other', {
                    shouldValidate: true,
                    shouldDirty: true
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth</FormLabel>
              <FormControl>
                <Input 
                  type="date" 
                  {...field}
                  value={dateOfBirth} // Use watched value instead of field.value
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    form.setValue('dateOfBirth', e.target.value, { 
                      shouldValidate: true,
                      shouldDirty: true 
                    });
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        <div className="space-y-4  items-center justify-center">
        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <div className="space-y-2">
                <FormLabel>Weight (kg)</FormLabel>
                <Slider
                  id="weight"
                  min={30}
                  max={200}
                  step={1}
                  value={[weight]}
                  onValueChange={(value) => {
                    field.onChange(value[0]);
                    form.setValue('weight', value[0], {
                      shouldValidate: true,
                      shouldDirty: true
                    });
                  }}
                />
                <div className="text-center">{weight} kg</div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="height"
          render={({ field }) => (
            <FormItem>
              <div className="space-y-2">
                <FormLabel>Height (cm)</FormLabel>
                <Slider
                  id="height"
                  min={100}
                  max={250}
                  step={1}
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                />
                <div className="text-center">{height} cm</div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="waistCircumference"
          render={({ field }) => (
            <FormItem>
              <div className="space-y-2">
                <FormLabel>Waist Circumference (cm)</FormLabel>
                <Slider
                  id="waist"
                  min={50}
                  max={200}
                  step={1}
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                />
                <div className="text-center">{waistCircumference} cm</div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      </div>
    );
  };

  async function onFinishStep2() {
    try {
      const values = form.getValues()
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT}/submit-health-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          UserID: values.UserID,
          height: values.height,
          weight: values.weight,
          waistCircumference: values.waistCircumference,
          bloodPressureSystolic: values.bloodPressureSystolic,
          bloodPressureDiastolic: values.bloodPressureDiastolic,
          fastingBloodGlucose: values.fastingBloodGlucose,
          hdlCholesterol: values.hdlCholesterol,
          triglycerides: values.triglycerides,
          vitaminD2: 0,
          vitaminD3: 0,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit health data')
      }
    } catch (error) {
      console.error('Error submitting health data:', error)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFinishStep2()

    setStep(step + 1)
  }

  return (
    <div className="flex items-center justify-center overflow-auto h-screen" style={{ height: '80vh' }}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle></CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>

        <CardContent>
        <div className={`grid ${step < 3 ? 'grid-cols-2' : 'grid-cols-1'} gap-6 pb-6`}>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(() => {})}>
              
                <div className="">

                {step < 3 && <img src="/images/logo.svg" alt="metabolic-point-logo" style={{ width: '150px' }} className="p-4" />}
          <p className="py-2">{step !=3 ? `Step ${step} of 2 ` : ''}</p>

          <h1 className="text-4xl text-bold py-2">{step === 1 && 'Onboarding'}{step === 2 && 'Your Health Information'}</h1>
          <p className="py-2">{step === 1 && 'Thank you for signing up. To get started please enter some key health data so we can start to build your health profile.'}
            {step === 2 && 'If you don’t have this information from your blood work, you can simply upload a PDF containing your details, and we’ll process it to generate your results.'}</p>
                  
                  {step === 1 && renderStep1()}
                  {step === 2 && (
                    <div className="flex items-center gap-6">
                      <div>
                        <Card>
                          <CardHeader>
                            <CardTitle>Upload Health Document</CardTitle>
                            <CardDescription>Upload your health-related documents securely</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {/* <FormField
                                control={form.control}
                                name="height"
                                render={({ field }) => (
                                  <FormItem className=''>
                                    <div className='grid grid-cols-2 items-center'>
                                    <FormLabel>Height (cm)</FormLabel>
                                    <FormControl>
                                      <Input type="number" {...field} 
                                      style={{ backgroundColor: fieldStyles.height || 'white' }}
                                      onChange={e => {
                                          field.onChange(parseFloat(e.target.value));
                                          e.target.style.backgroundColor = 'white';
                                        }} />
                                    </FormControl>
                                    </div>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="weight"
                                render={({ field }) => (
                                  <FormItem>
                                    <div className='grid grid-cols-2 items-center'>
                                    <FormLabel>Weight (kg)</FormLabel>
                                    <FormControl>
                                      <Input type="number" {...field} 
                                      style={{ backgroundColor: fieldStyles.weight || 'white' }}
                                      onChange={e => {
                                          field.onChange(parseFloat(e.target.value));
                                          e.target.style.backgroundColor = 'white';
                                        }} />
                                    </FormControl>
                                    </div>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="waistCircumference"
                                render={({ field }) => (
                                  <FormItem>
                                    <div className='grid grid-cols-2 items-center'>
                                      <FormLabel>Waist Circumference (cm)</FormLabel>
                                      <FormControl>
                                        <Input type="number" {...field}
                                        style={{ backgroundColor: fieldStyles.waistCircumference || 'white' }}
                                        onChange={e => {
                                          field.onChange(parseFloat(e.target.value));
                                          e.target.style.backgroundColor = 'white';
                                        }} />
                                      </FormControl>
                                    </div>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              /> */}
                              <FormField
                                control={form.control}
                                name="bloodPressureSystolic"
                                render={({ field }) => (
                                  <FormItem>
                                    <div className='grid grid-cols-2 items-center'>
                                      
                                      <FormLabel >Blood Pressure (Systolic) </FormLabel>
                                      
                                      <FormControl>
                                        <Input type="number" {...field} 
                                        style={{ backgroundColor: fieldStyles.bloodPressureSystolic || 'white' }}
                                        onChange={e => {
                                          field.onChange(parseFloat(e.target.value));
                                          e.target.style.backgroundColor = 'white';
                                        }} />
                                      </FormControl>
                                    </div>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="bloodPressureDiastolic"
                                render={({ field }) => (
                                  <FormItem>
                                    <div className='grid grid-cols-2 items-center'>
                                      <FormLabel>Blood Pressure (Diastolic) </FormLabel>
                                      <FormControl>
                                        <Input type="number" {...field} 
                                        style={{ backgroundColor: fieldStyles.bloodPressureDiastolic || 'white' }}
                                        onChange={e => {
                                          field.onChange(parseFloat(e.target.value));
                                          e.target.style.backgroundColor = 'white';
                                        }} />
                                      </FormControl>
                                    </div>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="fastingBloodGlucose"
                                render={({ field }) => (
                                  <FormItem>
                                    <div className='grid grid-cols-2 items-center'>
                                      <FormLabel>Fasting Blood Glucose (mg/dL)</FormLabel>
                                      <FormControl>
                                        <Input type="number" {...field} 
                                        style={{ backgroundColor: fieldStyles.fastingBloodGlucose || 'white' }}
                                        onChange={e => {
                                          field.onChange(parseFloat(e.target.value));
                                          e.target.style.backgroundColor = 'white';
                                        }} />
                                      </FormControl>
                                    </div>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="hdlCholesterol"
                                render={({ field }) => (
                                  <FormItem>
                                    <div className='grid grid-cols-2 items-center '>
                                      <FormLabel>HDL Cholesterol (mg/dL)</FormLabel>
                                      <FormControl>
                                        <Input type="number" {...field}  
                                        style={{ backgroundColor: fieldStyles.hdlCholesterol || 'white' }}
                                        onChange={e => {
                                          field.onChange(parseFloat(e.target.value));
                                          e.target.style.backgroundColor = 'white';
                                        }} />
                                      </FormControl>
                                    </div>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="triglycerides"
                                render={({ field }) => (
                                  <FormItem>
                                    <div className='grid grid-cols-2 items-center '>
                                      <FormLabel>Triglycerides (mg/dL)</FormLabel>
                                      <FormControl>
                                        <Input type="number" {...field}  
                                        style={{ backgroundColor: fieldStyles.triglycerides || 'white' }}
                                        onChange={e => {
                                          field.onChange(parseFloat(e.target.value));
                                          e.target.style.backgroundColor = 'white';
                                        }} />
                                      </FormControl>
                                    </div>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      <div>
                        <p>OR</p>
                      </div>
                      <div>
                        <ImportFile onSuccess={(ocrData) => {
                          // Set file uploaded state
                          setFileUploaded(true);
                          
                          try {
                            console.log(ocrData)
                            ocrData = JSON.parse(ocrData)
                            // Parse OCR data and map to form fields
                            const formUpdates: Partial<z.infer<typeof formSchema>> = {
                              // Keep existing basic measurements
                              height: form.getValues().height,
                              weight: form.getValues().weight,
                              waistCircumference: form.getValues().waistCircumference,
                              
                              // Map OCR data to form fields
                              // bloodPressureSystolic: form.getValues().bloodPressureSystolic, // Not in OCR data
                              // bloodPressureDiastolic: form.getValues().bloodPressureDiastolic, // Not in OCR data
                              fastingBloodGlucose: ocrData["Blood Glucose"]?.Value || form.getValues().fastingBloodGlucose,
                              hdlCholesterol: ocrData["HDL Cholesterol"]?.Value || form.getValues().hdlCholesterol,
                              triglycerides: ocrData["Triglycerides level"]?.Value || form.getValues().triglycerides,
                            };

                            // Update form values while preserving existing values if OCR data is missing
                            form.reset({
                              ...form.getValues(),
                              ...formUpdates
                            });

                            // Set complete state
                            setIsComplete(true);

                            // Show success toast with details
                            toast({
                              title: "Data Imported Successfully",
                              description: "Your lab results have been imported. Please review the values.",
                              variant: "default",
                            });

                            // Log the imported data for verification
                            console.log("Imported OCR data:", ocrData);
                            console.log("Updated form values:", formUpdates);

                          } catch (error) {
                            console.error("Error processing OCR data:", error);
                            toast({
                              title: "Error Processing Data",
                              description: "There was an error processing your lab results. Please check the values manually.",
                              variant: "destructive",
                            });
                          }
                        }} />
                      </div>
                    </div>
                  )}
                  {step === 3 && (
                    
                    <div className="py-4">
                      <img src="/images/logo.svg" alt="metabolic-point-logo" style={{ width: '150px' }} className="p-2 mx-auto" />
                      <p className="text-4xl font-semibold text-center">
                        You're All Set!
                      </p>
                      <p className="text-sm  text-center">
                        Based on your information, we&apos;re creating a personalized health journey
                        just for you. 
                      </p>
                      <p className="text-sm  text-center">Let&apos;s get started on your path to wellness.</p>
                      <p className="text-lg font-semibold text-center">
                        <Button onClick={handleOnBoardingFinish}>Go to Dashboard</Button>
                      </p>
                      <img src="/images/all_set.png" alt="All Set" className="w-full my-auto" />
                    </div>
                  )}
                </div>
                </form>
                </Form>
                {/* Right pane as image */}
                {step < 3 && (
                  //  <img src="/images/onboarding.png" alt="All Set" className="w-full my-auto" />
                  <div className="bg-gradient-to-b from-[#0093D4] to-[#004C6E] h-100  items-center justify-center">  
                  <img src="/images/white-metabolic-point.svg" alt="metabolic-point-logo" style={{ width: '300px' }} className="mx-auto w-200 p-8" />
                  <Container />
                  </div>
                )}
              
            
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {step === 1 && (
            <Button onClick={handleNext} className="ml-auto">
              Next
            </Button>
          )}
          {step === 2 && (
            <>
              <Button variant="outline" onClick={handlePrevious}>
                Previous
              </Button>
              <Button onClick={handleSubmit} className='ml-auto' >
                Finish
              </Button>
            </>
          )}
          {/* {step === 3 && (
            <Button variant="outline" onClick={handleOnBoardingFinish}>
              Close
            </Button>
          )} */}
        </CardFooter>
      </Card>
    </div>
  )
}