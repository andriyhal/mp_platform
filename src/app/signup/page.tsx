import { SignUpPage } from "@/components/app-signup-page";
import Image from 'next/image'

import Container from '@/components/Container';

export default function Home() {
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
          <SignUpPage />
          </div>
          <div className="bg-gradient-to-b from-[#0093D4] to-[#004C6E] h-screen flex items-center justify-center">  
          <Container />
          </div>
        </div>
      </main>

   
    </div>

  
      
  );
}