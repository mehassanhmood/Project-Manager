'use client'

import Task from '../app/components/Task'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./components/app-sidebar";

interface HomeProps {
  page_name?: string
}

export default function Home({ page_name = "Home" }: HomeProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        <Task
          pageName={page_name}
          title="Project Manager"
          showCreateForm={true}
          emptyMessage="No tasks found. Create your first task to get started!"
        />
      </main>
    </SidebarProvider>
  )
}