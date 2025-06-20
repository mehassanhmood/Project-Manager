import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
{
  title: "Algorithms",
  url: "/algorithms", // or "/algorithm/[id]" if you want dynamic routing
  icon: Inbox,
},
  {
    title: "Machine Learning",
    url: "/machineLearning",
    icon: Calendar,
  },
  {
    title: "Broker",
    url: "/broker",
    icon: Search,
  },
  {
    title: "Backtestet",
    url: "/backtester",
    icon: Settings,
  },
  {
    title: "Log Manager",
    url: "/logManager",
    icon: Settings,
  },
  {
    title: "Docs",
    url: "/docs",
    icon: Settings,
  },
  {
    title: "Trader",
    url: "/trader",
    icon: Settings,
  },
  {
    title: "Risk",
    url: "/risk",
    icon: Settings,
  },
  {
    title: "Poertfolio Core",
    url: "/portfolioCore",
    icon: Settings,
  },
  {
    title: "Research Lab",
    url: "/researchLab",
    icon: Settings,
  },
  {
    title: "Front End",
    url: "/frontEnd",
    icon: Settings,
  },
]

interface MyComponent {
  children: React.ReactNode;
}

export function AppSidebar({children}: MyComponent) {
  return (
    <SidebarProvider>
{/* the app side bar starts from here */}
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Categories</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarTrigger />
      <main>
            {children}
      </main>

    </SidebarProvider>
    
  )
}