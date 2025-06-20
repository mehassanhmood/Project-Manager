"use client"

import Task from "../componentsCust/Task";
import { AppSidebar } from "../componentsCust/app-sidebar";
export default function Algorithms() {
  return (
    <AppSidebar 
    children = {
    <Task 
     pageName="Risk"
     title="Risk"
     showCreateForm = {true}
     emptyMessage="No tasks related to risk"
     className="max-w-4xl"
    />
    }
    />
  )
}