'use client'


import Clarity from '@microsoft/clarity';
import ProductRecommendations from '@/components/ProductRecommendations';
import {

  SidebarProvider,

} from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Layout from '@/components/app-layout';
import FilterSidebar from "@/components/market-filter";


export default function Home() {
  const projectId = "q64g9fnhvi"

  Clarity.init(projectId);

  return (

    <SidebarProvider>

      <Layout>

        <h1>Feature not implemented</h1>

      </Layout>
    </SidebarProvider >


  );
}