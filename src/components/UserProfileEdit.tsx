'use client'

import { useState, useEffect } from 'react'

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"


const formSchema = z.object({
  action: z.enum(["edit", "add"]),
  userId: z.string().min(1, "User ID is required"),
  sex: z.enum(["male", "female", "other"]),
  dateOfBirth: z.string().refine((date) => {
    const parsedDate = new Date(date)
    return !isNaN(parsedDate.getTime()) && parsedDate < new Date()
  }, {
    message: "Please enter a valid date of birth",
  }),
})

export function UserProfileEdit(props: { 
  action: "edit" | "add"; 
  onSuccess: (dateOfBirth: string, sex: string) => void; 
}) {
  //const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      action: props.action || "edit",
      userId: localStorage.getItem('userEmail') || "",
      sex: "other",
      dateOfBirth: "",
    },
  })

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const userEmail = localStorage.getItem('userEmail')
        const token = localStorage.getItem('token')
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT}/get-user-profile?userID=${userEmail}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch user profile')
        }

        const userData = await response.json()
        form.reset({
          ...userData,
          action: props.action || "edit",
          dateOfBirth: userData.dateOfBirth ? userData.dateOfBirth.split('T')[0] : '',
          sex: userData.sex ? userData.sex.toLowerCase() : 'other',
        })
      } catch (error) {
        console.error('Error fetching user profile:', error)
        toast({
          title: "Error",
          description: "Failed to load profile data. Please refresh the page.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (props.action === "edit") {
      fetchUserProfile()
    } else {
      setIsLoading(false)
    }
  }, [props.action, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT}/edit-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error('Failed to update user profile')
      }

      toast({
        title: "Success",
        description: "Your profile has been updated successfully.",
      })
      props.onSuccess(values.dateOfBirth, values.sex) // Pass the form values
      //router.push('/dashboard') // Redirect to dashboard after successful update
    } catch (error) {
      console.error('Error updating user profile:', error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            {/* <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User ID</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Your unique user identifier</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <FormField
              control={form.control}
              name="sex"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sex</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your sex" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Select your biological sex</FormDescription>
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
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>Your date of birth</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : props.action === 'add' ? 'Add Profile' : 'Save Profile'}
        </Button>
      </form>
      {/* <Toaster /> */}
    </Form>
  )
}