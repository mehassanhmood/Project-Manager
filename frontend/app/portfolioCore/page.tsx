"use client"

import Task from "../componentsCust/Task";
import { AppSidebar } from "../componentsCust/app-sidebar";
export default function Algorithms() {
  return (
    <AppSidebar 
    children = {
    <Task 
     pageName="Portfolio Core"
     title="Portfolio Core"
     showCreateForm = {true}
     emptyMessage="No tasks related to portfolio core"
     className="max-w-4xl"
    />
    }
    />
  )
}