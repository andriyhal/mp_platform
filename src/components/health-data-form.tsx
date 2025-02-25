'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
 
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"



const formSchema = z.object({
  UserID: z.string(),
  height: z.number().min(50).max(300),
  weight: z.number().min(20).max(500),
  waistCircumference: z.number().min(20).max(200),
  bloodPressureSystolic: z.number().min(70).max(250),
  bloodPressureDiastolic: z.number().min(40).max(150),
  fastingBloodGlucose: z.number().min(50).max(500),
  hdlCholesterol: z.number().min(20).max(100),
  triglycerides: z.number().min(50).max(1000),
  // vitaminD2: z.number().min(0).max(200),
  // vitaminD3: z.number().min(0).max(200),
})



export function HealthDataForm(props: { group: "all" | "basic", fetchLast: 'true' | 'false',  onSuccess: () => void ,  initialData: { name: string, email: string, dateOfBirth: string, gender: string, weight: number, height: number, waist: number }}) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdateDate, setLastUpdateDate] = useState<string | null>(null)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      UserID: localStorage.getItem('userEmail') || 'test',
      height: props.initialData.height,
      weight: props.initialData.weight,
      waistCircumference: props.initialData.waist,
      bloodPressureSystolic: 120,
      bloodPressureDiastolic: 80,
      fastingBloodGlucose: 100,
      hdlCholesterol: 50,
      triglycerides: 150,
      // vitaminD2: 50,
      // vitaminD3: 50,
    },
  })

  if(props.fetchLast == 'true'){  //only get data if
  
  useEffect(() => {
    const fetchLatestHealthData = async () => {
      try {
        const userId = localStorage.getItem('userEmail') || 'test'
        const token = localStorage.getItem('token')
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT}/get-health-data?userId=${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch health data')
        }

        const data = await response.json()
        if (data.lastUpdate) {
          setLastUpdateDate(data.lastUpdate)
          setIsLoading(false)
          form.reset({
            UserID: userId,
            height: Number(data.height) ?? 170,
            weight: Number(data.weight) ?? 70,
            waistCircumference: Number(data.waistCircumference) ?? 32,
            bloodPressureSystolic: Number(data.bloodPressureSystolic) ?? 120,
            bloodPressureDiastolic: Number(data.bloodPressureDiastolic) ?? 80,
            fastingBloodGlucose: Number(data.fastingBloodGlucose) ?? 100,
            hdlCholesterol: Number(data.hdlCholesterol) ?? 50,
            triglycerides: Number(data.triglycerides) ?? 150,
            // vitaminD2: Number(data.vitaminD2) ?? 50,
            // vitaminD3: Number(data.vitaminD3) ?? 50,
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

    fetchLatestHealthData()
  }, [])

  }else{ // get estimated/average values
    useEffect(() => {
    const fetchEstimateHealthData = async () => {
      try {
        const userId = localStorage.getItem('userEmail') || 'test'
        const age =  calculateAge(props.initialData.dateOfBirth);
        //console.log(props)
        const token = localStorage.getItem('token')
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT}/average-health-metrics?age=${age}&sex=${props.initialData.gender}&weight=${props.initialData.weight}` , {
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
            height: Number(props.initialData.height) ?? 170,
            weight: Number(props.initialData.weight) ?? 70,
            waistCircumference: Number(props.initialData.waist) ?? 32,
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

    fetchEstimateHealthData()
  }, [])



  }

  let fieldStyles = {
            
    height: '',
    weight: '',
    waistCircumference:     '',
    bloodPressureSystolic:  props.fetchLast === 'true' ? 'white' : 'cyan',
    bloodPressureDiastolic: props.fetchLast === 'true' ? 'white' : 'cyan',
    fastingBloodGlucose:    props.fetchLast === 'true' ? 'white' : 'cyan',
    hdlCholesterol:         props.fetchLast === 'true' ? 'white' : 'cyan',
    triglycerides:          props.fetchLast === 'true' ? 'white' : 'cyan',
    vitaminD2:              props.fetchLast === 'true' ? 'white' : 'cyan',
    vitaminD3:              props.fetchLast === 'true' ? 'white' : 'cyan',
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT}/submit-health-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error('Failed to submit health data')
      }

      const json = await response.json();
      console.log(json);

      toast({
        title: "Success",
        description: "Your health data has been submitted successfully.",
      })
      props.onSuccess() //trigger next step if onBoarding
      router.push('/dashboard') // Redirect to dashboard after successful submission
    } catch (error) {
      console.error('Error submitting health data:', error)
      toast({
        title: "Error",
        description: "Failed to submit health data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    
    <Form {...form} >
      {isLoading && <p>Loading...</p>}
      {lastUpdateDate && (
        <p className="text-sm text-muted-foreground mb-4">
          Last updated: {lastUpdateDate}
        </p>
      )}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
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
                <FormLabel>Waist Circumference (inches)</FormLabel>
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
        />
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
        
        
         

        {props.group === 'all' && (
          //add form fields here that are not part of group
          <>
           {/* <FormField
            control={form.control}
            name="vitaminD2"
            render={({ field }) => (
              <FormItem>
                <div className='grid grid-cols-2 items-center'>
                  <FormLabel>25-Hydroxy Vitamin D2 (nmol/L)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field}  
                  style={{ backgroundColor: fieldStyles.vitaminD2 || 'white' }}
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
            name="vitaminD3"
            render={({ field }) => (
              <FormItem>
                <div className='grid grid-cols-2 items-center'>
                  <FormLabel>25-Hydroxy Vitamin D3 (nmol/L)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field}  
                  style={{ backgroundColor: fieldStyles.vitaminD3 || 'white' }}
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
          </>
        )}
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Health Data'}
        </Button>

        
      </form>
      
      {/* <Toaster /> */}
    </Form>
  )
}