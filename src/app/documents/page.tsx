'use client'

import * as React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"


import { UserDataFiles } from "@/components/user-data-files";


import Clarity from '@microsoft/clarity';


import Layout from '@/components/app-layout';
import { AuthProvider } from '@/components/AuthContext';
import { useAuth } from "@/components/AuthContext";




export default function Home() {
  const projectId = "q64g9fnhvi"

  Clarity.init(projectId);

  const { user, token, loading, logout, validateToken } = useAuth();



  return (

    <AuthProvider>

      <Layout>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 pb-6">

            <div className="col-span-12 gap-6 ">


              <Card>
                <CardHeader>
                  <CardTitle>Uploaded Files</CardTitle>
                  <CardDescription>See your health files</CardDescription>
                </CardHeader>
                <CardContent>
                  <UserDataFiles />
                </CardContent>
              </Card>

            </div>


          </div>
        </div>

      </Layout>
    </AuthProvider >


  );
}