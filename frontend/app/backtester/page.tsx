"use client"

import Task from "../componentsCust/Task";
import { AppSidebar } from "../componentsCust/app-sidebar";
export default function Algorithms() {
  return (
    <AppSidebar 
    children = {
    <Task 
     pageName="Backtester"
     title="Backtester"
     showCreateForm = {true}
     emptyMessage="No tasks related to backtester"
     className="max-w-4xl"
    />
    }
    />
  )
}