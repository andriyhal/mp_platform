'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from './ui/toaster'

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
  vitaminD2: z.number().min(0).max(200),
  vitaminD3: z.number().min(0).max(200),
})

export function HealthDataForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      UserID: 'test',
      height: 170,
      weight: 70,
      waistCircumference: 32,
      bloodPressureSystolic: 120,
      bloodPressureDiastolic: 80,
      fastingBloodGlucose: 100,
      hdlCholesterol: 50,
      triglycerides: 150,
      vitaminD2: 50,
      vitaminD3: 50,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT}/submit-health-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="height"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Height (cm)</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Weight (kg)</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="waistCircumference"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Waist Circumference (inches)</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bloodPressureSystolic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Blood Pressure (Systolic)</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bloodPressureDiastolic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Blood Pressure (Diastolic)</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fastingBloodGlucose"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fasting Blood Glucose (mg/dL)</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hdlCholesterol"
          render={({ field }) => (
            <FormItem>
              <FormLabel>HDL Cholesterol (mg/dL)</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="triglycerides"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Triglycerides (mg/dL)</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="vitaminD2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>25-Hydroxyvitamin D2 (nmol/L)</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="vitaminD3"
          render={({ field }) => (
            <FormItem>
              <FormLabel>25-Hydroxyvitamin D3 (nmol/L)</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Health Data'}
        </Button>

        
      </form>
      
      <Toaster />
    </Form>
  )
}