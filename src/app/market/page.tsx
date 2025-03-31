'use client'


import Clarity from '@microsoft/clarity';
import ProductRecommendations from '@/components/ProductRecommendations';

import Layout from '@/components/app-layout';
import FilterSidebar from "@/components/market-filter";
import { AuthProvider } from '@/components/AuthContext';


export default function Home() {
  const projectId = "q64g9fnhvi"

  Clarity.init(projectId);

  return (

    <AuthProvider>


      <Layout>
        <div className="grid grid-cols-12 gap-6 p-6">
          <div className='col-span-2 '>

            <FilterSidebar />


          </div>
          <div className="col-span-10">
            <ProductRecommendations filter='all' />
          </div>
        </div>


      </Layout>

    </AuthProvider>

  );
}