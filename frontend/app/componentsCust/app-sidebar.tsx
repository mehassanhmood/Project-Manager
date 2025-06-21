"use client"

import { Calendar, Home, Inbox, Search, Settings, BarChart3, FileText, TrendingUp, Shield, Briefcase, FlaskConical, Monitor, Menu } from "lucide-react"
import { useState } from "react"

// Menu items with better organization and icons
const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    category: "main"
  },
  {
    title: "Algorithms",
    url: "/algorithms",
    icon: BarChart3,
    category: "trading"
  },
  {
    title: "Machine Learning",
    url: "/machineLearning",
    icon: TrendingUp,
    category: "trading"
  },
  {
    title: "Broker",
    url: "/broker",
    icon: Briefcase,
    category: "trading"
  },
  {
    title: "Backtester",
    url: "/backtester",
    icon: Search,
    category: "trading"
  },
  {
    title: "Trader",
    url: "/trader",
    icon: Monitor,
    category: "trading"
  },
  {
    title: "Risk",
    url: "/risk",
    icon: Shield,
    category: "management"
  },
  {
    title: "Portfolio Core",
    url: "/portfolioCore",
    icon: BarChart3,
    category: "management"
  },
  {
    title: "Research Lab",
    url: "/researchLab",
    icon: FlaskConical,
    category: "research"
  },
  {
    title: "Log Manager",
    url: "/logManager",
    icon: FileText,
    category: "management"
  },
  {
    title: "Docs",
    url: "/docs",
    icon: FileText,
    category: "management"
  },
  {
    title: "Front End",
    url: "/frontEnd",
    icon: Settings,
    category: "development"
  },
]

// Group items by category
const groupedItems = items.reduce((acc, item) => {
  if (!acc[item.category]) {
    acc[item.category] = []
  }
  acc[item.category].push(item)
  return acc
}, {} as Record<string, typeof items>)

const categoryLabels = {
  main: "Main",
  trading: "Trading",
  management: "Management", 
  research: "Research",
  development: "Development"
}

interface MyComponent {
  children: React.ReactNode;
}

export function AppSidebar({children}: MyComponent) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-white">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo/Brand Section */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-foreground">Buraq Manager</h2>
        </div>
        
        {/* Navigation Groups */}
        <div className="overflow-y-auto h-full">
          {Object.entries(groupedItems).map(([category, categoryItems]) => (
            <div key={category} className="py-2">
              <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                {categoryLabels[category as keyof typeof categoryLabels]}
              </div>
              <div className="space-y-1">
                {categoryItems.map((item) => (
                  <a
                    key={item.title}
                    href={item.url}
                    className="flex items-center space-x-3 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-white border border-gray-200 rounded-md md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
}