import * as React from "react";
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
import Image from "next/image";
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
  Bell,
} from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { AuthProvider } from '@/components/AuthContext';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";

export default function Layout({ children }: { children: React.ReactNode }) {


  const { user, token, loading, logout, validateToken } = useAuth();


  const router = useRouter();

  useEffect(() => {
    const validateSession = async () => {
      const localStorageToken = localStorage.getItem('token');
      if (!localStorageToken || localStorageToken === "missing") {
        router.push("/");
      } else {
        try {

          await validateToken();
        } catch (error) {
          router.push("/");
        }
      }
    };

    validateSession();
  }, []);


  const [activeView, setActiveView] = React.useState("");

  useEffect(() => {
    const currentPath = window.location.pathname;
    const viewMap = {
      '/dash/': 'dashboard',
      '/journey/': 'journey',
      '/network/': 'network',
      '/market/': 'marketplace',
      '/todo/': '',
      '/profile/': 'profile',
      '/documents/': 'documents',
    } as const;

    const activeView = viewMap[currentPath as keyof typeof viewMap];
    if (activeView) {
      setActiveView(activeView);
    }
  }, []);


  const menuItems = [
    { id: "dashboard", link: "dash", label: "Dashboard", icon: HomeIcon },
    { id: "journey", link: "journey", label: "My Health Journey", icon: BarChart2 },
    { id: "network", link: "network", label: "Provider Network", icon: HeartPulseIcon },
    { id: "marketplace", link: "market", label: "Marketplace", icon: ShoppingCartIcon },
    { id: "orders", link: "todo", label: "My Orders", icon: FileText },

    { id: "profile", link: "profile", label: "View Profile", icon: User },
    { id: "notifications", link: "todo", label: "Notifications", icon: Mail },
    { id: "security", link: "todo", label: "Password and Security", icon: Lock },
    { id: "documents", link: "documents", label: "My Documents", icon: FileText },
    // { id: "healthData", link: "dash", label: "Submit Health Data", icon: BarChart2 },

    // //Below is test links
    // { id: 'break', label: '-----------', icon: Code2Icon },

    // { id: 'uploadFile', label: 'Upload File', icon: FileUp },
    // // { id: 'onboarding', label: 'Onboarding', icon: Clipboard },
    // { id: 'healthScore', label: 'Health Score', icon: Medal },
    // { id: 'currentStats', label: 'Current Health Data', icon: ChartLine  },
  ];


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
                      window.location.href = `/${item.link}`
                    }
                    }
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
              <Button
                variant="outline"
                className="w-full text-blue-500"
                onClick={(e) => {
                  e.preventDefault();
                  console.log('logout')
                  logout();
                }}
              >
                Log Out
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 overflow-auto">
          <header className="bg-white shadow">
            <div className="flex items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold text-gray-900">
                {/* {user} */}
              </h1>

              <div className="flex items-center gap-4">
                <div className="relative group">
                  <Bell className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700" />
                  {/* <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    2
                  </span> */}
                </div>

                <div className="relative group">
                  <User className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700" />
                  <span className="absolute hidden group-hover:block right-0 -bottom-8 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50">
                    {user?.name || 'User'}
                  </span>
                </div>

                <SidebarTrigger>
                  <Button variant="outline" size="icon" className="lg:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Sidebar</span>
                  </Button>
                </SidebarTrigger>
              </div>
            </div>
          </header>
          <main className=" ">
            {children}
          </main>
        </div>
      </div>
      <Toaster />
    </SidebarProvider>


  );
}