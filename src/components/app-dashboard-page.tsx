"use client";

import * as React from "react";
import {
	User,
	BarChart2,
	FileUp,
	Menu,
	Medal,
	Mail,
	FileText,
	Lock,
	ChartLine,
	HomeIcon,
	ShoppingCartIcon,
	HeartPulseIcon,
	Code2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Sidebar,
	SidebarContent,
	SidebarTrigger,
	SidebarHeader,
	SidebarFooter,
	SidebarProvider,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
} from "@/components/ui/sidebar";
import { OnboardingFormComponent } from "./onboarding-form";
import { HealthDataForm } from "./health-data-form";

import { UserProfileEdit } from "./UserProfileEdit";
import "react-circular-progressbar/dist/styles.css";
import { HealthScore } from "./health-score";
import Image from "next/image";
import { CurrentStats } from "./current-stats";
import { ImportFile } from "./import-file";
import { UserDataFiles } from "./user-data-files";
import { useAuth } from "@/components/AuthContext";
import { useEffect } from "react";
import Link from "next/link";

import HealthJourneyCards from "./HealthJourneyCards";
import ProductRecommendations from "./ProductRecommendations";
import HealthExpertConsultation from "./HealthExpertConsultation";
import { Toaster } from "./ui/toaster";
import Container from "./Container";

export function DashboardPage() {
	const { user, token, loading, logout } = useAuth();
	const router = useRouter();

	const [activeView, setActiveView] = React.useState("");

	const [showDialog, setShowDialog] = React.useState(false); //shows upload dialog
	const [showSideDialog, setShowSideDialog] = React.useState(false); //shows upload dialog
	const [showOnboardingDialog, setShowOnboardingDialog] = React.useState(false);

	const menuItems = [
		{ id: "dashboard", label: "Dashboard", icon: HomeIcon },
		{ id: "journey", label: "My Health Journey", icon: BarChart2 },
		{ id: "network", label: "Provider Network", icon: HeartPulseIcon },
		{ id: "marketplace", label: "Marketplace", icon: ShoppingCartIcon },
		{ id: "orders", label: "My Orders", icon: FileText },

		{ id: "profile", label: "View Profile", icon: User },
		{ id: "notifications", label: "Notifications", icon: Mail },
		{ id: "security", label: "Password and Security", icon: Lock },
		{ id: "documents", label: "My Documents", icon: FileText },
		{ id: "healthData", label: "Submit Health Data", icon: BarChart2 },

		// //Below is test links
		// { id: 'break', label: '-----------', icon: Code2Icon },

		// { id: 'uploadFile', label: 'Upload File', icon: FileUp },
		// // { id: 'onboarding', label: 'Onboarding', icon: Clipboard },
		// { id: 'healthScore', label: 'Health Score', icon: Medal },
		// { id: 'currentStats', label: 'Current Health Data', icon: ChartLine  },
	];

	useEffect(() => {
		console.log("debug", user, token, loading);
		// If no token or user, redirect to the login page
		if (!token) {
			//router.push('/');
			//console.log('debug2', user, token, loading)
		} else {
			//console.log('debug3', user,token, loading)
		}
	}, [token]);

	// Add new effect to check for health data

	if (loading) {
		return <p>Loading user...</p>;
	}

	if (token == "missing") {
		router.push("/");
	}

	if (token == undefined) {
		return (
			<div className="flex flex-col items-center justify-center p-4 bg-white shadow rounded-lg">
				<p className="text-lg font-semibold text-gray-800 mb-2">
					Your session has expired ...
					<Link
						href="/"
						className="text-primary hover:underline text-lg font-semibold pl"
					>
						please login to continue
					</Link>
				</p>
			</div>
		);
	}

	const handleOnBoardingFinish = () => {
		setShowOnboardingDialog(false);
	};

	const renderContent = () => {
		switch (activeView) {
			case "profile":
				return <ProfileView />;
			case "healthData":
				return <HealthDataView />;
			case "healthScore":
				return <HealthScoreView />;
			case "currentStats":
				return <CurrentStats />;
			case "uploadFile":
				return <FileUploadView />;
			case "journey":
				return <HealthJourneyCards />;
			case "network":
				return <HealthExpertConsultation />;
			case "marketplace":
				return <ProductRecommendations />;
			case "orders":
				return <p>Not yet implemented</p>;
			case "notifications":
				return <p>Not yet implemented</p>;
			case "security":
				return <p>Not yet implemented</p>;

			case "documents":
				return (
					<Card>
						<CardHeader>
							<CardTitle>Uploaded Files</CardTitle>
							<CardDescription>See your health files</CardDescription>
						</CardHeader>
						<CardContent>
							<UserDataFiles UserID={user ? user.id : "User"} />
						</CardContent>
					</Card>
				);
			default:
				return <> </>;
		}
	};

	return (
		<SidebarProvider>
			<div className="flex h-screen bg-gray-100">
				<Sidebar>
					<SidebarHeader>
						<div className="p-4 flex items-center gap-2">
							<Image
								src="/images/logo - white.svg"
								alt="Metabolic-Point Logo"
								width={24}
								height={24}
							/>
							{/* <h2 className="text-md font-bold">METABOLIC-POINT</h2> */}
						</div>
					</SidebarHeader>
					<SidebarContent>
						<SidebarMenu>
							{menuItems.map((item) => (
								<SidebarMenuItem key={item.id}>
									<SidebarMenuButton
										onClick={() => {
											setActiveView(item.id);
											if (item.id != "dashboard") {
												setShowSideDialog(true);
											}
											const renderContentDiv =
												document.getElementById("renderContent");
											if (renderContentDiv && item.id != "dashboard") {

												renderContentDiv.scrollIntoView({
													behavior: "smooth",
													block: "center",
													inline: "center",
												});
											}
										}}
										isActive={activeView === item.id}
									>
										<item.icon className="mr-2 h-4 w-4" />
										<span>{item.label}</span>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarContent>
					<SidebarFooter>
						<div className="p-4">
							<Button variant="outline" className="w-full text-blue-500" onClick={logout}>
								Log Out
							</Button>
						</div>
					</SidebarFooter>
				</Sidebar>
				<div className="flex-1 overflow-auto">
					<header className="bg-white shadow">
						<div className="flex items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
							<h1 className="text-3xl font-bold text-gray-900">
								Dashboard for {user ? user.name : "User"}
							</h1>
							<SidebarTrigger>
								<Button variant="outline" size="icon" className="lg:hidden">
									<Menu className="h-6 w-6" />
									<span className="sr-only">Toggle Sidebar</span>
								</Button>
							</SidebarTrigger>
						</div>
					</header>
					<main className="p-6">
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

							<Card>
								<CardHeader>
									<CardTitle>Central Health Score</CardTitle>
									<CardDescription>
										{/* Current health assessment for {user ? user.name : "User"} */}
									</CardDescription>
								</CardHeader>
								<CardContent className="flex justify-center p-6">
									<div>
										<div>
											{!showOnboardingDialog &&
												!showDialog &&
												!showSideDialog && <HealthScore />}
										</div>


									</div>
								</CardContent>
							</Card>

							{/* Top Right: Update Health Data */}
							<Card>
								<CardHeader>
									<CardTitle>Your Health Data</CardTitle>
									<CardDescription>
										Keep your health metrics current
									</CardDescription>
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
									<HealthJourneyCards />
								)}
							</div>

							<div className="col-span-7 gap-6 ">
								<div className="pb-6 ">
									{!showOnboardingDialog && !showDialog && !showSideDialog && (
										<ProductRecommendations />
									)}
								</div>
								<div>
									{!showOnboardingDialog && !showDialog && !showSideDialog && (
										<HealthExpertConsultation variant="default" />
									)}
								</div>
							</div>

							<div className="col-span-12 gap-6 ">

								{!showOnboardingDialog && !showDialog && !showSideDialog && (
									<Card>
										<CardHeader>
											<CardTitle>Uploaded Files</CardTitle>
											<CardDescription>See your health files</CardDescription>
										</CardHeader>
										<CardContent>
											<UserDataFiles UserID={user ? user.id : "User"} />
										</CardContent>
									</Card>
								)}
							</div>

							{/* Sidebar Content */}
							<Dialog open={showSideDialog} onOpenChange={setShowSideDialog}>
								<DialogContent className="w-full max-w-[800px] ">
									<div
										id="renderContent"
										className="max-h-[600px] overflow-auto"
									>
										{renderContent()}
									</div>
								</DialogContent>
							</Dialog>

							{/* <Card>
							<CardHeader>
							<CardTitle>Health Data History</CardTitle>
							<CardDescription>See your health history</CardDescription>
							</CardHeader>
							<CardContent>
							<HealthDataChart />
							</CardContent>
							</Card> */}

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

							<Toaster />
						</div>
					</main>
				</div>
			</div>
		</SidebarProvider>
	);
}

function ProfileView() {
	return (
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
	);
}

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

function HealthScoreView() {
	const { user } = useAuth();
	return (
		<Card>
			<CardHeader>
				<CardTitle>Your Health Score</CardTitle>
				<CardDescription>
					Current health score for {user?.name || "User"}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<HealthScore />
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
