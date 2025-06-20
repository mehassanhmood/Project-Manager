"use client"

import Task from "../componentsCust/Task";
import { AppSidebar } from "../componentsCust/app-sidebar";
export default function Algorithms() {
  return (
    <AppSidebar 
    children = {
    <Task 
     pageName="Algorithms"
     title="Alagorithms"
     showCreateForm = {true}
     emptyMessage="No tasks related to algorithms"
     className="max-w-4xl"
    />
    }
    />
  )
}