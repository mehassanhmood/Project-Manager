"use client"

import Task from "../componentsCust/Task";
import { AppSidebar } from "../componentsCust/app-sidebar";
export default function Algorithms() {
  return (
    <AppSidebar 
    children = {
    <Task 
     pageName="Trader"
     title="Trader"
     showCreateForm = {true}
     emptyMessage="No tasks related to trader"
     className="max-w-4xl"
    />
    }
    />
  )
}