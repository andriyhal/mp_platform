'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from './ui/toaster'
import { useRouter } from 'next/navigation'

export function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    let isValid = true
    const newErrors = { password: '', confirmPassword: '' }

    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long'
      isValid = false
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if(process.env.NEXT_PUBLIC_DISABLE_SIGNUP == 'true'){
      
        toast({
          title: "Sign up is currently disabled",
          description: 'Failed to register user',
          variant: "destructive",
        })
        return
    }

    if (validateForm()) {
      console.log('Registering user:', formData)
      // Here you would typically send the data to your backend
      setIsSubmitting(true)
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT}/register-user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        

        if (response.status === 409) {
          throw new Error('User already exists')
        }

        

        if (!response.ok) {
          throw new Error('Failed to register user')
        }

        const json = await response.json();
        console.log('User registered successfully:', json);

        toast({
          title: "Registration Successful",
          description: "Your account has been created successfully.",
        })
        router.push('/') // Redirect to dashboard after successful submission
      } catch (error) {
        console.error('Error registering user:', error)
        toast({
          title: "Registration Error",
          description: error instanceof Error ? error.message : 'Failed to register user',
          variant: "destructive",
        })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="flex items-center justify-center ">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create your account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Sign Up'}</Button>
          <div className="text-sm text-center">
            Already have an account?{' '}
            <Link href="/" className="text-primary hover:underline">
              Log in
            </Link>
          </div>
        </CardFooter>
      </Card>
      <Toaster />
    </div>
  )
}