'use client'

import * as React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CentralHealthScore } from '@/components/central-health-score';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import HealthJourneyCards from '@/components/HealthJourneyCards';
import { CurrentStats } from "@/components/current-stats";
import { ImportFile } from "@/components/import-file";


import Clarity from '@microsoft/clarity';
import ProductRecommendations from '@/components/ProductRecommendations';

import HealthExpertConsultation from "@/components/HealthExpertConsultation";
import { OnboardingFormComponent } from "@/components/onboarding-form";

import Layout from '@/components/app-layout';
import { AuthProvider } from '@/components/AuthContext';
import { HealthDataForm } from '@/components/health-data-form';



export default function Home() {
  const projectId = "q64g9fnhvi"

  Clarity.init(projectId);


  const [showDialog, setShowDialog] = React.useState(false); //shows upload dialog
  const [showSideDialog, setShowSideDialog] = React.useState(false); //shows upload dialog
  const [showOnboardingDialog, setShowOnboardingDialog] = React.useState(false);



  function HealthDataView() {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Update your data</CardTitle>
          <CardDescription> </CardDescription>
        </CardHeader>
        <CardContent>
          <HealthDataForm
            group="all"
            fetchLast="true"
            initialData={{
              name: "",
              email: "",
              dateOfBirth: "",
              gender: "",
              weight: 0,
              height: 0,
              waist: 0,
            }}
            onSuccess={() => console.log("success")}
          />
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    );
  }


  function FileUploadView() {
    return (
      <ImportFile onSuccess={(ocrData) => console.log(JSON.parse(ocrData))} />
    );
  }

  const handleOnBoardingFinish = () => {
    setShowOnboardingDialog(false);
  };



  return (

    <AuthProvider>

      <Layout>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 pb-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Current Health Score</CardTitle>
                <CardDescription>
                  <div className="grid grid-cols-3 gap-12 justify-between">
                    <div className="col-span-1">A snapshot of your overall wellness, updated in real-time.
                      The higher the score, the closer you are to optimal health!</div>

                    <div className="flex gap-4 justify-end col-span-2">
                      <Button className="p-3" disabled>
                        Connect Device
                      </Button>
                      <Button className="p-3" onClick={() => setShowDialog(true)}>
                        Import PDF
                      </Button>
                      <Button className="p-3">Export PDF</Button>
                      <Button
                        className="p-3"
                        onClick={() => setShowOnboardingDialog(true)}
                      >
                        Start Onboarding
                      </Button>
                    </div>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>

              </CardContent>
            </Card>
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogContent className="w-full">
                <DialogHeader>
                  <DialogTitle>Upload Health Document</DialogTitle>
                  <DialogDescription>
                    Upload your health-related documents securely
                  </DialogDescription>
                </DialogHeader>
                <FileUploadView />
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {/* Top Left: Health Score Meter */}

            <Card className="h-full">
              <CardContent className="p-0">
                {!showOnboardingDialog &&
                  !showDialog &&
                  !showSideDialog && <CentralHealthScore />}
              </CardContent>
            </Card>

            {/* Top Right: Update Health Data */}
            <Card>
              <CardHeader>
                {/* <CardTitle>Your Health Data</CardTitle>
									<CardDescription>
										Keep your health metrics current
									</CardDescription> */}
              </CardHeader>
              <CardContent>
                <div className="h-3/4 overflow-auto">
                  {!showOnboardingDialog &&
                    !showDialog &&
                    !showSideDialog && <CurrentStats />}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-12 gap-6 pt-6">
            {/* Bottom Left: Profile Edit */}
            <div className="col-span-5 gap-6 ">
              {!showOnboardingDialog && !showDialog && !showSideDialog && (
                <HealthJourneyCards filter='personal' />
              )}
            </div>

            <div className="col-span-7 gap-6 ">
              <div className="pb-6 ">
                {!showOnboardingDialog && !showDialog && !showSideDialog && (
                  <ProductRecommendations filter='personal' />
                )}
              </div>
              <div>
                {!showOnboardingDialog && !showDialog && !showSideDialog && (
                  <HealthExpertConsultation variant="default" />
                )}
              </div>
            </div>



            {/* Sidebar Content */}
            <Dialog open={showSideDialog} onOpenChange={setShowSideDialog}>
              <DialogContent className="w-full max-w-[800px] ">
                <div
                  id="renderContent"
                  className="max-h-[600px] overflow-auto"
                >
                  <HealthDataView />
                </div>
              </DialogContent>
            </Dialog>



            <Dialog
              open={showOnboardingDialog}
              onOpenChange={setShowOnboardingDialog}
            >
              <DialogContent className="w-3/4 max-w-0.95">
                <DialogHeader>
                  <DialogTitle></DialogTitle>
                  <DialogDescription></DialogDescription>
                </DialogHeader>
                <OnboardingFormComponent
                  handleOnBoardingFinish={handleOnBoardingFinish}
                />
              </DialogContent>
            </Dialog>


          </div>
          <div className="grid grid-cols-12 gap-6 pt-6">

            <div className="col-span-12 gap-6 ">
              <Button onClick={() => {
                setShowSideDialog(true);

              }}>Manually enter health data</Button>
            </div>
          </div>
        </div>
      </Layout>
    </AuthProvider >


  );
}