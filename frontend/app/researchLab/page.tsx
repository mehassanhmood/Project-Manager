"use client"

import Task from "../componentsCust/Task";
import { AppSidebar } from "../componentsCust/app-sidebar";
export default function Algorithms() {
  return (
    <AppSidebar 
    children = {
    <Task 
     pageName="Research Lab"
     title="Research Lab"
     showCreateForm = {true}
     emptyMessage="No tasks related to Research Lab"
     className="max-w-4xl"
    />
    }
    />
  )
}