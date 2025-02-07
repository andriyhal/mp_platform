'use client'

import { DashboardPage } from "@/components/app-dashboard-page";
import { AuthProvider } from '@/components/AuthContext';
import Clarity from '@microsoft/clarity';

export default function Home() {
  const projectId = "q64g9fnhvi"

  Clarity.init(projectId);

  return (
    
        <main className="flex-1 overflow-y-auto">
           <AuthProvider>
             <DashboardPage />
           </AuthProvider>
           
           
              

           
             
           
          
          
        </main>
      
  );
}