'use client'

import { DashboardPage } from "@/components/app-dashboard-page";
import { AuthProvider } from '@/components/AuthContext';


export default function Home() {
  return (
    
        <main className="flex-1 overflow-y-auto">
           <AuthProvider>
             <DashboardPage />
           </AuthProvider>
           
           
              

           
             
           
          
          
        </main>
      
  );
}