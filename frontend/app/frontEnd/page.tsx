"use client"

import Task from "../componentsCust/Task";
import { AppSidebar } from "../componentsCust/app-sidebar";
export default function Algorithms() {
  return (
    <AppSidebar 
    children = {
    <Task 
     pageName="Front End Design"
     title="Front End Design"
     showCreateForm = {true}
     emptyMessage="No tasks related to frontend"
     className="max-w-4xl"
    />
    }
    />
  )
}