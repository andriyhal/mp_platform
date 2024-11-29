'use client'

import Link from 'next/link'
import LoginPage from './app-login-page'


export function LandPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">HealthTrack</div>
        <nav>
          <ul className="flex space-x-4">
            <li><Link href="#features" className="text-gray-600 hover:text-blue-600">Features</Link></li>
            <li><Link href="#pricing" className="text-gray-600 hover:text-blue-600">Pricing</Link></li>
            <li><Link href="#about" className="text-gray-600 hover:text-blue-600">About</Link></li>
          </ul>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 mb-8 lg:mb-0">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Track Your Health Journey with HealthTrack
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Join thousands of users who are taking control of their health. 
              Monitor your progress, set goals, and achieve your best self.
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-6">
              <li>Personalized health tracking</li>
              <li>Expert insights and recommendations</li>
              <li>Connect with a community of health enthusiasts</li>
            </ul>
          </div>

          <div className="lg:w-1/2 max-w-md">
            <LoginPage />
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600 mb-4 md:mb-0">
              © 2023 HealthTrack. All rights reserved.
            </div>
            <div className="flex space-x-4">
              <Link href="/privacy" className="text-gray-600 hover:text-blue-600">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-600 hover:text-blue-600">Terms of Service</Link>
              <Link href="/contact" className="text-gray-600 hover:text-blue-600">Contact Us</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}