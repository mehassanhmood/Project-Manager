"use client"

import Task from "../componentsCust/Task";
import { AppSidebar } from "../componentsCust/app-sidebar";
export default function Algorithms() {
  return (
    <AppSidebar 
    children = {
    <Task 
     pageName="Documentation"
     title="Documentation"
     showCreateForm = {true}
     emptyMessage="No tasks related to documentation"
     className="max-w-4xl"
    />
    }
    />
  )
}