'use client'

import Link from 'next/link'
import LoginPage from './app-login-page'
import Image from 'next/image'
import { AuthProvider } from '@/components/AuthContext';
import Container from './Container';


export function LandPage() {
  return (
    <div className="min-h-screen ">
      

      <main className="  ">
        
        <div className="grid grid-cols-2 ">
        
          

          <div className=" bg-transparent">
          <Image 
            src="/images/Metabolic-Point-with-slogan.svg"
            alt="METABOLIC-POINT Logo"
            width={320}
            height={320}
            className="mx-auto p-6"
            
          />
          <AuthProvider>
            <LoginPage />
          </AuthProvider>
          </div>
          <div className="bg-gradient-to-b from-[#0093D4] to-[#004C6E] h-screen flex items-center justify-center">  
          <Container />
          </div>
        </div>
      </main>

   
    </div>
  )
}