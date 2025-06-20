'use client'

import Task from './componentsCust/Task'
import { AppSidebar } from "./componentsCust/app-sidebar";

interface HomeProps {
  page_name?: string
}

export default function Home({ page_name = "Home" }: HomeProps) {
  return (
    
    <AppSidebar children =  

          {<Task
            pageName={page_name}
            title="Project Manager"
            showCreateForm={true}
            emptyMessage="No tasks found. Create your first task to get started!"
          />}
          />
     

    
  )
}