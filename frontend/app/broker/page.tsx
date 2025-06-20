"use client"

import Task from "../componentsCust/Task";
import { AppSidebar } from "../componentsCust/app-sidebar";
export default function Algorithms() {
  return (
    <AppSidebar 
    children = {
    <Task 
     pageName="Broker"
     title="Broker"
     showCreateForm = {true}
     emptyMessage="No tasks related to broker"
     className="max-w-4xl"
    />
    }
    />
  )
}