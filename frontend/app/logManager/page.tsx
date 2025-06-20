"use client"

import Task from "../componentsCust/Task";
import { AppSidebar } from "../componentsCust/app-sidebar";
export default function Algorithms() {
  return (
    <AppSidebar 
    children = {
    <Task 
     pageName="Log Manager"
     title="Log Manager"
     showCreateForm = {true}
     emptyMessage="No tasks related to log manager"
     className="max-w-4xl"
    />
    }
    />
  )
}