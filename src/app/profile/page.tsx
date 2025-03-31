'use client'


import Clarity from '@microsoft/clarity';

import { AuthProvider } from '@/components/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Layout from '@/components/app-layout';
import { UserProfileEdit } from "@/components/UserProfileEdit";


export default function Home() {
  const projectId = "q64g9fnhvi"

  Clarity.init(projectId);

  return (

    <AuthProvider>

      <Layout>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 pb-6 w-full">
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>
                  View and edit your personal information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserProfileEdit
                  action="edit"
                  onSuccess={() => console.log("success")}
                />
              </CardContent>
            </Card>
          </div>
        </div>

      </Layout>
    </AuthProvider >


  );
}