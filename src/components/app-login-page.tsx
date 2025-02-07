'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from '@/components/AuthContext';


export default function LoginPage() {
 
 

  const [email, setEmail] = useState(process.env.NEXT_PUBLIC_LOGIN_AUTOCOMPLETE_USER ?? '')
  const [password, setPassword] = useState(process.env.NEXT_PUBLIC_LOGIN_AUTOCOMPLETE_PASSWORD ?? '')
 
  const [spinner, setSpinner] = useState(false)
  const [error, setError] = useState('')

  const { login } = useAuth();



  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setSpinner(true)
    setError('')
    try {
      // Store email in localStorage
      localStorage.setItem('userEmail', email )
      // Here you would typically validate the credentials
     
      await login({ email: email, password: password })
      // console.log(failLogin)
      // if(failLogin){
      //   setError('Invalid email or password. Please try again.')
      // }
      
      
    } catch (error) {
      setSpinner(false)
      
      setError(error instanceof Error ? error.message : 'Invalid email or password. Please try again.')
      
    }
  }

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Log In</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="m@example.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </form>
          <div className="text-sm text-right space-y-2 pt-4">
            <Link href="/forgot-password" className="text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full" onClick={handleLogin} disabled={spinner}>
            {spinner ? 'Loading ...' : 'Log In'}
          </Button>
          {/* {error && <div className="text-red-500">{error}</div>} */}
          <div className="text-red-500">{error}</div>
          <Button variant="outline" className="w-full mt-2 flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
              <path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"/>
              <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
              <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
            </svg>
            Sign in with Google
          </Button>
          
          <div className="text-sm text-center space-y-2">
            
            <div>
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}